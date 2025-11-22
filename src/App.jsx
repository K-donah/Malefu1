import React from "react";
import RoutesConfig from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import "./index.css";
import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <RoutesConfig />
        <ToastContainer position="top-right" />
      </ApplicationProvider>
    </AuthProvider>
  );
}