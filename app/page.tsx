"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileClock,
  FileText,
  FolderLock,
  Gift,
  HandCoins,
  HeartHandshake,
  Landmark,
  ListChecks,
  LockKeyhole,
  Menu,
  Network,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  ApprovalCenter,
  ExecutiveAnalytics,
  ExceptionCenter,
  FundingSimulator,
  LiberiaOperations,
  NextAction,
  PayrollStudio,
  ProspevaAI,
  ReconciliationCenter,
} from "./advanced-sections";
import {
  GhostEmployeeControl,
  LeaveAttendanceHub,
  MicrosoftCenter,
  PeopleRoles,
} from "./workforce-access";

type Page =
  | "Overview"
  | "Employees"
  | "People & Roles"
  | "Ghost Prevention"
  | "Attendance"
  | "Payroll"
  | "Deductions"
  | "Benefits"
  | "Payroll Loans"
  | "Payroll Financing"
  | "Payments"
  | "Connectivity & Sync"
  | "Funding Simulator"
  | "Exception Center"
  | "Reconciliation"
  | "Liberia Operations"
  | "Reports"
  | "Approvals"
  | "Executive Analytics"
  | "ProspevaAI"
  | "Microsoft 365"
  | "Audit Log"
  | "Settings";
type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  currency: "LRD" | "USD" | "Mixed";
  grossLRD: number;
  grossUSD: number;
  paye: number;
  nasscorp: number;
  other: number;
  netLRD: number;
  netUSD: number;
  status: string;
  destination: string;
};

const employees: Employee[] = [
  {
    id: "EMP-0248",
    name: "Martha Kallon",
    role: "Finance Manager",
    department: "Finance",
    currency: "Mixed",
    grossLRD: 186000,
    grossUSD: 540,
    paye: 32400,
    nasscorp: 14880,
    other: 22000,
    netLRD: 120720,
    netUSD: 432,
    status: "Ready",
    destination: "Prospeva LRD + USD wallets",
  },
  {
    id: "EMP-0247",
    name: "James Doe",
    role: "Operations Officer",
    department: "Operations",
    currency: "USD",
    grossLRD: 0,
    grossUSD: 1250,
    paye: 35600,
    nasscorp: 10500,
    other: 11200,
    netLRD: 0,
    netUSD: 977.18,
    status: "Ready",
    destination: "UBA USD · ••4587",
  },
  {
    id: "EMP-0246",
    name: "Hawa Sirleaf",
    role: "HR Specialist",
    department: "People",
    currency: "LRD",
    grossLRD: 245000,
    grossUSD: 0,
    paye: 28600,
    nasscorp: 19600,
    other: 12000,
    netLRD: 184800,
    netUSD: 0,
    status: "Exception",
    destination: "Orange Money · ••4522",
  },
  {
    id: "EMP-0245",
    name: "Samuel Toe",
    role: "Sales Lead",
    department: "Sales",
    currency: "Mixed",
    grossLRD: 165000,
    grossUSD: 420,
    paye: 26800,
    nasscorp: 13200,
    other: 31500,
    netLRD: 108500,
    netUSD: 336,
    status: "Ready",
    destination: "Prospeva wallets",
  },
  {
    id: "EMP-0244",
    name: "Fatu Brown",
    role: "Administrator",
    department: "Administration",
    currency: "LRD",
    grossLRD: 198000,
    grossUSD: 0,
    paye: 21500,
    nasscorp: 15840,
    other: 8000,
    netLRD: 152660,
    netUSD: 0,
    status: "Ready",
    destination: "MTN MoMo · ••1930",
  },
  {
    id: "EMP-0243",
    name: "Kelvin Freeman",
    role: "Field Coordinator",
    department: "Operations",
    currency: "USD",
    grossLRD: 0,
    grossUSD: 880,
    paye: 22400,
    nasscorp: 7392,
    other: 5600,
    netLRD: 0,
    netUSD: 711.76,
    status: "Exception",
    destination: "Prospeva USD wallet",
  },
];
const nav: Array<[Page, any]> = [
  ["Overview", BarChart3],
  ["Employees", Users],
  ["People & Roles", UserCheck],
  ["Ghost Prevention", ShieldCheck],
  ["Attendance", Clock3],
  ["Payroll", BriefcaseBusiness],
  ["Deductions", ReceiptText],
  ["Benefits", HeartHandshake],
  ["Payroll Loans", Landmark],
  ["Payroll Financing", HandCoins],
  ["Payments", WalletCards],
  ["Connectivity & Sync", RefreshCw],
  ["Funding Simulator", CircleDollarSign],
  ["Exception Center", AlertTriangle],
  ["Reconciliation", RefreshCw],
  ["Liberia Operations", Network],
  ["Reports", FileText],
  ["Approvals", CheckCircle2],
  ["Executive Analytics", BarChart3],
  ["ProspevaAI", Activity],
  ["Microsoft 365", Network],
  ["Audit Log", FileClock],
  ["Settings", Settings2],
];
const money = (n: number, c = "LRD") =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: c === "USD" ? 2 : 0,
    maximumFractionDigits: c === "USD" ? 2 : 0,
  }).format(n) + ` ${c}`;

