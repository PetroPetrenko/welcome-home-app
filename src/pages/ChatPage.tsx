import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [recipientInput, setRecipientInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const { messages, loading, sendMessage } = useChat(recipientId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = () => {
    if (recipientInput.trim()) {
      setRecipientId(recipientInput.trim());
    }
  };

  const handleSend = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(messageInput.trim());
    setMessageInput("");
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gold" />
              <h1 className="font-display text-lg font-bold">Chat</h1>
            </div>

            {!recipientId ? (
              <div className="p-6 flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  Enter a user ID to start a conversation
                </p>
                <div className="flex gap-2 w-full max-w-sm">
                  <Input
                    placeholder="Recipient user ID"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
                  />
                  <Button onClick={handleStartChat} className="bg-gradient-gold text-primary-foreground">
                    Start
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className="h-96 p-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground text-sm">Loading…</p>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">
                      No messages yet. Say hello!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMine = msg.sender_id === user?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                isMine
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p className="text-[10px] opacity-60 mt-1">
                                {formatDistanceToNow(new Date(msg.created_at), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    placeholder="Type a message…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="bg-gradient-gold text-primary-foreground shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
