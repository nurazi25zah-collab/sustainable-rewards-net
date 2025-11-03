import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Recycle, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface KategoriSampah {
  kategori_id: string;
  nama: string;
  deskripsi: string;
  satuan: string;
  poin_per_satuan: number;
  status_aktif: boolean;
}

export const KelolaSampah = () => {
  const [kategoris, setKategoris] = useState<KategoriSampah[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kategori_id: "",
    nama: "",
    deskripsi: "",
    satuan: "kg",
    poin_per_satuan: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchKategoris();
  }, []);

  const fetchKategoris = async () => {
    const { data } = await supabase
      .from("kategori_sampah")
      .select("*")
      .order("nama");
    
    if (data) setKategoris(data);
  };

  const resetForm = () => {
    setFormData({
      kategori_id: "",
      nama: "",
      deskripsi: "",
      satuan: "kg",
      poin_per_satuan: ""
    });
    setEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        const { error } = await supabase
          .from("kategori_sampah")
          .update({
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            satuan: formData.satuan,
            poin_per_satuan: parseFloat(formData.poin_per_satuan)
          })
          .eq("kategori_id", formData.kategori_id);

        if (error) throw error;
        toast({ title: "Kategori berhasil diupdate" });
      } else {
        const kategoriId = 'K' + Date.now().toString().slice(-4);
        const { error } = await supabase
          .from("kategori_sampah")
          .insert({
            kategori_id: kategoriId,
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            satuan: formData.satuan,
            poin_per_satuan: parseFloat(formData.poin_per_satuan)
          });

        if (error) throw error;
        toast({ title: "Kategori berhasil ditambahkan" });
      }

      setDialogOpen(false);
      resetForm();
      fetchKategoris();
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

  const handleEdit = (kategori: KategoriSampah) => {
    setFormData({
      kategori_id: kategori.kategori_id,
      nama: kategori.nama,
      deskripsi: kategori.deskripsi,
      satuan: kategori.satuan,
      poin_per_satuan: kategori.poin_per_satuan.toString()
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleToggleStatus = async (kategoriId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("kategori_sampah")
      .update({ status_aktif: !currentStatus })
      .eq("kategori_id", kategoriId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Status berhasil diubah" });
      fetchKategoris();
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Kelola Kategori Sampah</CardTitle>
              <CardDescription>Atur jenis sampah dan konversi poin</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit" : "Tambah"} Kategori Sampah</DialogTitle>
                <DialogDescription>
                  {editMode ? "Ubah" : "Masukkan"} informasi kategori sampah
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Kategori</Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Satuan</Label>
                    <Input
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      placeholder="kg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Poin per Satuan</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.poin_per_satuan}
                      onChange={(e) => setFormData({ ...formData, poin_per_satuan: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editMode ? "Update" : "Tambah"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kategoris.map((kategori) => (
            <div
              key={kategori.kategori_id}
              className="p-4 rounded-lg border border-border/30 bg-background/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{kategori.nama}</h4>
                  <p className="text-sm text-muted-foreground">{kategori.deskripsi}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm">
                      <strong>Satuan:</strong> {kategori.satuan}
                    </span>
                    <span className="text-sm">
                      <strong>Poin:</strong> {kategori.poin_per_satuan}/{kategori.satuan}
                    </span>
                    <span className="text-sm">
                      <strong>Status:</strong> {kategori.status_aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(kategori)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={kategori.status_aktif ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(kategori.kategori_id, kategori.status_aktif)}
                  >
                    {kategori.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
