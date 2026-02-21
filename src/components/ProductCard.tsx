import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  price?: string;
  index: number;
}

const ProductCard = ({ id, name, description, image, price = "49,000원", index }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, removeFromCartById, isInCart, openCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isLiked = isFavorite(id);
  const isInCartItem = isInCart(id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  // 상품별 고유한 추천 수 (id 기반 간단 계산)
  const recommendationCount = 120 + id * 7;

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = () => {
    // 장바구니에 이미 있으면 제거, 없으면 추가
    if (isInCartItem) {
      removeFromCartById(id);
      toast({
        title: "장바구니에서 제거되었습니다",
        description: `${name}이(가) 장바구니에서 제거되었습니다.`,
      });
    } else {
      addToCart({ id, name, description, image, price });
      toast({
        title: "장바구니에 추가되었습니다",
        description: `${name}이(가) 장바구니에 담겼습니다.`,
      });
      // 카트 창 열기
      openCart();
    }
  };

  const handleLike = () => {
    if (isLiked) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, name, description, image, price });
    }
  };

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

    // 상품별로 장점, 단점, 주의사항 설정
    if (name.includes("데스크 매트") || name.includes("마우스 패드")) {
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
    } else if (name.includes("수납") || name.includes("정리") || name.includes("서랍")) {
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
    } else if (name.includes("조명") || name.includes("LED") || name.includes("RGB") || name.includes("스피커")) {
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
    } else if (name.includes("스탠드") || name.includes("받침대") || name.includes("선반")) {
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
      // 전자기기/액세서리 기본 정보
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

  const handleNameClick = () => {
    // 제목 클릭 시, 추천 메시지 토글 (한 번 더 누르면 사라짐)
    setShowRecommendation(!showRecommendation);
  };

  const handleFreeShippingClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsDetailDialogOpen(true);
  };

  const handleDialogAddToCart = () => {
    // 장바구니에 이미 있으면 제거, 없으면 추가
    if (isInCartItem) {
      removeFromCartById(id);
      toast({
        title: "장바구니에서 제거되었습니다",
        description: `${name}이(가) 장바구니에서 제거되었습니다.`,
      });
    } else {
      addToCart({ id, name, description, image, price });
      toast({
        title: "장바구니에 추가되었습니다",
        description: `${name}이(가) 장바구니에 담겼습니다.`,
      });
      // 카트 창 열기
      openCart();
    }
    setIsDialogOpen(false);
  };

  const handleDetailDialogAddToCart = () => {
    // 장바구니에 이미 있으면 제거, 없으면 추가
    if (isInCartItem) {
      removeFromCartById(id);
      toast({
        title: "장바구니에서 제거되었습니다",
        description: `${name}이(가) 장바구니에서 제거되었습니다.`,
      });
    } else {
      addToCart({ id, name, description, image, price });
      toast({
        title: "장바구니에 추가되었습니다",
        description: `${name}이(가) 장바구니에 담겼습니다.`,
      });
      // 카트 창 열기
      openCart();
    }
    setIsDetailDialogOpen(false);
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl bg-card card-shadow"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary cursor-pointer" onClick={handleProductClick}>
        <motion.img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Like Button - 우측 하단에 항상 표시 */}
        <motion.button
          className="absolute bottom-4 right-4 rounded-full bg-card p-2.5 text-muted-foreground shadow-lg transition-colors hover:bg-destructive hover:text-destructive-foreground z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          aria-label="찜하기"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
        </motion.button>
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-20 flex items-center justify-between opacity-0 transition-all duration-300 group-hover:opacity-100">
          <motion.button
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-colors ${
              isInCartItem
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {isInCartItem ? "빼기" : "담기"}
          </motion.button>
        </div>
        
        {/* 추천 수 표시 영역 */}
        <AnimatePresence>
          {showRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent px-4 py-3 z-20"
            >
              <p className="text-sm font-medium text-primary-foreground text-center">
                {recommendationCount}명이 이 제품을 추천했어요
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 
          className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleNameClick();
          }}
          onDoubleClick={handleProductClick}
        >
          {name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-foreground flex-shrink-0">{price}</span>
          <motion.button
            onClick={handleFreeShippingClick}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer flex-shrink-0 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            무료배송
          </motion.button>
        </div>
      </div>

      {/* Product Detail Dialog (상품 이름 클릭 시) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <DialogDescription className="text-base">
              상품 상세 정보
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">상품 설명</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* 추천 수 표시 */}
              <div className="rounded-lg bg-primary/10 px-4 py-3 border border-primary/20">
                <p className="text-base font-semibold text-primary text-center">
                  {recommendationCount}명이 이 제품을 추천했어요
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-2xl font-bold text-foreground">{price}</span>
                  <span className="ml-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    무료배송
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 border-t pt-4">
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
                  <span className="font-medium">#{id}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  handleLike();
                }}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                {isLiked ? "찜 해제" : "찜하기"}
              </Button>
              <Button
                className="flex-1"
                onClick={handleDialogAddToCart}
                variant={isInCartItem ? "destructive" : "default"}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isInCartItem ? "장바구니에서 빼기" : "장바구니에 담기"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog with Advantages/Disadvantages (무료배송 클릭 시) */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <DialogDescription className="text-base">
              상품 상세 정보 및 구매 가이드
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">상품 설명</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-2xl font-bold text-foreground">{price}</span>
                  <span className="ml-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    무료배송
                  </span>
                </div>
              </div>

              {/* 장점 */}
              <div className="border-t pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  장점
                </h4>
                <ul className="space-y-2">
                  {productDetails.advantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 단점 */}
              <div className="border-t pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <XCircle className="h-5 w-5 text-orange-500" />
                  단점
                </h4>
                <ul className="space-y-2">
                  {productDetails.disadvantages.map((disadvantage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                      <span>{disadvantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주의사항 */}
              <div className="border-t pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  주의사항
                </h4>
                <ul className="space-y-2">
                  {productDetails.precautions.map((precaution, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 제품 사양 */}
              <div className="border-t pt-4">
                <h4 className="mb-3 text-lg font-semibold text-foreground">제품 사양</h4>
                <div className="space-y-2">
                  {productDetails.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배송 및 반품 정보 */}
              <div className="space-y-2 border-t pt-4">
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
                  <span className="font-medium">#{id}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  handleLike();
                }}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                {isLiked ? "찜 해제" : "찜하기"}
              </Button>
              <Button
                className="flex-1"
                onClick={handleDetailDialogAddToCart}
                variant={isInCartItem ? "destructive" : "default"}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isInCartItem ? "장바구니에서 빼기" : "장바구니에 담기"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
};

export default ProductCard;
