-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Gestionale Finanziario - Supabase
-- ============================================================================
-- 
-- ⚠️ IMPORTANTE: NON usare policy che permettono tutto a tutti!
-- Questo file contiene policies SICURE per proteggere i dati finanziari.
--
-- Per applicare queste policies:
-- 1. Vai su Supabase Dashboard > SQL Editor
-- 2. Copia e incolla le policies necessarie
-- 3. Esegui le query
-- ============================================================================

-- ============================================================================
-- TABELLA: accounts
-- ============================================================================

-- Abilita RLS sulla tabella accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Utenti autenticati possono vedere solo i propri account
-- (assumendo che accounts abbia una colonna user_id o customer_id collegata all'utente)
CREATE POLICY "Users can view own accounts"
ON accounts
FOR SELECT
USING (
  -- Se esiste user_id, verifica che corrisponda all'utente autenticato
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Se esiste customer_id, verifica che il customer appartenga all'utente
  (customer_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = accounts.customer_id 
    AND customers.user_id = auth.uid()
  ))
  OR
  -- Admin possono vedere tutto
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Utenti possono inserire solo account per se stessi
CREATE POLICY "Users can insert own accounts"
ON accounts
FOR INSERT
WITH CHECK (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (customer_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = accounts.customer_id 
    AND customers.user_id = auth.uid()
  ))
  OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Utenti possono aggiornare solo i propri account
CREATE POLICY "Users can update own accounts"
ON accounts
FOR UPDATE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (customer_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = accounts.customer_id 
    AND customers.user_id = auth.uid()
  ))
  OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (customer_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM customers 
    WHERE customers.id = accounts.customer_id 
    AND customers.user_id = auth.uid()
  ))
  OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Solo admin possono eliminare account
CREATE POLICY "Only admins can delete accounts"
ON accounts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- TABELLA: transactions
-- ============================================================================

-- Abilita RLS sulla tabella transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Utenti possono vedere solo transazioni dei propri account
CREATE POLICY "Users can view own transactions"
ON transactions
FOR SELECT
USING (
  -- Transazioni del proprio account
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND (
      accounts.user_id = auth.uid()
      OR
      (accounts.customer_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM customers 
        WHERE customers.id = accounts.customer_id 
        AND customers.user_id = auth.uid()
      ))
    )
  )
  OR
  -- Admin possono vedere tutto
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Utenti possono inserire solo transazioni per i propri account
CREATE POLICY "Users can insert own transactions"
ON transactions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = transactions.account_id
    AND (
      accounts.user_id = auth.uid()
      OR
      (accounts.customer_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM customers 
        WHERE customers.id = accounts.customer_id 
        AND customers.user_id = auth.uid()
      ))
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Solo admin possono modificare transazioni (per sicurezza finanziaria)
CREATE POLICY "Only admins can update transactions"
ON transactions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Solo admin possono eliminare transazioni
CREATE POLICY "Only admins can delete transactions"
ON transactions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- TABELLA: customers (se esiste)
-- ============================================================================

-- Abilita RLS sulla tabella customers (se esiste)
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Utenti possono vedere solo se stessi come customer
-- CREATE POLICY "Users can view own customer record"
-- ON customers
-- FOR SELECT
-- USING (
--   user_id = auth.uid()
--   OR
--   EXISTS (
--     SELECT 1 FROM user_roles
--     WHERE user_id = auth.uid()
--     AND role = 'admin'
--   )
-- );

-- ============================================================================
-- FUNZIONE HELPER: Verifica se utente è admin
-- ============================================================================

-- Crea una funzione helper per verificare se un utente è admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- TABELLA: user_roles (da creare se non esiste)
-- ============================================================================

-- Crea la tabella user_roles se non esiste
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Abilita RLS su user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Utenti possono vedere solo il proprio ruolo
CREATE POLICY "Users can view own role"
ON user_roles
FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
);

-- Policy: Solo admin possono modificare ruoli
CREATE POLICY "Only admins can manage roles"
ON user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
);

-- ============================================================================
-- ⚠️ POLICY PERICOLOSA - NON USARE IN PRODUZIONE!
-- ============================================================================
-- 
-- ❌ NON FARE QUESTO:
-- CREATE POLICY "Allow all" ON accounts FOR ALL USING (true);
-- 
-- Questo permetterebbe a CHIUNQUE di:
-- - Vedere tutti gli account di tutti gli utenti
-- - Modificare qualsiasi account
-- - Eliminare qualsiasi account
-- - Accedere a dati finanziari sensibili
--
-- ✅ USA INVECE le policies sopra che:
-- - Limitano l'accesso ai propri dati
-- - Permettono solo agli admin di vedere tutto
-- - Proteggono i dati finanziari sensibili
-- ============================================================================

-- ============================================================================
-- VERIFICA POLICIES
-- ============================================================================

-- Per verificare le policies create:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================================================
-- NOTE IMPORTANTI
-- ============================================================================
--
-- 1. ASSICURATI che le tabelle abbiano le colonne necessarie:
--    - accounts.user_id o accounts.customer_id
--    - transactions.account_id
--    - customers.user_id (se esiste)
--
-- 2. ADATTA le policies alle tue esigenze specifiche
--
-- 3. TESTA sempre le policies prima di andare in produzione
--
-- 4. MONITORA gli accessi nel Supabase Dashboard
--
-- 5. NON committare mai SERVICE_ROLE_KEY nel codice frontend
--
-- ============================================================================

