"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Sliders,
  FileCheck2,
  Settings,
  LogOut,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { authService } from "@/services/authService";

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Candidates", href: "/admin/candidates", icon: Users },
    { name: "Question Bank", href: "/admin/questions", icon: HelpCircle },
    { name: "Active Assessment", href: "/admin/assessment", icon: Sliders },
    { name: "Results & Scores", href: "/admin/results", icon: FileCheck2 },
    { name: "Settings & Logs", href: "/admin/settings", icon: Settings }
  ];

  const handleLogout = () => {
    authService.logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-black text-white border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Logo size="small" />
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/15">
              Admin
            </span>
          </div>

          {/* Nav Items */}
          <div className="px-4 py-6 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Management Portal
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 group
                    ${
                      isActive
                        ? "bg-white text-slate-950 shadow-md shadow-black/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400 group-hover:text-white"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
                ES
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">Administrator</div>
                <div className="text-[10px] text-slate-400 truncate">admin@emperorss.com</div>
              </div>
            </div>
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
