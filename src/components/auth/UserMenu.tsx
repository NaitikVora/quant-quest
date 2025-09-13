import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Trophy, 
  Target, 
  TrendingUp,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);


  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 10) return { color: 'bg-yellow-500', text: 'LEGEND' };
    if (rank <= 50) return { color: 'bg-purple-500', text: 'MASTER' };
    if (rank <= 100) return { color: 'bg-blue-500', text: 'EXPERT' };
    if (rank <= 500) return { color: 'bg-green-500', text: 'ADVANCED' };
    return { color: 'bg-gray-500', text: 'TRADER' };
  };

  const rankBadge = getRankBadge(user.leaderboard.globalRank);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-mono text-sm">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          {/* Online Status Indicator */}
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-card border-border" align="end" forceMount>
        {/* User Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-mono">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-mono font-bold text-foreground">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Level {user.profile.level} • {user.profile.experience}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${rankBadge.color} text-white border-0`}
                  >
                    {rankBadge.text}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    #{user.leaderboard.globalRank}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-success">
                  {user.stats.winRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-primary">
                  {user.stats.totalChallenges}
                </div>
                <div className="text-xs text-muted-foreground">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-accent">
                  {user.achievements.totalAchievements}
                </div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Navigation Items */}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span className="font-mono">Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/skill-progression')}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span className="font-mono">Skills</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/leaderboard')}
        >
          <Trophy className="mr-2 h-4 w-4" />
          <span className="font-mono">Leaderboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/1v1')}
        >
          <Target className="mr-2 h-4 w-4" />
          <span className="font-mono">1v1 Challenges</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/achievements')}
        >
          <Star className="mr-2 h-4 w-4" />
          <span className="font-mono">Achievements</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="font-mono">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Sign Out */}
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-mono">
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
