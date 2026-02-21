import { supabase } from "./supabase";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  image: string;
  price: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 상품 검색 함수
 * 
 * 사용자가 상품 이름을 말하면 Supabase 'products' 테이블에서 검색하여 결과를 반환합니다.
 * 
 * @param productName - 검색할 상품 이름 (부분 일치 검색)
 * @returns 검색된 상품 배열
 * 
 * @example
 * // "데스크 매트"를 검색
 * const results = await saerch_products("데스크 매트");
 * 
 * @description
 * 이 함수는 AI가 사용자가 상품을 찾고 있을 때 자동으로 호출됩니다.
 * 사용자가 상품 이름, 카테고리, 또는 상품 설명과 관련된 질문을 하면
 * 이 함수를 사용하여 상품을 검색할 수 있습니다.
 */
export const saerch_products = async (productName: string): Promise<Product[]> => {
  try {
    // 상품 이름으로 부분 일치 검색 (대소문자 구분 없음)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${productName}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("상품 검색 오류:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("상품 검색 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 모든 상품 조회
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("상품 조회 오류:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("상품 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 상품 ID로 상품 조회
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("상품 조회 오류:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("상품 조회 중 오류 발생:", error);
    throw error;
  }
};

