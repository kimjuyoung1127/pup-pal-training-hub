
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, Dog } from 'lucide-react';
import { toast } from 'sonner';
import { useDogProfile, FullDogInfo, FullDogExtendedProfile } from '@/hooks/useDogProfile';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// 강아지 프로필과 확장 프로필을 결합하고, 불필요한 속성을 제거한 타입을 정의합니다.
type ChatDogProfile = Omit<FullDogInfo & FullDogExtendedProfile, 'id' | 'dog_id' | 'created_at' | 'updated_at'>;

const GeminiChatPage = () => {
  const navigate = useNavigate();
  const { dogInfo, extendedProfile } = useDogProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (dogInfo && extendedProfile) {
      const fullProfile = { ...dogInfo, ...extendedProfile };
      // 민감하거나 불필요한 정보 제거
      delete (fullProfile as any).id;
      delete (fullProfile as any).dog_id;
      delete (fullProfile as any).created_at;
      delete (fullProfile as any).updated_at;

      const systemMessage: Message = {
        role: 'user', // 시스템 메시지를 user 역할로 보내 AI가 인식하도록 함
        parts: [{
          text: `[SYSTEM] 다음은 사용자의 강아지 프로필입니다. 이 정보를 바탕으로 모든 답변을 제공해주세요: ${JSON.stringify(fullProfile, null, 2)}`
        }]
      };

      const initialBotMessage: Message = {
        role: 'model',
        parts: [{
          text: `안녕하세요! 저는 강아지 훈련 전문가, 멍멍코치입니다. ${dogInfo.name}와(과) 관련된 모든 훈련과 행동 문제에 대해 상담해드릴 수 있어요. 무엇을 도와드릴까요?`
        }]
      };

      // 시스템 메시지를 가장 먼저, 그 다음 봇의 인사 메시지를 설정합니다.
      // 시스템 메시지는 UI에 렌더링하지 않을 것입니다.
      setMessages([systemMessage, initialBotMessage]);
    }
  }, [dogInfo, extendedProfile]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      let fullProfile: Partial<ChatDogProfile> = {}; // fullProfile에 대한 명시적 타입 정의
      if (dogInfo && extendedProfile) {
        const combinedProfile = { ...dogInfo, ...extendedProfile };
        
        // delete 연산자는 'any' 타입 또는 선택적 속성에만 사용할 수 있으므로, 타입 단언을 사용합니다.
        delete (combinedProfile as any).id;
        delete (combinedProfile as any).dog_id;
        delete (combinedProfile as any).created_at;
        delete (combinedProfile as any).updated_at;

        fullProfile = combinedProfile;
      }

      const { data, error } = await supabase.functions.invoke('gemini-plaintext-chat', { 
        body: { history: newMessages, dogProfile: fullProfile }, // fullProfile을 백엔드로 전달
      });

      console.log('Supabase function response:', data); // 응답 데이터 콘솔에 출력

      if (error) {
        throw error;
      }

      // The 'data' from the function is now plain text.
      const botMessage: Message = { 
        role: 'model', 
        parts: [{ text: data }] // 'data'를 직접 사용
      }; 
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      toast.error('메시지를 보내는 데 실패했습니다. 다시 시도해주세요.');
      setMessages(messages);
      setInput(currentInput);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center space-x-2 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full">
                <Dog className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">AI 훈련 코치</h1>
              <p className="text-sm text-gray-600">멍멍코치와 대화하기</p>
            </div>
        </div>
      </header>

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.filter(msg => !(msg.parts[0].text.startsWith('[SYSTEM]'))).map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 shrink-0">
                      <Dog size={20} />
                  </div>
              )}
              <Card className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-white text-black'}`}>

                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      
    
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 shrink-0">
                <Dog size={20} />
            </div>
            <Card className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </Card>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Message input */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="멍멍코치에게 메시지 보내기..."
            className="flex-1 border-gray-200 focus:border-orange-400 bg-white text-black"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default GeminiChatPage;
