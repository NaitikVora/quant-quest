import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityService, CommunityQuestion } from "@/services/communityService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function CommunityQuestionCard({ question }: { question: CommunityQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  return (
    <Card className="card-terminal p-4">
      <div className="font-mono text-lg mb-2 text-foreground">{question.question}</div>
      <ul className="mb-2">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <button
              className={`w-full text-left p-2 rounded border mb-1 font-mono ${
                answered
                  ? idx === question.correctOption
                    ? 'bg-success/10 border-success text-success font-bold'
                    : selected === idx
                      ? 'bg-destructive/10 border-destructive text-destructive'
                      : 'bg-muted/10 border-muted-foreground/30 text-white'
                  : 'bg-card border-border hover:bg-accent/10'
              }`}
              disabled={answered}
              onClick={() => {
                setSelected(idx);
                setAnswered(true);
              }}
            >
              {String.fromCharCode(65 + idx)}. {opt}
              {answered && idx === question.correctOption && <span className="ml-2 text-xs">(Correct)</span>}
              {answered && selected === idx && idx !== question.correctOption && <span className="ml-2 text-xs">(Your answer)</span>}
            </button>
          </li>
        ))}
      </ul>
      {answered && (
        <div className={`mt-2 font-mono text-sm ${selected === question.correctOption ? 'text-success' : 'text-destructive'}`}>
          {selected === question.correctOption ? 'Correct! 🎉' : 'Incorrect. Try the next one!'}
        </div>
      )}
      <Badge variant="outline" className="text-xs mt-2">Contributed by: {question.contributedBy}</Badge>
    </Card>
  );
}
import Confetti from "react-confetti";

export default function Community() {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correctOption: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'leaderboard'>('add');

  useEffect(() => {
    CommunityService.getAllQuestions().then(setQuestions);
    CommunityService.getLeaderboard().then(setLeaderboard);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || submitting) return;
    setSubmitting(true);
    setJustSubmitted(false);
    const res = await CommunityService.addQuestion({
      ...form,
      contributedBy: user.displayName || user.email,
      userId: user.uid
    });
    if (res && res.points) {
      setShowConfetti(true);
      setReward(res.points);
      await refreshUser();
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setForm({ question: "", options: ["", "", "", ""], correctOption: 0 });
    setSubmitting(false);
    setJustSubmitted(true);
    setQuestions(await CommunityService.getAllQuestions());
    setLeaderboard(await CommunityService.getLeaderboard());
    setTimeout(() => setJustSubmitted(false), 1000);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <p className="text-primary font-mono text-sm mb-2">COMMUNITY ENGAGEMENT</p>
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                COMMUNITY QUESTIONS
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
            </div>
            <div className="flex gap-2 mb-8 font-mono">
              <Button variant={activeTab === 'add' ? 'default' : 'outline'} onClick={() => setActiveTab('add')}>ADD QUESTION</Button>
              <Button variant={activeTab === 'view' ? 'default' : 'outline'} onClick={() => setActiveTab('view')}>VIEW ALL</Button>
              <Button variant={activeTab === 'leaderboard' ? 'default' : 'outline'} onClick={() => setActiveTab('leaderboard')}>LEADERBOARD</Button>
            </div>
            {activeTab === 'add' && (
              <Card className="card-terminal p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono mb-1">Question</label>
                    <textarea className="w-full p-2 rounded border text-black placeholder:text-muted-foreground" required value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block font-mono mb-1">Options</label>
                    {form.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <input
                          className="flex-1 p-2 rounded border text-black placeholder:text-muted-foreground"
                          required
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={e => setForm(f => {
                            const options = [...f.options];
                            options[idx] = e.target.value;
                            return { ...f, options };
                          })}
                        />
                        <input
                          type="radio"
                          name="correctOption"
                          checked={form.correctOption === idx}
                          onChange={() => setForm(f => ({ ...f, correctOption: idx }))}
                        />
                        <span className="text-xs font-mono">Correct</span>
                      </div>
                    ))}
                  </div>
                  <Button type="submit" disabled={submitting || !user || justSubmitted} className="btn-terminal w-full animate-bounce-once">{submitting ? 'Submitting...' : 'Submit'}</Button>
                  {reward && <div className="text-success font-mono mt-2">+{reward} points awarded!</div>}
                </form>
              </Card>
            )}
            {activeTab === 'view' && (
              <div className="space-y-4">
                {questions.length === 0 && <div className="text-muted-foreground">No community questions yet.</div>}
                {questions.map(q => (
                  <CommunityQuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <h2 className="text-xl font-mono font-bold text-foreground mb-6">COMMUNITY LEADERBOARD</h2>
                <Card className="card-terminal p-6">
                  <div className="space-y-4">
                    {leaderboard.length === 0 && <div className="text-muted-foreground">No contributors yet.</div>}
                    {leaderboard.map((player, index) => (
                      <div key={player.userId} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm ${index === 0 ? 'text-accent' : index === 1 ? 'text-muted-foreground' : index === 2 ? 'text-warning' : 'text-foreground'}`}>#{index + 1}</div>
                          <div>
                            <h3 className="font-mono text-foreground">{player.contributedBy}</h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-accent font-bold">{player.points}</p>
                          <p className="text-sm text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}
