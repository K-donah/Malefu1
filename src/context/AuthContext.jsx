import React, { createContext, useContext, useEffect, useState } from "react";

/*
 AuthContext:
 - user: { id, name, email, role }
 - login({email,password}) -> returns { success, user }
 - register({name,email,password,role}) -> returns { success, user }
 - logout()
*/

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cg_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("cg_user", JSON.stringify(user));
    else localStorage.removeItem("cg_user");
  }, [user]);

  // Mock login/register for prototype
  const login = async ({ email, password }) => {
    // Built-in admin demo account
    if (email === "admin@career.com" && password === "admin123") {
      const admin = { id: "admin-1", name: "Administrator", email, role: "admin" };
      setUser(admin);
      return { success: true, user: admin };
    }

    // Check existing saved users in localStorage (cg_users)
    try {
      const saved = JSON.parse(localStorage.getItem("cg_users")) || [];
      const found = saved.find(u => u.email === email && u.password === password);
      if (found) {
        const u = { id: found.id, name: found.name, email: found.email, role: found.role };
        setUser(u);
        return { success: true, user: u };
      }
    } catch (e) {}

    return { success: false };
  };

  const register = async ({ name, email, password, role = "student" }) => {
    // Save to cg_users
    try {
      const saved = JSON.parse(localStorage.getItem("cg_users")) || [];
      if (saved.find(u => u.email === email)) {
        return { success: false, message: "Email already registered" };
      }
      const newUser = { id: `u_${Date.now()}`, name, email, password, role };
      saved.push(newUser);
      localStorage.setItem("cg_users", JSON.stringify(saved));
      const u = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
      setUser(u);
      return { success: true, user: u };
    } catch (e) {
      return { success: false, message: "Registration error" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
