import { useState, FormEvent } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, Eye, EyeOff, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "✓ Login Successful",
        description: "Welcome back to Sahi Aaushadi",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
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

        {/* Glassmorphic Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-300" />
                Secure access to your account
              </p>
            </div>

            {/* Benefit Microcopy */}
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-white font-medium flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <span>Protect yourself and your family from counterfeit medicines with verified, blockchain-secured authentication</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    required
                    disabled={isLoading}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border ${emailError ? 'border-red-400/50 focus:border-red-400' : 'border-white/30 focus:border-emerald-400'} rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
                  />
                  {emailError && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  )}
                </div>
                {emailError && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-300 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-white">
                    Password <span className="text-emerald-300">*</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-emerald-300 hover:text-emerald-200 font-bold transition"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    required
                    disabled={isLoading}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border ${passwordError ? 'border-red-400/50 focus:border-red-400' : 'border-white/30 focus:border-emerald-400'} rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:bg-white/15 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-200 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded p-1"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="mt-1.5 text-sm text-red-300 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-emerald-500 bg-white/10 border-white/30 rounded focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-50"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-white font-medium">
                  Remember me for 30 days
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
                    Logging in securely...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Log In Securely
                  </>
                )}
              </Button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-xs text-white/80 mb-3">
                <Lock className="w-4 h-4 text-emerald-300" />
                <span className="font-medium">Your data is encrypted and secure</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                <Link to="/privacy" className="hover:text-emerald-300 font-medium transition">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-emerald-300 font-medium transition">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/80 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-300 hover:text-emerald-200 font-bold transition">
                  Create Account
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

export default Login;
