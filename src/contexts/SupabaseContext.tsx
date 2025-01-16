import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface SupabaseContextType {
  session: Session | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  isLoading: true
});

interface SupabaseProviderProps {
  children: (value: SupabaseContextType) => React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        logger.info('Auth session initialized', { userId: session?.user?.id });
        setSession(session);
      } catch (error) {
        logger.error('Failed to check auth session', { error });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.info('Auth state changed', { event, userId: session?.user?.id });
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, isLoading }}>
      {children({ session, isLoading })}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);