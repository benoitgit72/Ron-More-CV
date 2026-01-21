-- ============================================
-- Mettre à jour le user_id de Ron More dans toutes les tables
-- ============================================
--
-- Ancien UUID: d5b317b1-34ba-4289-8d40-11fd1b584315
-- Nouveau UUID (auth.users): a733feca-1392-46e0-8f96-5b11cb804492
-- ============================================

-- 1. Mettre à jour cv_info
UPDATE cv_info
SET user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

-- 2. Mettre à jour experiences
UPDATE experiences
SET user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

-- 3. Mettre à jour formations
UPDATE formations
SET user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

-- 4. Mettre à jour competences
UPDATE competences
SET user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

-- 5. Supprimer l'ancien profil (le nouveau existe déjà via auth.users trigger)
DELETE FROM profiles
WHERE id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';

-- ============================================
-- Vérification: Afficher les user_id mis à jour
-- ============================================

SELECT 'cv_info' as "Table", COUNT(*) as "Lignes avec nouveau UUID"
FROM cv_info
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT 'experiences', COUNT(*)
FROM experiences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT 'formations', COUNT(*)
FROM formations
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT 'competences', COUNT(*)
FROM competences
WHERE user_id = 'a733feca-1392-46e0-8f96-5b11cb804492'
UNION ALL
SELECT 'profiles', COUNT(*)
FROM profiles
WHERE id = 'a733feca-1392-46e0-8f96-5b11cb804492';

-- ============================================
-- Vérification finale: Aucune ligne avec ancien UUID
-- ============================================

SELECT 'cv_info' as "Table", COUNT(*) as "Lignes avec ancien UUID (devrait être 0)"
FROM cv_info
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315'
UNION ALL
SELECT 'experiences', COUNT(*)
FROM experiences
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315'
UNION ALL
SELECT 'formations', COUNT(*)
FROM formations
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315'
UNION ALL
SELECT 'competences', COUNT(*)
FROM competences
WHERE user_id = 'd5b317b1-34ba-4289-8d40-11fd1b584315'
UNION ALL
SELECT 'profiles', COUNT(*)
FROM profiles
WHERE id = 'd5b317b1-34ba-4289-8d40-11fd1b584315';
