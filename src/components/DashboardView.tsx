import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, Clock, AlertTriangle, MessageSquare, FileText } from "lucide-react";
import { motion } from "framer-motion";

const mockApplications = [
  { id: "SS-2024-78432", scheme: "PM-KISAN", schemeHi: "पीएम-किसान", status: "approved", date: "2024-12-15" },
  { id: "SS-2024-78455", scheme: "Ayushman Bharat", schemeHi: "आयुष्मान भारत", status: "pending", date: "2024-12-20" },
  { id: "SS-2024-78490", scheme: "PM Awas Yojana", schemeHi: "पीएम आवास योजना", status: "review", date: "2025-01-05" },
];

const mockSmsLog = [
  { date: "2024-12-15", msg: "Your PM-KISAN application SS-2024-78432 has been APPROVED. ₹2,000 will be credited to your account.", msgHi: "आपका पीएम-किसान आवेदन SS-2024-78432 स्वीकृत। ₹2,000 आपके खाते में जमा होगा।" },
  { date: "2024-12-20", msg: "Application SS-2024-78455 for Ayushman Bharat received. Verification in progress.", msgHi: "आयुष्मान भारत के लिए आवेदन SS-2024-78455 प्राप्त। सत्यापन जारी।" },
  { date: "2025-01-05", msg: "PM Awas Yojana application under review. Documents verified successfully.", msgHi: "पीएम आवास योजना आवेदन समीक्षाधीन। दस्तावेज़ सत्यापित।" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; labelHi: string; className: string }> = {
  approved: { icon: CheckCircle2, label: "Approved", labelHi: "स्वीकृत", className: "bg-green-light text-green-dark" },
  pending: { icon: Clock, label: "Pending", labelHi: "लंबित", className: "bg-saffron-light text-saffron-dark" },
  review: { icon: AlertTriangle, label: "Under Review", labelHi: "समीक्षाधीन", className: "bg-muted text-muted-foreground" },
};

const DashboardView = () => {
  const { lang, tr } = useLanguage();
  const isHi = lang === "hi";

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <h2 className="font-display text-3xl font-bold text-foreground mb-8">{tr("dashboard")}</h2>

      {/* Applications */}
      <div className="mb-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {isHi ? "मेरे आवेदन" : "My Applications"}
        </h3>
        <div className="space-y-3">
          {mockApplications.map((app, i) => {
            const sc = statusConfig[app.status];
            const Icon = sc.icon;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{isHi ? app.schemeHi : app.scheme}</p>
                  <p className="text-xs text-muted-foreground">{app.id} • {app.date}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.className}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {isHi ? sc.labelHi : sc.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SMS Log */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {isHi ? "SMS सूचनाएं" : "SMS Notifications"}
        </h3>
        <div className="space-y-3">
          {mockSmsLog.map((sms, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border"
            >
              <p className="text-xs text-muted-foreground mb-1">{sms.date}</p>
              <p className="text-sm text-foreground">{isHi ? sms.msgHi : sms.msg}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
