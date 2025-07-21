import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set.')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { rawText } = await req.json()
    if (!rawText) {
      return new Response(JSON.stringify({ error: 'rawText is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured.')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      You are a professional content editor for a pet-focused web magazine.
      Your task is to convert the following raw text into a well-structured Markdown format suitable for a blog post.
      - Identify the main title and format it as a Level 1 Heading (#).
      - Identify subtitles and format them as Level 2 or 3 Headings (## or ###).
      - Use bold (**) for emphasis on important keywords or phrases.
      - Format lists as bullet points (-).
      - Ensure the output is clean, readable, and strictly in Markdown format.
      - Do not add any comments or text outside of the Markdown content.

      Here is the raw text:
      ---
      ${rawText}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const formattedText = await response.text()

    return new Response(JSON.stringify({ formattedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
