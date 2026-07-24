import React from 'react';
import { Movie, FilterOptions } from '@/types/cinema';
import { MapPin, Film, PlayCircle } from 'lucide-react';

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
      if (
        filters.selectedCinemaIds.length > 0 &&
        !filters.selectedCinemaIds.includes(sched.cinemaId)
      ) {
        return;
      }

      if (filters.selectedChain !== 'ALL' && sched.chain !== filters.selectedChain) {
        return;
      }

      if (filters.maxPrice < 150000 && sched.price > filters.maxPrice) {
        return;
      }

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
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
        <Film className="w-12 h-12 text-on-surface-variant/40 mb-3" />
        <h3 className="text-lg font-bold text-on-background">Tidak ada jadwal tayang</h3>
        <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
          Cobalah sesuaikan filter pencarian, rentang harga, atau pilihan jam tayang Anda di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant/80 text-[11px] font-bold uppercase border-b border-outline-variant tracking-wider">
              <th className="py-3 px-5">Film & Detail</th>
              <th className="py-3 px-5">Lokasi Bioskop</th>
              <th className="py-3 px-5">Studio & Harga</th>
              <th className="py-3 px-5">Jadwal Tayang (WIB)</th>
              <th className="py-3 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-sm text-on-background">
            {tableRows.map((row, idx) => {
              let chainBadge = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
              if (row.chain === 'CGV') {
                chainBadge = 'bg-red-500/10 text-red-600 border-red-500/20';
              } else if (row.chain === 'Cinepolis') {
                chainBadge = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
              }

              return (
                <tr
                  key={`${row.movie.id}-${row.cinemaId}-${row.studioType}-${idx}`}
                  className="hover:bg-surface-container-low transition-all group"
                >
                  {/* Movie Info */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-14 rounded-lg overflow-hidden bg-surface-container-high shrink-0 shadow-sm">
                        <img
                          src={row.movie.poster}
                          alt={row.movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-extrabold text-on-background group-hover:text-primary transition-colors text-sm line-clamp-1">
                          {row.movie.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-on-surface-variant font-medium">
                          <span className="bg-surface-container-high px-1 py-0.2 rounded font-bold text-on-surface">
                            {row.movie.ageRating}
                          </span>
                          <span>•</span>
                          <span>{row.movie.duration}</span>
                          <span>•</span>
                          <span className="text-amber-600 font-extrabold">★ {row.movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cinema Location */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-on-background text-sm">{row.cinemaName}</span>
                        <span
                          className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase ${chainBadge}`}
                        >
                          {row.chain}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">Palembang, Indonesia</span>
                      </div>
                    </div>
                  </td>

                  {/* Studio & Price */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded w-fit">
                        {row.studioType}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        Rp {row.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </td>

                  {/* Showtimes */}
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1">
                      {row.filteredTimes.map((time) => (
                        <span
                          key={time}
                          className="bg-surface-container-low border border-outline-variant hover:border-primary hover:text-primary text-on-background text-xs font-bold px-2 py-1 rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onSelectMovie(row.movie)}
                      className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-primary-container px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
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
