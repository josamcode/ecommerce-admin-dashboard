import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status using JWT
  const checkLoginStatus = async () => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const response = await fetch("/api/validateToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (data.valid) {
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // login
  const login = async (username, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.success) {
        Cookies.set("authToken", data.token, {
          secure: true,
          sameSite: "strict",
        });
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // logout
  const logout = () => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
