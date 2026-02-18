import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { exam_id, answers } = req.body

  if (!exam_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  try {
    // 1️⃣ Check exam exists & not submitted
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, submitted_at, total_questions')
      .eq('id', exam_id)
      .single()

    if (examError || !exam) {
      return res.status(404).json({ error: 'Exam not found' })
    }

    if (exam.submitted_at) {
      return res.status(400).json({ error: 'Exam already submitted' })
    }

    // 2️⃣ Get valid question_ids of this exam
    const { data: examQuestions, error: eqError } = await supabase
      .from('exam_questions')
      .select('question_id')
      .eq('exam_id', exam_id)

    if (eqError) {
      return res.status(500).json({ error: 'Failed to load exam questions' })
    }

    const validQuestionIds = examQuestions.map(q => q.question_id)

    let correctCount = 0
    const inserts: any[] = []

    for (const ans of answers) {
      if (!validQuestionIds.includes(ans.question_id)) {
        return res.status(400).json({ error: 'Invalid question in answers' })
      }

      // Check correct option
      const { data: option, error: optionError } = await supabase
        .from('options')
        .select('is_correct')
        .eq('id', ans.selected_option_id)
        .eq('question_id', ans.question_id)
        .single()

      if (optionError || !option) {
        return res.status(400).json({ error: 'Invalid option selected' })
      }

      if (option.is_correct) {
        correctCount++
      }

      inserts.push({
        exam_id,
        question_id: ans.question_id,
        selected_option_id: ans.selected_option_id,
        is_correct: option.is_correct
      })
    }

    // 3️⃣ Insert all answers
    const { error: insertError } = await supabase
      .from('user_answers')
      .insert(inserts)

    if (insertError) {
      return res.status(500).json({ error: 'Failed to save answers' })
    }

    // 4️⃣ Update exam score + submitted_at
    const { error: updateError } = await supabase
      .from('exams')
      .update({
        score: correctCount,
        submitted_at: new Date().toISOString()
      })
      .eq('id', exam_id)

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update exam' })
    }

    return res.status(200).json({
      message: 'Exam submitted successfully',
      score: correctCount,
      total: exam.total_questions
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
