import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Brain, CheckCircle, HandHelping } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const { tr } = useLanguage();

  const steps = [
    { icon: Phone, title: tr("connect"), desc: tr("connectDesc"), color: "bg-primary" },
    { icon: Brain, title: tr("understand"), desc: tr("understandDesc"), color: "bg-secondary" },
    { icon: CheckCircle, title: tr("checkElig"), desc: tr("checkEligDesc"), color: "bg-primary" },
    { icon: HandHelping, title: tr("getGuided"), desc: tr("getGuidedDesc"), color: "bg-secondary" },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          {tr("howItWorks")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card rounded-2xl p-6 shadow-card text-center"
            >
              <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <div className={`w-14 h-14 rounded-xl ${step.color} mx-auto mb-4 flex items-center justify-center`}>
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
