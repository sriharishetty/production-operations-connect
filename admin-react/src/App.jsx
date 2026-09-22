import React, { useEffect, useMemo, useState } from "react";
import LoginScreen from "./Login.jsx";
import VendorEditor from "./VendorEditor.jsx";

const STORAGE = {
  authenticated: "productionOperationsAdminAuthenticated",
  email: "productionOperationsAdminEmail",
  password: "productionOperationsAdminPassword",
  vendors: "productionOperationsVendors",
  applications: "productionOperationsApplications",
  history: "productionOperationsAdminHistory"
};
const ADMINS = ["Srihari.Gangisetti@alaskaair.com", "Mohan.P@alaskaair.com", "Margaret.Jennifer@alaskaair.com", "Sharmini.M@alaskaair.com", "Srinivasanagasai.Chevitikanti@alaskaair.com"];
const fields = ["systemName", "category", "vendorCompanyName", "prodOpsEscalationProcess", "contactNumbers", "emailAddress", "vendorPOC", "aagItsPOC", "aagItsTeam", "infoUpdatedDate", "infoUpdatedBy", "infoApprovedDate", "infoApprovedBy"];

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

const workbookVendors = () => {
  if (!Array.isArray(window.masterData?.vendors)) return [];
  const fieldsToMerge = ["category", "vendorCompanyName", "prodOpsEscalationProcess", "contactNumbers", "emailAddress", "vendorPOC", "aagItsPOC", "aagItsTeam", "infoUpdatedDate", "infoUpdatedBy", "infoApprovedDate", "infoApprovedBy"];
  const records = [];
  window.masterData.vendors.forEach(vendor => {
    const mapped = {
      id: `its-application-vendors-${vendor.sourceRow}`,
      sourceRow: vendor.sourceRow,
      vendorDataVersion: 2,
      systemName: vendor.systemName || "",
      category: vendor.category || "",
      vendorCompanyName: vendor.vendor || "",
      prodOpsEscalationProcess: vendor.escalation || "",
      contactNumbers: vendor.phone || "",
      emailAddress: vendor.email || "",
      vendorPOC: vendor.vendorPoc || "",
      aagItsPOC: vendor.aagItsPoc || "",
      aagItsTeam: vendor.aagItsTeam || "",
      infoUpdatedDate: vendor.updatedDate || "",
      infoUpdatedBy: vendor.updatedBy || "",
      infoApprovedDate: vendor.approvedDate || "",
      infoApprovedBy: vendor.approvedBy || ""
    };
    if (mapped.systemName) {
      records.push(mapped);
      return;
    }
    const parent = records.at(-1);
    if (!parent) return;
    fieldsToMerge.forEach(field => {
      if (mapped[field]) parent[field] = [parent[field], mapped[field]].filter(Boolean).join("\n\n");
    });
  });
  return records;
};

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [grantingAccess, setGrantingAccess] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (!ADMINS.includes(email) || password !== (localStorage.getItem(STORAGE.password) || "123456789")) {
      setMessage("Invalid administrator email or password.");
      return;
    }
    setMessage("");
    setGrantingAccess(true);
    localStorage.setItem(STORAGE.authenticated, "true");
    localStorage.setItem(STORAGE.email, email);
    window.setTimeout(() => onLogin(email), 850);
  }

  return <main className="login"><form onSubmit={submit}><div className="login-brand"><strong>Alaska.</strong><span>AIRLINES</span><b>🔐</b><h1>Admin Control Center</h1><p>Authorized administrators only</p></div><label>Administrator Email<div className="input-wrap"><i>✉</i><input type="email" placeholder="name@alaskaair.com" value={email} onChange={e => setEmail(e.target.value)} required /></div></label><label>Password<div className="input-wrap"><i>🔑</i><input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required /><button className="show-password" type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? "Hide" : "Show"}</button></div></label>{message && <p className="error">{message}</p>}<button className="sign-in">{grantingAccess ? "Access Granted ✓" : "Sign In →"}</button><div className="security-note"><span>🔒</span> Administrative access is restricted to authorized Production Operations members.</div></form></main>;
}

