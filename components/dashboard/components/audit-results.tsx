"use client";

import React, { useState } from "react";
import { 
  IconPhoto, 
  IconLink, 
  IconCode, 
  IconLayoutGrid,
  IconArrowLeft,
  IconExternalLink,
  IconFileText,
  IconSearch,
  IconClipboard,
  IconChevronLeft,
  IconChevronRight,
  IconX
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface AuditResultsProps {
  data: any;
  onBack: () => void;
}

export function AuditResults({ data, onBack }: AuditResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = activeTab === "images" ? 12 : 10;

  const tabs = [
    { id: "overview", label: "Overview", icon: <IconLayoutGrid size={18} /> },
    { id: "images", label: "Images", icon: <IconPhoto size={18} /> },
    { id: "links", label: "Links", icon: <IconLink size={18} /> },
  ];

  const isMultipage = data.mode === "multi";
  
  let imagesRaw: any[] = [];
  let linksRaw: any[] = [];

  if (isMultipage && Array.isArray(data.pages)) {
    // Aggregate from all pages for site crawl
    data.pages.forEach((page: any) => {
      if (Array.isArray(page.images)) imagesRaw = [...imagesRaw, ...page.images];
      if (Array.isArray(page.links)) linksRaw = [...linksRaw, ...page.links];
    });
    
    // De-duplicate
    imagesRaw = Array.from(new Set(imagesRaw.map(img => typeof img === 'string' ? img : JSON.stringify(img))))
      .map(img => img.startsWith('{') ? JSON.parse(img) : img);
    linksRaw = Array.from(new Set(linksRaw.map(link => typeof link === 'string' ? link : JSON.stringify(link))))
      .map(link => link.startsWith('{') ? JSON.parse(link) : link);
  } else {
    // Single page mode or fallback
    imagesRaw = data?.pages?.[0]?.images || data?.images || [];
    linksRaw = data?.pages?.[0]?.links || data?.links || [];
  }
  
  const images = imagesRaw.map((img: any) => typeof img === 'string' ? img : img?.src || img?.url || '').filter(Boolean);
  const links = linksRaw.map((link: any) => typeof link === 'string' ? link : link?.href || link?.url || link?.src || '').filter(Boolean);
  
  const filteredImages = images.filter((img: string) => img.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLinks = links.filter((link: string) => link.toLowerCase().includes(searchQuery.toLowerCase()));

  // Pagination logic
  const currentItems = activeTab === "images" ? filteredImages : filteredLinks;
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = currentItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page on filter or tab change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Card */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={onBack}
                className="h-12 w-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all active:scale-95"
              >
                <IconArrowLeft size={24} />
              </button>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{data.url || "Scan Results"}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-400">
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                    ID: {data.analysisIds?.[0]?.substring(0, 8) || "N/A"}
                  </span>
                  <span className="uppercase tracking-widest">{data.mode || "Single"} Mode</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
            <a 
              href={data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-neutral-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span>Visit Site</span>
              <IconExternalLink size={16} />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit">
        {tabs.map((tab) => (activeTab === tab.id ? (
          <motion.button
            key={tab.id}
            layoutId="activeTab"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl shadow-sm text-xs font-black uppercase tracking-widest"
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ) : (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-neutral-600 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
          >
            {tab.icon}
            {tab.label}
          </button>
        )))}
      </div>

      {/* Content Area */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
        <CardContent className="p-0">
          {/* Internal Search */}
          {(activeTab === "images" || activeTab === "links") && (
            <div className="p-8 border-b border-neutral-50 flex items-center justify-between gap-4">
              <div className="relative group max-w-md w-full">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all focus:bg-white"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                <span>{activeTab === "images" ? images.length : links.length} Items Found</span>
              </div>
            </div>
          )}

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Page Title</p>
                    <p className="text-xl font-black text-neutral-900 leading-tight">{data.summary?.title || data.example?.title || data.title || "No title found"}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Description</p>
                    <p className="text-sm font-bold text-neutral-500 leading-relaxed">{data.summary?.description || data.example?.description || data.description || "No description found"}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Audit Summary</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center">
                        <p className="text-2xl font-black text-blue-600">{images.length}</p>
                        <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest mt-1">Images</p>
                      </div>
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-center">
                        <p className="text-2xl font-black text-emerald-600">{links.length}</p>
                        <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">Links</p>
                      </div>
                      {data.summary?.totalPages && (
                        <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50 text-center">
                          <p className="text-2xl font-black text-purple-600">{data.summary.totalPages}</p>
                          <p className="text-[9px] font-black text-purple-600/60 uppercase tracking-widest mt-1">Pages</p>
                        </div>
                      )}
                      {data.summary?.totalMetaTags && (
                        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 text-center">
                          <p className="text-2xl font-black text-amber-600">{data.summary.totalMetaTags}</p>
                          <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mt-1">Meta Tags</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {data.summary?.technologies && data.summary.technologies.length > 0 && (
                  <div className="pt-8 border-t border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Detected Technologies</p>
                    <div className="flex flex-wrap gap-3">
                      {data.summary.technologies.map((tech: string, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-neutral-900/10 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedItems.map((img: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="group relative bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 aspect-square flex flex-col items-center justify-center p-4 cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`Audit asset ${idx}`}
                        className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => e.target.style.display = 'none'}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-white font-bold truncate mb-2">{img}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(img);
                            }}
                            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter"
                          >
                            Copy URL
                          </button>
                          <a 
                            href={img} 
                            target="_blank" 
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center"
                          >
                            <IconExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </div>
            )}

            {activeTab === "links" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  {paginatedItems.map((link: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100 rounded-2xl group hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                          <IconLink size={18} />
                        </div>
                        <span className="text-sm font-bold text-neutral-900 truncate">{link}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => navigator.clipboard.writeText(link)}
                          className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                        >
                          <IconClipboard size={18} />
                        </button>
                        <a 
                          href={link} 
                          target="_blank" 
                          className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <IconExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm cursor-zoom-out"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full flex flex-col items-center gap-6"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl shadow-xl transition-all active:scale-95 group z-[110]"
              >
                <IconX size={24} stroke={3} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="relative bg-white p-2 rounded-[2rem] shadow-2xl overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Full preview"
                  className="max-h-[70vh] w-auto object-contain rounded-2xl md:rounded-[1.5rem]"
                />
              </div>
              
              <div className="flex gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl w-fit">
                <button 
                  onClick={() => navigator.clipboard.writeText(selectedImage)}
                  className="px-6 py-3 bg-white text-neutral-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-neutral-100 transition-all active:scale-95 flex items-center gap-3"
                >
                  <IconClipboard size={18} />
                  Copy URL
                </button>
                <a 
                  href={selectedImage} 
                  target="_blank" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-blue-500/20"
                >
                  <IconExternalLink size={18} />
                  Open Original
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl border border-neutral-100 bg-white text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400 transition-all shadow-sm active:scale-95"
      >
        <IconChevronLeft size={18} />
      </button>
      
      <div className="flex items-center gap-1.5">
        {visiblePages.map((p, i) => {
          const prevPage = visiblePages[i - 1];
          const showEllipsis = prevPage && p - prevPage > 1;
          
          return (
            <React.Fragment key={p}>
              {showEllipsis && <span className="text-neutral-300 font-bold px-1">...</span>}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  "h-10 min-w-[2.5rem] flex items-center justify-center rounded-xl text-xs font-black transition-all active:scale-95",
                  currentPage === p 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white border border-neutral-100 text-neutral-400 hover:text-neutral-900 hover:border-neutral-200"
                )}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl border border-neutral-100 bg-white text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400 transition-all shadow-sm active:scale-95"
      >
        <IconChevronRight size={18} />
      </button>
    </div>
  );
}
