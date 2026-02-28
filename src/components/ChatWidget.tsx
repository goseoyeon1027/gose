import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { products, Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { requestPayment } from "@/lib/tossPayments";
import { savePayment, PaymentItem } from "@/lib/payments";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  searchResults?: Product[];
}

const OPENAI_API_KEY = "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// 상품 목록을 포맷팅하는 함수
const formatProductsList = (productList: typeof products): string => {
  let formatted = "=== 전체 상품 목록 ===\n\n";
  productList.forEach((product, index) => {
    formatted += `${index + 1}. ${product.name}\n`;
    formatted += `   가격: ${product.price}\n`;
    formatted += `   설명: ${product.description}\n`;
    formatted += `   카테고리: ${getCategoryName(product.category)}\n\n`;
  });
  formatted += `총 ${productList.length}개의 상품이 있습니다.`;
  return formatted;
};

// 카테고리 이름 변환
const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "desk-mats": "데스크 매트/패드",
    "storage": "수납/정리",
    "lighting": "조명",
    "stands": "스탠드/받침대",
    "accessories": "전자기기/액세서리",
  };
  return categoryMap[category] || category;
};

// 상품 관련 요청인지 확인
const isProductRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase().trim();
  
  // 주문/구매 키워드가 있으면 상품 요청이 아님
  const orderKeywords = ["주문", "구매", "결제", "살래", "사고", "장바구니", "담기"];
  if (orderKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return false;
  }

  // 상품 관련 키워드
  const productKeywords = [
    // 기본 상품 키워드
    "상품", "제품", "물건", "아이템", "굿즈",
    // 전체/목록 관련
    "전체", "모든", "목록", "리스트", "리스트", "모두",
    // 보기/알기 관련
    "보여", "알려", "보여줘", "알려줘", "보여줄래", "알려줄래",
    "보기", "알기", "확인", "찾기",
    // 검색 관련
    "검색", "찾아", "찾기", "검색해", "찾아줘",
    // 추천 관련
    "추천", "추천해", "추천해줘", "어떤거", "뭐가 좋아", "뭐가 나아",
    // 질문 형태
    "뭐", "무엇", "어떤", "뭐가", "무엇이", "어떤게", "뭐가 있어",
    "있어", "있나", "있니", "있어요", "있나요",
    // 가격 관련
    "가격", "얼마", "비싸", "싸", "할인", "가격이", "얼마야", "얼마예요",
    // 기능/특징 관련
    "기능", "특징", "사양", "용도", "어떻게", "어떤 기능", "뭐 하는",
    // 비교 관련
    "비교", "차이", "다른", "어떤게 나아", "뭐가 나아",
    // 재고 관련
    "재고", "재고가", "재고 있어", "재고 없어", "판매중", "판매",
    // 카테고리 관련
    "카테고리", "종류", "분류", "타입",
    // 실제 상품 카테고리
    "데스크", "매트", "패드", "수납", "정리", "조명", "라이트", "led",
    "스탠드", "받침대", "액세서리", "전자기기", "허브", "케이블",
    "마우스", "키보드", "모니터", "노트북", "이어폰", "헤드폰",
    "충전", "무선", "usb", "rgb",
  ];

  // 키워드 매칭
  if (productKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return true;
  }

  // 실제 상품명이나 설명에 포함된 단어가 있는지 확인
  const productNameWords = products.flatMap((p) => {
    const nameWords = p.name.toLowerCase().split(/\s+/);
    const descWords = p.description.toLowerCase().split(/\s+/);
    return [...nameWords, ...descWords].filter((word) => word.length > 2);
  });

  // 상품명/설명의 단어가 메시지에 포함되어 있는지 확인
  const hasProductWord = productNameWords.some((word) => 
    lowerMessage.includes(word) && word.length > 2
  );

  // 질문 형태 패턴 확인
  const questionPatterns = [
    /뭐\s*(가|를|을|는|이|가\s*있)/,
    /무엇\s*(이|을|를|은|는)/,
    /어떤\s*(거|것|제품|상품|아이템)/,
    /있\s*(어|나|니|어요|나요)/,
    /어떻게\s*(사용|쓰|이용)/,
    /가격\s*(이|은|는|이\s*얼마)/,
    /얼마\s*(야|예요|인가요|인지)/,
  ];

  const hasQuestionPattern = questionPatterns.some((pattern) => pattern.test(lowerMessage));

  return hasProductWord || hasQuestionPattern;
};