function Editor({ vendor, onClose, onSave }) {
  const [draft, setDraft] = useState(vendor);
  return <div className="modal"><form className="editor vendor-editor" onSubmit={e => { e.preventDefault(); onSave(draft); }}><header><div><small>EDIT</small><h2>Edit Vendor Information</h2></div><button type="button" onClick={onClose}>×</button></header><div className="form-grid">{fields.map(field => <label key={field}>{field.replace(/([A-Z])/g, " $1")} {field === "prodOpsEscalationProcess" ? <textarea value={draft[field] || ""} onChange={e => setDraft({ ...draft, [field]: e.target.value })} /> : <input type={field.includes("Date") ? "date" : "text"} value={draft[field] || ""} onChange={e => setDraft({ ...draft, [field]: e.target.value })} />}</label>)}</div><footer><button type="button" className="secondary" onClick={onClose}>Cancel</button><button>Save Changes</button></footer></form></div>;
}

function ApplicationEditor({ application, onClose, onSave }) {
  const [draft, setDraft] = useState(application);
  const appFields = ["name", "description", "vendor", "severity", "status", "icon"];
  return <div className="modal"><form className="editor" onSubmit={e => { e.preventDefault(); onSave(draft); }}><header><div><small>EDIT</small><h2>Edit Application Information</h2></div><button type="button" onClick={onClose}>×</button></header><div className="form-grid">{appFields.map(field => <label key={field}>{field}<input value={draft[field] || ""} onChange={e => setDraft({ ...draft, [field]: e.target.value })} /></label>)}</div><footer><button type="button" className="secondary" onClick={onClose}>Cancel</button><button>Save Changes</button></footer></form></div>;
}

