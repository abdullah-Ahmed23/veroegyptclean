-- Admin System Activities Table
-- This tracks events for the "Recent Activity" feed on the dashboard.

CREATE TABLE IF NOT EXISTS public.system_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    type TEXT NOT NULL, -- e.g. 'ORDER_PLACED', 'STATUS_UPDATED', 'PRODUCT_CREATED', etc.
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    admin_id UUID REFERENCES auth.users(id), -- Optional: tracks which admin performed the action
    admin_email TEXT -- Optional: tracks the email of the admin
);

-- Enable RLS
ALTER TABLE public.system_activities ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Anyone (Guest or User) can log activities (e.g. when placing an order)
DROP POLICY IF EXISTS "system_activities_insert_policy" ON public.system_activities;
CREATE POLICY "system_activities_insert_policy" ON public.system_activities
    FOR INSERT WITH CHECK (true);

-- 2. Only Admins can view/manage activities
DROP POLICY IF EXISTS "system_activities_admin_policy" ON public.system_activities;
CREATE POLICY "system_activities_admin_policy" ON public.system_activities
    FOR ALL 
    TO authenticated
    USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Index for performance on time filtering
CREATE INDEX IF NOT EXISTS idx_activity_time ON public.system_activities (created_at DESC);
