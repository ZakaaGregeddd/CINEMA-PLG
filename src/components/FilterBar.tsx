import React from 'react';
import { Search, Clock, DollarSign, X } from 'lucide-react';
import { FilterOptions } from '@/types/cinema';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilter: (newFilters: FilterOptions) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChangeFilter, onReset }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 shadow-md">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
        <input
          type="text"
          placeholder="Cari judul film, genre, atau cast..."
          value={filters.searchQuery}
          onChange={(e) => onChangeFilter({ ...filters, searchQuery: e.target.value })}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2 text-sm text-on-background placeholder-on-surface-variant/60 focus:outline-none focus:border-primary transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onChangeFilter({ ...filters, searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Chain Filter */}
        <select
          value={filters.selectedChain}
          onChange={(e) => onChangeFilter({ ...filters, selectedChain: e.target.value })}
          className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-xs font-bold text-on-background focus:outline-none focus:border-primary"
        >
          <option value="ALL">Semua Bioskop (XXI, CGV, Cinepolis)</option>
          <option value="XXI">Cinema XXI Palembang</option>
          <option value="CGV">CGV Cinemas Palembang</option>
          <option value="Cinepolis">Cinepolis Palembang</option>
        </select>

        {/* Time Slot Filter */}
        <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant rounded-xl p-1">
          <Clock className="w-3.5 h-3.5 text-primary ml-2 hidden sm:block" />
          {[
            { id: 'ALL', label: 'Semua Jam' },
            { id: 'MORNING', label: 'Pagi (<14)' },
            { id: 'AFTERNOON', label: 'Siang (14-18)' },
            { id: 'EVENING', label: 'Malam (>18)' },
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => onChangeFilter({ ...filters, timeSlot: slot.id as any })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filters.timeSlot === slot.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>

        {/* Max Price Filter */}
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5">
          <DollarSign className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">Maks:</span>
          <select
            value={filters.maxPrice}
            onChange={(e) => onChangeFilter({ ...filters, maxPrice: Number(e.target.value) })}
            className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer"
          >
            <option value={150000}>Semua Harga</option>
            <option value={40000}>≤ Rp 40.000</option>
            <option value={55000}>≤ Rp 55.000</option>
            <option value={80000}>≤ Rp 80.000</option>
            <option value={100000}>≤ Rp 100.000</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onReset}
          className="p-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
          title="Reset Filter"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
