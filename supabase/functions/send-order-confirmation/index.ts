import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const VERO_GOLD = "#D4AF37"

serve(async (req) => {
    try {
        const { record } = await req.json()
        const orderId = record.id
        const customerEmail = record.customer_email
        const customerName = record.customer_name

        // Initialize Supabase client
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // Fetch line items with product details
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
        quantity,
        price_at_purchase,
        products (title_en, title_ar),
        product_variants (size, color_en, color_ar)
      `)
            .eq('order_id', orderId)

        if (itemsError) throw itemsError

        // Calculate subtotal
        const subtotal = items.reduce((acc, item) => acc + (item.price_at_purchase * item.quantity), 0) / 100
        const total = record.total_amount / 100
        const shipping = total - subtotal

        // Generate HTML Table for items
        const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
          <div style="font-weight: bold; color: #000000; font-size: 14px;">
            ${item.products.title_en}
          </div>
          <div style="font-size: 12px; color: #666666;">
            ${item.product_variants.size} / ${item.product_variants.color_en}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: center; color: #666666;">
          x${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold; color: #000000;">
          EGP ${((item.price_at_purchase * item.quantity) / 100).toLocaleString()}
        </td>
      </tr>
    `).join('')

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #000000; color: #ffffff; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; font-style: italic; }
        .content { padding: 40px 30px; }
        .invoice-title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        .total-section { margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        .btn { display: inline-block; padding: 12px 30px; background-color: ${VERO_GOLD}; color: #000; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>VERO EGYPT</h1>
        </div>
        <div class="content">
          <div class="invoice-title">Order Confirmation</div>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Thank you for your order! We're getting it ready for you. Below is your invoice for order <strong>#${orderId.slice(0, 8)}</strong>.</p>
          
          <table style="margin-top: 30px;">
            <thead>
              <tr style="text-align: left; font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px;">
                <th style="padding-bottom: 10px;">Item</th>
                <th style="padding-bottom: 10px; text-align: center;">Qty</th>
                <th style="padding-bottom: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span style="color: #666;">Subtotal</span>
              <span>EGP ${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span style="color: #666;">Shipping</span>
              <span>EGP ${shipping.toLocaleString()}</span>
            </div>
            <div class="total-row" style="font-size: 24px; font-weight: 900; margin-top: 10px; color: #000;">
              <span>Total</span>
              <span>EGP ${total.toLocaleString()}</span>
            </div>
          </div>

          <p style="margin-top: 40px; font-size: 14px; color: #666;">
            <strong>Shipping Address:</strong><br>
            ${record.shipping_address}
          </p>

          <center>
            <a href="https://veroegypt.com/shop" class="btn">Return to Shop</a>
          </center>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Vero Egypt. All rights reserved.<br>
          Cairo, Egypt
        </div>
      </div>
    </body>
    </html>
    `

        // Send email via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Vero Egypt <orders@veroegypt.com>', // Replace with your verified domain
                to: [customerEmail],
                subject: `Order Confirmation #${orderId.slice(0, 8)} - Vero Egypt`,
                html: htmlContent,
            }),
        })

        const resData = await res.json()
        console.log('Resend Response:', resData)

        return new Response(JSON.stringify({ success: true, id: resData.id }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
