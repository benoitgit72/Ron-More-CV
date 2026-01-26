-- ============================================
-- FIX: Erreur 406 sur cv_info
-- Diagnostic et correction des RLS policies
-- ============================================

-- DIAGNOSTIC: Vérifier l'état actuel
SELECT
    policyname,
    roles::text,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'cv_info'
ORDER BY policyname;

-- PROBLÈME IDENTIFIÉ:
-- Les policies peuvent être définies pour le mauvais role
-- ou auth.uid() ne fonctionne pas correctement

-- ============================================
-- SOLUTION: Supprimer TOUTES les policies et recréer
-- ============================================

-- Supprimer toutes les policies existantes
DROP POLICY IF EXISTS "Public can read all cv_info" ON cv_info;
DROP POLICY IF EXISTS "Public can view all cv_info" ON cv_info;
DROP POLICY IF EXISTS "Users can view their own cv_info" ON cv_info;
DROP POLICY IF EXISTS "Users can update their own cv_info" ON cv_info;
DROP POLICY IF EXISTS "Users can insert their own cv_info" ON cv_info;
DROP POLICY IF EXISTS "Users can delete their own cv_info" ON cv_info;

-- ============================================
-- RECRÉER avec la bonne configuration
-- ============================================

-- Policy 1: Lecture pour TOUS (public ET authenticated)
-- Permet aux utilisateurs (connectés ou non) de voir TOUS les CV publiques
-- IMPORTANT: Les roles 'public' ET 'authenticated' doivent être listés
CREATE POLICY "Everyone can read all cv_info"
    ON cv_info
    FOR SELECT
    TO public, authenticated
    USING (true);

-- Policy 3: Les utilisateurs peuvent mettre à jour leurs propres données
CREATE POLICY "Users can update own cv_info"
    ON cv_info
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Les utilisateurs peuvent insérer leurs propres données
CREATE POLICY "Users can insert own cv_info"
    ON cv_info
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 5: Les utilisateurs peuvent supprimer leurs propres données
CREATE POLICY "Users can delete own cv_info"
    ON cv_info
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher les policies créées
SELECT
    policyname,
    roles::text,
    cmd,
    SUBSTRING(qual::text, 1, 50) as condition
FROM pg_policies
WHERE tablename = 'cv_info'
ORDER BY policyname;

-- Test d'accès (si vous êtes connecté, remplacez par votre user_id)
-- SELECT * FROM cv_info WHERE user_id = 'ee3362ba-af60-400a-aa3b-e5fffe1d8738';

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies pour cv_info recréées avec succès!';
    RAISE NOTICE '✅ Policy 1: Public read access (TO public)';
    RAISE NOTICE '✅ Policy 2-5: Authenticated users CRUD on own data';
    RAISE NOTICE '🔄 Faites un hard refresh du dashboard admin';
END $$;
