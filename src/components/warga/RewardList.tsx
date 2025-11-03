import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gift, Loader2 } from "lucide-react";

interface Reward {
  reward_id: string;
  nama_reward: string;
  deskripsi: string;
  jumlah_poin: number;
  stok_reward: number;
  merchant: {
    nama_merchant: string;
  };
}

interface RewardListProps {
  wargaId: string;
  currentPoin: number;
  onRedeem: () => void;
}

export const RewardList = ({ wargaId, currentPoin, onRedeem }: RewardListProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
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
      .eq("status_aktif", true)
      .gt("stok_reward", 0)
      .order("jumlah_poin", { ascending: true });
    
    if (data) setRewards(data);
  };

  const handleRedeem = async (rewardId: string, jumlahPoin: number) => {
    if (currentPoin < jumlahPoin) {
      toast({
        title: "Poin Tidak Cukup",
        description: "Saldo poin Anda tidak mencukupi untuk menukar reward ini.",
        variant: "destructive"
      });
      return;
    }

    setLoading(rewardId);

    try {
      const penukaranId = 'P' + Date.now().toString().slice(-9);

      const { error } = await supabase
        .from("transaksi_penukaran")
        .insert({
          penukaran_id: penukaranId,
          user_id: wargaId,
          reward_id: rewardId,
          poin_rancangan: jumlahPoin,
          status_penukaran: 'menunggu'
        });

      if (error) throw error;

      toast({
        title: "Penukaran Berhasil!",
        description: "Permintaan penukaran Anda sedang diproses.",
      });

      onRedeem();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-xl">
            <Gift className="h-6 w-6 text-accent" />
          </div>
          <div>
            <CardTitle>Reward Tersedia</CardTitle>
            <CardDescription>Tukar poin Anda dengan reward menarik</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada reward tersedia</p>
            </div>
          ) : (
            rewards.map((reward) => (
              <div
                key={reward.reward_id}
                className="p-4 rounded-lg border border-border/30 bg-background/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{reward.nama_reward}</h4>
                    <p className="text-sm text-muted-foreground">{reward.merchant?.nama_merchant}</p>
                    <p className="text-sm mt-1">{reward.deskripsi}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-lg font-bold text-primary">{reward.jumlah_poin} Poin</p>
                    <p className="text-xs text-muted-foreground">Stok: {reward.stok_reward}</p>
                  </div>
                  <Button
                    onClick={() => handleRedeem(reward.reward_id, reward.jumlah_poin)}
                    disabled={currentPoin < reward.jumlah_poin || loading === reward.reward_id}
                    size="sm"
                  >
                    {loading === reward.reward_id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tukar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
