export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          family_elderly: boolean | null
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
          family_elderly?: boolean | null
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
          family_elderly?: boolean | null
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
          created_at: string
          dog_id: string
          duration_minutes: number | null
          id: string
          notes: string | null
          session_date: string
          success_rate: number | null
          training_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date?: string
          success_rate?: number | null
          training_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date?: string
          success_rate?: number | null
          training_type?: string | null
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
