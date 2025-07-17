export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          recommendations: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dog_id?: string
          id?: string
          recommendations?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          recommendations?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          description: string | null
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      behavior_options: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      breed_details: {
        Row: {
          adaptability: number | null
          affection_level: number | null
          barking_level: number | null
          breed_id: string
          energy_level: number | null
          exercise_needs: number | null
          friendliness_with_kids: number | null
          friendliness_with_pets: number | null
          friendliness_with_strangers: number | null
          grooming_needs: number | null
          playfulness: number | null
          shedding_level: number | null
          trainability: number | null
        }
        Insert: {
          adaptability?: number | null
          affection_level?: number | null
          barking_level?: number | null
          breed_id: string
          energy_level?: number | null
          exercise_needs?: number | null
          friendliness_with_kids?: number | null
          friendliness_with_pets?: number | null
          friendliness_with_strangers?: number | null
          grooming_needs?: number | null
          playfulness?: number | null
          shedding_level?: number | null
          trainability?: number | null
        }
        Update: {
          adaptability?: number | null
          affection_level?: number | null
          barking_level?: number | null
          breed_id?: string
          energy_level?: number | null
          exercise_needs?: number | null
          friendliness_with_kids?: number | null
          friendliness_with_pets?: number | null
          friendliness_with_strangers?: number | null
          grooming_needs?: number | null
          playfulness?: number | null
          shedding_level?: number | null
          trainability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "breed_details_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: true
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
        ]
      }
      breed_diseases: {
        Row: {
          breed_id: string
          description: string | null
          disease_name: string
          id: string
        }
        Insert: {
          breed_id: string
          description?: string | null
          disease_name: string
          id?: string
        }
        Update: {
          breed_id?: string
          description?: string | null
          disease_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breed_diseases_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
        ]
      }
      breeds: {
        Row: {
          avg_life_expectancy: unknown | null
          avg_weight: unknown | null
          dog_mbti: string | null
          history: string | null
          id: string
          name_en: string
          name_ko: string
          popularity_score: number | null
          size_type: string | null
          summary: string | null
          thumbnail_url: string | null
        }
        Insert: {
          avg_life_expectancy?: unknown | null
          avg_weight?: unknown | null
          dog_mbti?: string | null
          history?: string | null
          id?: string
          name_en: string
          name_ko: string
          popularity_score?: number | null
          size_type?: string | null
          summary?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          avg_life_expectancy?: unknown | null
          avg_weight?: unknown | null
          dog_mbti?: string | null
          history?: string | null
          id?: string
          name_en?: string
          name_ko?: string
          popularity_score?: number | null
          size_type?: string | null
          summary?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breeds_dog_mbti_fkey"
            columns: ["dog_mbti"]
            isOneToOne: false
            referencedRelation: "mbti_descriptions"
            referencedColumns: ["mbti_type"]
          },
        ]
      }
      daily_missions: {
        Row: {
          created_at: string | null
          id: number
          mission: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          mission: string
        }
        Update: {
          created_at?: string | null
          id?: number
          mission?: string
        }
        Relationships: []
      }
      dog_badges: {
        Row: {
          achieved_at: string
          badge_id: number
          dog_id: string
          id: number
        }
        Insert: {
          achieved_at?: string
          badge_id: number
          dog_id: string
          id?: number
        }
        Update: {
          achieved_at?: string
          badge_id?: number
          dog_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dog_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_badges_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_desired_behaviors: {
        Row: {
          behavior_option_id: number
          dog_id: string
        }
        Insert: {
          behavior_option_id: number
          dog_id?: string
        }
        Update: {
          behavior_option_id?: number
          dog_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_desired_behaviors_behavior_option_id_fkey"
            columns: ["behavior_option_id"]
            isOneToOne: false
            referencedRelation: "behavior_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_desired_behaviors_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_extended_profile: {
        Row: {
          activity_level: string | null
          created_at: string
          dog_id: string
          family_composition: string | null
          family_kids: boolean | null
          favorite_snacks: string | null
          favorites: string[] | null
          id: string
          known_behaviors: string[] | null
          leash_type: string | null
          living_environment: string | null
          meal_habit: string | null
          owner_proximity: string | null
          past_experience: string | null
          past_history: string | null
          preferred_play: string[] | null
          sensitive_factors: string | null
          sensitive_items: string[] | null
          social_level: string | null
          toilet_type: string | null
          updated_at: string
        }
        Insert: {
          activity_level?: string | null
          created_at?: string
          dog_id: string
          family_composition?: string | null
          family_kids?: boolean | null
          favorite_snacks?: string | null
          favorites?: string[] | null
          id?: string
          known_behaviors?: string[] | null
          leash_type?: string | null
          living_environment?: string | null
          meal_habit?: string | null
          owner_proximity?: string | null
          past_experience?: string | null
          past_history?: string | null
          preferred_play?: string[] | null
          sensitive_factors?: string | null
          sensitive_items?: string[] | null
          social_level?: string | null
          toilet_type?: string | null
          updated_at?: string
        }
        Update: {
          activity_level?: string | null
          created_at?: string
          dog_id?: string
          family_composition?: string | null
          family_kids?: boolean | null
          favorite_snacks?: string | null
          favorites?: string[] | null
          id?: string
          known_behaviors?: string[] | null
          leash_type?: string | null
          living_environment?: string | null
          meal_habit?: string | null
          owner_proximity?: string | null
          past_experience?: string | null
          past_history?: string | null
          preferred_play?: string[] | null
          sensitive_factors?: string | null
          sensitive_items?: string[] | null
          social_level?: string | null
          toilet_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_extended_profile_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: true
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_health_status: {
        Row: {
          dog_id: string
          health_status_option_id: number
        }
        Insert: {
          dog_id?: string
          health_status_option_id: number
        }
        Update: {
          dog_id?: string
          health_status_option_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dog_health_status_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_health_status_health_status_option_id_fkey"
            columns: ["health_status_option_id"]
            isOneToOne: false
            referencedRelation: "health_status_options"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          age: string | null
          breed: string | null
          created_at: string
          gender: string | null
          id: string
          image_url: string | null
          name: string | null
          user_id: string | null
          weight: string | null
        }
        Insert: {
          age?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          user_id?: string | null
          weight?: string | null
        }
        Update: {
          age?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          user_id?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      health_status_options: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      invitation_codes: {
        Row: {
          code: string
          created_at: string | null
          id: number
          is_used: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: never
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: never
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      mbti_descriptions: {
        Row: {
          description: string | null
          mbti_type: string
          title: string | null
        }
        Insert: {
          description?: string | null
          mbti_type: string
          title?: string | null
        }
        Update: {
          description?: string | null
          mbti_type?: string
          title?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          file_path: string
          file_type: string
          file_url: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_type: string
          file_url: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_type?: string
          file_url?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      recommended_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          title: string
          youtube_video_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          title: string
          youtube_video_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          title?: string
          youtube_video_id?: string
        }
        Relationships: []
      }
      training_history: {
        Row: {
          ai_training_details: Json | null
          created_at: string
          dog_id: string | null
          duration_minutes: number | null
          id: number
          is_ai_training: boolean | null
          notes: string | null
          session_date: string | null
          success_rate: number | null
          training_program_id: string | null
          training_type: string | null
          user_id: string | null
        }
        Insert: {
          ai_training_details?: Json | null
          created_at?: string
          dog_id?: string | null
          duration_minutes?: number | null
          id?: number
          is_ai_training?: boolean | null
          notes?: string | null
          session_date?: string | null
          success_rate?: number | null
          training_program_id?: string | null
          training_type?: string | null
          user_id?: string | null
        }
        Update: {
          ai_training_details?: Json | null
          created_at?: string
          dog_id?: string | null
          duration_minutes?: number | null
          id?: number
          is_ai_training?: boolean | null
          notes?: string | null
          session_date?: string | null
          success_rate?: number | null
          training_program_id?: string | null
          training_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_history_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_tips: {
        Row: {
          created_at: string | null
          id: number
          tip: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          tip: string
        }
        Update: {
          created_at?: string | null
          id?: number
          tip?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          plan: string | null
          plan_expiry_date: string | null
        }
        Insert: {
          id: string
          plan?: string | null
          plan_expiry_date?: string | null
        }
        Update: {
          id?: string
          plan?: string | null
          plan_expiry_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_filtered_breeds: {
        Args: { p_answers: Json }
        Returns: {
          id: string
          name_ko: string
          name_en: string
          thumbnail_url: string
          size_type: string
        }[]
      }
      get_filtered_breeds_v2: {
        Args: { p_answers: Json }
        Returns: {
          id: string
          name_ko: string
          name_en: string
          thumbnail_url: string
          size_type: string
        }[]
      }
      get_filtered_breeds_v3: {
        Args: { p_answers: Json }
        Returns: {
          id: string
          name_ko: string
          name_en: string
          thumbnail_url: string
          size_type: string
          total_score: number
        }[]
      }
      get_filtered_breeds_v4: {
        Args: { p_answers: Json }
        Returns: {
          id: string
          name_ko: string
          name_en: string
          thumbnail_url: string
          size_type: string
          total_score: number
        }[]
      }
      get_filtered_breeds_v5: {
        Args: { p_answers: Json }
        Returns: {
          id: string
          name_ko: string
          name_en: string
          thumbnail_url: string
          size_type: string
          total_score: number
        }[]
      }
    }
    Enums: {
      plan_type: "free" | "pro"
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
    Enums: {
      plan_type: ["free", "pro"],
    },
  },
} as const
