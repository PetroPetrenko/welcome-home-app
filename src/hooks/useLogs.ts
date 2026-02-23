import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AppLog {
  id: string;
  level: string;
  message: string;
  context: Record<string, unknown>;
  source: string;
  user_id: string | null;
  session_id: string | null;
  url: string | null;
  user_agent: string | null;
  stack_trace: string | null;
  archived: boolean;
  created_at: string;
}

/** Fetch recent (non-archived) logs — latest 3 */
export function useRecentLogs() {
  return useQuery({
    queryKey: ["logs", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_logs")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as AppLog[];
    },
    refetchInterval: 10000,
  });
}

/** Fetch archived logs */
export function useArchivedLogs() {
  return useQuery({
    queryKey: ["logs", "archived"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_logs")
        .select("*")
        .eq("archived", true)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as AppLog[];
    },
    refetchInterval: 30000,
  });
}

/** Download archived logs as a JSON file (simulates .zip concept) */
export function downloadArchivedLogs(logs: AppLog[]) {
  const content = JSON.stringify(logs, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `logs-archive-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
