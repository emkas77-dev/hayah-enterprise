import React, { useState } from "react";
import {
  Home, Droplets, Wrench, MapPin, Users, Headphones, Bot, BarChart3,
  Bell, Shield, Settings, Menu, Sun, Calendar, Clock, CheckCircle2,
  XCircle, AlertTriangle, MessageCircle, Gauge as GaugeIcon, Phone,
  ChevronUp, ChevronDown, FileText, Database, ClipboardList,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

/* ---------------- Design tokens ----------------
   Deep operations-room navy, with status colors:
   working green, stopped red, warning amber, complaints purple
--------------------------------------------------*/
const c = {
  bg: "#0A1628",
  panel: "#0F2138",
  panel2: "#13284A",
  border: "#1E3658",
  text: "#EAF1FB",
  sub: "#7E97B8",
  accent: "#2F8FE0",
  green: "#21C97A",
  red: "#E14B4B",
  amber: "#E0A622",
  purple: "#8B6FE8",
};

const FONT = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
`;

/* ---------------- Mock data (from hayah_database.sql) ---------------- */
const kpis = [
  { label: "إجمالي محطات المياه", value: "24", unit: "محطة", icon: Droplets, tone: "accent" },
  { label: "محطات عاملة", value: "20", unit: "83.3%", icon: CheckCircle2, tone: "green" },
  { label: "محطات متوقفة", value: "4", unit: "16.7%", icon: XCircle, tone: "red" },
  { label: "محطات الصرف", value: "18", unit: "محطة", icon: Droplets, tone: "accent" },
  { label: "أعطال حالية", value: "7", unit: "عطل", icon: AlertTriangle, tone: "amber" },
  { label: "شكاوى مفتوحة", value: "23", unit: "شكوى", icon: Headphones, tone: "purple" },
];

const stations = [
  { name: "المفتي", type: "مياه", status: "عاملة", flow: "52,000", pressure: "3.2", quality: "جيدة" },
  { name: "سيدي سالم شرق", type: "مياه", status: "عاملة", flow: "38,500", pressure: "2.8", quality: "جيدة" },
  { name: "سيدي سالم غرب", type: "مياه", status: "عاملة", flow: "27,300", pressure: "2.5", quality: "جيدة" },
  { name: "الرياض", type: "مياه", status: "متوقفة", flow: "0", pressure: "0.0", quality: "-" },
  { name: "محطة معالجة سيدي سالم", type: "صرف", status: "عاملة", flow: "31,000", pressure: "-", quality: "جيدة" },
  { name: "محطة معالجة كفر السلام", type: "صرف", status: "متوقفة", flow: "0", pressure: "-", quality: "-" },
];

const alerts = [
  { time: "10:15 ص", text: "ارتفاع منسوب بيارة محطة معالجة كفر السلام", level: "عالي" },
  { time: "09:50 ص", text: "انخفاض ضغط المياه في منطقة سيدي سالم شرق", level: "متوسط" },
  { time: "09:30 ص", text: "توقف طلمبة رقم (2) بمحطة المفتي", level: "عالي" },
  { time: "09:10 ص", text: "زيادة استهلاك الكهرباء بمركز سيدي سالم", level: "متوسط" },
];

const complaintsBreak = [
  { name: "ضعف مياه", value: 9, color: c.purple },
  { name: "انقطاع مياه", value: 6, color: c.accent },
  { name: "صرف صحي", value: 5, color: c.green },
  { name: "أخرى", value: 3, color: c.amber },
];

const production = [
  { t: "00:00", actual: 30000, design: 60000 }, { t: "04:00", actual: 32000, design: 60000 },
  { t: "08:00", actual: 47000, design: 60000 }, { t: "12:00", actual: 44000, design: 60000 },
  { t: "16:00", actual: 41000, design: 60000 }, { t: "20:00", actual: 38000, design: 60000 },
  { t: "24:00", actual: 35000, design: 60000 },
];

const energy = [
  { t: "00:00", v: 14000 }, { t: "04:00", v: 20000 }, { t: "08:00", v: 38000 },
  { t: "12:00", v: 55000 }, { t: "16:00", v: 60000 }, { t: "20:00", v: 45000 }, { t: "24:00", v: 22000 },
];

const navItems = [
  { icon: Home, label: "الرئيسية", active: true },
  { icon: Droplets, label: "تشغيل المحطات" },
  { icon: Wrench, label: "الصيانة" },
  { icon: MapPin, label: "GIS والشبكات" },
  { icon: Users, label: "الموارد البشرية" },
  { icon: Headphones, label: "خدمة العملاء والشكاوى" },
  { icon: Bot, label: "المساعد الذكي" },
  { icon: BarChart3, label: "التقارير والإحصائيات" },
  { icon: Bell, label: "الإنذارات", badge: 12 },
  { icon: Shield, label: "إدارة المستخدمين" },
  { icon: Settings, label: "الإعدادات" },
];

const quickActions = [
  { icon: GaugeIcon, label: "تشغيل قراءة" },
  { icon: AlertTriangle, label: "إبلاغ عطل" },
  { icon: Wrench, label: "أمر عمل" },
  { icon: MessageCircle, label: "شكوى جديدة" },
  { icon: FileText, label: "تقارير يومية" },
  { icon: Database, label: "بيانات المحطات" },
];

const tone = (k) => ({ accent: c.accent, green: c.green, red: c.red, amber: c.amber, purple: c.purple }[k]);

function Kpi({ k }) {
  const col = tone(k.tone);
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3 flex-1 min-w-[150px]"
      style={{ background: c.panel, border: `1px solid ${c.border}` }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${col}22` }}>
        <k.icon size={18} color={col} />
      </div>
      <div>
        <p className="text-xs" style={{ color: c.sub }}>{k.label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold" style={{ color: c.text }}>{k.value}</span>
          <span className="text-[11px] font-semibold" style={{ color: col }}>{k.unit}</span>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const ok = status === "عاملة";
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold"
      style={{ background: ok ? `${c.green}22` : `${c.red}22`, color: ok ? c.green : c.red }}>
      {status}
    </span>
  );
}

