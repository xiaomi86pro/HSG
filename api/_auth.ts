import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!, // ❗ dùng ANON key
  {
    auth: {
      persistSession: false
    }
  }
)

export type AuthResult =
  | { userId: string }
  | { error: string; status: number }

export async function authenticateRequest(req: any): Promise<AuthResult> {
  const authHeader = req.headers?.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing token', status: 401 }
  }

  const token = authHeader.slice('Bearer '.length).trim()

  if (!token) {
    return { error: 'Missing token', status: 401 }
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { error: 'Invalid token', status: 401 }
  }

  return { userId: user.id }
}

export { supabase }