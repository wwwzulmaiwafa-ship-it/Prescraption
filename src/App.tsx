import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  PlusCircle, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Search,
  Printer,
  ChevronRight,
  User,
  Activity,
  Calendar,
  AlertCircle,
  Image as ImageIcon,
  Type,
  Maximize,
  Languages,
  Palette
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Translations ---
const translations: any = {
  en: {
    dashboard: "Dashboard",
    prescriptions: "Prescriptions",
    patients: "Patients",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    new_prescription: "New Prescription",
    total_prescriptions: "Total Prescriptions",
    total_patients: "Total Patients",
    recent_prescriptions: "Recent Prescriptions",
    patient_name: "Patient Name",
    age: "Age",
    gender: "Gender",
    contact: "Contact",
    date: "Date",
    medicine: "Medicine",
    dosage: "Dosage",
    frequency: "Frequency",
    duration: "Duration",
    notes: "Notes",
    save: "Save",
    cancel: "Cancel",
    print: "Print PDF",
    share: "Share",
    allergies: "Allergies",
    medical_history: "Medical History",
    search: "Search...",
    welcome: "Welcome back",
    practice_overview: "Here's what's happening with your practice today.",
    language: "Language",
    theme: "Theme",
    custom_design: "Custom Prescription Design",
    bg_image: "Background Image URL",
    padding: "Padding (mm)",
    line_spacing: "Line Spacing (mm)",
    font_size: "Font Size (pt)",
    success_save: "Settings saved successfully!",
    create_account: "Create Account",
    sign_in: "Sign In",
    full_name: "Full Name",
    already_have_account: "Already have an account?",
    dont_have_account: "Don't have an account?",
    register: "Register",
    username: "Username",
    password: "Password",
    most_prescribed_medicines: "Most Prescribed Medicines",
    prescription_trend: "Prescription Trend (Last 30 Days)",
    header_title: "Header Title",
    header_subtitle: "Header Subtitle",
    footer_text: "Footer Text",
    preview_sample: "Preview Sample PDF"
  },
  ps: { // Pashto
    dashboard: "ډشبورډ",
    prescriptions: "نسخې",
    patients: "ناروغانو",
    reports: "راپورونه",
    settings: "تنظیمات",
    logout: "وتل",
    new_prescription: "نوې نسخه",
    total_prescriptions: "ټولې نسخې",
    total_patients: "ټول ناروغان",
    recent_prescriptions: "وروستۍ نسخې",
    patient_name: "د ناروغ نوم",
    age: "عمر",
    gender: "جنسیت",
    contact: "اړیکه",
    date: "نېټه",
    medicine: "درمل",
    dosage: "مقدار",
    frequency: "تکرار",
    duration: "موده",
    notes: "یادښتونه",
    save: "خوندي کول",
    cancel: "لغوه کول",
    print: "PDF چاپول",
    share: "شریکول",
    allergies: "الرژي",
    medical_history: "طبي سابقه",
    search: "لټون...",
    welcome: "ښه راغلاست",
    practice_overview: "ستاسو د کاري فعالیتونو لنډیز دلته دی.",
    language: "ژبه",
    theme: "تیم",
    custom_design: "د نسخې ځانګړی ډیزاین",
    bg_image: "د شالید انځور URL",
    padding: "فاصله (mm)",
    line_spacing: "د کرښو فاصله (mm)",
    font_size: "د فونټ اندازه (pt)",
    success_save: "تنظیمات په بریالیتوب سره خوندي شول!",
    create_account: "حساب جوړول",
    sign_in: "ننوتل",
    full_name: "بشپړ نوم",
    already_have_account: "دمخه حساب لرئ؟",
    dont_have_account: "حساب نه لرئ؟",
    register: "ثبت نام",
    username: "کارن نوم",
    password: "پټنوم",
    most_prescribed_medicines: "ډیر تجویز شوي درمل",
    prescription_trend: "د نسخو بهیر (وروستۍ ۳۰ ورځې)",
    header_title: "د سرلیک متن",
    header_subtitle: "د فرعي سرلیک متن",
    footer_text: "د پایلیک متن",
    preview_sample: "د نمونې PDF لیدل"
  },
  fa: { // Dari/Persian
    dashboard: "داشبورد",
    prescriptions: "نسخه ها",
    patients: "بیماران",
    reports: "گزارش ها",
    settings: "تنظیمات",
    logout: "خروج",
    new_prescription: "نسخه جدید",
    total_prescriptions: "مجموع نسخه ها",
    total_patients: "مجموع بیماران",
    recent_prescriptions: "نسخه های اخیر",
    patient_name: "نام بیمار",
    age: "سن",
    gender: "جنسیت",
    contact: "تماس",
    date: "تاریخ",
    medicine: "دوا",
    dosage: "مقدار",
    frequency: "تعداد دفعات",
    duration: "مدت",
    notes: "یادداشت ها",
    save: "ذخیره کردن",
    cancel: "لغو کردن",
    print: "چاپ PDF",
    share: "اشتراک گذاری",
    allergies: "حساسیت ها",
    medical_history: "سابقه طبی",
    search: "جستجو...",
    welcome: "خوش آمدید",
    practice_overview: "خلاصه فعالیت های کاری شما در اینجا است.",
    language: "زبان",
    theme: "تم",
    custom_design: "دیزاین سفارشی نسخه",
    bg_image: "URL تصویر پس زمینه",
    padding: "فاصله (mm)",
    line_spacing: "فاصله خطوط (mm)",
    font_size: "اندازه فونت (pt)",
    success_save: "تنظیمات با موفقیت ذخیره شد!",
    create_account: "ایجاد حساب",
    sign_in: "ورود",
    full_name: "نام کامل",
    already_have_account: "قبلاً حساب دارید؟",
    dont_have_account: "حساب ندارید؟",
    register: "ثبت نام",
    username: "نام کاربری",
    password: "رمز عبور",
    most_prescribed_medicines: "بیشترین داروهای تجویز شده",
    prescription_trend: "روند نسخه ها (۳۰ روز اخیر)",
    header_title: "عنوان سربرگ",
    header_subtitle: "عنوان فرعی سربرگ",
    footer_text: "متن پاورقی",
    preview_sample: "مشاهده نمونه PDF"
  }
};

