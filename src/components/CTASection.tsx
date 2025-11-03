import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-card/60 backdrop-blur-xl p-12 rounded-3xl border border-border/30 shadow-elegant">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Bergabung Sekarang</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Siap Berkontribusi untuk{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Lingkungan yang Lebih Baik?
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Daftar gratis sekarang dan mulai perjalanan Anda menuju gaya hidup yang lebih 
            ramah lingkungan sambil mendapatkan reward menarik.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-elegant hover:shadow-glow transition-all bg-gradient-to-r from-primary to-primary-glow" onClick={() => navigate("/auth")}>
              Daftar Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-card/60 backdrop-blur-xl border-border/30" onClick={() => window.location.href = 'mailto:contact@ecoreward.com'}>
              Hubungi Kami
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-6">Dipercaya oleh merchant partner</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-3 bg-muted/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-border/20">
                  <span className="text-xs font-semibold">Partner {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
