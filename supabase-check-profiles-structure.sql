-- Vérifier la structure de la table profiles

SELECT
    column_name as "Colonne",
    data_type as "Type",
    is_nullable as "Nullable"
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;
