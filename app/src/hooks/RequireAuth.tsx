import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth.user && !localStorage.getItem("authToken")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};
