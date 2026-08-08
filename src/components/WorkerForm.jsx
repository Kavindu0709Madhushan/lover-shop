import { useState, useEffect, useRef } from "react";
import { uploadImageToImgbb } from "../data/imgbb.js";
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

export default function WorkerForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(""); // local preview shown while uploading
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
    setPreview("");
    setError("");
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    // Show an instant local preview while the real upload happens.
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError("");
    setUploading(true);

    try {
      const hostedUrl = await uploadImageToImgbb(file);
      update("photo", hostedUrl);
    } catch (err) {
      console.error(err);
      setError("Photo upload failed. Check your ImgBB API key and internet connection.");
      setPreview("");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.role.trim()) {
      setError("Name, phone number and job role are required.");
      return;
    }
    if (uploading) {
      setError("Please wait for the photo to finish uploading.");
      return;
    }
    setError("");
    onSave(form);
  }

  const photoToShow = preview || form.photo;

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
            {photoToShow ? (
              <img src={photoToShow} alt="" />
            ) : (
              <span>{form.name?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div>
            <button
              type="button"
              className="worker-form__upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : form.photo ? "Change photo" : "Upload photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />
            <p className="worker-form__hint">
              JPG or PNG. Hosted on ImgBB so it loads on every customer's phone.
            </p>
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
          <button
            type="button"
            className="worker-form__cancel"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="worker-form__submit"
            disabled={saving || uploading}
          >
            {saving ? "Saving…" : initial ? "Save changes" : "Add worker"}
          </button>
        </div>
      </form>
    </div>
  );
}
