import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Transaksi {
  transaksi_id: string;
  warga_id: string;
  kode_transaksi: string;
  tanggal_setor: string;
  total_berat: number;
  alamat_pikup: string | null;
  warga: {
    nama_lengkap: string;
    no_hp: string;
  };
  detail_setoran_item: Array<{
    detail_id: string;
    berat_per_item: number;
    poin_awal: number;
    kategori_sampah: {
      nama: string;
      poin_per_satuan: number;
    };
  }>;
}

export const VerifikasiSetoran = () => {
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);
  const [beratAktual, setBeratAktual] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransaksis();
  }, []);

  const fetchTransaksis = async () => {
    const { data } = await supabase
      .from("transaksi_setoran")
      .select(`
        *,
        warga:warga_id (
          nama_lengkap,
          no_hp
        ),
        detail_setoran_item (
          detail_id,
          berat_per_item,
          poin_awal,
          kategori_sampah:kategori_id (
            nama,
            poin_per_satuan
          )
        )
      `)
      .eq("status_verifikasi", "menunggu")
      .order("tanggal_setor", { ascending: true });
    
    if (data) setTransaksis(data);
  };

  const handleVerifikasi = async (status: 'disetujui' | 'ditolak') => {
    if (!selectedTransaksi) return;
    setLoading(true);

    try {
      const detail = selectedTransaksi.detail_setoran_item[0];
      const beratFinal = status === 'disetujui' ? parseFloat(beratAktual) : 0;
      const poinFinal = status === 'disetujui' ? beratFinal * detail.kategori_sampah.poin_per_satuan : 0;

      // Update transaksi
      const { error: transaksiError } = await supabase
        .from("transaksi_setoran")
        .update({
          status_verifikasi: status,
          total_berat: beratFinal,
          total_poin: poinFinal,
          catatan_petugas: catatan
        })
        .eq("transaksi_id", selectedTransaksi.transaksi_id);

      if (transaksiError) throw transaksiError;

      // Update detail
      const { error: detailError } = await supabase
        .from("detail_setoran_item")
        .update({
          poin_final: poinFinal,
          waktu_verifikasi: new Date().toISOString()
        })
        .eq("detail_id", detail.detail_id);

      if (detailError) throw detailError;

      // Update saldo poin jika disetujui
      if (status === 'disetujui') {
        const { data: currentSaldo } = await supabase
          .from("saldo_poin")
          .select("total_poin, poin_terkumpul_kumulatif")
          .eq("user_id", selectedTransaksi.warga_id)
          .single();

        if (currentSaldo) {
          const { error: saldoError } = await supabase
            .from("saldo_poin")
            .update({
              total_poin: currentSaldo.total_poin + poinFinal,
              poin_terkumpul_kumulatif: currentSaldo.poin_terkumpul_kumulatif + poinFinal
            })
            .eq("user_id", selectedTransaksi.warga_id);

          if (saldoError) throw saldoError;

          // Insert histori poin
          const historiId = 'H' + Date.now().toString().slice(-9);
          await supabase
            .from("histori_poin_nilai")
            .insert({
              histori_id: historiId,
              user_id: selectedTransaksi.warga_id,
              transaksi_id: selectedTransaksi.transaksi_id,
              jenis_transaksi: 'setoran',
              jumlah_poin: poinFinal,
              saldo_sebelum: currentSaldo.total_poin,
              saldo_sesudah: currentSaldo.total_poin + poinFinal,
              keterangan: `Verifikasi setoran ${selectedTransaksi.kode_transaksi}`
            });
        }
      }

      toast({
        title: status === 'disetujui' ? "Setoran Terverifikasi" : "Setoran Ditolak",
        description: status === 'disetujui' 
          ? `Poin ${poinFinal.toFixed(2)} berhasil ditambahkan` 
          : "Setoran telah ditolak",
      });

      setSelectedTransaksi(null);
      setBeratAktual("");
      setCatatan("");
      fetchTransaksis();
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

  if (selectedTransaksi) {
    const detail = selectedTransaksi.detail_setoran_item[0];
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-border/30">
        <CardHeader>
          <CardTitle>Verifikasi Setoran</CardTitle>
          <CardDescription>{selectedTransaksi.kode_transaksi}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p><strong>Warga:</strong> {selectedTransaksi.warga.nama_lengkap}</p>
            <p><strong>Tanggal:</strong> {format(new Date(selectedTransaksi.tanggal_setor), "dd MMMM yyyy, HH:mm", { locale: id })}</p>
            <p><strong>Jenis Sampah:</strong> {detail.kategori_sampah.nama}</p>
            <p><strong>Berat Estimasi:</strong> {detail.berat_per_item} kg</p>
            <p><strong>Poin Estimasi:</strong> {detail.poin_awal}</p>
            {selectedTransaksi.alamat_pikup && (
              <p><strong>Alamat Pick Up:</strong> {selectedTransaksi.alamat_pikup}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Berat Aktual (kg)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Masukkan berat aktual"
              value={beratAktual}
              onChange={(e) => setBeratAktual(e.target.value)}
              required
            />
            {beratAktual && (
              <p className="text-sm text-muted-foreground">
                Poin yang akan diterima: {(parseFloat(beratAktual) * detail.kategori_sampah.poin_per_satuan).toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Catatan Petugas</Label>
            <Textarea
              placeholder="Tambahkan catatan (opsional)"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleVerifikasi('disetujui')}
              disabled={!beratAktual || loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <CheckCircle className="mr-2 h-4 w-4" />
              Verifikasi
            </Button>
            <Button
              onClick={() => handleVerifikasi('ditolak')}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Tolak
            </Button>
          </div>
          <Button
            onClick={() => setSelectedTransaksi(null)}
            variant="outline"
            className="w-full"
          >
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <CardTitle>Daftar Setoran Menunggu</CardTitle>
        <CardDescription>Verifikasi setoran warga yang baru masuk</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transaksis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada setoran yang menunggu verifikasi</p>
            </div>
          ) : (
            transaksis.map((t) => (
              <div
                key={t.transaksi_id}
                className="p-4 rounded-lg border border-border/30 bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() => setSelectedTransaksi(t)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{t.kode_transaksi}</p>
                    <p className="text-sm text-muted-foreground">{t.warga.nama_lengkap}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(t.tanggal_setor), "dd MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <Button size="sm">Verifikasi</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
