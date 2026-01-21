-- Diagnostic rapide: Compter les politiques par table et par opération

SELECT
    tablename as "Table",
    cmd as "Opération",
    COUNT(*) as "Nombre"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
GROUP BY tablename, cmd
ORDER BY tablename, cmd;