function PasswordEditor({ onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  function save(event) {
    event.preventDefault();
    if (current !== (localStorage.getItem(STORAGE.password) || "123456789")) return setMessage("Current password is incorrect.");
    if (next.length < 8) return setMessage("New password must contain at least 8 characters.");
    if (next !== confirm) return setMessage("New passwords do not match.");
    localStorage.setItem(STORAGE.password, next);
    onClose();
  }
  return <div className="modal"><form className="editor password-editor" onSubmit={save}><header><div><small>SECURITY</small><h2>Change Password</h2></div><button type="button" onClick={onClose}>×</button></header><label>Current Password<input type="password" value={current} onChange={e => setCurrent(e.target.value)} required /></label><label>New Password<input type="password" value={next} onChange={e => setNext(e.target.value)} required /></label><label>Confirm New Password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></label>{message && <p className="error">{message}</p>}<footer><button type="button" className="secondary" onClick={onClose}>Cancel</button><button>Update Password</button></footer></form></div>;
}

const navItems = [
  ["Home", "../home.html", "⌂"],
  ["Vendors", "../vendors.html", "▦"],
  ["Categories", "../categories.html", "▦"],
  ["Ground Stop Apps", "../home.html#ground-stop-apps", "✈"],
  ["Favorites", "../favorites.html", "☆"],
  ["Reports", "../reports.html", "▤"],
  ["Admin", "./index.html", "◈"]
];

function Metric({ value, label, detail, icon, tone }) {
  return <article className={`metric metric-${tone}`}><div className="metric-icon">{icon}</div><div><small>{label}</small><strong>{String(value).padStart(2, "0")}</strong><span>{detail}</span></div><i className="metric-state">●</i></article>;
}

function OperationModule({ icon, title, description, href }) {
  return <a className="operation-module" href={href}><span className="module-icon">{icon}</span><span><strong>{title}</strong><small>{description}</small></span><b>↗</b></a>;
}

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE.email));
  const [vendors, setVendors] = useState(() => {
    const saved = read(STORAGE.vendors, []);
    const source = workbookVendors();
    if (saved.length && saved.every(vendor => vendor.vendorDataVersion === 2)) return saved;
    return source.map(record => {
      const prior = saved.find(vendor => vendor.sourceRow === record.sourceRow);
      if (!prior || !Array.isArray(prior.editedFields)) return record;
      return prior.editedFields.reduce((merged, field) => fields.includes(field) ? { ...merged, [field]: prior[field] || "" } : merged, record);
    });
  });
  const [applications, setApplications] = useState(() => read(STORAGE.applications, Object.values(window.masterData?.applications || {})));
  const [history, setHistory] = useState(() => read(STORAGE.history, []));
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingApplication, setEditingApplication] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem(STORAGE.authenticated);
      localStorage.removeItem(STORAGE.email);
    };
    addEventListener("pagehide", logout);
    return () => removeEventListener("pagehide", logout);
  }, []);
  useEffect(() => localStorage.setItem(STORAGE.vendors, JSON.stringify(vendors.map(v => {
    const base = workbookVendors().find(x => x.sourceRow === v.sourceRow) || {};
    return { ...v, editedFields: fields.filter(key => (v[key] || "") !== (base[key] || "")) };
  }))), [vendors]);
  useEffect(() => localStorage.setItem(STORAGE.applications, JSON.stringify(applications)), [applications]);

  const results = useMemo(() => vendors.filter(v => Object.values(v).join(" ").toLowerCase().includes(query.toLowerCase())), [vendors, query]);
  const profileName = (email || "Administrator").split("@")[0].split(".").map(part => part ? `${part[0].toUpperCase()}${part.slice(1)}` : "").filter(Boolean).join(" ");
  const profileInitials = profileName.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "AD";
  const currentPath = window.location.pathname.replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
  const isActiveNavigation = href => new URL(href, window.location.href).pathname.replace(/\\/g, "/").replace(/\/$/, "").toLowerCase() === currentPath;

  function saveVendor(draft) {
    setVendors(items => items.map(v => v.id === draft.id ? draft : v));
    const item = { action: "Vendor updated", details: `${draft.vendorCompanyName || draft.systemName || "Vendor"} information was updated`, timestamp: new Date().toLocaleString() };
    const next = [item, ...history].slice(0, 50);
    setHistory(next);
    localStorage.setItem(STORAGE.history, JSON.stringify(next));
    setEditing(null);
  }
  function saveApplication(draft) {
    setApplications(items => items.map(app => app.id === draft.id ? draft : app));
    const item = { action: "Application updated", details: `${draft.name || "Application"} information was updated`, timestamp: new Date().toLocaleString() };
    const next = [item, ...history].slice(0, 50);
    setHistory(next);
    localStorage.setItem(STORAGE.history, JSON.stringify(next));
    setEditingApplication(null);
  }
  if (!email || localStorage.getItem(STORAGE.authenticated) !== "true") return <LoginScreen onLogin={setEmail} />;

  return <main className="app">
    <aside className="sidebar">
      <div className="sidebar-brand"><img src="../public/sidebar-logo.png" alt="Alaska Airlines logo" /><div><strong>Alaska.</strong><span>AIRLINES</span></div></div>
      <div className="sidebar-label">COMMAND CENTER</div>
      <nav>{navItems.map(([label, href, icon]) => <a key={label} href={href} className={isActiveNavigation(href) ? "active" : ""}><span>{icon}</span>{label}{label === "Admin" && <b>LIVE</b>}</a>)}</nav>
      <div className="sidebar-quote">People.<br />Planes.<br />A Brighter<br />Tomorrow.</div>
    </aside>
    <section className="dashboard">
      <header className="command-header">
        <div className="header-copy"><small>ITS PRODUCTION OPERATIONS</small><h1>Admin Control Center</h1><p>Manage applications, vendors and operational information.</p></div>
        <div className="header-actions"><div className="profile"><span>{profileInitials}</span><div><strong>Welcome, {profileName}</strong><small>Production Operations</small></div></div><button className="header-button" onClick={() => setChangingPassword(true)}>Change Password</button><button className="header-button logout" onClick={() => { localStorage.removeItem(STORAGE.authenticated); localStorage.removeItem(STORAGE.email); setEmail(null); }}>Logout</button></div>
      </header>
      <div className="command-line"><span><i className="online-dot"></i> SYSTEM STATUS: OPERATIONAL</span><span>LAST SYNC · LIVE</span></div>
      <section className="metrics"><Metric value={applications.length} label="APPLICATIONS" detail="Active operational applications" icon="✈" tone="blue" /><Metric value={vendors.length} label="VENDOR RECORDS" detail="Configured vendor contacts" icon="♟" tone="green" /><Metric value={history.length} label="CHANGES" detail="Changes pending review" icon="↻" tone="purple" /></section>
      <section className="section-block operations-block"><div className="section-heading"><div><small>CONTROL ROOM</small><h2>Operations Overview</h2></div><span>ADMINISTRATION</span></div><div className="module-grid"><OperationModule icon="▣" title="Application Management" description="Configure operational systems" href="#applications" /><OperationModule icon="♟" title="Vendor Management" description="Maintain vendor contacts" href="#vendors" /><OperationModule icon="⌁" title="Operational Information" description="Review support workflows" href="#activity" /><OperationModule icon="↻" title="Recent Changes" description="Track administrative activity" href="#activity" /><OperationModule icon="◉" title="System Status" description="All services operational" href="#applications" /><OperationModule icon="⚙" title="Administrative Tools" description="Security and access controls" href="#admin-tools" /></div></section>
      <section className="section-block" id="applications"><div className="section-heading"><div><small>LIVE SERVICE REGISTER</small><h2>Application Status</h2></div><span>{applications.length} SYSTEMS</span></div><div className="status-table">{applications.map(app => <article className="status-row" key={app.id}><div className="status-app-icon"><img src={`../${app.icon}`} alt="" /></div><div className="status-app-name"><strong>{app.name}</strong><small>{app.function || app.description}</small></div><span className="status-pill operational"><i></i>{app.status || "Operational"}</span>{app.severity && <span className={`severity-tag ${app.severity.toLowerCase()}`}>{app.severity}</span>}<span className="sla-value">◷ SLA: {app.response || "TBD"}</span><button className="text-action" onClick={() => setEditingApplication(app)}>Edit →</button></article>)}</div></section>
      <section className="section-block" id="vendors"><div className="section-heading vendor-heading"><div><small>PARTNER DIRECTORY</small><h2>Vendor Management</h2></div><input aria-label="Search vendors" placeholder="Search vendors..." value={query} onChange={e => setQuery(e.target.value)} /><span>{results.length} RECORDS</span></div><div className="vendor-console-grid">{results.map(v => <article className="vendor-console-card" key={v.id}><div className="vendor-console-top"><span className="vendor-console-icon">♟</span><div><strong>{v.systemName || "Vendor"}</strong><small>{v.category || "Vendor information"}</small></div></div><div className="vendor-console-company"><small>VENDOR COMPANY</small><strong>{v.vendorCompanyName || "Not provided"}</strong></div><div className="vendor-console-contact"><span>☎ {v.contactNumbers || "Not provided"}</span><span>✉ {v.emailAddress || "Not provided"}</span></div><footer><small>{v.aagItsTeam || "ITS Operations"}</small><button className="text-action" onClick={() => setEditing(v)}>Edit →</button></footer></article>)}</div></section>
      <section className="section-block activity-block" id="activity"><div className="section-heading"><div><small>AUDIT TRAIL</small><h2>Recent Activity</h2></div><span>{history.length ? `${history.length} EVENTS` : "NO EVENTS"}</span></div>{history.length ? <div className="activity-list">{history.slice(0, 5).map((item, index) => <div className="activity-item" key={`${item.timestamp}-${index}`}><i></i><div><strong>{item.action}</strong><small>{item.details}</small></div><time>{item.timestamp}</time></div>)}</div> : <div className="empty-activity"><span>✓</span><div><strong>No recent administrative activity.</strong><small>Vendor and application updates will appear here.</small></div></div>}</section>
      <div id="admin-tools" className="dashboard-footer"><span>ALASKA AIRLINES · PRODUCTION OPERATIONS</span><span>SECURE ADMINISTRATIVE ACCESS</span></div>
    </section>
    {editing && <Editor vendor={editing} onClose={() => setEditing(null)} onSave={saveVendor} />}
    {editingApplication && <ApplicationEditor application={editingApplication} onClose={() => setEditingApplication(null)} onSave={saveApplication} />}
    {changingPassword && <PasswordEditor onClose={() => setChangingPassword(false)} />}
  </main>;
}

export default App;
