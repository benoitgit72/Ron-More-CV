-- Test 2: Vérifier que l'utilisateur Ron More existe dans auth.users

SELECT
    id as "UUID",
    email as "Email",
    created_at as "Créé le",
    confirmed_at as "Confirmé le",
    '✅ Utilisateur existe' as "Status"
FROM auth.users
WHERE id = 'a733feca-1392-46e0-8f96-5b11cb804492';
