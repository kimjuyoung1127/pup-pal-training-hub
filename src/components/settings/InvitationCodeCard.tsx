import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import confetti from 'canvas-confetti';
import { useToast } from "@/hooks/use-toast";
import { useDogProfile } from '@/hooks/useDogProfile';
import { Loader2, Gift } from 'lucide-react';

export const InvitationCodeCard = () => {
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refetchDogProfile } = useDogProfile();
  const { toast } = useToast();

  const handleRedeemCode = async () => {
    if (!invitationCode.trim()) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "초대 코드를 입력해주세요.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-invitation-code', {
        body: { invitation_code: invitationCode },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "업그레이드 완료!",
        description: data.message || "성공적으로 Pro 플랜으로 전환되었습니다!",
      });
      await refetchDogProfile();
      setInvitationCode('');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      toast({
        variant: "destructive",
        title: "등록 실패",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-sky-50 shadow-md border border-sky-100">
      <CardHeader>
        <div className="flex items-center">
          <Gift className="w-5 h-5 mr-2 text-sky-600" />
          <CardTitle className="text-sky-800">초대 코드 등록</CardTitle>
        </div>
        <CardDescription className="text-sky-700">
          초대 코드가 있다면 등록하고 Pro 플랜 혜택을 받으세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="여기에 초대코드를 입력해주세요."
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="w-full bg-white text-sky-900 placeholder:text-gray-500 border-2 border-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-md px-3 py-2 text-sm"
          />
          <Button
            onClick={handleRedeemCode}
            disabled={isLoading || !invitationCode}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "등록"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};