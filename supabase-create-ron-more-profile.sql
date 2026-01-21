-- ============================================
-- Créer le profil Ron More dans la table profiles
-- ============================================

-- Insérer le profil avec le bon UUID et slug
INSERT INTO profiles (id, slug, template_id, subscription_status, created_at, updated_at)
VALUES (
    'a733feca-1392-46e0-8f96-5b11cb804492',  -- UUID de Ron More
    'ron-more',                               -- Slug pour l'URL
    1,                                        -- Template par défaut
    'active',                                 -- Statut actif
    NOW(),                                    -- Date de création
    NOW()                                     -- Date de mise à jour
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    template_id = EXCLUDED.template_id,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = NOW();

-- Vérification
SELECT
    id as "UUID",
    slug as "Slug",
    template_id as "Template",
    subscription_status as "Status",
    '✅ Profil créé' as "Résultat"
FROM profiles
WHERE id = 'a733feca-1392-46e0-8f96-5b11cb804492';