// 상품 검색 함수
const searchProducts = (query: string, limit?: number): Product[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  // 검색어가 비어있거나 "전체", "모든", "아무" 같은 키워드면 모든 상품 반환
  if (!lowerQuery || 
      lowerQuery.includes("전체") || 
      lowerQuery.includes("모든") || 
      lowerQuery.includes("아무") ||
      lowerQuery === "상품" || 
      lowerQuery === "제품" ||
      lowerQuery === "보여줘" ||
      lowerQuery === "보여줄래") {
    const result = products;
    // limit이 지정되어 있으면 해당 개수만 반환
    return limit ? result.slice(0, limit) : result;
  }

  // 상품명, 설명, 카테고리에서 검색
  const filtered = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(lowerQuery);
    const descMatch = product.description.toLowerCase().includes(lowerQuery);
    const categoryMatch = getCategoryName(product.category).toLowerCase().includes(lowerQuery);
    return nameMatch || descMatch || categoryMatch;
  });

  // limit이 지정되어 있으면 해당 개수만 반환
  return limit ? filtered.slice(0, limit) : filtered;
};

// 재고 수량 생성 (상품 ID 기반으로 일관된 값)
const getStockQuantity = (productId: number): number => {
  // 상품 ID를 기반으로 10~100 사이의 일관된 재고 수량 생성
  return 10 + (productId % 91);
};

// 가격을 숫자로 변환 (천 단위 콤마 제거)
const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
};

// 숫자를 천 단위 콤마로 포맷팅
const formatPrice = (price: number): string => {
  return price.toLocaleString("ko-KR") + "원";
};

// 주문/구매 관련 요청인지 확인
const isOrderRequest = (message: string): boolean => {
  const orderKeywords = [
    "주문",
    "구매",
    "결제",
    "살래",
    "사고",
    "구매하고",
    "주문하고",
    "결제하고",
  ];
  const lowerMessage = message.toLowerCase();
  return orderKeywords.some((keyword) => lowerMessage.includes(keyword));
};

// create_order 함수: 주문 생성 및 결제 진행
const createOrder = async (
  productId: number,
  quantity: number,
  customerName: string,
  customerEmail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 상품 정보 찾기
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: "상품을 찾을 수 없습니다." };
    }

    // 가격 계산
    const priceNumber = parsePrice(product.price);
    const totalPrice = priceNumber * quantity;

    // 주문 ID 생성
    const orderId = `ORDER_${Date.now()}_${productId}`;
    const orderName = `${product.name} ${quantity}개`;

    // 주문 정보를 로컬 스토리지에 저장 (결제 완료 페이지에서 사용)
    const orderItems: PaymentItem[] = [
      {
        product_id: productId,
        product_name: product.name,
        product_image: product.image,
        price: priceNumber,
        quantity: quantity,
      },
    ];

    const orderData = {
      orderId,
      productId,
      quantity,
      items: orderItems,
      totalAmount: totalPrice,
    };

    localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

    // 토스페이먼츠 결제 요청
    await requestPayment(
      totalPrice,
      orderId,
      orderName,
      customerName,
      customerEmail
    );

    // 결제 성공 시 (결제 페이지로 리다이렉트되므로 여기서는 성공 반환)
    return { success: true, message: `${product.name} ${quantity}개 주문 완료!` };
  } catch (error: any) {
    // 사용자가 결제를 취소한 경우
    if (error.code === "USER_CANCEL") {
      return { success: false, message: "결제가 취소되었습니다" };
    }
    console.error("주문 생성 오류:", error);
    return { success: false, message: "주문 처리 중 오류가 발생했습니다." };
  }
};

