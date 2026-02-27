import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FaceLogin() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [matricNumber, setMatricNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("Loading face models...");
  const [modelsReady, setModelsReady] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsReady(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        videoRef.current.srcObject = stream;
        setCameraReady(true);
        setStatusMsg("Position your face in the frame");
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setStatusMsg("Camera or model load failed");
        setStatus("error");
      }
    };
    init();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const login = async () => {
    if (!matricNumber.trim()) {
      setStatusMsg("Enter your matric number first");
      setStatus("error");
      return;
    }
    setLoading(true);
    setStatus("scanning");
    setStatusMsg("Scanning face...");
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        setStatusMsg("No face detected — adjust position");
        setStatus("error");
        setLoading(false);
        return;
      }
      setStatusMsg("Verifying identity...");
      const res = await axios.post(`${API_URL}/api/login-face`, {
        matricNumber: matricNumber.trim(),
        faceDescriptor: Array.from(detection.descriptor),
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatusMsg("Identity confirmed");
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setStatusMsg("Face not recognized");
        setStatus("error");
      }
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Authentication failed");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    idle: "#38bdf8",
    loading: "#a78bfa",
    scanning: "#f59e0b",
    success: "#34d399",
    error: "#f87171",
  };
  const statusColor = statusColors[status] || "#38bdf8";

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 18px; color: #f1f5f9;
          font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: all 0.25s; letter-spacing: 0.5px;
        }
        .login-input::placeholder { color: #334155; }
        .login-input:focus { border-color: rgba(56,189,248,0.5); background: rgba(56,189,248,0.05); box-shadow: 0 0 0 3px rgba(56,189,248,0.1); }

        .scan-btn {
          width: 100%; background: linear-gradient(135deg, #0ea5e9, #6366f1); border: none; border-radius: 14px;
          padding: 16px; color: #fff; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.3s; box-shadow: 0 0 28px rgba(14,165,233,0.35); letter-spacing: 0.4px;
          position: relative; overflow: hidden;
        }
        .scan-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #38bdf8, #818cf8); opacity: 0; transition: opacity 0.3s; }
        .scan-btn:hover:not(:disabled)::before { opacity: 1; }
        .scan-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 40px rgba(14,165,233,0.5); }
        .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .scan-btn span { position: relative; z-index: 1; }

        .corner { position: absolute; width: 22px; height: 22px; border-color: var(--cc); border-style: solid; transition: all 0.3s; }
        .tl { top: 0; left: 0; border-width: 2px 0 0 2px; border-radius: 6px 0 0 0; }
        .tr { top: 0; right: 0; border-width: 2px 2px 0 0; border-radius: 0 6px 0 0; }
        .bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; border-radius: 0 0 0 6px; }
        .br { bottom: 0; right: 0; border-width: 0 2px 2px 0; border-radius: 0 0 6px 0; }

        @keyframes scanLine { 0%, 100% { top: 8%; opacity: 1; } 50% { top: 88%; opacity: 0.5; } }
        .scan-line-anim { animation: scanLine 2.5s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeSlide 0.7s ease forwards; }
        @keyframes successPulse { 0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); } 70% { box-shadow: 0 0 0 20px rgba(52,211,153,0); } 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); } }
        .success-ring { animation: successPulse 1s ease-out; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .login-layout { flex-direction: column !important; }
          .login-left-panel { width: 100% !important; padding: 28px 24px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; flex-direction: row !important; align-items: center !important; gap: 20px !important; min-height: unset !important; }
          .login-left-content { flex: 1; }
          .login-left-title { font-size: 28px !important; margin-bottom: 8px !important; }
          .login-left-desc { display: none !important; }
          .login-left-features { display: none !important; }
          .login-left-footer { display: none !important; }
          .login-right-panel { padding: 24px 16px !important; }
        }

        @media (max-width: 500px) {
          .login-left-panel { padding: 20px 16px !important; }
          .login-left-title { font-size: 22px !important; }
          .login-card { padding: 24px 16px !important; border-radius: 16px !important; }
          .login-card-title { font-size: 24px !important; }
        }
      `}</style>

      <div style={s.orb1} />
      <div style={s.orb2} />

      <div className="login-layout" style={s.layout}>
        {/* Left panel */}
        <div className="login-left-panel fade-in" style={s.leftPanel}>
          <div style={s.brandLogo}>
            <div style={s.logoDot} />
            <span style={s.logoText}>SchoolPortal</span>
          </div>
          <div
            className="login-left-content"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={s.leftTag}>BIOMETRIC AUTH</div>
            <h1 className="login-left-title" style={s.leftTitle}>
              Secure
              <br />
              <span style={s.leftAccent}>Face Login</span>
            </h1>
            <p className="login-left-desc" style={s.leftDesc}>
              No passwords. No guessing. Just look at the camera and let our
              system verify your identity in under a second.
            </p>
            <div className="login-left-features" style={s.featureList}>
              {[
                { icon: "🔬", label: "128-point facial mapping" },
                { icon: "🔐", label: "AES-256 encrypted data" },
                { icon: "⚡", label: "Sub-second authentication" },
              ].map((f) => (
                <div key={f.label} style={s.featureItem}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span>
                  <span style={s.featureLabel}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="login-left-footer" style={s.leftFooter}>
            © 2025 SchoolPortal · All rights reserved
          </p>
        </div>

        {/* Right panel */}
        <div className="login-right-panel" style={s.rightPanel}>
          <div className="login-card fade-in" style={s.card}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={s.cardBadge}>
                <div
                  style={{
                    ...s.badgeDot,
                    background: statusColor,
                    boxShadow: `0 0 8px ${statusColor}`,
                  }}
                />
                {cameraReady ? "Camera Ready" : "Initializing..."}
              </div>
              <h2 className="login-card-title" style={s.cardTitle}>
                Welcome Back
              </h2>
              <p style={s.cardSub}>Authenticate with your face</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={s.label}>Matric Number</label>
              <input
                className="login-input"
                type="text"
                placeholder="e.g. BHU/23/05/001"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && login()}
              />
            </div>

            <div style={{ position: "relative", marginBottom: 20 }}>
              <div
                style={{
                  ...s.cameraWrap,
                  borderColor: `${statusColor}40`,
                  boxShadow: `0 0 30px ${statusColor}15`,
                }}
                className={status === "success" ? "success-ring" : ""}
              >
                {["tl", "tr", "bl", "br"].map((c) => (
                  <div
                    key={c}
                    className={`corner ${c}`}
                    style={{ "--cc": statusColor }}
                  />
                ))}
                <video ref={videoRef} autoPlay muted style={s.video} />
                {status === "scanning" && (
                  <div
                    className="scan-line-anim"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
                      boxShadow: `0 0 10px ${statusColor}`,
                      zIndex: 5,
                    }}
                  />
                )}
                {status === "success" && (
                  <div style={s.successOverlay}>
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                )}
                {loading && status !== "scanning" && (
                  <div style={s.loadingOverlay}>
                    <svg
                      className="spinner"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#38bdf8" />
                    </svg>
                  </div>
                )}
              </div>
              <div
                style={{
                  ...s.statusBar,
                  borderColor: `${statusColor}30`,
                  background: `${statusColor}0a`,
                }}
              >
                {loading ? (
                  <svg
                    className="spinner"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={statusColor}
                    strokeWidth="3"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke={statusColor} />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: statusColor,
                      boxShadow: `0 0 6px ${statusColor}`,
                    }}
                    className={
                      status === "idle" || status === "scanning" ? "pulse" : ""
                    }
                  />
                )}
                <span style={{ ...s.statusText, color: statusColor }}>
                  {statusMsg}
                </span>
              </div>
            </div>

            <button
              className="scan-btn"
              onClick={login}
              disabled={loading || !cameraReady}
            >
              <span>{loading ? "Authenticating..." : "Login with Face"}</span>
            </button>
            <p style={s.footer}>
              Don't have an account?{" "}
              <a href="/register" style={s.footerLink}>
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    background: "#030712",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    top: -300,
    left: -200,
    width: 700,
    height: 700,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: -200,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  layout: { display: "flex", minHeight: "100vh" },
  leftPanel: {
    width: "42%",
    padding: "48px 56px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    position: "relative",
    zIndex: 2,
  },
  brandLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    boxShadow: "0 0 10px rgba(14,165,233,0.8)",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: "#f1f5f9",
  },
  leftTag: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    letterSpacing: 3,
    color: "#38bdf8",
    marginBottom: 20,
  },
  leftTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 52,
    color: "#f1f5f9",
    lineHeight: 1.1,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  leftAccent: {
    background: "linear-gradient(135deg, #0ea5e9, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  leftDesc: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.8,
    marginBottom: 40,
    maxWidth: 360,
  },
  featureList: { display: "flex", flexDirection: "column", gap: 14 },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "13px 18px",
  },
  featureLabel: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#94a3b8",
    fontSize: 14,
  },
  leftFooter: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#1e293b",
    fontSize: 12,
    marginTop: 48,
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    position: "relative",
    zIndex: 2,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(15,23,42,0.7)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 24,
    padding: "36px 32px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
  },
  cardBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 100,
    padding: "5px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: "#64748b",
    marginBottom: 16,
  },
  badgeDot: { width: 7, height: 7, borderRadius: "50%" },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 30,
    color: "#f1f5f9",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  cardSub: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#475569",
    fontSize: 14,
  },
  label: {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  cameraWrap: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid",
    background: "#0a0f1a",
    aspectRatio: "4/3",
    transition: "all 0.3s",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transform: "scaleX(-1)",
  },
  successOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(52,211,153,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backdropFilter: "blur(2px)",
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  statusBar: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid",
    transition: "all 0.3s",
  },
  statusText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    transition: "color 0.3s",
  },
  footer: {
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "center",
    color: "#334155",
    fontSize: 13,
    marginTop: 20,
  },
  footerLink: { color: "#38bdf8", textDecoration: "none", fontWeight: 500 },
};
