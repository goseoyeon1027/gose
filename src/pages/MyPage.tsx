import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPayments, Payment } from "@/lib/payments";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, LogOut, Package } from "lucide-react";

const MyPage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      loadPayments();
    }
  }, [user, authLoading, navigate]);

  const loadPayments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserPayments(user.id);
      setPayments(data || []);
    } catch (error) {
      console.error("결제 내역 로드 오류:", error);
      toast({
        title: "오류",
        description: "결제 내역을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "로그아웃",
      description: "로그아웃되었습니다.",
    });
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>마이페이지 | STUDIO 101</title>
        <meta name="description" content="STUDIO 101 마이페이지에서 주문 내역을 확인하세요." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          {/* Hero Section */}
          <section className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                마이페이지
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                주문 내역과 계정 정보를 확인하세요.
              </p>
            </motion.div>
          </section>

          {/* User Info */}
          <section className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <Card>
                <CardHeader>
                  <CardTitle>계정 정보</CardTitle>
                  <CardDescription>로그인된 계정 정보입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">이메일</p>
                    <p className="text-lg font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">이름</p>
                    <p className="text-lg font-semibold">
                      {user.user_metadata?.name || user.email?.split("@")[0] || "사용자"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Payment History */}
          <section className="section-container py-16 md:py-24">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
              결제 내역
            </h2>

            {payments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">결제 내역이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {payments.map((payment, index) => (
                  <motion.div
                    key={payment.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>주문 #{payment.id?.slice(0, 8) || index + 1}</CardTitle>
                            <CardDescription>
                              {payment.created_at
                                ? new Date(payment.created_at).toLocaleString("ko-KR")
                                : "날짜 정보 없음"}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {payment.total_amount.toLocaleString("ko-KR")}원
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">주문 상품</h4>
                          <div className="space-y-3">
                            {payment.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
                              >
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="h-16 w-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h5 className="font-semibold text-foreground">{item.product_name}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    수량: {item.quantity}개
                                  </p>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MyPage;

