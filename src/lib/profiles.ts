import { supabase } from "./supabase";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// 사용자 프로필 조회
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("프로필 조회 오류:", error);
    throw error;
  }

  return data;
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("프로필 업데이트 오류:", error);
    throw error;
  }

  return data;
};

