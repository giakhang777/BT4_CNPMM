import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    name: "",
    email: "",
  },
  appLoading: false,
});

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      name: "",
      email: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, appLoading, setAppLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
