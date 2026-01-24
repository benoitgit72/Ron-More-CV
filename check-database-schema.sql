-- Script pour vérifier la structure exacte des tables
-- À exécuter dans Supabase SQL Editor

-- 1. Structure de la table cv_info
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cv_info'
ORDER BY ordinal_position;

-- Séparateur
SELECT '==== EXPERIENCES ====' as separator;

-- 2. Structure de la table experiences
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'experiences'
ORDER BY ordinal_position;

-- Séparateur
SELECT '==== FORMATIONS ====' as separator;

-- 3. Structure de la table formations
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'formations'
ORDER BY ordinal_position;

-- Séparateur
SELECT '==== COMPETENCES ====' as separator;

-- 4. Structure de la table competences
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'competences'
ORDER BY ordinal_position;
