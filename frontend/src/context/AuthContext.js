import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        const baseUser = {
          id: decoded.sub,
          username: decoded.username || decoded.userName,
          name: decoded.name || decoded.fullName || null,
          role: decoded.role || null,
          token,
        };

        API.get(`/users/username/${baseUser.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            const u = res.data;
            setUser({
              ...baseUser,
              rank: u.rank || "N/A",
              establishment: u.establishment?.name || "N/A",
            });
          })
          .catch(() => setUser(baseUser));
      } catch (err) {
        console.error("Invalid token in storage:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    const baseUser = {
      username: decoded.username || decoded.userName,
      name: decoded.name || decoded.fullName || null,
      role: decoded.role || null,
      token,
    };

    API.get(`/users/username/${baseUser.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const u = res.data;
        setUser({
          ...baseUser,
          rank: u.rank || "N/A",
          establishment: u.establishment?.name || "N/A",
        });
      })
      .catch(() => setUser(baseUser));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
