import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";

const Index = () => {
  const { tr } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorks />
      <ImpactStats />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[hsl(220_20%_5%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(28_100%_54%/0.03)] to-transparent" />
        </div>
        <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-3xl border border-[hsl(28_100%_54%/0.2)] p-10 md:p-14 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-60 rounded-full bg-[hsl(28_100%_54%/0.08)] blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[hsl(28_100%_54%/0.3)] text-xs text-[hsl(28,100%,70%)] mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Free to use, always
              </div>

              <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-white mb-4 relative">
                Ready to <span className="text-gradient-brand">claim your benefits?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-base relative">
                Millions of Indians miss out on government benefits every year. Don't be one of them.
              </p>
              <div className="flex gap-4 justify-center flex-wrap relative">
                <a
                  href="https://wa.link/nk6p7f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold shadow-brand hover:shadow-[0_0_60px_hsl(28_100%_54%/0.5)] hover:scale-[1.02] transition-all duration-300"
                >
                  <MessageSquare className="h-5 w-5" />
                  {tr("messageNow")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/schemes"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl glass border border-glass text-foreground font-semibold hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  Browse Schemes
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass py-10">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm font-['Space_Grotesk']">स</span>
              </div>
              <div>
                <p className="font-['Space_Grotesk'] font-bold text-white text-sm">Sarkar Saathi</p>
                <p className="text-xs text-muted-foreground">Your AI Companion for Government Schemes</p>
              </div>
            </div>
            <div className="tricolor-stripe w-32 md:w-48 rounded-full" />
            <p className="text-xs text-muted-foreground">
              © 2025 Sarkar Saathi. Made with ❤️ for India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
