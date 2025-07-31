import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayoutV2 from './components/MainLayoutV2';
import GeminiChatPage from './components/GeminiChatPage';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

// main_features
import HomePage from './pages/main_features/HomePage';
import ArticlePage from './pages/main_features/ArticlePage';
import BlogPage from './pages/main_features/BlogPage';
import BlogDetailPage from './pages/main_features/BlogDetailPage';
import MbtiHubPage from './pages/main_features/MbtiHubPage';
import FindMyMatchPage from './pages/main_features/FindMyMatchPage';
import MbtiTestPage from './pages/main_features/MbtiTestPage';
import FilterWizardPage from './pages/main_features/FilterWizardPage';
import TrainingVideosPage from './pages/main_features/TrainingVideosPage'; // 추가

// app_core
import Index from "./pages/app_core/Index";

// admin_panel
import AdminLayout from './pages/admin_panel/AdminLayout';
import DashboardPage from './pages/admin_panel/DashboardPage';
import SuggestionsPage from './pages/admin_panel/SuggestionsPage';
import ArticlesListPage from './pages/admin_panel/ArticlesListPage';
import ArticleEditorPage from './pages/admin_panel/ArticleEditorPage';

// legal_and_info
import NotFound from "./pages/legal_and_info/NotFound";
import PrivacyPolicyPage from './pages/legal_and_info/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal_and_info/TermsOfServicePage';
import AboutUsPage from './pages/legal_and_info/AboutUsPage';
import PricingPage from './pages/legal_and_info/PricingPage';
import SuccessPage from './pages/legal_and_info/SuccessPage';
import FailPage from './pages/legal_and_info/FailPage';

const queryClient = new QueryClient();

import CommunityPage from './pages/community/CommunityPage';

import PostDetailPage from './pages/community/PostDetailPage';

import PostEditorPage from './pages/community/PostEditorPage';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';


const App = () => (
  <QueryClientProvider client={queryClient}>
    <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 관리자 페이지 라우트 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="suggestions" element={<SuggestionsPage />} />
            <Route path="articles" element={<ArticlesListPage />} />
            <Route path="editor/:id" element={<ArticleEditorPage />} /> {/* 에디터 페이지 라우트 추가 */}
          </Route>

          {/* 사용자 페이지 라우트 */}
          <Route path="/*" element={
            <MainLayoutV2>
              <Routes>
                {/* Pet-Life Magazine & Woofpedia 기능 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/articles/:slug" element={<ArticlePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/new" element={<PostEditorPage />} />
                <Route path="/community/edit/:postId" element={<PostEditorPage />} /> {/* 수정 페이지 라우트 추가 */}
                <Route path="/community/:postId" element={<PostDetailPage />} />
                <Route path="/column" element={<BlogPage />} />
                <Route path="/column/:id" element={<BlogDetailPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} /> {/* 추가: /blog/:id 경로 */}
                <Route path="/mbti-test" element={<MbtiHubPage />} />
                <Route path="/mbti-test/my-dog" element={<MbtiTestPage />} />
                <Route path="/mbti-test/find-match" element={<FindMyMatchPage />} />
                <Route path="/filter-wizard" element={<FilterWizardPage />} />
                <Route path="/ai/breed-recommender" element={<FilterWizardPage />} />
                <Route path="/breeds" element={<BlogPage />} /> {/* 견종 백과 경로를 BlogPage로 연결 */}
                <Route path="/chat" element={<GeminiChatPage />} /> {/* 추가: GeminiChatPage 경로 */}
                <Route path="/training/videos" element={<TrainingVideosPage />} />
                
                {/* Mungai 핵심 기능은 /app 경로 하위에 위치하며, 이 부분만 인증 컨텍스트로 감쌉니다. */}
                <Route path="/app/*" element={
                  <SessionContextProvider supabaseClient={supabase}>
                    <Index />
                  </SessionContextProvider>
                } />

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
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
