import { useNavigate } from "react-router-dom";

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="site-header">
        <div className="brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
          <span className="brand-mark"><ShieldIcon /></span>
          <span>
            <strong>Civic<span>Care</span></strong>
            <small>Community Complaint Portal</small>
          </span>
        </div>
        <div className="header-badge"><span /> Built for better communities</div>
      </header>

      <main className="home-hero">
        <section className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> PUBLIC ISSUE REPORTING</div>
          <h1>See an issue?<br /><em>Speak up. Improve it.</em></h1>
          <p className="hero-description">
            Report potholes, overflowing bins, fallen trees and other civic issues directly through a simple, secure reporting process.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate("/complaint")}>
              Raise a Complaint <ArrowIcon />
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate("/admin/login")}>
              Admin Login
            </button>
          </div>
          <div className="trust-row">
            <div><b>01</b><span>Describe the issue</span></div>
            <div><b>02</b><span>Verify your email</span></div>
            <div><b>03</b><span>Complaint submitted</span></div>
          </div>
        </section>

        <section className="hero-visual" aria-label="Civic services overview">
          <div className="visual-orb orb-one" />
          <div className="visual-orb orb-two" />
          <div className="city-card">
            <div className="city-card-top">
              <span className="live-pill"><i /> LIVE REPORTING</span>
              <span className="city-pin">●</span>
            </div>
            <div className="city-scene">
              <div className="sun" />
              <div className="cloud cloud-a" /><div className="cloud cloud-b" />
              <div className="building b1" /><div className="building b2" /><div className="building b3" />
              <div className="road" /><div className="road-line" />
              <div className="tree tree-a"><span /><b /></div>
              <div className="tree tree-b"><span /><b /></div>
              <div className="bin"><i /></div>
            </div>
            <div className="issue-tags">
              <span>Roads</span><span>Waste</span><span>Public spaces</span>
            </div>
          </div>
          <div className="floating-stat"><strong>24/7</strong><span>Issue reporting</span></div>
          <div className="floating-status"><span className="check">✓</span><span><b>Secure verification</b><small>Email OTP protected</small></span></div>
        </section>
      </main>

      <footer className="home-footer">
        <span>Report responsibly. Help your neighbourhood move forward.</span>
        <span className="footer-dot" />
        <span>Your report is handled securely.</span>
        <span className="footer-dot" />
        <a
          href="https://www.linkedin.com/in/utsav-mathur-7074b52a5/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
}
