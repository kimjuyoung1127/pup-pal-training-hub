import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutUsPage from './pages/AboutUsPage';
import PricingPage from './pages/PricingPage';
import SuccessPage from './pages/SuccessPage';
import FailPage from './pages/FailPage';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import MbtiTestPage from './pages/MbtiTestPage';
import FilterWizardPage from './pages/FilterWizardPage';
import ArticlePage from './pages/ArticlePage';
import MainLayoutV2 from './components/MainLayoutV2';
import GeminiChatPage from './components/GeminiChatPage'; // GeminiChatPage 컴포넌트 임포트 추가
// BreedDirectoryPage는 더 이상 사용하지 않으므로 임포트 제거

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayoutV2>
          <Routes>
            {/* Pet-Life Magazine & Woofpedia 기능 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/column" element={<BlogPage />} />
            <Route path="/column/:id" element={<BlogDetailPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/mbti-test" element={<MbtiTestPage />} />
            <Route path="/filter-wizard" element={<FilterWizardPage />} />
            <Route path="/ai/breed-recommender" element={<FilterWizardPage />} />
            <Route path="/ai/mbti-test" element={<MbtiTestPage />} />
            <Route path="/breeds" element={<BlogPage />} /> {/* 견종 백과 경로를 BlogPage로 연결 */}
            <Route path="/chat" element={<GeminiChatPage />} /> {/* 추가: GeminiChatPage 경로 */}
            
            {/* Mungai 핵심 기능은 /app 경로 하위에 위치 */}
            <Route path="/app/*" element={<Index />} />

            {/* 기타 독립적인 페이지들 */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/fail" element={<FailPage />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayoutV2>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
