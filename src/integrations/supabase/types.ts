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
      dealers: {
        Row: {
          address: string
          city: string
          created_at: string
          description: string | null
          email: string
          id: string
          logo: string | null
          name: string
          phone: string
          state: string
          status: string | null
          updated_at: string
          user_id: string
          website: string | null
          zip: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          logo?: string | null
          name: string
          phone: string
          state: string
          status?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          zip: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          logo?: string | null
          name?: string
          phone?: string
          state?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          zip?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      vehicle_features: {
        Row: {
          category: string
          created_at: string
          feature: string
          id: string
          value: boolean
          vehicle_id: string
        }
        Insert: {
          category: string
          created_at?: string
          feature: string
          id?: string
          value?: boolean
          vehicle_id: string
        }
        Update: {
          category?: string
          created_at?: string
          feature?: string
          id?: string
          value?: boolean
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_features_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          body_type: Database["public"]["Enums"]["body_type"]
          color: string
          created_at: string
          doors: number
          engine_capacity: string
          featured: boolean
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          image: string
          location: string
          mileage: string
          price: number
          status: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          body_type: Database["public"]["Enums"]["body_type"]
          color: string
          created_at?: string
          doors: number
          engine_capacity: string
          featured?: boolean
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          image: string
          location: string
          mileage: string
          price: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          body_type?: Database["public"]["Enums"]["body_type"]
          color?: string
          created_at?: string
          doors?: number
          engine_capacity?: string
          featured?: boolean
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          image?: string
          location?: string
          mileage?: string
          price?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          title?: string
          transmission?: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_user_role: {
        Args: { user_id: string; new_role: string }
        Returns: undefined
      }
    }
    Enums: {
      body_type: "SUV" | "Sedan" | "Hatchback" | "Coupe" | "Truck" | "Van"
      fuel_type: "Gasoline" | "Diesel" | "Hybrid" | "Electric"
      transmission_type: "Automatic" | "Manual" | "PDK" | "CVT"
      vehicle_status: "Available" | "Sold" | "Reserved"
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
    Enums: {
      body_type: ["SUV", "Sedan", "Hatchback", "Coupe", "Truck", "Van"],
      fuel_type: ["Gasoline", "Diesel", "Hybrid", "Electric"],
      transmission_type: ["Automatic", "Manual", "PDK", "CVT"],
      vehicle_status: ["Available", "Sold", "Reserved"],
    },
  },
} as const
