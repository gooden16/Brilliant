import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { logger } from '../lib/logger';

interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'success';
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<ErrorState>({ message: '', type: 'error' });
  const [waitTime, setWaitTime] = useState(0);
  const [waitTimer, setWaitTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (waitTimer) clearInterval(waitTimer);
    };
  }, [waitTimer]);

  // Auto-verify after a short delay in development
  useEffect(() => {
    if (verificationSent) {
      const timer = setTimeout(async () => {
        try {
          // Simulate email verification by signing in directly
          const { error } = await supabase.auth.signInWithPassword({
            email,
            // Use a development password that would match what's in the email
            password: 'development-password-123'
          });
          
          if (error) throw error;
          
          logger.info('Development auto-verification successful', { email });
        } catch (error) {
          logger.error('Development auto-verification failed', { error });
        }
      }, 1500); // Short delay to simulate clicking the email link
      
      return () => clearTimeout(timer);
    }
  }, [verificationSent, email]);

  const clearError = () => setError({ message: '', type: 'error' });

  const startWaitTimer = (seconds: number) => {
    setWaitTime(seconds);
    if (waitTimer) clearInterval(waitTimer);
    
    const timer = setInterval(() => {
      setWaitTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setWaitTimer(timer);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    
    try {
      logger.info('Attempting authentication', { 
        isSignUp, 
        email
      });

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setVerificationSent(true);
        setError({
          message: 'Account created! Verifying...',
          type: 'success'
        });
        logger.info('Sign up successful', { email });
      } else {
        // In development, use password auth instead of OTP
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // Check for rate limit error
          if (error.message.includes('security purposes') && error.message.includes('seconds')) {
            const seconds = parseInt(error.message.match(/\d+/)?.[0] || '60');
            const formattedTime = seconds > 60 
              ? `${Math.floor(seconds / 60)} minutes and ${seconds % 60} seconds`
              : `${seconds} seconds`;
            setError({ 
              message: `Please wait ${formattedTime} before trying again`,
              type: 'warning' 
            });
            startWaitTimer(seconds);
          }
          throw error;
        }
        logger.info('Sign in email sent', { email });
      }
    } catch (error: any) {
      logger.error('Authentication failed', { 
        isSignUp, 
        email, 
        error: error.message 
      });
      setError({ 
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy/50 backdrop-blur-sm rounded-xl border border-white/5 p-8">
        <h1 className="text-3xl font-playfair font-bold text-center mb-2 text-cream">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-center text-cream/60 mb-8">
          {isSignUp 
            ? 'Sign up to start managing your financial advisory sessions'
            : 'Sign in to continue with your sessions'
          }
        </p>
        
        {error.message && (
          <div className={`mb-6 p-4 rounded-lg text-cream text-sm flex items-center gap-2 ${
            error.type === 'error' ? 'bg-burgundy/20 border border-burgundy/50' : 
            error.type === 'warning' ? 'bg-gold/20 border border-gold/50' :
            'bg-deep-olive/20 border border-deep-olive/50'
          }`}>
            {error.type === 'error' ? <AlertCircle className="w-4 h-4 text-burgundy" /> : 
             error.type === 'warning' ? <Clock className="w-4 h-4 text-gold" /> :
             <CheckCircle2 className="w-4 h-4 text-deep-olive" />} {error.message}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cream/80 mb-2">
              <Mail className="inline-block w-4 h-4 mr-2 text-dusty-pink" />
              Email
            </label>
            <input
              type="email"
              value={email.trim()}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/80 mb-2">
              <Lock className="inline-block w-4 h-4 mr-2 text-dusty-pink" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
              required
              disabled={loading}
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || waitTime > 0}
            className="w-full bg-light-blue text-navy font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : waitTime > 0 ? (
              <>
                <Clock className="w-5 h-5" />
                Try again in {waitTime}s
              </>
            ) : (
              <>{isSignUp ? 'Create Account' : 'Sign In'}</>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              clearError();
              setPassword('');
            }}
            className="text-dusty-pink hover:text-dusty-pink/80 transition-colors"
            disabled={loading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}