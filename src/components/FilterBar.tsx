import React from 'react';
import { Search, Clock, DollarSign, X, Calendar } from 'lucide-react';
import { FilterOptions } from '@/types/cinema';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilter: (newFilters: FilterOptions) => void;
  onReset: () => void;
  isCinemaSelected: boolean;
  dateOptions: Array<{ label: string; value: string }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilter,
  onReset,
  isCinemaSelected,
  dateOptions,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Card 1: Search Bar (Clean and Spacious) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-md flex items-center gap-4">
        <div className="relative w-full group">
          <Search className="w-5 h-5 absolute left-4.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-primary transition-colors duration-300" />
          <input
            type="text"
            placeholder="Cari judul film, genre, atau pemeran..."
            value={filters.searchQuery}
            onChange={(e) => onChangeFilter({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-surface-container-low/70 hover:bg-surface-container-low/90 focus:bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl pl-12 pr-10 py-3 text-sm text-on-background placeholder-on-surface-variant/50 focus:outline-none transition-all duration-300 shadow-inner font-medium"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilter({ ...filters, searchQuery: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary active:scale-95 transition-all duration-200 cursor-pointer"
              title="Bersihkan"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card 2: Filter Options (Dates & Selectors) */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-md flex flex-col gap-4">
        
        {/* Date Selector Row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-on-surface-variant/60 uppercase tracking-wider pl-1">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Pilih Tanggal Nonton</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {dateOptions.map((opt) => {
              const d = new Date(opt.value);
              const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
              const dayName = days[d.getDay()];
              const dateNum = d.getDate();
              const isActive = filters.selectedDate === opt.value;
              
              return (
                <button
                  key={opt.value}
                  onClick={() => onChangeFilter({ ...filters, selectedDate: opt.value })}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-16 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-md scale-102 font-extrabold'
                      : 'bg-surface-container-low/50 hover:bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-primary/20'
                  }`}
                >
                  <span className="text-[9px] font-bold tracking-wider opacity-75">{dayName}</span>
                  <span className="text-lg font-black leading-none mt-0.5">{dateNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdowns & Pills Row */}
        <div className="flex flex-wrap items-center gap-3 border-t border-outline-variant/20 pt-4">
          
          {/* Chain Filter - Hidden if user has selected a specific cinema */}
          {!isCinemaSelected && (
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={filters.selectedChain}
                onChange={(e) => onChangeFilter({ ...filters, selectedChain: e.target.value })}
                className="bg-surface-container-low/60 hover:bg-surface-container-low hover:border-primary/40 border border-outline-variant/50 rounded-xl px-3 py-2 text-xs font-bold text-on-background focus:outline-none focus:border-primary transition-all duration-300 cursor-pointer w-full"
              >
                <option value="ALL" className="bg-surface text-on-surface">Semua Bioskop (XXI, CGV, Cinepolis)</option>
                <option value="XXI" className="bg-surface text-on-surface">Cinema XXI Palembang</option>
                <option value="CGV" className="bg-surface text-on-surface">CGV Cinemas Palembang</option>
                <option value="Cinepolis" className="bg-surface text-on-surface">Cinepolis Palembang</option>
              </select>
            </div>
          )}

          {/* Time Slot Filter */}
          <div className="flex items-center gap-1 bg-surface-container-low/60 border border-outline-variant/50 rounded-xl p-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <Clock className="w-3.5 h-3.5 text-primary ml-2.5 hidden md:block shrink-0" />
            {[
              { id: 'ALL', label: 'Semua Jam' },
              { id: 'MORNING', label: 'Pagi' },
              { id: 'AFTERNOON', label: 'Siang' },
              { id: 'EVENING', label: 'Malam' },
            ].map((slot) => (
              <button
                key={slot.id}
                onClick={() => onChangeFilter({ ...filters, timeSlot: slot.id as any })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  filters.timeSlot === slot.id
                    ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          {/* Max Price Filter */}
          <div className="flex items-center gap-2 bg-surface-container-low/60 hover:bg-surface-container-low hover:border-primary/40 border border-outline-variant/50 rounded-xl px-3 py-2 transition-all duration-300 flex-1 sm:flex-initial">
            <DollarSign className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-[10px] text-on-surface-variant font-extrabold tracking-wider uppercase whitespace-nowrap">Maks:</span>
            <select
              value={filters.maxPrice}
              onChange={(e) => onChangeFilter({ ...filters, maxPrice: Number(e.target.value) })}
              className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer pr-1 w-full sm:w-auto"
            >
              <option value={150000} className="bg-surface text-on-surface">Semua Harga</option>
              <option value={40000} className="bg-surface text-on-surface">≤ Rp 40k</option>
              <option value={55000} className="bg-surface text-on-surface">≤ Rp 55k</option>
              <option value={80000} className="bg-surface text-on-surface">≤ Rp 80k</option>
              <option value={100000} className="bg-surface text-on-surface">≤ Rp 100k</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl border border-outline-variant/50 text-on-surface-variant/70 hover:text-primary hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 hover:rotate-90 ml-auto"
            title="Reset Semua Filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

