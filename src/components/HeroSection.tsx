import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recycle, Award, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary))_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent))_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Recycle className="h-4 w-4" />
                Platform Ramah Lingkungan
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Ubah Sampah Jadi{" "}
              <span className="bg-gradient-to-r from-accent via-accent-glow to-accent bg-clip-text text-transparent">
                Poin Reward
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Bergabunglah dengan komunitas peduli lingkungan. Setor sampah Anda, 
              dapatkan poin, dan tukarkan dengan reward menarik dari merchant partner kami.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" className="shadow-elegant hover:shadow-glow transition-all">
                  Mulai Sekarang
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                  <TrendingUp className="h-5 w-5" />
                  2K+
                </div>
                <p className="text-sm text-muted-foreground mt-1">Warga Aktif</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent font-bold text-2xl">
                  <Award className="h-5 w-5" />
                  150+
                </div>
                <p className="text-sm text-muted-foreground mt-1">Reward Tersedia</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-success font-bold text-2xl">
                  <Recycle className="h-5 w-5" />
                  50 Ton
                </div>
                <p className="text-sm text-muted-foreground mt-1">Sampah Terkumpul</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[600px]">
            <div className="relative h-full rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={heroImage}
                alt="Community recycling"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-glow border border-border max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Poin Anda</p>
                  <p className="text-2xl font-bold text-primary">1,250 Poin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
