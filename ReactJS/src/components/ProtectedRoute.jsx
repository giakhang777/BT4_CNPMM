import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth.context.jsx";

const ProtectedRoute = ({ children }) => {
  const { auth, appLoading } = useContext(AuthContext);
  if (appLoading) return null; // spinner đã ở App.jsx
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
