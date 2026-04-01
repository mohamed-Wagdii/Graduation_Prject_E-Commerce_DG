import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/app" />;
  return children;
}
