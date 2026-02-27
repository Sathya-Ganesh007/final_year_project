"use client";

import React from "react";
import { 
  IconSearch, 
  IconBell, 
  IconSettings,
  IconMenu2
} from "@tabler/icons-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 md:h-20 border-b border-neutral-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 w-full gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <IconMenu2 size={24} />
        </button>
        
        <div className="max-w-md w-full relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-neutral-50/50 border border-neutral-100 rounded-xl py-2 md:py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative cursor-pointer group p-2">
          <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full transition-transform group-hover:scale-110" />
          <IconBell className="text-neutral-500 group-hover:text-neutral-900 transition-colors" size={22} />
        </div>
      </div>
    </header>
  );
}
