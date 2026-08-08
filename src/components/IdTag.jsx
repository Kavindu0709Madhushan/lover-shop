import { QRCodeCanvas } from "qrcode.react";
import { getWorkerProfileUrl } from "../data/storage.js";
import "./IdTag.css";

// A worker's identity, rendered like a garden plant marker: a ribbon loop
// at the top, a cream card body, the worker's photo, their details, and a
// QR code a customer can scan to pull the same details up on their phone.
export default function IdTag({ worker, size = "regular", qrRef }) {
  const url = getWorkerProfileUrl(worker.id);

  return (
    <div className={`id-tag id-tag--${size}`}>
      <svg className="id-tag__ribbon" viewBox="0 0 120 40" aria-hidden="true">
        <path
          d="M10 40 L10 14 Q10 4 20 4 L100 4 Q110 4 110 14 L110 40"
          fill="none"
          stroke="var(--moss)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      <div className="id-tag__body">
        <div className="id-tag__photo">
          {worker.photo ? (
            <img src={worker.photo} alt="" />
          ) : (
            <span className="id-tag__photo-fallback">
              {worker.name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>

        <p className="id-tag__eyebrow">{worker.section || "Team member"}</p>
        <h3 className="id-tag__name">{worker.name}</h3>
        <p className="id-tag__role">{worker.role}</p>

        <div className="id-tag__divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              d="M12 3c2 3 2 6 0 9-2-3-2-6 0-9Z M12 21c-2-3-2-6 0-9 2 3 2 6 0 9Z"
              fill="var(--blush)"
            />
          </svg>
          <span />
        </div>

        <p className="id-tag__phone">{worker.phone}</p>

        <div className="id-tag__qr">
          <QRCodeCanvas
            ref={qrRef}
            value={url}
            size={size === "small" ? 76 : 128}
            bgColor="#ffffff"
            fgColor="#22301f"
            level="M"
            marginSize={2}
          />
        </div>
        <p className="id-tag__scan-hint">Scan to view profile</p>
      </div>
    </div>
  );
}
