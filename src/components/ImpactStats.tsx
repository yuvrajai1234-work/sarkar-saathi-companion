import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  end: number;
  suffix: string;
  label: string;
}

const Counter = ({ end, suffix, label }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
        {count}
        {suffix}
      </div>
      <div className="text-primary-foreground/80 text-sm mt-1">{label}</div>
    </div>
  );
};

const ImpactStats = () => {
  const stats = [
    { end: 700, suffix: "M+", label: "Potential Reach" },
    { end: 50, suffix: "+", label: "Government Schemes" },
    { end: 15, suffix: "+", label: "Languages Supported" },
    { end: 40, suffix: "%", label: "Fewer Rejections" },
  ];

  return (
    <section className="gradient-hero py-14 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <Counter key={i} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
