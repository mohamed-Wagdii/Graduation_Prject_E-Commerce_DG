import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ProtectRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}
