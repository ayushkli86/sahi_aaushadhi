import { useState, FormEvent } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast({
        title: "Account Created!",
        description: "Welcome to Sahi Aaushadi",
      });
      // Automatically redirect to home after successful signup
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 25%, #065f46 50%, #064e3b 75%, #022c22 100%)'
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Brand Header with Security Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Sahi Aaushadi</h1>
          <p className="text-emerald-100 text-sm font-medium">Authentic Medicine Verification System</p>
        </div>

        {/* Glassmorphic Signup Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-300" />
                Join Sahi Aaushadi to verify medicines
              </p>
            </div>

            {/* Benefit Microcopy */}
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-white font-medium flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <span>Join thousands protecting their families from counterfeit medicines</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Full Name <span className="text-emerald-300">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 focus:border-emerald-400 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address <span className="text-emerald-300">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 focus:border-emerald-400 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password <span className="text-emerald-300">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/30 focus:border-emerald-400 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-200 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      <div className={`h-1 flex-1 rounded-full transition ${password.length >= 6 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      <div className={`h-1 flex-1 rounded-full transition ${password.length >= 8 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      <div className={`h-1 flex-1 rounded-full transition ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    </div>
                    <p className="text-xs text-white/70 font-medium">
                      {password.length < 6 ? 'Weak password' : password.length < 8 ? 'Good password' : 'Strong password'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password <span className="text-emerald-300">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/30 focus:border-emerald-400 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-200 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  disabled={isLoading}
                  className="w-4 h-4 mt-0.5 text-emerald-500 bg-white/10 border-white/30 rounded focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-50"
                />
                <label htmlFor="terms" className="text-xs text-white/80 font-medium">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-300 hover:text-emerald-200 font-bold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-emerald-300 hover:text-emerald-200 font-bold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-base transition shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-xs text-white/80">
                <Lock className="w-4 h-4 text-emerald-300" />
                <span className="font-medium">Your data is encrypted and secure</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/80 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-bold transition">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* DDA Compliance Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <Shield className="w-4 h-4 text-emerald-300" />
            <span className="text-xs text-white font-bold">DDA Nepal Approved System</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
