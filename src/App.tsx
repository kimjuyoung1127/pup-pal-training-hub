import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence and motion
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GeminiChatPage from "./components/GeminiChatPage";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 20 }, // Added a slight y transition
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }, // Added a slight y transition
  transition: { duration: 0.3, ease: "easeInOut" } // Smoother easing
};

const AppContent = () => {
  const location = useLocation(); // Get location here

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}> {/* Pass location and key to Routes */}
        <Route
          path="/"
          element={
            <motion.div
              key="index" // Unique key for the route's motion wrapper
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
              style={{ background: 'hsl(var(--background))', minHeight: '100vh' }} // Ensure background covers viewport
            >
              <Index />
            </motion.div>
          }
        />
        <Route
          path="/chat"
          element={
            <motion.div
              key="chat" // Unique key for the route's motion wrapper
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
              style={{ background: 'hsl(var(--background))', minHeight: '100vh' }} // Ensure background covers viewport
            >
              <GeminiChatPage />
            </motion.div>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <motion.div
              key="notfound" // Unique key for the route's motion wrapper
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
              style={{ background: 'hsl(var(--background))', minHeight: '100vh' }} // Ensure background covers viewport
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent /> {/* Use AppContent which contains location logic */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
