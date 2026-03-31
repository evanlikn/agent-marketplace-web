"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearAuthSession, getAuthSession } from "../lib/auth-client";

export function TopNav(): JSX.Element {
  const pathname = usePathname();
  const [email, setEmail] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    setEmail(session?.user.email ?? "");
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  const onLogout = () => {
    clearAuthSession();
    setMenuOpen(false);
    setEmail("");
    window.location.href = "/login";
  };

  const avatarLabel = email ? email.slice(0, 1).toUpperCase() : "U";

  return (
    <header className="top-nav-shell">
      <div className="container row" style={{ justifyContent: "space-between", paddingTop: 16, paddingBottom: 16 }}>
        <div className="row">
          <Link href="/">Marketplace</Link>
        </div>
        <div className="row">
          {email ? (
            <div className="avatar-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="avatar-link avatar-button"
                aria-label="Open user menu"
                title={email}
                onClick={() => setMenuOpen((v) => !v)}
              >
                {avatarLabel}
              </button>
              {menuOpen ? (
                <div className="avatar-menu card">
                  <Link href="/account" className="avatar-menu-item" onClick={() => setMenuOpen(false)}>
                    Details
                  </Link>
                  <button type="button" className="avatar-menu-item avatar-menu-danger" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
