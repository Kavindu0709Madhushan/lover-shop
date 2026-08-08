import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getWorkerById } from "../data/storage.js";
import "./WorkerProfile.css";

export default function WorkerProfile() {
  const { id } = useParams();
  const [worker, setWorker] = useState(undefined); // undefined = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setWorker(undefined);
    setError(false);
    getWorkerById(id)
      .then((w) => {
        if (!cancelled) setWorker(w);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (worker === undefined && !error) {
    return (
      <div className="profile">
        <p className="profile__loading">Loading…</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="profile profile--empty">
        <div className="profile__card">
          <p className="profile__eyebrow">Bloom &amp; Tag</p>
          <h1>We couldn't find this staff tag</h1>
          <p className="profile__note">
            {error
              ? "We couldn't reach the database right now. Please check your connection and try again."
              : "This worker may have been removed. Please ask a staff member for help."}
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
