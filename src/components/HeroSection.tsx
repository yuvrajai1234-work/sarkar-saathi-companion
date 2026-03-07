import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mic, WifiOff, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { tr } = useLanguage();

  const features = [
    { icon: Mic, label: tr("voiceFirst") },
    { icon: WifiOff, label: tr("worksOffline") },
    { icon: FileCheck, label: tr("schemesCount") },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container relative py-16 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-light text-accent-foreground text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered • Multilingual • Free
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            Sarkar <span className="text-gradient-hero">Saathi</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            {tr("tagline")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/assistant"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-saffron text-primary-foreground font-semibold text-lg shadow-elevated hover:opacity-90 transition-opacity"
            >
              <Phone className="h-5 w-5" />
              {tr("callNow")}
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              {tr("exploreSchemes")}
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
