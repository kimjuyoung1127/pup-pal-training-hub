
// 기존 코드
// import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

// 수정된 코드 - 안정적인 버전 사용
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Helper: 로깅이 강화된 재시도 함수 ---
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000) {
  console.log(`🚀 Starting fetchWithRetry with ${retries} retries`);
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 Attempt ${i + 1}/${retries} - Making request to Gemini API`);
      const response = await fetch(url, options);
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`✅ Request successful on attempt ${i + 1}`);
        return response;
      }
      
      // 응답 본문 로깅 (오류 디버깅용)
      const responseText = await response.text();
      console.log(`❌ Response body:`, responseText);
      
      // 5xx 서버 오류인 경우에만 재시도
      if (response.status >= 500 && response.status < 600) {
        console.warn(`🔄 Server error ${response.status}. Retrying in ${backoff}ms... (attempt ${i + 1}/${retries})`);
        if (i < retries - 1) { // 마지막 시도가 아닌 경우에만 대기
          await new Promise(resolve => setTimeout(resolve, backoff));
          backoff *= 2;
        }
        continue;
      }
      
      // 4xx 클라이언트 오류는 즉시 실패
      const error = new Error(`Gemini API request failed with status ${response.status}: ${responseText}`);
      console.error(`🚫 Client error (${response.status}):`, error.message);
      throw error;
      
    } catch (error) {
      console.error(`💥 Fetch error on attempt ${i + 1}/${retries}:`, error.message);
      
      if (i === retries - 1) {
        console.error(`🔴 All ${retries} attempts failed. Throwing final error.`);
        throw error;
      }
      
      console.warn(`⏳ Waiting ${backoff}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      backoff *= 2;
    }
  }
  
  const finalError = new Error('Gemini API is unavailable after multiple retries.');
  console.error(`🔴 Final error:`, finalError.message);
  throw finalError;
}

serve(async (req) => {
  console.log(`🌐 Received ${req.method} request`);
  
  if (req.method === 'OPTIONS') {
    console.log(`✅ Handling OPTIONS request`);
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 환경 변수 검증 및 로깅
    console.log('🔍 Environment check:');
    console.log('GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', GEMINI_API_KEY?.length || 0);
    console.log('API_URL:', API_URL.substring(0, 100) + '...');
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      const error = new Error('Gemini API key is not properly configured');
      console.error('🔑 API Key Error:', error.message);
      throw error;
    }

    console.log('📥 Parsing request body...');
    const { history } = await req.json()
    console.log('📋 History length:', history?.length || 0);

    if (!history || history.length === 0) {
      console.error('📝 Invalid history data');
      return new Response(JSON.stringify({ error: 'History is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    const contents = history;
    console.log('🎯 Prepared contents for Gemini API');

    const response = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [
            { text: "You are a dog training recommender. You MUST respond in JSON format. Do not include any text other than the JSON response. The JSON should contain exercise recommendations." }
          ]
        },
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384,
        },
        safetySettings: [
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
        ]
      }),
    });

    console.log('🎉 Successfully received response from Gemini API');
    const data = await response.json()
    console.log('📊 Response data structure:', Object.keys(data));
    console.log('🔍 Full response data:', JSON.stringify(data, null, 2)); // 전체 응답 로깅 추가
    
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botMessage) {
      console.error('🚨 Unexpected Gemini API response structure:', JSON.stringify(data, null, 2));
      throw new Error('AI로부터 유효한 응답을 받지 못했습니다.');
    }
    
    console.log('📝 Bot message content:', botMessage); // 응답 내용 로깅 추가
    
    // JSON 응답을 그대로 반환하지 말고, 구조화된 응답으로 반환
    return new Response(JSON.stringify({ 
      content: botMessage,
      success: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      status: 200,
    })
    console.log('✅ Successfully processed request');
    return new Response(botMessage, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      status: 200,
    })
  } catch (error) {
    console.error('🔥 Error in gemini-chat function:', error.message)
    console.error('📚 Error stack:', error.stack)
    
    // 구체적인 오류 분류
    let userMessage = '요청 처리 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error.message.includes('API key')) {
      userMessage = 'AI 서비스 설정에 문제가 있습니다. 관리자에게 문의해주세요.';
      statusCode = 503;
    } else if (error.message.includes('unavailable') || error.message.includes('retries')) {
      userMessage = 'AI 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
      statusCode = 503;
    } else if (error.message.includes('fetch')) {
      userMessage = '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
      statusCode = 502;
    }

    console.log(`📤 Returning error response: ${statusCode} - ${userMessage}`);
    return new Response(JSON.stringify({ 
      error: userMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      status: statusCode,
    })
  }
})

console.log('🚀 Gemini Chat function initialized');

