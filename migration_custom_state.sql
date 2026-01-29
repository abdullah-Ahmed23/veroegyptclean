-- Add design_state column to custom_designs to support multiple images/elements
ALTER TABLE custom_designs ADD COLUMN IF NOT EXISTS design_state JSONB DEFAULT '[]'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN custom_designs.design_state IS 'Stores an array of design elements (images and text) with their coordinates, scales, and rotations.';
