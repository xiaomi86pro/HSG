// @ts-nocheck

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const body = await req.json()

    const {
      question_text,
      explanation,
      question_type_id,
      difficulty,
      grade_level,
      options,
    } = body

    // ===== VALIDATION =====
    if (!question_text || !question_type_id || !options) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      )
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return new Response(
        JSON.stringify({ error: "MCQ must have exactly 4 options" }),
        { status: 400 }
      )
    }

    const correctCount = options.filter(o => o.is_correct === true).length

    if (correctCount !== 1) {
      return new Response(
        JSON.stringify({ error: "MCQ must have exactly 1 correct answer" }),
        { status: 400 }
      )
    }

        // ===== CALL DATABASE TRANSACTION FUNCTION =====
    const { data, error } = await supabase.rpc("create_mcq_question", {
      p_question_text: question_text,
      p_explanation: explanation,
      p_question_type_id: question_type_id,
      p_difficulty: difficulty,
      p_grade_level: grade_level,
      p_options: options,
    })

    if (error) {
      if (error.message?.includes("unique_question_text_grade")) {
        return new Response(
          JSON.stringify({ error: "Question already exists for this grade level" }),
          { status: 400 }
        )
      }

      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }


    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    })

  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 })
  }
})
