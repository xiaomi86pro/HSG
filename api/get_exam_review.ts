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
    // 1️⃣ Get exam
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, score, total_questions, submitted_at')
      .eq('user_id', auth.userId)
      .single()

    if (examError || !exam) {
      return res.status(404).json({ error: 'Exam not found' })
    }

    if (!exam.submitted_at) {
      return res.status(400).json({ error: 'Exam not submitted yet' })
    }

    // 2️⃣ Get questions of exam
    const { data: examQuestions, error: eqError } = await supabase
      .from('exam_questions')
      .select('question_id, question_order')
      .eq('exam_id', exam_id)
      .order('question_order', { ascending: true })

    if (eqError) {
      return res.status(500).json({ error: eqError.message })
    }

    if (!examQuestions || examQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found for exam' })
    }

    const questionIds = examQuestions.map(q => q.question_id)

    // 3️⃣ Get questions data
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question_text, explanation')
      .in('id', questionIds)

    if (qError) {
      return res.status(500).json({ error: qError.message })
    }

    if (!questions) {
      return res.status(500).json({ error: 'Failed to load questions' })
    }

    // 4️⃣ Get options
    const { data: options, error: optError } = await supabase
      .from('options')
      .select('id, question_id, option_label, option_text, is_correct')
      .in('question_id', questionIds)
      .order('option_label', { ascending: true })

    if (optError) {
      return res.status(500).json({ error: optError.message })
    }

    if (!options) {
      return res.status(500).json({ error: 'Failed to load options' })
    }

    // 5️⃣ Get user answers
    const { data: userAnswers, error: uaError } = await supabase
      .from('user_answers')
      .select('question_id, selected_option_id')
      .eq('exam_id', exam_id)

    if (uaError) {
      return res.status(500).json({ error: uaError.message })
    }

    const safeUserAnswers = userAnswers ?? []

    const formattedQuestions = examQuestions.map(eq => {
    const question = questions.find(q => q.id === eq.question_id)

    const questionOptions = options
      .filter(opt => opt.question_id === eq.question_id)
      .map(opt => {
        const userAnswer = safeUserAnswers.find(
          ua => ua.question_id === eq.question_id
        )

        return {
          ...opt,
          is_selected: userAnswer?.selected_option_id === opt.id
        }
      })

    return {
      question_id: question?.id,
      question_text: question?.question_text,
      explanation: question?.explanation,
      question_order: eq.question_order,
      options: questionOptions
    }
  })

    return res.status(200).json({
      exam_id: exam.id,
      score: exam.score,
      total: exam.total_questions,
      questions: formattedQuestions
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
