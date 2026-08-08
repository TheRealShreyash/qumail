import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProfileDropdown({ user: mockUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();

  const activeUser = authUser || mockUser;

  const initials = activeUser?.name
    ? activeUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "QM";

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
      >
        {activeUser?.image ? (
          <img
            src={activeUser.image}
            alt={activeUser.name}
            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {initials}
          </div>
        )}
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-slate-700">{activeUser?.name || "User"}</p>
            <p className="truncate text-xs text-slate-400">{activeUser?.email || ""}</p>
          </div>
          <div className="my-1 border-t border-slate-100" />
          <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <Settings size={15} /> Settings
          </Link>
          <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50">
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

