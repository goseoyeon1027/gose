import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { saerch_products } from "@/lib/products";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  created_at: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("OpenAI API 키가 설정되지 않았습니다. 환경 변수 VITE_OPENAI_API_KEY를 설정해주세요.");
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(() => {
    // 세션 ID 생성 (브라우저별 고유값)
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
  });

  // 채팅 히스토리 로드
  useEffect(() => {
    if (open) {
      loadChatHistory();
    }
  }, [open, user]);

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionIdRef.current)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("채팅 히스토리 로드 오류:", error);
        return;
      }

      if (data) {
        setMessages(data.map((msg) => ({
          id: msg.id,
          message: msg.message,
          sender: msg.sender as "user" | "bot",
          created_at: msg.created_at,
        })));
      }
    } catch (error) {
      console.error("채팅 히스토리 로드 중 오류:", error);
    }
  };

  const saveMessage = async (message: string, sender: "user" | "bot") => {
    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_id: user?.id || null,
        session_id: sessionIdRef.current,
        message,
        sender,
      });

      if (error) {
        console.error("메시지 저장 오류:", error);
      }
    } catch (error) {
      console.error("메시지 저장 중 오류:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // 사용자 메시지 추가
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      message: userMessage,
      sender: "user",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    await saveMessage(userMessage, "user");

    if (!OPENAI_API_KEY) {
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        message: "OpenAI API 키가 설정되지 않았습니다. 환경 변수 VITE_OPENAI_API_KEY를 설정해주세요.",
        sender: "bot",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLoading(false);
      return;
    }

    try {
      // OpenAI API 호출
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `당신은 STUDIO 101의 친절한 쇼핑 어시스턴트입니다. 
사용자가 상품을 찾거나 질문할 때 도와드립니다.
상품 검색이 필요한 경우 saerch_products 함수를 사용하세요.
한국어로 친절하고 자연스럽게 대답해주세요.`,
            },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.message,
            })),
            {
              role: "user",
              content: userMessage,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "saerch_products",
                description: "사용자가 상품 이름을 말하면 Supabase 'products' 테이블에서 검색하여 결과를 반환합니다. 사용자가 상품을 찾고 있을 때 이 함수를 사용하세요.",
                parameters: {
                  type: "object",
                  properties: {
                    productName: {
                      type: "string",
                      description: "검색할 상품 이름 (예: '데스크 매트', 'LED 라이트', '수납함' 등)",
                    },
                  },
                  required: ["productName"],
                },
              },
            },
          ],
          tool_choice: "auto",
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API 오류: ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      // 함수 호출이 필요한 경우
      if (choice.message.tool_calls) {
        const toolCall = choice.message.tool_calls[0];
        if (toolCall.function.name === "saerch_products") {
          const args = JSON.parse(toolCall.function.arguments);
          const products = await saerch_products(args.productName);

          // 함수 결과를 포함하여 다시 API 호출
          const finalResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: `당신은 STUDIO 101의 친절한 쇼핑 어시스턴트입니다. 
사용자가 상품을 찾거나 질문할 때 도와드립니다.
상품 검색 결과를 바탕으로 사용자에게 친절하게 상품을 소개해주세요.
한국어로 자연스럽게 대답해주세요.`,
                },
                ...messages.map((msg) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.message,
                })),
                {
                  role: "user",
                  content: userMessage,
                },
                choice.message,
                {
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify({
                    products: products.map((p) => ({
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      price: p.price,
                      category: p.category,
                    })),
                  }),
                },
              ],
              temperature: 0.7,
            }),
          });

          const finalData = await finalResponse.json();
          const botMessage = finalData.choices[0].message.content;

          const botMsg: Message = {
            id: `bot_${Date.now()}`,
            message: botMessage,
            sender: "bot",
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, botMsg]);
          await saveMessage(botMessage, "bot");
        }
      } else {
        // 일반 응답
        const botMessage = choice.message.content;

        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          message: botMessage,
          sender: "bot",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        await saveMessage(botMessage, "bot");
      }
    } catch (error) {
      console.error("채팅 오류:", error);
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        message: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        sender: "bot",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      await saveMessage(errorMsg.message, "bot");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>채팅 상담</SheetTitle>
        </SheetHeader>
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>안녕하세요! 무엇을 도와드릴까요?</p>
                <p className="text-sm mt-2">상품 검색, 문의사항 등 무엇이든 물어보세요.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t px-6 py-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatWidget;

