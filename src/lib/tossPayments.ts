// 토스페이먼츠 결제 함수
declare global {
  interface Window {
    TossPayments: any;
  }
}

const CLIENT_KEY = "test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm";
const SECRET_KEY = "test_sk_ORzdMaqN3wxBzK4gNPEYV5AkYXQG";

// 토스페이먼츠 SDK 로드
export const loadTossPayments = async () => {
  if (window.TossPayments) {
    return window.TossPayments(CLIENT_KEY);
  }
  
  // SDK가 아직 로드되지 않은 경우 대기
  return new Promise((resolve) => {
    const checkTossPayments = setInterval(() => {
      if (window.TossPayments) {
        clearInterval(checkTossPayments);
        resolve(window.TossPayments(CLIENT_KEY));
      }
    }, 100);
    
    // 최대 5초 대기
    setTimeout(() => {
      clearInterval(checkTossPayments);
      if (window.TossPayments) {
        resolve(window.TossPayments(CLIENT_KEY));
      } else {
        throw new Error("토스페이먼츠 SDK를 로드할 수 없습니다.");
      }
    }, 5000);
  });
};

// 결제 요청 함수
export const requestPayment = async (
  amount: number,
  orderId: string,
  orderName: string,
  customerName?: string,
  customerEmail?: string
) => {
  try {
    const tossPayments = await loadTossPayments();
    
    // 결제 요청
    await tossPayments.requestPayment("카드", {
      amount: amount,
      orderId: orderId,
      orderName: orderName,
      customerName: customerName || "고객",
      customerEmail: customerEmail || "",
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
    });
  } catch (error: any) {
    console.error("결제 요청 오류:", error);
    throw error;
  }
};

