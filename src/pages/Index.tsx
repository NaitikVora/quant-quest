import { Hero } from "@/components/Hero";
import { SkillTree } from "@/components/SkillTree";
import { Features } from "@/components/Features";
import { Leaderboard } from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <SkillTree />
      <Features />
      <Leaderboard />
    </div>
  );
};

export default Index;
