import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PayPalOrder {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { orderId, transactionId } = await req.json();

    if (!orderId || !transactionId) {
      throw new Error('Missing orderId or transactionId');
    }

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalSecret = Deno.env.get('PAYPAL_SECRET_KEY');
    const paypalMode = Deno.env.get('PAYPAL_MODE') || 'sandbox';

    if (!paypalClientId || !paypalSecret) {
      throw new Error('PayPal credentials not configured');
    }

    const paypalBaseUrl =
      paypalMode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${paypalClientId}:${paypalSecret}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with PayPal');
    }

    const { access_token } = await authResponse.json();

    const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to verify PayPal order');
    }

    const order: PayPalOrder = await orderResponse.json();

    if (order.status !== 'COMPLETED') {
      throw new Error('Order not completed');
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('credits_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (transactionError || !transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'success') {
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const paidAmount = parseFloat(order.purchase_units[0].amount.value);
    const expectedAmount = transaction.amount_usd;

    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      throw new Error('Amount mismatch');
    }

    const { error: updateError } = await supabase
      .from('credits_transactions')
      .update({
        status: 'success',
        paypal_order_id: orderId,
        processed_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    if (updateError) throw updateError;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const newBalance = (profile?.credits_balance ?? 0) + transaction.credits_purchased;

    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ credits_balance: newBalance })
      .eq('id', user.id);

    if (balanceError) throw balanceError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and credits added',
        credits: transaction.credits_purchased,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
