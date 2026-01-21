-- Vérifier le user_id actuel de Ron More

SELECT
    user_id as "User ID actuel",
    nom as "Nom",
    email as "Email"
FROM cv_info
WHERE nom = 'Ron More';
