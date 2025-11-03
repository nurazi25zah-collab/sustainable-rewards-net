import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Package, Award } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Transaksi {
  transaksi_id: string;
  kode_transaksi: string;
  tanggal_setor: string;
  total_berat: number;
  total_poin: number;
  status_verifikasi: string;
}

interface RiwayatTransaksiProps {
  wargaId: string;
}

export const RiwayatTransaksi = ({ wargaId }: RiwayatTransaksiProps) => {
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);

  useEffect(() => {
    fetchTransaksis();
  }, [wargaId]);

  const fetchTransaksis = async () => {
    const { data } = await supabase
      .from("transaksi_setoran")
      .select("*")
      .eq("warga_id", wargaId)
      .order("tanggal_setor", { ascending: false });
    
    if (data) setTransaksis(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "terverifikasi": return "bg-success/10 text-success border-success/20";
      case "ditolak": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "terverifikasi": return "Terverifikasi";
      case "ditolak": return "Ditolak";
      default: return "Menunggu";
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-xl">
            <History className="h-6 w-6 text-accent" />
          </div>
          <div>
            <CardTitle>Riwayat Setoran</CardTitle>
            <CardDescription>Transaksi setoran sampah Anda</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transaksis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada riwayat transaksi</p>
            </div>
          ) : (
            transaksis.map((t) => (
              <div
                key={t.transaksi_id}
                className="p-4 rounded-lg border border-border/30 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{t.kode_transaksi}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(t.tanggal_setor), "dd MMMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(t.status_verifikasi)}>
                    {getStatusLabel(t.status_verifikasi)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {t.total_berat} kg
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {t.total_poin} poin
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
