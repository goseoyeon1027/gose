import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    // Supabase Auth로 회원가입 시도 (Supabase가 자동으로 중복 체크)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
      },
    });

    if (error) {
      // Supabase의 중복 이메일 에러 처리
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists") ||
        error.message.includes("User already registered")
      ) {
        return {
          error: {
            message: "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.",
          },
        };
      }
      return { error };
    }

    // 회원가입 성공 시 프로필이 트리거로 자동 생성됨
    // 트리거가 실패할 경우를 대비해 명시적으로 프로필 생성 시도
    if (data.user) {
      // 트리거가 자동으로 프로필을 생성하지만, 
      // 약간의 지연이 있을 수 있으므로 잠시 후 확인
      setTimeout(async () => {
        try {
          const { error: profileError } = await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              email: data.user.email || email,
              name: name || email.split("@")[0],
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "id",
            }
          );

          if (profileError) {
            console.error("프로필 생성 오류:", profileError);
          }
        } catch (err) {
          console.error("프로필 생성 중 오류:", err);
        }
      }, 500);

      setUser(data.user);
      setSession(data.session);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

