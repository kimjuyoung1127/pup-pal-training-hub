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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { rawText, articleList } = await req.json()
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

    const articleListMarkdown = (articleList && articleList.length > 0)
      ? articleList
          .map((article: { title: string, slug: string }) => `- [${article.title}](https://mungai.co.kr/articles/${article.slug})`)
          .join('\n')
      : "No existing articles provided.";

    const prompt = `
      You are a senior content editor for "Pet-Life Magazine".
      Your task is to convert the raw text into a complete, well-structured Markdown article, and flag sections that need fact-checking.

      Follow these instructions precisely:
      1.  **Format Structure:** Format titles, subtitles, bold text, and lists into clean Markdown.
      
      2.  **Flag for Fact-Checking with Search Query (Crucial):**
          - Analyze the claims made in the "Raw Text to Process".
          - If you encounter a specific statistic, number, or claim that should be backed by a source (e.g., "according to a study", "statistics show"), do NOT invent a source.
          - Instead, insert a clear flag immediately after the claim in the format: **[출처 필요: Google 검색어: "effective English search query"]**.
          - The search query should be in English and specific enough to find the original source easily.
          - For example: "매년 10만 마리의 동물이 버려집니다 [출처 필요: Google 검색어: "South Korea abandoned animal statistics 100,000"]".

      3.  **Add Internal Links:**
          - Refer to the "Existing Article List" and naturally link 1-3 relevant keywords in the text to existing articles on our site.

      4.  **Add "Related Articles" Section:**
          - At the end, create a "📚 함께 읽으면 좋은 글" section. Select the 2-3 most relevant articles from the "Existing Article List" and list them.

      5.  **Add Author Byline:**
          - At the very end, add the byline: "✍️ By [전문가 김주영](https://puppyvill.com/jason) of [Pet-Life Magazine](https://mungai.co.kr/about)"

      6.  **Final Output:** The output must be strictly in Markdown format. Do not add any other comments or explanations.

      ---
      **Existing Article List (for internal linking):**
      ${articleListMarkdown}
      ---
      **Raw Text to Process:**
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
