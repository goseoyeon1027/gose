import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Story from "./pages/Story";
import Support from "./pages/Support";
import BestSellers from "./pages/BestSellers";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/bestsellers" element={<BestSellers />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/fail" element={<PaymentFail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChatWidget />
              </BrowserRouter>
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
