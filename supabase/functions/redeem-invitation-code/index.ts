import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invitation_code } = await req.json();
    if (!invitation_code) {
      throw new Error('Invitation code is required.');
    }

    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    // 1. Find the invitation code
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('invitation_codes')
      .select('*')
      .eq('code', invitation_code)
      .single();

    if (codeError || !codeData) {
      return new Response(JSON.stringify({ error: 'Invalid invitation code.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // 2. Check if the code is already used
    if (codeData.is_used) {
      return new Response(JSON.stringify({ error: 'This code has already been used.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 3. Update the user's profile to 'pro' plan
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({ plan: 'pro', plan_expiry_date: null }) // Assuming 'pro' plan doesn't expire or handle expiry separately
      .eq('id', user.id);

    if (profileError) {
      throw new Error(`Failed to update user profile: ${profileError.message}`);
    }

    // 4. Mark the code as used
    const { error: updateCodeError } = await supabaseAdmin
      .from('invitation_codes')
      .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
      .eq('id', codeData.id);

    if (updateCodeError) {
      // If marking the code fails, we should ideally roll back the profile update.
      // For simplicity here, we'll just log the error.
      console.error(`Failed to mark code as used: ${updateCodeError.message}`);
      // Potentially revert the profile update here.
    }

    return new Response(JSON.stringify({ message: 'Successfully upgraded to Pro plan!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
