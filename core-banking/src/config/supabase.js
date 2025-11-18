const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configurazione Supabase dal file .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

// Client Supabase con ANON_KEY (per operazioni normali con RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client Supabase con SERVICE_ROLE_KEY (per operazioni admin, bypassa RLS)
// ATTENZIONE: Usare solo per operazioni server-side che richiedono accesso completo
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Middleware per autenticazione Supabase
 * Sostituisce il vecchio middleware JWT
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token di accesso richiesto'
      });
    }

    // Verifica il token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Token non valido o scaduto'
      });
    }

    // Aggiunge l'utente alla richiesta
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Errore nel middleware di autenticazione:', error);
    res.status(500).json({
      success: false,
      error: 'Errore interno del server'
    });
  }
};

/**
 * Middleware per verificare i ruoli utente
 * NOTA: Con Supabase, i ruoli sono gestiti tramite RLS policies nel database
 * Questo middleware è utile per controlli aggiuntivi a livello API
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
        return res.status(403).json({
          success: false,
          error: 'Ruolo insufficiente per accedere a questa risorsa'
        });
      }

      next();
    } catch (error) {
      console.error('❌ Errore nel controllo ruolo:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  };
};

/**
 * Helper per query al database con RLS automatico
 */
const queryDatabase = async (table, options = {}) => {
  try {
    let query = supabase.from(table).select(options.select || '*');

    // Applica filtri
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Applica ordinamento
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending !== false 
      });
    }

    // Applica limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error(`❌ Errore nella query a ${table}:`, error);
    return { data: null, error };
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  authenticateUser,
  requireRole,
  queryDatabase
};


