import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "이메일 형식 오류",
        description: "올바른 이메일 형식을 입력해주세요.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);

    if (error) {
      let errorMessage = error.message || "회원가입에 실패했습니다.";
      
      // 중복 이메일 에러 메시지 개선
      if (errorMessage.includes("already") || errorMessage.includes("이미 사용")) {
        errorMessage = "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.";
      }

      toast({
        title: "회원가입 실패",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다. 로그인해주세요.",
      });
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>회원가입 | STUDIO 101</title>
        <meta name="description" content="STUDIO 101에 회원가입하세요." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24 pb-16">
          <section className="section-container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-md"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">회원가입</CardTitle>
                  <CardDescription>새로운 계정을 만들어보세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">비밀번호</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요 (최소 6자)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "가입 중..." : "회원가입"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
                    <Link to="/login" className="text-primary hover:underline">
                      로그인
                    </Link>
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

export default SignUp;

