import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FaceRegister() {
  const videoRef = useRef(null);

  const [matricNumber, setMatricNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("initializing");
  const [statusMsg, setStatusMsg] = useState("Loading face models...");
  const [cameraReady, setCameraReady] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = camera

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        videoRef.current.srcObject = stream;
        setCameraReady(true);
        setStatus("idle");
        setStatusMsg("Position your face clearly in the frame");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setStatusMsg("Camera or model load failed");
      }
    };
    init();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleNext = () => {
    if (!name.trim() || !matricNumber.trim()) {
      setStatus("error");
      setStatusMsg("Both fields are required");
      return;
    }
    setStatus("idle");
    setStatusMsg("Position your face clearly in the frame");
    setStep(2);
  };

  const registerFace = async () => {
    setLoading(true);
    setStatus("scanning");
    setStatusMsg("Scanning face...");

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus("error");
        setStatusMsg("No face detected — adjust position");
        setLoading(false);
        return;
      }

      setStatusMsg("Encrypting & saving biometric data...");

      await axios.post(`${API_URL}/api/register-face`, {
        name: name.trim(),
        matricNumber: matricNumber.trim(),
        faceDescriptor: Array.from(detection.descriptor),
      });

      setStatus("success");
      setStatusMsg("Face registered successfully!");
      setName("");
      setMatricNumber("");
      setTimeout(() => setStep(1), 3000);
    } catch (err) {
      setStatus("error");
      setStatusMsg(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    idle: "#38bdf8",
    initializing: "#a78bfa",
    scanning: "#f59e0b",
    success: "#34d399",
    error: "#f87171",
  };
  const sc = statusColors[status] || "#38bdf8";

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s;
        }
        .reg-input::placeholder { color: #334155; }
        .reg-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .primary-btn {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 16px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.4px;
          position: relative;
          overflow: hidden;
        }
        .primary-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .primary-btn:not(:disabled):hover { transform: translateY(-2px); }

        .back-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
          justify-content: center;
        }
        .back-btn:hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }

        .step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .corner { position: absolute; width: 22px; height: 22px; border-color: var(--cc); border-style: solid; transition: all 0.3s; }
        .tl { top: 0; left: 0; border-width: 2px 0 0 2px; border-radius: 6px 0 0 0; }
        .tr { top: 0; right: 0; border-width: 2px 2px 0 0; border-radius: 0 6px 0 0; }
        .bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; border-radius: 0 0 0 6px; }
        .br { bottom: 0; right: 0; border-width: 0 2px 2px 0; border-radius: 0 0 6px 0; }

        @keyframes scanLine { 0%,100% { top: 8%; opacity: 1; } 50% { top: 88%; opacity: 0.4; } }
        .scan-anim { animation: scanLine 2.5s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }

        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }

        @keyframes fadeSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeSlide 0.5s ease forwards; }

        @keyframes successPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .success-pop { animation: successPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
      `}</style>

      {/* BG orbs */}
      <div style={s.orb1} />
      <div style={s.orb2} />

      {/* Left panel */}
      <div style={s.leftPanel} className="fade-in">
        <div style={s.brandLogo}>
          <div style={s.logoDot} />
          <span style={s.logoText}>SchoolPortal</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={s.leftTag}>NEW STUDENT SETUP</div>
          <h1 style={s.leftTitle}>
            Register
            <br />
            <span style={s.leftAccent}>Your Face</span>
          </h1>
          <p style={s.leftDesc}>
            Set up your biometric profile once. After that, logging in is as
            simple as looking at the camera.
          </p>

          {/* Step progress */}
          <div style={s.stepsWrap}>
            {[
              { n: 1, label: "Your Details", sub: "Name & matric number" },
              { n: 2, label: "Face Capture", sub: "Scan & register face" },
            ].map((st) => (
              <div key={st.n} style={s.stepRow}>
                <div
                  style={{
                    ...s.stepNum,
                    background:
                      step >= st.n
                        ? "linear-gradient(135deg, #6366f1, #0ea5e9)"
                        : "rgba(255,255,255,0.05)",
                    color: step >= st.n ? "#fff" : "#334155",
                    boxShadow:
                      step === st.n ? "0 0 16px rgba(99,102,241,0.5)" : "none",
                  }}
                >
                  {step > st.n ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    st.n
                  )}
                </div>
                <div>
                  <div
                    style={{
                      ...s.stepLabel,
                      color: step >= st.n ? "#e2e8f0" : "#334155",
                    }}
                  >
                    {st.label}
                  </div>
                  <div style={s.stepSub}>{st.sub}</div>
                </div>
                {st.n < 2 && (
                  <div
                    style={{
                      ...s.stepLine,
                      background:
                        step > st.n
                          ? "rgba(99,102,241,0.5)"
                          : "rgba(255,255,255,0.05)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={s.securityNote}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span
              style={{
                color: "#334155",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Data encrypted with AES-256 before storage
            </span>
          </div>
        </div>

        <p style={s.leftFooter}>© 2025 SchoolPortal · All rights reserved</p>
      </div>

      {/* Right panel */}
      <div style={s.rightPanel}>
        <div style={s.card}>
          {/* Step indicator dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            {[1, 2].map((n) => (
              <div
                key={n}
                className="step-dot"
                style={{
                  background:
                    step === n
                      ? "#6366f1"
                      : step > n
                        ? "#34d399"
                        : "rgba(255,255,255,0.08)",
                  width: step === n ? 24 : 8,
                  borderRadius: 100,
                }}
              />
            ))}
          </div>

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <div className="fade-in">
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 style={s.cardTitle}>Create Account</h2>
                <p style={s.cardSub}>Enter your student information</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  marginBottom: 28,
                }}
              >
                <div>
                  <label style={s.label}>Full Name</label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="e.g. Amaka Osei"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={s.label}>Matric Number</label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="e.g. BHU/23/05/001"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  />
                </div>
              </div>

              {status === "error" && (
                <div style={s.errorBanner}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {statusMsg}
                </div>
              )}

              <button
                className="primary-btn"
                onClick={handleNext}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
                  boxShadow: "0 0 28px rgba(99,102,241,0.35)",
                }}
              >
                Continue to Face Capture →
              </button>

              <p style={s.footer}>
                Already registered?{" "}
                <a href="/login" style={s.footerLink}>
                  Login here
                </a>
              </p>
            </div>
          )}

          {/* ── STEP 2: Camera ── */}
          {step === 2 && (
            <div className="fade-in">
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={s.cardBadge}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: sc,
                      boxShadow: `0 0 6px ${sc}`,
                    }}
                    className={
                      status === "idle" || status === "scanning" ? "pulse" : ""
                    }
                  />
                  {cameraReady ? "Camera Ready" : "Initializing..."}
                </div>
                <h2 style={{ ...s.cardTitle, fontSize: 24 }}>
                  Hi, {name.split(" ")[0]} 👋
                </h2>
                <p style={s.cardSub}>Look straight at the camera</p>
              </div>

              {/* Camera */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    ...s.cameraWrap,
                    borderColor: `${sc}40`,
                    boxShadow: `0 0 30px ${sc}15`,
                  }}
                >
                  {["tl", "tr", "bl", "br"].map((c) => (
                    <div
                      key={c}
                      className={`corner ${c}`}
                      style={{ "--cc": sc }}
                    />
                  ))}

                  <video ref={videoRef} autoPlay muted style={s.video} />

                  {status === "scanning" && (
                    <div
                      className="scan-anim"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(90deg, transparent, ${sc}, transparent)`,
                        boxShadow: `0 0 10px ${sc}`,
                        zIndex: 5,
                      }}
                    />
                  )}

                  {status === "success" && (
                    <div style={s.successOverlay} className="success-pop">
                      <div style={s.successCircle}>
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status bar */}
                <div
                  style={{
                    ...s.statusBar,
                    borderColor: `${sc}30`,
                    background: `${sc}0a`,
                  }}
                >
                  {loading ? (
                    <svg
                      className="spinner"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={sc}
                      strokeWidth="3"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke={sc} />
                    </svg>
                  ) : (
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: sc,
                        boxShadow: `0 0 6px ${sc}`,
                      }}
                      className={
                        status === "idle" || status === "scanning"
                          ? "pulse"
                          : ""
                      }
                    />
                  )}
                  <span
                    style={{
                      color: sc,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                    }}
                  >
                    {statusMsg}
                  </span>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <button
                  className="primary-btn"
                  onClick={registerFace}
                  disabled={loading || !cameraReady || status === "success"}
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
                    boxShadow: "0 0 28px rgba(99,102,241,0.35)",
                  }}
                >
                  <span>
                    {loading
                      ? "Registering..."
                      : status === "success"
                        ? "Registered ✓"
                        : "Register Face"}
                  </span>
                </button>

                <button
                  className="back-btn"
                  onClick={() => {
                    setStep(1);
                    setStatus("idle");
                    setStatusMsg("Position your face clearly in the frame");
                  }}
                >
                  ← Back to Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    background: "#030712",
    display: "flex",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    top: -300,
    right: -200,
    width: 700,
    height: 700,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: -200,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
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
    color: "#6366f1",
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
    background: "linear-gradient(135deg, #6366f1, #38bdf8)",
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
  stepsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    marginBottom: 32,
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    position: "relative",
    paddingBottom: 24,
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.3s",
    flexShrink: 0,
  },
  stepLabel: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 2,
    transition: "color 0.3s",
  },
  stepSub: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#334155",
    fontSize: 12,
  },
  stepLine: {
    position: "absolute",
    left: 17,
    top: 44,
    width: 2,
    height: "calc(100% - 36px)",
    transition: "background 0.3s",
  },
  securityNote: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: "12px 16px",
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
    marginBottom: 12,
  },
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
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: 10,
    padding: "10px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#f87171",
    marginBottom: 18,
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
    backdropFilter: "blur(3px)",
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(52,211,153,0.15)",
    border: "2px solid rgba(52,211,153,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 40px rgba(52,211,153,0.3)",
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
  footer: {
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "center",
    color: "#334155",
    fontSize: 13,
    marginTop: 20,
  },
  footerLink: { color: "#6366f1", textDecoration: "none", fontWeight: 500 },
};
