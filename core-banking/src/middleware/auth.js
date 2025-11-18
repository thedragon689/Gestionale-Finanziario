const { supabase, authenticateUser: supabaseAuthenticateUser, requireRole: supabaseRequireRole } = require('../config/supabase');
const { logger } = require('../utils/logger');

/**
 * Middleware di autenticazione Supabase
 * Sostituisce il vecchio middleware JWT
 * 
 * @deprecated Usare authenticateUser da config/supabase.js
 * Mantenuto per compatibilità con codice esistente
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('🔒 Tentativo di accesso senza token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      
      return res.status(401).json({
        success: false,
        error: 'Token di accesso richiesto'
      });
    }

    // Verifica il token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('🔒 Token non valido', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        error: error?.message
      });
      
      return res.status(403).json({
        success: false,
        error: 'Token non valido o scaduto'
      });
    }

    req.user = user;
    logger.info('✅ Autenticazione riuscita', {
      userId: user.id,
      email: user.email,
      path: req.path
    });
    
    next();
  } catch (error) {
    logger.error('❌ Errore nel middleware di autenticazione:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server'
    });
  }
};

/**
 * Middleware per verificare i ruoli utente
 * NOTA: Con Supabase, i ruoli sono gestiti principalmente tramite RLS policies nel database
 * Questo middleware è utile per controlli aggiuntivi a livello API
 * 
 * @deprecated I ruoli dovrebbero essere gestiti tramite RLS policies
 * Mantenuto per compatibilità con codice esistente
 */
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Utente non autenticato'
        });
      }

      // Controlla il ruolo dall'user metadata o da una tabella user_roles
      const userRole = req.user.user_metadata?.role || req.user.role;
      
      if (!roles.includes(userRole)) {
        logger.warn('🚫 Accesso negato per ruolo insufficiente', {
          userId: req.user.id,
          userRole,
          requiredRoles: roles,
          path: req.path
        });
        
        return res.status(403).json({
          success: false,
          error: 'Ruolo insufficiente per accedere a questa risorsa'
        });
      }

      logger.info('✅ Controllo ruolo superato', {
        userId: req.user.id,
        userRole,
        path: req.path
      });
      
      next();
    } catch (error) {
      logger.error('❌ Errore nel controllo ruolo:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  };
};

/**
 * Middleware per verificare la proprietà della risorsa
 * NOTA: Con Supabase, questo dovrebbe essere gestito tramite RLS policies
 * Questo middleware è mantenuto per compatibilità ma si consiglia di usare RLS
 * 
 * @deprecated Usare RLS policies nel database invece di questo middleware
 */
const requireOwnership = (resourceModel, resourceIdField = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Utente non autenticato'
        });
      }

      const resourceId = req.params[resourceIdField];
      
      // Query tramite Supabase con RLS automatico
      const { data: resource, error } = await supabase
        .from(resourceModel.name || resourceModel)
        .select('*')
        .eq('id', resourceId)
        .eq('user_id', req.user.id)
        .single();

      if (error || !resource) {
        // Se non trovato, potrebbe essere perché non è dell'utente (RLS blocca)
        logger.warn('🚫 Tentativo di accesso a risorsa non propria', {
          userId: req.user.id,
          resourceId,
          path: req.path
        });
        
        return res.status(403).json({
          success: false,
          error: 'Accesso negato: risorsa non propria'
        });
      }

      // Admin può accedere a tutto (verificare tramite RLS o metadata)
      if (req.user.user_metadata?.role === 'admin') {
        return next();
      }

      logger.info('✅ Controllo proprietà superato', {
        userId: req.user.id,
        resourceId,
        path: req.path
      });
      
      next();
    } catch (error) {
      logger.error('❌ Errore nel controllo proprietà:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  };
};

/**
 * Middleware per logging delle richieste
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  logger.info('📡 Richiesta ricevuta', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Log della risposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('📡 Risposta inviata', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    });
  });

  next();
};

/**
 * Middleware per gestione errori
 */
const errorHandler = (err, req, res, next) => {
  logger.error('❌ Errore non gestito:', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.id || 'anonymous'
  });

  // Errori di validazione
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Dati non validi',
      details: err.message
    });
  }

  // Errori di autenticazione Supabase
  if (err.name === 'UnauthorizedError' || err.message?.includes('JWT')) {
    return res.status(401).json({
      success: false,
      error: 'Non autorizzato'
    });
  }

  // Errori di database Supabase
  if (err.code?.startsWith('PGRST') || err.message?.includes('Row Level Security')) {
    return res.status(403).json({
      success: false,
      error: 'Accesso negato dalla policy di sicurezza',
      details: err.message
    });
  }

  // Errori generici
  res.status(500).json({
    success: false,
    error: 'Errore interno del server'
  });
};

// Export sia le funzioni legacy che quelle nuove
module.exports = {
  // Funzioni legacy (mantenute per compatibilità)
  authenticateToken,
  requireRole,
  requireOwnership,
  requestLogger,
  errorHandler,
  
  // Funzioni nuove (da config/supabase.js)
  authenticateUser: supabaseAuthenticateUser,
  requireRoleNew: supabaseRequireRole,
  
  // Alias per facilitare la migrazione
  auth: supabaseAuthenticateUser,
};
