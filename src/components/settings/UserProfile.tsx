import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const UserProfile = ({ user }: { user: SupabaseUser | null }) => {
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;
  const userEmail = user?.email;
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-sky-100">
            <AvatarImage src={userAvatar} alt={userName || ''} />
            <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold text-sky-800">{userName}</CardTitle>
            <CardDescription className="text-sky-600">{userEmail}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};