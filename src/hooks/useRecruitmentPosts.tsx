import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RecruitmentPost {
  id: string;
  title: string;
  content: string | null;
  poster_image: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export function useRecruitmentPosts(onlyActive = false) {
  const [posts, setPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("recruitment_posts" as any)
        .select("*")
        .order("display_order")
        .order("created_at", { ascending: false });

      if (onlyActive) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching recruitment posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, refetch: fetchPosts };
}
