import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageProgram {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
  icon: string;
  display_order: number;
}

export function useHomepagePrograms() {
  const [programs, setPrograms] = useState<HomepageProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_programs" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      setPrograms((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching homepage programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return { programs, loading, refetch: fetchPrograms };
}
