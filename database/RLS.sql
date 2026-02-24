-- ==============================
-- RLS POLICIES
-- ==============================

[
  {
    "policyname": "examq_admin_all",
    "schemaname": "public",
    "tablename": "exam_questions",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))"
  },
  {
    "policyname": "examq_student_insert",
    "schemaname": "public",
    "tablename": "exam_questions",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM exams\n  WHERE ((exams.id = exam_questions.exam_id) AND (exams.user_id = auth.uid()))))"
  },
  {
    "policyname": "examq_student_select",
    "schemaname": "public",
    "tablename": "exam_questions",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM exams\n  WHERE ((exams.id = exam_questions.exam_id) AND (exams.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "policyname": "examq_teacher_select",
    "schemaname": "public",
    "tablename": "exam_questions",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))",
    "with_check": null
  },
  {
    "policyname": "templates_admin_all",
    "schemaname": "public",
    "tablename": "exam_templates",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))"
  },
  {
    "policyname": "templates_student_select",
    "schemaname": "public",
    "tablename": "exam_templates",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "policyname": "templates_teacher_manage",
    "schemaname": "public",
    "tablename": "exam_templates",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))"
  },
  {
    "policyname": "exams_admin_all",
    "schemaname": "public",
    "tablename": "exams",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))"
  },
  {
    "policyname": "exams_student_insert",
    "schemaname": "public",
    "tablename": "exams",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(user_id = auth.uid())"
  },
  {
    "policyname": "exams_student_select",
    "schemaname": "public",
    "tablename": "exams",
    "cmd": "SELECT",
    "qual": "(user_id = auth.uid())",
    "with_check": null
  },
  {
    "policyname": "exams_student_update",
    "schemaname": "public",
    "tablename": "exams",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) AND (submitted_at IS NULL))",
    "with_check": "(user_id = auth.uid())"
  },
  {
    "policyname": "exams_teacher_select",
    "schemaname": "public",
    "tablename": "exams",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))",
    "with_check": null
  },
  {
    "policyname": "profiles_admin_all",
    "schemaname": "public",
    "tablename": "profiles",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::user_role))))"
  },
  {
    "policyname": "profiles_student_select",
    "schemaname": "public",
    "tablename": "profiles",
    "cmd": "SELECT",
    "qual": "(id = auth.uid())",
    "with_check": null
  },
  {
    "policyname": "questions_admin_all",
    "schemaname": "public",
    "tablename": "questions",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))"
  },
  {
    "policyname": "questions_student_select",
    "schemaname": "public",
    "tablename": "questions",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "policyname": "questions_teacher_manage",
    "schemaname": "public",
    "tablename": "questions",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))"
  },
  {
    "policyname": "answers_admin_all",
    "schemaname": "public",
    "tablename": "user_answers",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))"
  },
  {
    "policyname": "answers_student_insert",
    "schemaname": "public",
    "tablename": "user_answers",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM exams\n  WHERE ((exams.id = user_answers.exam_id) AND (exams.user_id = auth.uid()) AND (exams.submitted_at IS NULL))))"
  },
  {
    "policyname": "answers_student_select",
    "schemaname": "public",
    "tablename": "user_answers",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM exams\n  WHERE ((exams.id = user_answers.exam_id) AND (exams.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "policyname": "answers_student_update",
    "schemaname": "public",
    "tablename": "user_answers",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM exams\n  WHERE ((exams.id = user_answers.exam_id) AND (exams.user_id = auth.uid()) AND (exams.submitted_at IS NULL))))",
    "with_check": null
  },
  {
    "policyname": "answers_teacher_select",
    "schemaname": "public",
    "tablename": "user_answers",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'teacher'::user_role))))",
    "with_check": null
  }
]