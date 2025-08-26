const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

/**
 * Middleware di autenticazione JWT
 */
const authenticateToken = (req, res, next) => {
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

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn('🔒 Token non valido', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
          error: err.message
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
    });
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
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Utente non autenticato'
        });
      }

      const userRole = req.user.role;
      
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
      const resource = await resourceModel.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Risorsa non trovata'
        });
      }

      // Admin può accedere a tutto
      if (req.user.role === 'admin') {
        return next();
      }

      // Verifica proprietà
      if (resource.userId !== req.user.id) {
        logger.warn('🚫 Tentativo di accesso a risorsa non propria', {
          userId: req.user.id,
          resourceId,
          resourceUserId: resource.userId,
          path: req.path
        });
        
        return res.status(403).json({
          success: false,
          error: 'Accesso negato: risorsa non propria'
        });
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

  // Errori di autenticazione
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Non autorizzato'
    });
  }

  // Errori di database
  if (err.name === 'SequelizeError' || err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Errore nel database',
      details: err.message
    });
  }

  // Errori generici
  res.status(500).json({
    success: false,
    error: 'Errore interno del server'
  });
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership,
  requestLogger,
  errorHandler
};
