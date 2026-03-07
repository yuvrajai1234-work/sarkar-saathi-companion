import React, { createContext, useContext, useState } from "react";
import { Language, t } from "@/data/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  tr: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  tr: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const tr = (key: string) => t[key]?.[lang] ?? t[key]?.["en"] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
