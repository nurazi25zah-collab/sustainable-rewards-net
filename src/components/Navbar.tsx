import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ecoreward-logo-new.png";

export const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed w-full top-0 z-50 border-b border-border/20 bg-background/60 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="EcoReward" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              EcoReward
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>Beranda</Button>
            <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Tentang</Button>
            <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Fitur</Button>
            <Button variant="default" className="shadow-elegant ml-4" onClick={() => navigate("/auth")}>
              Masuk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
