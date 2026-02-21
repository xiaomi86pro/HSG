import { authenticateRequest, supabase } from './_auth'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if ('error' in auth) {
    return res.status(auth.status).json({ error: auth.error })
  }

  try {
    const userId = auth.userId
    const { grade_level } = req.body

    // check unsubmitted exam
    const { data: existing } = await supabase
      .from('exams')
      .select('id')
      .eq('user_id', userId)
      .is('submitted_at', null)
      .maybeSingle()

    if (existing) {
      return res.status(400).json({ error: 'Unsubmitted exam exists' })
    }

    // get active template
    const { data: template } = await supabase
      .from('exam_templates')
      .select('*')
      .eq('grade_level', grade_level)
      .eq('is_active', true)
      .single()

    if (!template) {
      return res.status(400).json({ error: 'No template found' })
    }

    const structure = template.structure
    const selected: any[] = []

    for (const section of structure) {
      const { question_type_id, count } = section

      const { data: questions } = await supabase
        .from('questions')
        .select('id')
        .eq('grade_level', grade_level)
        .eq('question_type_id', question_type_id)
        .eq('is_active', true)
        .limit(count)

      if (!questions || questions.length < count) {
        return res.status(400).json({ error: 'Not enough questions' })
      }

      selected.push(...questions)
    }

    const { data: exam } = await supabase
      .from('exams')
      .insert({
        user_id: userId,
        grade_level,
        total_questions: selected.length
      })
      .select()
      .single()

    const payload = selected.map((q, i) => ({
      exam_id: exam.id,
      question_id: q.id,
      question_order: i + 1
    }))

    await supabase.from('exam_questions').insert(payload)

    return res.status(200).json({ exam_id: exam.id })

  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
