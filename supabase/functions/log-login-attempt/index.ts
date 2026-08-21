import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(supabaseUrl, serviceRoleKey)

  const { identifier, success, auth_user_id } = await req.json()

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const userAgent = req.headers.get('user-agent') ?? 'unknown'

  let staffId: string | null = null
  if (auth_user_id) {
    const { data } = await admin
      .from('staff_profiles')
      .select('id')
      .eq('auth_user_id', auth_user_id)
      .maybeSingle()
    staffId = data?.id ?? null
  }

  const { error } = await admin.from('staff_login_activity').insert({
    staff_id: staffId,
    attempted_identifier: identifier ?? null,
    ip_address: ip,
    user_agent: userAgent,
    success: !!success,
  })

  if (error) {
    console.error('[log-login-attempt] failed to insert login activity', { error: error.message })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})