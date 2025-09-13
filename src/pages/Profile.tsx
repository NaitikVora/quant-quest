import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Trophy, 
  Target, 
  TrendingUp, 
  Star,
  Award,
  BarChart3,
  Crown,
  Medal,
  Zap,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';
import { AchievementService } from '@/services/achievementService';
import { User as UserType, UserUpdateData } from '@/types/user';

const Profile = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType['profile']>>({});

  useEffect(() => {
    if (user) {
      setEditData(user.profile);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateUser({ profile: editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData(user.profile);
    }
    setIsEditing(false);
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 10) return { color: 'bg-yellow-500', text: 'LEGEND', icon: Crown };
    if (rank <= 50) return { color: 'bg-purple-500', text: 'MASTER', icon: Medal };
    if (rank <= 100) return { color: 'bg-blue-500', text: 'EXPERT', icon: Award };
    if (rank <= 500) return { color: 'bg-green-500', text: 'ADVANCED', icon: Trophy };
    return { color: 'bg-gray-500', text: 'TRADER', icon: Target };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-mono font-bold mb-4">Please sign in to view your profile</h1>
            <Button className="btn-terminal">Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  const rankBadge = getRankBadge(user.leaderboard.globalRank);
  const RankIcon = rankBadge.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="card-terminal mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-mono font-bold text-foreground">
                      {user.displayName}
                    </h1>
                    <Badge className={`${rankBadge.color} text-white border-0`}>
                      <RankIcon className="h-3 w-3 mr-1" />
                      {rankBadge.text}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground font-mono mb-4">
                    Level {user.profile.level} • {user.profile.experience} • #{user.leaderboard.globalRank}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-warning" />
                      <span>{user.stats.challengesWon} Wins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span>{user.stats.winRate.toFixed(1)}% Win Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span>{user.achievements.totalAchievements} Achievements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>{user.skills.totalSkillPoints} Skill Points</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-mono"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 font-mono">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card className="card-terminal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={editData.firstName || ''}
                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editData.lastName || ''}
                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Input
                            id="bio"
                            value={editData.bio || ''}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                            className="font-mono"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editData.location || ''}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="font-mono"
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-terminal"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-muted-foreground">Name</Label>
                          <p className="font-mono">{user.profile.firstName} {user.profile.lastName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Bio</Label>
                          <p className="font-mono text-sm">{user.profile.bio || 'No bio provided'}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Location</Label>
                          <p className="font-mono text-sm">{user.profile.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Experience Level</Label>
                          <Badge variant="outline" className="font-mono">
                            {user.profile.experience}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Trading Style</Label>
                          <Badge variant="outline" className="font-mono">
                            {user.profile.tradingStyle}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Member Since</Label>
                          <p className="font-mono text-sm">
                            {new Date(user.profile.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="card-terminal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-accent" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.achievements.recentUnlocks.length > 0 ? (
                      <div className="space-y-3">
                        {user.achievements.recentUnlocks.slice(0, 3).map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <p className="font-mono text-sm font-semibold">{achievement.title}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {achievement.rarity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground font-mono text-sm">
                        No achievements yet. Start trading to unlock your first achievement!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="card-terminal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-success" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Simulations</span>
                        <span className="font-mono font-semibold">{user.stats.totalSimulations}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Net Profit</span>
                        <span className={`font-mono font-semibold ${user.stats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${user.stats.netProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Best Trade</span>
                        <span className="font-mono font-semibold text-success">
                          +{user.stats.bestTrade.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span className="font-mono font-semibold">{user.stats.sharpeRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trading Performance */}
                <Card className="card-terminal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      Trading Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/20">
                        <p className="text-2xl font-mono font-bold text-success">{user.stats.winRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/20">
                        <p className="text-2xl font-mono font-bold text-primary">{user.stats.totalTrades}</p>
                        <p className="text-xs text-muted-foreground">Total Trades</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Winning Trades</span>
                        <span className="font-mono">{user.stats.winningTrades}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Losing Trades</span>
                        <span className="font-mono">{user.stats.losingTrades}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Average Return</span>
                        <span className="font-mono">{user.stats.averageReturn.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Drawdown</span>
                        <span className="font-mono text-destructive">{user.stats.maxDrawdown.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Challenge Stats */}
                <Card className="card-terminal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-warning" />
                      Challenge Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/20">
                        <p className="text-2xl font-mono font-bold text-warning">{user.stats.challengesWon}</p>
                        <p className="text-xs text-muted-foreground">Challenges Won</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/20">
                        <p className="text-2xl font-mono font-bold text-primary">{user.stats.totalChallenges}</p>
                        <p className="text-xs text-muted-foreground">Total Challenges</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Challenge Win Rate</span>
                        <span className="font-mono">{user.stats.challengeWinRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Streak</span>
                        <span className="font-mono">{user.stats.currentStreak}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Longest Streak</span>
                        <span className="font-mono">{user.stats.longestStreak}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-6">
              <Card className="card-terminal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    All Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.achievements.unlocked.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.achievements.unlocked.map((achievement, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-mono font-semibold text-sm">{achievement.title}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {achievement.rarity}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-mono">
                        No achievements unlocked yet. Start trading to earn your first achievement!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card className="card-terminal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-mono font-semibold mb-3">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Notifications</span>
                        <Badge variant={user.preferences.notifications.email ? "default" : "outline"}>
                          {user.preferences.notifications.email ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Challenge Notifications</span>
                        <Badge variant={user.preferences.notifications.challenges ? "default" : "outline"}>
                          {user.preferences.notifications.challenges ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Achievement Notifications</span>
                        <Badge variant={user.preferences.notifications.achievements ? "default" : "outline"}>
                          {user.preferences.notifications.achievements ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-mono font-semibold mb-3">Privacy Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Profile</span>
                        <Badge variant={user.preferences.privacy.showProfile ? "default" : "outline"}>
                          {user.preferences.privacy.showProfile ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow Challenges</span>
                        <Badge variant={user.preferences.privacy.allowChallenges ? "default" : "outline"}>
                          {user.preferences.privacy.allowChallenges ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Online Status</span>
                        <Badge variant={user.preferences.privacy.showOnlineStatus ? "default" : "outline"}>
                          {user.preferences.privacy.showOnlineStatus ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-mono font-semibold mb-3">Game Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Default Strategy</span>
                        <Badge variant="outline">{user.preferences.game.defaultStrategy}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Default Capital</span>
                        <Badge variant="outline">${user.preferences.game.defaultCapital.toLocaleString()}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Difficulty</span>
                        <Badge variant="outline">{user.preferences.game.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
