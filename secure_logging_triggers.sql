-- Secure Logging Automation
-- This script moves critical activity logging to database triggers and restricts access to the audit log.
-- UPDATED: Added SET search_path = public to functions to fix security warnings.

-- 1. Trigger Function for New Orders
CREATE OR REPLACE FUNCTION log_order_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.system_activities (type, description_en, description_ar, metadata)
    VALUES (
        'ORDER_PLACED',
        'New order placed by ' || NEW.customer_name || ' (EGP ' || (NEW.total_amount / 100)::text || ')',
        'طلب جديد من ' || NEW.customer_name || ' (' || (NEW.total_amount / 100)::text || ' ج.م)',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount / 100)
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION log_order_activity();


-- 2. Trigger Function for Custom Designs
CREATE OR REPLACE FUNCTION log_design_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    cust_name TEXT;
BEGIN
    -- Try to fetch customer name from the related order
    SELECT customer_name INTO cust_name FROM public.orders WHERE id = NEW.order_id;
    
    IF cust_name IS NULL THEN
        cust_name := 'Unknown Customer';
    END IF;

    INSERT INTO public.system_activities (type, description_en, description_ar, metadata)
    VALUES (
        'DESIGN_SUBMITTED',
        'New custom design request submitted by ' || cust_name,
        'طلب تصميم خاص جديد من ' || cust_name,
        jsonb_build_object('order_id', NEW.order_id)
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_design_submitted ON public.custom_designs;
CREATE TRIGGER on_design_submitted
AFTER INSERT ON public.custom_designs
FOR EACH ROW EXECUTE FUNCTION log_design_activity();


-- 3. Lock Down System Activities (Fix "Always True" Warning)
DROP POLICY IF EXISTS "system_activities_insert_policy" ON public.system_activities;
-- Only Admins can manually insert (for other event types). Public/Users cannot.
CREATE POLICY "system_activities_insert_policy" ON public.system_activities
FOR INSERT WITH CHECK (
    ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
