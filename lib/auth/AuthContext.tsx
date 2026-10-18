'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { SupportedLanguage } from '@/types/i18n';

export const DEMO_USER_ID = 'demo-farmer-id-kerala';
export const DEMO_USER_STORAGE = 'krishimitra_demo_user';
export const DEMO_PROFILE_STORAGE = 'krishimitra_demo_profile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  signInWithDemo: (email?: string, password?: string) => Promise<Profile>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setLanguage } = useTranslation();
  const { setSelectedDistrict, setSelectedState } = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (userId === DEMO_USER_ID) {
      try {
        const raw = localStorage.getItem(DEMO_PROFILE_STORAGE);
        if (raw) {
          const parsed = JSON.parse(raw) as Profile;
          setProfile(parsed);
          return parsed;
        }
      } catch {}
      return null;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching farmer profile:', error.message);
        return null;
      }

      if (data) {
        setProfile(data as Profile);

        // Sync preferred language if valid
        if (data.preferred_language) {
          setLanguage(data.preferred_language as SupportedLanguage);
        }

        // Sync district if set
        if (data.district) {
          setSelectedState('Kerala');
          setSelectedDistrict(data.district);
        }

        return data as Profile;
      }

      return null;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, [setLanguage, setSelectedDistrict, setSelectedState]);

  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    if (!user) return null;
    return await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signInWithDemo = async (email = 'farmer@krishimitra.in'): Promise<Profile> => {
    const mockUser: User = {
      id: DEMO_USER_ID,
      email,
      app_metadata: { provider: 'demo' },
      user_metadata: { full_name: 'Anil Kumar (അനിൽ കുമാർ)' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    let existingProfile: Profile | null = null;
    try {
      const raw = localStorage.getItem(DEMO_PROFILE_STORAGE);
      if (raw) existingProfile = JSON.parse(raw);
    } catch {}

    const activeProfile: Profile = existingProfile || {
      id: DEMO_USER_ID,
      full_name: 'Anil Kumar (അനിൽ കുമാർ)',
      preferred_language: 'ml',
      district: 'Wayanad',
      village_or_town: 'Meppadi',
      phone_number: '+91 98470 12345',
      onboarding_completed: false, // Starts as false to allow the user to test land division onboarding
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DEMO_USER_STORAGE, JSON.stringify(mockUser));
      localStorage.setItem(DEMO_PROFILE_STORAGE, JSON.stringify(activeProfile));
    } catch {}

    setUser(mockUser);
    setProfile(activeProfile);

    if (activeProfile.preferred_language) {
      setLanguage(activeProfile.preferred_language as SupportedLanguage);
    }
    if (activeProfile.district) {
      setSelectedState('Kerala');
      setSelectedDistrict(activeProfile.district);
    }

    return activeProfile;
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user) return null;

    if (user.id === DEMO_USER_ID) {
      const current = profile || {
        id: DEMO_USER_ID,
        full_name: 'Anil Kumar (അനിൽ കുമാർ)',
        preferred_language: 'ml',
        district: 'Wayanad',
        village_or_town: 'Meppadi',
        phone_number: '+91 98470 12345',
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated: Profile = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(DEMO_PROFILE_STORAGE, JSON.stringify(updated));
      } catch {}

      setProfile(updated);
      if (updated.preferred_language) setLanguage(updated.preferred_language as SupportedLanguage);
      if (updated.district) {
        setSelectedState('Kerala');
        setSelectedDistrict(updated.district);
      }
      return updated;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data as Profile);
    return data as Profile;
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(DEMO_USER_STORAGE);
      localStorage.removeItem(DEMO_PROFILE_STORAGE);
      localStorage.removeItem('krishimitra_demo_farms');
      localStorage.removeItem('krishimitra_demo_plots');
      localStorage.removeItem('krishimitra_demo_crops');
    } catch {}
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    // Check for demo user in localStorage first
    try {
      const demoUserRaw = localStorage.getItem(DEMO_USER_STORAGE);
      if (demoUserRaw) {
        const demoUser = JSON.parse(demoUserRaw) as User;
        setUser(demoUser);
        fetchProfile(demoUser.id).finally(() => setIsLoading(false));
        return;
      }
    } catch {}

    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // 2. Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured, fetchProfile]);

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    try {
      localStorage.removeItem(DEMO_USER_STORAGE);
    } catch {}
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured,
        signOut,
        refreshProfile,
        signInWithDemo,
        updateProfile,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
