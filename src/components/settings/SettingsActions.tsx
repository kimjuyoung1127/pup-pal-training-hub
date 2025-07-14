import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Info, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SettingsActions = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="mt-8 space-y-4">
      <Card className="bg-sky-50 shadow-md border border-sky-100">
        <CardContent className="p-2">
          <h3 className="px-4 pt-2 text-sm font-semibold text-sky-800">정보</h3>
          <Link to="/AboutUsPage">
            <Button className="w-full justify-start p-4 bg-transparent hover:bg-sky-100 focus:ring-0 text-sky-800">
              <Info className="w-5 h-5 mr-3 text-sky-600" />
              서비스 소개
            </Button>
          </Link>
          <Link to="/TermsOfServicePage">
            <Button className="w-full justify-start p-4 bg-transparent hover:bg-sky-100 focus:ring-0 text-sky-800">
              <FileText className="w-5 h-5 mr-3 text-sky-600" />
              서비스 이용약관
            </Button>
          </Link>
          <Link to="/PrivacyPolicyPage">
            <Button className="w-full justify-start p-4 bg-transparent hover:bg-sky-100 focus:ring-0 text-sky-800">
              <Shield className="w-5 h-5 mr-3 text-sky-600" />
              개인정보처리방침
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-sky-50 shadow-md border border-sky-100">
        <CardContent className="p-0">
          <Button
            className="w-full justify-start text-sky-500 hover:text-sky-600 bg-transparent hover:bg-sky-100 p-4 focus:ring-0 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};