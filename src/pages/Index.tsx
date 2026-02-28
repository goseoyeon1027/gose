import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>STUDIO 101 | 1인 가구 데스크테리어 쇼핑몰</title>
        <meta
          name="description"
          content="당신의 1평 책상을 스튜디오로 바꿔드립니다. 미니멀하고 테크니컬한 감성의 데스크테리어 아이템을 만나보세요."
        />
        <meta name="keywords" content="데스크테리어, 1인가구, 책상정리, 데스크셋업, 무선충전, 케이블정리" />
        <link rel="canonical" href="https://studio101.kr" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <ProductGrid />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
