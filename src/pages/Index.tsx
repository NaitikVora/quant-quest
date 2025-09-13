import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { SkillPreview } from "@/components/SkillPreview";
import { Features } from "@/components/Features";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SkillPreview />
        <Features />
        <LeaderboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
