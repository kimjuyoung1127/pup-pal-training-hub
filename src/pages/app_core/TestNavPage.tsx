import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";

const TestNavPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">네비게이션 테스트 페이지</h1>
      <p className="text-gray-600 mb-8">이 페이지는 서랍 기능의 정상 작동 여부를 확인하기 위한 테스트 공간입니다.</p>
      
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="lg" className="bg-white">
            ✨ 여기를 눌러 서랍을 열어보세요 ✨
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader className="text-center">
              <DrawerTitle>🎉 서랍이 열렸습니다!</DrawerTitle>
              <DrawerDescription>이 화면이 보인다면, Drawer 컴포넌트는 정상적으로 작동하는 것입니다.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 text-center">
              <p>이제 문제의 원인이 다른 곳에 있다는 것을 알 수 있습니다.</p>
            </div>
            <DrawerFooter className="mt-4">
              <DrawerClose asChild>
                <Button variant="outline">닫기</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TestNavPage;
