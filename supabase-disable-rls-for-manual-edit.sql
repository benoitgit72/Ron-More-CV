-- ============================================
-- Désactiver temporairement RLS pour édition manuelle
-- ============================================
--
-- Utilisez ceci si vous voulez éditer manuellement les données
-- via Supabase Table Editor sans créer de compte utilisateur
--
-- ⚠️ ATTENTION: Ne faites ceci QUE si vous êtes le seul à avoir
-- accès à votre projet Supabase!
-- ============================================

-- Désactiver RLS (vous pourrez modifier librement dans Table Editor)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cv_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE formations DISABLE ROW LEVEL SECURITY;
ALTER TABLE competences DISABLE ROW LEVEL SECURITY;

-- Vérification
SELECT
    tablename as "Table",
    rowsecurity as "RLS Actif",
    CASE
        WHEN rowsecurity THEN '🔒 Activé (sécurisé)'
        ELSE '🔓 Désactivé (édition libre)'
    END as "Status"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
ORDER BY tablename;
