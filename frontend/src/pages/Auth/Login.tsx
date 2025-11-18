import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signInWithPassword, getCurrentUser, supabase } from '../../lib/supabase';

// Import logo
import logo from '../../assets/logo.png';

// Credenziali di test per app vetrina
const TEST_CREDENTIALS = [
  { email: 'admin@test.com', password: 'Test123456!', role: 'Admin', color: '#d32f2f' },
  { email: 'manager@test.com', password: 'Test123456!', role: 'Manager', color: '#ed6c02' },
  { email: 'user1@test.com', password: 'Test123456!', role: 'User', color: '#1976d2' },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pulisci eventuali token invalidi all'apertura della pagina
  useEffect(() => {
    // Rimuovi token e dati utente esistenti per forzare il login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Login rapido con credenziali di test
  const handleQuickLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setLoading(true);
    setError('');

    try {
      const { user, session } = await signInWithPassword(email, password);

      if (user && session) {
        // Salva i dati utente
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: user.user_metadata?.role || 'user',
        }));

        // Attendi che Supabase salvi la sessione
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verifica che la sessione sia salvata
        const { data: { session: savedSession } } = await supabase.auth.getSession();
        if (!savedSession) {
          setError('Errore nel salvataggio della sessione. Riprova.');
          setLoading(false);
          return;
        }

        // Naviga solo dopo aver verificato la sessione
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath && redirectPath !== '/login' && redirectPath !== '/reports') {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      } else {
        setError('Credenziali non valide');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email o password non corretti');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Email non confermata. Controlla la tua casella di posta.');
      } else {
        setError(err.message || 'Errore durante il login');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Autenticazione con Supabase
      const { user, session } = await signInWithPassword(
        formData.email,
        formData.password
      );

      if (user && session) {
        // Salva i dati utente (Supabase gestisce automaticamente il token)
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: user.user_metadata?.role || 'user',
        }));

        // Attendi che Supabase salvi la sessione
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verifica che la sessione sia salvata
        const { data: { session: savedSession } } = await supabase.auth.getSession();
        if (!savedSession) {
          setError('Errore nel salvataggio della sessione. Riprova.');
          setLoading(false);
          return;
        }

        // Controlla se c'è un reindirizzamento salvato
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath && redirectPath !== '/login' && redirectPath !== '/reports') {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          // Reindirizza alla dashboard di default
          navigate('/');
        }
      } else {
        setError('Credenziali non valide');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Gestisci errori specifici di Supabase
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email o password non corretti');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Email non confermata. Controlla la tua casella di posta.');
      } else {
        setError(err.message || 'Errore durante il login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 4,
            textAlign: 'center',
          }}
        >
          {/* Logo dell'applicazione */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={logo}
              alt="Logo Gestionale Finanziario"
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '3px solid rgba(255,255,255,0.2)',
              }}
            />
          </Box>
          
          <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
            Gestionale Finanziario
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9, fontWeight: 300 }}>
            Sistema di Gestione AI Avanzato
          </Typography>
          <Typography variant="body1" color="white" sx={{ mt: 1, opacity: 0.8 }}>
            Accedi al tuo account
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                },
              }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>

          {/* Sezione Credenziali di Test per App Vetrina */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              🔐 Accesso Rapido (Demo)
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              Clicca su un account per accedere automaticamente
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {TEST_CREDENTIALS.map((cred, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickLogin(cred.email, cred.password)}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderColor: cred.color,
                    color: cred.color,
                    '&:hover': {
                      borderColor: cred.color,
                      backgroundColor: `${cred.color}10`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${cred.color}30`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: cred.color,
                      }}
                    />
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography variant="body1" fontWeight={600}>
                        {cred.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cred.email}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Login rapido →
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                💡 <strong>Nota:</strong> Questa è un'applicazione demo. Le credenziali sono pubbliche.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Password per tutti gli account: <strong>Test123456!</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
