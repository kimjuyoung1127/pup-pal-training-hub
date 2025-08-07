import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Helper: 재시도 로직을 포함한 Fetch 함수 ---
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      // 5xx 서버 오류인 경우에만 재시도
      if (response.status >= 500 && response.status < 600) {
        console.warn(`Gemini API request failed with status ${response.status}. Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        backoff *= 2; // 다음 재시도 시간 2배 증가
        continue; // 재시도
      }
      // 5xx가 아닌 다른 클라이언트 오류(4xx) 등은 즉시 실패 처리
      throw new Error(`Gemini API request failed with status ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error; // 마지막 재시도 실패 시 에러 던짐
      console.warn(`Fetch error: ${error.message}. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      backoff *= 2;
    }
  }
  // 모든 재시도가 실패한 경우
  throw new Error('Gemini API is unavailable after multiple retries.');
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
    
    const contents = history;

    const response = await fetchWithRetry(API_URL, { // 기존 fetch를 fetchWithRetry로 교체
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [
            { text: "You are a helpful and friendly dog training coach. Respond in plain text, not JSON." } // 시스템 프롬프트 수정
          ]
        },
        generationConfig: {
            responseMimeType: 'text/plain', // 응답 타입을 text/plain으로 변경
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048, // 일반 챗봇이므로 토큰 수 조정
        },
        safetySettings: [
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
        ]
      }),
    })

    if (!response) { // fetchWithRetry가 null을 반환하는 경우 (모든 재시도 실패)
        throw new Error("AI 서비스가 응답하지 않습니다. 잠시 후 다시 시도해주세요.");
    }

    // Gemini API 응답이 JSON 구조이므로 파싱합니다.
    const responseData = await response.json();
    
    // 응답 구조에서 실제 텍스트를 추출합니다.
    const botMessage = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botMessage) {
      console.error('Unexpected Gemini API response:', responseData);
      throw new Error('AI로부터 유효한 응답을 받지 못했습니다.');
    }

    return new Response(botMessage, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' }, // Content-Type을 text/plain으로 변경
      status: 200,
    })
  } catch (error) {
    console.error('Error in gemini-plaintext-chat function:', error)
    // 사용자에게 더 친절한 에러 메시지 반환
    const userFriendlyMessage = error.message.includes('unavailable') || error.message.includes('응답하지 않습니다')
      ? 'AI 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.'
      : '요청 처리 중 오류가 발생했습니다.';

    return new Response(userFriendlyMessage, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      status: 500,
    })
  }
})