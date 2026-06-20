import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Search,
  Download,
  LogOut,
  Calendar,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Globe2,
  Phone,
  Mail,
  Building2,
  Clock,
  ArrowLeft,
  X,
} from "lucide-react";
import { getLeads, verifyAdminPassword } from "../lib/leads";
import { Lead } from "../lib/db";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — VJ Strapping Systems" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("vj_admin_token");
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await verifyAdminPassword({ data: token });
      if (res.success) {
        setIsAuthenticated(true);
        fetchLeads(token);
      } else {
        sessionStorage.removeItem("vj_admin_token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    try {
      const res = await verifyAdminPassword({ data: password });
      if (res.success) {
        sessionStorage.setItem("vj_admin_token", password);
        setIsAuthenticated(true);
        toast.success("Welcome back, Administrator");
        fetchLeads(password);
      } else {
        toast.error(res.error || "Invalid administrator credentials");
      }
    } catch (error: any) {
      toast.error(error.message || "Login authentication failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vj_admin_token");
    setIsAuthenticated(false);
    setLeads([]);
    toast.info("Logged out of session");
  };

  const fetchLeads = async (token: string) => {
    setIsLoadingLeads(true);
    try {
      const data = await getLeads({ data: token });
      // Sort leads by timestamp descending (newest first)
      const sorted = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLeads(sorted);
    } catch (error: any) {
      toast.error(error.message || "Failed to load enquiries");
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Filter Logic
  const filteredLeads = leads.filter((lead) => {
    // 1. Search term match
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      (lead.company && lead.company.toLowerCase().includes(query)) ||
      lead.email.toLowerCase().includes(query) ||
      lead.requirement.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query);

    // 2. UTM Source filter match
    const utmSource = lead.source.utm_source || "direct";
    const matchesSource = sourceFilter === "all" || utmSource.toLowerCase() === sourceFilter.toLowerCase();

    // 3. Date filter match
    const leadDate = new Date(lead.timestamp);
    const now = new Date();
    let matchesDate = true;

    if (dateFilter === "today") {
      matchesDate = leadDate.toDateString() === now.toDateString();
    } else if (dateFilter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = leadDate >= oneWeekAgo;
    } else if (dateFilter === "month") {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = leadDate >= oneMonthAgo;
    }

    return matchesSearch && matchesSource && matchesDate;
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const leadsToday = leads.filter(
    (l) => new Date(l.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const getUtmSourceCount = (source: string) => {
    return leads.filter((l) => (l.source.utm_source || "direct").toLowerCase() === source.toLowerCase()).length;
  };

  // Prepare data for Recharts Bar Chart (Last 7 Days)
  const get7DayLeadsData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const count = leads.filter((l) => new Date(l.timestamp).toDateString() === d.toDateString()).length;
      data.push({
        date: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        enquiries: count,
      });
    }
    return data;
  };

  // Prepare data for Recharts Pie Chart (UTM Channels)
  const getUtmPieData = () => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const src = (l.source.utm_source || "Direct / Organic").trim();
      counts[src] = (counts[src] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const getUniqueSources = () => {
    const sources = new Set<string>();
    leads.forEach((l) => {
      if (l.source.utm_source) {
        sources.add(l.source.utm_source.toLowerCase());
      } else {
        sources.add("direct");
      }
    });
    return Array.from(sources);
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.warning("No lead data matches the current filters to export");
      return;
    }

    const headers = [
      "Lead ID",
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Requirement",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Content",
      "UTM Term",
      "Referrer URL",
      "User Agent",
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      l.timestamp,
      l.name.replace(/"/g, '""'),
      l.email,
      l.phone,
      (l.company || "").replace(/"/g, '""'),
      l.requirement.replace(/"/g, '""').replace(/\n/g, " "),
      l.source.utm_source || "direct",
      l.source.utm_medium || "",
      l.source.utm_campaign || "",
      l.source.utm_content || "",
      l.source.utm_term || "",
      (l.source.referrer || "").replace(/"/g, '""'),
      l.source.userAgent || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VJ_Strapping_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Successfully exported ${filteredLeads.length} leads to CSV`);
  };

  // Colors for Pie Chart
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#6b7280"];

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1220] text-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-white/50 tracking-widest font-num uppercase">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0b1220] px-4 overflow-hidden text-white">
        <div className="absolute inset-0 grid-industrial opacity-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 filter blur-3xl pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md glass-strong rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Admin Gate</h1>
            <p className="mt-2 text-sm text-white/55">VJ Strapping Systems Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label className="block text-[10px] font-num tracking-[0.2em] text-white/40 uppercase">Security Passcode</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full bg-white/5 border border-white/10 focus:border-amber-500 outline-none rounded-xl px-4 py-3.5 text-center text-white tracking-widest placeholder:text-white/20 transition-all font-num"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full bg-amber-500 text-[#0b1220] py-4 rounded-xl font-medium inline-flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isLoggingIn ? "Authorizing..." : "Authenticate"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070c16] text-white font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <h1 className="font-display font-semibold text-lg tracking-wide uppercase">VJ Strapping Systems</h1>
              <p className="text-[10px] text-amber-500 tracking-[0.3em] font-num uppercase">Admin Control Room</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Metrics Grid */}
        <section className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="glass-strong rounded-2xl p-6 border border-white/5">
            <div className="text-white/40 text-xs font-num tracking-widest uppercase">Total Enquiries</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-num font-bold text-gradient-steel">
                {isLoadingLeads ? "..." : totalLeads}
              </span>
              <span className="text-xs text-white/50">leads saved</span>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-white/5">
            <div className="text-white/40 text-xs font-num tracking-widest uppercase">Leads Today</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-num font-bold text-amber-500">
                {isLoadingLeads ? "..." : leadsToday}
              </span>
              <span className="text-xs text-amber-500/80">new entries</span>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-white/5">
            <div className="text-white/40 text-xs font-num tracking-widest uppercase">Filtered Count</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-num font-bold text-blue-400">
                {isLoadingLeads ? "..." : filteredLeads.length}
              </span>
              <span className="text-xs text-blue-400/80">matching filters</span>
            </div>
          </div>
        </section>

        {/* Charts & Analytics */}
        {leads.length > 0 && (
          <section className="grid lg:grid-cols-3 gap-6 mb-10">
            {/* 7 Day Trend */}
            <div className="lg:col-span-2 glass-strong rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-section text-sm tracking-wide text-white/80">7-DAY ENQUIRY FLOW</h3>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={get7DayLeadsData()}>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff", fontWeight: "bold" }}
                    />
                    <Bar dataKey="enquiries" radius={[4, 4, 0, 0]}>
                      {get7DayLeadsData().map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill="#f59e0b" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Channels breakdown */}
            <div className="glass-strong rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-section text-sm tracking-wide text-white/80">MARKETING ACQUISITION</h3>
                <Globe2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="h-64 w-full flex items-center justify-center relative">
                {getUtmPieData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getUtmPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getUtmPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-white/40 text-xs font-mono">No UTM parameters detected</p>
                )}
                {getUtmPieData().length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 max-h-12 overflow-y-auto">
                    {getUtmPieData().map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-white/60">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {entry.name} ({entry.value})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Database Section */}
        <section className="glass-strong rounded-2xl border border-white/5 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1220]/45">
            <div className="flex items-center gap-3">
              <Unlock className="w-4 h-4 text-amber-500" />
              <h2 className="font-section text-base tracking-wide">LEADS DATABASE</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-amber-500 outline-none rounded-full pl-10 pr-4 py-2 text-xs w-60 transition-all placeholder:text-white/30"
                />
              </div>

              {/* Source Filter */}
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-white/40 mr-2" />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-transparent outline-none text-white cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#0b1220]">All Sources</option>
                  {getUniqueSources().map((src) => (
                    <option key={src} value={src} className="bg-[#0b1220]">
                      {src.charAt(0).toUpperCase() + src.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-white/40 mr-2" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent outline-none text-white cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#0b1220]">All Time</option>
                  <option value="today" className="bg-[#0b1220]">Today</option>
                  <option value="week" className="bg-[#0b1220]">Last 7 Days</option>
                  <option value="month" className="bg-[#0b1220]">Last 30 Days</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0b1220] font-medium px-4 py-2 rounded-full text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV Export
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            {isLoadingLeads ? (
              <div className="py-20 text-center text-white/45 text-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                Loading database rows...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-20 text-center text-white/40 text-sm font-mono">
                No lead entries found matching current parameters.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] uppercase tracking-wider text-white/40 font-num">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Contact info</th>
                    <th className="py-4 px-6">Source</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-num text-white/80">
                  {filteredLeads.map((lead) => {
                    const utmSource = lead.source.utm_source || "direct";
                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4.5 px-6 font-mono font-bold text-amber-500">{lead.id}</td>
                        <td className="py-4.5 px-6 text-white/50">
                          {new Date(lead.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          <span className="block text-[10px] text-white/30">{new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="py-4.5 px-6 font-sans text-sm font-semibold text-white">{lead.name}</td>
                        <td className="py-4.5 px-6 font-sans truncate max-w-[120px]">{lead.company || "—"}</td>
                        <td className="py-4.5 px-6 font-mono text-white/70">
                          {lead.email}
                          <span className="block text-[10px] text-white/45">{lead.phone}</span>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide uppercase ${
                            utmSource.toLowerCase() === "direct"
                              ? "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {utmSource}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-amber-500 hover:text-amber-400 hover:underline transition-all cursor-pointer"
                          >
                            Inspect <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Details Drawer Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-[#0a101d] border-l border-white/10 p-8 shadow-2xl overflow-y-auto flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-num text-white/40 tracking-wider">ENQUIRY ID: {selectedLead.id}</span>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="mt-8 space-y-8 text-sm">
                  <div>
                    <h4 className="text-[10px] font-num tracking-[0.25em] text-amber-500 uppercase">Lead Details</h4>
                    <div className="mt-4 font-sans text-xl font-bold text-white">{selectedLead.name}</div>
                    {selectedLead.company && (
                      <div className="mt-1 flex items-center gap-2 text-white/60">
                        <Building2 className="w-4 h-4 text-white/30" /> {selectedLead.company}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4">
                      <div className="text-[9px] font-num tracking-widest text-white/40 uppercase">Email Address</div>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white hover:text-amber-400 hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5 text-white/30" /> {selectedLead.email}
                      </a>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <div className="text-[9px] font-num tracking-widest text-white/40 uppercase">Phone Number</div>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white hover:text-amber-400 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5 text-white/30" /> {selectedLead.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-num tracking-[0.25em] text-white/40 uppercase">Specification Requirements</h4>
                    <div className="mt-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 text-white/80 italic leading-relaxed whitespace-pre-wrap">
                      "{selectedLead.requirement}"
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-num tracking-[0.25em] text-white/40 uppercase mb-3">Traffic Attribution</h4>
                    <div className="divide-y divide-white/5 border-y border-white/5 text-xs font-num">
                      {[
                        { l: "UTM Source", v: selectedLead.source.utm_source || "None (direct)" },
                        { l: "UTM Medium", v: selectedLead.source.utm_medium || "—" },
                        { l: "UTM Campaign", v: selectedLead.source.utm_campaign || "—" },
                        { l: "UTM Content", v: selectedLead.source.utm_content || "—" },
                        { l: "UTM Term", v: selectedLead.source.utm_term || "—" },
                        { l: "Referrer Hostname", v: selectedLead.source.referrer || "Direct Link" },
                      ].map(({ l, v }) => (
                        <div key={l} className="flex justify-between py-2.5">
                          <span className="text-white/40">{l}</span>
                          <span className="font-semibold text-white/80 text-right truncate max-w-[280px]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-num tracking-[0.25em] text-white/40 uppercase">Client Environment</h4>
                    <div className="mt-2 text-[10px] font-mono text-white/30 break-all leading-normal">
                      {selectedLead.source.userAgent || "Unknown Client System"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 text-xs text-white/40 text-center font-num">
                Enquiry registered on {new Date(selectedLead.timestamp).toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
