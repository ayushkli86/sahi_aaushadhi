import { Link } from "react-router-dom";
import { Shield, QrCode, Lock, BarChart3, CheckCircle2, ChevronRight, Blocks, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Every medicine strip has a unique encrypted QR code. Scan to verify authenticity instantly.",
  },
  {
    icon: Blocks,
    title: "Blockchain Ledger",
    desc: "Immutable, tamper-proof records stored on a decentralized blockchain network.",
  },
  {
    icon: Lock,
    title: "AES-256 Encryption",
    desc: "Industry-standard encryption protects all data across the supply chain.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Track scanning patterns and detect counterfeit anomalies across regions.",
  },
];

const stats = [
  { value: "1 in 10", label: "Medicines falsified in low-income countries" },
  { value: "15%", label: "Nepali market affected by substandard drugs" },
  { value: "100K+", label: "Lives at risk from counterfeit medicine yearly" },
];

const trustSignals = [
  { icon: Shield, text: "Backed by Blockchain" },
  { icon: Award, text: "Integrated with DDA Nepal" },
  { icon: TrendingUp, text: "Real-time Verification" },
  { icon: Users, text: "Public Transparency" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(135deg, #163A2C 0%, #1B4433 35%, #0F2A21 70%, #0B2019 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white">
                  <Shield className="w-4 h-4" />
                  Blockchain-Powered Verification
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Protecting Nepal's<br />
                    <span className="text-teal-300">Medicine Supply Chain</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                    Eliminating counterfeit medicines with blockchain verification. 
                    Ensuring every medicine you take is authentic, safe, and traceable.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/verify">
                    <Button 
                      size="lg" 
                      className="bg-white hover:bg-white/90 text-teal-900 shadow-lg border-0 text-base px-8 h-14 rounded-xl font-semibold"
                    >
                      <QrCode className="w-5 h-5 mr-2" />
                      Verify Medicine Now
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-xl font-semibold backdrop-blur-sm"
                    >
                      Partner Login
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  {trustSignals.map((signal, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <signal.icon className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="font-medium">{signal.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Illustration/Visual */}
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Medicine Verification</p>
                        <p className="text-xs text-slate-500">Scan QR Code</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Blockchain Verified</p>
                          <p className="text-xs text-slate-500">Authentic Medicine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">DDA Registered</p>
                          <p className="text-xs text-slate-500">Code 2080 Compliant</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Real-time Tracking</p>
                          <p className="text-xs text-slate-500">Supply Chain Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-teal-300">{s.value}</div>
                  <p className="text-white/70 text-sm leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-white/70 text-lg">
                Our multi-layer security framework ensures complete transparency from manufacturer to patient.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                    <f.icon className="w-7 h-7 text-teal-300" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                  <Shield className="w-8 h-8 text-teal-300" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DDA Code 2080 Compliant</h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Fully aligned with Nepal's Department of Drug Administration regulations for pharmaceutical tracking and verification.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["AES-256 Encryption", "Immutable Ledger", "OAuth 2.0 Auth", "API Rate Limiting"].map((tag) => (
                  <div key={tag} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm py-12 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-300" />
                </div>
                <span className="font-bold text-xl text-white">Sahi Aaushadi</span>
              </div>
              <p className="text-sm text-white/60 text-center">
                © 2026 Sahi Aaushadi. Securing Nepal's pharmaceutical supply chain.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span>Powered by Blockchain</span>
                <span>•</span>
                <span>DDA Approved</span>
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
