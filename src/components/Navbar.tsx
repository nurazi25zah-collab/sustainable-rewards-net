import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ecoreward-logo.png";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="EcoReward" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              EcoReward
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link to="/tentang" className="text-foreground hover:text-primary transition-colors">
              Tentang
            </Link>
            <Link to="/edukasi" className="text-foreground hover:text-primary transition-colors">
              Edukasi
            </Link>
            <Link to="/reward" className="text-foreground hover:text-primary transition-colors">
              Reward
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline">Masuk</Button>
            </Link>
            <Link to="/auth">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
