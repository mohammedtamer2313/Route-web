import { useState, useRef, useEffect } from "react";
import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { FiHome, FiUser, FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { getUserAvatar, getUserName } from "../../utils/postHelpers";
import routeLogo from "../../assets/route-logo.jpg";

const navLinkClass = ({ isActive }: NavLinkRenderProps) =>
  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
    isActive ? "bg-rp-navy/10 text-rp-navy" : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const name = getUserName(user);
  const avatar = getUserAvatar(user);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src={routeLogo}
            alt="Route"
            className="h-9 w-auto rounded-lg"
            draggable={false}
          />
          <span className="font-bold text-gray-900 hidden sm:inline">Route Posts</span>
        </div>

        <nav className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
          <NavLink to="/feed" className={navLinkClass}>
            <FiHome /> <span className="hidden sm:inline">Feed</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <FiUser /> <span className="hidden sm:inline">Profile</span>
          </NavLink>
          <NavLink to="/notifications" className={navLinkClass}>
            <FiBell /> <span className="hidden sm:inline">Notifications</span>
          </NavLink>
        </nav>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-gray-200 pl-1.5 pr-2.5 py-1 hover:bg-gray-50"
          >
            <Avatar src={avatar} name={name} size="sm" />
            <span className="text-sm font-medium text-gray-800 max-w-[110px] truncate hidden md:inline">
              {name}
            </span>
            <FiChevronDown className="text-gray-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                View profile
              </NavLink>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiLogOut /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}