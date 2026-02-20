/**
 * Frontend Service Layer — Deals API
 * Separates data access logic from UI components (SRP / SOLID)
 */
import { supabase } from "@/integrations/supabase/client";
import type { Deal } from "@/types/deals";

export const dealsService = {
  async getAll(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getById(id: string): Promise<Deal | null> {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },
};
