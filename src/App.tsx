import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OneVOne from "./pages/OneVOne";
import DailyPuzzles from "./pages/DailyPuzzles";
import MarketCrashes from "./pages/MarketCrashes";
import SkillProgression from "./pages/SkillProgression";
import LeaderboardPage from "./pages/LeaderboardPage";
import SimulationPage from "./pages/SimulationPage";
import Profile from "./pages/Profile";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/1v1" element={<OneVOne />} />
            <Route path="/daily-puzzles" element={<DailyPuzzles />} />
            <Route path="/market-crashes" element={<MarketCrashes />} />
            <Route path="/skill-progression" element={<SkillProgression />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/simulation/:crisisId" element={<SimulationPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
