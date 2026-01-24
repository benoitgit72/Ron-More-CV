-- ============================================
-- Mise à jour de la contrainte theme pour ajouter sunset-orange
-- ============================================

-- IMPORTANT: Exécutez ce script dans Supabase SQL Editor
-- Ce script met à jour la contrainte CHECK pour inclure le nouveau thème sunset-orange

-- ============================================
-- 1. Supprimer l'ancienne contrainte
-- ============================================

ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_theme_check;

-- ============================================
-- 2. Ajouter la nouvelle contrainte avec sunset-orange
-- ============================================

ALTER TABLE profiles
ADD CONSTRAINT profiles_theme_check
CHECK (theme IN ('purple-gradient', 'ocean-blue', 'forest-green', 'sunset-orange'));

-- ============================================
-- 3. Mettre à jour le commentaire de la colonne
-- ============================================

COMMENT ON COLUMN profiles.theme IS 'Theme de couleur choisi par l''utilisateur (purple-gradient, ocean-blue, forest-green, sunset-orange)';

-- ============================================
-- Vérification : Afficher les contraintes de la table profiles
-- ============================================

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
AND conname = 'profiles_theme_check';

-- ============================================
-- Message de confirmation
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Contrainte theme mise à jour avec succès !';
  RAISE NOTICE 'Valeurs possibles : purple-gradient, ocean-blue, forest-green, sunset-orange';
  RAISE NOTICE 'Le nouveau thème Sunset Orange est maintenant disponible !';
END $$;
