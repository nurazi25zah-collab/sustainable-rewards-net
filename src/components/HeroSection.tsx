import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import patternBg from "@/assets/pattern-bg.png";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url(${patternBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/30 shadow-elegant">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Platform Pengelolaan Sampah Terpadu</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Ubah Sampah Jadi{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Poin Reward
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Bergabunglah dengan komunitas peduli lingkungan. Setor sampah Anda, 
              dapatkan poin, dan tukarkan dengan reward menarik dari merchant partner kami.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="shadow-elegant hover:shadow-glow transition-all bg-gradient-to-r from-primary to-primary-glow" onClick={() => navigate("/auth")}>
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-card/60 backdrop-blur-xl border-border/30" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats with Glassmorphism */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20 shadow-elegant">
                <div className="text-3xl font-bold text-primary mb-1">2,145+</div>
                <div className="text-sm text-muted-foreground">Warga Aktif</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20 shadow-elegant">
                <div className="text-3xl font-bold text-accent mb-1">15K+</div>
                <div className="text-sm text-muted-foreground">Setoran</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20 shadow-elegant">
                <div className="text-3xl font-bold text-success mb-1">1.2M</div>
                <div className="text-sm text-muted-foreground">Poin Ditukar</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with Glassmorphism */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20">
              <img 
                src={heroImage} 
                alt="EcoReward Platform" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Badge with Glassmorphism */}
            <div className="absolute -bottom-6 -left-6 bg-card/70 backdrop-blur-xl p-6 rounded-2xl shadow-elegant border border-border/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <Award className="h-8 w-8 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">87</div>
                  <div className="text-sm text-muted-foreground">Reward Aktif</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
