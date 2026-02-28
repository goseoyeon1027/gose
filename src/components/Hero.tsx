import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden gradient-hero">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 dark:bg-primary/10"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-primary/5 dark:bg-primary/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-primary/3 dark:bg-primary/10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>1인 가구를 위한 데스크테리어</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            당신의 <span className="text-primary">1평 책상</span>,
            <br />
            스튜디오가 되다.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            미니멀하고 테크니컬한 감성으로 완성하는 나만의 작업 공간.
            <br className="hidden sm:block" />
            STUDIO 101이 당신의 데스크테리어를 도와드릴게요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px hsl(217 91% 60% / 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              상품 둘러보기
            </motion.a>

            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  브랜드 스토리
                </motion.button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>STUDIO 101 브랜드 스토리</DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-3 pt-2 text-left text-sm leading-relaxed text-muted-foreground">
                      <p>
                        STUDIO 101은 &quot;1평짜리 책상도, 나만의 스튜디오가 될 수 있다&quot;는 생각에서 시작되었습니다.
                      </p>
                      <p>
                        작고 제한된 공간에서도 창의적인 일을 하고, 나만의 취향을 표현하고, 하루를 정리할 수 있는
                        분위기를 만들고 싶었어요. 그래서 선 하나, 조명 하나, 수납 하나까지 모두 &quot;1인 가구의
                        현실적인 공간&quot;을 기준으로 디자인합니다. 넓은 작업실이 없어도, 작은 책상 위 구성이
                        좋아지면 삶의 밀도가 달라진다고 믿기 때문입니다.
                      </p>
                      <p>
                        우리는 거창한 인테리어가 아니라, 노트북 옆 한 뼘 공간부터 바꿉니다. 선을 정리하고, 빛을
                        더하고, 물건의 자리를 정리해 주는 것만으로도 책상은 훨씬 더 나다운 공간이 되니까요.
                      </p>
                      <p>
                        STUDIO 101의 모든 제품은 화면 속 예쁜 셋업이 아니라, 실제로 하루 종일 앉아 있는 사람을
                        떠올리며 만들어집니다. 장시간 사용해도 편안한 각도, 손이 가장 먼저 가는 동선, 눈이 피로하지
                        않은 조도까지 하나하나 테스트하며, &quot;보기 좋은&quot; 것과 &quot;쓰기 좋은&quot; 것의
                        균형을 맞추고 있습니다.
                      </p>
                      <p>
                        우리는 혼자 사는 시간이 결코 외로운 시간이 아니라, 가장 나다운 순간이 되기를 바랍니다.
                        야근 끝에 돌아와 책상 앞에 앉는 순간, 주말 아침 커피를 올려두는 순간, 좋아하는 음악을
                        틀어두고 넷플릭스를 켜는 순간마다 STUDIO 101의 아이템들이 조용히 그 시간을 더 빛나게
                        만들어 주었으면 합니다.
                      </p>
                      <p>
                        그래서 STUDIO 101은 유행을 급하게 따라가기보다는, 계절이 바뀌어도 질리지 않는 차분한
                        컬러와 미니멀한 디자인을 고집합니다. 대신 소재와 내구성, 마감과 촉감 같은 보이지 않는
                        디테일에 더 많은 시간을 씁니다. 작은 생활기스 하나까지 자연스럽게 어우러지는 물건이,
                        결국 오래 쓰이고 오래 사랑받는다고 믿기 때문입니다.
                      </p>
                      <p>
                        STUDIO 101과 함께라면, 오늘도 당신의 작은 책상이 가장 집중되는 작업실이자, 가장 편안한
                        쉼터가 되길 바랍니다.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-medium">Scroll</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
