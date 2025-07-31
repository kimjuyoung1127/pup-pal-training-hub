

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."plan_type" AS ENUM (
    'free',
    'pro'
);


ALTER TYPE "public"."plan_type" OWNER TO "postgres";


CREATE TYPE "public"."post_category" AS ENUM (
    'general',
    'qna',
    'gallery'
);


ALTER TYPE "public"."post_category" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_article_from_suggestion"("p_suggestion_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  selected_suggestion public.suggested_topics;
  new_article_id uuid;
  new_slug TEXT;
BEGIN
  -- 1. 제안된 토픽 정보를 가져옵니다.
  SELECT * INTO selected_suggestion FROM public.suggested_topics WHERE id = p_suggestion_id;

  -- 2. 제목을 기반으로 간단한 슬러그(slug)를 생성합니다.
  new_slug := lower(
    regexp_replace(selected_suggestion.suggested_title_ko, '[^a-zA-Z0-9가-힣\s-]', '', 'g')
  );
  new_slug := regexp_replace(trim(new_slug), '\s+', '-', 'g');

  -- 3. articles 테이블에 초안으로 삽입합니다.
  INSERT INTO public.articles (
    title,
    summary,
    category,
    cover_image_url,
    original_source_url,
    is_published,
    content,
    slug,
    view_count,
    tags,
    suggestion_id
  )
  VALUES (
    selected_suggestion.suggested_title_ko,
    selected_suggestion.summary_ko,
    selected_suggestion.category,
    selected_suggestion.image_url,
    selected_suggestion.original_url,
    false,
    COALESCE(
      selected_suggestion.initial_draft_markdown,
      '# ' || selected_suggestion.suggested_title_ko || E'\n\n' || selected_suggestion.summary_ko
    ),
    new_slug || '-' || substr(md5(random()::text), 0, 7),
    0,
    '{}', -- 빈 태그 배열
    p_suggestion_id
  ) RETURNING id INTO new_article_id;

  -- 4. 제안된 토픽의 상태를 'draft'로 업데이트하여 명확하게 합니다.
  UPDATE public.suggested_topics SET status = 'draft' WHERE id = p_suggestion_id;

  -- 5. 새로 생성된 article의 id를 반환합니다.
  RETURN new_article_id;
END;
$$;


