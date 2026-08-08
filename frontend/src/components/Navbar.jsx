import { Bell, ShieldCheck } from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import { currentUser } from "../data/mockUser";

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ShieldCheck size={16} />
        </div>
        <span className="font-display text-lg font-semibold text-slate-800">QuMail</span>
      </div>

      <SearchBar value="" onChange={() => {}} className="mx-auto w-full max-w-md" />

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
          title="Connected to Key Manager"
        >
          <span className="quantum-pulse h-1.5 w-1.5 rounded-full bg-green-500" />
          KM Live
        </div>
        <button aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <ProfileDropdown user={currentUser} />
      </div>
    </header>
  );
}
