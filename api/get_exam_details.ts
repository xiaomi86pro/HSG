import { authenticateRequest, supabase } from './_auth'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await authenticateRequest(req)
  if ('error' in auth) {
    return res.status(auth.status).json({ error: auth.error })
  }

  const { exam_id } = req.query

  if (!exam_id) {
    return res.status(400).json({ error: 'exam_id is required' })
  }

  try {
    // 1️⃣ Check exam exists and belongs to current user
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, submitted_at')
      .eq('id', exam_id)
      .eq('user_id', auth.userId)
      .single()

    if (examError || !exam) {
      return res.status(404).json({ error: 'Exam not found' })
    }

    // 2️⃣ Get exam questions ordered
    const { data: examQuestions, error: eqError } = await supabase
      .from('exam_questions')
      .select('question_id, question_order')
      .eq('exam_id', exam_id)
      .order('question_order', { ascending: true })

    if (eqError) {
      return res.status(500).json({ error: 'Failed to load exam questions' })
    }

    const questionIds = examQuestions.map(q => q.question_id)

    // 3️⃣ Get question details
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question_text')
      .in('id', questionIds)

    if (qError) {
      return res.status(500).json({ error: 'Failed to load questions' })
    }

    // 4️⃣ Get options (NO is_correct)
    const { data: options, error: oError } = await supabase
      .from('options')
      .select('id, question_id, option_label, option_text')
      .in('question_id', questionIds)
      .order('option_label', { ascending: true })

    if (oError) {
      return res.status(500).json({ error: 'Failed to load options' })
    }

    // 5️⃣ Build response structure
    const formattedQuestions = examQuestions.map(eq => {
      const question = questions.find(q => q.id === eq.question_id)

      const questionOptions = options.filter(
        opt => opt.question_id === eq.question_id
      )

      return {
        question_id: question?.id,
        question_text: question?.question_text,
        question_order: eq.question_order,
        options: questionOptions
      }
    })

    return res.status(200).json({
      exam_id: exam.id,
      submitted_at: exam.submitted_at,
      questions: formattedQuestions
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
