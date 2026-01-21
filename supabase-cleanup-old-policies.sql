-- ============================================
-- Nettoyage des anciennes politiques en double
-- ============================================

-- Supprimer les anciennes politiques "Anyone can view..."
DROP POLICY IF EXISTS "Anyone can view competences" ON competences;
DROP POLICY IF EXISTS "Anyone can view cv_info by slug" ON cv_info;
DROP POLICY IF EXISTS "Anyone can view experiences" ON experiences;
DROP POLICY IF EXISTS "Anyone can view formations" ON formations;
DROP POLICY IF EXISTS "Anyone can view profiles by slug" ON profiles;

-- Vérification: Compter les politiques restantes
SELECT
    tablename as "Table",
    cmd as "Opération",
    COUNT(*) as "Nombre"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
GROUP BY tablename, cmd
ORDER BY tablename, cmd;
