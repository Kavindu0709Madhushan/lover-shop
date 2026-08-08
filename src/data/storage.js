// All worker data lives in the browser's localStorage.
// This is a frontend-only system: nothing is sent to any server.

const STORAGE_KEY = "bloomtag_workers";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read workers from localStorage", err);
    return [];
  }
}

function writeAll(workers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
}

export function getWorkers() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function getWorkerById(id) {
  return readAll().find((w) => w.id === id) || null;
}

export function saveWorker(worker) {
  const workers = readAll();
  const index = workers.findIndex((w) => w.id === worker.id);
  if (index >= 0) {
    workers[index] = worker;
  } else {
    workers.push(worker);
  }
  writeAll(workers);
  return worker;
}

export function deleteWorker(id) {
  const workers = readAll().filter((w) => w.id !== id);
  writeAll(workers);
}

export function makeWorkerId() {
  // Short, URL-friendly unique id, e.g. "w-l3f9a2k1"
  return "w-" + Math.random().toString(36).slice(2, 10);
}

// The QR code encodes a full URL that points straight at this worker's
// public profile page. Scanning it with any phone camera opens the page
// directly - no app needed.
export function getWorkerProfileUrl(id) {
  return `${window.location.origin}${window.location.pathname}#/w/${id}`;
}
