import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Gift, Plus, Pencil, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Merchant {
  merchant_id: string;
  nama_merchant: string;
}

interface Reward {
  reward_id: string;
  merchant_id: string;
  nama_reward: string;
  deskripsi: string;
  jumlah_poin: number;
  stok_reward: number;
  masa_berlaku: string;
  status_aktif: boolean;
  merchant: {
    nama_merchant: string;
  };
}

export const KelolaReward = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reward_id: "",
    merchant_id: "",
    nama_reward: "",
    deskripsi: "",
    jumlah_poin: "",
    stok_reward: "",
    masa_berlaku: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
    fetchMerchants();
  }, []);

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("reward")
      .select(`
        *,
        merchant:merchant_id (
          nama_merchant
        )
      `)
      .order("nama_reward");
    
    if (data) setRewards(data);
  };

  const fetchMerchants = async () => {
    const { data } = await supabase
      .from("merchant")
      .select("*")
      .eq("status_aktif", true);
    
    if (data) setMerchants(data);
  };

  const resetForm = () => {
    setFormData({
      reward_id: "",
      merchant_id: "",
      nama_reward: "",
      deskripsi: "",
      jumlah_poin: "",
      stok_reward: "",
      masa_berlaku: ""
    });
    setEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        const { error } = await supabase
          .from("reward")
          .update({
            merchant_id: formData.merchant_id,
            nama_reward: formData.nama_reward,
            deskripsi: formData.deskripsi,
            jumlah_poin: parseFloat(formData.jumlah_poin),
            stok_reward: parseInt(formData.stok_reward),
            masa_berlaku: formData.masa_berlaku
          })
          .eq("reward_id", formData.reward_id);

        if (error) throw error;
        toast({ title: "Reward berhasil diupdate" });
      } else {
        const rewardId = 'R' + Date.now().toString().slice(-9);
        const { error } = await supabase
          .from("reward")
          .insert({
            reward_id: rewardId,
            merchant_id: formData.merchant_id,
            nama_reward: formData.nama_reward,
            deskripsi: formData.deskripsi,
            jumlah_poin: parseFloat(formData.jumlah_poin),
            stok_reward: parseInt(formData.stok_reward),
            masa_berlaku: formData.masa_berlaku
          });

        if (error) throw error;
        toast({ title: "Reward berhasil ditambahkan" });
      }

      setDialogOpen(false);
      resetForm();
      fetchRewards();
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

  const handleEdit = (reward: Reward) => {
    setFormData({
      reward_id: reward.reward_id,
      merchant_id: reward.merchant_id,
      nama_reward: reward.nama_reward,
      deskripsi: reward.deskripsi,
      jumlah_poin: reward.jumlah_poin.toString(),
      stok_reward: reward.stok_reward.toString(),
      masa_berlaku: reward.masa_berlaku
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleToggleStatus = async (rewardId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reward")
      .update({ status_aktif: !currentStatus })
      .eq("reward_id", rewardId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Status berhasil diubah" });
      fetchRewards();
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Gift className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>Kelola Reward</CardTitle>
              <CardDescription>Tambah dan edit voucher reward</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit" : "Tambah"} Reward</DialogTitle>
                <DialogDescription>
                  {editMode ? "Ubah" : "Masukkan"} informasi reward
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Merchant</Label>
                  <Select
                    value={formData.merchant_id}
                    onValueChange={(value) => setFormData({ ...formData, merchant_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.map((m) => (
                        <SelectItem key={m.merchant_id} value={m.merchant_id}>
                          {m.nama_merchant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nama Reward</Label>
                  <Input
                    value={formData.nama_reward}
                    onChange={(e) => setFormData({ ...formData, nama_reward: e.target.value })}
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Jumlah Poin</Label>
                    <Input
                      type="number"
                      value={formData.jumlah_poin}
                      onChange={(e) => setFormData({ ...formData, jumlah_poin: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stok</Label>
                    <Input
                      type="number"
                      value={formData.stok_reward}
                      onChange={(e) => setFormData({ ...formData, stok_reward: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Masa Berlaku</Label>
                    <Input
                      type="date"
                      value={formData.masa_berlaku}
                      onChange={(e) => setFormData({ ...formData, masa_berlaku: e.target.value })}
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
          {rewards.map((reward) => (
            <div
              key={reward.reward_id}
              className="p-4 rounded-lg border border-border/30 bg-background/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{reward.nama_reward}</h4>
                  <p className="text-sm text-muted-foreground">{reward.merchant?.nama_merchant}</p>
                  <p className="text-sm mt-1">{reward.deskripsi}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm">
                      <strong>Poin:</strong> {reward.jumlah_poin}
                    </span>
                    <span className="text-sm">
                      <strong>Stok:</strong> {reward.stok_reward}
                    </span>
                    <span className="text-sm">
                      <strong>Status:</strong> {reward.status_aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(reward)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={reward.status_aktif ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(reward.reward_id, reward.status_aktif)}
                  >
                    {reward.status_aktif ? "Nonaktifkan" : "Aktifkan"}
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
