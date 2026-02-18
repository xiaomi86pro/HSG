import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user_id } = req.query

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' })
  }

  try {
    const { data, error } = await supabase
      .from('exams')
      .select('id')
      .eq('user_id', user_id)
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
