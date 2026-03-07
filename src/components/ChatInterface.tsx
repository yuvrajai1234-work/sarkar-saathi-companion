import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";
import { schemes } from "@/data/schemes";
import LanguageSelector from "./LanguageSelector";
import { Send, Bot, User, MessageCircle, CheckCircle2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  from: "bot" | "user";
  text: string;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-primary"
        style={{
          animation: `typing-dot 1.2s ${i * 0.2}s infinite`,
        }}
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

  // Step 0: Welcome
  useEffect(() => {
    const greeting = isHi
      ? "🙏 नमस्ते! सरकार साथी में आपका स्वागत है। मैं आपकी सरकारी योजनाओं में मदद करूंगा।"
      : "🙏 Namaste! Welcome to Sarkar Saathi. I'll help you find and apply for government schemes.";
    addBotMsg(greeting);
    setTimeout(() => {
      setStep(1);
      const q = isHi
        ? "आपको किस योजना में मदद चाहिए? नीचे से चुनें या टाइप करें।"
        : "Which scheme do you need help with? Pick one below or type to search.";
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
          ? `${scheme.nameHi} के लिए पात्रता जाँचने हेतु कुछ जानकारी दें:`
          : `To check eligibility for ${scheme.name}, I need some details:`
      );
    }, 500);
  };

  const handleFormSubmit = () => {
    const scheme = schemes.find((s) => s.id === selectedScheme);
    if (!scheme) return;

    addUserMsg(
      isHi
        ? `आय: ₹${form.income}, भूमि: ${form.land} हेक्टेयर, आधार: ${form.aadhaar ? "हाँ" : "नहीं"}`
        : `Income: ₹${form.income}, Land: ${form.land} ha, Aadhaar: ${form.aadhaar ? "Yes" : "No"}`
    );

    setStep(3);

    // Eligibility logic
    const income = parseInt(form.income) || 0;
    const land = parseFloat(form.land) || 0;
    const hasAadhaar = form.aadhaar.length >= 4;

    let eligible = true;
    const reasons: string[] = [];

    if (scheme.maxIncome && income > scheme.maxIncome) {
      eligible = false;
      reasons.push(isHi ? `आय सीमा ₹${scheme.maxIncome} से अधिक` : `Income exceeds ₹${scheme.maxIncome} limit`);
    }
    if (scheme.maxLand && land > scheme.maxLand) {
      eligible = false;
      reasons.push(isHi ? `भूमि सीमा ${scheme.maxLand} हेक्टेयर से अधिक` : `Land exceeds ${scheme.maxLand} ha limit`);
    }
    if (scheme.requiresAadhaar && !hasAadhaar) {
      eligible = false;
      reasons.push(isHi ? "आधार नंबर आवश्यक है" : "Aadhaar number is required");
    }

    setTimeout(() => {
      if (eligible) {
        addBotMsg(
          isHi
            ? `✅ बधाई! आप ${scheme.nameHi} के लिए पात्र हैं!\n\n📋 आवश्यक दस्तावेज़:\n• आधार कार्ड\n• बैंक पासबुक\n• भूमि प्रमाण पत्र\n• आय प्रमाण पत्र\n\n🔗 आवेदन करने के लिए नजदीकी CSC केंद्र पर जाएँ।`
            : `✅ Congratulations! You are eligible for ${scheme.name}!\n\n📋 Documents needed:\n• Aadhaar Card\n• Bank Passbook\n• Land Certificate\n• Income Certificate\n\n🔗 Visit your nearest CSC center to apply.`
        );
        setTimeout(() => setShowSmsPopup(true), 2000);
      } else {
        addBotMsg(
          isHi
            ? `❌ माफ़ कीजिए, आप इस योजना के लिए पात्र नहीं हैं।\nकारण: ${reasons.join(", ")}\n\nमैं आपके लिए अन्य योजनाएँ खोज सकता हूँ।`
            : `❌ Sorry, you may not be eligible for this scheme.\nReasons: ${reasons.join(", ")}\n\nI can search for other schemes for you.`
        );
      }
    }, 1000);
  };

  const suggestedSchemes = preSelectedScheme
    ? schemes.filter((s) => s.id === preSelectedScheme)
    : schemes.slice(0, 5);

  return (
    <div className="container max-w-2xl py-6">
      <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col" style={{ height: "75vh" }}>
        {/* Header */}
        <div className="gradient-saffron px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-primary-foreground">Sarkar Saathi</h3>
            <p className="text-xs text-primary-foreground/80">{tr("assistant")}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="mb-4">
            <LanguageSelector />
          </div>

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Scheme suggestions (step 1) */}
          {step === 1 && !typing && messages.length >= 2 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedSchemes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSchemeSelect(s.id)}
                  className="px-3 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
                >
                  {isHi ? s.nameHi : s.name}
                </button>
              ))}
            </div>
          )}

          {/* Eligibility form (step 2) */}
          {step === 2 && !typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent rounded-2xl p-4 space-y-3"
            >
              <div>
                <label className="text-sm font-medium text-foreground">{isHi ? "वार्षिक आय (₹)" : "Annual Income (₹)"}</label>
                <input
                  type="number"
                  value={form.income}
                  onChange={(e) => setForm({ ...form, income: e.target.value })}
                  placeholder="150000"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{isHi ? "भूमि (हेक्टेयर)" : "Land Size (Hectares)"}</label>
                <input
                  type="number"
                  value={form.land}
                  onChange={(e) => setForm({ ...form, land: e.target.value })}
                  placeholder="1.5"
                  step="0.1"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{isHi ? "आधार नंबर (अंतिम 4 अंक)" : "Aadhaar (last 4 digits)"}</label>
                <input
                  type="text"
                  maxLength={4}
                  value={form.aadhaar}
                  onChange={(e) => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, "") })}
                  placeholder="1234"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{isHi ? "बैंक खाता (हाँ/नहीं)" : "Bank Account (Yes/No)"}</label>
                <select
                  value={form.bank}
                  onChange={(e) => setForm({ ...form, bank: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{isHi ? "चुनें" : "Select"}</option>
                  <option value="yes">{isHi ? "हाँ" : "Yes"}</option>
                  <option value="no">{isHi ? "नहीं" : "No"}</option>
                </select>
              </div>
              <button
                onClick={handleFormSubmit}
                disabled={!form.income || !form.aadhaar}
                className="w-full py-3 rounded-xl gradient-saffron text-primary-foreground font-semibold text-base disabled:opacity-50 transition-opacity"
              >
                {tr("checkEligibility")}
              </button>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* SMS Popup */}
      <AnimatePresence>
        {showSmsPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-80 bg-card rounded-2xl shadow-elevated border border-border p-5 z-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-secondary" />
              <span className="font-bold text-foreground text-sm">SMS Notification</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {isHi
                ? "आपकी पात्रता रिपोर्ट SMS द्वारा भेज दी गई है। आवेदन संख्या: SS-2024-78432"
                : "Your eligibility report has been sent via SMS. Application ID: SS-2024-78432"}
            </p>
            <button
              onClick={() => setShowSmsPopup(false)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {isHi ? "बंद करें" : "Dismiss"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
