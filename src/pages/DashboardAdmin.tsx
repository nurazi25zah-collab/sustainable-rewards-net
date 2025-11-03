import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Award, TrendingUp, Settings, LogOut, Menu, BarChart3, Gift, Recycle, BookOpen, Bell, ShoppingBag } from "lucide-react";
import logo from "@/assets/ecoreward-logo-new.png";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

const DashboardAdmin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa lagi!",
    });
    navigate("/");
  };

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Package, label: "Kategori Sampah", onClick: () => {} },
    { icon: Gift, label: "Kelola Reward", onClick: () => {} },
    { icon: Users, label: "Kelola Pengguna", onClick: () => {} },
    { icon: ShoppingBag, label: "Merchant", onClick: () => {} },
    { icon: BookOpen, label: "Edukasi", onClick: () => {} },
    { icon: Bell, label: "Notifikasi", onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border/30 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EcoReward" className="h-8 w-8" />
            {sidebarOpen && <span className="text-lg font-bold">EcoReward</span>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/30">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${!sidebarOpen && 'px-2'}`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
              <p className="text-sm text-muted-foreground">Kelola seluruh sistem EcoReward</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+25%</span>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Warga</p>
                  <p className="text-3xl font-bold">2,145</p>
                  <p className="text-xs opacity-75 mt-1">from last month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+17.5%</span>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Setoran</p>
                  <p className="text-3xl font-bold">15,420</p>
                  <p className="text-xs opacity-75 mt-1">from last month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Reward Aktif</p>
                  <p className="text-3xl font-bold">87</p>
                  <p className="text-xs opacity-75 mt-1">available rewards</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Poin Ditukar</p>
                  <p className="text-3xl font-bold">1.2M</p>
                  <p className="text-xs opacity-75 mt-1">total points</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Notifications */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card/60 backdrop-blur-xl border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Statistik Setoran
                </CardTitle>
                <CardDescription>Aktivitas setoran minggu ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '50%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Sen</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '80%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Sel</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '30%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Rab</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '60%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Kam</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '45%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Jum</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '70%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Sab</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors cursor-pointer" style={{ height: '40%' }}>
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-xs font-medium">Min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-xl border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  Notifikasi
                </CardTitle>
                <CardDescription>Aktivitas terbaru sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { text: "Setoran baru dari Warga #1234", time: "2 menit lalu" },
                    { text: "Penukaran reward berhasil", time: "15 menit lalu" },
                    { text: "Merchant baru terdaftar", time: "1 jam lalu" },
                    { text: "Update kategori sampah", time: "2 jam lalu" },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notif.text}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Cards */}
          <div>
            <h2 className="text-xl font-bold mb-4">Manajemen Sistem</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-elegant transition-all cursor-pointer bg-card/60 backdrop-blur-xl border-border/30" onClick={() => toast({ title: "Kategori Sampah", description: "Fitur dalam pengembangan" })}>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-2">
                    <Recycle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Kelola Kategori Sampah</CardTitle>
                  <CardDescription>Atur jenis sampah dan konversi poin</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-elegant transition-all cursor-pointer bg-card/60 backdrop-blur-xl border-border/30" onClick={() => toast({ title: "Kelola Reward", description: "Fitur dalam pengembangan" })}>
                <CardHeader>
                  <div className="p-3 bg-accent/10 rounded-xl w-fit mb-2">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>Kelola Reward</CardTitle>
                  <CardDescription>Tambah dan edit voucher reward</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-elegant transition-all cursor-pointer bg-card/60 backdrop-blur-xl border-border/30" onClick={() => toast({ title: "Kelola Pengguna", description: "Fitur dalam pengembangan" })}>
                <CardHeader>
                  <div className="p-3 bg-success/10 rounded-xl w-fit mb-2">
                    <Users className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle>Kelola Pengguna</CardTitle>
                  <CardDescription>Manajemen warga, petugas, dan mitra</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
