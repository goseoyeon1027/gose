import { ShoppingCart, Menu, X, Trash2, Star, Plus, Minus, CreditCard, CheckCircle2, XCircle, AlertCircle, LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentItem } from "@/lib/payments";
import { requestPayment } from "@/lib/tossPayments";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 초기값: localStorage 또는 시스템 설정
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const { cartItems, removeFromCart, updateQuantity, cartCount, isCartOpen, openCart, closeCart, clearCart } = useCart();
  const { favoriteItems, removeFromFavorites, favoritesCount } = useFavorites();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 다크모드 적용
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  // 홈으로 스무스 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 홈 버튼 클릭 핸들러
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // 이미 홈 페이지에 있으면 상단으로 스크롤
      scrollToTop();
    } else {
      // 다른 페이지에 있으면 홈으로 이동 후 스크롤
      navigate('/');
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  };

  // 상품별 상세 정보 생성 함수 (ProductCard와 동일한 로직)
  const getProductDetails = (name: string) => {
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
    } else if (name.includes("수납") || name.includes("정리") || name.includes("서랍") || name.includes("케이블")) {
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
    } else if (name.includes("스탠드") || name.includes("받침대") || name.includes("선반") || name.includes("모니터")) {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "상품", href: "#products" },
    { name: "스토리", href: "/story" },
    { name: "고객지원", href: "/support" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-header" : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHomeClick}
          >
            <span className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              STUDIO <span className="text-primary">101</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  if (link.name === "홈" && link.href === "/") {
                    handleHomeClick(e);
                  } else if (link.name === "상품" && link.href === "#products") {
                    e.preventDefault();
                    // 홈으로 이동
                    navigate("/");
                    // 홈 페이지가 로드된 후 상품 섹션으로 스크롤
                    setTimeout(() => {
                      const productsSection = document.getElementById("products");
                      if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
              >
                {link.name}
              </motion.a>
            ))}
            {user ? (
              <>
                <motion.a
                  href="/mypage"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  whileHover={{ y: -2 }}
                >
                  마이페이지
                </motion.a>
                <motion.button
                  onClick={async () => {
                    await signOut();
                    toast({
                      title: "로그아웃",
                      description: "로그아웃되었습니다.",
                    });
                    navigate("/");
                  }}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
                  whileHover={{ y: -2 }}
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </motion.button>
              </>
            ) : (
              <motion.a
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                whileHover={{ y: -2 }}
              >
                로그인
              </motion.a>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* 다크모드 토글 버튼 */}
            <motion.button
              className="relative rounded-full bg-secondary p-2.5 text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                toast({
                  title: isDarkMode ? "라이트 모드로 전환되었습니다" : "다크 모드로 전환되었습니다",
                  description: isDarkMode ? "밝은 화면으로 변경되었습니다." : "어두운 화면으로 변경되었습니다.",
                });
              }}
              title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
              <motion.div
                key={isDarkMode ? "dark" : "light"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.div>
            </motion.button>
            <motion.button
              className="relative rounded-full bg-secondary p-2.5 text-foreground transition-colors hover:bg-muted"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="즐겨찾기"
              onClick={() => setIsFavoritesOpen(true)}
            >
              <Star className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {favoritesCount}
                </span>
              )}
            </motion.button>
            <motion.button
              className="relative rounded-full bg-secondary p-2.5 text-foreground transition-colors hover:bg-muted"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="장바구니"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="rounded-full bg-secondary p-2.5 text-foreground md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="메뉴"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (link.name === "홈" && link.href === "/") {
                        handleHomeClick(e);
                      } else if (link.name === "상품" && link.href === "#products") {
                        e.preventDefault();
                        // 홈으로 이동
                        navigate("/");
                        // 홈 페이지가 로드된 후 상품 섹션으로 스크롤
                        setTimeout(() => {
                          const productsSection = document.getElementById("products");
                          if (productsSection) {
                            productsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }
                    }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                {user ? (
                  <>
                    <motion.a
                      href="/mypage"
                      className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      마이페이지
                    </motion.a>
                    <motion.button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await signOut();
                        toast({
                          title: "로그아웃",
                          description: "로그아웃되었습니다.",
                        });
                        navigate("/");
                      }}
                      className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </motion.button>
                  </>
                ) : (
                  <motion.a
                    href="/login"
                    className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </motion.a>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Favorites Sheet */}
        <Sheet open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>즐겨찾기</SheetTitle>
              <SheetDescription>
                {favoritesCount > 0 ? `${favoritesCount}개의 상품이 즐겨찾기에 있습니다.` : "즐겨찾기가 비어있습니다."}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {favoriteItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Star className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">즐겨찾기가 비어있습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className="mt-1 text-sm font-bold text-foreground">{item.price}</p>
                      </div>
                      <motion.button
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeFromFavorites(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Cart Sheet */}
        <Sheet open={isCartOpen} onOpenChange={(open) => {
          if (!open) {
            closeCart();
          }
        }}>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>장바구니</SheetTitle>
              <SheetDescription>
                {cartCount > 0 ? `${cartCount}개의 상품이 담겨있습니다.` : "장바구니가 비어있습니다."}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex-1 overflow-y-auto pb-24 min-h-0">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">장바구니가 비어있습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const quantity = item.quantity || 1;
                    const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                    const itemTotal = priceNumber * quantity;
                    const formattedPrice = priceNumber.toLocaleString("ko-KR") + "원";
                    const formattedTotal = itemTotal.toLocaleString("ko-KR") + "원";
                    
                    return (
                      <motion.div
                        key={item.cartItemId}
                        className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{item.description}</p>
                          <div className="flex items-center justify-between mb-2">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{formattedPrice}</span>
                              </p>
                            </div>
                            <p className="text-base font-bold text-primary">
                              {formattedTotal}
                            </p>
                          </div>
                          {/* 수량 조절 버튼 */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              className={`rounded-full p-1.5 border transition-colors ${
                                quantity <= 1
                                  ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                                  : "text-muted-foreground hover:bg-primary hover:text-primary-foreground border-border"
                              }`}
                              onClick={() => item.cartItemId && quantity > 1 && updateQuantity(item.cartItemId, quantity - 1)}
                              whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                              whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                              aria-label="수량 감소"
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </motion.button>
                            <span className="text-sm font-semibold text-foreground min-w-[2rem] text-center">
                              {quantity}개
                            </span>
                            <motion.button
                              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground border border-border"
                              onClick={() => item.cartItemId && updateQuantity(item.cartItemId, quantity + 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label="수량 증가"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>
                        </div>
                        <motion.button
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground flex-shrink-0 self-start mt-1"
                          onClick={() => item.cartItemId && removeFromCart(item.cartItemId)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* 하단 총 합계 및 결제하기 버튼 */}
            {cartItems.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-foreground">총 합계:</span>
                  <span className="text-xl font-bold text-primary">
                    {cartItems
                      .reduce((sum, item) => {
                        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                        return sum + priceNumber * (item.quantity || 1);
                      }, 0)
                      .toLocaleString("ko-KR")}원
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={async () => {
                      if (!user) {
                        toast({
                          title: "로그인이 필요합니다",
                          description: "결제를 진행하려면 먼저 로그인해주세요.",
                          variant: "destructive",
                        });
                        closeCart();
                        navigate("/login");
                        return;
                      }

                      try {
                        const totalAmount = cartItems.reduce((sum, item) => {
                          const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                          return sum + priceNumber * (item.quantity || 1);
                        }, 0);

                        const orderId = `ORDER_${Date.now()}_${cartItems.length}`;
                        const orderName = cartItems.length > 1 
                          ? `${cartItems[0].name} 외 ${cartItems.length - 1}개`
                          : cartItems[0].name;

                        // 주문 정보를 로컬 스토리지에 저장 (결제 완료 페이지에서 사용)
                        const orderItems: PaymentItem[] = cartItems.map((item) => {
                          const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                          return {
                            product_id: item.id,
                            product_name: item.name,
                            product_image: item.image,
                            price: priceNumber,
                            quantity: item.quantity || 1,
                          };
                        });

                        const orderData = {
                          orderId,
                          userId: user.id,
                          items: orderItems,
                          totalAmount,
                        };

                        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

                        // 토스페이먼츠 결제 요청 (결제 성공 시 /payment/success로 리다이렉트)
                        await requestPayment(
                          totalAmount,
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
                    }}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    구매하기
                  </Button>
                </motion.div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* 결제 확인 Dialog */}
        <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">결제 전 상품 확인</DialogTitle>
              <DialogDescription>
                장바구니에 담긴 상품의 상세 정보를 확인하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 총 합계 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">총 합계:</span>
                  <span className="text-2xl font-bold text-primary">
                    {cartItems
                      .reduce((sum, item) => {
                        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                        return sum + priceNumber * (item.quantity || 1);
                      }, 0)
                      .toLocaleString("ko-KR")}원
                  </span>
                </div>
              </div>

              {/* 각 상품별 상세 정보 */}
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const quantity = item.quantity || 1;
                  const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                  const itemTotal = priceNumber * quantity;
                  const formattedTotal = itemTotal.toLocaleString("ko-KR") + "원";
                  const productDetails = getProductDetails(item.name);

                  return (
                    <div
                      key={item.cartItemId}
                      className="rounded-lg border border-border bg-card p-6 space-y-4"
                    >
                      {/* 상품 기본 정보 */}
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">수량: {quantity}개</span>
                            <span className="text-lg font-bold text-primary">{formattedTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* 장점 */}
                      <div className="border-t pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          장점
                        </h4>
                        <ul className="space-y-1.5">
                          {productDetails.advantages.map((advantage, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                              <span>{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 단점 */}
                      <div className="border-t pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                          <XCircle className="h-4 w-4 text-orange-500" />
                          단점
                        </h4>
                        <ul className="space-y-1.5">
                          {productDetails.disadvantages.map((disadvantage, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>{disadvantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 주의사항 */}
                      <div className="border-t pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          주의사항
                        </h4>
                        <ul className="space-y-1.5">
                          {productDetails.precautions.map((precaution, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                              <span>{precaution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 제품 사양 */}
                      <div className="border-t pt-4">
                        <h4 className="mb-3 text-base font-semibold text-foreground">제품 사양</h4>
                        <div className="space-y-1.5">
                          {productDetails.specifications.map((spec, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{spec.label}</span>
                              <span className="font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 결제 버튼 */}
              <div className="flex gap-3 border-t pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCheckoutDialogOpen(false)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={async () => {
                    if (!user) {
                      toast({
                        title: "로그인이 필요합니다",
                        description: "결제를 위해 로그인해주세요.",
                        variant: "destructive",
                      });
                      setIsCheckoutDialogOpen(false);
                      navigate("/login");
                      return;
                    }

                    try {
                      const totalAmount = cartItems.reduce((sum, item) => {
                        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                        return sum + priceNumber * (item.quantity || 1);
                      }, 0);

                      const orderId = `ORDER_${Date.now()}_${cartItems.length}`;
                      const orderName = cartItems.length > 1 
                        ? `${cartItems[0].name} 외 ${cartItems.length - 1}개`
                        : cartItems[0].name;

                      // 주문 정보를 로컬 스토리지에 저장 (결제 완료 페이지에서 사용)
                      const orderItems: PaymentItem[] = cartItems.map((item) => {
                        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
                        return {
                          product_id: item.id,
                          product_name: item.name,
                          product_image: item.image,
                          price: priceNumber,
                          quantity: item.quantity || 1,
                        };
                      });

                      const orderData = {
                        orderId,
                        userId: user.id,
                        items: orderItems,
                        totalAmount,
                      };

                      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

                      // 토스페이먼츠 결제 요청 (결제 성공 시 /payment/success로 리다이렉트)
                      await requestPayment(
                        totalAmount,
                        orderId,
                        orderName,
                        user.user_metadata?.name || user.email?.split("@")[0] || "고객",
                        user.email || undefined
                      );
                    } catch (error) {
                      toast({
                        title: "결제 실패",
                        description: "결제 중 오류가 발생했습니다. 다시 시도해주세요.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  결제 진행하기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
