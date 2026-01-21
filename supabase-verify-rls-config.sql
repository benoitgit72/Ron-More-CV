-- ============================================
-- SCRIPT DE VÉRIFICATION RLS - Configuration Multi-Clients
-- ============================================
--
-- Ce script vérifie que la configuration Row-Level Security
-- est correctement appliquée sur toutes les tables
--
-- IMPORTANT: Exécutez ce script dans Supabase SQL Editor
-- après avoir exécuté supabase-setup-rls-security-safe.sql
-- ============================================

-- ============================================
-- TEST 1: Vérification que RLS est activé
-- ============================================

SELECT
    '1️⃣ VÉRIFICATION RLS' as test,
    tablename as "Table",
    rowsecurity as "RLS Actif",
    CASE
        WHEN rowsecurity THEN '✅ Activé'
        ELSE '❌ DÉSACTIVÉ - PROBLÈME!'
    END as "Status"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
ORDER BY tablename;

-- ============================================
-- TEST 2: Comptage des politiques par table
-- ============================================

SELECT
    '2️⃣ NOMBRE DE POLITIQUES' as test,
    tablename as "Table",
    COUNT(*) as "Nb Politiques",
    CASE
        WHEN tablename = 'profiles' AND COUNT(*) = 4 THEN '✅ Complet (4/4)'
        WHEN tablename != 'profiles' AND COUNT(*) = 5 THEN '✅ Complet (5/5)'
        WHEN tablename = 'profiles' AND COUNT(*) < 4 THEN '❌ Incomplet (' || COUNT(*) || '/4)'
        WHEN tablename != 'profiles' AND COUNT(*) < 5 THEN '❌ Incomplet (' || COUNT(*) || '/5)'
        ELSE '⚠️ Trop de politiques (' || COUNT(*) || ')'
    END as "Status"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- TEST 3: Vérification des politiques de lecture publique
-- ============================================

SELECT
    '3️⃣ LECTURE PUBLIQUE' as test,
    tablename as "Table",
    policyname as "Politique",
    cmd as "Opération",
    CASE
        WHEN qual::text = 'true' THEN '✅ Public OK'
        ELSE '❌ ERREUR: ' || COALESCE(qual::text, 'NULL')
    END as "Status"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
AND cmd = 'SELECT'
AND policyname LIKE '%Public%'
ORDER BY tablename;

-- ============================================
-- TEST 4: Vérification des politiques de modification privée
-- ============================================

SELECT
    '4️⃣ MODIFICATION PRIVÉE' as test,
    tablename as "Table",
    policyname as "Politique",
    cmd as "Opération",
    CASE
        WHEN qual::text LIKE '%auth.uid()%user_id%'
             OR qual::text LIKE '%auth.uid()%id%'
             THEN '✅ Isolation OK'
        ELSE '❌ ERREUR: ' || COALESCE(qual::text, 'NULL')
    END as "Status"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
AND cmd IN ('UPDATE', 'DELETE')
ORDER BY tablename, cmd;

-- ============================================
-- TEST 5: Liste complète des politiques par table
-- ============================================

SELECT
    '5️⃣ DÉTAIL DES POLITIQUES' as test,
    tablename as "Table",
    cmd as "Opération",
    policyname as "Nom de la Politique",
    CASE
        WHEN cmd = 'SELECT' AND qual::text = 'true' THEN '✅ Public'
        WHEN cmd IN ('UPDATE', 'INSERT', 'DELETE') AND qual::text LIKE '%auth.uid()%' THEN '✅ Privée'
        ELSE '⚠️ Vérifier'
    END as "Type"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
ORDER BY tablename, cmd, policyname;

-- ============================================
-- TEST 6: Recherche de politiques avec typos ou erreurs
-- ============================================

SELECT
    '6️⃣ POLITIQUES AVEC ERREURS' as test,
    tablename as "Table",
    policyname as "Politique Problématique",
    '❌ Typo détecté' as "Problème"
FROM pg_policies
WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
AND (
    policyname LIKE '%leur%'  -- Typo français
    OR policyname LIKE '%thier%'  -- Typo anglais
    OR policyname LIKE '%owm%'  -- Typo anglais
)
UNION ALL
SELECT
    '6️⃣ POLITIQUES AVEC ERREURS' as test,
    'Aucune' as "Table",
    'Aucune politique avec erreur trouvée' as "Politique Problématique",
    '✅ Tout est OK' as "Problème"
WHERE NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
    AND (
        policyname LIKE '%leur%'
        OR policyname LIKE '%thier%'
        OR policyname LIKE '%owm%'
    )
);

