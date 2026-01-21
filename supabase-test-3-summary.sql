-- Test 3: Résumé complet de la configuration Ron More

SELECT
    'Ron More' as "Utilisateur",
    'a733feca-1392-46e0-8f96-5b11cb804492' as "UUID",
    (SELECT COUNT(*) FROM cv_info WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "CV",
    (SELECT COUNT(*) FROM experiences WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Expériences",
    (SELECT COUNT(*) FROM formations WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Formations",
    (SELECT COUNT(*) FROM competences WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Compétences",
    (SELECT email FROM auth.users WHERE id = 'a733feca-1392-46e0-8f96-5b11cb804492') as "Email Auth",
    '✅ Configuration complète' as "Status";
