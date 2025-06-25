
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

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
            { text: "You are a dog training recommender. You MUST respond in JSON format. Do not include any text other than the JSON response. The JSON should contain exercise recommendations." } // 시스템 프롬프트 명확화
          ]
        },
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384, // 8192에서 16384로 늘림
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in gemini-chat function:', error)
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      status: 500,
    })
  }
})

