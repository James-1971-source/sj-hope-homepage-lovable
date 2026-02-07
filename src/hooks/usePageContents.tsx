import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PageContent {
  id: string;
  page_key: string;
  section_key: string;
  title: string | null;
  content: string | null;
  images: string[];
  display_order: number;
}

export interface HistoryItem {
  id: string;
  year: string;
  event: string;
  month: number | null;
  day: number | null;
  images: string[];
  display_order: number;
}

export interface OrganizationItem {
  id: string;
  name: string;
  position: string | null;
  level: number;
  display_order: number;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  display_order: number;
}

export function usePageContents(pageKey?: string) {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        let query = supabase.from("page_contents").select("*").order("display_order");
        if (pageKey) {
          query = query.eq("page_key", pageKey);
        }
        const { data, error } = await query;
        if (error) throw error;
        setContents(data || []);
      } catch (error) {
        console.error("Error fetching page contents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [pageKey]);

  const getContent = (sectionKey: string) => {
    return contents.find((c) => c.section_key === sectionKey);
  };

  return { contents, getContent, loading };
}

export function useHistoryItems() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("history_items")
          .select("*")
          .order("display_order");
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching history items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
}

export function useOrganizationItems() {
  const [items, setItems] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("organization_items")
          .select("*")
          .order("display_order");
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching organization items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
}

export function useFacilities() {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select("*")
          .order("display_order");
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
}
