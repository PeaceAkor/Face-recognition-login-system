import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56,189,248,0.5)";
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(56,189,248,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030712; }

        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 24px rgba(14,165,233,0.35);
          letter-spacing: 0.3px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 36px rgba(14,165,233,0.55);
        }
        .btn-ghost {
          background: transparent;
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 13px 28px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .btn-ghost:hover {
          border-color: rgba(14,165,233,0.5);
          color: #38bdf8;
          background: rgba(14,165,233,0.07);
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }
        .feature-card:hover {
          border-color: rgba(14,165,233,0.3);
          background: rgba(14,165,233,0.05);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(14,165,233,0.1);
        }

        .scan-line {
          animation: scanMove 3s ease-in-out infinite;
        }
        @keyframes scanMove {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(120px); opacity: 0.4; }
        }

        .pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        .fade-in { animation: fadeUp 0.8s ease forwards; opacity: 0; }
        .fade-in:nth-child(1) { animation-delay: 0.1s; }
        .fade-in:nth-child(2) { animation-delay: 0.25s; }
        .fade-in:nth-child(3) { animation-delay: 0.4s; }
        .fade-in:nth-child(4) { animation-delay: 0.55s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          margin-bottom: 14px;
        }
        .check-dot {
          width: 20px; height: 20px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      {/* Canvas BG */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Glow orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.logo}>
            <span style={styles.logoDot} />
            SchoolPortal
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-ghost"
              onClick={() => navigate("/login")}
              style={{ padding: "10px 22px", fontSize: 14 }}
            >
              Login
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding: "10px 22px", fontSize: 14 }}
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div className="fade-in" style={styles.badge}>
            <span style={styles.badgeDot} />
            Biometric Authentication System
          </div>

          <h1 className="fade-in" style={styles.heroTitle}>
            Face-Login
            <br />
            <span style={styles.heroAccent}>Biometric</span>
            <br />
            System
          </h1>

          <p className="fade-in" style={styles.heroSub}>
            Most school portals still rely on password-based authentication. Our
            modern biometric system delivers a secure, frictionless login
            experience that sets your platform apart.
          </p>

          <div className="fade-in" style={{ marginBottom: 32 }}>
            <div className="check-item">
              <div className="check-dot">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              90% more secure login experience
            </div>
            <div className="check-item">
              <div className="check-dot">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              Real-time face recognition & encryption
            </div>
            <div className="check-item">
              <div className="check-dot">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              Responsive & blazing fast UI
            </div>
          </div>

          <div className="fade-in" style={{ display: "flex", gap: 14 }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>

        {/* Biometric Visual */}
        <div style={styles.heroRight}>
          <div style={styles.biometricFrame}>
            {/* Corner brackets */}
            {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((pos) => (
              <div key={pos} style={{ ...styles.corner, ...styles[pos] }} />
            ))}

            {/* Face outline SVG */}
            <svg
              width="180"
              height="200"
              viewBox="0 0 180 200"
              fill="none"
              style={{ position: "relative", zIndex: 2 }}
            >
              {/* Head outline */}
              <ellipse
                cx="90"
                cy="95"
                rx="65"
                ry="75"
                stroke="rgba(56,189,248,0.4)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* Eyes */}
              <ellipse
                cx="65"
                cy="80"
                rx="12"
                ry="8"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <ellipse
                cx="115"
                cy="80"
                rx="12"
                ry="8"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <circle cx="65" cy="80" r="4" fill="#38bdf8" opacity="0.6" />
              <circle cx="115" cy="80" r="4" fill="#38bdf8" opacity="0.6" />
              {/* Nose */}
              <path
                d="M90 90 L83 108 Q90 113 97 108 Z"
                stroke="#38bdf8"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              {/* Mouth */}
              <path
                d="M72 125 Q90 138 108 125"
                stroke="#38bdf8"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Scan grid dots */}
              {[60, 90, 120].map((x) =>
                [60, 90, 120, 150].map((y) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="rgba(56,189,248,0.25)"
                  />
                )),
              )}
              {/* Mesh lines */}
              <line
                x1="25"
                y1="95"
                x2="155"
                y2="95"
                stroke="rgba(56,189,248,0.15)"
                strokeWidth="0.5"
              />
              <line
                x1="90"
                y1="20"
                x2="90"
                y2="170"
                stroke="rgba(56,189,248,0.15)"
                strokeWidth="0.5"
              />
            </svg>

            {/* Scan line */}
            <div className="scan-line" style={styles.scanLine} />

            {/* Status */}
            <div style={styles.scanStatus}>
              <div style={styles.scanDot} />
              <span
                style={{
                  color: "#38bdf8",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  letterSpacing: 1,
                }}
              >
                SCANNING...
              </span>
            </div>
          </div>

          {/* Floating stat cards */}
          <div style={styles.floatCard1}>
            <div
              style={{
                color: "#38bdf8",
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              99.4%
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Recognition Rate
            </div>
          </div>
          <div style={styles.floatCard2}>
            <div
              style={{
                color: "#a78bfa",
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              0.3s
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Auth Speed
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <p style={styles.featuresLabel}>KEY FEATURES</p>
        <h2 style={styles.featuresTitle}>Why choose our system?</h2>
        <div style={styles.featureGrid}>
          {[
            {
              icon: "🔬",
              title: "Facial Analysis",
              desc: "Deep learning model maps 128 unique facial points for precise identity matching.",
            },
            {
              icon: "🔐",
              title: "AES-256 Encryption",
              desc: "Biometric data is encrypted end-to-end before storage — never stored as raw images.",
            },
            {
              icon: "⚡",
              title: "Instant Auth",
              desc: "Sub-second authentication — no passwords, no delays, no friction.",
            },
            {
              icon: "📱",
              title: "Cross-Device",
              desc: "Works on phones, tablets, and desktops with any modern webcam.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: 36, marginBottom: 18 }}>{f.icon}</div>
              <h4
                style={{
                  color: "#e2e8f0",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h4>
              <p
                style={{
                  color: "#64748b",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#030712",
    position: "relative",
    overflow: "hidden",
  },
  canvas: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  orb1: {
    position: "fixed",
    top: -200,
    left: -200,
    width: 600,
    height: 600,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
    zIndex: 0,
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
      "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    zIndex: 0,
    pointerEvents: "none",
  },
  nav: {
    position: "relative",
    zIndex: 10,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    background: "rgba(3,7,18,0.6)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "18px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 20,
    color: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    boxShadow: "0 0 10px rgba(14,165,233,0.8)",
  },
  hero: {
    position: "relative",
    zIndex: 5,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "90px 32px 80px",
    display: "flex",
    alignItems: "center",
    gap: 80,
  },
  heroLeft: {
    flex: 1,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(14,165,233,0.1)",
    border: "1px solid rgba(14,165,233,0.25)",
    borderRadius: 100,
    padding: "6px 16px",
    marginBottom: 28,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: "#38bdf8",
    letterSpacing: 0.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#38bdf8",
    boxShadow: "0 0 6px #38bdf8",
    animation: "pulseRing 2s infinite",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 58,
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1.1,
    marginBottom: 24,
    letterSpacing: -1,
  },
  heroAccent: {
    background: "linear-gradient(135deg, #0ea5e9, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#64748b",
    fontSize: 16,
    lineHeight: 1.75,
    marginBottom: 32,
    maxWidth: 460,
  },
  heroRight: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    minHeight: 400,
  },
  biometricFrame: {
    width: 280,
    height: 320,
    border: "1px solid rgba(56,189,248,0.25)",
    borderRadius: 20,
    background: "rgba(14,165,233,0.04)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow:
      "0 0 60px rgba(14,165,233,0.1), inset 0 0 40px rgba(14,165,233,0.04)",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#38bdf8",
    borderStyle: "solid",
    zIndex: 3,
  },
  topLeft: {
    top: 14,
    left: 14,
    borderWidth: "2px 0 0 2px",
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 14,
    right: 14,
    borderWidth: "2px 2px 0 0",
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 14,
    left: 14,
    borderWidth: "0 0 2px 2px",
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 14,
    right: 14,
    borderWidth: "0 2px 2px 0",
    borderBottomRightRadius: 6,
  },
  scanLine: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: 1,
    background: "linear-gradient(90deg, transparent, #38bdf8, transparent)",
    zIndex: 4,
    boxShadow: "0 0 8px #38bdf8",
  },
  scanStatus: {
    position: "absolute",
    bottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 5,
  },
  scanDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#38bdf8",
    boxShadow: "0 0 8px #38bdf8",
  },
  floatCard1: {
    position: "absolute",
    top: 30,
    right: -10,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(56,189,248,0.2)",
    borderRadius: 14,
    padding: "14px 20px",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  floatCard2: {
    position: "absolute",
    bottom: 40,
    left: -10,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: 14,
    padding: "14px 20px",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  features: {
    position: "relative",
    zIndex: 5,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "60px 32px 100px",
    textAlign: "center",
  },
  featuresLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    letterSpacing: 3,
    color: "#38bdf8",
    marginBottom: 16,
  },
  featuresTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 38,
    color: "#f1f5f9",
    marginBottom: 48,
    letterSpacing: -0.5,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 24,
    textAlign: "left",
  },
};
