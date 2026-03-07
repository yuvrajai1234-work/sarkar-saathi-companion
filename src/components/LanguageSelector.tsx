import { useLanguage } from "@/contexts/LanguageContext";
import { languageNames, Language } from "@/data/translations";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Globe className="h-4 w-4 text-muted-foreground" />
      {(Object.keys(languageNames) as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all ${
            lang === l
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          {languageNames[l]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
