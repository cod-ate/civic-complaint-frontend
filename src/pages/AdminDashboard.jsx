import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComplaints, solveComplaint, deleteComplaint, imageUrl, imageHeaders, adminLogout } from "../api";

function ProtectedImage({ id }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let objectUrl;
    fetch(imageUrl(id), { headers: imageHeaders() })
      .then((response) => { if (!response.ok) throw new Error("Image unavailable"); return response.blob(); })
      .then((blob) => { objectUrl = URL.createObjectURL(blob); setSrc(objectUrl); })
      .catch(() => setSrc(""));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);
  if (!src) return <p className="muted">Image unavailable.</p>;
  return <img src={src} alt="Complaint scene" />;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") { navigate("/admin/login"); return; }
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try { setLoading(true); const data = await getComplaints(); setComplaints(data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function markSolved(id) {
    if (!window.confirm("Mark this complaint as solved and email the user?")) return;
    try { await solveComplaint(id); alert("Solved email sent successfully."); }
    catch (err) { alert(err.message); }
  }

  async function removeComplaint(id) {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try { await deleteComplaint(id); setComplaints((old) => old.filter((c) => c.id !== id)); }
    catch (err) { alert(err.message); }
  }

  async function logout() {
    try { await adminLogout(); } catch (err) {}
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminToken");
    navigate("/");
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-nav">
        <div className="brand"><span className="brand-mark">✓</span><span><strong>Civic<span>Care</span></strong><small>Administration</small></span></div>
        <button className="btn btn-outline nav-logout" onClick={logout}>Log out <span>→</span></button>
      </header>

      <main className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMINISTRATION • OVERVIEW</p>
            <h1>Complaint Dashboard</h1>
            <p className="muted">Review incoming civic reports in the order they were received.</p>
          </div>
          <div className="dashboard-count"><strong>{complaints.length}</strong><span>Total reports</span></div>
        </div>

        {error && <div className="alert alert-error"><span>!</span>{error}</div>}

        {loading ? <div className="empty-card"><span className="spinner dark" /><h3>Loading reports</h3><p>Fetching the latest community complaints.</p></div>
        : complaints.length === 0 ? <div className="empty-card"><div className="empty-icon">✓</div><h3>No complaints yet</h3><p>New community reports will appear here.</p></div>
        : <div className="complaint-list">
          {complaints.map((c) => (
            <article className="complaint-card card" key={c.id}>
              <div className="complaint-top">
                <div className="complaint-id"><span>REPORT</span><h2>Complaint #{c.id}</h2><p className="date">{new Date(c.createdAt).toLocaleString()}</p></div>
                <div className="actions"><button className="btn btn-success" title="Mark solved and email user" onClick={() => markSolved(c.id)}>✓ <span>Solve</span></button><button className="btn btn-danger" title="Delete complaint" onClick={() => removeComplaint(c.id)}>Delete</button></div>
              </div>
              <div className="details-grid">
                <div><span className="detail-label">REPORTED BY</span><p>{c.name}</p></div>
                <div><span className="detail-label">EMAIL</span><p>{c.email}</p></div>
                <div className="detail-wide"><span className="detail-label">ISSUE DESCRIPTION</span><p>{c.complaint}</p></div>
                <div className="detail-wide"><span className="detail-label">LOCATION</span><a className="map-link" href={c.location} target="_blank" rel="noreferrer">Open in Google Maps <span>↗</span></a></div>
              </div>
              {c.image && <div className="scene-image"><div className="image-heading"><span className="detail-label">ATTACHED EVIDENCE</span><span>Complaint image</span></div><ProtectedImage id={c.id} /></div>}
            </article>
          ))}
        </div>}
      </main>
    </div>
  );
}