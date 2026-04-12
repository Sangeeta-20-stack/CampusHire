import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F8FAF8",   // same as student theme
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#1B2D1E",
    }}>

      {/* SIDEBAR (desktop) */}
      <aside style={{ display: "none" }} className="admin-sidebar">
        <Sidebar />
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 40,
          }}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 232,
        background: "#FAFDF8",
        zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .2s ease",
      }}>
        <Sidebar />
      </div>

      {/* MAIN */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}>

        {/* TOP BAR */}
        <header style={{
          height: 56,
          background: "#F8FAF8",
          borderBottom: "0.5px solid #D8E8DA",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}>

          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "none",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "0.5px solid #D8E8DA",
              background: "#fff",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            className="mobile-btn"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          <p style={{ margin: 0, fontWeight: 600 }}>Admin Panel</p>

        </header>

        {/* CONTENT */}
        <main style={{
          flex: 1,
          padding: 20,
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}>
          <Outlet />
        </main>
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar {
            display: block !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}