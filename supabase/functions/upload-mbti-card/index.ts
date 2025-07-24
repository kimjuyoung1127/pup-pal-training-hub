import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. 요청으로부터 이미지 파일 데이터 추출
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('파일이 제공되지 않았습니다.');
    }

    // 2. Supabase 클라이언트 생성 (서비스 키 사용)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 3. Supabase Storage에 파일 업로드 (UUID 파일 이름 사용)
    const filename = `mbti-cards/${crypto.randomUUID()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('mbtiresults')
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. 업로드된 파일의 공개 URL 가져오기
    const { data: urlData } = supabaseClient.storage
      .from('mbtiresults')
      .getPublicUrl(uploadData.path);

    // 5. 성공 응답으로 URL 반환
    return new Response(
      JSON.stringify({ publicUrl: urlData.publicUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // 6. 오류 발생 시 에러 응답 반환
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});