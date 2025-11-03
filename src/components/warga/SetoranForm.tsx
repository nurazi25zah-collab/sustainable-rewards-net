import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Loader2 } from "lucide-react";

interface KategoriSampah {
  kategori_id: string;
  nama: string;
  satuan: string;
  poin_per_satuan: number;
}

interface SetoranFormProps {
  wargaId: string;
  onSuccess: () => void;
}

export const SetoranForm = ({ wargaId, onSuccess }: SetoranFormProps) => {
  const [kategoris, setKategoris] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kategori_id: "",
    berat: "",
    metode: "pickup",
    alamat_pikup: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchKategoris();
  }, []);

  const fetchKategoris = async () => {
    const { data } = await supabase
      .from("kategori_sampah")
      .select("*")
      .eq("status_aktif", true);
    
    if (data) setKategoris(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const kategori = kategoris.find(k => k.kategori_id === formData.kategori_id);
      if (!kategori) return;

      const berat = parseFloat(formData.berat);
      const poinAwal = berat * kategori.poin_per_satuan;

      // Generate IDs
      const transaksiId = 'T' + Date.now().toString().slice(-9);
      const detailId = 'D' + Date.now().toString().slice(-9);
      const kodeTransaksi = 'TRX' + Date.now().toString().slice(-10);

      // Insert transaksi setoran
      const { error: transaksiError } = await supabase
        .from("transaksi_setoran")
        .insert({
          transaksi_id: transaksiId,
          warga_id: wargaId,
          kode_transaksi: kodeTransaksi,
          total_berat: berat,
          total_poin: 0,
          alamat_pikup: formData.metode === 'pickup' ? formData.alamat_pikup : null,
          status_verifikasi: 'menunggu'
        });

      if (transaksiError) throw transaksiError;

      // Insert detail setoran
      const { error: detailError } = await supabase
        .from("detail_setoran_item")
        .insert({
          detail_id: detailId,
          transaksi_id: transaksiId,
          kategori_id: formData.kategori_id,
          berat_per_item: berat,
          poin_awal: poinAwal
        });

      if (detailError) throw detailError;

      toast({
        title: "Setoran Berhasil!",
        description: `Kode transaksi: ${kodeTransaksi}. Menunggu verifikasi petugas.`,
      });

      setFormData({
        kategori_id: "",
        berat: "",
        metode: "pickup",
        alamat_pikup: ""
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Setor Sampah</CardTitle>
            <CardDescription>Buat setoran sampah baru</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Jenis Sampah</Label>
            <Select
              value={formData.kategori_id}
              onValueChange={(value) => setFormData({ ...formData, kategori_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis sampah" />
              </SelectTrigger>
              <SelectContent>
                {kategoris.map((k) => (
                  <SelectItem key={k.kategori_id} value={k.kategori_id}>
                    {k.nama} ({k.poin_per_satuan} poin/{k.satuan})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Berat (kg)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Masukkan berat"
              value={formData.berat}
              onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Metode Setoran</Label>
            <Select
              value={formData.metode}
              onValueChange={(value) => setFormData({ ...formData, metode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pick Up</SelectItem>
                <SelectItem value="dropoff">Drop Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.metode === "pickup" && (
            <div className="space-y-2">
              <Label>Alamat Pick Up</Label>
              <Textarea
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat_pikup}
                onChange={(e) => setFormData({ ...formData, alamat_pikup: e.target.value })}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kirim Setoran
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
