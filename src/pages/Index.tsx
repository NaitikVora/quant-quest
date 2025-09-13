import { Hero } from "@/components/Hero";
import { SkillPreview } from "@/components/SkillPreview";
import { Features } from "@/components/Features";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <SkillPreview />
      <Features />
      <LeaderboardPreview />
    </div>
  );
};

export default Index;
