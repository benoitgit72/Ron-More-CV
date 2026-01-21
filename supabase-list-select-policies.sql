-- Lister toutes les politiques SELECT pour identifier les doublons

SELECT
    tablename as "Table",
    policyname as "Nom de la Politique",
    qual::text as "Condition USING"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
AND cmd = 'SELECT'
ORDER BY tablename, policyname;
