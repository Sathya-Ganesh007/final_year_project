"use client";

import React from "react";
import { 
  IconBell, 
  IconMenu2
} from "@tabler/icons-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {

  return (
    <header className="h-16 md:h-24 border-b border-neutral-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 w-full gap-4 md:gap-8 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <IconMenu2 size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="relative cursor-pointer group p-2">
          <div className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 border-2 border-white rounded-full transition-transform group-hover:scale-110" />
          <IconBell className="text-neutral-400 group-hover:text-neutral-900 transition-colors" size={20} />
        </div>
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm ring-1 ring-neutral-100 cursor-pointer hover:scale-105 transition-all">
          GA
        </div>
      </div>
    </header>
  );
}
