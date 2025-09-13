import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpData, SignInData } from '@/types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { signIn, signUp, resetPassword, error, clearError } = useAuth();

  // Form states
  const [signInData, setSignInData] = useState<SignInData>({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    password: '',
    displayName: '',
    firstName: '',
    lastName: ''
  });

  const [resetEmail, setResetEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      await signIn(signInData);
      setSuccessMessage('Successfully signed in!');
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1000);
    } catch (error: any) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      await signUp(signUpData);
      setSuccessMessage('Account created successfully! Please check your email for verification.');
      setTimeout(() => {
        setMode('signin');
        setSuccessMessage(null);
      }, 2000);
    } catch (error: any) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      await resetPassword(resetEmail);
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setResetEmail('');
    } catch (error: any) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  };

  const handleClose = () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-background border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-mono font-bold text-foreground flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            QUANTQUEST
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-mono">
            {mode === 'signin' ? 'SIGN IN TO CONTINUE' : 'JOIN THE QUANT REVOLUTION'}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <Alert className="border-success/50 bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {(error || localError) && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                {error || localError}
              </AlertDescription>
            </Alert>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-mono text-foreground">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="pl-10 font-mono"
                    placeholder="trader@quantquest.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-mono text-foreground">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="pl-10 pr-10 font-mono"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-terminal rounded-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    SIGN IN
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMode('reset')}
                >
                  Forgot your password?
                </Button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname" className="text-sm font-mono text-foreground">
                    FIRST NAME
                  </Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    className="font-mono"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname" className="text-sm font-mono text-foreground">
                    LAST NAME
                  </Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    className="font-mono"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-displayname" className="text-sm font-mono text-foreground">
                  DISPLAY NAME
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-displayname"
                    type="text"
                    value={signUpData.displayName}
                    onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                    className="pl-10 font-mono"
                    placeholder="QuantTrader2024"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-mono text-foreground">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="pl-10 font-mono"
                    placeholder="trader@quantquest.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-mono text-foreground">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="pl-10 pr-10 font-mono"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Minimum 6 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full btn-terminal rounded-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    CREATE ACCOUNT
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Password Reset Form */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-mono text-foreground">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 font-mono"
                    placeholder="trader@quantquest.com"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-terminal rounded-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    SEND RESET EMAIL
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMode('signin')}
                >
                  Back to sign in
                </Button>
              </div>
            </form>
          )}

          {/* Mode Switch */}
          {mode !== 'reset' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary hover:text-primary/80"
                onClick={switchMode}
              >
                {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
              </Button>
            </div>
          )}

          {/* Features Preview */}
          <Card className="card-terminal">
            <div className="p-4">
              <h4 className="text-sm font-mono font-bold text-foreground mb-3">
                JOIN TO UNLOCK:
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span>1v1 Trading Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span>Skill Progression System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-warning" />
                  <span>Personalized Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Global Leaderboard</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
