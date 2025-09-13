import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "HOME", code: "HOME" },
    { path: "/skill-progression", label: "SKILLS", code: "SKILL" },
    { path: "/leaderboard", label: "LEADERBOARD", code: "RANK" },
    { path: "/1v1", label: "1V1 CHALLENGES", code: "PVP" },
    { path: "/daily-puzzles", label: "DAILY PUZZLES", code: "DLY" },
    { path: "/market-crashes", label: "MARKET CRASHES", code: "BSS" }
  ];

  return (
    <nav className="border-b border-border/50 bg-card/30 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-primary font-mono text-sm">QUANTQUEST</span>
            <div className="h-px bg-primary w-8"></div>
          </div>
          
          <div className="flex gap-2 font-mono">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="rounded-none text-xs"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
