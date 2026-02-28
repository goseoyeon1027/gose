import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Home, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  const getErrorMessage = () => {
    if (errorMessage) {
      return errorMessage;
    }
    if (errorCode) {
      switch (errorCode) {
        case "USER_CANCEL":
          return "결제가 취소되었습니다.";
        case "INVALID_CARD":
          return "유효하지 않은 카드입니다.";
        case "INSUFFICIENT_BALANCE":
          return "잔액이 부족합니다.";
        default:
          return "결제 처리 중 오류가 발생했습니다.";
      }
    }
    return "결제 처리 중 오류가 발생했습니다.";
  };

  return (
    <>
      <Helmet>
        <title>결제 실패 | STUDIO 101</title>
        <meta name="description" content="STUDIO 101 결제 처리 중 오류가 발생했습니다." />
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
                      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                        <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                      </div>
                    </motion.div>

                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      결제에 실패했습니다
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground">
                      {getErrorMessage()}
                    </p>

                    {orderId && (
                      <div className="mb-8 rounded-lg bg-secondary/50 p-4 text-left">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">주문 번호</span>
                            <span className="font-medium">{orderId}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        이전으로
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

export default PaymentFail;

