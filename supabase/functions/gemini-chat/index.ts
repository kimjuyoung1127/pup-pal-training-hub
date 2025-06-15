
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
      parts: [{ text: "You are a friendly and helpful AI assistant specialized in dog training. Your name is 멍멍코치 (Meong-meong Coach). Always respond in Korean. Your response MUST be a valid JSON object or array, without any markdown formatting like ```json. You will be given a dog's profile and a task. Follow the task instructions precisely." }]
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
            temperature: 0.7,
            topK: 1,
            topP: 1,
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

    return new Response(JSON.stringify({ response: botMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in gemini-chat function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

