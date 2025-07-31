import React from 'react';
import { Mail } from 'lucide-react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">문의하기</h1>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-8">
               Mung-Ai에 대한 질문, 제안, 또는 파트너십 문의가 있으시면 언제든지 아래 이메일로 연락주세요.
              보내주신 내용은 신중하게 검토한 후 최대한 빠르게 답변드리겠습니다.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">연락처 정보</h2>
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <a 
                  href="mailto:gmdqn2tp@gmail.com" 
                  className="text-blue-600 hover:underline"
                >
                  gmdqn2tp@gmail.com
                </a>
              </div>
            </div>
            
            <div className="mt-10 text-sm text-gray-500">
              <p>
                - 서비스 이용 중 발생하는 기술적인 문제나 오류에 대한 문의도 환영합니다.
              </p>
              <p>
                - 콘텐츠 제휴 및 광고 관련 문의는 이메일 제목에 [제휴/광고] 말머리를 달아주시면 더 빠른 확인이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
