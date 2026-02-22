import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export const useChat = (recipientId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user || !recipientId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data);
    setLoading(false);
  }, [user, recipientId]);

  useEffect(() => {
    fetchMessages();

    if (!user || !recipientId) return;

    const channel = supabase
      .channel(`chat-${user.id}-${recipientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          if (
            (msg.sender_id === user.id && msg.recipient_id === recipientId) ||
            (msg.sender_id === recipientId && msg.recipient_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, user, recipientId]);

  const sendMessage = async (content: string) => {
    if (!user || !recipientId) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      content,
    });
  };

  return { messages, loading, sendMessage };
};
