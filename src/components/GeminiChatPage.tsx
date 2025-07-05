
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send, Dog } from 'lucide-react';
import { useDogProfile, FullDogInfo, FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// 강아지 프로필과 확장 프로필을 결합하고, 불필요한 속성을 제거한 타입을 정의합니다.
type ChatDogProfile = Omit<FullDogInfo & FullDogExtendedProfile, 'id' | 'dog_id' | 'created_at' | 'updated_at'>;

// 프로필 요약 함수
const createProfileSummary = (
  profile: Partial<ChatDogProfile>,
  dogName: string,
  healthNames: string[],
  trainingNames: string[]
): string => {
  let summary = `[SYSTEM] 사용자의 강아지 '${dogName}'에 대한 프로필 요약입니다. 이 정보를 바탕으로 전문적이고 친근한 훈련사처럼 한국어로 답변해주세요.\n`;
  summary += `- 이름: ${dogName}\n`;
  if (profile.age) summary += `- 나이: ${profile.age.years}살 ${profile.age.months}개월\n`;
  if (profile.breed) summary += `- 견종: ${profile.breed}\n`;
  if (healthNames.length > 0) summary += `- 건강 상태: ${healthNames.join(', ')}\n`;
  if (trainingNames.length > 0) summary += `- 훈련 목표: ${trainingNames.join(', ')}\n`;
  if (profile.sensitive_factors) summary += `- 민감 반응 요소: ${profile.sensitive_factors}\n`;
  if (profile.known_behaviors && profile.known_behaviors.length > 0) summary += `- 알려진 행동: ${profile.known_behaviors.join(', ')}\n`;
  summary += "이 프로필을 참고하여, 사용자의 질문에 맞춤형 조언을 제공해야 합니다.";
  return summary;
};

const GeminiChatPage = () => {
  const navigate = useNavigate();
  const { dogInfo, extendedProfile, healthStatusNames, trainingGoalNames, plan, isLoading: isDogProfileLoading } = useDogProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionMessageCount, setSessionMessageCount] = useState(0); // 세션 메시지 카운트
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (isDogProfileLoading) return; // 프로필 로딩 중에는 아무것도 하지 않음

    let greeting = "안녕하세요! 저는 강아지 훈련 전문가, 멍멍코치입니다.";
    if (dogInfo) {
      greeting += ` ${dogInfo.name}와(과)의 즐거운 생활을 위해 무엇이든 물어보세요.`;
      if (trainingGoalNames && trainingGoalNames.length > 0) {
        greeting += `\n\n${dogInfo.name}의 훈련 목표인 '${trainingGoalNames.join(', ')}'에 대해 먼저 이야기해볼까요?`;
      } else if (healthStatusNames && healthStatusNames.length > 0) {
        greeting += `\n\n${dogInfo.name}의 건강 상태(${healthStatusNames.join(', ')})와 관련해서 궁금한 점이 있으신가요?`;
      }
    } else {
      greeting += " 강아지 프로필을 등록하시면 더 정확한 상담을 받을 수 있어요. 무엇을 도와드릴까요?";
    }

    const initialBotMessage: Message = {
      role: 'model',
      parts: [{ text: greeting }]
    };
    setMessages([initialBotMessage]);

  }, [dogInfo, healthStatusNames, trainingGoalNames, isDogProfileLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading || isDogProfileLoading) return;

    if (plan === 'free' && sessionMessageCount >= 10) {
      toast.error("무료 대화 횟수를 모두 사용했어요.", {
        description: "Pro 플랜으로 업그레이드하고 무제한으로 대화해보세요!",
        action: {
          label: "업그레이드",
          onClick: () => navigate('/pricing'), // 가격 정책 페이지로 이동
        },
      });
      return; // 함수 실행 중단
    }

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    
    let fullProfile: Partial<ChatDogProfile> = {};
    if (dogInfo && extendedProfile) {
      const combinedProfile = { ...dogInfo, ...extendedProfile };
      delete (combinedProfile as any).id;
      delete (combinedProfile as any).dog_id;
      delete (combinedProfile as any).created_at;
      delete (combinedProfile as any).updated_at;
      fullProfile = combinedProfile;
    }

    const systemMessageText = createProfileSummary(
      fullProfile,
      dogInfo?.name || '강아지',
      healthStatusNames || [],
      trainingGoalNames || []
    );

    const systemMessage: Message = {
      role: 'user',
      parts: [{ text: systemMessageText }]
    };

    // 항상 최신 대화 기록과 함께 시스템 메시지를 전송
    const messagesToSend = [systemMessage, ...messages, userMessage];

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-plaintext-chat', { 
        body: { history: messagesToSend, dogProfile: fullProfile },
      });

      console.log('Supabase function response:', data);

      if (error) {
        throw error;
      }

      // The 'data' from the function is now plain text.
      const botMessage: Message = { 
        role: 'model', 
        parts: [{ text: data }] // 'data'를 직접 사용
      }; 
      setMessages(prev => [...prev, botMessage]);
      // 메시지 전송 성공 시 카운트 증가
      setSessionMessageCount(prev => prev + 1);

    } catch (err: any) {
      console.error(err);
      toast.error('메시지를 보내는 데 실패했습니다. 다시 시도해주세요.');
      setMessages(prevMessages => prevMessages.slice(0, -1)); // 실패 시 사용자 메시지 제거
      setInput(currentInput);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center space-x-2 sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-sky-600 hover:text-sky-800 bg-transparent hover:bg-sky-100 focus:ring-0"
        >
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
            placeholder={isDogProfileLoading ? "강아지 정보를 불러오는 중..." : "멍멍코치에게 메시지 보내기..."}
            className="flex-1 bg-white text-gray-800 placeholder-gray-600 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-orange-500"
            disabled={isLoading || isDogProfileLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || isDogProfileLoading}
            className="bg-orange-500 hover:bg-orange-600 text-gray-800 rounded-full p-2"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default GeminiChatPage;
