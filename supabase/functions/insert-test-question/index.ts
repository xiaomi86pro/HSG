// supabase/functions/insert-test-question/index.ts
// @ts-nocheck

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          question_text: "Test question from Edge Function",
          explanation: "This is a test insert",
          question_type_id: 3,
          difficulty: 1,
          grade_level: 12,
          is_active: true,
        },
      ])

      .select()

    if (error) {
      return new Response(JSON.stringify(error), { status: 400 })
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 })
  }
})
