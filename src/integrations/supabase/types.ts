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
      detail_setoran_item: {
        Row: {
          berat_per_item: number
          created_at: string | null
          detail_id: string
          kategori_id: string
          poin_awal: number
          poin_final: number | null
          transaksi_id: string
          waktu_verifikasi: string | null
        }
        Insert: {
          berat_per_item: number
          created_at?: string | null
          detail_id: string
          kategori_id: string
          poin_awal: number
          poin_final?: number | null
          transaksi_id: string
          waktu_verifikasi?: string | null
        }
        Update: {
          berat_per_item?: number
          created_at?: string | null
          detail_id?: string
          kategori_id?: string
          poin_awal?: number
          poin_final?: number | null
          transaksi_id?: string
          waktu_verifikasi?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detail_setoran_item_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori_sampah"
            referencedColumns: ["kategori_id"]
          },
          {
            foreignKeyName: "detail_setoran_item_transaksi_id_fkey"
            columns: ["transaksi_id"]
            isOneToOne: false
            referencedRelation: "transaksi_setoran"
            referencedColumns: ["transaksi_id"]
          },
        ]
      }
      edukasi: {
        Row: {
          created_at: string | null
          edukasi_id: string
          judul: string
          kategori: string | null
          konten: string
          penulis: string | null
          status_aktif: boolean | null
        }
        Insert: {
          created_at?: string | null
          edukasi_id: string
          judul: string
          kategori?: string | null
          konten: string
          penulis?: string | null
          status_aktif?: boolean | null
        }
        Update: {
          created_at?: string | null
          edukasi_id?: string
          judul?: string
          kategori?: string | null
          konten?: string
          penulis?: string | null
          status_aktif?: boolean | null
        }
        Relationships: []
      }
      histori_poin_nilai: {
        Row: {
          created_at: string | null
          histori_id: string
          jenis_transaksi: Database["public"]["Enums"]["jenis_transaksi"]
          jumlah_poin: number
          keterangan: string | null
          penukaran_id: string | null
          saldo_sebelum: number
          saldo_sesudah: number
          transaksi_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          histori_id: string
          jenis_transaksi: Database["public"]["Enums"]["jenis_transaksi"]
          jumlah_poin: number
          keterangan?: string | null
          penukaran_id?: string | null
          saldo_sebelum: number
          saldo_sesudah: number
          transaksi_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          histori_id?: string
          jenis_transaksi?: Database["public"]["Enums"]["jenis_transaksi"]
          jumlah_poin?: number
          keterangan?: string | null
          penukaran_id?: string | null
          saldo_sebelum?: number
          saldo_sesudah?: number
          transaksi_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "histori_poin_nilai_penukaran_id_fkey"
            columns: ["penukaran_id"]
            isOneToOne: false
            referencedRelation: "transaksi_penukaran"
            referencedColumns: ["penukaran_id"]
          },
          {
            foreignKeyName: "histori_poin_nilai_transaksi_id_fkey"
            columns: ["transaksi_id"]
            isOneToOne: false
            referencedRelation: "transaksi_setoran"
            referencedColumns: ["transaksi_id"]
          },
          {
            foreignKeyName: "histori_poin_nilai_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["warga_id"]
          },
        ]
      }
      kategori_sampah: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          kategori_id: string
          nama: string
          poin_per_satuan: number
          satuan: string | null
          status_aktif: boolean | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          kategori_id: string
          nama: string
          poin_per_satuan: number
          satuan?: string | null
          status_aktif?: boolean | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          kategori_id?: string
          nama?: string
          poin_per_satuan?: number
          satuan?: string | null
          status_aktif?: boolean | null
        }
        Relationships: []
      }
      merchant: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          logo: string | null
          merchant_id: string
          nama_merchant: string
          status_aktif: boolean | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          logo?: string | null
          merchant_id: string
          nama_merchant: string
          status_aktif?: boolean | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          logo?: string | null
          merchant_id?: string
          nama_merchant?: string
          status_aktif?: boolean | null
        }
        Relationships: []
      }
      notifikasi: {
        Row: {
          created_at: string | null
          is_read: boolean | null
          judul: string
          notifikasi_id: string
          pesan: string
          tipe: Database["public"]["Enums"]["tipe_notifikasi"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_read?: boolean | null
          judul: string
          notifikasi_id: string
          pesan: string
          tipe: Database["public"]["Enums"]["tipe_notifikasi"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_read?: boolean | null
          judul?: string
          notifikasi_id?: string
          pesan?: string
          tipe?: Database["public"]["Enums"]["tipe_notifikasi"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifikasi_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["warga_id"]
          },
        ]
      }
      reward: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          jumlah_poin: number
          masa_berlaku: string | null
          merchant_id: string
          nama_reward: string
          reward_id: string
          status_aktif: boolean | null
          stok_reward: number | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          jumlah_poin: number
          masa_berlaku?: string | null
          merchant_id: string
          nama_reward: string
          reward_id: string
          status_aktif?: boolean | null
          stok_reward?: number | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          jumlah_poin?: number
          masa_berlaku?: string | null
          merchant_id?: string
          nama_reward?: string
          reward_id?: string
          status_aktif?: boolean | null
          stok_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      saldo_poin: {
        Row: {
          created_at: string | null
          poin_dipakai_kumulatif: number | null
          poin_terkumpul_kumulatif: number | null
          total_poin: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          poin_dipakai_kumulatif?: number | null
          poin_terkumpul_kumulatif?: number | null
          total_poin?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          poin_dipakai_kumulatif?: number | null
          poin_terkumpul_kumulatif?: number | null
          total_poin?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saldo_poin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "warga"
            referencedColumns: ["warga_id"]
          },
        ]
      }
      transaksi_penukaran: {
        Row: {
          catatan_admin: string | null
          created_at: string | null
          penukaran_id: string
          poin_rancangan: number
          reward_id: string
          status_penukaran:
            | Database["public"]["Enums"]["status_penukaran"]
            | null
          tgl_kedaluwarsa: string | null
          tgl_penukaran: string | null
          user_id: string
        }
        Insert: {
          catatan_admin?: string | null
          created_at?: string | null
          penukaran_id: string
          poin_rancangan: number
          reward_id: string
          status_penukaran?:
            | Database["public"]["Enums"]["status_penukaran"]
            | null
          tgl_kedaluwarsa?: string | null
          tgl_penukaran?: string | null
          user_id: string
        }
        Update: {
          catatan_admin?: string | null
          created_at?: string | null
          penukaran_id?: string
          poin_rancangan?: number
          reward_id?: string
          status_penukaran?:
            | Database["public"]["Enums"]["status_penukaran"]
            | null
          tgl_kedaluwarsa?: string | null
          tgl_penukaran?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_penukaran_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "reward"
            referencedColumns: ["reward_id"]
          },
          {
            foreignKeyName: "transaksi_penukaran_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["warga_id"]
          },
        ]
      }
      transaksi_setoran: {
        Row: {
          alamat_pikup: string | null
          catatan_petugas: string | null
          created_at: string | null
          kode_transaksi: string
          status_verifikasi:
            | Database["public"]["Enums"]["status_verifikasi"]
            | null
          tanggal_setor: string | null
          tanggapan_foto_evidence: string | null
          total_berat: number | null
          total_poin: number | null
          transaksi_id: string
          warga_id: string
        }
        Insert: {
          alamat_pikup?: string | null
          catatan_petugas?: string | null
          created_at?: string | null
          kode_transaksi: string
          status_verifikasi?:
            | Database["public"]["Enums"]["status_verifikasi"]
            | null
          tanggal_setor?: string | null
          tanggapan_foto_evidence?: string | null
          total_berat?: number | null
          total_poin?: number | null
          transaksi_id: string
          warga_id: string
        }
        Update: {
          alamat_pikup?: string | null
          catatan_petugas?: string | null
          created_at?: string | null
          kode_transaksi?: string
          status_verifikasi?:
            | Database["public"]["Enums"]["status_verifikasi"]
            | null
          tanggal_setor?: string | null
          tanggapan_foto_evidence?: string | null
          total_berat?: number | null
          total_poin?: number | null
          transaksi_id?: string
          warga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_setoran_warga_id_fkey"
            columns: ["warga_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["warga_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      warga: {
        Row: {
          alamat: string | null
          created_at: string | null
          email: string
          foto_profil: string | null
          nama_lengkap: string
          no_hp: string | null
          status_aktif: boolean | null
          user_id: string
          warga_id: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          email: string
          foto_profil?: string | null
          nama_lengkap: string
          no_hp?: string | null
          status_aktif?: boolean | null
          user_id: string
          warga_id: string
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          email?: string
          foto_profil?: string | null
          nama_lengkap?: string
          no_hp?: string | null
          status_aktif?: boolean | null
          user_id?: string
          warga_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "petugas" | "warga"
      jenis_transaksi: "setoran" | "penukaran"
      status_penukaran: "menunggu" | "disetujui" | "ditolak" | "kadaluarsa"
      status_verifikasi: "menunggu" | "disetujui" | "ditolak"
      tipe_notifikasi: "setoran" | "penukaran" | "sistem" | "info"
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
      app_role: ["admin", "petugas", "warga"],
      jenis_transaksi: ["setoran", "penukaran"],
      status_penukaran: ["menunggu", "disetujui", "ditolak", "kadaluarsa"],
      status_verifikasi: ["menunggu", "disetujui", "ditolak"],
      tipe_notifikasi: ["setoran", "penukaran", "sistem", "info"],
    },
  },
} as const
