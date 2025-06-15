
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Bell, Lock, User, LogOut } from 'lucide-react';

const SettingsPage = () => {
  const user = {
    name: '사용자',
    email: 'user@example.com',
    avatar: '/placeholder.svg'
  };

  const settingsOptions = [
    { id: 'profile', icon: User, label: '프로필 수정' },
    { id: 'notification', icon: Bell, label: '알림 설정' },
    { id: 'security', icon: Lock, label: '계정 보안' },
  ];

  return (
    <div className="p-4 bg-cream-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">설정</h1>
      
      <Card className="mb-6 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {settingsOptions.map((option) => {
              const Icon = option.icon;
              return (
                <li key={option.id} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-4">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{option.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 p-4">
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
