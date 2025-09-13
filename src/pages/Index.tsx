import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { SkillPreview } from "@/components/SkillPreview";
import { Features } from "@/components/Features";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import CoachQunalDemo from "@/components/CoachQunalDemo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SkillPreview />
        <Features />
        <LeaderboardPreview />
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <CoachQunalDemo onStartChat={() => {}} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
