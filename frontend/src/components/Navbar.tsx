import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/verify", label: "Verify Medicine" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/regulator", label: "DDA View" },
  ];

  const isActive = (path: string) => location.pathname === path;

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
          <Link to="/verify">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-sm font-semibold">
              Verify Now
            </Button>
          </Link>
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
          <Link to="/verify" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white border-0 mt-2">
              Verify Now
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
