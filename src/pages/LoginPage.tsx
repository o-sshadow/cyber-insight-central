
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cyber-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <Logo size="large" />
          </div>
          <h2 className="text-xl text-muted-foreground">
            Cybersecurity Incident Management
          </h2>
        </div>

        <Card className="cyber-card border-0">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Enter your details to create your account' 
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-secondary"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="w-full text-center text-sm">
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 text-primary" 
                      onClick={() => setIsSignUp(false)}
                      type="button"
                    >
                      Sign In
                    </Button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 text-primary"
                      onClick={() => setIsSignUp(true)}
                      type="button"
                    >
                      Create one
                    </Button>
                  </span>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
