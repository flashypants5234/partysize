import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STAFF_EMAIL_DOMAIN = 'staff.internal'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const token = authHeader.replace('Bearer ', '')

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: userData, error: userError } = await callerClient.auth.getUser(token)

  if (userError || !userData.user) {
    console.error('[create-staff-user] failed to resolve caller', { error: userError?.message })
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const admin = createClient(supabaseUrl, serviceRoleKey)

  const { data: callerProfile } = await admin
    .from('staff_profiles')
    .select('id, role')
    .eq('auth_user_id', userData.user.id)
    .eq('active', true)
    .eq('banned', false)
    .maybeSingle()

  if (!callerProfile || callerProfile.role !== 'admin') {
    console.error('[create-staff-user] non-admin attempted to create staff user', { userId: userData.user.id })
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { username, password, role, display_name } = await req.json()

  if (!username || !password || !role || !['admin', 'worker'].includes(role)) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const normalizedUsername = String(username).trim().toLowerCase()
  const syntheticEmail = `${normalizedUsername}@${STAFF_EMAIL_DOMAIN}`

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,
  })

  if (createError || !newUser.user) {
    console.error('[create-staff-user] failed to create auth user', { error: createError?.message })
    return new Response(JSON.stringify({ error: createError?.message ?? 'Failed to create user' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { error: profileError } = await admin.from('staff_profiles').insert({
    auth_user_id: newUser.user.id,
    role,
    display_name: display_name ?? normalizedUsername,
    created_by: callerProfile.id,
  })

  if (profileError) {
    console.error('[create-staff-user] failed to insert staff profile', { error: profileError.message })
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})