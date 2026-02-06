import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Program {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  target: string | null;
  schedule: string | null;
  images: string[] | null;
  tags: string[] | null;
  created_at: string;
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setPrograms(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { programs, loading };
}
