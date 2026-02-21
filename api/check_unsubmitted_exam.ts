import { authenticateRequest, supabase } from './_auth'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if ('error' in auth) {
    return res.status(auth.status).json({ error: auth.error })
  }

  try {
    const { data, error } = await supabase
      .from('exams')
      .select('id')
      .eq('user_id', auth.userId)
      .is('submitted_at', null)
      .limit(1)
      .maybeSingle()

    if (error) {
      return res.status(500).json({ error: 'Failed to check exam' })
    }

    if (!data) {
      return res.status(200).json({
        has_unsubmitted: false,
        exam_id: null
      })
    }

    return res.status(200).json({
      has_unsubmitted: true,
      exam_id: data.id
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