export default function EmployerPortal() {
  const [signedIn, setSignedIn] = useState(false),
    [page, setPage] = useState<Page>("Overview"),
    [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState<"employee" | "add" | "action" | null>(
      null,
    ),
    [selected, setSelected] = useState<Employee>(employees[0]),
    [action, setAction] = useState(""),
    [toast, setToast] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const notify = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 2400);
  };
  const go = (p: Page) => {
    setPage(p);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openEmployee = (e: Employee) => {
    setSelected(e);
    setSheet("employee");
  };
  const openAction = (x: string) => {
    setAction(x);
    setSheet("action");
  };
  useEffect(() => {
    const sync = () => setIsOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  if (!signedIn) return <SignIn onSignIn={() => setSignedIn(true)} />;
  return (
    <main className="app-shell">
      <Sidebar page={page} go={go} />
      <section className="main-shell">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div className="brand-title">
            <Logo />
            <b>Employer</b>
          </div>
          <button
            className="connection-chip prototype"
            onClick={() => go("Connectivity & Sync")}
          >
            <i />
            Prototype mode
          </button>
          <Select defaultValue="aug">
            <SelectTrigger className="period-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aug">August 2026 · Monthly</SelectItem>
              <SelectItem value="jul">July 2026 · Monthly</SelectItem>
              <SelectItem value="q3">Q3 2026 · Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <div className="user-area">
            <button onClick={() => go("Approvals")}>
              <Bell />
              <i>4</i>
            </button>
            <span>JD</span>
            <div>
              <b>James Doe</b>
              <small>Payroll Manager</small>
            </div>
          </div>
        </header>
        <div className="page-body">
          <aside className="prototype-banner" role="status">
            <AlertTriangle />
            <span><b>Demo environment</b> Shared backend not connected · external payment rails and provider integrations are disabled.</span>
          </aside>
          {page === "Overview" && (
            <>
              <NextAction go={go} />
              <Overview go={go} openAction={openAction} notify={notify} />
            </>
          )}{" "}
          {page === "Employees" && (
            <Employees
              openEmployee={openEmployee}
              add={() => setSheet("add")}
              notify={notify}
            />
          )}{" "}
          {page === "People & Roles" && <PeopleRoles notify={notify} />}{" "}
          {page === "Ghost Prevention" && (
            <GhostEmployeeControl notify={notify} />
          )}{" "}
          {page === "Payroll" && (
            <PayrollStudio
              employees={employees}
              openEmployee={openEmployee}
              notify={notify}
            />
          )}{" "}
          {page === "Attendance" && <LeaveAttendanceHub notify={notify} />}{" "}
          {page === "Deductions" && <Deductions notify={notify} />}{" "}
          {page === "Benefits" && <Benefits notify={notify} />}{" "}
          {page === "Payroll Loans" && <Loans notify={notify} />}{" "}
          {page === "Payroll Financing" && (
            <PayrollFinancing openAction={openAction} notify={notify} />
          )}{" "}
          {page === "Payments" && (
            <Payments openAction={openAction} notify={notify} />
          )}{" "}
          {page === "Connectivity & Sync" && (
            <EmployerConnectivity isOnline={isOnline} notify={notify} />
          )}{" "}
          {page === "Funding Simulator" && <FundingSimulator notify={notify} />}{" "}
          {page === "Exception Center" && <ExceptionCenter notify={notify} />}{" "}
          {page === "Reconciliation" && (
            <ReconciliationCenter notify={notify} />
          )}{" "}
          {page === "Liberia Operations" && (
            <LiberiaOperations notify={notify} />
          )}{" "}
          {page === "Reports" && <Reports notify={notify} />}{" "}
          {page === "Approvals" && <ApprovalCenter notify={notify} />}{" "}
          {page === "Executive Analytics" && (
            <ExecutiveAnalytics notify={notify} />
          )}{" "}
          {page === "ProspevaAI" && <ProspevaAI notify={notify} />}{" "}
          {page === "Microsoft 365" && <MicrosoftCenter notify={notify} />}{" "}
          {page === "Audit Log" && <AuditLog notify={notify} />}{" "}
          {page === "Settings" && <Settings notify={notify} />}
        </div>
      </section>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="mobile-nav">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription>Monrovia Business Group</SheetDescription>
          </SheetHeader>
          <nav>
            {nav.map(([p, I]) => (
              <button
                key={p}
                className={page === p ? "active" : ""}
                onClick={() => go(p)}
              >
                <I />
                {p}
                {p === "Approvals" && <i>4</i>}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Sheet open={sheet !== null} onOpenChange={(v) => !v && setSheet(null)}>
        <SheetContent side="right" className="detail-sheet">
          {sheet === "employee" ? (
            <EmployeeDetail employee={selected} notify={notify} />
          ) : sheet === "add" ? (
            <AddEmployee close={() => setSheet(null)} notify={notify} />
          ) : sheet === "action" ? (
            <ActionFlow
              action={action}
              close={() => setSheet(null)}
              notify={notify}
            />
          ) : null}
        </SheetContent>
      </Sheet>
      {page !== "ProspevaAI" && (
        <button className="ai-launcher" onClick={() => go("ProspevaAI")}>
          <Activity />
          <span>Ask ProspevaAI</span>
        </button>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check />
          {toast}
        </div>
      )}
    </main>
  );
}

function EmployerConnectivity({ isOnline, notify }: any) {
  const [attendanceQueued, setAttendanceQueued] = useState(14);
  const [leaveQueued, setLeaveQueued] = useState(3);
  return (
    <>
      <PageHead
        eyebrow="PAYROLL CONTINUITY"
        title="Connectivity & secure synchronization"
        copy="Keep workforce records moving during an outage without risking duplicate payroll or false payment confirmations."
      />
      <section className={`employer-network-state ${isOnline ? "online" : "offline"}`}>
        <Network />
        <div>
          <small>PROTOTYPE CONNECTIVITY</small>
          <h2>{isOnline ? "Browser connection available" : "Offline protection active"}</h2>
          <p>{isOnline ? "The interface is reachable, but the unified backend and external provider integrations are not connected." : "Clock and leave events retain their original timestamps. Payroll release remains blocked."}</p>
        </div>
        <i>{isOnline ? "DEMO ONLY" : "OFFLINE"}</i>
      </section>
      <section className="continuity-stats">
        <Stat label="Attendance waiting" value={String(attendanceQueued)} icon={Clock3} note="Original timestamps preserved" />
        <Stat label="Leave requests waiting" value={String(leaveQueued)} icon={CalendarDays} tone="orange" note="Not yet approved" />
        <Stat label="Payroll releases" value={isOnline ? "Available" : "Blocked"} icon={LockKeyhole} tone={isOnline ? "green" : "orange"} note="Online approval required" />
      </section>
      <section className="continuity-grid">
        <article className="panel"><PanelTitle icon={Clock3} title="Workforce synchronization"/><p>Employee clock-in, clock-out and leave requests can queue securely and appear here as <b>Awaiting synchronization</b>.</p><div className="sync-row"><span>Attendance events</span><b>{attendanceQueued} waiting</b><button onClick={()=>{setAttendanceQueued(0);notify(isOnline?"Attendance synchronized":"Still waiting for a secure connection")}}>Synchronize</button></div><div className="sync-row"><span>Leave requests</span><b>{leaveQueued} waiting</b><button onClick={()=>{setLeaveQueued(0);notify(isOnline?"Leave requests synchronized":"Still waiting for a secure connection")}}>Synchronize</button></div></article>
        <article className="panel payroll-lock"><PanelTitle icon={ShieldCheck} title="Payroll release protection"/><p>Drafts may be prepared offline, but funding checks, maker-checker approval, ledger posting and salary release require an authenticated server session.</p>{["No offline payroll completion","Duplicate batch prevention","Re-validate employee and destination status","Audit every queued record"].map(x=><span key={x}><CheckCircle2/>{x}</span>)}<button onClick={()=>notify("Continuity and recovery policy opened")}>View recovery policy</button></article>
      </section>
      <section className="ecosystem-standard" aria-label="Prospeva ecosystem standards">
        <div><small>CONNECTED WORKSPACE</small><b>Employer profile · standalone Employer Portal</b><p>Employee clock and leave requests originate in personal mobile accounts and synchronize here for authorized supervisors, HR and payroll teams.</p></div>
        <div><small>SHARED RECORD STATES</small><b>Draft · Waiting for connection · Submitted · Processing · Completed · Failed · Reversed</b><p>Attendance and leave use Pending approval, Approved and Declined where no money movement occurs.</p></div>
        <div><small>PAYMENT DISCLOSURE</small><b>Rail · FX rate · Prospeva fee · Partner fee · Total debit · Recipient amount · Settlement estimate</b><p>Payroll releases require online authorization, ledger confirmation and a complete audit trail.</p></div>
      </section>
    </>
  );
}

function Logo() {
  return (
    <div className="logo">
      <img src="/prospeva-logo.png" alt="Prospeva" />
    </div>
  );
}
function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const [recovery, setRecovery] = useState(false);
  return (
    <main className="signin">
      <section className="signin-story">
        <Logo />
        <div>
          <span>PROSPEVA EMPLOYER</span>
          <h1>Payroll built for Liberia’s dual-currency economy.</h1>
          <p>
            Calculate PAYE in LRD, pay employees in LRD, USD or both, and keep
            funding, approvals and statutory obligations aligned.
          </p>
        </div>
        <footer>
          <ShieldCheck />
          <span>
            <b>Secure payroll infrastructure</b>
            <small>MFA · Maker-checker · Complete audit trail</small>
          </span>
        </footer>
      </section>
      <section className="signin-form">
        <div>
          <Logo />
          <span className="workspace-label">ONE PROSPEVA ID · EMPLOYER WORKSPACE</span>
          <small>AUTHORIZED EMPLOYER ACCESS</small>
          <h2>Welcome back</h2>
          <p>Sign in to Monrovia Business Group.</p>
          <label>
            Work email
            <input defaultValue="james@monroviabusiness.lr" />
          </label>
          <label>
            Password
            <input type="password" defaultValue="Prospeva2026" />
          </label>
          <div className="signin-options">
            <label>
              <input type="checkbox" defaultChecked />
              Remember this device
            </label>
            <button onClick={() => setRecovery((v) => !v)}>
              Forgot password?
            </button>
          </div>
          {recovery && (
            <aside className="info-box">
              <ShieldCheck />
              <p>
                A secure recovery link will be sent to the authorized payroll
                officer after employer verification.
              </p>
            </aside>
          )}
          <button className="primary" onClick={onSignIn}>
            Sign in securely <ArrowRight />
          </button>
          <aside>
            <BadgeCheck />
            <span>
              <b>Verified employer</b>
              <small>Company ID EMP-LBR-2048</small>
            </span>
          </aside>
        </div>
      </section>
    </main>
  );
}
function Sidebar({ page, go }: { page: Page; go: (p: Page) => void }) {
  return (
    <aside className="sidebar">
      <Logo />
      <div className="company-mini">
        <Building2 />
        <span>
          <small>VERIFIED EMPLOYER</small>
          <b>Monrovia Business Group</b>
        </span>
        <BadgeCheck />
      </div>
      <nav>
        {nav.map(([p, I]) => (
          <button
            key={p}
            className={page === p ? "active" : ""}
            onClick={() => go(p)}
          >
            <I />
            <span>{p}</span>
            {p === "Approvals" && <i>4</i>}
          </button>
        ))}
      </nav>
      <footer>
        <ShieldCheck />
        <span>
          <b>Prospeva Secure</b>
          <small>All actions audit logged</small>
        </span>
      </footer>
    </aside>
  );
}
function PageHead({ eyebrow, title, copy, action, onAction }: any) {
  return (
    <header className="page-head">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action && (
        <button className="primary compact" onClick={onAction}>
          <Plus />
          {action}
        </button>
      )}
    </header>
  );
}
function Stat({ label, value, icon: I, tone = "blue", note }: any) {
  return (
    <article className="stat">
      <span className={tone}>
        <I />
      </span>
      <small>{label}</small>
      <b>{value}</b>
      {note && <em>{note}</em>}
    </article>
  );
}
function PanelTitle({ icon: I, title, action, onAction }: any) {
  return (
    <div className="panel-title">
      <div>
        <I />
        <h2>{title}</h2>
      </div>
      {action && (
        <button onClick={onAction}>
          {action}
          <ChevronRight />
        </button>
      )}
    </div>
  );
}

function Overview({ go, openAction, notify }: any) {
  return (
    <>
      <PageHead
        eyebrow="PAYROLL CONTROL CENTER"
        title="August payroll overview"
        copy="Funding, tax, benefits, loans and payment readiness in one view."
      />
      <section className="identity-stats">
        <article className="employer-card">
          <Building2 />
          <div>
            <small>VERIFIED EMPLOYER</small>
            <b>Monrovia Business Group</b>
            <em>EMP-LBR-2048</em>
          </div>
          <BadgeCheck />
        </article>
        <Stat label="Active employees" value="248" icon={Users} />
        <Stat label="Gross payroll" value="18,450,000 LRD" icon={WalletCards} />
        <Stat label="Net salaries" value="13,206,500 LRD" icon={Banknote} />
        <Stat label="Funding required" value="18,450,000 LRD" icon={Landmark} />
        <Stat
          label="Payroll status"
          value="Awaiting funding"
          icon={Clock3}
          tone="orange"
        />
      </section>
      <section className="overview-grid">
        <article className="panel funding-panel">
          <PanelTitle
            icon={Landmark}
            title="Payroll Funding & Automatic Release"
          />
          <div className="funding-main">
            <div>
              <small>Cleared available balance</small>
              <b className="green-text">16,910,000 LRD</b>
              <small>Required funding</small>
              <strong>18,450,000 LRD</strong>
              <small>Funding gap</small>
              <strong className="red-text">1,540,000 LRD</strong>
            </div>
            <div className="funding-meter">
              <b>91.7%</b>
              <Progress value={91.7} />
              <em>Monitoring bank balance</em>
              <p>
                Payroll releases automatically when cleared funds meet the
                approved requirement.
              </p>
            </div>
          </div>
          <div className="toggle-row">
            <span>Automatic payroll release</span>
            <Switch
              defaultChecked
              onCheckedChange={(v) =>
                notify(`Automatic release ${v ? "enabled" : "paused"}`)
              }
            />
            <a>IIPS / NEPS integration pending</a>
          </div>
          <footer>
            <button onClick={() => openAction("Funding details")}>
              View Funding Details
            </button>
            <button
              className="primary compact"
              onClick={() => openAction("Add payroll funds")}
            >
              Add Funds
            </button>
          </footer>
        </article>
        <article className="panel calculation">
          <PanelTitle icon={ListChecks} title="Liberia Payroll Calculation" />
          <span className="tax-badge">Taxes calculated in LRD</span>
          {[
            ["Gross earnings", "18,450,000 LRD"],
            ["USD earnings converted for tax", "2,150,000 LRD"],
            ["Total LRD-equivalent taxable gross", "20,600,000 LRD"],
            ["LRA PAYE liability", "2,060,000 LRD"],
            ["NASSCORP employee NPS 4%", "736,000 LRD"],
            ["NASSCORP employer NPS 4%", "736,000 LRD"],
            ["NASSCORP employer EIS 2%", "368,000 LRD"],
            ["Employee benefit contributions", "246,000 LRD"],
            ["Employer benefit contributions", "684,000 LRD"],
            ["Payroll loan repayments", "1,414,000 LRD"],
            ["Goods on account", "512,000 LRD"],
            ["Other deductions", "234,500 LRD"],
          ].map((r, i) => (
            <p key={r[0]} className={i === 2 ? "strong-row" : ""}>
              <span>{r[0]}</span>
              <b>{r[1]}</b>
            </p>
          ))}
          <div className="net-row">
            <span>Net salary LRD</span>
            <b>13,206,500 LRD</b>
            <span>Net salary USD</span>
            <b>1,125.00 USD</b>
          </div>
          <footer>
            <div>
              <small>Locked exchange rate</small>
              <b>199.25 LRD per USD</b>
            </div>
            <div>
              <small>Source</small>
              <b>Demo partner-bank feed</b>
            </div>
            <div>
              <small>Tax rule</small>
              <b>LRA PAYE v2026.08 · effective Aug 1</b>
            </div>
            <LockKeyhole />
          </footer>
        </article>
        <article className="panel distribution">
          <PanelTitle icon={CircleDollarSign} title="Payroll Distribution" />
          <div className="donut">
            <div>
              <b>18.45M</b>
              <small>LRD required</small>
            </div>
          </div>
          <ul>
            {[
              ["Net salaries", "13,206,500", "blue"],
              ["PAYE", "2,060,000", "orange"],
              ["NASSCORP", "1,840,000", "green"],
              ["Benefits", "246,000", "purple"],
              ["Loan repayments", "1,414,000", "red"],
              ["Other", "619,500", "teal"],
            ].map((r) => (
              <li key={r[0]}>
                <i className={r[2]} />
                <span>{r[0]}</span>
                <b>{r[1]} LRD</b>
              </li>
            ))}
          </ul>
          <aside>
            <AlertTriangle />
            Funding includes every destination, not only employee net pay.
          </aside>
        </article>
        <article className="panel exceptions">
          <PanelTitle icon={ShieldCheck} title="Compliance & Exceptions" />
          {[
            ["3", "Missing TIN"],
            ["2", "Missing NASSCORP ID"],
            ["5", "Attendance exceptions"],
            ["2", "Loan deduction exceptions"],
          ].map((r, i) => (
            <button key={r[1]} onClick={() => go("Exception Center")}>
              <span className={`count c${i}`}>{r[0]}</span>
              <b>{r[1]}</b>
              <ChevronRight />
            </button>
          ))}
          <footer>
            <button onClick={() => notify("PAYE report generated")}>
              <FileText />
              Generate PAYE Report
            </button>
            <button onClick={() => notify("NASSCORP file generated")}>
              <Users />
              Generate NASSCORP File
            </button>
            <button onClick={() => notify("Filing pack downloaded")}>
              <Download />
              Download Filing Pack
            </button>
          </footer>
        </article>
      </section>
      <section className="bottom-grid">
        <article className="panel">
          <PanelTitle
            icon={RefreshCw}
            title="Automatic Loan Repayment"
            action="Review exceptions"
            onAction={() => go("Payroll Loans")}
          />
          <div className="loan-summary">
            <span>
              <b>96</b>
              <small>active employee loans</small>
            </span>
            <div>
              <strong>1,414,000 LRD</strong>
              <p>This payroll · 94 ready · 2 exceptions</p>
            </div>
          </div>
          <p className="flow-copy">
            Payroll settles → authorized installment deducted → lender account
            credited → balance updated
          </p>
        </article>
        <article className="panel">
          <PanelTitle
            icon={Gift}
            title="Employee Benefits"
            action="Manage"
            onAction={() => go("Benefits")}
          />
          <div className="triple">
            <span>
              <b>216 of 248</b>
              <small>Enrolled</small>
            </span>
            <span>
              <b>684,000 LRD</b>
              <small>Employer</small>
            </span>
            <span>
              <b>246,000 LRD</b>
              <small>Employee</small>
            </span>
          </div>
          <div className="benefit-icons">
            {[
              "Health",
              "Life",
              "Retirement",
              "Transport",
              "Housing",
              "Education",
              "Meals",
              "Savings",
            ].map((x) => (
              <span key={x}>
                <HeartHandshake />
                <small>{x}</small>
              </span>
            ))}
          </div>
        </article>
        <article className="panel workflow-card">
          <PanelTitle icon={Activity} title="Payroll Workflow" />
          <Workflow />
          <aside>
            <b>Current step: Awaiting Funding</b>
            <p>
              Cleared funds remain below the approved total funding requirement.
            </p>
          </aside>
        </article>
        <article className="panel security">
          <PanelTitle icon={ShieldCheck} title="Security & Audit" />
          {[
            "Ghost-employee payroll gate",
            "Maker-checker approval",
            "MFA",
            "Role-based access",
            "Locked payroll version",
            "Idempotent payment batch",
            "Immutable audit trail",
            "7-year records",
          ].map((x) => (
            <p key={x}>
              <CheckCircle2 />
              {x}
            </p>
          ))}
        </article>
      </section>
    </>
  );
}
function Workflow() {
  return (
    <div className="workflow">
      {[
        ["Draft", true],
        ["Submitted", true],
        ["Validating", true],
        ["Funding Required", false],
        ["Funded", false],
        ["Approved", false],
        ["Processing", false],
        ["Paid", false],
        ["Reconciled", false],
      ].map(([s, d], i) => (
        <span key={String(s)} className={d ? "done" : i === 3 ? "current" : ""}>
          <i>{d ? <Check /> : i === 3 ? <Clock3 /> : i + 1}</i>
          <small>{s}</small>
        </span>
      ))}
    </div>
  );
}

function Employees({ openEmployee, add, notify }: any) {
  const [q, setQ] = useState(""),
    [dept, setDept] = useState("All");
  const shown = employees.filter(
    (e) =>
      (dept === "All" || e.department === dept) &&
      e.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHead
        eyebrow="WORKFORCE DIRECTORY"
        title="Employees"
        copy="Manage payroll configuration, identity, destinations and employment records."
        action="Add Employee"
        onAction={add}
      />
      <section className="mini-stats">
        <Stat label="Active" value="248" icon={UserCheck} />
        <Stat
          label="Ready for payroll"
          value="242"
          icon={CheckCircle2}
          tone="green"
        />
        <Stat
          label="Needs attention"
          value="6"
          icon={AlertTriangle}
          tone="orange"
        />
        <Stat label="Mixed currency" value="84" icon={CircleDollarSign} />
      </section>
      <article className="panel table-panel">
        <div className="table-tools">
          <div>
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search employee"
            />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="filter-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "All",
                "Finance",
                "Operations",
                "People",
                "Sales",
                "Administration",
              ].map((x) => (
                <SelectItem key={x} value={x}>
                  {x} departments
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button onClick={() => notify("Employee export prepared")}>
            <Download />
            Export
          </button>
        </div>
        <EmployeeTable rows={shown} open={openEmployee} />
      </article>
    </>
  );
}
function EmployeeTable({
  rows,
  open,
}: {
  rows: Employee[];
  open: (e: Employee) => void;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Pay currency</th>
            <th>Gross income</th>
            <th>Deductions</th>
            <th>Net income</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const gross =
              e.currency === "USD"
                ? money(e.grossUSD, "USD")
                : e.currency === "LRD"
                  ? money(e.grossLRD)
                  : `${money(e.grossLRD)} + ${money(e.grossUSD, "USD")}`;
            const net =
              e.currency === "USD"
                ? money(e.netUSD, "USD")
                : e.currency === "LRD"
                  ? money(e.netLRD)
                  : `${money(e.netLRD)} + ${money(e.netUSD, "USD")}`;
            return (
              <tr key={e.id} onClick={() => open(e)}>
                <td>
                  <span className="avatar">
                    {e.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div>
                    <b>{e.name}</b>
                    <small>
                      {e.id} · {e.role}
                    </small>
                  </div>
                </td>
                <td>{e.department}</td>
                <td>
                  <i className="currency">{e.currency}</i>
                </td>
                <td>{gross}</td>
                <td>{money(e.paye + e.nasscorp + e.other)}</td>
                <td>
                  <b>{net}</b>
                </td>
                <td>
                  <i className={`status ${e.status.toLowerCase()}`}>
                    {e.status}
                  </i>
                </td>
                <td>
                  <button
                    aria-label={`View ${e.name}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      open(e);
                    }}
                  >
                    <ChevronRight />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function EmployeeDetail({
  employee: e,
  notify,
}: {
  employee: Employee;
  notify: (m: string) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const taxable = e.grossLRD + e.grossUSD * 199.25;
  const net = e.netLRD + e.netUSD * 199.25;
  const tabs = ["Overview", "Employment", "Payroll", "Access & Roles", "Related Records", "Audit"];
  return (
    <>
      <SheetHeader>
        <SheetTitle>{e.name}</SheetTitle>
        <SheetDescription>
          {e.id} · {e.role}
        </SheetDescription>
      </SheetHeader>
      <div className="sheet-body">
        <div className="employee-hero">
          <span className="avatar xl">
            {e.name
              .split(" ")
              .map((x) => x[0])
              .join("")}
          </span>
          <div>
            <small>{e.department}</small>
            <b>{e.currency} payroll</b>
            <em>{e.status}</em>
          </div>
        </div>
        <nav className="employee-360-tabs" aria-label="Employee 360 sections">
          {tabs.map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item}</button>)}
        </nav>
        {tab === "Overview" && <>
          <section className="record-source"><Database/><div><small>CANONICAL SHARED RECORD</small><b>{e.id}</b><p>Employer Portal and Super Admin reference this same employee identity.</p></div><i>Mapped</i></section>
          <div className="employee-360-grid">
            {[ ["Employment status","Active"], ["Payroll eligibility",e.status], ["Supervisor","Operations Manager"], ["Identity verification","Verified"], ["Portal synchronization","Prototype mapping"], ["Last updated","Today · 10:42 AM"] ].map(row=><article key={row[0]}><small>{row[0]}</small><b>{row[1]}</b></article>)}
          </div>
        </>}
        {tab === "Employment" && <div className="detail-rows employee-tab-panel">
          {[ ["Legal employer","Monrovia Business Group"], ["Position",e.role], ["Department",e.department], ["Reports to","Operations Manager"], ["Employment start date","January 8, 2024"], ["Work location","Monrovia HQ"], ["TIN status","Verified"], ["NASSCORP status","Verified"] ].map(r=><p key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></p>)}
        </div>}
        {tab === "Payroll" && <>
          <section className="pay-summary"><div><small>Gross LRD</small><b>{money(e.grossLRD)}</b></div><div><small>Gross USD</small><b>{money(e.grossUSD,"USD")}</b></div><div><small>Taxable LRD equivalent</small><b>{money(taxable)}</b></div></section>
          <h3>Payroll calculation</h3>
          <div className="detail-rows">{[["Regular taxable earnings",money(taxable)],["Non-taxable earnings","0 LRD"],["Exchange rate","199.25 LRD per USD"],["Tax rule","LRA PAYE v2026.08 · effective Aug 1"],["PAYE calculated in LRD",money(e.paye)],["NASSCORP",money(e.nasscorp)],["Benefits, loans & other",money(e.other)],["Net pay LRD",money(e.netLRD)],["Net pay USD",money(e.netUSD,"USD")],["Payment destination",e.destination]].map(r=><p key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></p>)}</div>
          <section className="prior-compare"><div><small>July net equivalent</small><b>{money(net*.985)}</b></div><ArrowRight/><div><small>August net equivalent</small><b>{money(net)}</b></div><em>+1.5%</em></section>
          <button className="ai-explain" onClick={()=>notify(`ProspevaAI explained ${e.name}’s payroll change`)}><Activity/>Explain this calculation with ProspevaAI</button>
          <aside className="info-box"><LockKeyhole/><p>The approved exchange rate and tax-rule version are locked for this payroll. Any change requires recalculation and renewed approval.</p></aside>
          <button className="primary" onClick={()=>notify(`${e.name} payslip prepared`)}>Download payslip <Download/></button>
        </>}
        {tab === "Access & Roles" && <div className="employee-tab-panel access-record"><h3>Responsibilities and access</h3><div className="detail-rows">{[["Portal account","Personal account linked"],["Employer responsibility","Finance operations"],["System role","Employee self-service"],["Permission scope","Own payroll and documents"],["MFA","Required"],["Access review","Due Dec 31, 2026"]].map(r=><p key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></p>)}</div><button className="primary" onClick={()=>notify("Access review request created")}>Start access review</button></div>}
        {tab === "Related Records" && <div className="related-records employee-tab-panel">{[["Person identity","PER-0001042"],["Employer employee",e.id],["Prospeva wallet","WAL-LRD-001042"],["Current payroll","PAY-2026-000091"],["Super Admin record","Shared record mapped"]].map(r=><button key={r[0]} onClick={()=>notify(`${r[0]} opened in shared-record view`)}><span><small>{r[0]}</small><b>{r[1]}</b></span><ChevronRight/></button>)}</div>}
        {tab === "Audit" && <div className="audit-timeline employee-tab-panel"><p><CheckCircle2/><span><b>Payroll record reviewed</b><small>Today · James Doe · COR-PAY-9201842</small></span></p><p><CheckCircle2/><span><b>Payment destination verified</b><small>Aug 21 · Identity Service</small></span></p><p><CheckCircle2/><span><b>Employment profile updated</b><small>Jul 30 · Hawa Sirleaf</small></span></p><p><CheckCircle2/><span><b>Shared record created</b><small>Jan 8, 2024 · Employer Onboarding</small></span></p></div>}
      </div>
    </>
  );
}

function AddEmployee({ close, notify }: any) {
  const [step, setStep] = useState(1);
  return (
    <>
      <SheetHeader>
        <SheetTitle>Add Employee</SheetTitle>
        <SheetDescription>
          Step {step} of 3 · Monrovia Business Group
        </SheetDescription>
      </SheetHeader>
      <div className="sheet-body">
        <div className="stepper">
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= step ? "active" : ""}>
              {i}
            </span>
          ))}
        </div>
        {step === 1 && (
          <>
            <h3>Employment details</h3>
            <label>
              Legal name
              <input placeholder="Employee’s full legal name" />
            </label>
            <label>
              Employee ID
              <input defaultValue="EMP-0249" />
            </label>
            <label>
              Department
              <Select defaultValue="Operations">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Operations",
                    "Finance",
                    "People",
                    "Sales",
                    "Administration",
                  ].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label>
              Employment start date
              <input type="date" defaultValue="2026-09-14" />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <h3>Payroll configuration</h3>
            <label>
              Payment currency
              <Select defaultValue="Mixed">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["LRD", "USD", "Mixed"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label>
              Monthly gross LRD
              <input defaultValue="150000" />
            </label>
            <label>
              Monthly gross USD
              <input defaultValue="350" />
            </label>
            <label>
              Mixed net split
              <Select defaultValue="60-40">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60-40">60% USD · 40% LRD</SelectItem>
                  <SelectItem value="40-60">40% USD · 60% LRD</SelectItem>
                  <SelectItem value="fixed">Fixed amounts</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </>
        )}
        {step === 3 && (
          <>
            <h3>Identity & destination</h3>
            <label>
              TIN
              <input placeholder="LRA taxpayer ID" />
            </label>
            <label>
              NASSCORP ID
              <input placeholder="NASSCORP member number" />
            </label>
            <label>
              Payment destination
              <Select defaultValue="wallet">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Prospeva wallet</SelectItem>
                  <SelectItem value="bank">Bank account</SelectItem>
                  <SelectItem value="mobile">Mobile money</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <aside className="info-box">
              <ShieldCheck />
              <p>
                The employee will receive a secure invitation to verify identity
                and payment destination.
              </p>
            </aside>
          </>
        )}
        <div className="sheet-actions">
          {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
          <button
            className="primary"
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else {
                notify("Employee invitation sent");
                close();
              }
            }}
          >
            {step < 3 ? "Continue" : "Add employee"}
            <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

function Payroll({ openEmployee, notify }: any) {
  const [stage, setStage] = useState(2),
    [rate, setRate] = useState("199.25"),
    [locked, setLocked] = useState(true);
  const stages = [
    "Setup",
    "Validate",
    "Calculate",
    "Review",
    "Approve",
    "Funding",
  ];
  return (
    <>
      <PageHead
        eyebrow="PAYROLL ENGINE"
        title="Run August payroll"
        copy="All taxable earnings are converted and assessed for PAYE in Liberian dollars."
        action="New payroll run"
        onAction={() => setStage(0)}
      />
      <section className="run-stepper">
        {stages.map((s, i) => (
          <button
            key={s}
            className={i < stage ? "done" : i === stage ? "current" : ""}
            onClick={() => setStage(i)}
          >
            <span>{i < stage ? <Check /> : i + 1}</span>
            <b>{s}</b>
          </button>
        ))}
      </section>
      <section className="payroll-controls">
        <article className="panel">
          <PanelTitle icon={CalendarDays} title="Payroll setup" />
          <div className="form-grid">
            <label>
              Pay period
              <Select defaultValue="aug">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aug">August 1–31, 2026</SelectItem>
                  <SelectItem value="sep">September 1–30, 2026</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label>
              Pay date
              <input type="date" defaultValue="2026-08-31" />
            </label>
            <label>
              Approved FX rate
              <div className="locked-field">
                <input
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value);
                    setLocked(false);
                  }}
                />
                <span>LRD / USD</span>
              </div>
            </label>
            <label>
              Rate source
              <Select defaultValue="bank">
                <SelectTrigger className="sheet-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Partner Bank FX Feed</SelectItem>
                  <SelectItem value="cbl">CBL reference rate</SelectItem>
                  <SelectItem value="employer">
                    Employer approved rate
                  </SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
          {!locked && (
            <aside className="warning-box">
              <AlertTriangle />
              <div>
                <b>Exchange rate changed</b>
                <p>
                  Recalculate payroll and obtain renewed approval before
                  submission.
                </p>
              </div>
              <button
                onClick={() => {
                  setLocked(true);
                  notify("Payroll recalculated and rate locked");
                }}
              >
                Recalculate
              </button>
            </aside>
          )}
          <div className="toggle-row">
            <span>
              Include authorized benefits, loans and goods-on-account deductions
            </span>
            <Switch
              defaultChecked
              onCheckedChange={(value) =>
                notify(
                  `Authorized deductions ${value ? "included" : "excluded from draft"}`,
                )
              }
            />
          </div>
        </article>
        <article className="panel payroll-readiness">
          <PanelTitle icon={ClipboardCheck} title="Readiness" />
          <div className="readiness-score">
            <b>97.6%</b>
            <Progress value={97.6} />
            <small>242 of 248 employees ready</small>
          </div>
          {[
            ["Employee identity", "245 / 248"],
            ["Attendance approved", "243 / 248"],
            ["Payment destinations", "248 / 248"],
            ["Loan schedules", "94 / 96"],
            ["Benefit elections", "216 / 248"],
          ].map((r) => (
            <p key={r[0]}>
              <span>{r[0]}</span>
              <b>{r[1]}</b>
            </p>
          ))}
          <button onClick={() => notify("Validation completed")}>
            <RefreshCw />
            Run validation
          </button>
        </article>
      </section>
      <article className="panel table-panel">
        <PanelTitle
          icon={Users}
          title="Employee payroll calculations"
          action="Download calculation file"
          onAction={() => notify("Payroll calculation downloaded")}
        />
        <EmployeeTable rows={employees} open={openEmployee} />
        <footer className="payroll-total">
          <span>6 employees shown · 248 total</span>
          <div>
            <small>Gross</small>
            <b>18,450,000 LRD</b>
          </div>
          <div>
            <small>Deductions</small>
            <b>5,243,500 LRD</b>
          </div>
          <div>
            <small>Net</small>
            <b>13,206,500 LRD</b>
          </div>
        </footer>
      </article>
      <section className="payroll-submit">
        <div>
          <ShieldCheck />
          <span>
            <b>Maker-checker required</b>
            <small>
              Submitting locks this payroll version and sends it to an
              authorized approver.
            </small>
          </span>
        </div>
        <button
          className="primary"
          disabled={!locked}
          onClick={() => {
            setStage(4);
            notify("Payroll submitted for approval");
          }}
        >
          Submit payroll for approval <ArrowRight />
        </button>
      </section>
    </>
  );
}

function Attendance({ notify }: any) {
  const [resolved, setResolved] = useState<string[]>([]);
  const rows = [
    ["ATT-091", "Hawa Sirleaf", "Missing clock-out", "Aug 18 · 8.0 hrs"],
    ["ATT-092", "Kelvin Freeman", "Unapproved overtime", "Aug 22 · 3.5 hrs"],
    ["ATT-093", "Samuel Toe", "Late timesheet", "Aug 25 · 8.0 hrs"],
    ["ATT-094", "Martha Kallon", "Leave overlap", "Aug 28 · 4.0 hrs"],
  ];
  return (
    <>
      <PageHead
        eyebrow="TIME & ATTENDANCE"
        title="Attendance review"
        copy="Resolve time exceptions before they affect payroll calculation."
        action="Import attendance"
        onAction={() => notify("Attendance import opened")}
      />
      <section className="mini-stats">
        <Stat label="Expected records" value="5,456" icon={Clock3} />
        <Stat label="Approved" value="5,431" icon={CheckCircle2} tone="green" />
        <Stat
          label="Exceptions"
          value="25"
          icon={AlertTriangle}
          tone="orange"
        />
        <Stat
          label="Payroll impact"
          value="84,500 LRD"
          icon={CircleDollarSign}
        />
      </section>
      <article className="panel exception-table">
        <PanelTitle icon={AlertTriangle} title="Exceptions requiring review" />
        {rows.map((r) => (
          <div key={r[0]} className={resolved.includes(r[0]) ? "resolved" : ""}>
            <span>
              <AlertTriangle />
            </span>
            <div>
              <small>{r[0]}</small>
              <b>{r[1]}</b>
              <em>
                {r[2]} · {r[3]}
              </em>
            </div>
            <button onClick={() => notify(`${r[0]} detail opened`)}>
              Review
            </button>
            <button
              onClick={() => {
                setResolved((v) => [...v, r[0]]);
                notify("Attendance exception approved");
              }}
            >
              <Check />
              Approve
            </button>
          </div>
        ))}
      </article>
    </>
  );
}
function Deductions({ notify }: any) {
  const types = [
    ["LRA PAYE", "2,060,000 LRD", "248 employees", "Statutory", true],
    [
      "NASSCORP employee NPS",
      "736,000 LRD",
      "248 employees",
      "Statutory",
      true,
    ],
    ["Payroll loans", "1,414,000 LRD", "96 employees", "Authorized", true],
    ["Goods on account", "512,000 LRD", "41 employees", "Authorized", true],
    ["Other deductions", "234,500 LRD", "28 employees", "Employer", false],
  ];
  return (
    <>
      <PageHead
        eyebrow="DEDUCTION CONTROL"
        title="Deductions"
        copy="Review statutory and authorized deductions before payroll approval."
        action="Add deduction rule"
        onAction={() => notify("Deduction rule flow opened")}
      />
      <div className="deduction-grid">
        {types.map((r) => (
          <article className="panel" key={String(r[0])}>
            <div>
              <span>
                <ReceiptText />
              </span>
              <i>{r[3]}</i>
              <Switch
                defaultChecked={Boolean(r[4])}
                onCheckedChange={(value) =>
                  notify(`${r[0]} ${value ? "enabled" : "paused"}`)
                }
              />
            </div>
            <h3>{r[0]}</h3>
            <b>{r[1]}</b>
            <p>{r[2]}</p>
            <button onClick={() => notify(`${r[0]} register opened`)}>
              View register <ChevronRight />
            </button>
          </article>
        ))}
      </div>
      <article className="panel">
        <PanelTitle icon={ShieldCheck} title="Deduction order" />
        <div className="priority-flow">
          {[
            "PAYE",
            "NASSCORP",
            "Court orders",
            "Payroll loans",
            "Goods on account",
            "Other authorized",
          ].map((x, i) => (
            <span key={x}>
              <i>{i + 1}</i>
              <b>{x}</b>
              {i < 5 && <ArrowRight />}
            </span>
          ))}
        </div>
      </article>
    </>
  );
}
function Benefits({ notify }: any) {
  const plans = [
    ["Health", "216", "384,000 LRD", "96,000 LRD"],
    ["Life", "184", "110,000 LRD", "36,000 LRD"],
    ["Retirement", "128", "95,000 LRD", "72,000 LRD"],
    ["Transport", "72", "48,000 LRD", "24,000 LRD"],
    ["Housing", "31", "32,000 LRD", "8,000 LRD"],
    ["Education", "18", "15,000 LRD", "10,000 LRD"],
  ];
  return (
    <>
      <PageHead
        eyebrow="EMPLOYEE BENEFITS"
        title="Benefits administration"
        copy="Manage employer contributions, employee elections and payroll deductions."
        action="Add benefit plan"
        onAction={() => notify("Benefit setup opened")}
      />
      <section className="mini-stats">
        <Stat label="Employees enrolled" value="216 of 248" icon={Users} />
        <Stat
          label="Employer contribution"
          value="684,000 LRD"
          icon={Gift}
          tone="green"
        />
        <Stat
          label="Employee contribution"
          value="246,000 LRD"
          icon={HandCoins}
        />
        <Stat label="Pending elections" value="7" icon={Clock3} tone="orange" />
      </section>
      <div className="benefit-grid">
        {plans.map((p) => (
          <article className="panel" key={p[0]}>
            <span>
              <HeartHandshake />
            </span>
            <div>
              <h3>{p[0]}</h3>
              <small>{p[1]} enrolled</small>
            </div>
            <p>
              <span>Employer</span>
              <b>{p[2]}</b>
            </p>
            <p>
              <span>Employee</span>
              <b>{p[3]}</b>
            </p>
            <button onClick={() => notify(`${p[0]} plan opened`)}>
              Manage plan <ChevronRight />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function Loans({ notify }: any) {
  const loans = [
    ["Martha Kallon", "Unity Bank", "112.00 USD", "1,008.00 USD", "Ready"],
    ["Samuel Toe", "Liberty Microfinance", "115.00 USD", "805.00 USD", "Ready"],
    [
      "Hawa Sirleaf",
      "Community Credit",
      "22,000 LRD",
      "176,000 LRD",
      "Exception",
    ],
    ["James Doe", "Unity Bank", "85.00 USD", "510.00 USD", "Ready"],
  ];
  return (
    <>
      <PageHead
        eyebrow="PAYROLL-CONNECTED CREDIT"
        title="Employee loan repayments"
        copy="Deduct only authorized installments and credit each lender without exposing private loan purpose."
        action="Review lender file"
        onAction={() => notify("Lender settlement file opened")}
      />
      <section className="loan-banner">
        <Landmark />
        <div>
          <small>THIS PAYROLL</small>
          <b>1,414,000 LRD equivalent</b>
          <p>96 active loans · 94 ready · 2 exceptions</p>
        </div>
        <aside>
          <ShieldCheck />
          Employer sees deduction amount and status only.
        </aside>
      </section>
      <article className="panel">
        <PanelTitle icon={RefreshCw} title="Scheduled repayments" />
        <div className="loan-list">
          {loans.map((l) => (
            <button
              key={l[0]}
              onClick={() => notify(`${l[0]} loan deduction opened`)}
            >
              <span className="avatar">
                {l[0]
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <div>
                <b>{l[0]}</b>
                <small>{l[1]}</small>
              </div>
              <strong>{l[2]}</strong>
              <em>Balance {l[3]}</em>
              <i className={`status ${l[4].toLowerCase()}`}>{l[4]}</i>
              <ChevronRight />
            </button>
          ))}
        </div>
      </article>
    </>
  );
}

function PayrollFinancing({ openAction, notify }: any) {
  const evidence = [
    ["Employer profile", "Medium enterprise", "KYB and beneficial owners verified", Building2],
    ["Payroll size", "248 employees", "242 payroll-ready · 6 held", Users],
    ["Payroll requirement", "18,450,000 LRD", "Locked August 2026 batch", BriefcaseBusiness],
    ["Funding history", "96.4% on time", "Trailing 12 payroll cycles", CalendarDays],
    ["Payroll completion", "99.1%", "Completed employee instructions", CheckCircle2],
    ["Reconciliation", "2 open items", "No material aged break", RefreshCw],
    ["Existing obligations", "Review required", "Affordability remains lender-owned", ShieldCheck],
    ["Requested use", "August payroll gap", "Designated payroll account only", WalletCards],
  ] as const;
  const lenders = [
    { name: "Unity Bank", product: "Payroll bridge facility", amount: "Up to 3,000,000 LRD", term: "30–60 days", repayment: "Scheduled employer repayment", status: "Eligible to request", tone: "ready" },
    { name: "Commerce Growth Finance", product: "Revolving payroll line", amount: "Up to 5,000,000 LRD", term: "12-month line · lender renewals", repayment: "Monthly draw repayment", status: "Evidence review", tone: "review" },
    { name: "Monrovia SME Fund", product: "Short-term payroll support", amount: "Up to 2,000,000 LRD", term: "One payroll cycle", repayment: "Lender-defined fixed schedule", status: "Invitation required", tone: "invite" },
  ];
  const lifecycle = ["Request", "Employer consent", "Evidence verified", "Lender review", "Offer", "Employer accepts", "Funding", "Repayment & monitoring"];
  return (
    <section className="payroll-finance-workspace">
      <PageHead
        eyebrow="EMPLOYER PAYROLL FINANCING"
        title="Request financing for a verified payroll"
        copy="Request payroll funding only from lenders assigned to this employer. Each lender sets its own eligibility, pricing, limits, security, approval and repayment terms."
        action="Request payroll financing"
        onAction={() => openAction("Request payroll financing")}
      />
      <section className="payroll-finance-principle">
        <HandCoins />
        <div><small>PROSPEVA FACILITATES · THE LENDER DECIDES</small><h2>Financing is tied to a locked payroll batch</h2><p>Prospeva supplies consented, verified employer and payroll evidence. The assigned lender independently underwrites the employer and, if approved, sends proceeds only to the designated payroll funding account.</p></div>
        <i>Demo data</i>
      </section>
      <section className="payroll-finance-records">
        <div><small>EMPLOYER</small><b>Monrovia Business Group</b><em>ORG-EMP-2081</em></div>
        <div><small>FINANCING REQUEST</small><b>PF-20418</b><em>COR-FIN-88422</em></div>
        <div><small>ELIGIBILITY</small><b className="good">Eligible to request</b><em>Not a credit approval</em></div>
        <div><small>LINKED PAYROLL</small><b>PAY-2026-08-V3</b><em>Locked batch only</em></div>
      </section>
      <section className="payroll-finance-kpis">
        <Stat label="Payroll requirement" value="18.45M LRD" icon={BriefcaseBusiness} note="Locked batch" />
        <Stat label="Cleared funds" value="16.91M LRD" icon={WalletCards} tone="green" note="91.7% funded" />
        <Stat label="Eligible gap" value="1.54M LRD" icon={CircleDollarSign} tone="orange" note="Subject to lender review" />
        <Stat label="Assigned lenders" value="3" icon={Landmark} note="Demo relationships" />
      </section>
      <section className="payroll-finance-evidence">
        {evidence.map(([label, value, note, Icon]) => <article key={label}><span><Icon /></span><div><small>{label}</small><b>{value}</b><em>{note}</em></div><BadgeCheck /></article>)}
      </section>
      <section className="payroll-finance-controls">
        <article className="panel"><PanelTitle icon={ShieldCheck} title="Eligibility and affordability controls" />{[
          ["Existing employer financing","0 active facilities","Clear"],
          ["Pending applications","2 requests","Review"],
          ["Payroll completion history","99.1%","Clear"],
          ["Funding timeliness","96.4% on time","Clear"],
          ["Material reconciliation breaks","None aged","Clear"],
          ["Restrictions or compliance holds","No blocking hold","Clear"],
          ["Duplicate financing on this payroll","No duplicate found","Clear"],
        ].map(row=><p key={row[0]}><span><b>{row[0]}</b><small>{row[1]}</small></span><i className={row[2]==="Clear"?"clear":"review"}>{row[2]}</i></p>)}</article>
        <article className="panel"><PanelTitle icon={BriefcaseBusiness} title="Requested payroll coverage" />{[
          ["Locked payroll requirement","18,450,000 LRD"],
          ["Employer cleared funds","16,910,000 LRD"],
          ["Requested lender coverage","1,540,000 LRD · 8.3%"],
          ["Expected receivables","2,450,000 LRD · Sep 28"],
          ["Proposed repayment source","Employer operating receivables"],
          ["Disbursement destination","Payroll account •••• 4587"],
        ].map(row=><p className="coverage-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><BadgeCheck /></p>)}</article>
      </section>
      <section className="payroll-finance-grid">
        <article className="panel assigned-lenders">
          <PanelTitle icon={Landmark} title="Assigned lender options" action="Compare evidence" onAction={() => notify("Employer evidence comparison opened")} />
          {lenders.map((lender, index) => <div className="payroll-lender" key={lender.name}>
            <header><span><Landmark /></span><div><small>ASSIGNED LENDER · DEMO</small><h3>{lender.name}</h3></div><i className={lender.tone}>{lender.status}</i></header>
            <div className="payroll-product"><small>FINANCING STRUCTURE</small><b>{lender.product}</b><p>{lender.amount} · {lender.term}</p></div>
            <p><span>Repayment</span><b>{lender.repayment}</b></p>
            <p><span>Decision owner</span><b>{lender.name}</b></p>
            <button onClick={() => index === 0 ? openAction("Request payroll financing") : notify(`${lender.name} requirements opened`)}>{index === 0 ? "Start request" : "View requirements"}<ArrowRight /></button>
          </div>)}
        </article>
        <aside className="payroll-finance-side">
          <article className="panel"><PanelTitle icon={FileCheck2} title="Active requests" />
            {[ ["PF-20418", "Unity Bank", "1,540,000 LRD", "Lender review"], ["PF-20291", "Commerce Growth Finance", "2,100,000 LRD", "Information required"] ].map(r => <button className="finance-request-row" key={r[0]} onClick={() => notify(`${r[0]} opened`)}><div><code>{r[0]}</code><b>{r[1]}</b><small>{r[2]}</small></div><i>{r[3]}</i><ChevronRight /></button>)}
          </article>
          <article className="panel payroll-use-control"><LockKeyhole /><div><small>RESTRICTED USE</small><h3>Payroll account disbursement</h3><p>Approved funds cannot be withdrawn for an unrelated purpose. Payroll release still requires cleared funds, a locked batch, maker-checker approval and employee readiness.</p></div></article>
          <article className="panel"><PanelTitle icon={ShieldCheck} title="Employer protections" />{["No automatic approval", "Complete lender pricing and repayment disclosure", "Employer acceptance before funding", "No lender access to private employee loan purposes", "Versioned consent and audit history"].map(item => <p className="finance-protection" key={item}><CheckCircle2 />{item}</p>)}</article>
        </aside>
      </section>
      <section className="payroll-offer-comparison panel">
        <PanelTitle icon={FileCheck2} title="Compare lender offers" action="Review selected offer" onAction={() => openAction("Review payroll financing offer")} />
        <div className="payroll-offer-head"><b>Terms</b><b>Unity Bank</b><b>Commerce Growth Finance</b></div>
        {[
          ["Approved amount","1,540,000 LRD","Up to 3,000,000 LRD"],
          ["Total repayment","1,663,200 LRD","Draw amount + lender charge"],
          ["Lender charge","8% fixed","2.1% monthly on drawn balance"],
          ["Prospeva / partner fee","0 / 12,500 LRD","0 / 15,000 LRD"],
          ["Term","60 days","12-month revolving line"],
          ["Payment frequency","Single maturity payment","Monthly per draw"],
          ["Security","Employer undertaking","Receivables assignment"],
          ["Late-payment treatment","Lender schedule applies","Lender schedule applies"],
          ["Early repayment","No penalty","No penalty"],
          ["Offer expiration","Sep 26, 2026","Oct 2, 2026"],
        ].map(row=><div key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><b>{row[2]}</b></div>)}
      </section>
      <section className="payroll-finance-vault">
        <article className="panel"><PanelTitle icon={FolderLock} title="Financing evidence vault" action="Add document" onAction={() => notify("Secure financing document upload opened")} />{[
          ["Employer KYB and owners","Verified","Consent v3"],
          ["Locked payroll register","PAY-2026-08-V3","Generated by Prospeva"],
          ["Funding and completion history","12 cycles","Lender access granted"],
          ["Bank and receivables evidence","3 documents","Purpose restricted"],
          ["Financing agreement","Offer version 2","Awaiting acceptance"],
          ["Repayment schedule","Draft","Lender-controlled"],
        ].map(row=><button key={row[0]} onClick={() => notify(`${row[0]} opened`)}><FolderLock /><span><b>{row[0]}</b><small>{row[1]}</small></span><i>{row[2]}</i><ChevronRight /></button>)}</article>
        <article className="panel"><PanelTitle icon={LockKeyhole} title="Approval authority and consent" />{[
          ["Request initiation","Finance Approver, CEO or delegated officer"],
          ["Offer acceptance","CEO / Head plus independent Finance checker"],
          ["Self-approval","Prohibited"],
          ["Recurring facility draws","Threshold and payroll-version controlled"],
          ["Evidence access","Selected lender only · expires automatically"],
        ].map(row=><p className="authority-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b></p>)}<button onClick={() => openAction("Manage payroll financing consent")}>Manage consent and authority</button></article>
      </section>
      <section className="payroll-servicing-grid">
        <article className="panel payroll-servicing-summary"><PanelTitle icon={CircleDollarSign} title="Facility servicing" />
          <div className="payroll-servicing-kpis">{[["Original amount","1,540,000 LRD"],["Outstanding","1,120,000 LRD"],["Lender charges","123,200 LRD"],["Amount repaid","420,000 LRD"],["Next payment","Sep 30, 2026"],["Past due","0 LRD"]].map(row=><div key={row[0]}><small>{row[0]}</small><b>{row[1]}</b></div>)}</div>
          <div className="payroll-servicing-meter"><span><i style={{width:"27%"}} /></span><p><b>27% repaid</b><small>Demo facility · reconciled through Sep 20</small></p></div>
          <div className="payroll-servicing-actions"><button onClick={() => notify("Payroll financing statement prepared")}><Download />Statement</button><button onClick={() => openAction("Dispute payroll financing repayment")}><AlertTriangle />Report issue</button><button onClick={() => openAction("Request payroll financing hardship support")}><HeartHandshake />Hardship support</button></div>
        </article>
        <article className="panel payroll-finance-alerts"><PanelTitle icon={Bell} title="Deadlines and notifications" />{[
          ["Evidence requested","Updated receivables schedule","Due Sep 24"],
          ["Offer expiration","Unity Bank offer version 2","Sep 26"],
          ["Upcoming repayment","420,000 LRD scheduled","Sep 30"],
          ["Covenant review","Payroll completion threshold","Oct 5"],
        ].map(row=><button key={row[0]} onClick={() => notify(`${row[0]} opened`)}><Bell /><span><b>{row[0]}</b><small>{row[1]}</small></span><i>{row[2]}</i><ChevronRight /></button>)}</article>
      </section>
      <section className="payroll-finance-lifecycle" aria-label="Payroll financing lifecycle">{lifecycle.map((step, index) => <span key={step}><i>{index + 1}</i><b>{step}</b></span>)}</section>
      <section className="panel payroll-finance-boundary"><AlertTriangle /><div><b>Payroll financing does not release payroll automatically</b><p>The financing request and the payroll approval remain separate controlled workflows. External lenders and payment providers stay disabled until connected and certified.</p></div><button onClick={() => notify("Payroll financing policy opened")}>View policy</button></section>
    </section>
  );
}

function Payments({ openAction, notify }: any) {
  return (
    <>
      <PageHead
        eyebrow="PAYROLL PAYMENTS"
        title="Funding and payment release"
        copy="Monitor cleared balances and route approved payroll through connected Liberian payment rails."
        action="Add funding source"
        onAction={() => openAction("Add funding source")}
      />
      <section className="payment-layout">
        <article className="panel account-card">
          <PanelTitle icon={Landmark} title="Designated payroll account" />
          <small>Monrovia Business Group · •••• 4587</small>
          <h2>16,910,000 LRD</h2>
          <p>Cleared available balance</p>
          <Progress value={91.7} />
          <div>
            <span>Required</span>
            <b>18,450,000 LRD</b>
          </div>
          <div>
            <span>Funding gap</span>
            <b className="red-text">1,540,000 LRD</b>
          </div>
          <button
            className="primary"
            onClick={() => openAction("Add payroll funds")}
          >
            Add funds
          </button>
        </article>
        <article className="panel">
          <PanelTitle icon={Network} title="Provider integration readiness" />
          {[
            ["IIPS / NEPS", "Domestic salaries and statutory payments", "Integration pending"],
            ["Partner Bank API", "Cleared balance monitoring", "Demo only"],
            ["Orange Money", "Employee mobile-money payouts", "Disabled"],
            ["MTN MoMo", "Employee mobile-money payouts", "Disabled"],
          ].map((r) => (
            <div className="rail-row" key={r[0]}>
              <Network />
              <span>
                <b>{r[0]}</b>
                <small>{r[1]}</small>
              </span>
              <i>{r[2]}</i>
              <Switch
                defaultChecked={false}
                onCheckedChange={(value) =>
                  notify(`${r[0]} ${value ? "enabled" : "paused"}`)
                }
              />
            </div>
          ))}
        </article>
        <article className="panel release-card">
          <PanelTitle icon={Clock3} title="Automatic release policy" />
          <div className="toggle-row">
            <span>Monitor cleared balance</span>
            <Switch
              defaultChecked
              onCheckedChange={(value) =>
                notify(
                  `Cleared-balance monitoring ${value ? "enabled" : "paused"}`,
                )
              }
            />
          </div>
          <div className="toggle-row">
            <span>Release after maker-checker approval</span>
            <Switch
              defaultChecked
              onCheckedChange={(value) =>
                notify(`Maker-checker release ${value ? "required" : "paused"}`)
              }
            />
          </div>
          <div className="toggle-row">
            <span>Stop at funding deadline</span>
            <Switch
              defaultChecked
              onCheckedChange={(value) =>
                notify(
                  `Funding deadline control ${value ? "enabled" : "paused"}`,
                )
              }
            />
          </div>
          <label>
            Funding deadline
            <input type="datetime-local" defaultValue="2026-08-30T17:00" />
          </label>
          <button onClick={() => notify("Release policy saved")}>
            Save release policy
          </button>
        </article>
      </section>
    </>
  );
}
function Compliance({ go, notify }: any) {
  const issues = [
    ["Missing TIN", "3 employees", "High", "LRA PAYE file blocked"],
    [
      "Missing NASSCORP ID",
      "2 employees",
      "High",
      "NASSCORP submission blocked",
    ],
    ["Attendance exceptions", "5 employees", "Medium", "Gross pay may change"],
    [
      "Loan deduction exceptions",
      "2 employees",
      "Medium",
      "Lender repayment held",
    ],
  ];
  return (
    <>
      <PageHead
        eyebrow="PAYROLL COMPLIANCE"
        title="Compliance & exceptions"
        copy="Resolve identity, statutory and payroll exceptions before approval."
        action="Download filing pack"
        onAction={() => notify("Compliance filing pack downloaded")}
      />
      <section className="compliance-score">
        <ShieldCheck />
        <div>
          <small>PAYROLL READINESS</small>
          <b>97.6%</b>
          <Progress value={97.6} />
          <p>6 employee records require attention.</p>
        </div>
        <aside>
          <CheckCircle2 />
          PAYE calculations complete in LRD
        </aside>
      </section>
      <div className="issue-grid">
        {issues.map((i) => (
          <article className="panel" key={i[0]}>
            <span>
              <AlertTriangle />
            </span>
            <i>{i[2]}</i>
            <h3>{i[0]}</h3>
            <b>{i[1]}</b>
            <p>{i[3]}</p>
            <button
              onClick={() =>
                go(i[0].includes("Attendance") ? "Attendance" : "Employees")
              }
            >
              Resolve issue <ArrowRight />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function Reports({ notify }: any) {
  const reports = [
    ["PAYE Monthly Return", "LRA-ready PAYE liability and employee schedule"],
    [
      "NASSCORP Contribution File",
      "Employee NPS, employer NPS and EIS contribution file",
    ],
    ["Employee Payroll Register", "Gross, deductions and net pay by employee"],
    [
      "Bank Payment Instruction",
      "Approved destination-level salary instructions",
    ],
    [
      "Benefits Contribution Report",
      "Employer and employee benefit contributions",
    ],
    [
      "Loan Repayment File",
      "Authorized lender deductions and settlement totals",
    ],
    [
      "Employer Payroll Financing",
      "Requests, lender offers, consented evidence, funding and repayment status",
    ],
    [
      "Payroll Reconciliation",
      "Released, settled, failed, returned and reversed items",
    ],
    [
      "Audit & Approval Pack",
      "Calculation versions, approvals and material changes",
    ],
  ];
  return (
    <>
      <PageHead
        eyebrow="REPORTING CENTER"
        title="Reports & statutory files"
        copy="Generate audit-ready payroll, tax, benefits and payment records."
      />
      <div className="report-grid">
        {reports.map((r, i) => (
          <article className="panel" key={r[0]}>
            <span>
              <FileCheck2 />
            </span>
            <i>{i < 2 ? "STATUTORY" : "OPERATIONS"}</i>
            <h3>{r[0]}</h3>
            <p>{r[1]}</p>
            <Select defaultValue="pdf">
              <SelectTrigger className="report-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={() => notify(`${r[0]} generated`)}>
              <Download />
              Generate
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function Approvals({ notify }: any) {
  const seed = [
    [
      "APR-4812",
      "August 2026 payroll",
      "18,450,000 LRD",
      "James Doe",
      "Payroll",
    ],
    [
      "APR-4813",
      "Payroll bank account change",
      "Security-sensitive",
      "Martha Kallon",
      "Settings",
    ],
    [
      "APR-4814",
      "Benefit contribution update",
      "110,000 LRD",
      "Hawa Sirleaf",
      "Benefits",
    ],
    [
      "APR-4815",
      "Manual deduction adjustment",
      "22,000 LRD",
      "Samuel Toe",
      "Deduction",
    ],
  ];
  const [items, setItems] = useState(
    seed.map((r) => ({ r, status: "Pending" })),
  );
  const decide = (i: number, status: string) => {
    setItems((v) => v.map((x, n) => (n === i ? { ...x, status } : x)));
    notify(`Request ${status.toLowerCase()}`);
  };
  return (
    <>
      <PageHead
        eyebrow="MAKER-CHECKER"
        title="Approval inbox"
        copy="Independent approval is required before money, access or payroll rules change."
      />
      <section className="approval-policy">
        <ShieldCheck />
        <div>
          <b>Two-officer control is active</b>
          <p>
            Payroll and high-risk changes require an authorized checker and MFA
            transaction signing.
          </p>
        </div>
        <span>
          {items.filter((x) => x.status === "Pending").length} pending
        </span>
      </section>
      <div className="approval-list">
        {items.map((x, i) => (
          <article className="panel" key={x.r[0]}>
            <span>
              <ClipboardCheck />
            </span>
            <div>
              <small>
                {x.r[0]} · {x.r[4]}
              </small>
              <h3>{x.r[1]}</h3>
              <p>Requested by {x.r[3]} · Today</p>
            </div>
            <strong>{x.r[2]}</strong>
            <i className={`status ${x.status.toLowerCase()}`}>{x.status}</i>
            {x.status === "Pending" && (
              <footer>
                <button onClick={() => decide(i, "Rejected")}>
                  <X />
                  Reject
                </button>
                <button onClick={() => decide(i, "Approved")}>
                  <Check />
                  Approve
                </button>
              </footer>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
function AuditLog({ notify }: { notify: (m: string) => void }) {
  const logs = [
    [
      "09:42",
      "James Doe",
      "Submitted August payroll for approval",
      "PAY-2026-08-v3",
    ],
    [
      "09:31",
      "System",
      "Locked exchange rate at 199.25 LRD/USD",
      "FX-LOCK-8281",
    ],
    [
      "09:18",
      "Martha Kallon",
      "Approved attendance exception ATT-091",
      "EMP-0246",
    ],
    ["08:54", "Hawa Sirleaf", "Updated NASSCORP ID", "EMP-0244"],
    ["Yesterday", "System", "Cleared bank balance confirmed", "BANK-4587"],
    ["Yesterday", "Samuel Toe", "Downloaded July payroll register", "RPT-3921"],
  ];
  const [q, setQ] = useState("");
  const [systemOnly, setSystemOnly] = useState(false);
  const shown = logs.filter(
    (l) =>
      (!systemOnly || l[1] === "System") &&
      l.join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHead
        eyebrow="IMMUTABLE RECORD"
        title="Audit log"
        copy="Every payroll calculation, approval, access change and payment event is timestamped."
      />
      <article className="panel audit-table">
        <div className="table-tools">
          <div>
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search audit activity"
            />
          </div>
          <button
            className={systemOnly ? "active" : ""}
            onClick={() => setSystemOnly((v) => !v)}
          >
            <SlidersHorizontal />
            {systemOnly ? "System only" : "Filters"}
          </button>
          <button onClick={() => notify("Audit export prepared")}>
            <Download />
            Export
          </button>
        </div>
        {shown.map((l) => (
          <div key={l[0] + l[2]}>
            <span>{l[0]}</span>
            <i>
              <Activity />
            </i>
            <div>
              <b>{l[2]}</b>
              <small>
                {l[1]} · {l[3]}
              </small>
            </div>
            <ShieldCheck />
          </div>
        ))}
        {shown.length === 0 && (
          <div>
            <span>—</span>
            <i>
              <Search />
            </i>
            <div>
              <b>No matching activity</b>
              <small>Try another search term.</small>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
function Settings({ notify }: any) {
  return (
    <>
      <PageHead
        eyebrow="EMPLOYER SETTINGS"
        title="Payroll configuration"
        copy="Control currency, exchange-rate governance, approvals, funding and security."
      />
      <section className="settings-grid">
        <article className="panel">
          <PanelTitle icon={CircleDollarSign} title="Currency & tax" />
          <label>
            Primary reporting currency
            <Select defaultValue="LRD">
              <SelectTrigger className="sheet-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LRD">LRD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label>
            Approved payroll FX source
            <Select defaultValue="bank">
              <SelectTrigger className="sheet-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Partner Bank FX Feed</SelectItem>
                <SelectItem value="cbl">CBL reference rate</SelectItem>
                <SelectItem value="manual">Authorized manual rate</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <div className="toggle-row">
            <span>Always calculate PAYE in LRD</span>
            <Switch defaultChecked disabled />
          </div>
        </article>
        <article className="panel">
          <PanelTitle icon={ShieldCheck} title="Approvals & security" />
          {[
            ["Maker-checker approval", true],
            ["MFA for authorized officers", true],
            ["OTP transaction signing", true],
            ["Allow payroll edits after approval", false],
          ].map((r) => (
            <div className="toggle-row" key={String(r[0])}>
              <span>{r[0]}</span>
              <Switch
                defaultChecked={Boolean(r[1])}
                onCheckedChange={(value) =>
                  notify(`${r[0]} ${value ? "enabled" : "disabled"}`)
                }
              />
            </div>
          ))}
        </article>
        <article className="panel">
          <PanelTitle icon={Landmark} title="Funding & release" />
          {[
            ["Cleared-balance monitoring", true],
            ["Automatic approved-payroll release", true],
            ["Low-balance escalation alerts", true],
            ["Allow automatic currency conversion", false],
          ].map((r) => (
            <div className="toggle-row" key={String(r[0])}>
              <span>{r[0]}</span>
              <Switch
                defaultChecked={Boolean(r[1])}
                onCheckedChange={(value) =>
                  notify(`${r[0]} ${value ? "enabled" : "disabled"}`)
                }
              />
            </div>
          ))}
        </article>
        <article className="panel">
          <PanelTitle icon={Users} title="Authorized officers" />
          <div className="officers">
            {[
              ["James Doe", "Payroll Manager"],
              ["Martha Kallon", "Finance Approver"],
              ["Hawa Sirleaf", "HR Administrator"],
            ].map((o) => (
              <div key={o[0]}>
                <span className="avatar">
                  {o[0]
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <p>
                  <b>{o[0]}</b>
                  <small>{o[1]} · MFA verified</small>
                </p>
                <BadgeCheck />
              </div>
            ))}
          </div>
          <button onClick={() => notify("Officer invitation opened")}>
            <UserPlus />
            Invite officer
          </button>
        </article>
      </section>
      <button
        className="primary save-settings"
        onClick={() => notify("Employer settings saved")}
      >
        Save settings <Check />
      </button>
    </>
  );
}
function ActionFlow({ action, close, notify }: any) {
  const [approved, setApproved] = useState(false);
  if (action === "Request payroll financing") return (
    <>
      <SheetHeader>
        <SheetTitle>Request payroll financing</SheetTitle>
        <SheetDescription>PF-DRAFT · Monrovia Business Group · Lender decision required</SheetDescription>
      </SheetHeader>
      <div className="sheet-body payroll-finance-form">
        <div className="finance-form-hero"><HandCoins /><div><small>VERIFIED PAYROLL GAP</small><b>1,540,000 LRD</b><p>August 2026 · PAY-2026-08-V3 · 248 employees</p></div><i>Demo</i></div>
        <label>Assigned lender<Select defaultValue="unity"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="unity">Unity Bank · Payroll bridge facility</SelectItem><SelectItem value="commerce">Commerce Growth Finance · Revolving line</SelectItem><SelectItem value="sme">Monrovia SME Fund · Short-term support</SelectItem></SelectContent></Select></label>
        <label>Payroll batch<Select defaultValue="aug"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="aug">August 2026 · Locked · PAY-2026-08-V3</SelectItem></SelectContent></Select></label>
        <label>Requested amount<input defaultValue="1,540,000 LRD" /></label>
        <label>Coverage requested<Select defaultValue="gap"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="25">25% of verified payroll gap</SelectItem><SelectItem value="50">50% of verified payroll gap</SelectItem><SelectItem value="gap">100% of verified payroll gap</SelectItem></SelectContent></Select></label>
        <label>Facility type<Select defaultValue="single"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">Single payroll bridge</SelectItem><SelectItem value="revolving">Recurring revolving payroll facility</SelectItem></SelectContent></Select></label>
        <label>Requested term<Select defaultValue="30"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">30 days</SelectItem><SelectItem value="60">60 days</SelectItem><SelectItem value="line">Revolving facility</SelectItem></SelectContent></Select></label>
        <label>Expected receivables<input defaultValue="2,450,000 LRD expected Sep 28, 2026" /></label>
        <label>Proposed repayment source<Select defaultValue="receivables"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="receivables">Employer operating receivables</SelectItem><SelectItem value="bank">Designated employer bank account</SelectItem><SelectItem value="other">Other lender-approved source</SelectItem></SelectContent></Select></label>
        <label>Business reason<textarea defaultValue="Cover the verified August payroll funding gap while receivables settle." /></label>
        <label>Authorized requester<Select defaultValue="finance"><SelectTrigger className="sheet-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="finance">Finance Approver</SelectItem><SelectItem value="ceo">CEO / Head of Organization</SelectItem><SelectItem value="gm">General Manager</SelectItem><SelectItem value="ops">Operations Manager</SelectItem></SelectContent></Select></label>
        <div className="finance-evidence-consent"><Database /><div><b>Evidence shared with the selected lender</b><small>KYB and owners, employer size, payroll amount and headcount, funding timeliness, payroll completion, returns and exceptions, reconciliation, existing obligations, restrictions and designated payroll account.</small></div></div>
        <div className="disclosure">{[
          ["Prospeva role", "Evidence, routing and servicing support"],
          ["Credit decision", "Assigned lender only"],
          ["Pricing and security", "Provided in the lender’s offer"],
          ["Disbursement destination", "Designated payroll funding account"],
          ["Payroll release", "Separate maker-checker approval required"],
        ].map(r => <p key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></p>)}</div>
        <label className="check-line"><input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} /><span><b>I consent to share the listed verified evidence</b><small>This creates a request for lender review—not a loan approval or immediate payroll release.</small></span></label>
        <button className="primary" disabled={!approved} onClick={() => { notify("Payroll financing request submitted for lender review"); close(); }}>Submit request securely <ShieldCheck /></button>
        <p className="finance-form-note"><LockKeyhole />A separate authorized checker must approve acceptance of any lender offer. The proposer cannot self-approve.</p>
      </div>
    </>
  );
  return (
    <>
      <SheetHeader>
        <SheetTitle>{action}</SheetTitle>
        <SheetDescription>
          Monrovia Business Group · Secure workflow
        </SheetDescription>
      </SheetHeader>
      <div className="sheet-body">
        <div className="action-hero">
          <Landmark />
          <div>
            <small>DESIGNATED PAYROLL ACCOUNT</small>
            <b>Partner Bank · •••• 4587</b>
            <p>Demo funding account · IIPS / NEPS integration pending</p>
          </div>
        </div>
        <label>
          Currency
          <Select defaultValue="LRD">
            <SelectTrigger className="sheet-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LRD">LRD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label>
          Amount
          <input defaultValue="1,540,000" />
        </label>
        <label>
          Funding source
          <Select defaultValue="bank">
            <SelectTrigger className="sheet-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Partner bank transfer</SelectItem>
              <SelectItem value="wallet">
                Prospeva organization wallet
              </SelectItem>
              <SelectItem value="manual">Manual bank deposit</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <div className="disclosure">
          {[
            ["Payment rail", "Demo simulation · IIPS / NEPS pending"],
            ["Prospeva fee", "0 LRD"],
            ["Partner fee", "0 LRD"],
            ["Total debit", "1,540,000 LRD"],
            ["Payroll balance after", "18,450,000 LRD"],
            ["Settlement estimate", "Unavailable until provider certification"],
          ].map((r) => (
            <p key={r[0]}>
              <span>{r[0]}</span>
              <b>{r[1]}</b>
            </p>
          ))}
        </div>
        <label className="check-line">
          <input
            type="checkbox"
            checked={approved}
            onChange={(e) => setApproved(e.target.checked)}
          />
          <span>
            <b>I reviewed the funding instruction</b>
            <small>This action will be recorded in the audit log.</small>
          </span>
        </label>
        <button
          className="primary"
          disabled={!approved}
          onClick={() => {
            notify(`${action} submitted`);
            close();
          }}
        >
          Submit securely <ShieldCheck />
        </button>
      </div>
    </>
  );
}
