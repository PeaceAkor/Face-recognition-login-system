import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const icons = {
  courses: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  results: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  fees: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  notices: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

const cards = [
  {
    id: "courses",
    title: "Course Registration",
    desc: "Register and manage your courses for the semester",
    color: "#0ea5e9",
    icon: "courses",
  },
  {
    id: "results",
    title: "Check Results",
    desc: "View and download your semester results",
    color: "#a78bfa",
    icon: "results",
  },
  {
    id: "fees",
    title: "Pay Fees",
    desc: "Pay school fees, hostel & other levies",
    color: "#34d399",
    icon: "fees",
  },
  {
    id: "notices",
    title: "Notices",
    desc: "Read official announcements and circulars",
    color: "#fb923c",
    icon: "notices",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user") ||
      '{"fullName":"Amaka Osei","matricNumber":"CSC/2021/042"}',
  );
  const [hovered, setHovered] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "ST";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
        }
        .dash-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s;
          background: var(--card-glow);
        }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--card-color); }
        .dash-card:hover::before { opacity: 1; }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 9px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.6);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-item:hover { padding-left: 6px; }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px 24px;
          text-align: center;
          flex: 1;
        }
      `}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoDot} />
          <span style={styles.logoText}>SchoolPortal</span>
        </div>

        <nav style={styles.sideNav}>
          {cards.map((c) => (
            <div
              key={c.id}
              style={{
                ...styles.navItem,
                ...(hovered === c.id
                  ? { background: "rgba(255,255,255,0.06)", color: "#f1f5f9" }
                  : {}),
              }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ color: hovered === c.id ? c.color : "#475569" }}>
                {icons[c.icon]}
              </span>
              {c.title}
            </div>
          ))}
        </nav>

        <div style={styles.sidebarUser}>
          <div style={styles.avatarSmall}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Syne', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName}
            </div>
            <div
              style={{
                color: "#475569",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {user?.matricNumber}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f87171",
              padding: 4,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <p style={styles.greetingSmall}>{greeting} 👋</p>
            <h1 style={styles.greetingName}>{user?.fullName}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={styles.sessionBadge}>
              <div style={styles.liveIndicator} />
              Session Active
            </div>
            <button className="logout-btn" onClick={logout}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Card */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeLeft}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 4,
                }}
              >
                Matric Number
              </p>
              <p
                style={{
                  color: "#38bdf8",
                  fontSize: 20,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                }}
              >
                {user?.matricNumber}
              </p>
            </div>
          </div>
          <div style={styles.verifiedBadge}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Face Verified
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Current Semester", value: "2nd Semester" },
            { label: "Registered Courses", value: "6 Courses" },
            { label: "GPA (Last Sem)", value: "4.25 / 5.0" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div
                style={{
                  color: "#64748b",
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Cards */}
        <div style={styles.cardGrid}>
          {cards.map((c) => (
            <div
              key={c.id}
              className="dash-card"
              style={{
                "--card-color": c.color,
                "--card-glow": `linear-gradient(135deg, ${c.color}08, transparent)`,
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  background: `${c.color}18`,
                  color: c.color,
                }}
              >
                {icons[c.icon]}
              </div>
              <h4 style={styles.cardTitle}>{c.title}</h4>
              <p style={styles.cardDesc}>{c.desc}</p>
              <div style={{ ...styles.cardArrow, color: c.color }}>Open →</div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div style={styles.activityPanel}>
          <h3 style={styles.panelTitle}>Recent Activity</h3>
          {[
            {
              text: "Face authentication login successful",
              time: "Just now",
              color: "#34d399",
            },
            {
              text: "Student profile verified by system",
              time: "2 min ago",
              color: "#38bdf8",
            },
            {
              text: "Dashboard access granted",
              time: "2 min ago",
              color: "#a78bfa",
            },
          ].map((a) => (
            <div key={a.text} className="activity-item">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: a.color,
                  boxShadow: `0 0 8px ${a.color}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "#94a3b8",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  flex: 1,
                }}
              >
                {a.text}
              </span>
              <span
                style={{
                  color: "#334155",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                }}
              >
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#030712",
    display: "flex",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    width: 240,
    background: "rgba(15,23,42,0.9)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 20,
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 24px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 24,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    boxShadow: "0 0 8px rgba(14,165,233,0.8)",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 16,
    color: "#f1f5f9",
  },
  sideNav: {
    flex: 1,
    padding: "0 12px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 14px",
    borderRadius: 12,
    color: "#64748b",
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebarUser: {
    padding: "16px 16px 0",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "'Syne', sans-serif",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    marginLeft: 240,
    padding: "32px 40px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  greetingSmall: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 4,
  },
  greetingName: {
    color: "#f1f5f9",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  sessionBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(52,211,153,0.1)",
    border: "1px solid rgba(52,211,153,0.2)",
    borderRadius: 100,
    padding: "6px 14px",
    color: "#34d399",
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#34d399",
    boxShadow: "0 0 6px #34d399",
    animation: "pulseRing 2s infinite",
  },
  welcomeCard: {
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.05))",
    border: "1px solid rgba(14,165,233,0.15)",
    borderRadius: 20,
    padding: "24px 28px",
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeLeft: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: 18,
    fontFamily: "'Syne', sans-serif",
    boxShadow: "0 0 20px rgba(14,165,233,0.4)",
    border: "2px solid rgba(14,165,233,0.3)",
  },
  verifiedBadge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(52,211,153,0.1)",
    border: "1px solid rgba(52,211,153,0.2)",
    borderRadius: 100,
    padding: "7px 16px",
    color: "#34d399",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    marginBottom: 28,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  cardTitle: {
    color: "#e2e8f0",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 8,
  },
  cardDesc: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.65,
    marginBottom: 18,
  },
  cardArrow: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    letterSpacing: 0.3,
  },
  activityPanel: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "24px 28px",
  },
  panelTitle: {
    color: "#e2e8f0",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 16,
  },
};
