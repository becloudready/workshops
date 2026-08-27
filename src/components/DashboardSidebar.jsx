import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const NAVIGATION_BY_ROLE = {
  customer: [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", path: "/customer" },
    { key: "accounts", label: "Accounts", icon: "accounts" },
    { key: "transfers", label: "Transfers", icon: "transfers" },
    { key: "transactions", label: "Transactions", icon: "transactions" },
    { key: "profile", label: "Profile", icon: "profile" },
    { key: "support", label: "Support", icon: "support" },
    { key: "logout", label: "Logout", icon: "logout", action: "logout" },
  ],
  teller: [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", path: "/teller" },
    { key: "customers", label: "Customers", icon: "customers" },
    { key: "accounts", label: "Accounts", icon: "accounts" },
    { key: "transactions", label: "Transactions", icon: "transactions" },
    { key: "create-account", label: "Create Account", icon: "create-account" },
    { key: "support", label: "Support", icon: "support" },
    { key: "logout", label: "Logout", icon: "logout", action: "logout" },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", path: "/admin" },
    { key: "customers", label: "Customers", icon: "customers" },
    { key: "accounts", label: "Accounts", icon: "accounts" },
    { key: "transactions", label: "Transactions", icon: "transactions" },
    { key: "users-roles", label: "Users & Roles", icon: "users-roles", path: "/admin/users-roles" },
    { key: "reports", label: "Reports", icon: "reports" },
    { key: "settings", label: "Settings", icon: "settings" },
    { key: "logout", label: "Logout", icon: "logout", action: "logout" },
  ],
};

const ICON_PATHS = {
  dashboard: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </>
  ),
  accounts: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M16 13h5M6 6V4h12v2" />
      <circle cx="17" cy="13" r=".75" fill="currentColor" stroke="none" />
    </>
  ),
  transfers: (
    <>
      <path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3" />
    </>
  ),
  transactions: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  support: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2ZM17 17c0 2-2 4-5 4" />
    </>
  ),
  customers: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M14 15.5a5 5 0 0 1 7 4.5" />
    </>
  ),
  "create-account": (
    <>
      <path d="m3 9 9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />
      <path d="M18 3v4M16 5h4" />
    </>
  ),
  "users-roles": (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M17 11l4 2v3c0 2.5-1.7 4.3-4 5-2.3-.7-4-2.5-4-5v-3l4-2Z" />
    </>
  ),
  reports: (
    <>
      <path d="M6 3h9l4 4v14H6V3Z" />
      <path d="M15 3v5h4M9 17v-3M12 17v-6M15 17v-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
    </>
  ),
};

function NavigationIcon({ name }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300/70 bg-amber-400/10 text-xs font-extrabold tracking-tight text-amber-300">
        TP
      </span>
      <span className="text-sm font-bold tracking-tight text-white">TrustPoint Bank</span>
    </div>
  );
}

function SidebarPanel({ items, currentPath, onItemClick, onClose, closeButtonRef }) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#062b4f] to-[#092440] px-3 py-5 text-white shadow-xl">
      <div className="flex items-center justify-between px-2 pb-6">
        <Brand />

        {onClose && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="Close navigation menu"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col" aria-label="Dashboard navigation">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = item.path === currentPath;

            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onItemClick(item)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    isActive
                      ? "bg-slate-300/25 text-white shadow-sm"
                      : "text-slate-200 hover:bg-slate-300/15 hover:text-white"
                  } ${item.action === "logout" ? "mt-4" : ""}`}
                >
                  <NavigationIcon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function DashboardSidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const role = user?.role;
  const items = NAVIGATION_BY_ROLE[role] ?? NAVIGATION_BY_ROLE.customer;

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    closeButtonRef.current?.focus();

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function handleItemClick(item) {
    setMobileMenuOpen(false);

    if (item.action === "logout") {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    if (item.path) {
      navigate(item.path);
      return;
    }

    onNavigate?.(item.key);
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#062b4f] px-4 text-white shadow-md lg:hidden">
        <Brand />

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-controls="dashboard-mobile-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label="Open navigation menu"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <aside className="hidden h-screen w-60 shrink-0 lg:sticky lg:top-0 lg:flex">
        <SidebarPanel
          items={items}
          currentPath={location.pathname}
          onItemClick={handleItemClick}
        />
      </aside>

      {mobileMenuOpen && (
        <div
          id="dashboard-mobile-navigation"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-label="Dashboard navigation"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          />

          <aside className="relative h-full w-60 max-w-[85vw]">
            <SidebarPanel
              items={items}
              currentPath={location.pathname}
              onItemClick={handleItemClick}
              onClose={closeMobileMenu}
              closeButtonRef={closeButtonRef}
            />
          </aside>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;
