import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Bot, Eye, EyeOff, Sparkles, ArrowRight, Shield, Globe2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AuthPage = () => {
  const { tr } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              mobile_number: form.mobileNumber,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created! 🎉",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: Shield, text: "Secure & private" },
    { icon: Globe2, text: "Multilingual AI" },
    { icon: Zap, text: "Instant results" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(28_100%_54%/0.06)] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(150_55%_38%/0.06)] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(210 20% 96%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 20% 96%) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo + Tagline */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
              className="relative inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto shadow-brand">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl gradient-brand opacity-20 blur-md -z-10" />
            </motion.div>
            <h1 className="font-['Space_Grotesk'] font-bold text-3xl text-white mb-1">
              Sarkar <span className="text-gradient-brand">Saathi</span>
            </h1>
            <p className="text-muted-foreground text-sm">{tr("tagline")}</p>

            {/* Feature highlights */}
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <h.icon className="h-3.5 w-3.5 text-[hsl(28,100%,64%)]" />
                  {h.text}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Card */}
          <div className="glass-card rounded-3xl border border-glass p-7 shadow-elevated">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 glass rounded-xl mb-6 border border-glass">
              {["Sign In", "Create Account"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setIsSignUp(i === 1)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isSignUp === (i === 1)
                      ? "gradient-brand text-white shadow-brand"
                      : "text-muted-foreground hover:text-white"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Ramesh Kumar"
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Mobile (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value.replace(/[^\d+]/g, "") })}
                      placeholder="+91 98765 43210"
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-brand hover:shadow-[0_0_40px_hsl(28_100%_54%/0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <span className="text-[hsl(28,100%,64%)] hover:underline cursor-pointer">Terms</span> &{" "}
            <span className="text-[hsl(28,100%,64%)] hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
