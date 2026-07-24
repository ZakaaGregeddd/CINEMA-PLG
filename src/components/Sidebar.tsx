import React from 'react';
import { Film, MapPin, Search, RefreshCw, LayoutGrid, Table } from 'lucide-react';
import { PALEMBANG_CINEMAS } from '@/data/palembangData';

interface SidebarProps {
  selectedCinemaId: string | null;
  onSelectCinema: (id: string | null) => void;
  viewMode: 'grid' | 'table';
  onToggleViewMode: (mode: 'grid' | 'table') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCinemaId,
  onSelectCinema,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-surface/90 border-r border-surface-border p-4 flex flex-col gap-6 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-extrabold text-xl">
            P
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white leading-none">
              CINEMA<span className="text-primary">PLG</span>
            </h1>
            <p className="text-xs text-text-muted mt-1">Jadwal Bioskop Palembang</p>
          </div>
        </div>
      </div>

      {/* View Switcher Button */}
      <div className="bg-background/80 p-1 rounded-xl flex items-center border border-surface-border">
        <button
          onClick={() => onToggleViewMode('grid')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'grid'
              ? 'bg-primary text-black shadow-md'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Katalog
        </button>
        <button
          onClick={() => onToggleViewMode('table')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'table'
              ? 'bg-primary text-black shadow-md'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" />
          Tabel Jadwal
        </button>
      </div>

      {/* All Cinemas Button */}
      <div>
        <button
          onClick={() => onSelectCinema(null)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
            selectedCinemaId === null
              ? 'bg-primary/10 border-2 border-primary text-primary font-bold shadow-lg shadow-amber-500/10'
              : 'bg-surface-hover/50 hover:bg-surface-hover text-text-main border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold">Semua Bioskop (Palembang)</span>
          </div>
          <span className="text-xs bg-surface-border px-2 py-0.5 rounded-full text-text-muted">
            8
          </span>
        </button>
      </div>

      {/* Cinema List Navigation */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
          Daftar Bioskop Palembang
        </h2>
        <div className="space-y-1.5">
          {PALEMBANG_CINEMAS.map((cinema) => {
            const isSelected = selectedCinemaId === cinema.id;
            let chainBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            if (cinema.chain === 'CGV') {
              chainBadgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
            } else if (cinema.chain === 'Cinepolis') {
              chainBadgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            }

            return (
              <button
                key={cinema.id}
                onClick={() => onSelectCinema(cinema.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1.5 border ${
                  isSelected
                    ? 'bg-primary/15 border-primary text-white shadow-md'
                    : 'bg-surface/40 hover:bg-surface-hover border-surface-border/50 text-text-muted hover:text-text-main'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {cinema.name}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${chainBadgeColor}`}
                  >
                    {cinema.chain}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-text-muted leading-tight">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                  <span className="line-clamp-2">{cinema.address}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-surface-border text-[11px] text-text-muted flex items-center justify-between">
        <span>API-Driven (No DB)</span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Vercel Ready
        </span>
      </div>
    </aside>
  );
};
