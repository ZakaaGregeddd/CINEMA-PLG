import React from 'react';
import { Film, MapPin, LayoutGrid, Table, Clapperboard } from 'lucide-react';
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
    <aside className="w-full lg:w-72 bg-surface-container-lowest lg:border-r border-b lg:border-b-0 border-outline-variant p-4 flex flex-col gap-6 shrink-0 shadow-lg lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-outline flex items-center justify-center shadow-md text-white shrink-0">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-primary leading-none">
              Cinema<span className="text-on-background">Palembang</span>
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 opacity-80 font-semibold">Jadwal Bioskop Sumsel</p>
          </div>
        </div>
      </div>

      {/* View Switcher Button */}
      <div className="bg-surface-container-low p-1 rounded-xl flex items-center border border-outline-variant">
        <button
          onClick={() => onToggleViewMode('grid')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-primary text-white shadow-md'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Katalog
        </button>
        <button
          onClick={() => onToggleViewMode('table')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'table'
              ? 'bg-primary text-white shadow-md'
              : 'text-on-surface-variant hover:text-primary'
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
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border cursor-pointer ${
            selectedCinemaId === null
              ? 'bg-primary/10 border-primary text-primary font-extrabold shadow-sm'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold">Semua Bioskop</span>
          </div>
          <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded-full text-on-surface-variant font-semibold">
            8
          </span>
        </button>
      </div>

      {/* Cinema List Navigation */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h2 className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-3 px-1">
          Daftar Bioskop Palembang
        </h2>
        <div className="space-y-1.5">
          {PALEMBANG_CINEMAS.map((cinema) => {
            const isSelected = selectedCinemaId === cinema.id;
            let chainBadgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            if (cinema.chain === 'CGV') {
              chainBadgeColor = 'bg-red-500/10 text-red-600 border-red-500/20';
            } else if (cinema.chain === 'Cinepolis') {
              chainBadgeColor = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            }

            return (
              <button
                key={cinema.id}
                onClick={() => onSelectCinema(cinema.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary shadow-sm font-semibold'
                    : 'bg-surface-container/50 hover:bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:text-primary'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-primary' : 'text-on-background'}`}>
                    {cinema.name}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border shrink-0 ${chainBadgeColor}`}
                  >
                    {cinema.chain}
                  </span>
                </div>
                <div className="flex items-start gap-1 text-[11px] text-on-surface-variant leading-tight opacity-80">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                  <span className="line-clamp-2">{cinema.address}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-outline-variant text-[11px] text-on-surface-variant flex items-center justify-between opacity-80 shrink-0">
        <span>No Database (API)</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Vercel Ready
        </span>
      </div>
    </aside>
  );
};
