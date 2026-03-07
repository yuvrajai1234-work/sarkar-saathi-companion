import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { schemes, categories } from "@/data/schemes";
import { Search, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SchemeCard = ({ scheme }: { scheme: typeof schemes[0] }) => {
  const { lang, tr } = useLanguage();
  const isHi = lang === "hi";
  const IconComp = (Icons as any)[scheme.icon] || Icons.FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-shadow border border-border"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-saffron-light flex items-center justify-center shrink-0">
          <IconComp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">{isHi ? scheme.nameHi : scheme.name}</h3>
          <p className="text-xs text-muted-foreground">{isHi ? scheme.ministryHi : scheme.ministry}</p>
        </div>
      </div>

      <div className="bg-green-light rounded-lg px-3 py-2 mb-3">
        <p className="text-sm font-semibold text-green-dark">{isHi ? scheme.benefitHi : scheme.benefit}</p>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{isHi ? scheme.eligibilityHi : scheme.eligibility}</p>

      <Link
        to={`/assistant?scheme=${scheme.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {tr("checkEligibility")}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
};

const SchemeExplorer = () => {
  const { tr } = useLanguage();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");

  const filtered = schemes.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameHi.includes(search);
    const matchCat = !cat || s.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-8 md:py-12">
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">{tr("schemes")}</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={tr("searchSchemes")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCat("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tr("allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c === cat ? "" : c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No schemes found.</p>
      )}
    </div>
  );
};

export default SchemeExplorer;
