// Shared data layer backed by Firebase Firestore.
// This makes worker data visible from ANY device/browser - not just the
// one that added it - which is what makes QR scanning work from a
// customer's own phone. See README.md for how to set up your free
// Firebase project and connect it here.

import { db } from "./firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const workersCol = collection(db, "workers");

export async function getWorkers() {
  const snap = await getDocs(query(workersCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => d.data());
}

// Real-time subscription: any change (from any device) updates every
// admin dashboard that's currently open, automatically.
export function subscribeToWorkers(onData, onError) {
  const q = query(workersCol, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (err) => {
      console.error(err);
      if (onError) onError(err);
    }
  );
}

export async function getWorkerById(id) {
  const snap = await getDoc(doc(workersCol, id));
  return snap.exists() ? snap.data() : null;
}

export async function saveWorker(worker) {
  await setDoc(doc(workersCol, worker.id), worker);
  return worker;
}

export async function deleteWorker(id) {
  await deleteDoc(doc(workersCol, id));
}

export function makeWorkerId() {
  return "w-" + Math.random().toString(36).slice(2, 10);
}

// The QR code encodes a full URL that points straight at this worker's
// public profile page. Scanning it with any phone camera opens the page
// directly - no app needed.
export function getWorkerProfileUrl(id) {
  return `${window.location.origin}${window.location.pathname}#/w/${id}`;
}
