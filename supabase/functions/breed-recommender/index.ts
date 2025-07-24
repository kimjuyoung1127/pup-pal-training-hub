import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// 응답 형식 정의
interface Breed {
  id: string;
  name_ko: string;
  name_en: string;
  thumbnail_url: string;
  match_score: number;
}

Deno.serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { answers } = await req.json()

    // Supabase 클라이언트 생성 (Service Role 키 사용)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. 모든 견종 및 관련 상세 데이터 가져오기
    const { data: breedsData, error: breedsError } = await supabaseAdmin
      .from('breeds')
      .select(`
        id,
        name_ko,
        name_en,
        thumbnail_url,
        size_type,
        breed_details (
          energy_level,
          affection_level,
          friendliness_with_strangers,
          barking_level,
          trainability,
          shedding_level
        )
      `)
    if (breedsError) throw breedsError;

    // 2. 가중치 기반 매칭 알��리즘 (최신 스키마 기준)
    const scoredBreeds = breedsData.map(breed => {
      let score = 0;
      const details = breed.breed_details[0] || {}; // 상세 정보가 없을 경우 대비

      // 활동 수준 (energy_level) - 가중치 2
      if (answers.activity && details.energy_level) {
        if (answers.activity === 'calm' && details.energy_level <= 2) score += 2;
        if (answers.activity === 'moderate' && details.energy_level >= 3 && details.energy_level <= 4) score += 2;
        if (answers.activity === 'active' && details.energy_level >= 4) score += 2;
      }

      // 애정 수준 (affection_level) - 가중치 1.5
      if (answers.affection && details.affection_level) {
        if (answers.affection === 'low' && details.affection_level <= 2) score += 1.5;
        if (answers.affection === 'medium' && details.affection_level >= 3 && details.affection_level <= 4) score += 1.5;
        if (answers.affection === 'high' && details.affection_level >= 4) score += 1.5;
      }

      // 사회성 (friendliness_with_strangers) - 가중치 1.5
       if (answers.social && details.friendliness_with_strangers) {
        if (answers.social === 'alone' && details.friendliness_with_strangers <= 2) score += 1.5;
        if (answers.social === 'socialButterfly' && details.friendliness_with_strangers >= 4) score += 1.5;
      }

      // 짖음 (barking_level) - 가중치 1
      if (answers.barking && details.barking_level) {
        if (answers.barking === 'quiet' && details.barking_level <= 2) score += 1;
        if (answers.barking === 'moderate' && details.barking_level >= 3 && details.barking_level <= 4) score += 1;
        if (answers.barking === 'vocal' && details.barking_level >= 4) score += 1;
      }
      
      // 훈련 용이성 (trainability) - 가중치 1
      if (answers.trainability && details.trainability) {
          if(answers.trainability === 'easy' && details.trainability >= 4) score += 1;
          if(answers.trainability === 'moderate' && details.trainability >= 3) score += 1;
      }

      // 털빠짐 (shedding_level) - 가중치 1
      if (answers.shedding && details.shedding_level) {
          if(answers.shedding === 'low' && details.shedding_level <= 2) score += 1;
          if(answers.shedding === 'moderate' && details.shedding_level >= 3 && details.shedding_level <= 4) score += 1;
          if(answers.shedding === 'high' && details.shedding_level >= 4) score += 1;
      }

      // 크기 (size_type) - 가중치 2
      if (answers.size && breed.size_type === answers.size) {
        score += 2
      }

      return {
        id: breed.id,
        name_ko: breed.name_ko,
        name_en: breed.name_en,
        thumbnail_url: breed.thumbnail_url,
        match_score: score,
      }
    })

    // 3. 점수 순으로 정렬하여 상위 5개 반환
    const sortedBreeds = scoredBreeds.sort((a, b) => b.match_score - a.match_score).slice(0, 5)

    return new Response(JSON.stringify(sortedBreeds), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
