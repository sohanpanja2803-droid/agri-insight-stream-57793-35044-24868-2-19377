export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crop_suggestions: {
        Row: {
          created_at: string
          crop_name: string
          id: string
          price_range_max: number
          price_range_min: number
          suitability_score: number
          trend: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_name: string
          id?: string
          price_range_max: number
          price_range_min: number
          suitability_score: number
          trend: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_name?: string
          id?: string
          price_range_max?: number
          price_range_min?: number
          suitability_score?: number
          trend?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      growth_metrics: {
        Row: {
          created_at: string
          health_score: number
          height: number
          id: string
          recorded_at: string
          user_id: string
          week_number: number
        }
        Insert: {
          created_at?: string
          health_score: number
          height: number
          id?: string
          recorded_at?: string
          user_id: string
          week_number: number
        }
        Update: {
          created_at?: string
          health_score?: number
          height?: number
          id?: string
          recorded_at?: string
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          crop_type: string | null
          email: string
          farm_size: number | null
          full_name: string
          id: string
          location: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_type?: string | null
          email: string
          farm_size?: number | null
          full_name: string
          id: string
          location?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_type?: string | null
          email?: string
          farm_size?: number | null
          full_name?: string
          id?: string
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      soil_data: {
        Row: {
          created_at: string
          id: string
          moisture: number | null
          nitrogen: number | null
          organic_matter: number | null
          ph: number | null
          phosphorus: number | null
          potassium: number | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          organic_matter?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          organic_matter?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      temperature_readings: {
        Row: {
          created_at: string
          id: string
          recorded_at: string
          temperature: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recorded_at?: string
          temperature: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recorded_at?: string
          temperature?: number
          user_id?: string
        }
        Relationships: []
      }
      yield_predictions: {
        Row: {
          actual_yield: number | null
          created_at: string
          id: string
          month: string
          predicted_yield: number
          recorded_at: string
          user_id: string
        }
        Insert: {
          actual_yield?: number | null
          created_at?: string
          id?: string
          month: string
          predicted_yield: number
          recorded_at?: string
          user_id: string
        }
        Update: {
          actual_yield?: number | null
          created_at?: string
          id?: string
          month?: string
          predicted_yield?: number
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
