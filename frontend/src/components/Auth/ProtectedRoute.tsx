import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { getCurrentSession, supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica autenticazione con Supabase
    const checkAuth = async () => {
      try {
        // Prova prima con getSession (più veloce)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Se non c'è sessione, prova con getUser
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && !error) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Errore verifica autenticazione:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Ascolta cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    // Mostra un loader mentre verifica l'autenticazione
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography>Caricamento...</Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Salva la route richiesta per reindirizzare dopo il login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    // Reindirizza al login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
