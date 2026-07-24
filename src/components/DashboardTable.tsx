import React from 'react';
import { Movie, FilterOptions } from '@/types/cinema';
import { PALEMBANG_CINEMAS } from '@/data/palembangData';
import { MapPin, Clock, DollarSign, Film, Sparkles, PlayCircle } from 'lucide-react';

interface DashboardTableProps {
  movies: Movie[];
  filters: FilterOptions;
  onSelectMovie: (movie: Movie) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  movies,
  filters,
  onSelectMovie,
}) => {
  // Flatten movie schedules for table matrix view
  const tableRows: Array<{
    movie: Movie;
    cinemaName: string;
    cinemaId: string;
    chain: string;
    studioType: string;
    price: number;
    filteredTimes: string[];
  }> = [];

  movies.forEach((movie) => {
    movie.schedules.forEach((sched) => {
      // Apply cinema filter
      if (
        filters.selectedCinemaIds.length > 0 &&
        !filters.selectedCinemaIds.includes(sched.cinemaId)
      ) {
        return;
      }

      // Apply chain filter
      if (filters.selectedChain !== 'ALL' && sched.chain !== filters.selectedChain) {
        return;
      }

      // Apply price filter
      if (filters.maxPrice < 150000 && sched.price > filters.maxPrice) {
        return;
      }

      // Apply time slot filter
      let filteredTimes = sched.times;
      if (filters.timeSlot !== 'ALL') {
        filteredTimes = sched.times.filter((t) => {
          const hour = parseInt(t.split(':')[0], 10);
          if (filters.timeSlot === 'MORNING') return hour < 14;
          if (filters.timeSlot === 'AFTERNOON') return hour >= 14 && hour < 18;
          if (filters.timeSlot === 'EVENING') return hour >= 18;
          return true;
        });
      }

      if (filteredTimes.length > 0) {
        tableRows.push({
          movie,
          cinemaName: sched.cinemaName,
          cinemaId: sched.cinemaId,
          chain: sched.chain,
          studioType: sched.studioType,
          price: sched.price,
          filteredTimes,
        });
      }
    });
  });

  if (tableRows.length === 0) {
    return (
      <div className="bg-surface/50 border border-surface-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <Film className="w-12 h-12 text-text-muted mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-white">Tidak ada jadwal yang cocok</h3>
        <p className="text-sm text-text-muted mt-1 max-w-md">
          Coba sesuaikan filter pencarian, rentang harga, atau pilihan jam tayang Anda di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface/90 border border-surface-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/90 text-text-muted text-xs font-extrabold uppercase border-b border-surface-border tracking-wider">
              <th className="py-4 px-5">Film & Details</th>
              <th className="py-4 px-5">Lokasi Bioskop</th>
              <th className="py-4 px-5">Studio & Harga</th>
              <th className="py-4 px-5">Jadwal Tayang (Palembang WIB)</th>
              <th className="py-4 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 text-sm">
            {tableRows.map((row, idx) => {
              let chainBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
              if (row.chain === 'CGV') {
                chainBadge = 'bg-red-500/20 text-red-400 border-red-500/30';
              } else if (row.chain === 'Cinepolis') {
                chainBadge = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
              }

              return (
                <tr
                  key={`${row.movie.id}-${row.cinemaId}-${row.studioType}-${idx}`}
                  className="hover:bg-surface-hover/60 transition-all group"
                >
                  {/* Movie Info Column */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-surface-border shrink-0 shadow-md">
                        <img
                          src={row.movie.poster}
                          alt={row.movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white group-hover:text-primary transition-all text-base line-clamp-1">
                          {row.movie.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <span className="bg-surface-border px-1.5 py-0.5 rounded font-semibold text-white">
                            {row.movie.ageRating}
                          </span>
                          <span>•</span>
                          <span>{row.movie.duration}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">★ {row.movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cinema Location Column */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{row.cinemaName}</span>
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border uppercase ${chainBadge}`}
                        >
                          {row.chain}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="line-clamp-1">Palembang</span>
                      </div>
                    </div>
                  </td>

                  {/* Studio & Price Column */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-extrabold text-primary bg-primary-container/40 border border-primary/30 px-2 py-0.5 rounded-md inline-block w-fit">
                        {row.studioType}
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        Rp {row.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </td>

                  {/* Showtimes Column */}
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {row.filteredTimes.map((time) => (
                        <span
                          key={time}
                          className="bg-background border border-surface-border hover:border-primary hover:text-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onSelectMovie(row.movie)}
                      className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/40 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Detail / Trailer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
