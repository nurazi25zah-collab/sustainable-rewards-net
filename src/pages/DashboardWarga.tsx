import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Package, History, Bell, LogOut, Menu } from "lucide-react";
import logo from "@/assets/ecoreward-logo-new.png";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

const DashboardWarga = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [saldoPoin, setSaldoPoin] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchSaldoPoin(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSaldoPoin = async (userId: string) => {
    try {
      // Get warga_id first
      const { data: wargaData } = await supabase
        .from("warga")
        .select("warga_id")
        .eq("user_id", userId)
        .single();

      if (wargaData) {
        const { data } = await supabase
          .from("saldo_poin")
          .select("*")
          .eq("user_id", wargaData.warga_id)
          .single();
        
        setSaldoPoin(data);
      }
    } catch (error) {
      console.error("Error fetching saldo:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa lagi!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="EcoReward" className="h-8 w-8" />
              <span className="text-lg font-bold">Dashboard Warga</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang!</h1>
          <p className="text-muted-foreground">Kelola setoran sampah dan tukar poin Anda</p>
        </div>

        {/* Poin Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Poin Anda</p>
                <p className="text-4xl font-bold">
                  {saldoPoin?.total_poin?.toLocaleString('id-ID') || 0}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  Poin terkumpul: {saldoPoin?.poin_terkumpul_kumulatif?.toLocaleString('id-ID') || 0}
                </p>
              </div>
              <Award className="h-16 w-16 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-elegant transition-all cursor-pointer">
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Setor Sampah</CardTitle>
              <CardDescription>Buat setoran baru</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-elegant transition-all cursor-pointer">
            <CardHeader>
              <Award className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-lg">Tukar Poin</CardTitle>
              <CardDescription>Lihat reward tersedia</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-elegant transition-all cursor-pointer">
            <CardHeader>
              <History className="h-8 w-8 text-success mb-2" />
              <CardTitle className="text-lg">Riwayat</CardTitle>
              <CardDescription>Lihat transaksi Anda</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Transaksi dan notifikasi terkini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada aktivitas terbaru</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardWarga;
