import { useParams, Link } from "react-router-dom";
import { getWorkerById } from "../data/storage.js";
import "./WorkerProfile.css";

export default function WorkerProfile() {
  const { id } = useParams();
  const worker = getWorkerById(id);

  if (!worker) {
    return (
      <div className="profile profile--empty">
        <div className="profile__card">
          <p className="profile__eyebrow">Bloom &amp; Tag</p>
          <h1>We couldn't find this staff tag</h1>
          <p className="profile__note">
            This QR code may be for a device other than the shop's, or the
            worker was removed. Please ask a staff member for help.
          </p>
          <Link to="/" className="profile__back">
            Go to staff directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__card">
        <p className="profile__eyebrow">Bloom &amp; Tag · Meet the team</p>

        <div className="profile__photo">
          {worker.photo ? (
            <img src={worker.photo} alt="" />
          ) : (
            <span>{worker.name?.[0]?.toUpperCase() || "?"}</span>
          )}
        </div>

        <h1>{worker.name}</h1>
        <p className="profile__role">{worker.role}</p>

        <div className="profile__details">
          <div className="profile__row">
            <span className="profile__label">Section</span>
            <span className="profile__value">{worker.section}</span>
          </div>
          <div className="profile__row">
            <span className="profile__label">Phone</span>
            <a className="profile__value profile__phone" href={`tel:${worker.phone}`}>
              {worker.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
