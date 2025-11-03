import { Recycle, Gift, TrendingUp, Users, MapPin, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Recycle,
    title: "Setor Sampah Mudah",
    description: "Pilih metode pick-up atau drop-off. Kami siap membantu mengumpulkan sampah Anda.",
    color: "text-primary",
  },
  {
    icon: Gift,
    title: "Reward Menarik",
    description: "Tukarkan poin dengan voucher, diskon, dan hadiah dari merchant partner kami.",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Lacak Progress",
    description: "Monitor poin dan riwayat transaksi Anda secara real-time di dashboard.",
    color: "text-success",
  },
  {
    icon: Users,
    title: "Komunitas Aktif",
    description: "Bergabung dengan ribuan warga yang peduli lingkungan dan sustainability.",
    color: "text-primary",
  },
  {
    icon: MapPin,
    title: "Jangkauan Luas",
    description: "Layanan tersedia di berbagai wilayah dengan petugas yang profesional.",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    title: "Edukasi Lingkungan",
    description: "Akses konten edukatif tentang daur ulang dan pengelolaan sampah.",
    color: "text-success",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Kenapa Memilih{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              EcoReward?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Platform terpercaya untuk mengelola sampah dengan cara yang menyenangkan dan bermanfaat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/30 bg-card/60 backdrop-blur-xl"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-primary/10 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
