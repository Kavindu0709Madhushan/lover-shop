import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  subscribeToWorkers,
  saveWorker,
  deleteWorker,
  makeWorkerId,
} from "../data/storage.js";
import WorkerForm from "../components/WorkerForm.jsx";
import IdTag from "../components/IdTag.jsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, worker = edit
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const qrRefs = useRef({});

  useEffect(() => {
    const unsubscribe = subscribeToWorkers(
      (list) => {
        setWorkers(list);
        setLoading(false);
        setLoadError(false);
      },
      () => {
        setLoading(false);
        setLoadError(true);
      }
    );
    return () => unsubscribe();
  }, []);

  async function handleSave(formData) {
    setSaving(true);
    try {
      const worker = editing?.id
        ? { ...editing, ...formData }
        : { ...formData, id: makeWorkerId(), createdAt: Date.now() };
      await saveWorker(worker);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Could not save this worker. Check your Firebase setup and internet connection.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteWorker(id);
    } catch (err) {
      console.error(err);
      alert("Could not remove this worker. Check your internet connection.");
    } finally {
      setConfirmDelete(null);
    }
  }

  const downloadQr = useCallback((worker) => {
    const canvas = qrRefs.current[worker.id];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${worker.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow">Staff Directory</p>
          <h1>Bloom &amp; Tag</h1>
          <p className="admin__sub">
            Add your team, then print or share each person's QR tag. Customers
            scan it to see who they're talking to - from any phone, anywhere.
          </p>
        </div>
        <button className="admin__add-btn" onClick={() => setEditing({})}>
          + Add worker
        </button>
      </header>

      {loadError && (
        <div className="admin__banner admin__banner--error">
          Couldn't connect to the database. Double check your Firebase config
          in <code>.env</code> (see README.md) and your internet connection.
        </div>
      )}

      {loading ? (
        <p className="admin__loading">Loading staff…</p>
      ) : workers.length === 0 ? (
        <div className="admin__empty">
          <p>No workers added yet.</p>
          <button className="admin__add-btn" onClick={() => setEditing({})}>
            + Add your first worker
          </button>
        </div>
      ) : (
        <div className="admin__grid">
          {workers.map((worker) => (
            <article className="worker-card" key={worker.id}>
              <div className="worker-card__tag">
                <IdTag
                  worker={worker}
                  size="small"
                  qrRef={(el) => (qrRefs.current[worker.id] = el)}
                />
              </div>
              <div className="worker-card__actions">
                <Link to={`/w/${worker.id}`} className="worker-card__link">
                  View profile
                </Link>
                <button onClick={() => downloadQr(worker)}>Download QR</button>
                <button onClick={() => setEditing(worker)}>Edit</button>
                <button
                  className="worker-card__danger"
                  onClick={() => setConfirmDelete(worker)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing !== null && (
        <WorkerForm
          initial={editing.id ? editing : null}
          onSave={handleSave}
          onCancel={() => !saving && setEditing(null)}
          saving={saving}
        />
      )}

      {confirmDelete && (
        <div className="worker-form-overlay" role="dialog" aria-modal="true">
          <div className="confirm-box">
            <h2>Remove {confirmDelete.name}?</h2>
            <p>Their QR code will stop working immediately. This can't be undone.</p>
            <div className="confirm-box__actions">
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="worker-card__danger"
                onClick={() => handleDelete(confirmDelete.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
