import { useLanguage } from "@/contexts/LanguageContext";
import { languageNames, Language } from "@/data/translations";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      {(Object.keys(languageNames) as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${lang === l
              ? "gradient-brand text-white shadow-brand shadow-sm"
              : "glass border border-glass text-muted-foreground hover:text-white hover:border-white/20"
            }`}
        >
          {languageNames[l]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