ALTER FUNCTION "public"."create_article_from_suggestion"("p_suggestion_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_breeds"("p_answers" "jsonb") RETURNS TABLE("id" "uuid", "name_ko" "text", "name_en" "text", "thumbnail_url" "text", "size_type" "text")
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name_ko,
    b.name_en,
    b.thumbnail_url,
    b.size_type
  FROM
    breeds b
  JOIN
    breed_details bd ON b.id = bd.breed_id
  WHERE
    (
      (p_answers->>'environment' = 'apartment' AND bd.barking_level <= 3 AND b.size_type IN ('소형', '중형')) OR
      (p_answers->>'environment' = 'houseWithYard' AND b.size_type IN ('중형', '대형')) OR
      (p_answers->>'environment' IS NULL)
    )
  AND
    (
      (p_answers->>'activity' = 'calm' AND bd.energy_level <= 2) OR
      (p_answers->>'activity' = 'moderate' AND bd.energy_level BETWEEN 3 AND 4) OR
      (p_answers->>'activity' = 'active' AND bd.energy_level >= 4) OR
      (p_answers->>'activity' IS NULL)
    )
  AND
    (
      (p_answers->>'social' = 'alone' AND bd.friendliness_with_strangers <= 2) OR
      (p_answers->>'social' = 'family' AND bd.friendliness_with_kids >= 3) OR
      (p_answers->>'social' = 'socialButterfly' AND bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4) OR
      (p_answers->>'social' IS NULL)
    )
  AND
    (
      (p_answers->>'care' = 'easy' AND bd.trainability >= 4 AND bd.grooming_needs <= 2) OR
      (p_answers->>'care' = 'medium' AND bd.trainability >= 3) OR
      (p_answers->>'care' = 'hard') OR
      (p_answers->>'care' IS NULL)
    )
  AND
    (
      (p_answers->>'playfulness' = 'low' AND bd.playfulness <= 2) OR
      (p_answers->>'playfulness' = 'medium' AND bd.playfulness BETWEEN 3 AND 4) OR
      (p_answers->>'playfulness' = 'high' AND bd.playfulness >= 4) OR
      (p_answers->>'playfulness' IS NULL)
    )
  AND
    (
      (p_answers->>'affection' = 'low' AND bd.affection_level <= 2) OR
      (p_answers->>'affection' = 'medium' AND bd.affection_level BETWEEN 3 AND 4) OR
      (p_answers->>'affection' = 'high' AND bd.affection_level >= 4) OR
      (p_answers->>'affection' IS NULL)
    )
  AND
    (
      (p_answers->>'exercise' = 'low' AND bd.exercise_needs <= 2) OR
      (p_answers->>'exercise' = 'medium' AND bd.exercise_needs BETWEEN 3 AND 4) OR
      (p_answers->>'exercise' = 'high' AND bd.exercise_needs >= 4) OR
      (p_answers->>'exercise' IS NULL)
    )
  ORDER BY
    b.popularity_score DESC;
END;
$$;


ALTER FUNCTION "public"."get_filtered_breeds"("p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_breeds_v2"("p_answers" "jsonb") RETURNS TABLE("id" "uuid", "name_ko" "text", "name_en" "text", "thumbnail_url" "text", "size_type" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name_ko,
    b.name_en,
    b.thumbnail_url,
    b.size_type
  FROM
    breeds b
  JOIN
    breed_details bd ON b.id = bd.breed_id
  WHERE
    -- 1. 환경 (environment)
    CASE
      WHEN p_answers->>'environment' = 'apartment' THEN bd.barking_level <= 3 AND b.size_type IN ('소형', '중형')
      WHEN p_answers->>'environment' = 'houseWithYard' THEN b.size_type IN ('중형', '대형')
      ELSE TRUE
    END
  AND
    -- 2. 활동 (activity)
    CASE
      WHEN p_answers->>'activity' = 'calm' THEN bd.energy_level <= 2
      WHEN p_answers->>'activity' = 'moderate' THEN bd.energy_level BETWEEN 3 AND 4
      WHEN p_answers->>'activity' = 'active' THEN bd.energy_level >= 4
      ELSE TRUE
    END
  AND
    -- 3. 사회성 (social)
    CASE
      WHEN p_answers->>'social' = 'alone' THEN bd.friendliness_with_strangers <= 2
      WHEN p_answers->>'social' = 'family' THEN bd.friendliness_with_kids >= 3
      WHEN p_answers->>'social' = 'socialButterfly' THEN bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4
      ELSE TRUE
    END
  AND
    -- 4. 관리 (care)
    CASE
      WHEN p_answers->>'care' = 'easy' THEN bd.trainability >= 4 AND bd.grooming_needs <= 2
      WHEN p_answers->>'care' = 'medium' THEN bd.trainability >= 3
      WHEN p_answers->>'care' = 'hard' THEN TRUE
      ELSE TRUE
    END
  AND
    -- 5. 놀이성 (playfulness)
    CASE
      WHEN p_answers->>'playfulness' = 'low' THEN bd.playfulness <= 2
      WHEN p_answers->>'playfulness' = 'medium' THEN bd.playfulness BETWEEN 3 AND 4
      WHEN p_answers->>'playfulness' = 'high' THEN bd.playfulness >= 5
      ELSE TRUE
    END
  AND
    -- 6. 애정 (affection)
    CASE
      WHEN p_answers->>'affection' = 'low' THEN bd.affection_level <= 2
      WHEN p_answers->>'affection' = 'medium' THEN bd.affection_level BETWEEN 3 AND 4
      WHEN p_answers->>'affection' = 'high' THEN bd.affection_level >= 5
      ELSE TRUE
    END
  AND
    -- 7. 운동 (exercise)
    CASE
      WHEN p_answers->>'exercise' = 'low' THEN bd.exercise_needs <= 2
      WHEN p_answers->>'exercise' = 'medium' THEN bd.exercise_needs BETWEEN 3 AND 4
      WHEN p_answers->>'exercise' = 'high' THEN bd.exercise_needs >= 5
      ELSE TRUE
    END
  ORDER BY
    b.popularity_score DESC;
END;
$$;


ALTER FUNCTION "public"."get_filtered_breeds_v2"("p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_breeds_v3"("p_answers" "jsonb") RETURNS TABLE("id" "uuid", "name_ko" "text", "name_en" "text", "thumbnail_url" "text", "size_type" "text", "total_score" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH scores AS (
    SELECT
      b.id,
      b.name_ko,
      b.name_en,
      b.thumbnail_url,
      b.size_type,
      b.popularity_score,
      (
        -- 1. 환경 (environment)
        CASE
          WHEN p_answers->>'environment' = 'apartment' AND bd.barking_level <= 3 AND b.size_type IN ('소형', '중형') THEN 2
          WHEN p_answers->>'environment' = 'houseWithYard' AND b.size_type IN ('중형', '대형') THEN 2
          ELSE 0
        END +
        -- 2. 활동 (activity)
        CASE
          WHEN p_answers->>'activity' = 'calm' AND bd.energy_level <= 2 THEN 1
          WHEN p_answers->>'activity' = 'moderate' AND bd.energy_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'activity' = 'active' AND bd.energy_level >= 4 THEN 1
          ELSE 0
        END +
        -- 3. 사회성 (social)
        CASE
          WHEN p_answers->>'social' = 'alone' AND bd.friendliness_with_strangers <= 2 THEN 1
          WHEN p_answers->>'social' = 'family' AND bd.friendliness_with_kids >= 3 THEN 1
          WHEN p_answers->>'social' = 'socialButterfly' AND bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4 THEN 1
          ELSE 0
        END +
        -- 4. 관리 (care)
        CASE
          WHEN p_answers->>'care' = 'easy' AND bd.trainability >= 4 AND bd.grooming_needs <= 2 THEN 1
          WHEN p_answers->>'care' = 'medium' AND bd.trainability >= 3 THEN 1
          WHEN p_answers->>'care' = 'hard' THEN 1
          ELSE 0
        END +
        -- 5. 놀이성 (playfulness)
        CASE
          WHEN p_answers->>'playfulness' = 'low' AND bd.playfulness <= 2 THEN 1
          WHEN p_answers->>'playfulness' = 'medium' AND bd.playfulness BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'playfulness' = 'high' AND bd.playfulness >= 5 THEN 1
          ELSE 0
        END +
        -- 6. 애정 (affection)
        CASE
          WHEN p_answers->>'affection' = 'low' AND bd.affection_level <= 2 THEN 1
          WHEN p_answers->>'affection' = 'medium' AND bd.affection_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'affection' = 'high' AND bd.affection_level >= 5 THEN 1
          ELSE 0
        END +
        -- 7. 운동 (exercise)
        CASE
          WHEN p_answers->>'exercise' = 'low' AND bd.exercise_needs <= 2 THEN 1
          WHEN p_answers->>'exercise' = 'medium' AND bd.exercise_needs BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'exercise' = 'high' AND bd.exercise_needs >= 5 THEN 1
          ELSE 0
        END
      ) as calculated_score
    FROM
      breeds b
    JOIN
      breed_details bd ON b.id = bd.breed_id
  )
  SELECT
    s.id,
    s.name_ko,
    s.name_en,
    s.thumbnail_url,
    s.size_type,
    s.calculated_score as total_score
  FROM scores s
  WHERE s.calculated_score > 0 -- 최소 1개 이상의 조건은 만족하는 견종만 선택
  ORDER BY
    total_score DESC,
    s.popularity_score DESC
  LIMIT 20; -- 상위 20개 결과만 반환
END;
$$;


ALTER FUNCTION "public"."get_filtered_breeds_v3"("p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_breeds_v4"("p_answers" "jsonb") RETURNS TABLE("id" "uuid", "name_ko" "text", "name_en" "text", "thumbnail_url" "text", "size_type" "text", "total_score" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH scores AS (
    SELECT
      b.id,
      b.name_ko,
      b.name_en,
      b.thumbnail_url,
      b.size_type,
      b.popularity_score,
      (
        -- ... (CASE 문들은 이전과 동일) ...
        CASE
          WHEN p_answers->>'environment' = 'apartment' AND bd.barking_level <= 3 AND b.size_type IN ('소형', '중형') THEN 2
          WHEN p_answers->>'environment' = 'houseWithYard' AND b.size_type IN ('중형', '대형') THEN 2
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'activity' = 'calm' AND bd.energy_level <= 2 THEN 1
          WHEN p_answers->>'activity' = 'moderate' AND bd.energy_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'activity' = 'active' AND bd.energy_level >= 4 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'social' = 'alone' AND bd.friendliness_with_strangers <= 2 THEN 1
          WHEN p_answers->>'social' = 'family' AND bd.friendliness_with_kids >= 3 THEN 1
          WHEN p_answers->>'social' = 'socialButterfly' AND bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'care' = 'easy' AND bd.trainability >= 4 AND bd.grooming_needs <= 2 THEN 1
          WHEN p_answers->>'care' = 'medium' AND bd.trainability >= 3 THEN 1
          WHEN p_answers->>'care' = 'hard' THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'playfulness' = 'low' AND bd.playfulness <= 2 THEN 1
          WHEN p_answers->>'playfulness' = 'medium' AND bd.playfulness BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'playfulness' = 'high' AND bd.playfulness >= 5 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'affection' = 'low' AND bd.affection_level <= 2 THEN 1
          WHEN p_answers->>'affection' = 'medium' AND bd.affection_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'affection' = 'high' AND bd.affection_level >= 5 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'exercise' = 'low' AND bd.exercise_needs <= 2 THEN 1
          WHEN p_answers->>'exercise' = 'medium' AND bd.exercise_needs BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'exercise' = 'high' AND bd.exercise_needs >= 5 THEN 1
          ELSE 0
        END
      )::bigint as calculated_score -- calculated_score를 bigint로 형변환
    FROM
      breeds b
    JOIN
      breed_details bd ON b.id = bd.breed_id
  )
  SELECT
    s.id,
    s.name_ko,
    s.name_en,
    s.thumbnail_url,
    s.size_type,
    s.calculated_score as total_score
  FROM scores s
  WHERE s.calculated_score > 0
  ORDER BY
    total_score DESC,
    s.popularity_score DESC
  LIMIT 20;
END;
$$;


ALTER FUNCTION "public"."get_filtered_breeds_v4"("p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_breeds_v5"("p_answers" "jsonb") RETURNS TABLE("id" "uuid", "name_ko" "text", "name_en" "text", "thumbnail_url" "text", "size_type" "text", "total_score" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  WITH scores AS (
    SELECT
      b.id,
      b.name_ko,
      b.name_en,
      b.thumbnail_url,
      b.size_type,
      b.popularity_score,
      (
        -- ... (CASE 문들은 이전과 동일) ...
        CASE
          WHEN p_answers->>'environment' = 'apartment' AND bd.barking_level <= 3 AND b.size_type IN ('소형', '중형') THEN 2
          WHEN p_answers->>'environment' = 'houseWithYard' AND b.size_type IN ('중형', '대형') THEN 2
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'activity' = 'calm' AND bd.energy_level <= 2 THEN 1
          WHEN p_answers->>'activity' = 'moderate' AND bd.energy_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'activity' = 'active' AND bd.energy_level >= 4 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'social' = 'alone' AND bd.friendliness_with_strangers <= 2 THEN 1
          WHEN p_answers->>'social' = 'family' AND bd.friendliness_with_kids >= 3 THEN 1
          WHEN p_answers->>'social' = 'socialButterfly' AND bd.friendliness_with_strangers >= 4 AND bd.friendliness_with_pets >= 4 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'care' = 'easy' AND bd.trainability >= 4 AND bd.grooming_needs <= 2 THEN 1
          WHEN p_answers->>'care' = 'medium' AND bd.trainability >= 3 THEN 1
          WHEN p_answers->>'care' = 'hard' THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'playfulness' = 'low' AND bd.playfulness <= 2 THEN 1
          WHEN p_answers->>'playfulness' = 'medium' AND bd.playfulness BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'playfulness' = 'high' AND bd.playfulness >= 5 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'affection' = 'low' AND bd.affection_level <= 2 THEN 1
          WHEN p_answers->>'affection' = 'medium' AND bd.affection_level BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'affection' = 'high' AND bd.affection_level >= 5 THEN 1
          ELSE 0
        END +
        CASE
          WHEN p_answers->>'exercise' = 'low' AND bd.exercise_needs <= 2 THEN 1
          WHEN p_answers->>'exercise' = 'medium' AND bd.exercise_needs BETWEEN 3 AND 4 THEN 1
          WHEN p_answers->>'exercise' = 'high' AND bd.exercise_needs >= 5 THEN 1
          ELSE 0
        END
      )::bigint as calculated_score
    FROM
      breeds b
    JOIN
      breed_details bd ON b.id = bd.breed_id
  )
  SELECT
    s.id,
    s.name_ko,
    s.name_en,
    s.thumbnail_url,
    s.size_type,
    s.calculated_score as total_score
  FROM scores s
  WHERE s.calculated_score > 0
  ORDER BY
    total_score DESC,
    s.popularity_score DESC
  LIMIT 5; -- 결과를 5개로 제한
END;
$$;


ALTER FUNCTION "public"."get_filtered_breeds_v5"("p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_like"("p_post_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_like_count INT;
BEGIN
  -- 사용자가 이미 좋아요를 눌렀는지 확인합니다.
  IF EXISTS (SELECT 1 FROM public.post_likes WHERE post_id = p_post_id AND user_id = current_user_id) THEN
    -- 이미 눌렀다면, 좋아요를 취소합니다 (DELETE).
    DELETE FROM public.post_likes WHERE post_id = p_post_id AND user_id = current_user_id;
  ELSE
    -- 누르지 않았다면, 좋아요를 추가합니다 (INSERT).
    INSERT INTO public.post_likes (post_id, user_id) VALUES (p_post_id, current_user_id);
  END IF;

  -- posts 테이블의 like_count를 업데이트합니다.
  UPDATE public.posts
  SET like_count = (SELECT count(*) FROM public.post_likes WHERE post_id = p_post_id)
  WHERE id = p_post_id
  RETURNING like_count INTO new_like_count;

  -- 새로운 좋아요 수를 반환합니다.
  RETURN new_like_count;
END;
$$;


ALTER FUNCTION "public"."toggle_like"("p_post_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ai_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "dog_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"(),
    "recommendations" "jsonb"
);


ALTER TABLE "public"."ai_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "published_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "title" "text" NOT NULL,
    "content" "text",
    "slug" "text" NOT NULL,
    "cover_image_url" "text",
    "category" "text",
    "tags" "text"[],
    "summary" "text",
    "view_count" integer DEFAULT 0 NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "original_source_url" "text",
    "suggestion_id" "uuid"
);


ALTER TABLE "public"."articles" OWNER TO "postgres";


COMMENT ON TABLE "public"."articles" IS '블로그, 매거진 등 모든 최종 콘텐츠';



CREATE TABLE IF NOT EXISTS "public"."badges" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text"
);


ALTER TABLE "public"."badges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."badges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."badges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."badges_id_seq" OWNED BY "public"."badges"."id";



CREATE TABLE IF NOT EXISTS "public"."behavior_options" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."behavior_options" OWNER TO "postgres";


ALTER TABLE "public"."behavior_options" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."behavior_options_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."breed_details" (
    "breed_id" "uuid" NOT NULL,
    "adaptability" smallint,
    "friendliness_with_kids" smallint,
    "friendliness_with_pets" smallint,
    "energy_level" smallint,
    "grooming_needs" smallint,
    "shedding_level" smallint,
    "trainability" smallint,
    "barking_level" smallint,
    "friendliness_with_strangers" smallint,
    "exercise_needs" smallint,
    "playfulness" smallint,
    "affection_level" smallint
);


ALTER TABLE "public"."breed_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."breed_diseases" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "breed_id" "uuid" NOT NULL,
    "disease_name" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."breed_diseases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."breeds" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_ko" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "thumbnail_url" "text",
    "summary" "text",
    "history" "text",
    "size_type" "text",
    "avg_life_expectancy" "int4range",
    "avg_weight" "int4range",
    "dog_mbti" character(4),
    "popularity_score" integer DEFAULT 0
);


ALTER TABLE "public"."breeds" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "post_id" "uuid" NOT NULL,
    "content" "text" NOT NULL
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "plan" "text" DEFAULT 'free'::"text",
    "plan_expiry_date" timestamp with time zone,
    "username" "text",
    "avatar_url" "text"
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profiles" IS 'Stores public-facing profile information for users.';



CREATE OR REPLACE VIEW "public"."comments_with_author" AS
 SELECT "c"."id",
    "c"."created_at",
    "c"."user_id",
    "c"."post_id",
    "c"."content",
    "up"."username",
    "up"."avatar_url"
   FROM ("public"."comments" "c"
     LEFT JOIN "public"."user_profiles" "up" ON (("c"."user_id" = "up"."id")));


ALTER VIEW "public"."comments_with_author" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_missions" (
    "id" integer NOT NULL,
    "mission" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_missions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."daily_missions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."daily_missions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."daily_missions_id_seq" OWNED BY "public"."daily_missions"."id";



CREATE TABLE IF NOT EXISTS "public"."dog_badges" (
    "id" integer NOT NULL,
    "dog_id" "uuid" NOT NULL,
    "badge_id" integer NOT NULL,
    "achieved_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."dog_badges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."dog_badges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."dog_badges_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."dog_badges_id_seq" OWNED BY "public"."dog_badges"."id";



CREATE TABLE IF NOT EXISTS "public"."dog_desired_behaviors" (
    "dog_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "behavior_option_id" bigint NOT NULL
);


ALTER TABLE "public"."dog_desired_behaviors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dog_extended_profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dog_id" "uuid" NOT NULL,
    "living_environment" "text",
    "family_composition" "text",
    "favorite_snacks" "text",
    "sensitive_factors" "text",
    "past_history" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "known_behaviors" "text"[],
    "leash_type" "text",
    "toilet_type" "text",
    "social_level" "text",
    "meal_habit" "text",
    "favorites" "text"[],
    "owner_proximity" "text",
    "activity_level" "text",
    "past_experience" "text",
    "sensitive_items" "text"[],
    "family_kids" boolean,
    "preferred_play" "text"[]
);


ALTER TABLE "public"."dog_extended_profile" OWNER TO "postgres";


COMMENT ON TABLE "public"."dog_extended_profile" IS 'Stores detailed profile information about a dog''s personality and environment.';



COMMENT ON COLUMN "public"."dog_extended_profile"."living_environment" IS 'The dog''s living environment (e.g., apartment, house).';



COMMENT ON COLUMN "public"."dog_extended_profile"."family_composition" IS 'Description of the family composition.';



COMMENT ON COLUMN "public"."dog_extended_profile"."favorite_snacks" IS 'The dog''s favorite snacks.';



COMMENT ON COLUMN "public"."dog_extended_profile"."sensitive_factors" IS 'Factors the dog is sensitive to (e.g., noise).';



COMMENT ON COLUMN "public"."dog_extended_profile"."past_history" IS 'The dog''s past history (e.g., adoption, training).';



COMMENT ON COLUMN "public"."dog_extended_profile"."known_behaviors" IS '이미 잘하는 행동';



COMMENT ON COLUMN "public"."dog_extended_profile"."leash_type" IS '산책 장비 사용 여부';



COMMENT ON COLUMN "public"."dog_extended_profile"."toilet_type" IS '배변 위치';



COMMENT ON COLUMN "public"."dog_extended_profile"."social_level" IS '사회성 수준';



COMMENT ON COLUMN "public"."dog_extended_profile"."meal_habit" IS '식사 습관';



COMMENT ON COLUMN "public"."dog_extended_profile"."favorites" IS '좋아하는 간식/장난감';



COMMENT ON COLUMN "public"."dog_extended_profile"."owner_proximity" IS '보호자와의 거리감';



COMMENT ON COLUMN "public"."dog_extended_profile"."activity_level" IS '하루 활동량';



COMMENT ON COLUMN "public"."dog_extended_profile"."past_experience" IS '과거 경험 (입양/유기 등)';



COMMENT ON COLUMN "public"."dog_extended_profile"."sensitive_items" IS '민감한 자극 요소';



COMMENT ON COLUMN "public"."dog_extended_profile"."family_kids" IS '가족 구성에 아이가 있는지 여부';



COMMENT ON COLUMN "public"."dog_extended_profile"."preferred_play" IS '좋아하는 활동';



CREATE TABLE IF NOT EXISTS "public"."dog_health_status" (
    "dog_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "health_status_option_id" bigint NOT NULL
);


ALTER TABLE "public"."dog_health_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dogs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "name" "text",
    "age" "text",
    "gender" "text",
    "breed" "text",
    "weight" "text",
    "image_url" "text"
);


ALTER TABLE "public"."dogs" OWNER TO "postgres";


COMMENT ON TABLE "public"."dogs" IS 'Stores basic information about a user''s dog.';



CREATE TABLE IF NOT EXISTS "public"."health_status_options" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."health_status_options" OWNER TO "postgres";


ALTER TABLE "public"."health_status_options" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."health_status_options_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invitation_codes" (
    "id" bigint NOT NULL,
    "code" "text" NOT NULL,
    "is_used" boolean DEFAULT false,
    "used_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "used_at" timestamp with time zone
);


ALTER TABLE "public"."invitation_codes" OWNER TO "postgres";


ALTER TABLE "public"."invitation_codes" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."invitation_codes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."joint_analysis_records" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "dog_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "is_baseline" boolean DEFAULT false NOT NULL,
    "original_video_filename" "text" NOT NULL,
    "processed_video_url" "text" NOT NULL,
    "analysis_results" "jsonb",
    "notes" "text",
    "family_elderly" boolean
);


ALTER TABLE "public"."joint_analysis_records" OWNER TO "postgres";


COMMENT ON TABLE "public"."joint_analysis_records" IS '사용자별 AI 관절 분석 기록';



COMMENT ON COLUMN "public"."joint_analysis_records"."is_baseline" IS '해당 강아지의 첫 분석(기준점)인지 여부';



COMMENT ON COLUMN "public"."joint_analysis_records"."analysis_results" IS 'AI가 추출한 구조화된 분석 데이터 (안정성, 대칭성 등)';



ALTER TABLE "public"."joint_analysis_records" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."joint_analysis_records_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mbti_descriptions" (
    "mbti_type" character(4) NOT NULL,
    "title" "text",
    "description" "text"
);


ALTER TABLE "public"."mbti_descriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_type" character varying(20) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_likes" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "category" "public"."post_category" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "view_count" integer DEFAULT 0 NOT NULL,
    "like_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."posts_with_author" AS
 SELECT "p"."id",
    "p"."created_at",
    "p"."user_id",
    "p"."category",
    "p"."title",
    "p"."content",
    "p"."view_count",
    "up"."username",
    "up"."avatar_url",
    "p"."like_count",
    (EXISTS ( SELECT 1
           FROM "public"."post_likes" "pl"
          WHERE (("pl"."post_id" = "p"."id") AND ("pl"."user_id" = "auth"."uid"())))) AS "is_liked_by_user"
   FROM ("public"."posts" "p"
     LEFT JOIN "public"."user_profiles" "up" ON (("p"."user_id" = "up"."id")));


ALTER VIEW "public"."posts_with_author" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recommended_videos" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "youtube_video_id" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recommended_videos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."recommended_videos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."recommended_videos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."recommended_videos_id_seq" OWNED BY "public"."recommended_videos"."id";



CREATE TABLE IF NOT EXISTS "public"."suggested_topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "suggested_title_ko" "text" NOT NULL,
    "summary_ko" "text",
    "original_url" "text" NOT NULL,
    "image_url" "text",
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "category" "text",
    "source_name" "text",
    "initial_draft_markdown" "text"
);


ALTER TABLE "public"."suggested_topics" OWNER TO "postgres";


COMMENT ON TABLE "public"."suggested_topics" IS 'AI가 수집/가공한 콘텐츠 아이디어 목록';



CREATE TABLE IF NOT EXISTS "public"."training_history" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "dog_id" "uuid",
    "session_date" "date" DEFAULT CURRENT_DATE,
    "duration_minutes" integer,
    "success_rate" numeric,
    "training_type" "text",
    "notes" "text",
    "is_ai_training" boolean,
    "ai_training_details" "jsonb",
    "training_program_id" "text"
);


ALTER TABLE "public"."training_history" OWNER TO "postgres";


ALTER TABLE "public"."training_history" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."training_history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."training_tips" (
    "id" integer NOT NULL,
    "tip" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."training_tips" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."training_tips_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."training_tips_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."training_tips_id_seq" OWNED BY "public"."training_tips"."id";



ALTER TABLE ONLY "public"."badges" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."badges_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."daily_missions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."daily_missions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."dog_badges" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."dog_badges_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."recommended_videos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."recommended_videos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."training_tips" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."training_tips_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ai_recommendations"
    ADD CONSTRAINT "ai_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_suggestion_id_key" UNIQUE ("suggestion_id");



ALTER TABLE ONLY "public"."badges"
    ADD CONSTRAINT "badges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."behavior_options"
    ADD CONSTRAINT "behavior_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."breed_details"
    ADD CONSTRAINT "breed_details_pkey" PRIMARY KEY ("breed_id");



ALTER TABLE ONLY "public"."breed_diseases"
    ADD CONSTRAINT "breed_diseases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."breeds"
    ADD CONSTRAINT "breeds_name_en_key" UNIQUE ("name_en");



ALTER TABLE ONLY "public"."breeds"
    ADD CONSTRAINT "breeds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_missions"
    ADD CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dog_badges"
    ADD CONSTRAINT "dog_badges_dog_id_badge_id_key" UNIQUE ("dog_id", "badge_id");



ALTER TABLE ONLY "public"."dog_badges"
    ADD CONSTRAINT "dog_badges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dog_desired_behaviors"
    ADD CONSTRAINT "dog_desired_behaviors_pkey" PRIMARY KEY ("dog_id", "behavior_option_id");



ALTER TABLE ONLY "public"."dog_extended_profile"
    ADD CONSTRAINT "dog_extended_profile_dog_id_key" UNIQUE ("dog_id");



ALTER TABLE ONLY "public"."dog_extended_profile"
    ADD CONSTRAINT "dog_extended_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dog_health_status"
    ADD CONSTRAINT "dog_health_status_pkey" PRIMARY KEY ("dog_id", "health_status_option_id");



ALTER TABLE ONLY "public"."dogs"
    ADD CONSTRAINT "dogs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."health_status_options"
    ADD CONSTRAINT "health_status_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."joint_analysis_records"
    ADD CONSTRAINT "joint_analysis_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mbti_descriptions"
    ADD CONSTRAINT "mbti_descriptions_pkey" PRIMARY KEY ("mbti_type");



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recommended_videos"
    ADD CONSTRAINT "recommended_videos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."suggested_topics"
    ADD CONSTRAINT "suggested_topics_original_url_key" UNIQUE ("original_url");



ALTER TABLE ONLY "public"."suggested_topics"
    ADD CONSTRAINT "suggested_topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_history"
    ADD CONSTRAINT "training_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_tips"
    ADD CONSTRAINT "training_tips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_username_key" UNIQUE ("username");



CREATE UNIQUE INDEX "unique_baseline_per_dog" ON "public"."joint_analysis_records" USING "btree" ("dog_id") WHERE ("is_baseline" = true);



COMMENT ON INDEX "public"."unique_baseline_per_dog" IS '각 강아지별 기준 분석(is_baseline=true)은 하나만 존재하도록 보장';



ALTER TABLE ONLY "public"."ai_recommendations"
    ADD CONSTRAINT "ai_recommendations_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_recommendations"
    ADD CONSTRAINT "ai_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE SET NULL;



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "public"."suggested_topics"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."breed_details"
    ADD CONSTRAINT "breed_details_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."breed_diseases"
    ADD CONSTRAINT "breed_diseases_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."breeds"
    ADD CONSTRAINT "breeds_dog_mbti_fkey" FOREIGN KEY ("dog_mbti") REFERENCES "public"."mbti_descriptions"("mbti_type");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_badges"
    ADD CONSTRAINT "dog_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_badges"
    ADD CONSTRAINT "dog_badges_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_desired_behaviors"
    ADD CONSTRAINT "dog_desired_behaviors_behavior_option_id_fkey" FOREIGN KEY ("behavior_option_id") REFERENCES "public"."behavior_options"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_desired_behaviors"
    ADD CONSTRAINT "dog_desired_behaviors_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_extended_profile"
    ADD CONSTRAINT "dog_extended_profile_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_health_status"
    ADD CONSTRAINT "dog_health_status_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dog_health_status"
    ADD CONSTRAINT "dog_health_status_health_status_option_id_fkey" FOREIGN KEY ("health_status_option_id") REFERENCES "public"."health_status_options"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitation_codes"
    ADD CONSTRAINT "invitation_codes_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."joint_analysis_records"
    ADD CONSTRAINT "joint_analysis_records_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."joint_analysis_records"
    ADD CONSTRAINT "joint_analysis_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_history"
    ADD CONSTRAINT "training_history_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_history"
    ADD CONSTRAINT "training_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow authenticated read access to breed_details" ON "public"."breed_details" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated read access to breed_diseases" ON "public"."breed_diseases" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated read access to breeds" ON "public"."breeds" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated read access to mbti_descriptions" ON "public"."mbti_descriptions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to create" ON "public"."comments" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to create" ON "public"."posts" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow author full access to their articles" ON "public"."articles" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow author to insert their own articles" ON "public"."articles" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow author to update their own articles" ON "public"."articles" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow author to view suggested topics" ON "public"."suggested_topics" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow individual delete access on dogs" ON "public"."dogs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow individual read access" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Allow individual read access on dogs" ON "public"."dogs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow individual update access on dogs" ON "public"."dogs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow individual write access on dogs" ON "public"."dogs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow public read access" ON "public"."comments" FOR SELECT USING (true);



CREATE POLICY "Allow public read access" ON "public"."post_likes" FOR SELECT USING (true);



CREATE POLICY "Allow public read access" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to published articles" ON "public"."articles" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Allow public read access to usernames and avatars" ON "public"."user_profiles" FOR SELECT USING (true);



CREATE POLICY "Allow users to delete their own dog's extended profile" ON "public"."dog_extended_profile" FOR DELETE USING (("auth"."uid"() = ( SELECT "dogs"."user_id"
   FROM "public"."dogs"
  WHERE ("dogs"."id" = "dog_extended_profile"."dog_id"))));



CREATE POLICY "Allow users to insert their own dog's extended profile" ON "public"."dog_extended_profile" FOR INSERT WITH CHECK (("auth"."uid"() = ( SELECT "dogs"."user_id"
   FROM "public"."dogs"
  WHERE ("dogs"."id" = "dog_extended_profile"."dog_id"))));



CREATE POLICY "Allow users to manage their own likes" ON "public"."post_likes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to update their own dog's extended profile" ON "public"."dog_extended_profile" FOR UPDATE USING (("auth"."uid"() = ( SELECT "dogs"."user_id"
   FROM "public"."dogs"
  WHERE ("dogs"."id" = "dog_extended_profile"."dog_id"))));



CREATE POLICY "Allow users to update/delete their own" ON "public"."comments" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to update/delete their own" ON "public"."posts" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to view their own dog's extended profile" ON "public"."dog_extended_profile" FOR SELECT USING (("auth"."uid"() = ( SELECT "dogs"."user_id"
   FROM "public"."dogs"
  WHERE ("dogs"."id" = "dog_extended_profile"."dog_id"))));



CREATE POLICY "Authenticated users can view behavior options" ON "public"."behavior_options" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view health status options" ON "public"."health_status_options" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Daily missions are viewable by everyone" ON "public"."daily_missions" FOR SELECT USING (true);



CREATE POLICY "Recommended videos are viewable by everyone" ON "public"."recommended_videos" FOR SELECT USING (true);



CREATE POLICY "Training tips are viewable by everyone" ON "public"."training_tips" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own dogs" ON "public"."dogs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own media" ON "public"."media" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own dogs" ON "public"."dogs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own media" ON "public"."media" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage desired behaviors for their own dogs" ON "public"."dog_desired_behaviors" USING ((EXISTS ( SELECT 1
   FROM "public"."dogs"
  WHERE (("dogs"."id" = "dog_desired_behaviors"."dog_id") AND ("dogs"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage health status for their own dogs" ON "public"."dog_health_status" USING ((EXISTS ( SELECT 1
   FROM "public"."dogs"
  WHERE (("dogs"."id" = "dog_health_status"."dog_id") AND ("dogs"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their own dogs" ON "public"."dogs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view all badges" ON "public"."badges" FOR SELECT USING (true);



CREATE POLICY "Users can view and add badges for their own dog" ON "public"."dog_badges" USING ((EXISTS ( SELECT 1
   FROM "public"."dogs"
  WHERE (("dogs"."id" = "dog_badges"."dog_id") AND ("dogs"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own dogs" ON "public"."dogs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own media" ON "public"."media" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."post_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "사용자는 자신의 분석 기록만 접근 가능" ON "public"."joint_analysis_records" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "서비스 역할은 모든 접근 가능" ON "public"."joint_analysis_records" USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_article_from_suggestion"("p_suggestion_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_article_from_suggestion"("p_suggestion_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_article_from_suggestion"("p_suggestion_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_breeds"("p_answers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds"("p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds"("p_answers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v2"("p_answers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v2"("p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v2"("p_answers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v3"("p_answers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v3"("p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v3"("p_answers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v4"("p_answers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v4"("p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v4"("p_answers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v5"("p_answers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v5"("p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_breeds_v5"("p_answers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_like"("p_post_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_like"("p_post_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_like"("p_post_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."ai_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."ai_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."articles" TO "anon";
GRANT ALL ON TABLE "public"."articles" TO "authenticated";
GRANT ALL ON TABLE "public"."articles" TO "service_role";



GRANT ALL ON TABLE "public"."badges" TO "anon";
GRANT ALL ON TABLE "public"."badges" TO "authenticated";
GRANT ALL ON TABLE "public"."badges" TO "service_role";



GRANT ALL ON SEQUENCE "public"."badges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."badges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."badges_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."behavior_options" TO "anon";
GRANT ALL ON TABLE "public"."behavior_options" TO "authenticated";
GRANT ALL ON TABLE "public"."behavior_options" TO "service_role";



GRANT ALL ON SEQUENCE "public"."behavior_options_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."behavior_options_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."behavior_options_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."breed_details" TO "anon";
GRANT ALL ON TABLE "public"."breed_details" TO "authenticated";
GRANT ALL ON TABLE "public"."breed_details" TO "service_role";



GRANT ALL ON TABLE "public"."breed_diseases" TO "anon";
GRANT ALL ON TABLE "public"."breed_diseases" TO "authenticated";
GRANT ALL ON TABLE "public"."breed_diseases" TO "service_role";



GRANT ALL ON TABLE "public"."breeds" TO "anon";
GRANT ALL ON TABLE "public"."breeds" TO "authenticated";
GRANT ALL ON TABLE "public"."breeds" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."comments_with_author" TO "anon";
GRANT ALL ON TABLE "public"."comments_with_author" TO "authenticated";
GRANT ALL ON TABLE "public"."comments_with_author" TO "service_role";



GRANT ALL ON TABLE "public"."daily_missions" TO "anon";
GRANT ALL ON TABLE "public"."daily_missions" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_missions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."daily_missions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."daily_missions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."daily_missions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."dog_badges" TO "anon";
GRANT ALL ON TABLE "public"."dog_badges" TO "authenticated";
GRANT ALL ON TABLE "public"."dog_badges" TO "service_role";



GRANT ALL ON SEQUENCE "public"."dog_badges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dog_badges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dog_badges_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."dog_desired_behaviors" TO "anon";
GRANT ALL ON TABLE "public"."dog_desired_behaviors" TO "authenticated";
GRANT ALL ON TABLE "public"."dog_desired_behaviors" TO "service_role";



GRANT ALL ON TABLE "public"."dog_extended_profile" TO "anon";
GRANT ALL ON TABLE "public"."dog_extended_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."dog_extended_profile" TO "service_role";



GRANT ALL ON TABLE "public"."dog_health_status" TO "anon";
GRANT ALL ON TABLE "public"."dog_health_status" TO "authenticated";
GRANT ALL ON TABLE "public"."dog_health_status" TO "service_role";



GRANT ALL ON TABLE "public"."dogs" TO "anon";
GRANT ALL ON TABLE "public"."dogs" TO "authenticated";
GRANT ALL ON TABLE "public"."dogs" TO "service_role";



GRANT ALL ON TABLE "public"."health_status_options" TO "anon";
GRANT ALL ON TABLE "public"."health_status_options" TO "authenticated";
GRANT ALL ON TABLE "public"."health_status_options" TO "service_role";



GRANT ALL ON SEQUENCE "public"."health_status_options_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."health_status_options_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."health_status_options_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."invitation_codes" TO "anon";
GRANT ALL ON TABLE "public"."invitation_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."invitation_codes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invitation_codes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invitation_codes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invitation_codes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."joint_analysis_records" TO "anon";
GRANT ALL ON TABLE "public"."joint_analysis_records" TO "authenticated";
GRANT ALL ON TABLE "public"."joint_analysis_records" TO "service_role";



GRANT ALL ON SEQUENCE "public"."joint_analysis_records_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."joint_analysis_records_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."joint_analysis_records_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mbti_descriptions" TO "anon";
GRANT ALL ON TABLE "public"."mbti_descriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."mbti_descriptions" TO "service_role";



GRANT ALL ON TABLE "public"."media" TO "anon";
GRANT ALL ON TABLE "public"."media" TO "authenticated";
GRANT ALL ON TABLE "public"."media" TO "service_role";



GRANT ALL ON TABLE "public"."post_likes" TO "anon";
GRANT ALL ON TABLE "public"."post_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."post_likes" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."posts_with_author" TO "anon";
GRANT ALL ON TABLE "public"."posts_with_author" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_with_author" TO "service_role";



GRANT ALL ON TABLE "public"."recommended_videos" TO "anon";
GRANT ALL ON TABLE "public"."recommended_videos" TO "authenticated";
GRANT ALL ON TABLE "public"."recommended_videos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."recommended_videos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."recommended_videos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."recommended_videos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."suggested_topics" TO "anon";
GRANT ALL ON TABLE "public"."suggested_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."suggested_topics" TO "service_role";



GRANT ALL ON TABLE "public"."training_history" TO "anon";
GRANT ALL ON TABLE "public"."training_history" TO "authenticated";
GRANT ALL ON TABLE "public"."training_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."training_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."training_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."training_history_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."training_tips" TO "anon";
GRANT ALL ON TABLE "public"."training_tips" TO "authenticated";
GRANT ALL ON TABLE "public"."training_tips" TO "service_role";



GRANT ALL ON SEQUENCE "public"."training_tips_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."training_tips_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."training_tips_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
