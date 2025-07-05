import { createClient } from 'npm:@supabase/supabase-js@2';

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

// Supabase 클라이언트 초기화
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? 'https://aqfforpyaqdjzcgjxcir.supabase.co',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmZvcnB5YXFkanpjZ2p4Y2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg4ODIyNiwiZXhwIjoyMDY1NDY0MjI2fQ.QEPO6r9dXAklhKgKeuNGw3Kg0vK1VDm0y7CEKbfRJrw'
);

// Toss Payments 웹훅 처리
Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { eventType, data } = body;

    // 결제 승인 이벤트만 처리
    if (eventType === 'PAYMENT_STATUS_CHANGED' && data.status === 'DONE') {
      const { orderId } = data; // orderId는 고객의 user_id로 가정합니다.

      // user_profiles 테이블에서 해당 유저의 plan을 'pro'로 업데이트
      const { error } = await supabase
        .from('user_profiles')
        .update({ plan: 'pro' })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase update error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user plan.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.log(`User ${orderId} plan updated to pro.`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 다른 이벤트는 무시
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/toss-payments-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
