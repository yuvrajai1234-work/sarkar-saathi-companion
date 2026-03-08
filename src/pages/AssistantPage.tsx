import ChatInterface from "@/components/ChatInterface";
import { useLanguage } from "@/contexts/LanguageContext";

const AssistantPage = () => {
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <ChatInterface key={lang} />
    </div>
  );
};

export default AssistantPage;
