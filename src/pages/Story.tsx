import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Target, Heart, Lightbulb } from "lucide-react";

const Story = () => {
  const values = [
    {
      icon: Target,
      title: "명확한 목표",
      description: "1인 가구의 실제 사용 패턴을 분석하여 실용적이고 효율적인 제품을 만듭니다.",
    },
    {
      icon: Heart,
      title: "공간에 대한 존중",
      description: "작은 공간도 스튜디오처럼 만들 수 있다는 믿음으로 제품을 기획합니다.",
    },
    {
      icon: Lightbulb,
      title: "혁신적인 아이디어",
      description: "기존의 틀을 벗어나 새로운 방식으로 데스크테리어를 재정의합니다.",
    },
    {
      icon: Sparkles,
      title: "미니멀한 미학",
      description: "불필요한 것을 제거하고 본질에 집중하는 미니멀한 디자인 철학을 추구합니다.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>스토리 | STUDIO 101</title>
        <meta
          name="description"
          content="STUDIO 101의 브랜드 스토리와 철학을 소개합니다. 1인 가구의 책상을 스튜디오로 만드는 우리의 여정을 만나보세요."
        />
        <meta name="keywords" content="브랜드 스토리, 데스크테리어, 1인가구, 미니멀 디자인" />
        <link rel="canonical" href="https://studio101.kr/story" />
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
                STUDIO <span className="text-primary">101</span>의 스토리
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                당신의 1평 책상을 스튜디오로 바꿔드립니다.
                <br />
                미니멀하고 테크니컬한 감성의 데스크테리어의 시작.
              </p>
            </motion.div>
          </section>

          {/* Story Section */}
          <section className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto max-w-3xl"
              >
                <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">우리의 시작</h2>
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  <p>
                    STUDIO 101은 작은 공간에서도 큰 꿈을 실현할 수 있다는 믿음에서 시작되었습니다. 많은 1인 가구들이
                    제한된 공간 속에서도 자신만의 작업 공간을 만들고 싶어 했지만, 시중의 제품들은 대부분 넓은 공간을
                    전제로 만들어졌습니다.
                  </p>
                  <p>
                    우리는 이러한 문제를 해결하기 위해 실제 1인 가구의 사용 패턴을 분석하고, 최소한의 공간에서 최대한의
                    효율을 낼 수 있는 제품을 기획하기 시작했습니다. 단순히 물건을 정리하는 것을 넘어, 책상이라는 공간을
                    하나의 스튜디오로 변화시키는 것이 우리의 목표입니다.
                  </p>
                  <p>
                    미니멀한 디자인과 실용적인 기능의 조화를 통해, 누구나 자신만의 완벽한 데스크 셋업을 만들 수 있도록
                    돕고자 합니다. STUDIO 101과 함께 당신의 책상을 스튜디오로 만들어보세요.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values Section */}
          <section className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">우리의 가치</h2>
              <p className="mb-12 text-muted-foreground">STUDIO 101이 추구하는 핵심 가치입니다.</p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="rounded-lg border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-primary/10 p-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Vision Section */}
          <section className="border-t border-border bg-secondary/30">
            <div className="section-container py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mx-auto max-w-3xl text-center"
              >
                <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">우리의 비전</h2>
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  <p>
                    STUDIO 101은 단순한 쇼핑몰을 넘어, 1인 가구들이 자신만의 완벽한 작업 공간을 만들 수 있도록 돕는
                    커뮤니티가 되고자 합니다.
                  </p>
                  <p>
                    앞으로도 고객들의 실제 사용 경험을 바탕으로 제품을 개선하고, 새로운 아이디어를 지속적으로 발굴하여
                    데스크테리어의 새로운 표준을 만들어가겠습니다.
                  </p>
                  <p className="pt-4 text-lg font-semibold text-foreground">
                    당신의 책상이 스튜디오가 되는 그 순간까지, STUDIO 101이 함께하겠습니다.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Story;

