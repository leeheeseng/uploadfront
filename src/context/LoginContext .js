import { createContext, useState, useEffect, useContext } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
