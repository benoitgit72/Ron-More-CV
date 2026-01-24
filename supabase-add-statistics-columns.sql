-- Add 6 new columns for bilingual CV statistics to cv_info table
-- These columns store AI-generated statistics that are unique per user

ALTER TABLE cv_info
ADD COLUMN IF NOT EXISTS stat1_fr TEXT,
ADD COLUMN IF NOT EXISTS stat1_en TEXT,
ADD COLUMN IF NOT EXISTS stat2_fr TEXT,
ADD COLUMN IF NOT EXISTS stat2_en TEXT,
ADD COLUMN IF NOT EXISTS stat3_fr TEXT,
ADD COLUMN IF NOT EXISTS stat3_en TEXT;

-- Add comments for documentation
COMMENT ON COLUMN cv_info.stat1_fr IS 'First statistic label in French';
COMMENT ON COLUMN cv_info.stat1_en IS 'First statistic label in English';
COMMENT ON COLUMN cv_info.stat2_fr IS 'Second statistic label in French';
COMMENT ON COLUMN cv_info.stat2_en IS 'Second statistic label in English';
COMMENT ON COLUMN cv_info.stat3_fr IS 'Third statistic label in French';
COMMENT ON COLUMN cv_info.stat3_en IS 'Third statistic label in English';

-- Verify the migration
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'cv_info'
AND column_name LIKE 'stat%'
ORDER BY column_name;
