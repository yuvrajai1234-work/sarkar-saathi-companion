import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";
import { schemes } from "@/data/schemes";
import LanguageSelector from "./LanguageSelector";
import { Send, Bot, User, MessageCircle, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  from: "bot" | "user";
  text: string;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-[hsl(28,100%,64%)]"
        style={{ animation: `typing-dot 1.2s ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
);

const ChatInterface = () => {
  const { lang, tr } = useLanguage();
  const [searchParams] = useSearchParams();
  const preSelectedScheme = searchParams.get("scheme");
  const isHi = lang === "hi";

  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [showSmsPopup, setShowSmsPopup] = useState(false);
  const [form, setForm] = useState({ income: "", land: "", aadhaar: "", bank: "" });
  const [selectedScheme, setSelectedScheme] = useState(preSelectedScheme || "");
  const [inputVal, setInputVal] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const addBotMsg = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text }]);
      setTyping(false);
    }, 1200);
  };

  const addUserMsg = (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const greeting = isHi
      ? "🙏 नमस्ते! सरकार साथी में आपका स्वागत है।"
      : "🙏 Namaste! Welcome to Sarkar Saathi.";
    addBotMsg(greeting);
    setTimeout(() => {
      setStep(1);
      const q = isHi
        ? "आपको किस योजना में मदद चाहिए? नीचे से चुनें।"
        : "Which scheme do you need help with? Pick one below.";
      addBotMsg(q);
    }, 2000);
  }, []);

  const handleSchemeSelect = (id: string) => {
    const scheme = schemes.find((s) => s.id === id);
    if (!scheme) return;
    setSelectedScheme(id);
    addUserMsg(isHi ? scheme.nameHi : scheme.name);
    setStep(2);
    setTimeout(() => {
      addBotMsg(
        isHi
          ? `${scheme.nameHi} के लिए पात्रता जाँचने के लिए कुछ जानकारी दें:`
          : `To check eligibility for ${scheme.name}, I need a few details:`
      );
    }, 500);
  };

  const handleFormSubmit = () => {
    const scheme = schemes.find((s) => s.id === selectedScheme);
    if (!scheme) return;

    addUserMsg(
      isHi
        ? `आय: ₹${form.income}, भूमि: ${form.land} हेक्टेयर`
        : `Income: ₹${form.income}, Land: ${form.land} ha`
    );
    setStep(3);

    const income = parseInt(form.income) || 0;
    const land = parseFloat(form.land) || 0;
    const hasAadhaar = form.aadhaar.length >= 4;

    let eligible = true;
    const reasons: string[] = [];

    if (scheme.maxIncome && income > scheme.maxIncome) {
      eligible = false;
      reasons.push(isHi ? `आय सीमा ₹${scheme.maxIncome} से अधिक` : `Income exceeds ₹${scheme.maxIncome}`);
    }
    if (scheme.maxLand && land > scheme.maxLand) {
      eligible = false;
      reasons.push(isHi ? `भूमि ${scheme.maxLand} हेक्टेयर से अधिक` : `Land exceeds ${scheme.maxLand} ha`);
    }
    if (scheme.requiresAadhaar && !hasAadhaar) {
      eligible = false;
      reasons.push(isHi ? "आधार नंबर आवश्यक है" : "Aadhaar number is required");
    }

    setTimeout(() => {
      if (eligible) {
        addBotMsg(
          isHi
            ? `✅ बधाई! आप ${scheme.nameHi} के लिए पात्र हैं!\n\n📋 आवश्यक दस्तावेज़:\n• आधार कार्ड\n• बैंक पासबुक\n• भूमि प्रमाण पत्र\n\n🏢 निकटतम CSC केंद्र पर जाएँ।`
            : `✅ Congratulations! You are eligible for ${scheme.name}!\n\n📋 Documents needed:\n• Aadhaar Card\n• Bank Passbook\n• Land Certificate\n\n🏢 Visit your nearest CSC center to apply.`
        );
        setTimeout(() => setShowSmsPopup(true), 2000);
      } else {
        addBotMsg(
          isHi
            ? `❌ माफ़ कीजिए, आप पात्र नहीं हैं।\nकारण: ${reasons.join(", ")}\n\nमैं अन्य योजनाएँ सुझा सकता हूँ।`
            : `❌ Sorry, you may not be eligible.\nReasons: ${reasons.join(", ")}\n\nI can suggest other schemes.`
        );
      }
    }, 1000);
  };

  const suggestedSchemes = preSelectedScheme
    ? schemes.filter((s) => s.id === preSelectedScheme)
    : schemes.slice(0, 6);

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-5 rounded-full gradient-brand" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">AI Assistant</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">Sarkar Saathi</h2>
            </div>
            <LanguageSelector />
          </div>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl border border-glass overflow-hidden flex flex-col shadow-elevated"
          style={{ height: "72vh" }}
        >
          {/* Window header */}
          <div className="gradient-brand px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Space_Grotesk'] font-bold text-white text-sm">Sarkar Saathi Bot</h3>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Online · AI Powered
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {["bg-red-400", "bg-amber-400", "bg-emerald-400"].map((c, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-2.5 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shrink-0 mt-0.5 shadow-brand">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${msg.from === "user"
                        ? "gradient-brand text-white rounded-br-sm shadow-brand"
                        : "glass border border-glass text-foreground rounded-bl-sm"
                      }`}
                  >
                    {msg.text}
                  </div>
                  {msg.from === "user" && (
                    <div className="w-8 h-8 rounded-full glass border border-glass flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shrink-0 shadow-brand">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="glass border border-glass rounded-2xl rounded-bl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Scheme selection chips */}
            {step === 1 && !typing && messages.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mt-2 pl-10"
              >
                {suggestedSchemes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSchemeSelect(s.id)}
                    className="px-3 py-2 rounded-xl glass border border-glass text-sm font-medium text-foreground hover:border-[hsl(28_100%_54%/0.4)] hover:text-white hover:bg-[hsl(28_100%_54%/0.1)] transition-all duration-200"
                  >
                    {isHi ? s.nameHi : s.name}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Eligibility form */}
            {step === 2 && !typing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-10 glass-card rounded-2xl border border-glass p-4 space-y-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-[hsl(28,100%,64%)]" />
                  <span className="text-sm font-semibold text-white">
                    {isHi ? "पात्रता जानकारी" : "Eligibility Details"}
                  </span>
                </div>

                {[
                  { key: "income", label: isHi ? "वार्षिक आय (₹)" : "Annual Income (₹)", placeholder: "150000", type: "number" },
                  { key: "land", label: isHi ? "भूमि (हेक्टेयर)" : "Land Size (Hectares)", placeholder: "1.5", type: "number" },
                  { key: "aadhaar", label: isHi ? "आधार (अंतिम 4 अंक)" : "Aadhaar (last 4 digits)", placeholder: "1234", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      maxLength={field.key === "aadhaar" ? 4 : undefined}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]:
                            field.key === "aadhaar"
                              ? e.target.value.replace(/\D/g, "")
                              : e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    {isHi ? "बैंक खाता" : "Bank Account"}
                  </label>
                  <select
                    value={form.bank}
                    onChange={(e) => setForm({ ...form, bank: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-[hsl(220_20%_8%)] border border-glass text-white text-sm focus:outline-none focus:border-[hsl(28_100%_54%/0.5)] transition-all appearance-none"
                  >
                    <option value="">{isHi ? "चुनें" : "Select"}</option>
                    <option value="yes">{isHi ? "हाँ" : "Yes"}</option>
                    <option value="no">{isHi ? "नहीं" : "No"}</option>
                  </select>
                </div>

                <button
                  onClick={handleFormSubmit}
                  disabled={!form.income || !form.aadhaar}
                  className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-brand disabled:opacity-40 hover:shadow-[0_0_40px_hsl(28_100%_54%/0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {tr("checkEligibility")}
                </button>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </motion.div>

        {/* SMS Popup */}
        <AnimatePresence>
          {showSmsPopup && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="fixed bottom-6 right-6 w-80 glass-card rounded-3xl border border-emerald-500/30 p-5 shadow-elevated z-50"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-400 h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">SMS Sent!</span>
                    <p className="text-xs text-emerald-400">Eligibility Report</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSmsPopup(false)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isHi
                  ? "आपकी पात्रता रिपोर्ट SMS द्वारा भेजी गई। आवेदन ID: SS-2024-78432"
                  : "Your eligibility report was sent via SMS. Application ID: SS-2024-78432"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatInterface;
