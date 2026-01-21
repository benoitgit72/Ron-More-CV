-- Test 1: Vérifier que les données Ron More existent avec le bon UUID

SELECT
    'cv_info' as "Table",
    COUNT(*) as "Nombre de lignes",
    CASE
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ Aucune donnée trouvée'
    END as "Status"
FROM cv_info
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT
    'experiences',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM experiences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT
    'formations',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM formations
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT
    'competences',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM competences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492';
