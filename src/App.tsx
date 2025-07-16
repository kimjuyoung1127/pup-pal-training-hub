import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GeminiChatPage from "./components/GeminiChatPage";
import TrainingHistoryPage from './components/TrainingHistoryPage';
import TrainingProgressPage from './components/TrainingProgressPage';
import TrainingReplayPage from './components/TrainingReplayPage';
import SettingsPage from './components/SettingsPage';
import DogBadges from './components/DogBadges'; // DogBadgesPage 대신 DogBadges를 임포트합니다.
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutUsPage from './pages/AboutUsPage';
import PricingPage from './pages/PricingPage'; // PricingPage import 추가
import SuccessPage from './pages/SuccessPage';
import FailPage from './pages/FailPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<GeminiChatPage />} />
          <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
          <Route path="/TermsOfServicePage" element={<TermsOfServicePage />} />
          <Route path="/AboutUsPage" element={<AboutUsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/training-history" element={<TrainingHistoryPage onNavigate={function (page: string, params?: any): void {
            throw new Error("Function not implemented.");
          } } />} />
            throw new Error("Function not implemented.");
          <Route path="/training-progress/:programId" element={<TrainingProgressPage trainingProgram={undefined} onNavigate={function (page: string): void {
            throw new Error("Function not implemented.");
          } } onExit={function (): void {
            throw new Error("Function not implemented.");
          } } dogId={""} />} />
    
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dog-badges" element={<DogBadges badges={[]} isLoading={false} />} /> {/* DogBadges 컴포넌트를 사용하고 필요한 props를 전달합니다. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;