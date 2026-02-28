import { motion } from "framer-motion";
import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FooterSection = "shop" | "support" | "company";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "전체 상품", href: "#" },
      { name: "베스트셀러", href: "#" },
      { name: "신상품", href: "#" },
      { name: "할인 상품", href: "#" },
    ],
    support: [
      { name: "자주 묻는 질문", href: "#" },
      { name: "배송 안내", href: "#" },
      { name: "교환/반품", href: "#" },
      { name: "1:1 문의", href: "#" },
    ],
    company: [
      { name: "브랜드 스토리", href: "#" },
      { name: "제휴 문의", href: "#" },
      { name: "개인정보처리방침", href: "#" },
      { name: "이용약관", href: "#" },
    ],
  };

  const getDialogContent = (section: FooterSection, name: string) => {
    if (section === "shop") {
      switch (name) {
        case "전체 상품":
          return {
            title: "전체 상품",
            description: (
              <>
                <p>
                  STUDIO 101의 모든 데스크테리어 아이템을 한눈에 모아 볼 수 있는 컬렉션입니다.
                  작업 효율을 높여 주는 정리 수납 제품부터 공간의 분위기를 바꿔 주는 라이팅, 무드 오브제까지
                  당신의 책상을 스튜디오로 만들어 줄 전 제품을 둘러보세요.
                </p>
                <p>
                  카테고리와 필터를 활용해 용도, 색상, 예산에 맞는 아이템을 쉽게 찾을 수 있도록 구성할 예정입니다.
                </p>
              </>
            ),
          };
        case "베스트셀러":
          return {
            title: "베스트셀러",
            description: (
              <>
                <p>
                  가장 많은 고객님들이 선택해 주신 STUDIO 101의 대표 아이템들입니다.
                  실제 후기와 재구매율을 기준으로, 데스크 셋업 입문자도 실패 없이 선택할 수 있는 구성으로
                  엄선했습니다.
                </p>
                <p>
                  처음 데스크테리어를 시작하신다면 베스트셀러 라인업에서 조합을 골라 보시는 것을 추천드립니다.
                </p>
              </>
            ),
          };
        case "신상품":
          return {
            title: "신상품",
            description: (
              <>
                <p>
                  최근에 공개된 새로운 데스크테리어 제품들을 소개합니다. 1인 가구의 실제 사용 패턴과
                  최신 워크플로우를 반영한 아이디어 제품들을 가장 먼저 만나 보세요.
                </p>
                <p>
                  시즌 한정 컬러나 협업 에디션 등의 소식도 이 구역에서 가장 먼저 안내드릴 예정입니다.
                </p>
              </>
            ),
          };
        case "할인 상품":
          return {
            title: "할인 상품",
            description: (
              <>
                <p>
                  한정 기간 동안 더 합리적인 가격으로 만나볼 수 있는 기획전입니다.
                  세트 구성, 시즌오프, 리퍼·오픈박스 등 다양한 형태의 프로모션을 준비하고 있습니다.
                </p>
                <p>
                  데스크테리어를 처음 시도해 보고 싶을 때, 혹은 기존 셋업을 가볍게 업그레이드하고 싶을 때
                  부담 없이 선택해 보세요.
                </p>
              </>
            ),
          };
      }
    }

    if (section === "support") {
      switch (name) {
        case "자주 묻는 질문":
          return {
            title: "자주 묻는 질문",
            description: (
              <>
                <p>
                  배송, 교환/반품, 제품 사용 방법 등 고객님들이 자주 문의해 주시는 내용을 모아
                  한 번에 확인하실 수 있도록 정리할 예정입니다.
                </p>
                <p>
                  궁금한 점이 생겼을 때 먼저 이 영역을 확인해 보시면, 기다림 없이 바로 해결책을
                  찾으실 수 있도록 돕겠습니다.
                </p>
              </>
            ),
          };
        case "배송 안내":
          return {
            title: "배송 안내",
            description: (
              <>
                <p>
                  평균 배송 소요 기간, 배송비 정책, 묶음배송 가능 여부 등 배송 전 꼭 알아 두셔야 할
                  정보를 정리해 드립니다.
                </p>
                <p>
                  택배사 선택, 배송 추적 방법, 부재 시 보관 안내 등 실제 이용 상황을 기준으로 한 안내를
                  준비 중입니다.
                </p>
              </>
            ),
          };
        case "교환/반품":
          return {
            title: "교환/반품 안내",
            description: (
              <>
                <p>
                  제품 하자, 단순 변심, 배송 중 파손 등 상황별로 교환·반품이 어떻게 진행되는지
                  알기 쉽게 안내드릴 예정입니다.
                </p>
                <p>
                  절차와 기간, 택배 회수 방식, 비용 부담 주체 등 꼭 확인하셔야 할 사항을 투명하게 공개하여
                  안심하고 쇼핑하실 수 있도록 하겠습니다.
                </p>
              </>
            ),
          };
        case "1:1 문의":
          return {
            title: "1:1 문의",
            description: (
              <>
                <p>
                  채팅, 이메일, 카카오톡 등으로 1:1 상담을 요청하실 수 있는 창구입니다.
                  단순 문의부터 데스크 셋업 상담까지, 가능하면 한 번의 문의로 해결하실 수 있도록 도와드립니다.
                </p>
                <p>
                  운영 시간, 응답 속도, 상담 가능 범위 등을 명확히 안내하여 언제 어떤 도움을 받으실 수 있는지
                  쉽게 확인하실 수 있도록 준비하고 있습니다.
                </p>
              </>
            ),
          };
      }
    }

    if (section === "company") {
      switch (name) {
        case "브랜드 스토리":
          return {
            title: "브랜드 스토리",
            description: (
              <>
                <p>
                  STUDIO 101이 어떤 고민에서 시작되었고, 어떤 방식으로 제품을 기획하고 만드는지에 대한
                  이야기를 담고 있습니다.
                </p>
                <p>
                  1인 가구의 일상과 공간을 존중하는 브랜드 철학, 그리고 책상이라는 한정된 무대를 통해
                  삶의 밀도를 높이고자 하는 우리의 비전을 조금 더 자세히 소개해 드릴 예정입니다.
                </p>
              </>
            ),
          };
        case "제휴 문의":
          return {
            title: "제휴 및 콜라보 문의",
            description: (
              <>
                <p>
                  브랜드 제휴, 인플루언서·크리에이터 협업, B2B 공간 프로젝트 등 다양한 형태의 협업을
                  기다리고 있습니다.
                </p>
                <p>
                  제안하실 내용, 일정, 예상 규모 등을 간단히 정리해 보내 주시면, 담당자가 검토 후
                  순차적으로 연락을 드리겠습니다.
                </p>
              </>
            ),
          };
        case "개인정보처리방침":
          return {
            title: "개인정보처리방침",
            description: (
              <>
                <p>
                  STUDIO 101은 고객님의 개인정보를 안전하게 보호하기 위해 관련 법령을 준수하고 있으며,
                  수집·이용 목적, 보관 기간, 제3자 제공 여부 등을 투명하게 공개할 예정입니다.
                </p>
                <p>
                  쇼핑 과정에서 어떤 정보가 필요한지, 어떤 선택 권한이 있는지 한눈에 이해하실 수 있도록
                  쉽게 풀어낸 안내를 준비하고 있습니다.
                </p>
              </>
            ),
          };
        case "이용약관":
          return {
            title: "이용약관",
            description: (
              <>
                <p>
                  서비스 이용과 관련하여 고객님과 STUDIO 101 사이에 적용되는 기본적인 약속을 담고 있습니다.
                </p>
                <p>
                  주문, 결제, 배송, 환불, 계정 관리 등 서비스 사용 전 꼭 알고 계셔야 할 내용을
                  이해하기 쉬운 언어로 정리해 드릴 계획입니다.
                </p>
              </>
            ),
          };
      }
    }

    return {
      title: name,
      description: (
        <p>해당 항목에 대한 자세한 안내는 추후 업데이트될 예정입니다.</p>
      ),
    };
  };

  const socialLinks = [
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Youtube, href: "#", label: "YouTube" },
    { Icon: MessageCircle, href: "#", label: "KakaoTalk" },
  ];

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="section-container py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="mb-4 inline-block text-2xl font-bold tracking-tight text-foreground"
              whileHover={{ scale: 1.02 }}
            >
              STUDIO <span className="text-primary">101</span>
            </motion.a>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              당신의 1평 책상을 스튜디오로 바꿔드립니다.
              미니멀하고 테크니컬한 데스크테리어의 시작.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">쇼핑</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  {link.name === "베스트셀러" ? (
                    <Link
                      to="/bestsellers"
                      className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.name}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        {(() => {
                          const { title, description } = getDialogContent("shop", link.name);
                          return (
                            <DialogHeader>
                              <DialogTitle>{title}</DialogTitle>
                              <DialogDescription asChild>
                                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                                  {description}
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          );
                        })()}
                      </DialogContent>
                    </Dialog>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">고객지원</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      {(() => {
                        const { title, description } = getDialogContent("support", link.name);
                        return (
                          <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription asChild>
                              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                                {description}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        );
                      })()}
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">회사</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      {(() => {
                        const { title, description } = getDialogContent("company", link.name);
                        return (
                          <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription asChild>
                              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                                {description}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        );
                      })()}
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 STUDIO 101. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              사업자등록번호: 123-45-67890 | 대표: 홍길동
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
