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
  // RLS 정책 준수를 위해 데이터 검증
  if (!payment.user_id) {
    throw new Error("user_id가 필요합니다.");
  }

  // items가 배열인지 확인
  if (!Array.isArray(payment.items)) {
    throw new Error("items는 배열이어야 합니다.");
  }

  // total_amount가 숫자인지 확인
  if (typeof payment.total_amount !== "number" || payment.total_amount < 0) {
    throw new Error("total_amount는 0 이상의 숫자여야 합니다.");
  }

  // Supabase에 저장 (RLS 정책이 자동으로 적용됨)
  const { data, error } = await supabase
    .from("payments")
    .insert([
      {
        user_id: payment.user_id,
        items: payment.items,
        total_amount: payment.total_amount,
      },
    ])
    .select();

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

