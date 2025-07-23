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

// 재시도 함수 추가
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // 503 오류가 아니거나 마지막 시도인 경우 즉시 에러 발생
      if (error.status !== 503 || attempt === maxRetries) {
        throw error
      }
      
      // 지수 백오프로 대기
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      console.log(`API 과부하로 인한 재시도 ${attempt + 1}/${maxRetries}, ${Math.round(delay)}ms 후 재시도...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
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
      You are a meticulous senior content editor for "Mung-AI Magazine".
      Your task is to convert the raw text into a complete, well-structured Markdown article, and create a clear to-do list for fact-checking based on specific, verifiable claims.

      Follow these instructions precisely:

      1.  **Create a "Fact-Check List" at the Top (Crucial):**
          - At the very beginning of your output, create a Markdown blockquote section titled "🚨 **Fact-Check List**".
          - **Analyze the "Raw Text to Process" and identify ONLY the following types of claims:**
            - **Specific statistics or numbers:** (e.g., "80% of dogs", "costs $500", "10,000 times stronger").
            - **Direct mentions of studies, reports, or official organizations:** (e.g., "A study from Harvard...", "The AVMA recommends...").
            - **Specific medical or scientific statements presented as universal fact:** (e.g., "Theobromine is toxic to dogs.").
          - **DO NOT flag the following:**
            - The author's personal opinions, thoughts, or experiences (e.g., "I believe...", "In my view...").
            - General knowledge or common advice (e.g., "Dogs need regular walks.").
            - Introductory or concluding remarks.
          - For each verifiable claim found, add a bullet point to the list with a suggested English Google search query.
          - Example:
            > 🚨 **Fact-Check List**
            > - "매년 10만 마리의 동물이 버려집니다" -> Google Search: "South Korea abandoned animal statistics 100,000"
            > - "연구에 따르면 강아지는 2살 아이의 지능을 가집니다" -> Google Search: "dog intelligence equivalent to 2-year-old child study"
          - If no such verifiable claims are found, state: "이 글은 저자의 의견과 일반적인 정보로 구성되어 있어, 별도로 출처를 검증할 통계나 특정 주장은 포함되지 않았습니다."

      2.  **Flag for Fact-Checking in the Body:**
          - In the body of the article, find the same claims you identified for the list.
          - Insert a clear flag immediately after the claim in the format: **[⚠️ 출처 확인 필요]**.

      3.  **Format Structure:** Format titles, subtitles, bold text, and lists into clean Markdown.

      4.  **Add Internal Links:**
          - Refer to the "Existing Article List" and naturally link 1-3 relevant keywords in the text to existing articles on our site.

      5.  **Add "Related Articles" Section:**
          - At the end, create a "📚 함께 읽으면 좋은 글" section. Select the 2-3 most relevant articles from the "Existing Article List" and list them.

      6.  **Add Author Byline:**
          - At the very end, add the byline: "✍️ By [전문가 김주영](https://puppyvill.com/jason) of [Pet-Life Magazine](https://mungai.co.kr/about)"

      7.  **Final Output:** The output must be strictly in Markdown format, starting with the "Fact-Check List". Do not add any other comments or explanations.

      ---
      **Existing Article List (for internal linking):**
      ${articleListMarkdown}
      ---
      **Raw Text to Process:**
      ${rawText}
    `

    // 재시도 로직을 사용하여 API 호출
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt)
    }, 3, 1000)
    
    const response = await result.response
    const formattedText = await response.text()

    return new Response(JSON.stringify({ formattedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error(error)
    
    // 503 오류에 대한 더 친화적인 에러 메시지
    if (error.status === 503) {
      return new Response(JSON.stringify({ 
        error: 'AI 서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.',
        retryAfter: 30 // 30초 후 재시도 권장
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503,
      })
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
