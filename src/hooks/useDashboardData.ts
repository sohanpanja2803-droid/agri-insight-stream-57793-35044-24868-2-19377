import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = (userId: string | undefined) => {
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: soilData } = useQuery({
    queryKey: ["soil_data", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("soil_data")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: cropSuggestions } = useQuery({
    queryKey: ["crop_suggestions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("crop_suggestions")
        .select("*")
        .eq("user_id", userId)
        .order("suitability_score", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: temperatureReadings } = useQuery({
    queryKey: ["temperature_readings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("temperature_readings")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: growthMetrics } = useQuery({
    queryKey: ["growth_metrics", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("growth_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("week_number", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: yieldPredictions } = useQuery({
    queryKey: ["yield_predictions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("yield_predictions")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return {
    profile,
    soilData: soilData?.[0],
    cropSuggestions,
    temperatureReadings,
    growthMetrics,
    yieldPredictions,
  };
};
