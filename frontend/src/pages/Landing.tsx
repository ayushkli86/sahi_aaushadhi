import { Link } from "react-router-dom";
import { Shield, QrCode, MapPin, Bell, CheckCircle2, ChevronRight, Award, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import "../styles/verify-animations.css";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white relative font-sans">
      {/* Dark Green Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #163A2C 0%, #1B4433 35%, #0F2A21 70%, #0B2019 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              {/* Hero Content */}
              <div className="text-center space-y-8 mb-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 text-sm font-bold text-white shadow-lg">
                  <Shield className="w-5 h-5" />
                  Blockchain-Powered Medicine Verification
                </div>
                
                {/* Main Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                  Authentic Medicine,<br />
                  <span className="text-emerald-200">Healthy Nepal</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium">
                  Protecting lives through blockchain verification. Every scan ensures your medicine is genuine, safe, and traceable.
                </p>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Verify Medicine Card */}
                <Link to="/verify" className="group">
                  <div className="bg-[#1a4434]/80 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 hover:border-emerald-500/70 hover:bg-[#1f5040]/80 transition-all duration-300 h-full shadow-xl">
                    <div className="flex flex-col items-start space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <QrCode className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Verify Medicine</h3>
                        <p className="text-emerald-100/80 text-sm font-medium leading-relaxed">
                          Scan QR code or enter product ID to verify authenticity instantly
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>Start Verification</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Find Pharmacy Card */}
                <div className="group cursor-pointer">
                  <div className="bg-[#1a4434]/80 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 hover:border-blue-500/70 hover:bg-[#1f5040]/80 transition-all duration-300 h-full shadow-xl">
                    <div className="flex flex-col items-start space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Find Pharmacy</h3>
                        <p className="text-emerald-100/80 text-sm font-medium leading-relaxed">
                          Locate verified pharmacies near you with authentic medicines
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm">
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Alerts Card */}
                <div className="group cursor-pointer">
                  <div className="bg-[#1a4434]/80 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 hover:border-red-500/70 hover:bg-[#1f5040]/80 transition-all duration-300 h-full shadow-xl">
                    <div className="flex flex-col items-start space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Bell className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Emergency Alerts</h3>
                        <p className="text-emerald-100/80 text-sm font-medium leading-relaxed">
                          Get instant alerts about counterfeit medicine recalls
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-red-300 font-semibold text-sm">
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals Section */}
        <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-emerald-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-[#1a4434]/60 backdrop-blur-md rounded-xl p-6 border border-emerald-700/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Shield className="w-6 h-6 text-emerald-300" />
                  </div>
                  <p className="text-white font-semibold text-sm">Blockchain Secured</p>
                </div>
                <div className="bg-[#1a4434]/60 backdrop-blur-md rounded-xl p-6 border border-emerald-700/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Award className="w-6 h-6 text-emerald-300" />
                  </div>
                  <p className="text-white font-semibold text-sm">DDA Approved</p>
                </div>
                <div className="bg-[#1a4434]/60 backdrop-blur-md rounded-xl p-6 border border-emerald-700/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                  </div>
                  <p className="text-white font-semibold text-sm">Real-time Tracking</p>
                </div>
                <div className="bg-[#1a4434]/60 backdrop-blur-md rounded-xl p-6 border border-emerald-700/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <AlertTriangle className="w-6 h-6 text-emerald-300" />
                  </div>
                  <p className="text-white font-semibold text-sm">Counterfeit Detection</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-black/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why It Matters</h2>
                <p className="text-emerald-100/80 text-lg font-medium">The counterfeit medicine crisis in Nepal</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 text-center shadow-xl">
                  <div className="text-5xl md:text-6xl font-black text-emerald-300 mb-3">1 in 10</div>
                  <p className="text-emerald-100/90 font-semibold leading-relaxed">Medicines falsified in low-income countries</p>
                </div>
                <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 text-center shadow-xl">
                  <div className="text-5xl md:text-6xl font-black text-emerald-300 mb-3">15%</div>
                  <p className="text-emerald-100/90 font-semibold leading-relaxed">Nepali market affected by substandard drugs</p>
                </div>
                <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-2xl p-8 border border-emerald-700/50 text-center shadow-xl">
                  <div className="text-5xl md:text-6xl font-black text-emerald-300 mb-3">100K+</div>
                  <p className="text-emerald-100/90 font-semibold leading-relaxed">Lives at risk from counterfeit medicine yearly</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with Official Seal */}
        <footer className="bg-[#0d1f18]/90 backdrop-blur-md py-12 border-t border-emerald-800/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              {/* Official DDA Nepal Seal */}
              <div className="bg-[#1a4434]/70 backdrop-blur-lg rounded-xl px-8 py-4 border border-emerald-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Official DDA Nepal</p>
                    <p className="text-emerald-200/80 text-sm font-medium">Department of Drug Administration</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-500/30">
                  <Shield className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-black text-xl text-white">Sahi Aaushadi</span>
              </div>
              
              <p className="text-sm text-emerald-200/60 text-center font-medium">
                © 2026 Sahi Aaushadi. Securing Nepal's pharmaceutical supply chain.
              </p>
              
              <div className="flex items-center gap-3 text-xs text-emerald-300/50 font-semibold">
                <span>Powered by Blockchain</span>
                <span>•</span>
                <span>DDA Code 2080 Compliant</span>
                <span>•</span>
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