function MiniMap() {
  // Stylized abstract map (not a real tile layer) echoing the reference's pin layout
  const pins = [
    { x: 30, y: 35, color: c.green }, { x: 45, y: 22, color: c.green },
    { x: 58, y: 40, color: c.red },  { x: 70, y: 30, color: c.green },
    { x: 25, y: 55, color: c.accent },{ x: 50, y: 60, color: c.purple },
    { x: 65, y: 58, color: c.green }, { x: 38, y: 70, color: c.accent },
  ];
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0E3A52,#0A2A3D 55%,#123524)" }}>
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M10,20 L40,10 L75,18 L90,40 L80,75 L45,90 L15,70 Z" fill="#1B5A3A" />
      </svg>
      {pins.map((p, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <MapPin size={18} color={p.color} fill={p.color} fillOpacity={0.25} />
        </div>
      ))}
      <div className="absolute bottom-2 right-2 flex items-center gap-3 px-2.5 py-1.5 rounded-md text-[10px]"
        style={{ background: "rgba(10,22,40,0.85)", color: c.sub }}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: c.green }} />مياه عاملة</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: c.red }} />متوقفة</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: c.accent }} />صرف</span>
      </div>
    </div>
  );
}

function Gauge({ percent }) {
  const deg = Math.min(100, percent) * 1.8; // semi-circle
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M10,85 A70,70 0 0 1 150,85" fill="none" stroke={c.border} strokeWidth="12" />
        <path d="M10,85 A70,70 0 0 1 150,85" fill="none" stroke={c.red} strokeWidth="12"
          strokeDasharray="220" strokeDashoffset="146.6" strokeLinecap="round" opacity="0" />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.red} />
            <stop offset="50%" stopColor={c.amber} />
            <stop offset="100%" stopColor={c.green} />
          </linearGradient>
        </defs>
        <path d="M10,85 A70,70 0 0 1 150,85" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" />
      </svg>
      <div className="-mt-9 text-center">
        <p className="font-mono text-3xl font-extrabold" style={{ color: c.text }}>{percent}%</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: c.green }}>جيد جدًا</p>
      </div>
      <div className="flex justify-between w-full text-[11px] mt-2" style={{ color: c.sub }}>
        <span>0%</span><span>100%</span>
      </div>
    </div>
  );
}

