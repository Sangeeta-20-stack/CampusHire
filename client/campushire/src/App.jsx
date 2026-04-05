import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Page
import Landing from "./pages/common/Landing";

export default function App() {
  return (
    <BrowserRouter>

      {/* ✅ Global Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0b1a2f",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>

    </BrowserRouter>
  );
}