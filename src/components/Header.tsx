import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { 
  Menu, 
  X, 
  LogIn, 
  Zap,
  Target,
  Trophy,
  Brain,
  Sword,
  Puzzle,
  TrendingDown
} from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  const navItems = [
  { path: "/", label: "HOME", icon: Zap },
  { path: "/skill-progression", label: "SKILLS", icon: Brain },
  { path: "/leaderboard", label: "LEADERBOARD", icon: Trophy },
  { path: "/1v1", label: "1V1 CHALLENGES", icon: Sword },
  { path: "/daily-puzzles", label: "DAILY PUZZLES", icon: Puzzle },
  { path: "/market-crashes", label: "MARKET CRASHES", icon: TrendingDown },
  { path: "/community", label: "COMMUNITY", icon: Target }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-mono font-bold text-foreground">
                  QUANTQUEST
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="font-mono text-sm hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  LOADING...
                </div>
              ) : user ? (
                <UserMenu />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="font-mono"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  SIGN IN
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
              <nav className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start font-mono text-sm"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};
