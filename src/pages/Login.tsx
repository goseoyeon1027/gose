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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "로그인 실패",
        description: error.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>로그인 | STUDIO 101</title>
        <meta name="description" content="STUDIO 101에 로그인하세요." />
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
                  <CardTitle className="text-2xl">로그인</CardTitle>
                  <CardDescription>STUDIO 101에 로그인하여 계속하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "로그인 중..." : "로그인"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">계정이 없으신가요? </span>
                    <Link to="/signup" className="text-primary hover:underline">
                      회원가입
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

export default Login;

