import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("labtrackUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("labtrackUser", JSON.stringify(user));
    else localStorage.removeItem("labtrackUser");
  }, [user]);

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!email || !password) {
      throw new Error("Please enter your email and password.");
    }

    if (email === "admin@labtrack.edu" && password === "admin123") {
      const loggedInUser = {
        id: 1,
        name: "Administrator",
        email,
        role: "Administrator",
      };
      setUser(loggedInUser);
      return loggedInUser;
    }

    throw new Error("Invalid email or password. Try admin@labtrack.edu / admin123.");
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}