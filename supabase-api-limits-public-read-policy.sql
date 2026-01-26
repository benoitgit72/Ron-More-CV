-- ============================================
-- API Limits - Public Read Policy
-- Permet la lecture publique des limites (nécessaire pour les APIs)
-- ============================================

-- Supprimer si existe, puis créer (PostgreSQL ne supporte pas IF NOT EXISTS sur CREATE POLICY)
DROP POLICY IF EXISTS "Public can read api limits" ON api_limits;

CREATE POLICY "Public can read api limits"
    ON api_limits
    FOR SELECT
    USING (true);

-- Vérification
SELECT policyname, cmd, qual, roles
FROM pg_policies
WHERE tablename = 'api_limits' AND policyname = 'Public can read api limits';
