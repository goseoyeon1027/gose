import { supabase } from "./supabase";

export interface PaymentItem {
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface Payment {
  id?: string;
  user_id: string;
  items: PaymentItem[];
  total_amount: number;
  created_at?: string;
}

// 결제 내역 저장
export const savePayment = async (payment: Payment) => {
  const { data, error } = await supabase.from("payments").insert([payment]).select();

  if (error) {
    console.error("결제 저장 오류:", error);
    throw error;
  }

  return data;
};

// 사용자의 결제 내역 조회
export const getUserPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("결제 내역 조회 오류:", error);
    throw error;
  }

  return data;
};

// 상품별 결제 횟수 조회 (베스트셀러용)
export const getProductPurchaseCounts = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("items");

  if (error) {
    console.error("결제 횟수 조회 오류:", error);
    throw error;
  }

  // 상품별 결제 횟수 계산
  const productCounts: Record<number, number> = {};

  data?.forEach((payment) => {
    payment.items.forEach((item: PaymentItem) => {
      const count = item.quantity || 1;
      productCounts[item.product_id] = (productCounts[item.product_id] || 0) + count;
    });
  });

  return productCounts;
};

