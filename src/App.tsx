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
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import MbtiTestPage from './pages/MbtiTestPage';
import FilterWizardPage from './pages/FilterWizardPage';
import WoofpediaLayout from './pages/WoofpediaLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Woofpedia 기능 그룹 (공통 헤더/푸터 적용) */}
          <Route element={<WoofpediaLayout />}>
            <Route path="/" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/mbti-test" element={<MbtiTestPage />} />
            <Route path="/filter-wizard" element={<FilterWizardPage />} />
          </Route>

          {/* Mungai 핵심 기능은 /app 경로 하위에 위치 */}
          <Route path="/app/*" element={<Index />} />

          {/* 기타 독립적인 페이지들 */}
          <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
          <Route path="/TermsOfServicePage" element={<TermsOfServicePage />} />
          <Route path="/AboutUsPage" element={<AboutUsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;