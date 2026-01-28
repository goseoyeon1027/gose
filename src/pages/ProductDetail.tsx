import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Plus, Minus, CreditCard, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentItem } from "@/lib/payments";
import { requestPayment } from "@/lib/tossPayments";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductById } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : 0;
  const product = getProductById(productId);

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();

  const isLiked = isFavorite(productId);

  useEffect(() => {
    // 페이지 진입 시 스크롤을 상단으로 이동
    window.scrollTo(0, 0);
    
    if (!product) {
      toast({
        title: "상품을 찾을 수 없습니다",
        description: "존재하지 않는 상품입니다.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [product, navigate, toast, id]);

  if (!product) {
    return null;
  }

  // 상품별 상세 정보 생성 함수
  const getProductDetails = () => {
    const details: {
      advantages: string[];
      disadvantages: string[];
      precautions: string[];
      specifications: { label: string; value: string }[];
    } = {
      advantages: [],
      disadvantages: [],
      precautions: [],
      specifications: [],
    };

    if (product.name.includes("데스크 매트") || product.name.includes("마우스 패드")) {
      details.advantages = [
        "부드러운 표면으로 마우스 움직임이 원활함",
        "미끄럼 방지 처리로 안정적인 사용 가능",
        "쉬운 청소 및 관리",
        "다양한 크기로 책상에 맞게 선택 가능",
      ];
      details.disadvantages = [
        "장기간 사용 시 마모 가능성",
        "일부 제품은 세탁 시 변형 가능",
      ];
      details.precautions = [
        "직사광선을 피해 보관하세요",
        "세탁 시 세탁기 사용 금지 (손세탁 권장)",
        "습기가 많은 곳에 보관하지 마세요",
      ];
      details.specifications = [
        { label: "재질", value: "펠트/고무" },
        { label: "두께", value: "3-5mm" },
        { label: "무게", value: "경량" },
      ];
    } else if (product.name.includes("수납") || product.name.includes("정리") || product.name.includes("서랍") || product.name.includes("케이블")) {
      details.advantages = [
        "책상 공간을 효율적으로 활용",
        "잡동사니를 깔끔하게 정리",
        "접근이 쉬운 구조",
        "다양한 크기의 물건 보관 가능",
      ];
      details.disadvantages = [
        "설치 시 공간 제약",
        "일부 제품은 설치가 필요할 수 있음",
      ];
      details.precautions = [
        "설치 전 책상 두께를 확인하세요",
        "무거운 물건은 하단에 배치하세요",
        "정기적으로 청소하여 먼지 제거",
      ];
      details.specifications = [
        { label: "재질", value: "플라스틱/금속" },
        { label: "최대 하중", value: "5-10kg" },
        { label: "설치 방식", value: "클램프/볼트" },
      ];
    } else if (product.name.includes("조명") || product.name.includes("LED") || product.name.includes("RGB") || product.name.includes("스피커")) {
      details.advantages = [
        "작업 환경의 분위기 개선",
        "눈의 피로 감소",
        "다양한 색상 및 밝기 조절 가능",
        "에너지 효율적인 LED 사용",
      ];
      details.disadvantages = [
        "전원 연결 필요",
        "일부 제품은 설정이 복잡할 수 있음",
      ];
      details.precautions = [
        "전원 코드를 꼬이지 않게 정리하세요",
        "과열을 방지하기 위해 통풍이 잘 되는 곳에 설치",
        "물기와 접촉을 피하세요",
      ];
      details.specifications = [
        { label: "전원", value: "USB/AC 어댑터" },
        { label: "밝기 조절", value: "다단계 조절 가능" },
        { label: "색온도", value: "2700K-6500K" },
      ];
    } else if (product.name.includes("스탠드") || product.name.includes("받침대") || product.name.includes("선반") || product.name.includes("모니터")) {
      details.advantages = [
        "목과 어깨의 부담 감소",
        "책상 공간 확보",
        "인체공학적 디자인",
        "각도 조절 가능",
      ];
      details.disadvantages = [
        "설치 시 공간이 필요",
        "일부 제품은 조립이 필요할 수 있음",
      ];
      details.precautions = [
        "설치 전 안정성을 확인하세요",
        "최대 하중을 초과하지 마세요",
        "정기적으로 나사를 점검하세요",
      ];
      details.specifications = [
        { label: "재질", value: "알루미늄/강철" },
        { label: "최대 하중", value: "10-20kg" },
        { label: "각도 조절", value: "0-90도" },
      ];
    } else {
      details.advantages = [
        "생산성 향상",
        "편리한 사용성",
        "고품질 재질",
        "다양한 기능 제공",
      ];
      details.disadvantages = [
        "전원 연결 필요",
        "일부 제품은 드라이버 설치 필요",
      ];
      details.precautions = [
        "사용 전 설명서를 읽어보세요",
        "정격 전압을 확인하세요",
        "습기와 접촉을 피하세요",
      ];
      details.specifications = [
        { label: "전원", value: "USB/무선" },
        { label: "호환성", value: "범용" },
        { label: "보증기간", value: "1년" },
      ];
    }

    return details;
  };

  const productDetails = getProductDetails();
  const priceNumber = parseInt(product.price.replace(/[^0-9]/g, "")) || 0;
  const totalPrice = priceNumber * quantity;
  const recommendationCount = 120 + product.id * 7;

  const handleAddToCart = () => {
    // 수량만큼 추가 (기존 상품이 있으면 수량 증가)
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, description: product.description, image: product.image, price: product.price });
    }
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.name} ${quantity}개가 장바구니에 담겼습니다.`,
    });
  };

  const handleDirectPurchase = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "결제를 위해 로그인해주세요.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const orderId = `ORDER_${Date.now()}_${product.id}`;
      const orderName = quantity > 1 ? `${product.name} 외 ${quantity - 1}개` : product.name;

      // 주문 정보를 로컬 스토리지에 저장 (결제 완료 페이지에서 사용)
      const orderItems: PaymentItem[] = [
        {
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          price: priceNumber,
          quantity: quantity,
        },
      ];

      const orderData = {
        orderId,
        userId: user.id,
        items: orderItems,
        totalAmount: totalPrice,
      };

      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

      // 토스페이먼츠 결제 요청 (결제 성공 시 /payment/success로 리다이렉트)
      await requestPayment(
        totalPrice,
        orderId,
        orderName,
        user.user_metadata?.name || user.email?.split("@")[0] || "고객",
        user.email || undefined
      );
    } catch (error: any) {
      // 사용자가 결제를 취소한 경우
      if (error.code === "USER_CANCEL") {
        toast({
          title: "결제 취소",
          description: "결제가 취소되었습니다.",
        });
      } else {
        toast({
          title: "결제 실패",
          description: error.message || "결제 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLike = () => {
    if (isLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({ id: product.id, name: product.name, description: product.description, image: product.image, price: product.price });
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | STUDIO 101</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="section-container py-8 md:py-12">
            {/* 뒤로가기 버튼 */}
            <motion.button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </motion.button>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* 상품 이미지 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square overflow-hidden rounded-2xl bg-secondary"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* 상품 정보 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
                  <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                  
                  {/* 추천 수 */}
                  <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 border border-primary/20">
                    <p className="text-base font-semibold text-primary text-center">
                      {recommendationCount}명이 이 제품을 추천했어요
                    </p>
                  </div>

                  {/* 가격 */}
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      무료배송
                    </span>
                  </div>
                </div>

                {/* 수량 조절 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-foreground">수량</label>
                      <div className="flex items-center gap-4">
                        <motion.button
                          className={`rounded-full p-2 border transition-colors ${
                            quantity <= 1
                              ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                              : "text-muted-foreground hover:bg-primary hover:text-primary-foreground border-border"
                          }`}
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                          whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="min-w-[3rem] text-center text-lg font-semibold">{quantity}</span>
                        <motion.button
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground border border-border"
                          onClick={() => setQuantity(quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">총 상품금액</span>
                        <span className="text-2xl font-bold text-primary">
                          {totalPrice.toLocaleString("ko-KR")}원
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleLike}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                      {isLiked ? "찜 해제" : "찜하기"}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      장바구니 담기
                    </Button>
                  </div>
                  <Button
                    className="w-full h-12 text-base font-semibold bg-primary"
                    onClick={handleDirectPurchase}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    구매하기
                  </Button>
                </div>

                {/* 배송 정보 */}
                <Card>
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">배송 정보</span>
                      <span className="font-medium">무료배송 (1-2일 소요)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">반품/교환</span>
                      <span className="font-medium">7일 이내 가능</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">상품 번호</span>
                      <span className="font-medium">#{product.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 상세 정보 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 space-y-8"
            >
              {/* 장점 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    장점
                  </h3>
                  <ul className="space-y-2">
                    {productDetails.advantages.map((advantage, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <span>{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 단점 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <XCircle className="h-5 w-5 text-orange-500" />
                    단점
                  </h3>
                  <ul className="space-y-2">
                    {productDetails.disadvantages.map((disadvantage, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <span>{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 주의사항 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    주의사항
                  </h3>
                  <ul className="space-y-2">
                    {productDetails.precautions.map((precaution, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 제품 사양 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">제품 사양</h3>
                  <div className="space-y-2">
                    {productDetails.specifications.map((spec, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;

