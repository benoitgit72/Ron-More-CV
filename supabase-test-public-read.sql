-- Test: Vérifier que la lecture publique fonctionne (simulation du site web)

-- Ce test simule une requête ANONYME (comme celle du site web)
-- qui devrait fonctionner grâce à la politique "Public can read all..."

SET ROLE anon;

-- Test 1: Lecture cv_info (devrait fonctionner)
SELECT
    'Test lecture publique cv_info' as "Test",
    COUNT(*) as "Lignes visibles",
    CASE
        WHEN COUNT(*) > 0 THEN '✅ OK - Lecture publique fonctionne'
        ELSE '❌ ERREUR - Aucune donnée visible'
    END as "Status"
FROM cv_info;

-- Test 2: Lecture experiences (devrait fonctionner)
SELECT
    'Test lecture publique experiences' as "Test",
    COUNT(*) as "Lignes visibles",
    CASE
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ ERREUR'
    END as "Status"
FROM experiences;

-- Test 3: Lecture formations (devrait fonctionner)
SELECT
    'Test lecture publique formations' as "Test",
    COUNT(*) as "Lignes visibles",
    CASE
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ ERREUR'
    END as "Status"
FROM formations;

-- Test 4: Lecture competences (devrait fonctionner)
SELECT
    'Test lecture publique competences' as "Test",
    COUNT(*) as "Lignes visibles",
    CASE
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ ERREUR'
    END as "Status"
FROM competences;

-- Revenir au rôle normal
RESET ROLE;