// --- Settings Context ---
const SettingsContext = createContext<any>(null);

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>({
    language: 'en',
    theme: 'emerald',
    rx_bg_image: '',
    rx_padding: '20',
    rx_line_spacing: '7',
    rx_font_size: '10',
    rx_header_title: 'WAFA Technology',
    rx_header_subtitle: 'Digital Prescription System',
    rx_footer_text: 'This is a digitally generated prescription.'
  });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    });
  }, []);

  const t = (key: string) => {
    return translations[settings.language]?.[key] || translations.en[key] || key;
  };

  const isRTL = settings.language === 'ps' || settings.language === 'fa';

  return (
    <SettingsContext.Provider value={{ settings, setSettings, t, isRTL }}>
      <div className={cn(
        "min-h-screen",
        settings.theme === 'emerald' && "theme-emerald",
        settings.theme === 'indigo' && "theme-indigo",
        settings.theme === 'slate' && "theme-slate",
        isRTL && "rtl"
      )} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

// --- Components ---

// Login Component
function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const { t, settings } = useContext(SettingsContext);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    const payload = mode === "login" 
      ? { username, password } 
      : { username, password, fullName, role: "doctor" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
            settings.theme === 'emerald' && "bg-emerald-600",
            settings.theme === 'indigo' && "bg-indigo-600",
            settings.theme === 'slate' && "bg-slate-800"
          )}>
            <Activity className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">WAFA Technology</h1>
          <p className="text-sm text-neutral-500">Digital Prescription System</p>
        </div>
        
        <h2 className="text-xl font-semibold mb-6 text-center">
          {mode === "login" ? t("sign_in") : t("create_account")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">{t("full_name")}</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">{t("username")}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">{t("password")}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button 
            type="submit"
            className={cn(
              "w-full text-white py-2 rounded-xl font-medium transition-colors mt-4",
              settings.theme === 'emerald' && "bg-emerald-600 hover:bg-emerald-700",
              settings.theme === 'indigo' && "bg-indigo-600 hover:bg-indigo-700",
              settings.theme === 'slate' && "bg-slate-800 hover:bg-slate-900"
            )}
          >
            {mode === "login" ? t("sign_in") : t("register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm text-neutral-600 hover:underline"
          >
            {mode === "login" ? t("dont_have_account") : t("already_have_account")}
          </button>
        </div>

        {mode === "login" && (
          <p className="text-center text-xs text-neutral-400 mt-6">
            Default: admin / admin123
          </p>
        )}
      </div>
    </div>
  );
}

// Layout Component
function Layout({ user, onLogout, children }: { user: any, onLogout: () => void, children: React.ReactNode }) {
  const location = useLocation();
  const { t, isRTL, settings } = useContext(SettingsContext);
  
  const navItems = [
    { name: t("dashboard"), path: "/", icon: LayoutDashboard },
    { name: t("prescriptions"), path: "/prescriptions", icon: FileText },
    { name: t("patients"), path: "/patients", icon: Users },
    { name: t("reports"), path: "/reports", icon: BarChart3 },
    { name: t("settings"), path: "/settings", icon: SettingsIcon },
  ];

  const themeColors: any = {
    emerald: "bg-emerald-600",
    indigo: "bg-indigo-600",
    slate: "bg-slate-800"
  };

  const activeThemeColors: any = {
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
    slate: "bg-slate-100 text-slate-900"
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-white border-black/5 flex flex-col",
        isRTL ? "border-l" : "border-r"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-black/5">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", themeColors[settings.theme])}>
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-lg">WAFA Tech</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? activeThemeColors[settings.theme]
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-2xl mb-4">
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
              <User className="text-neutral-500 w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// --- Pages ---

function Dashboard() {
  const [stats, setStats] = useState({ prescriptions: 0, patients: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const { t } = useContext(SettingsContext);

  useEffect(() => {
    fetch("/api/prescriptions").then(r => r.json()).then(data => {
      setRecent(data.slice(0, 5));
      setStats(prev => ({ ...prev, prescriptions: data.length }));
    });
    fetch("/api/patients").then(r => r.json()).then(data => {
      setStats(prev => ({ ...prev, patients: data.length }));
    });
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("welcome")}</h1>
        <p className="text-neutral-500">{t("practice_overview")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">{t("total_prescriptions")}</p>
          <p className="text-4xl font-light">{stats.prescriptions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">{t("total_patients")}</p>
          <p className="text-4xl font-light">{stats.patients}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Quick Action</p>
          <Link to="/prescriptions/new" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
            <PlusCircle className="w-4 h-4" />
            {t("new_prescription")}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h2 className="font-semibold">{t("recent_prescriptions")}</h2>
          <Link to="/prescriptions" className="text-emerald-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-black/5">
          {recent.map((rx) => (
            <Link key={rx.id} to={`/prescriptions/${rx.id}`} className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <FileText className="text-neutral-500 w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{rx.patient_name}</p>
                  <p className="text-xs text-neutral-500">{rx.prescription_number} • {rx.date}</p>
                </div>
              </div>
              <ChevronRight className="text-neutral-300 w-5 h-5" />
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="p-12 text-center text-neutral-500">
              No prescriptions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Prescription Form
function PrescriptionForm() {
  const navigate = useNavigate();
  const { t } = useContext(SettingsContext);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState<any[]>([
    { name: "", generic_name: "", dosage: "", frequency: "", duration: "", notes: "" }
  ]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "Male", contact: "", medical_history: "", allergies: "" });

  useEffect(() => {
    fetch("/api/patients").then(r => r.json()).then(setPatients);
  }, []);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", generic_name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedicines(newMeds);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let patientId = selectedPatientId;
    
    if (isNewPatient) {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      const data = await res.json();
      patientId = data.id;
    }

    if (!patientId) {
      alert("Please select or create a patient");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patientId,
        prescriber_id: user.id,
        date,
        notes,
        medicines
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      navigate(`/prescriptions/${data.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("new_prescription")}</h1>
          <p className="text-neutral-500">Create a digital prescription for a patient.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Selection */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              {t("patients")}
            </h2>
            <button 
              type="button"
              onClick={() => setIsNewPatient(!isNewPatient)}
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              {isNewPatient ? "Select Existing Patient" : "Add New Patient"}
            </button>
          </div>

          {isNewPatient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("patient_name")}</label>
                <input 
                  type="text" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("age")}</label>
                  <input 
                    type="number" 
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("gender")}</label>
                  <select 
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("contact")}</label>
                <input 
                  type="text" 
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("allergies")}</label>
                <input 
                  type="text" 
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  placeholder="e.g. Penicillin, Peanuts"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Search Patient</label>
              <select 
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                required
              >
                <option value="">Select a patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.age}y, {p.gender})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Prescription Details */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Prescription Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("date")}</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Medicines List
            </h2>
            <button 
              type="button"
              onClick={addMedicine}
              className="bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-neutral-200 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-6">
            {medicines.map((med, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-2xl border border-black/5 space-y-4 relative">
                {medicines.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("medicine")}</label>
                    <input 
                      type="text" 
                      value={med.name}
                      onChange={(e) => updateMedicine(index, "name", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Generic Name</label>
                    <input 
                      type="text" 
                      value={med.generic_name}
                      onChange={(e) => updateMedicine(index, "generic_name", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("dosage")}</label>
                    <input 
                      type="text" 
                      value={med.dosage}
                      onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      placeholder="e.g. 500mg"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("frequency")}</label>
                    <input 
                      type="text" 
                      value={med.frequency}
                      onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      placeholder="e.g. 1-0-1"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("duration")}</label>
                    <input 
                      type="text" 
                      value={med.duration}
                      onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      placeholder="e.g. 7 days"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("notes")} / Instructions</label>
                  <input 
                    type="text" 
                    value={med.notes}
                    onChange={(e) => updateMedicine(index, "notes", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                    placeholder="e.g. After food"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">General {t("notes")}</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none min-h-[100px]"
              placeholder="Any additional instructions or observations..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            {t("cancel")}
          </button>
          <button 
            type="submit"
            className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Save Prescription
          </button>
        </div>
      </form>
    </div>
  );
}

// Prescription View
function PrescriptionView() {
  const { id } = useParams() as any;
  const navigate = useNavigate();
  const [rx, setRx] = useState<any>(null);
  const { settings, t } = useContext(SettingsContext);

  useEffect(() => {
    fetch(`/api/prescriptions/${id}`).then(r => r.json()).then(setRx);
  }, [id]);

  const handlePrint = () => {
    import("jspdf").then(({ jsPDF }) => {
      import("jspdf-autotable").then((module) => {
        const autoTable = module.default;
        const doc = new jsPDF();
        
        const padding = parseInt(settings.rx_padding) || 20;
        const fontSize = parseInt(settings.rx_font_size) || 10;
        const lineSpacing = parseInt(settings.rx_line_spacing) || 7;

        // Background Image
        if (settings.rx_bg_image) {
          try {
            doc.addImage(settings.rx_bg_image, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
          } catch (e) {
            console.error("Failed to load background image", e);
          }
        }

        // Header
        doc.setFontSize(22);
        doc.setTextColor(5, 150, 105); // emerald-600
        doc.text(settings.rx_header_title || "WAFA Technology", 105, padding, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(settings.rx_header_subtitle || "Digital Prescription System", 105, padding + 6, { align: "center" });
        
        doc.setDrawColor(200);
        doc.line(padding, padding + 15, 210 - padding, padding + 15);
        
        // Patient Info
        doc.setFontSize(fontSize + 2);
        doc.setTextColor(0);
        let currentY = padding + 25;
        
        doc.text(`${t("patient_name")}: ${rx.patient_name}`, padding, currentY);
        doc.text(`${t("age")}/${t("gender")}: ${rx.age}y / ${rx.gender}`, padding, currentY + lineSpacing);
        doc.text(`${t("contact")}: ${rx.contact}`, padding, currentY + lineSpacing * 2);
        
        doc.text(`${t("date")}: ${rx.date}`, 140, currentY);
        doc.text(`No: ${rx.prescription_number}`, 140, currentY + lineSpacing);
        doc.text(`Dr: ${rx.prescriber_name}`, 140, currentY + lineSpacing * 2);

        if (rx.allergies) {
          doc.setTextColor(220, 38, 38);
          doc.text(`${t("allergies")}: ${rx.allergies}`, padding, currentY + lineSpacing * 3.5);
          doc.setTextColor(0);
          currentY += lineSpacing;
        }

        // Medicines Table
        autoTable(doc, {
          startY: currentY + lineSpacing * 4,
          margin: { left: padding, right: padding },
          head: [[t("medicine"), 'Generic Name', t("dosage"), t("frequency"), t("duration"), t("notes")]],
          body: rx.medicines.map((m: any) => [
            m.name, m.generic_name || '-', m.dosage, m.frequency, m.duration, m.notes || '-'
          ]),
          headStyles: { fillColor: [5, 150, 105] },
          styles: { fontSize: fontSize }
        });

        if (rx.notes) {
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          doc.setFontSize(fontSize);
          doc.text(`${t("notes")}:`, padding, finalY);
          doc.setFontSize(fontSize - 1);
          doc.text(rx.notes, padding, finalY + 5, { maxWidth: 210 - padding * 2 });
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(settings.rx_footer_text || "This is a digitally generated prescription.", 105, 285, { align: "center" });
        
        doc.save(`Prescription_${rx.prescription_number}.pdf`);
      });
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      const res = await fetch(`/api/prescriptions/${id}`, { method: "DELETE" });
      if (res.ok) navigate("/prescriptions");
    }
  };

  if (!rx) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180 text-neutral-400" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{rx.prescription_number}</h1>
            <p className="text-neutral-500">{t("prescriptions")} for {rx.patient_name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
          >
            Delete
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            {t("print")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
            {t("share")}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <h2 className="font-semibold">{t("medicine")}</h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-3">{t("medicine")}</th>
                  <th className="px-6 py-3">{t("dosage")}</th>
                  <th className="px-6 py-3">{t("frequency")}</th>
                  <th className="px-6 py-3">{t("duration")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {rx.medicines.map((m: any, i: number) => (
                  <tr key={i} className="text-sm">
                    <td className="px-6 py-4">
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-neutral-500 italic">{m.generic_name}</p>
                    </td>
                    <td className="px-6 py-4">{m.dosage}</td>
                    <td className="px-6 py-4">{m.frequency}</td>
                    <td className="px-6 py-4">{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rx.notes && (
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h2 className="font-semibold mb-4">{t("notes")}</h2>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">{rx.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
            <h2 className="font-semibold">{t("patients")}</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t("patient_name")}</span>
                <span className="font-medium">{rx.patient_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t("age")} / {t("gender")}</span>
                <span className="font-medium">{rx.age}y / {rx.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t("contact")}</span>
                <span className="font-medium">{rx.contact}</span>
              </div>
              {rx.allergies && (
                <div className="pt-3 border-t border-black/5">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">{t("allergies")}</p>
                  <p className="text-sm font-medium text-red-700">{rx.allergies}</p>
                </div>
              )}
            </div>
          </div>


          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
            <h2 className="font-semibold">Prescriber</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{rx.prescriber_name}</p>
                <p className="text-xs text-neutral-500">Digital Signature Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Patient List Page
function PatientListPage() {
  const { t } = useContext(SettingsContext);
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/patients").then(r => r.json()).then(setPatients);
  }, []);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.contact.includes(search)
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("patients")}</h1>
          <p className="text-neutral-500">Manage your patient records and history.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-3">{t("patient_name")}</th>
              <th className="px-6 py-3">{t("age")} / {t("gender")}</th>
              <th className="px-6 py-3">{t("contact")}</th>
              <th className="px-6 py-3">Added On</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((p) => (
              <tr key={p.id} className="text-sm hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">{p.age}y / {p.gender}</td>
                <td className="px-6 py-4 text-neutral-500">{p.contact}</td>
                <td className="px-6 py-4 text-neutral-500">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 font-medium hover:underline">History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reports Page
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function ReportsPage() {
  const { t } = useContext(SettingsContext);
  const [mostPrescribed, setMostPrescribed] = useState([]);
  const [byDate, setByDate] = useState([]);

  useEffect(() => {
    fetch("/api/reports/most-prescribed").then(r => r.json()).then(setMostPrescribed);
    fetch("/api/reports/by-date").then(r => r.json()).then(setByDate);
  }, []);

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("reports")}</h1>
        <p className="text-neutral-500">Insights into your practice and prescriptions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <h2 className="font-semibold">{t("most_prescribed_medicines") || "Most Prescribed Medicines"}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostPrescribed} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {mostPrescribed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <h2 className="font-semibold">{t("prescription_trend") || "Prescriptions Trend (Last 30 Days)"}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDate}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const { settings, setSettings, t } = useContext(SettingsContext);
  const [localSettings, setLocalSettings] = useState(settings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localSettings),
    });
    if (res.ok) {
      setSettings(localSettings);
      setMessage(t("success_save"));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("settings")}</h1>
        <p className="text-neutral-500">Customize your application experience and prescription design.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Settings */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-600" />
            General Settings
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <Languages className="w-3.5 h-3.5" />
                {t("language")}
              </label>
              <select 
                value={localSettings.language}
                onChange={(e) => setLocalSettings({...localSettings, language: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="en">English</option>
                <option value="ps">Pashto (پښتو)</option>
                <option value="fa">Dari (دری)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                {t("theme")}
              </label>
              <select 
                value={localSettings.theme}
                onChange={(e) => setLocalSettings({...localSettings, theme: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="emerald">Emerald (Green)</option>
                <option value="indigo">Indigo (Blue)</option>
                <option value="slate">Slate (Dark)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prescription Design Settings */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
          <h2 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            {t("custom_design")}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("header_title")}</label>
                <input 
                  type="text" 
                  value={localSettings.rx_header_title}
                  onChange={(e) => setLocalSettings({...localSettings, rx_header_title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("header_subtitle")}</label>
                <input 
                  type="text" 
                  value={localSettings.rx_header_subtitle}
                  onChange={(e) => setLocalSettings({...localSettings, rx_header_subtitle: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t("footer_text")}</label>
              <input 
                type="text" 
                value={localSettings.rx_footer_text}
                onChange={(e) => setLocalSettings({...localSettings, rx_footer_text: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                {t("bg_image")}
              </label>
              <input 
                type="text" 
                value={localSettings.rx_bg_image}
                onChange={(e) => setLocalSettings({...localSettings, rx_bg_image: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Maximize className="w-3.5 h-3.5" />
                  {t("padding")}
                </label>
                <input 
                  type="number" 
                  value={localSettings.rx_padding}
                  onChange={(e) => setLocalSettings({...localSettings, rx_padding: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" />
                  {t("line_spacing")}
                </label>
                <input 
                  type="number" 
                  value={localSettings.rx_line_spacing}
                  onChange={(e) => setLocalSettings({...localSettings, rx_line_spacing: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" />
                  {t("font_size")}
                </label>
                <input 
                  type="number" 
                  value={localSettings.rx_font_size}
                  onChange={(e) => setLocalSettings({...localSettings, rx_font_size: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                import("jspdf").then(({ jsPDF }) => {
                  import("jspdf-autotable").then((module) => {
                    const autoTable = module.default;
                    const doc = new jsPDF();
                    const padding = parseInt(localSettings.rx_padding) || 20;
                    const fontSize = parseInt(localSettings.rx_font_size) || 10;
                    const lineSpacing = parseInt(localSettings.rx_line_spacing) || 7;

                    if (localSettings.rx_bg_image) {
                      try { doc.addImage(localSettings.rx_bg_image, 'PNG', 0, 0, 210, 297, undefined, 'FAST'); } catch (e) {}
                    }

                    doc.setFontSize(22);
                    doc.setTextColor(5, 150, 105);
                    doc.text(localSettings.rx_header_title || "Sample Clinic", 105, padding, { align: "center" });
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(localSettings.rx_header_subtitle || "Sample Subtitle", 105, padding + 6, { align: "center" });
                    
                    doc.setDrawColor(200);
                    doc.line(padding, padding + 15, 210 - padding, padding + 15);
                    
                    doc.setFontSize(fontSize + 2);
                    doc.setTextColor(0);
                    let currentY = padding + 25;
                    doc.text("Patient: John Doe", padding, currentY);
                    doc.text("Age/Gender: 30y / Male", padding, currentY + lineSpacing);
                    
                    autoTable(doc, {
                      startY: currentY + lineSpacing * 3,
                      margin: { left: padding, right: padding },
                      head: [['Medicine', 'Dosage', 'Frequency']],
                      body: [['Paracetamol', '500mg', 'Twice daily'], ['Amoxicillin', '250mg', 'Once daily']],
                      headStyles: { fillColor: [5, 150, 105] },
                      styles: { fontSize: fontSize }
                    });

                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(localSettings.rx_footer_text || "Sample Footer", 105, 285, { align: "center" });
                    doc.save("Sample_Prescription.pdf");
                  });
                });
              }}
              className="w-full py-2 border border-emerald-600 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              {t("preview_sample")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {message && <p className="text-emerald-600 font-medium text-sm">{message}</p>}
        <button 
          onClick={handleSave}
          className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm ml-auto"
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) return null;

  return (
    <SettingsProvider>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Router>
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prescriptions" element={<PrescriptionListPage />} />
              <Route path="/prescriptions/new" element={<PrescriptionForm />} />
              <Route path="/prescriptions/:id" element={<PrescriptionView />} />
              <Route path="/patients" element={<PatientListPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </SettingsProvider>
  );
}

function PrescriptionListPage() {
  const { t } = useContext(SettingsContext);
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("prescriptions")}</h1>
          <p className="text-neutral-500">View and manage all prescriptions.</p>
        </div>
        <Link to="/prescriptions/new" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
          <PlusCircle className="w-4 h-4" />
          {t("new_prescription")}
        </Link>
      </header>
      <PrescriptionList />
    </div>
  );
}

function PrescriptionList() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/prescriptions").then(r => r.json()).then(setList);
  }, []);

  const filtered = list.filter(rx => 
    rx.patient_name.toLowerCase().includes(search.toLowerCase()) || 
    rx.prescription_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-black/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by patient or RX number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
          />
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <th className="px-6 py-3">RX Number</th>
            <th className="px-6 py-3">Patient</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Prescriber</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {filtered.map((rx) => (
            <tr key={rx.id} className="text-sm hover:bg-neutral-50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs font-semibold">{rx.prescription_number}</td>
              <td className="px-6 py-4 font-medium">{rx.patient_name}</td>
              <td className="px-6 py-4 text-neutral-500">{rx.date}</td>
              <td className="px-6 py-4 text-neutral-500">{rx.prescriber_name}</td>
              <td className="px-6 py-4 text-right">
                <Link to={`/prescriptions/${rx.id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
