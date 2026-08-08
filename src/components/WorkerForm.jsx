import { useState, useEffect, useRef } from "react";
import "./WorkerForm.css";

const SECTIONS = [
  "Bouquet Counter",
  "Delivery",
  "Cash Counter",
  "Nursery Care",
  "Design Studio",
  "Wedding & Events",
  "Other",
];

const emptyForm = {
  name: "",
  phone: "",
  section: SECTIONS[0],
  role: "",
  photo: "",
};

export default function WorkerForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
    setError("");
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.role.trim()) {
      setError("Name, phone number and job role are required.");
      return;
    }
    setError("");
    onSave(form);
  }

  return (
    <div className="worker-form-overlay" role="dialog" aria-modal="true">
      <form className="worker-form" onSubmit={handleSubmit}>
        <div className="worker-form__head">
          <h2>{initial ? "Edit worker" : "Add a new worker"}</h2>
          <button
            type="button"
            className="worker-form__close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="worker-form__photo-row">
          <div className="worker-form__photo-preview">
            {form.photo ? (
              <img src={form.photo} alt="" />
            ) : (
              <span>{form.name?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div>
            <button
              type="button"
              className="worker-form__upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.photo ? "Change photo" : "Upload photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />
            <p className="worker-form__hint">JPG or PNG, stored on this device only.</p>
          </div>
        </div>

        <label className="worker-form__field">
          <span>Full name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Nimasha Perera"
          />
        </label>

        <label className="worker-form__field">
          <span>Phone number</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. 077 123 4567"
          />
        </label>

        <label className="worker-form__field">
          <span>Work section</span>
          <select
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
          >
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="worker-form__field">
          <span>Job role</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="e.g. Senior Florist"
          />
        </label>

        {error && <p className="worker-form__error">{error}</p>}

        <div className="worker-form__actions">
          <button type="button" className="worker-form__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="worker-form__submit">
            {initial ? "Save changes" : "Add worker"}
          </button>
        </div>
      </form>
    </div>
  );
}