export default function OperationsRoom() {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div dir="rtl" style={{ background: c.bg, minHeight: "100vh", fontFamily: "Cairo, sans-serif" }}>
      <style>{FONT}{`.fm{font-family:'JetBrains Mono',monospace}`}</style>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${navOpen ? "w-60" : "w-0 md:w-16"} shrink-0 transition-all duration-200 overflow-hidden flex flex-col`}
          style={{ background: c.panel, borderLeft: `1px solid ${c.border}`, minHeight: "100vh" }}>
          <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: `1px solid ${c.border}` }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.accent }}>
              <Droplets size={18} color="#fff" />
            </div>
            {navOpen && <div>
              <p className="text-xs font-bold leading-tight" style={{ color: c.text }}>شركة مياه الشرب</p>
              <p className="text-[10px] leading-tight" style={{ color: c.sub }}>والصرف الصحي بكفر الشيخ</p>
            </div>}
          </div>
          <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
            {navItems.map((it, i) => (
              <button key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative"
                style={{ background: it.active ? c.accent : "transparent", color: it.active ? "#fff" : c.sub }}>
                <it.icon size={17} />
                {navOpen && <span className="flex-1 text-right">{it.label}</span>}
                {it.badge && navOpen && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: c.red, color: "#fff" }}>
                    {it.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          {navOpen && (
            <div className="p-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: c.accent, color: "#fff" }}>
                <Phone size={15} /> اتصل بالدعم الفني
              </button>
              <p className="text-center text-[10px] mt-2" style={{ color: c.sub }}>الإصدار 1.0.0</p>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="flex items-center justify-between px-5 py-3 sticky top-0 z-10 flex-wrap gap-2"
            style={{ background: c.bg, borderBottom: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setNavOpen(!navOpen)} className="p-2 rounded-lg" style={{ background: c.panel }}>
                <Menu size={18} color={c.text} />
              </button>
              <h1 className="text-lg font-extrabold" style={{ color: c.text }}>غرفة العمليات الذكية</h1>
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: c.sub }}>
              <span className="flex items-center gap-1.5"><Sun size={15} color={c.amber} /> 28°C</span>
              <span className="hidden sm:flex items-center gap-1.5"><Calendar size={15} /> 20 يونيو 2026</span>
              <span className="hidden sm:flex items-center gap-1.5 fm"><Clock size={15} /> 10:30:45 ص</span>
              <button className="relative p-2 rounded-lg" style={{ background: c.panel }}>
                <Bell size={16} color={c.text} />
                <span className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: c.red, color: "#fff" }}>12</span>
              </button>
              <div className="flex items-center gap-2 ps-2" style={{ borderRight: `1px solid ${c.border}`, paddingRight: 12 }}>
                <div>
                  <p className="text-xs font-bold" style={{ color: c.text }}>م. محمد كامل</p>
                  <p className="text-[10px]" style={{ color: c.sub }}>مدير المنطقة</p>
                </div>
                <div className="w-8 h-8 rounded-full" style={{ background: c.accent }} />
              </div>
            </div>
          </header>

          <main className="px-5 py-4 flex flex-col gap-4">
            {/* KPIs */}
            <div className="flex gap-3 flex-wrap">
              {kpis.map((k, i) => <Kpi key={i} k={k} />)}
            </div>

            {/* Stations table + Map + Alerts/Complaints */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr_0.9fr] gap-4">
              <div className="rounded-xl p-4" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm" style={{ color: c.text }}>حالة المحطات بشكل لحظي</p>
                  <button className="text-xs font-semibold" style={{ color: c.accent }}>عرض الكل</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ color: c.sub }}>
                        <th className="text-start py-2 font-medium">المحطة</th>
                        <th className="text-start py-2 font-medium">النوع</th>
                        <th className="text-start py-2 font-medium">الحالة</th>
                        <th className="text-start py-2 font-medium">التصرف (م³)</th>
                        <th className="text-start py-2 font-medium">الضغط</th>
                        <th className="text-start py-2 font-medium">الجودة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stations.map((s, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${c.border}` }}>
                          <td className="py-2.5 font-semibold" style={{ color: c.text }}>{s.name}</td>
                          <td className="py-2.5" style={{ color: c.sub }}>{s.type}</td>
                          <td className="py-2.5"><StatusPill status={s.status} /></td>
                          <td className="py-2.5 fm" style={{ color: c.text }}>{s.flow}</td>
                          <td className="py-2.5 fm" style={{ color: c.text }}>{s.pressure}</td>
                          <td className="py-2.5" style={{ color: s.quality === "جيدة" ? c.green : c.sub }}>{s.quality}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl p-4 flex flex-col" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                <p className="font-bold text-sm mb-3" style={{ color: c.text }}>خريطة المحطات والشبكات</p>
                <div className="flex-1 min-h-[260px]"><MiniMap /></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-4" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm" style={{ color: c.text }}>الإنذارات العاجلة</p>
                    <button className="text-xs font-semibold" style={{ color: c.accent }}>عرض الكل</button>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {alerts.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle size={14} color={a.level === "عالي" ? c.red : c.amber} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p style={{ color: c.text }}>{a.text}</p>
                          <p className="fm mt-0.5" style={{ color: c.sub }}>{a.time}</p>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: a.level === "عالي" ? `${c.red}22` : `${c.amber}22`, color: a.level === "عالي" ? c.red : c.amber }}>
                          {a.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm mb-2" style={{ color: c.text }}>الشكاوى المفتوحة</p>
                  <div className="flex items-center gap-3">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie data={complaintsBreak} dataKey="value" innerRadius={28} outerRadius={45} strokeWidth={0}>
                          {complaintsBreak.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1 text-[11px]">
                      {complaintsBreak.map((d, i) => (
                        <span key={i} className="flex items-center gap-1.5" style={{ color: c.text }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name} · {d.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 lg:col-span-1" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                <p className="font-bold text-sm mb-3" style={{ color: c.text }}>إنتاج المياه اليومي (م³)</p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={production}>
                    <CartesianGrid stroke={c.border} vertical={false} />
                    <XAxis dataKey="t" tick={{ fontSize: 10, fill: c.sub }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: c.sub }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: c.panel2, border: `1px solid ${c.border}`, fontSize: 12 }} />
                    <Line type="monotone" dataKey="actual" stroke={c.accent} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="design" stroke={c.green} strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-4 lg:col-span-1" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                <p className="font-bold text-sm mb-3" style={{ color: c.text }}>استهلاك الكهرباء اليومي (ك.و.س)</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={energy}>
                    <CartesianGrid stroke={c.border} vertical={false} />
                    <XAxis dataKey="t" tick={{ fontSize: 10, fill: c.sub }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: c.sub }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: c.panel2, border: `1px solid ${c.border}`, fontSize: 12 }} />
                    <Bar dataKey="v" fill={c.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-4 flex flex-col items-center justify-center lg:col-span-1"
                style={{ background: c.panel, border: `1px solid ${c.border}` }}>
                <p className="font-bold text-sm mb-2 self-start" style={{ color: c.text }}>نسبة الأداء الإجمالية</p>
                <Gauge percent={86} />
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-xl p-4" style={{ background: c.panel, border: `1px solid ${c.border}` }}>
              <p className="font-bold text-sm mb-3" style={{ color: c.text }}>إجراءات سريعة</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map((q, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 py-3 rounded-lg"
                    style={{ background: c.panel2, border: `1px solid ${c.border}` }}>
                    <q.icon size={18} color={c.accent} />
                    <span className="text-[11px] font-medium" style={{ color: c.text }}>{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
