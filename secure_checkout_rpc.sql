-- Secure Order Creation Function
-- This function calculates order totals server-side to prevent price manipulation.

CREATE OR REPLACE FUNCTION create_order_secure(
    customer_data JSONB,
    items JSONB,
    payment_method TEXT,
    proof_url TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_order_id UUID;
    total_cost BIGINT := 0;
    item JSONB;
    variant_price BIGINT;
    item_cost BIGINT;
    p_id UUID;
    v_id UUID;
    qty INTEGER;
    cust_id UUID;
BEGIN
    -- 1. Validate Input
    IF jsonb_array_length(items) = 0 THEN
        RAISE EXCEPTION 'Order must contain items';
    END IF;

    -- 2. Calculate Total Cost
    FOR item IN SELECT * FROM jsonb_array_elements(items)
    LOOP
        -- Extract item details
        p_id := (item->>'product_id')::UUID;
        qty := (item->>'quantity')::INTEGER;
        
        -- Check for Custom Item (variant_id is null)
        IF (item->>'variant_id') IS NULL THEN
            variant_price := 0; -- Quote based / Custom item
        ELSE
            v_id := (item->>'variant_id')::UUID;
            -- Fetch authoritative price from database
            SELECT price INTO variant_price 
            FROM product_variants 
            WHERE id = v_id;

            IF variant_price IS NULL THEN
                RAISE EXCEPTION 'Invalid variant ID: %', v_id;
            END IF;
        END IF;

        item_cost := variant_price * qty;
        total_cost := total_cost + item_cost;
    END LOOP;
    
    -- 3. Add Shipping Fee (75 EGP if subtotal < 2,000 EGP)
    -- Units are in atomic units (e.g. 100 per EGP)
    IF total_cost > 0 AND total_cost < 200000 THEN
        total_cost := total_cost + 7500;
    END IF;

    -- 4. Determine User ID (if any)
    cust_id := auth.uid();

    -- 4. Insert Order
    INSERT INTO orders (
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_amount,
        payment_method,
        payment_proof_url,
        status,
        user_id,
        created_at
    ) VALUES (
        customer_data->>'name',
        customer_data->>'email',
        customer_data->>'phone',
        customer_data->>'address',
        total_cost,
        payment_method,
        proof_url,
        'pending',
        cust_id,
        NOW()
    ) RETURNING id INTO new_order_id;

    -- 5. Insert Order Items
    FOR item IN SELECT * FROM jsonb_array_elements(items)
    LOOP
        v_id := (item->>'variant_id')::UUID;
        p_id := (item->>'product_id')::UUID;
        qty := (item->>'quantity')::INTEGER;
        
        -- Re-fetch price for accuracy in line item
        IF v_id IS NOT NULL THEN
             SELECT price INTO variant_price FROM product_variants WHERE id = v_id;
        ELSE
             variant_price := 0;
        END IF;

        INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            quantity,
            price_at_purchase
        ) VALUES (
            new_order_id,
            p_id,
            v_id,
            qty,
            variant_price
        );
    END LOOP;

    RETURN jsonb_build_object('id', new_order_id, 'total', total_cost);
END;
$$;

-- Grant access to public (guests) and authenticated users
GRANT EXECUTE ON FUNCTION create_order_secure TO anon, authenticated;
