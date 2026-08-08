import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Inbox from "../pages/Inbox";
import EmailReading from "../pages/EmailReading";
import Compose from "../pages/Compose";
import SecurityConfig from "../pages/SecurityConfig";
import KeyManager from "../pages/KeyManager";
import SecurityLogs from "../pages/SecurityLogs";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/inbox" element={<Inbox folder="inbox" />} />
          <Route path="/sent" element={<Inbox folder="sent" />} />
          <Route path="/drafts" element={<Inbox folder="drafts" />} />
          <Route path="/trash" element={<Inbox folder="trash" />} />
          <Route path="/mail/:id" element={<EmailReading />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/security" element={<SecurityConfig />} />
          <Route path="/keys" element={<KeyManager />} />
          <Route path="/logs" element={<SecurityLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

