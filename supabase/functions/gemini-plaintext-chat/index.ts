import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

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
    
    const contents = history;

    const response = await fetch(API_URL, {
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

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    // Gemini API 응답이 JSON 구조이므로 파싱합니다.
    const responseData = await response.json();
    
    // 응답 구조에서 실제 텍스트를 추출합니다.
    const botMessage = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botMessage) {
      console.error('Unexpected Gemini API response:', responseData);
      throw new Error('Failed to get a response from the AI.');
    }

    return new Response(botMessage, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' }, // Content-Type을 text/plain으로 변경
      status: 200,
    })
  } catch (error) {
    console.error('Error in gemini-plaintext-chat function:', error)
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      status: 500,
    })
  }
})