-- ============================================
-- TEST 7: Vérification des opérations couvertes
-- ============================================

WITH required_operations AS (
    SELECT 'profiles' as tablename, ARRAY['SELECT', 'UPDATE', 'INSERT'] as required_ops
    UNION ALL
    SELECT 'cv_info', ARRAY['SELECT', 'UPDATE', 'INSERT', 'DELETE']
    UNION ALL
    SELECT 'experiences', ARRAY['SELECT', 'UPDATE', 'INSERT', 'DELETE']
    UNION ALL
    SELECT 'formations', ARRAY['SELECT', 'UPDATE', 'INSERT', 'DELETE']
    UNION ALL
    SELECT 'competences', ARRAY['SELECT', 'UPDATE', 'INSERT', 'DELETE']
),
actual_operations AS (
    SELECT tablename, ARRAY_AGG(DISTINCT cmd) as actual_ops
    FROM pg_policies
    WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
    GROUP BY tablename
)
SELECT
    '7️⃣ OPÉRATIONS COUVERTES' as test,
    r.tablename as "Table",
    ARRAY_TO_STRING(r.required_ops, ', ') as "Opérations Requises",
    ARRAY_TO_STRING(a.actual_ops, ', ') as "Opérations Configurées",
    CASE
        WHEN r.required_ops <@ a.actual_ops THEN '✅ Complet'
        ELSE '❌ Manquant: ' || ARRAY_TO_STRING(
            ARRAY(SELECT unnest(r.required_ops) EXCEPT SELECT unnest(a.actual_ops)),
            ', '
        )
    END as "Status"
FROM required_operations r
LEFT JOIN actual_operations a ON r.tablename = a.tablename
ORDER BY r.tablename;

-- ============================================
-- TEST 8: Résumé global
-- ============================================

WITH stats AS (
    SELECT
        COUNT(DISTINCT tablename) as total_tables,
        COUNT(*) as total_policies,
        COUNT(CASE WHEN cmd = 'SELECT' AND qual::text = 'true' THEN 1 END) as public_read_policies,
        COUNT(CASE WHEN cmd IN ('UPDATE', 'DELETE') AND qual::text LIKE '%auth.uid()%' THEN 1 END) as private_write_policies
    FROM pg_policies
    WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
),
rls_status AS (
    SELECT
        COUNT(*) as tables_with_rls
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
    AND rowsecurity = true
)
SELECT
    '8️⃣ RÉSUMÉ GLOBAL' as test,
    'Configuration RLS Multi-Clients' as "Élément",
    CASE
        WHEN r.tables_with_rls = 5
             AND s.total_tables = 5
             AND s.total_policies >= 24
             AND s.public_read_policies = 5
             AND s.private_write_policies >= 8
        THEN '✅ PARFAIT - Configuration complète et correcte!'
        WHEN r.tables_with_rls = 5 AND s.total_tables = 5
        THEN '⚠️ RLS activé mais politiques incomplètes'
        ELSE '❌ ERREUR - Configuration incomplète'
    END as "Status Global",
    CONCAT(
        'Tables: ', r.tables_with_rls, '/5 | ',
        'Politiques: ', s.total_policies, ' | ',
        'Public: ', s.public_read_policies, '/5 | ',
        'Privé: ', s.private_write_policies, '/8+'
    ) as "Détails"
FROM stats s, rls_status r;

-- ============================================
-- TEST 9: Exemples de requêtes pour tester l'isolation
-- ============================================

