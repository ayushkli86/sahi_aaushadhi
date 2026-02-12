import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Menu, X, LogOut, User, Wallet, Plus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { walletService } from "@/services/wallet.service";
import AddFundsModal from "@/components/AddFundsModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import "../styles/verify-animations.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  // Fetch wallet balance
  useEffect(() => {
    if (user?.id) {
      loadWalletBalance();
    }
  }, [user]);

  const loadWalletBalance = async () => {
    if (!user?.id) return;
    const wallet = await walletService.getWallet(user.id);
    if (wallet) {
      setWalletBalance(wallet.balance);
    }
  };

  const handleAddFundsSuccess = () => {
    loadWalletBalance();
    toast({
      title: "Funds Added",
      description: "Your wallet has been updated successfully",
    });
  };

  const handleSubscriptionSuccess = () => {
    toast({
      title: "Subscription Activated",
      description: "Your subscription has been activated successfully",
    });
  };

  // Debug log
  console.log('Navbar render - showSubscription:', showSubscription, 'user:', user?.id);

  const links = [
    { to: "/", label: t('nav.home') },
    { to: "/verify", label: t('nav.verify') },
    { to: "/dashboard", label: t('nav.dashboard') },
    { to: "/regulator", label: t('nav.dda') },
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
      setProfileOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const userName = user?.user_metadata?.name || user?.email || "User";
  const userEmail = user?.email || "user@example.com";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a4434]/90 backdrop-blur-md border-b border-emerald-700/30 shadow-lg">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">Sahi Aaushadi</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive(l.to)
                  ? "bg-white text-slate-700 shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1a4434]/70 backdrop-blur-lg rounded-lg border border-emerald-700/50 hover:bg-[#1f5040]/80 transition-all"
            >
              <User className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium text-white">{userName}</span>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setProfileOpen(false)}
                />
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-72 bg-[#1a4434]/95 backdrop-blur-xl rounded-xl border border-emerald-700/50 shadow-2xl z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-4 border-b border-emerald-700/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{userName}</p>
                        <p className="text-xs text-emerald-200/70 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-4 space-y-3">
                    {/* Wallet Balance */}
                    <div className="bg-emerald-900/30 border border-emerald-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-300" />
                          <span className="text-xs text-emerald-200/70">{t('nav.wallet')}</span>
                        </div>
                        <button
                          onClick={() => {
                            setShowAddFunds(true);
                            setProfileOpen(false);
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-md text-xs font-semibold transition"
                        >
                          <Plus className="w-3 h-3" />
                          {t('nav.addFunds')}
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        NPR {walletBalance.toFixed(2)}
                      </div>
                      <div className="text-xs text-emerald-200/60 mt-1">
                        NPR 0.10 {t('nav.perScan')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-200/70">{t('nav.accountStatus')}</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30 font-medium">{t('nav.active')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-200/70">{t('nav.role')}</span>
                      <span className="text-white font-medium">{t('nav.user')}</span>
                    </div>
                  </div>

                  {/* Subscription Button */}
                  <div className="px-4 pb-3">
                    <button
                      onClick={() => {
                        console.log('Upgrade Plan clicked, opening subscription modal');
                        setShowSubscription(true);
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg transition-all font-semibold text-sm shadow-lg"
                    >
                      <Crown className="w-4 h-4" />
                      {t('nav.upgradePlan')}
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="px-4 pb-3 border-t border-emerald-700/30 pt-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all font-semibold text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Language Toggle - Top Right */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="px-4 py-2 text-sm font-semibold bg-[#1a4434]/70 backdrop-blur-lg text-white rounded-lg border border-emerald-700/50 hover:bg-[#1f5040]/80 transition-all flex items-center gap-2 shadow-md"
          >
            <span className="text-base">🇳🇵</span>
            {language === 'en' ? 'नेपाली' : 'English'}
          </button>
        </div>

        <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1a4434]/95 backdrop-blur-md border-b border-emerald-700/30 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-5 py-2.5 rounded-full text-sm font-semibold ${
                isActive(l.to)
                  ? "bg-white text-slate-700"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          {/* Profile Section - Mobile */}
          <div className="mt-3 p-4 bg-[#1a4434]/70 backdrop-blur-lg rounded-xl border border-emerald-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-emerald-200/70 truncate">{userEmail}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200/70">{t('nav.status')}</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30 font-medium">{t('nav.active')}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>
          
          {/* Language Toggle - Mobile */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="w-full px-4 py-2.5 text-sm font-semibold bg-[#1a4434]/70 backdrop-blur-lg text-white rounded-lg border border-emerald-700/50 flex items-center justify-center gap-2 mt-2"
          >
            <span className="text-base">🇳🇵</span>
            {language === 'en' ? 'नेपाली' : 'English'}
          </button>
        </div>
      )}
      
      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        userId={user?.id || ''}
        currentBalance={walletBalance}
        onSuccess={handleAddFundsSuccess}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        userId={user?.id || ''}
        onSuccess={handleSubscriptionSuccess}
      />
      
      {/* Debug: Show modal state */}
      {showSubscription && (
        <div className="fixed top-20 right-4 bg-yellow-500 text-black p-2 rounded z-[200] text-xs">
          Modal should be visible! showSubscription={String(showSubscription)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
