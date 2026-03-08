import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, AlertTriangle, MessageSquare, FileText, Bell, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Application {
  id: string;
  scheme_id: string;
  scheme_name: string;
  full_name: string;
  status: string;
  created_at: string;
  annual_income: string;
  category: string;
  email: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; labelHi: string; bg: string; text: string; dot: string }> = {
  submitted: { icon: Clock, label: "Pending", labelHi: "लंबित", bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
  pending: { icon: Clock, label: "Pending", labelHi: "लंबित", bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
  approved: { icon: CheckCircle2, label: "Approved", labelHi: "स्वीकृत", bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  rejected: { icon: AlertTriangle, label: "Rejected", labelHi: "अस्वीकृत", bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" },
  review: { icon: TrendingUp, label: "Under Review", labelHi: "समीक्षाधीन", bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400" },
};

const defaultStatus = statusConfig.submitted;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function generateAppId(id: string): string {
  return `SS-${id.slice(0, 8).toUpperCase()}`;
}

function generateNotification(app: Application, isHi: boolean): { date: string; msg: string; type: string } {
  const appId = generateAppId(app.id);
  const date = formatDate(app.created_at);

  switch (app.status) {
    case "approved":
      return {
        date,
        msg: isHi
          ? `आपका ${app.scheme_name} आवेदन ${appId} स्वीकृत हो गया है। 🎉`
          : `Your ${app.scheme_name} application ${appId} has been APPROVED. 🎉`,
        type: "success",
      };
    case "rejected":
      return {
        date,
        msg: isHi
          ? `${app.scheme_name} के लिए आवेदन ${appId} अस्वीकृत हो गया है।`
          : `Application ${appId} for ${app.scheme_name} has been rejected.`,
        type: "error",
      };
    case "review":
      return {
        date,
        msg: isHi
          ? `${app.scheme_name} आवेदन ${appId} समीक्षाधीन। दस्तावेज़ सत्यापन जारी।`
          : `${app.scheme_name} application ${appId} under review. Document verification in progress.`,
        type: "warning",
      };
    default:
      return {
        date,
        msg: isHi
          ? `${app.scheme_name} के लिए आवेदन ${appId} प्राप्त। सत्यापन जारी।`
          : `Application ${appId} for ${app.scheme_name} received. Verification in progress.`,
        type: "info",
      };
  }
}

const notifColors: Record<string, { border: string; icon: string }> = {
  success: { border: "border-l-emerald-500", icon: "text-emerald-400" },
  info: { border: "border-l-blue-500", icon: "text-blue-400" },
  warning: { border: "border-l-amber-500", icon: "text-amber-400" },
  error: { border: "border-l-red-500", icon: "text-red-400" },
};

const DashboardView = () => {
  const { lang, tr } = useLanguage();
  const { user } = useAuth();
  const isHi = lang === "hi";

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("id, scheme_id, scheme_name, full_name, status, created_at, annual_income, category, email")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch applications:", error);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();

    // Realtime subscription for live updates
    const channel = supabase
      .channel("dashboard-applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications", filter: `user_id=eq.${user.id}` },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const totalApplied = applications.length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const inProgressCount = applications.filter((a) => ["submitted", "pending", "review"].includes(a.status)).length;

  const summaryStats = [
    { label: isHi ? "कुल आवेदन" : "Total Applied", value: String(totalApplied), icon: FileText, gradient: "from-orange-500 to-amber-500" },
    { label: isHi ? "स्वीकृत" : "Approved", value: String(approvedCount), icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500" },
    { label: isHi ? "प्रगति में" : "In Progress", value: String(inProgressCount), icon: TrendingUp, gradient: "from-blue-500 to-violet-500" },
  ];

  const notifications = applications.map((app) => generateNotification(app, isHi));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(28,100%,64%)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 rounded-full gradient-brand" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              {isHi ? "आपकी प्रोफ़ाइल" : "Your Profile"}
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white">{tr("dashboard")}</h2>
          <p className="text-muted-foreground mt-1">
            {isHi ? "अपने आवेदनों को ट्रैक करें और अपडेट रहें।" : "Track your applications and stay updated."}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-8">
          {summaryStats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} className="glass-card rounded-2xl p-4 md:p-5 border border-glass text-center">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-3`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="font-['Space_Grotesk'] text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {applications.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl border border-glass p-10 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
              {isHi ? "अभी तक कोई आवेदन नहीं" : "No applications yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isHi
                ? "योजनाओं का पता लगाने और अपना पहला आवेदन जमा करने के लिए 'योजनाएँ' पेज पर जाएँ।"
                : "Visit the Schemes page to explore government schemes and submit your first application."}
            </p>
          </motion.div>
        )}

        {applications.length > 0 && (
          <div className="grid gap-6 md:grid-cols-5">
            {/* Applications */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[hsl(28,100%,64%)]" />
                  {isHi ? "मेरे आवेदन" : "My Applications"}
                </h3>
                <span className="text-xs text-muted-foreground glass px-2 py-1 rounded-full border border-glass">
                  {totalApplied} total
                </span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {applications.map((app, i) => {
                    const sc = statusConfig[app.status] || defaultStatus;
                    const Icon = sc.icon;
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        whileHover={{ x: 4 }}
                        className="glass-card rounded-2xl p-4 border border-glass flex items-center justify-between gap-4 group cursor-pointer hover:border-[hsl(28_100%_54%/0.2)] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-2 h-8 rounded-full ${sc.dot}`} />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{app.scheme_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {generateAppId(app.id)} · {formatDate(app.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <Icon className="h-3 w-3" />
                            {isHi ? sc.labelHi : sc.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Notifications */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[hsl(28,100%,64%)]" />
                  {isHi ? "सूचनाएं" : "Notifications"}
                </h3>
              </div>
              <div className="space-y-3">
                {notifications.map((notif, i) => {
                  const colors = notifColors[notif.type] || notifColors.info;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className={`glass-card rounded-2xl p-4 border border-glass border-l-4 ${colors.border}`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${colors.icon}`} />
                        <p className="text-xs text-muted-foreground">{notif.date}</p>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{notif.msg}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
