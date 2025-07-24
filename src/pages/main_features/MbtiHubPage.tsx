
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PawPrint, User, Dog } from 'lucide-react';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MbtiHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline mb-6 font-medium transition-colors duration-200">
          <ArrowLeft className="mr-2 h-4 w-4" />
          메인으로 돌아가기
        </Link>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <PawPrint className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                견종 성향 테스트 (MBTI)
              </span>
            </h1>
            <PawPrint className="h-8 w-8 text-purple-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            🌟 당신과 반려견에 대해 알려주세요. 🌟
          </p>
        </div>
        
        <div className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-center mb-6">
            <PawPrint className="h-12 w-12 text-orange-500 mr-4 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                어떤 테스트를 해볼까요?
              </span>
            </h1>
            <PawPrint className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            🐾 테스트 목적에 따라 질문이 달라져요. <br className="hidden sm:block" /> 
            💕 원하는 모드를 선택해주세요!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/mbti-test/my-dog">
              <Button 
                asChild
                className="flex flex-col items-center justify-center h-48 text-lg font-bold rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-orange-800 hover:from-orange-200 hover:to-pink-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div>
                  <Dog className="h-12 w-12 mb-3 text-orange-500 mx-auto" />
                  우리 강아지
                  <br />
                  성향 분석하기
                </div>
              </Button>
            </Link>
            <Link to="/mbti-test/find-match">
              <Button 
                asChild
                className="flex flex-col items-center justify-center h-48 text-lg font-bold rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div>
                  <User className="h-12 w-12 mb-3 text-purple-500 mx-auto" />
                  나와 잘 맞는
                  <br />
                  견종 찾기
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MbtiHubPage;
