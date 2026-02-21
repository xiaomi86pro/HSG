import { authenticateRequest, supabase } from './_auth'

  export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if ('error' in auth) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const { data, error } = await supabase
    .from('exams')
    .select('id, score, total_questions, created_at, submitted_at')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ exams: data })
}