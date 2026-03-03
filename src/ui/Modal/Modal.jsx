import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setVerifiedPhone } from "../../app/features/authSlice";
import "./Modal.css";
import { useTranslation } from "react-i18next"; // Qo'shildi

const SERVER = import.meta.env.VITE_SERVER_URL;
const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME;

function formatPhone(raw) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  if (digits.length === 0) return "+998 ";
  if (digits.length <= 2) return `+998 (${digits}`;
  if (digits.length <= 5) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
}

// ── Шаг 1: ввод телефона ─────────────────────────────────────────────────────
function StepPhone({ onDone }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("+998 ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setPhone(formatPhone(e.target.value));
    setError("");
  }

  async function handleSubmit() {
    const digits = phone.replace(/\D/g, "");
    const local = digits.startsWith("998") ? digits.slice(3) : digits;
    if (local.length < 9) return setError(t("auth.error_phone"));
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER}/start-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "+998" + local }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("auth.error_server"));
      localStorage.setItem("pv_sessionId", data.sessionId);
      localStorage.setItem("pv_secretCode", data.secretCode);
      localStorage.setItem("pv_phone", "+998" + local);
      onDone(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-body">
      <p className="m-sub">{t("auth.enter_phone")}</p>
      <div className={`m-field ${error ? "m-field--err" : ""}`}>
        <input
          className="m-input"
          type="tel"
          placeholder="+998 (90) 123-45-67"
          value={phone}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
      </div>
      {error && <p className="m-error">{error}</p>}
      <button
        className="m-btn"
        onClick={handleSubmit}
        disabled={loading || phone.replace(/\D/g, "").replace(/^998/, "").length < 9}
      >
        {loading ? (
          <span className="m-spinner" />
        ) : (
          <>
            <span>{t("auth.get_code")}</span>
            <span className="m-arrow">→</span>
          </>
        )}
      </button>
    </div>
  );
}

