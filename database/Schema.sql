-- ==============================
-- TABLES & COLUMNS
-- ==============================

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.exam_questions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  exam_id bigint NOT NULL,
  question_id bigint NOT NULL,
  question_order integer NOT NULL,
  CONSTRAINT exam_questions_pkey PRIMARY KEY (id),
  CONSTRAINT exam_questions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id),
  CONSTRAINT exam_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.exam_templates (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  grade_level integer NOT NULL CHECK (grade_level >= 6 AND grade_level <= 12),
  structure jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT exam_templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.exams (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  grade_level integer NOT NULL CHECK (grade_level > 0),
  created_at timestamp with time zone DEFAULT now(),
  submitted_at timestamp with time zone,
  score integer DEFAULT 0,
  total_questions integer NOT NULL,
  CONSTRAINT exams_pkey PRIMARY KEY (id),
  CONSTRAINT exams_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.options (
  id bigint NOT NULL DEFAULT nextval('options_id_seq'::regclass),
  question_id bigint NOT NULL,
  option_label character NOT NULL CHECK (option_label = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])),
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  CONSTRAINT options_pkey PRIMARY KEY (id),
  CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.passages (
  id bigint NOT NULL DEFAULT nextval('passages_id_seq'::regclass),
  title character varying,
  content text NOT NULL,
  passage_type character varying NOT NULL CHECK (passage_type::text = ANY (ARRAY['reading'::character varying, 'listening'::character varying]::text[])),
  audio_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT passages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'student'::user_role,
  exp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.question_tags (
  question_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT question_tags_pkey PRIMARY KEY (question_id, tag_id),
  CONSTRAINT question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT question_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.question_text_answers (
  id bigint NOT NULL DEFAULT nextval('question_text_answers_id_seq'::regclass),
  question_id bigint NOT NULL,
  accepted_answer text NOT NULL,
  CONSTRAINT question_text_answers_pkey PRIMARY KEY (id),
  CONSTRAINT question_text_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.question_types (
  id bigint NOT NULL DEFAULT nextval('question_types_id_seq'::regclass),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT question_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.questions (
  id bigint NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
  question_type_id bigint NOT NULL,
  passage_id bigint,
  question_text text NOT NULL,
  grade_level integer NOT NULL CHECK (grade_level >= 6 AND grade_level <= 12),
  explanation text,
  created_at timestamp with time zone DEFAULT now(),
  difficulty smallint NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_question_type_id_fkey FOREIGN KEY (question_type_id) REFERENCES public.question_types(id),
  CONSTRAINT questions_passage_id_fkey FOREIGN KEY (passage_id) REFERENCES public.passages(id)
);
CREATE TABLE public.tags (
  id bigint NOT NULL DEFAULT nextval('tags_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_answers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  exam_id bigint NOT NULL,
  question_id bigint NOT NULL,
  selected_option_id bigint,
  is_correct boolean,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  answer_text text,
  CONSTRAINT user_answers_pkey PRIMARY KEY (id),
  CONSTRAINT user_answers_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id),
  CONSTRAINT user_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT user_answers_selected_option_id_fkey FOREIGN KEY (selected_option_id) REFERENCES public.options(id)
);

-- ==============================
-- ENUM TYPES
-- ==============================

[
  {
    "schema": "auth",
    "enum_type": "factor_type",
    "enum_value": "totp"
  },
  {
    "schema": "auth",
    "enum_type": "factor_type",
    "enum_value": "webauthn"
  },
  {
    "schema": "auth",
    "enum_type": "factor_status",
    "enum_value": "unverified"
  },
  {
    "schema": "auth",
    "enum_type": "factor_status",
    "enum_value": "verified"
  },
  {
    "schema": "auth",
    "enum_type": "aal_level",
    "enum_value": "aal1"
  },
  {
    "schema": "auth",
    "enum_type": "aal_level",
    "enum_value": "aal2"
  },
  {
    "schema": "auth",
    "enum_type": "aal_level",
    "enum_value": "aal3"
  },
  {
    "schema": "auth",
    "enum_type": "code_challenge_method",
    "enum_value": "s256"
  },
  {
    "schema": "auth",
    "enum_type": "code_challenge_method",
    "enum_value": "plain"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "confirmation_token"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "reauthentication_token"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "recovery_token"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "email_change_token_new"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "email_change_token_current"
  },
  {
    "schema": "auth",
    "enum_type": "one_time_token_type",
    "enum_value": "phone_change_token"
  },
  {
    "schema": "auth",
    "enum_type": "factor_type",
    "enum_value": "phone"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_registration_type",
    "enum_value": "dynamic"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_registration_type",
    "enum_value": "manual"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_authorization_status",
    "enum_value": "pending"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_authorization_status",
    "enum_value": "approved"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_authorization_status",
    "enum_value": "denied"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_authorization_status",
    "enum_value": "expired"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_response_type",
    "enum_value": "code"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_client_type",
    "enum_value": "public"
  },
  {
    "schema": "auth",
    "enum_type": "oauth_client_type",
    "enum_value": "confidential"
  },
  {
    "schema": "storage",
    "enum_type": "buckettype",
    "enum_value": "STANDARD"
  },
  {
    "schema": "storage",
    "enum_type": "buckettype",
    "enum_value": "ANALYTICS"
  },
  {
    "schema": "storage",
    "enum_type": "buckettype",
    "enum_value": "VECTOR"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "eq"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "neq"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "lt"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "lte"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "gt"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "gte"
  },
  {
    "schema": "realtime",
    "enum_type": "action",
    "enum_value": "INSERT"
  },
  {
    "schema": "realtime",
    "enum_type": "action",
    "enum_value": "UPDATE"
  },
  {
    "schema": "realtime",
    "enum_type": "action",
    "enum_value": "DELETE"
  },
  {
    "schema": "realtime",
    "enum_type": "action",
    "enum_value": "TRUNCATE"
  },
  {
    "schema": "realtime",
    "enum_type": "action",
    "enum_value": "ERROR"
  },
  {
    "schema": "realtime",
    "enum_type": "equality_op",
    "enum_value": "in"
  },
  {
    "schema": "public",
    "enum_type": "user_role",
    "enum_value": "admin"
  },
  {
    "schema": "public",
    "enum_type": "user_role",
    "enum_value": "teacher"
  },
  {
    "schema": "public",
    "enum_type": "user_role",
    "enum_value": "student"
  }
]