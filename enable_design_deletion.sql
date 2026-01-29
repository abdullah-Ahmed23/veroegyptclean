-- Add delete policy for custom designs (Admin only)
DROP POLICY IF EXISTS "custom_designs_delete_policy" ON custom_designs;
CREATE POLICY "custom_designs_delete_policy" ON custom_designs
FOR DELETE USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

-- Fix select policy for custom designs (Admin only)
DROP POLICY IF EXISTS "custom_designs_select_policy" ON custom_designs;
CREATE POLICY "custom_designs_select_policy" ON custom_designs
FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