// ── Шаг 2: код + ожидание ────────────────────────────────────────────────────
function StepWait({ sessionId, secretCode, tgLink, phone, onVerified, onBack }) {
  const { t } = useTranslation();
  const [dots, setDots] = useState(".");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    dotsRef.current = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 600);
    return () => clearInterval(dotsRef.current);
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${SERVER}/status/${sessionId}?code=${secretCode}`);
        if (res.status === 403) {
          setError(t("auth.error_session"));
          clearInterval(pollRef.current);
          return;
        }
        const data = await res.json();
        if (data.verified) {
          clearInterval(pollRef.current);
          clearInterval(dotsRef.current);
          onVerified(phone);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(pollRef.current);
  }, [sessionId, secretCode, phone, onVerified, t]);

  function copyCode() {
    navigator.clipboard.writeText(secretCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="m-body">
      <p className="m-sub">{t("auth.enter_bot_code")}</p>

      <div className="m-code-wrap" onClick={copyCode}>
        <span className="m-code-label">{t("auth.your_code")}</span>
        <div className="m-code-digits">
          {secretCode.split("").map((d, i) => (
            <span key={i} className="m-digit" style={{ animationDelay: `${i * 60}ms` }}>
              {d}
            </span>
          ))}
        </div>
        <span className="m-code-copy">
          {copied ? `✓ ${t("auth.copied")}` : t("auth.click_to_copy")}
        </span>
      </div>

      <div className="m-steps">
        {[
          t("auth.step_1"),
          t("auth.step_2"),
          t("auth.step_3", { code: secretCode }),
        ].map((s, i) => (
          <div key={i} className="m-step">
            <span className="m-step-n">{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <a href={tgLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        <button className="m-btn m-btn--tg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.013l-2.95-.924c-.642-.2-.654-.642.136-.953l11.526-4.443c.537-.194 1.006.131.37.555z" />
          </svg>
          {t("auth.open_tg")}
        </button>
      </a>

      {error ? (
        <p className="m-error">{error}</p>
      ) : (
        <p className="m-waiting">
          {t("auth.waiting")}
          {dots}
        </p>
      )}

      <button className="m-back" onClick={onBack}>
        ← {t("auth.another_number")}
      </button>
    </div>
  );
}

// ── Шаг 3: успех ─────────────────────────────────────────────────────────────
function StepSuccess({ phone, isAdmin, onClose, onAdminClick }) {
  const { t } = useTranslation();
  return (
    <div className="m-body m-success">
      <div className="m-check">✦</div>
      <p className="m-success-title">{t("auth.welcome")}</p>
      <p className="m-success-phone">{phone}</p>
      <button className="m-btn" onClick={onClose}>
        {t("auth.continue")}
      </button>
      {isAdmin && (
        <button className="m-btn m-btn--admin" onClick={onAdminClick}>
          ⚙️ {t("auth.admin_panel")}
        </button>
      )}
    </div>
  );
}

// ── Основной Modal ────────────────────────────────────────────────────────────
export default function Modal({ open = false, onClose, onVerified }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState("phone");
  const [verifyData, setVerifyData] = useState(null);
  const [verifiedPhone, setVerifiedPhoneLocal] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  async function checkAdmin(phone) {
    try {
      const res = await fetch(`${SERVER}/is-admin?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      return data.isAdmin === true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (!open) return;
    const sessionId = localStorage.getItem("pv_sessionId");
    const secretCode = localStorage.getItem("pv_secretCode");
    const phone = localStorage.getItem("pv_phone");
    const verified = localStorage.getItem("pv_verified");

    if (verified === "true" && phone) {
      setVerifiedPhoneLocal(phone);
      checkAdmin(phone).then(setIsAdmin);
      setStep("success");
      return;
    }
    if (sessionId && secretCode && phone) {
      setVerifyData({
        sessionId,
        secretCode,
        tgLink: `https://t.me/${BOT_USERNAME}?start=${sessionId}`,
        phone,
      });
      setStep("wait");
      return;
    }
    setStep("phone");
  }, [open]);

  function handleDone(data) {
    setVerifyData({
      ...data,
      phone: localStorage.getItem("pv_phone"),
      tgLink: `https://t.me/${BOT_USERNAME}?start=${data.sessionId}`,
    });
    setStep("wait");
  }

  async function handleVerified(phone) {
    localStorage.setItem("pv_verified", "true");
    dispatch(setVerifiedPhone({ phone, sessionId: localStorage.getItem("pv_sessionId") }));
    setVerifiedPhoneLocal(phone);
    const admin = await checkAdmin(phone);
    setIsAdmin(admin);
    setStep("success");
    onVerified && onVerified(phone);
  }

  function handleBack() {
    localStorage.removeItem("pv_sessionId");
    localStorage.removeItem("pv_secretCode");
    localStorage.removeItem("pv_phone");
    setVerifyData(null);
    setStep("phone");
  }

  function handleAdminClick() {
    onClose?.();
    navigate("/adm");
  }

  if (!open) return null;

  const titles = {
    phone: t("auth.title_login"),
    wait: t("auth.title_verify"),
    success: t("auth.title_success"),
  };

  return (
    <div className="m-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="m-box">
        <button className="m-close" onClick={onClose}>
          ✕
        </button>
        <div className="m-header">
          <div className="m-logo-mark">✦</div>
          <h2 className="m-title">{titles[step]}</h2>
          <div className="m-divider" />
        </div>

        {step === "phone" && <StepPhone onDone={handleDone} />}
        {step === "wait" && verifyData && (
          <StepWait {...verifyData} onVerified={handleVerified} onBack={handleBack} />
        )}
        {step === "success" && (
          <StepSuccess
            phone={verifiedPhone}
            isAdmin={isAdmin}
            onClose={onClose}
            onAdminClick={handleAdminClick}
          />
        )}
      </div>
    </div>
  );
}