SELECT
    '9️⃣ TESTS D''ISOLATION SUGGÉRÉS' as test,
    'Commandes SQL à tester' as "Type",
    $test$
    -- TEST A: Lecture publique (devrait fonctionner même sans auth)
    SELECT slug, nom FROM cv_info;

    -- TEST B: Modification (devrait échouer si user_id != auth.uid())
    -- UPDATE cv_info SET nom = 'Test' WHERE user_id = 'autre-user-id';
    -- Résultat attendu: 0 rows affected (bloqué par RLS)

    -- TEST C: Vérifier votre propre user_id
    SELECT user_id, nom FROM cv_info WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

    -- TEST D: Compter vos propres données
    SELECT
        (SELECT COUNT(*) FROM cv_info WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315') as cv_count,
        (SELECT COUNT(*) FROM experiences WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315') as exp_count,
        (SELECT COUNT(*) FROM formations WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315') as form_count,
        (SELECT COUNT(*) FROM competences WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315') as comp_count;
    $test$ as "Exemples de Tests"
FROM (SELECT 1) as dummy;

-- ============================================
-- TEST 10: Vérification finale - Checklist
-- ============================================

WITH checklist AS (
    SELECT '✅ RLS activé sur toutes les tables' as item,
           (SELECT COUNT(*) FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
            AND rowsecurity = true) = 5 as passed
    UNION ALL
    SELECT '✅ Politiques de lecture publique créées' as item,
           (SELECT COUNT(*) FROM pg_policies
            WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
            AND cmd = 'SELECT' AND policyname LIKE '%Public%') = 5 as passed
    UNION ALL
    SELECT '✅ Politiques de modification privée créées' as item,
           (SELECT COUNT(*) FROM pg_policies
            WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
            AND cmd IN ('UPDATE', 'DELETE')) >= 9 as passed
    UNION ALL
    SELECT '✅ Aucune politique avec typo' as item,
           NOT EXISTS (
               SELECT 1 FROM pg_policies
               WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
               AND policyname LIKE '%leur%'
           ) as passed
    UNION ALL
    SELECT '✅ Total de politiques correct (24-25)' as item,
           (SELECT COUNT(*) FROM pg_policies
            WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
           ) BETWEEN 24 AND 25 as passed
)
SELECT
    '🔟 CHECKLIST FINALE' as test,
    item as "Vérification",
    CASE
        WHEN passed THEN '✅ PASSÉ'
        ELSE '❌ ÉCHEC'
    END as "Résultat"
FROM checklist;

-- ============================================
-- MESSAGE FINAL
-- ============================================

DO $$
DECLARE
    rls_count INTEGER;
    policy_count INTEGER;
    public_read_count INTEGER;
    status_message TEXT;
BEGIN
    -- Compter les tables avec RLS
    SELECT COUNT(*) INTO rls_count
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
    AND rowsecurity = true;

    -- Compter les politiques
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences');

    -- Compter les politiques publiques
    SELECT COUNT(*) INTO public_read_count
    FROM pg_policies
    WHERE tablename IN ('profiles', 'cv_info', 'experiences', 'formations', 'competences')
    AND cmd = 'SELECT'
    AND policyname LIKE '%Public%';

    -- Déterminer le statut
    IF rls_count = 5 AND policy_count >= 24 AND public_read_count = 5 THEN
        status_message := '✅ SUCCÈS COMPLET';
        RAISE NOTICE '';
        RAISE NOTICE '════════════════════════════════════════════════════════════';
        RAISE NOTICE '%', status_message;
        RAISE NOTICE '════════════════════════════════════════════════════════════';
        RAISE NOTICE '';
        RAISE NOTICE '🎉 Votre configuration RLS est PARFAITE !';
        RAISE NOTICE '';
        RAISE NOTICE '📊 Statistiques :';
        RAISE NOTICE '   ✓ Tables avec RLS : % / 5', rls_count;
        RAISE NOTICE '   ✓ Politiques totales : %', policy_count;
        RAISE NOTICE '   ✓ Lecture publique : % / 5', public_read_count;
        RAISE NOTICE '';
        RAISE NOTICE '✅ Prochaines étapes :';
        RAISE NOTICE '   1. Créer des comptes utilisateurs dans Authentication';
        RAISE NOTICE '   2. Tester l''isolation entre clients';
        RAISE NOTICE '   3. Développer l''interface d''administration';
        RAISE NOTICE '';
    ELSE
        status_message := '⚠️ CONFIGURATION INCOMPLÈTE';
        RAISE NOTICE '';
        RAISE NOTICE '════════════════════════════════════════════════════════════';
        RAISE NOTICE '%', status_message;
        RAISE NOTICE '════════════════════════════════════════════════════════════';
        RAISE NOTICE '';
        RAISE NOTICE '⚠️ Problèmes détectés :';
        IF rls_count < 5 THEN
            RAISE NOTICE '   ❌ RLS activé sur seulement % / 5 tables', rls_count;
        END IF;
        IF policy_count < 24 THEN
            RAISE NOTICE '   ❌ Seulement % politiques (minimum 24 requis)', policy_count;
        END IF;
        IF public_read_count < 5 THEN
            RAISE NOTICE '   ❌ Seulement % / 5 politiques de lecture publique', public_read_count;
        END IF;
        RAISE NOTICE '';
        RAISE NOTICE '💡 Solution :';
        RAISE NOTICE '   Réexécutez: supabase-setup-rls-security-safe.sql';
        RAISE NOTICE '';
    END IF;
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;
