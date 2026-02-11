import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Truck, RefreshCw, HelpCircle, Mail, Phone } from "lucide-react";

const Support = () => {
  const faqs = [
    {
      question: "배송은 얼마나 걸리나요?",
      answer:
        "주문 확인 후 평균 2-3일 내에 배송이 시작됩니다. 지역에 따라 1-2일이 추가 소요될 수 있으며, 주문 시 배송 예상일을 안내해드립니다.",
    },
    {
      question: "배송비는 얼마인가요?",
      answer:
        "일반 배송비는 3,000원이며, 50,000원 이상 구매 시 무료배송입니다. 제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.",
    },
    {
      question: "교환/반품은 어떻게 하나요?",
      answer:
        "제품 수령 후 7일 이내에 교환/반품 신청이 가능합니다. 단순 변심의 경우 왕복 배송비는 고객 부담이며, 제품 하자나 오배송의 경우 무료로 처리됩니다.",
    },
    {
      question: "제품에 하자가 있으면 어떻게 하나요?",
      answer:
        "제품 하자나 파손이 발견된 경우, 즉시 고객센터로 연락 주시면 무료 교환 또는 환불 처리해드립니다. 사진 첨부 시 더 빠른 처리가 가능합니다.",
    },
    {
      question: "묶음 배송이 가능한가요?",
      answer:
        "네, 가능합니다. 같은 주문에서 여러 제품을 구매하시면 자동으로 묶음 배송됩니다. 배송비도 한 번만 부담하시면 됩니다.",
    },
    {
      question: "주문 취소는 언제까지 가능한가요?",
      answer:
        "배송 준비 전까지는 주문 취소가 가능합니다. 배송이 시작된 후에는 교환/반품 절차로 진행됩니다. 주문 취소는 마이페이지에서 직접 가능합니다.",
    },
  ];

  const supportCategories = [
    {
      icon: HelpCircle,
      title: "자주 묻는 질문",
      description: "고객님들이 자주 문의하시는 내용을 모아 정리했습니다.",
      href: "#faq",
    },
    {
      icon: Truck,
      title: "배송 안내",
      description: "배송 기간, 배송비, 배송 추적 등 배송 관련 안내입니다.",
      href: "#shipping",
    },
    {
      icon: RefreshCw,
      title: "교환/반품",
      description: "교환 및 반품 절차와 정책을 안내해드립니다.",
      href: "#return",
    },
    {
      icon: MessageCircle,
      title: "1:1 문의",
      description: "직접 문의하실 내용이 있으시면 언제든 연락 주세요.",
      href: "#contact",
    },
  ];

  return (
    <>
      <Helmet>
        <title>고객지원 | STUDIO 101</title>
        <meta
          name="description"
          content="STUDIO 101 고객지원 센터입니다. 자주 묻는 질문, 배송 안내, 교환/반품, 1:1 문의 등 다양한 고객 지원 서비스를 제공합니다."
        />
        <meta name="keywords" content="고객지원, FAQ, 배송 안내, 교환 반품, 문의" />
        <link rel="canonical" href="https://studio101.kr/support" />
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
                고객지원
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                궁금한 점이 있으신가요? 빠르고 정확한 답변을 드리겠습니다.
              </p>
            </motion.div>
          </section>

          {/* Support Categories */}
          <section className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {supportCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full transition-shadow hover:shadow-lg">
                        <CardHeader>
                          <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <CardTitle className="text-center">{category.title}</CardTitle>
                          <CardDescription className="text-center">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
                자주 묻는 질문
              </h2>
              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </section>

          {/* Shipping Section */}
          <section id="shipping" className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mx-auto max-w-3xl"
              >
                <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
                  배송 안내
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>배송 정보</CardTitle>
                    <CardDescription>배송 관련 상세 안내입니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">배송 기간</h3>
                      <p className="text-muted-foreground">
                        주문 확인 후 평균 2-3일 내에 배송이 시작됩니다. 지역에 따라 1-2일이 추가 소요될 수 있습니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">배송비</h3>
                      <p className="text-muted-foreground">
                        일반 배송비는 3,000원이며, 50,000원 이상 구매 시 무료배송입니다. 제주도 및 도서산간 지역은
                        추가 배송비가 발생할 수 있습니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">배송 추적</h3>
                      <p className="text-muted-foreground">
                        배송이 시작되면 주문하신 이메일과 SMS로 배송 추적 번호를 안내해드립니다. 마이페이지에서도
                        실시간으로 배송 상태를 확인하실 수 있습니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Return Section */}
          <section id="return" className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto max-w-3xl"
            >
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
                교환/반품 안내
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>교환/반품 정책</CardTitle>
                  <CardDescription>교환 및 반품 관련 상세 안내입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">교환/반품 기간</h3>
                    <p className="text-muted-foreground">
                      제품 수령 후 7일 이내에 교환/반품 신청이 가능합니다. 단, 제품을 사용하거나 포장을 개봉한 경우
                      교환/반품이 제한될 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">교환/반품 비용</h3>
                    <p className="text-muted-foreground">
                      단순 변심의 경우 왕복 배송비(6,000원)는 고객 부담입니다. 제품 하자나 오배송의 경우 무료로
                      처리됩니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">교환/반품 불가 사항</h3>
                    <p className="text-muted-foreground">
                      고객님의 사용으로 인해 상품이 훼손된 경우, 제품 수령 후 7일이 경과한 경우, 주문 확인 후 제조가
                      시작된 맞춤 제품의 경우 교환/반품이 불가합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mx-auto max-w-3xl text-center"
              >
                <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">1:1 문의</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>문의하기</CardTitle>
                    <CardDescription>직접 문의하실 내용이 있으시면 아래 방법으로 연락 주세요.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-card p-6">
                        <Mail className="mb-4 h-8 w-8 text-primary mx-auto" />
                        <h3 className="mb-2 font-semibold text-foreground">이메일</h3>
                        <p className="text-sm text-muted-foreground">support@studio101.kr</p>
                        <p className="mt-2 text-xs text-muted-foreground">평일 09:00 - 18:00</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-6">
                        <Phone className="mb-4 h-8 w-8 text-primary mx-auto" />
                        <h3 className="mb-2 font-semibold text-foreground">전화</h3>
                        <p className="text-sm text-muted-foreground">1588-1010</p>
                        <p className="mt-2 text-xs text-muted-foreground">평일 09:00 - 18:00</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-6">
                      <MessageCircle className="mb-4 h-8 w-8 text-primary mx-auto" />
                      <h3 className="mb-2 font-semibold text-foreground">카카오톡 상담</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        카카오톡에서 'STUDIO 101'을 검색하여 친구 추가 후 문의해주세요.
                      </p>
                      <Button className="w-full sm:w-auto">카카오톡 상담하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Support;

