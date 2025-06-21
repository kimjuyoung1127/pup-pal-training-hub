
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { history } = await req.json()

    if (!history || history.length === 0) {
      return new Response(JSON.stringify({ error: 'History is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    const system_instruction = {
      parts: [{ text: "당신은 '멍멍코치'라는 이름의 전문 반려견 훈련사 AI입니다. 사용자가 입력한 강아지의 정보(JSON 형태, 견종, 성격, 건강 상태 등)를 분석하여, 아래 기준에 따라 훈련사 스타일의 친절하고 실용적인 설명을 제공합니다. 🧠 목적: 보호자가 강아지를 더 잘 이해하고, 적절한 훈련/관리 방식을 선택할 수 있도록 도와주는 것이 목표입니다. 📋 출력 지침 (모든 응답은 자연어 한국어로 작성): 1. 견종의 주요 성격적 특성과 행동 경향을 1~2문장으로 요약 2. 해당 견종의 훈련 시 유의사항이나 추천 훈련 방식 안내 (훈련 난이도 포함) 3. 건강 관리 시 주의할 점 (유전 질환, 운동량, 식단 등) 4. 보호자에게 주는 맞춤 조언 (ex. '이런 보호자에게 잘 맞아요', '이런 점에 주의하세요') 5. 전체 분량은 4~6줄 이내 6. 절대로 JSON 형식으로 응답하지 마세요. 자연스러운 설명 문장으로만 출력하세요. return only plain natural language text" }]
    };
    const contents = history;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        system_instruction: system_instruction,
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
        ]
      }),
    })

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json()
    
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botMessage) {
      console.error('Unexpected Gemini API response:', data);
      throw new Error('Failed to get a response from the AI.');
    }

    return new Response(botMessage, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in gemini-chat function:', error)
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 500,
    })
  }
})

