import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";

export const AuthStatus = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <p>
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
};
