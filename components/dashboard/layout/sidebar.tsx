"use client";

import React from "react";
import { 
  IconLayoutDashboard, 
  IconClipboardList, 
  IconListCheck, 
  IconSettings, 
  IconLogout,
  IconSearch,
  IconBell,
  IconChevronDown,
  IconAlertTriangle,
  IconTimeline,
  IconX,
  IconCode
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", href: "/dashboard", icon: <IconLayoutDashboard size={20} /> },
        { label: "Recent Crawls", href: "/dashboard/crawls", icon: <IconTimeline size={20} /> },
        { label: "Risk Issues", href: "/dashboard/issues", icon: <IconAlertTriangle size={20} />, badge: 12 },
        { label: "Advanced Data", href: "/dashboard/advanced", icon: <IconCode size={20} /> },
      ]
    },
    {
      title: "PREFERENCES",
      items: [
        { label: "Settings", href: "/dashboard/config", icon: <IconSettings size={20} /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-100 bg-white flex flex-col h-screen shrink-0 transition-transform duration-300 md:sticky md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">AuditPro</h1>
          <button 
            onClick={onClose}
            className="p-2 md:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <p className="px-2 text-[10px] font-bold text-neutral-400 tracking-wider">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-2 py-2.5 rounded-xl transition-all group",
                        isActive 
                          ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20" 
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "transition-colors",
                          isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"
                        )}>
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                          isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-50">
          <button className="flex items-center gap-3 px-2 py-2.5 w-full text-neutral-500 hover:text-red-600 transition-colors">
            <IconLogout size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
