import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Deal } from "@/types/deals";
import { dealsService } from "@/services/dealsService";

export const useRealtimeDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    try {
      const data = await dealsService.getAll();
      setDeals(data);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();

    const channel = supabase
      .channel("deals-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deals" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDeals((prev) => [...prev, payload.new as Deal]);
          } else if (payload.eventType === "UPDATE") {
            setDeals((prev) =>
              prev.map((d) => (d.id === (payload.new as Deal).id ? (payload.new as Deal) : d))
            );
          } else if (payload.eventType === "DELETE") {
            setDeals((prev) => prev.filter((d) => d.id !== (payload.old as Deal).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDeals]);

  return { deals, loading };
};
