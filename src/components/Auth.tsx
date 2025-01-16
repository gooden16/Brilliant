import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { logger } from '../lib/logger';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      logger.info('Attempting authentication', { 
        isSignUp, 
        email,
        hasPassword: !!password 
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
        logger.info('Sign up successful', { email });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        logger.info('Sign in successful', { email });
      }
    } catch (error: any) {
      logger.error('Authentication failed', { 
        isSignUp, 
        email, 
        error: error.message 
      });
      setError(error.message);
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
        
        {error && (
          <div className="mb-6 p-4 bg-burgundy/20 border border-burgundy/50 rounded-lg text-cream text-sm">
            {error}
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
              value={email}
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-light-blue text-navy font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
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
              setError('');
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