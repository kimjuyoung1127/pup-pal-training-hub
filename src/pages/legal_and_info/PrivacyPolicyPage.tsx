import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">개인정보처리방침</h1>
      <p className="mb-4">
        멍멍트레이너는 사용자의 개인정보를 소중히 여기며, 개인정보 보호법 등 관련 법령을 준수합니다. 본 방침은 당사가 운영하는 웹사이트에서 수집하는 개인정보의 항목, 수집 목적, 보관 기간, 이용 방법 등을 안내합니다.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. 수집하는 개인정보 항목</h2>
      <p className="mb-4">
        당사는 서비스 제공을 위해 이름, 이메일 주소 등 최소한의 개인정보를 수집할 수 있습니다. 또한 서비스 이용 과정에서 IP 주소, 쿠키, 방문 기록이 자동으로 수집될 수 있습니다.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. 개인정보의 수집 및 이용목적</h2>
      <p className="mb-4">
        수집한 개인정보는 서비스 제공, 사용자 문의 대응, 서비스 품질 개선, 법적 의무 이행을 위해 이용됩니다.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. 개인정보의 보유 및 이용기간</h2>
      <p className="mb-4">
        개인정보는 수집·이용 목적 달성 시까지 보유하며, 관련 법령에 따라 보존이 필요한 경우에는 해당 기간 동안 안전하게 보관됩니다.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. 개인정보의 제3자 제공</h2>
      <p className="mb-4">
        당사는 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 따라 필요한 경우에는 예외로 할 수 있습니다.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. 개인정보 보호책임자 안내</h2>
      <p className="mb-4">
        개인정보 보호 관련 문의사항은 아래 이메일로 연락해 주시기 바랍니다. <br />
        이메일: gmdqn2tp@gmail.com
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. 개인정보처리방침 변경</h2>
      <p className="mb-4">
        본 개인정보처리방침은 관련 법령이나 내부 방침에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.
      </p>

      <p className="text-sm text-gray-600 mt-8">최종 수정일: 2024년 7월 26일</p>
    </div>
  );
};

export default PrivacyPolicyPage;
