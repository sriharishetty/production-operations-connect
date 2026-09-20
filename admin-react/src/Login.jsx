import { useState } from "react";

const ADMINS = [
  "Srihari.Gangisetti@alaskaair.com",
  "Mohan.P@alaskaair.com",
  "Margaret.Jennifer@alaskaair.com",
  "Sharmini.M@alaskaair.com",
  "Srinivasanagasai.Chevitikanti@alaskaair.com"
];

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [grantingAccess, setGrantingAccess] = useState(false);

  function submit(event) {
    event.preventDefault();
    const activePassword = localStorage.getItem("productionOperationsAdminPassword") || "123456789";
    if (!ADMINS.includes(email) || password !== activePassword) {
      setMessage("Invalid administrator email or password.");
      return;
    }
    setMessage("");
    setGrantingAccess(true);
    localStorage.setItem("productionOperationsAdminAuthenticated", "true");
    localStorage.setItem("productionOperationsAdminEmail", email);
    window.setTimeout(() => onLogin(email), 850);
  }

  return <main className="login"><form className={grantingAccess ? "access-granted" : ""} onSubmit={submit}>
    <div className="login-brand"><strong>Alaska.</strong><span>AIRLINES</span><b>🔐</b><h1>Admin Control Center</h1><p>Authorized administrators only</p></div>
    <label>Administrator Email<div className="input-wrap"><i>✉</i><input type="email" placeholder="name@alaskaair.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={grantingAccess} /></div></label>
    <label>Password<div className="input-wrap"><i>🔑</i><input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required disabled={grantingAccess} /><button className="show-password" type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? "Hide" : "Show"}</button></div></label>
    {message && <p className="error">{message}</p>}
    <button className="sign-in" disabled={grantingAccess}>{grantingAccess ? "Access Granted ✓" : "Sign In →"}</button>
    {grantingAccess && <div className="access-message">✓ Access granted. Opening the Admin Control Center…</div>}
    <div className="security-note"><span>🔒</span> Administrative access is restricted to authorized Production Operations members.</div>
  </form></main>;
}