// 결제 성공 후 주문 저장 및 재고 감소 (PaymentSuccess 페이지에서 호출되지만, 여기서도 사용 가능)
export const saveOrderAndUpdateStock = async (
  orderId: string,
  userId: string,
  items: PaymentItem[]
): Promise<void> => {
  try {
    // payments 테이블에 주문 정보 저장
    await savePayment({
      user_id: userId,
      items: items,
      total_amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });

    // products 테이블에서 재고 감소 (stock 컬럼이 있다고 가정)
    for (const item of items) {
      // 현재 재고 조회
      const { data: productData, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (fetchError) {
        console.warn(`상품 ${item.product_id}의 재고 조회 실패:`, fetchError);
        // stock 컬럼이 없을 수 있으므로 경고만 출력하고 계속 진행
        continue;
      }

      if (productData && productData.stock !== undefined) {
        const newStock = Math.max(0, productData.stock - item.quantity);
        
        // 재고 업데이트
        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id);

        if (updateError) {
          console.error(`상품 ${item.product_id}의 재고 업데이트 실패:`, updateError);
        }
      }
    }
  } catch (error) {
    console.error("주문 저장 및 재고 업데이트 오류:", error);
    throw error;
  }
};

// 세션 ID 생성 또는 가져오기
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
};

// 채팅 메시지를 데이터베이스에 저장
const saveChatMessage = async (
  message: string,
  sender: "user" | "bot",
  userId: string | null,
  sessionId: string,
  searchResults?: Product[]
): Promise<void> => {
  try {
    // 검색 결과가 있으면 JSON으로 포함
    let messageToSave = message;
    if (searchResults && searchResults.length > 0) {
      const searchData = {
        message: message,
        searchResults: searchResults.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
        })),
      };
      messageToSave = JSON.stringify(searchData);
    }

    const { error } = await supabase.from("chat_messages").insert([
      {
        user_id: userId,
        session_id: sessionId,
        message: messageToSave,
        sender: sender,
      },
    ]);

    if (error) {
      console.error("채팅 메시지 저장 오류:", error);
    }
  } catch (error) {
    console.error("채팅 메시지 저장 중 오류:", error);
  }
};

const ChatWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! 무엇을 도와드릴까요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>(getSessionId());
  // 최근 검색 결과 저장 (번호로 주문할 때 사용)
  const lastSearchResultsRef = useRef<Product[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);
    
    // 사용자 메시지를 데이터베이스에 저장
    saveChatMessage(userInput, "user", user?.id || null, sessionIdRef.current);

    // 주문/구매 요청인지 확인
    if (isOrderRequest(userInput)) {
      if (!user) {
        const assistantMessage: Message = {
          role: "assistant",
          content: "주문을 하시려면 먼저 로그인이 필요합니다. 로그인 페이지로 이동하시겠어요?",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // 주문 요청 파싱 (예: "1번 상품 2개 주문", "데스크 매트 1개 구매" 등)
      const quantityMatch = userInput.match(/(\d+)\s*개/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

      // 상품 번호나 이름으로 찾기
      const productNumberMatch = userInput.match(/(\d+)\s*번/);
      let selectedProduct: Product | undefined;

      if (productNumberMatch) {
        // "2번" 같은 경우: 이전 검색 결과에서 찾기
        const productIndex = parseInt(productNumberMatch[1], 10) - 1;
        
        // 최근 검색 결과가 있으면 그것을 사용
        if (lastSearchResultsRef.current.length > 0 && lastSearchResultsRef.current[productIndex]) {
          selectedProduct = lastSearchResultsRef.current[productIndex];
        } else {
          // 최근 검색 결과가 없으면 전체 상품 목록에서 찾기
          if (productIndex >= 0 && productIndex < products.length) {
            selectedProduct = products[productIndex];
          }
        }
      } else {
        // 상품명으로 찾기
        const cleanQuery = userInput
          .replace(/주문|구매|결제|살래|사고|\d+개/g, "")
          .trim();
        const searchResults = searchProducts(cleanQuery);
        
        // 검색 결과를 저장 (다음 번호 주문을 위해)
        lastSearchResultsRef.current = searchResults;
        
        if (searchResults.length > 0) {
          selectedProduct = searchResults[0];
        }
      }

      if (!selectedProduct) {
        const assistantMessage: Message = {
          role: "assistant",
          content: "주문하실 상품을 찾을 수 없습니다. 상품 번호나 이름을 정확히 입력해주세요.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        // 봇 메시지를 데이터베이스에 저장
        saveChatMessage(assistantMessage.content, "bot", user?.id || null, sessionIdRef.current);
        setIsLoading(false);
        return;
      }

      // 주문 생성 및 결제 진행
      const customerName = user.user_metadata?.name || user.email?.split("@")[0] || "고객";
      const customerEmail = user.email || "";

      const result = await createOrder(
        selectedProduct.id,
        quantity,
        customerName,
        customerEmail
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: result.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // 봇 메시지를 데이터베이스에 저장
      saveChatMessage(assistantMessage.content, "bot", user?.id || null, sessionIdRef.current);
      setIsLoading(false);
      return;
    }

    // 상품 검색 요청인지 확인
    if (isProductRequest(userInput)) {
      // "N개 보여줘", "N개만 보여줘", "N개" 같은 패턴에서 개수 추출
      const countMatch = userInput.match(/(\d+)\s*개/);
      const limit = countMatch ? parseInt(countMatch[1], 10) : undefined;
      
      // 검색어에서 개수 관련 텍스트 제거
      const cleanQuery = userInput
        .replace(/\d+\s*개\s*만?/g, "")
        .replace(/\d+\s*개/g, "")
        .replace(/보여줘|보여줄래|보여|알려줘|알려줄래|알려|만/g, "")
        .trim();
      
      const searchResults = searchProducts(cleanQuery, limit);
      
      if (searchResults.length > 0) {
        // 검색 결과를 저장 (번호로 주문할 때 사용)
        lastSearchResultsRef.current = searchResults;
        
        const assistantMessage: Message = {
          role: "assistant",
          content: `검색 결과: ${searchResults.length}개의 상품을 찾았습니다.`,
          searchResults: searchResults,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        // 검색 결과와 함께 봇 메시지를 데이터베이스에 저장
        saveChatMessage(
          assistantMessage.content,
          "bot",
          user?.id || null,
          sessionIdRef.current,
          searchResults
        );
        setIsLoading(false);
        return;
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: "검색 결과가 없습니다. 다른 검색어를 시도해보세요.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        // 봇 메시지를 데이터베이스에 저장
        saveChatMessage(assistantMessage.content, "bot", user?.id || null, sessionIdRef.current);
        setIsLoading(false);
        return;
      }
    }

    try {
      // 상품 정보를 시스템 프롬프트에 포함
      const productsInfo = products
        .map((p, idx) => `${idx + 1}. ${p.name} - ${p.price} (${getCategoryName(p.category)}): ${p.description}`)
        .join("\n");

      const systemPrompt = `You are a helpful assistant for an e-commerce website. Respond in Korean.

현재 판매 중인 상품 목록:
${productsInfo}

사용자가 상품에 대해 물어보면 위 목록에서 정보를 찾아서 정확하게 답변해주세요. 전체 상품을 보여달라고 하면 모든 상품을 목록으로 보여주세요.`;

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: userMessage.content,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      // 봇 메시지를 데이터베이스에 저장
      saveChatMessage(assistantMessage.content, "bot", user?.id || null, sessionIdRef.current);
    } catch (error) {
      console.error("챗봇 오류:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      // 에러 메시지를 데이터베이스에 저장
      saveChatMessage(errorMessage.content, "bot", user?.id || null, sessionIdRef.current);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[90vw] sm:w-96 max-w-md h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <CardTitle className="text-lg font-semibold">챗봇 상담</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  {/* 텍스트 메시지 */}
                  <div
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  
                  {/* 검색 결과 카드 그리드 */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      {message.searchResults.map((product, productIndex) => {
                        const stock = getStockQuantity(product.id);
                        const priceNum = parsePrice(product.price);
                        return (
                          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                              {/* 번호 배지 */}
                              <Badge className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground">
                                {productIndex + 1}
                              </Badge>
                              
                              {/* 상품 이미지 */}
                              {product.image && (
                                <div className="w-full h-32 bg-muted overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <CardContent className="p-3">
                              {/* 상품 이름 */}
                              <h4 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                                {product.name}
                              </h4>
                              
                              {/* 가격 */}
                              <p className="text-primary font-bold text-base mb-2">
                                {formatPrice(priceNum)}
                              </p>
                              
                              {/* 재고 수량 */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">재고</span>
                                <Badge variant={stock > 30 ? "default" : stock > 10 ? "secondary" : "destructive"}>
                                  {stock.toLocaleString("ko-KR")}개
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                    <p className="text-sm">입력 중...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="border-t p-4 space-y-2">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;

