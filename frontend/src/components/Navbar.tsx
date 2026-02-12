import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const links = [
    { to: "/", label: "Home" },
    { to: "/verify", label: "Verify Medicine" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/regulator", label: "DDA View" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/login');
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const userName = user?.user_metadata?.name || user?.email || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">Sahi Aaushadi</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(l.to)
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="text-xs">🇳🇵</span>
            {language === 'en' ? 'English' : 'नेपाली'}
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{userName}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                isActive(l.to)
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-lg mt-2">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{userName}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleLogout}
            className="w-full gap-2 mt-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
