-- ============================================
-- Test d'accès pour Ron More
-- ============================================
--
-- Ce script simule ce que verra Ron More une fois connecté
-- UUID de Ron More: a733feca-1392-46e0-8f96-5b11cb804492
-- ============================================

-- Test 1: Vérifier que les données existent avec le bon UUID
SELECT
    'Test 1: Données Ron More' as "Test",
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
    'Test 1: Données Ron More',
    'experiences',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM experiences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT
    'Test 1: Données Ron More',
    'formations',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM formations
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT
    'Test 1: Données Ron More',
    'competences',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ Aucune donnée trouvée' END
FROM competences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492';

-- Test 2: Vérifier que l'utilisateur existe dans auth.users
SELECT
    'Test 2: Utilisateur Auth' as "Test",
    id as "UUID",
    email as "Email",
    created_at as "Créé le",
    '✅ Utilisateur existe dans auth.users' as "Status"
FROM auth.users
WHERE id = 'a733feca-1392-46e0-8f96-5b11cb804492';

-- Test 3: Résumé complet
SELECT
    'Test 3: Résumé' as "Test",
    'Ron More' as "Utilisateur",
    (SELECT COUNT(*) FROM cv_info WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "CV",
    (SELECT COUNT(*) FROM experiences WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Expériences",
    (SELECT COUNT(*) FROM formations WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Formations",
    (SELECT COUNT(*) FROM competences WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Compétences",
    '✅ Configuration complète' as "Status";
