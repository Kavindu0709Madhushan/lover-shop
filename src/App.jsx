import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import WorkerProfile from "./pages/WorkerProfile.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/w/:id" element={<WorkerProfile />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}
