-- Fix overly permissive RLS policy on products table
-- The old policy "USING (true)" granted ALL operations to ANY request
-- This migration replaces it with a proper role-based check

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Admins have full access to products" ON products;

-- Create a new restrictive policy that only allows service-role operations
-- Service-role key bypasses RLS, so this policy effectively blocks all anonymous/authenticated users
CREATE POLICY "Only service role can modify products" ON products
  FOR ALL USING (false)
  WITH CHECK (false);

-- Note: The service-role key used by the application bypasses RLS entirely,
-- so admin CRUD operations will still work. This policy ensures that
-- regular authenticated users cannot modify products.
