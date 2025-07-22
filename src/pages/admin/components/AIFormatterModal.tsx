import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface AIFormatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatComplete: (formattedText: string) => void;
}

export const AIFormatterModal: React.FC<AIFormatterModalProps> = ({ isOpen, onClose, onFormatComplete }) => {
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormat = async () => {
    if (!rawText.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1. 내부 링크 생성을 위해 현재 발행된 모든 아티클 목록을 가져옵니다.
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('title, slug')
        .eq('is_published', true);

      if (articlesError) throw articlesError;

      // 2. 원문과 아티클 목록을 함께 AI 함수로 보냅니다.
      const { data, error: invokeError } = await supabase.functions.invoke('format-article-with-ai', {
        body: { 
          rawText,
          articleList: articles || [] 
        },
      });

      if (invokeError) throw invokeError;
      
      if (data.error) {
        throw new Error(data.error);
      }

      onFormatComplete(data.formattedText);
      setRawText('');
      onClose();

    } catch (e: any) {
      console.error('Error formatting text:', e);
      setError('변환에 실패했습니다. 잠시 후 다시 시도해주세요. 에러: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">AI로 붙여넣기</h2>
        <p className="text-gray-600 mb-4">이곳에 챗GPT 등에서 복사한 원문을 그대로 붙여넣으세요. AI가 자동으로 마크다운 서식을 적용해줍니다.</p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="여기에 원문을 붙여넣으세요..."
          className="w-full h-64 p-2 border border-gray-300 rounded-md mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleFormat}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? '변환 중...' : '변환하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
