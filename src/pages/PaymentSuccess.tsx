import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { savePayment, PaymentItem } from "@/lib/payments";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [orderSaved, setOrderSaved] = useState(false);
  const [saving, setSaving] = useState(true);
  const isSavingRef = useRef(false); // 중복 저장 방지를 위한 ref

  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const saveOrderToDB = async () => {
      if (!user || !orderId) {
        setSaving(false);
        return;
      }

      // 이미 저장 중이거나 저장된 경우 중복 저장 방지
      if (isSavingRef.current || orderSaved) {
        setSaving(false);
        return;
      }

      // 저장 시작 표시
      isSavingRef.current = true;

      try {
        // 로컬 스토리지에서 주문 정보 읽기
        const orderDataStr = localStorage.getItem(`order_${orderId}`);
        if (!orderDataStr) {
          // 장바구니 아이템 사용 (로컬 스토리지에 없을 경우)
          const paymentItems: PaymentItem[] = cartItems.map((item) => {
            const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
            return {
              product_id: item.id,
              product_name: item.name,
              product_image: item.image,
              price: priceNumber,
              quantity: item.quantity || 1,
            };
          });

          const totalAmount = cartItems.reduce((sum, item) => {
            const priceNumber = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
            return sum + priceNumber * (item.quantity || 1);
          }, 0);

          // payments 테이블에 저장
          await savePayment({
            user_id: user.id,
            items: paymentItems,
            total_amount: totalAmount,
          });

          // products 테이블에서 재고 감소
          for (const item of paymentItems) {
            try {
              // 현재 재고 조회
              const { data: productData, error: fetchError } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.product_id)
                .single();

              if (!fetchError && productData && productData.stock !== undefined) {
                const newStock = Math.max(0, productData.stock - item.quantity);
                
                // 재고 업데이트
                await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", item.product_id);
              }
            } catch (error) {
              console.error(`상품 ${item.product_id}의 재고 업데이트 실패:`, error);
            }
          }

          setOrderSaved(true);
          clearCart();
          localStorage.removeItem(`order_${orderId}`); // 저장 후 로컬 스토리지에서 제거

          toast({
            title: "주문이 완료되었습니다",
            description: "주문 내역이 저장되었습니다.",
          });
        } else {
          // 로컬 스토리지에서 주문 정보 가져오기
          const orderData = JSON.parse(orderDataStr);
          
          // payments 테이블에 저장
          // RLS 정책: auth.uid() = user_id 이어야 하므로 현재 로그인한 사용자의 ID 사용
          await savePayment({
            user_id: user.id, // 항상 현재 로그인한 사용자의 ID 사용 (RLS 정책 준수)
            items: orderData.items || [],
            total_amount: orderData.totalAmount || 0,
          });

          // products 테이블에서 재고 감소
          for (const item of orderData.items) {
            try {
              // 현재 재고 조회
              const { data: productData, error: fetchError } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.product_id)
                .single();

              if (!fetchError && productData && productData.stock !== undefined) {
                const newStock = Math.max(0, productData.stock - item.quantity);
                
                // 재고 업데이트
                await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", item.product_id);
              }
            } catch (error) {
              console.error(`상품 ${item.product_id}의 재고 업데이트 실패:`, error);
            }
          }

          setOrderSaved(true);
          clearCart();
          localStorage.removeItem(`order_${orderId}`); // 저장 후 로컬 스토리지에서 제거

          toast({
            title: "주문이 완료되었습니다",
            description: "주문 내역이 저장되었습니다.",
          });
        }
      } catch (error) {
        console.error("주문 저장 오류:", error);
        isSavingRef.current = false; // 에러 발생 시 다시 시도할 수 있도록
        toast({
          title: "오류",
          description: "주문 저장 중 오류가 발생했습니다. 마이페이지에서 확인해주세요.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    };

    saveOrderToDB();
  }, [user, orderId]); // 의존성 배열에서 불필요한 항목 제거

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">로그인이 필요합니다.</p>
              <Button onClick={() => navigate("/login")} className="w-full mt-4">
                로그인하기
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>결제 완료 | STUDIO 101</title>
        <meta name="description" content="STUDIO 101 결제가 완료되었습니다." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <section className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardContent className="pt-12 pb-12 px-6 sm:px-12">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                      </div>
                    </motion.div>

                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      결제가 완료되었습니다
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground">
                      주문이 성공적으로 완료되었습니다.
                    </p>

                    {saving && (
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">주문 정보를 저장하는 중...</p>
                      </div>
                    )}

                    {orderId && (
                      <div className="mb-8 rounded-lg bg-secondary/50 p-4 text-left">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">주문 번호</span>
                            <span className="font-medium">{orderId}</span>
                          </div>
                          {amount && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">결제 금액</span>
                              <span className="font-medium">
                                {parseInt(amount).toLocaleString("ko-KR")}원
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => navigate("/mypage")}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        주문 내역 보기
                      </Button>
                      <Button
                        onClick={() => {
                          navigate("/");
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Home className="h-4 w-4" />
                        홈으로 가기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PaymentSuccess;

