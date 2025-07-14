import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { useDogProfile } from '@/hooks/useDogProfile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UserProfile } from './settings/UserProfile';
import { InvitationCodeCard } from './settings/InvitationCodeCard';
import { MediaGallery } from './settings/MediaGallery';
import { SettingsActions } from './settings/SettingsActions';
import { Header } from './settings/Header';

const SettingsPage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { plan } = useDogProfile();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      <Header />
      <div className="p-4 space-y-6">
        <UserProfile user={user} />
        
        {plan === 'free' && (
          <>
            <Card className="bg-sky-50 shadow-md border border-sky-100">
              <CardHeader>
                <CardTitle className="text-sky-800">Pro 플랜으로 업그레이드</CardTitle>
                <CardDescription className="text-sky-700">모든 기능을 제한 없이 사용해보세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/pricing">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
            <InvitationCodeCard />
          </>
        )}

        <MediaGallery />
        <SettingsActions />
      </div>
    </div>
  );
};

export default SettingsPage;