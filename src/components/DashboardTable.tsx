import React from 'react';
import { Movie, FilterOptions } from '@/types/cinema';
import { MapPin, Film, PlayCircle, Info } from 'lucide-react';

interface DashboardTableProps {
  movies: Movie[];
  filters: FilterOptions;
  selectedCinemaId: string | null;
  onSelectMovie: (movie: Movie) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  movies,
  filters,
  selectedCinemaId,
  onSelectMovie,
}) => {
  const tableRows: Array<{
    movie: Movie;
    cinemaNamesText: string;
    studioTypesText: string;
    priceText: string;
    matchedSchedules: any[];
  }> = [];

  movies.forEach((movie) => {
    // Filter schedules based on sidebar selection or filters
    const matchedSchedules = movie.schedules.filter((sched) => {
      // Filter by sidebar selection
      if (selectedCinemaId && sched.cinemaId !== selectedCinemaId) {
        return false;
      }

      if (
        filters.selectedCinemaIds.length > 0 &&
        !filters.selectedCinemaIds.includes(sched.cinemaId)
      ) {
        return false;
      }

      if (filters.selectedChain !== 'ALL' && sched.chain !== filters.selectedChain) {
        return false;
      }

      if (filters.maxPrice < 150000 && sched.price > filters.maxPrice) {
        return false;
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

      return filteredTimes.length > 0;
    });

    if (matchedSchedules.length > 0) {
      // Combine cinema names
      const cinemaNames = matchedSchedules.map((s) => s.cinemaName.replace(' Palembang', ''));
      const uniqueCinemas = Array.from(new Set(cinemaNames));
      const cinemaNamesText = uniqueCinemas.join(', ');

      // Combine studio types
      const studios = matchedSchedules.map((s) => s.studioType);
      const uniqueStudios = Array.from(new Set(studios));
      const studioTypesText = uniqueStudios.join(', ');

      // Prices range
      const prices = matchedSchedules.map((s) => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceText =
        minPrice === maxPrice
          ? `Rp ${minPrice.toLocaleString('id-ID')}`
          : `Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')}`;

      tableRows.push({
        movie,
        cinemaNamesText,
        studioTypesText,
        priceText,
        matchedSchedules,
      });
    }
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
              {!selectedCinemaId && <th className="py-3 px-5">Lokasi Bioskop</th>}
              <th className="py-3 px-5">Studio & Rentang Harga</th>
              {selectedCinemaId && <th className="py-3 px-5">Jadwal Tayang (WIB)</th>}
              <th className="py-3 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-sm text-on-background">
            {tableRows.map((row, idx) => {
              return (
                <tr
                  key={`${row.movie.id}-${idx}`}
                  className="hover:bg-surface-container-low transition-all group animate-in fade-in duration-150"
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
                  {!selectedCinemaId && (
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-on-background text-xs line-clamp-2">
                          {row.cinemaNamesText}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant/80">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Palembang, Indonesia</span>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Studio & Price Range */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1 max-w-[180px]">
                      <span className="text-[9px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded w-fit uppercase tracking-wide truncate">
                        {row.studioTypesText}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-emerald-600">
                          {row.priceText}
                        </span>
                        <div className="relative group/tooltip inline-block align-middle">
                          <Info className="w-3.5 h-3.5 text-on-surface-variant/60 hover:text-primary cursor-pointer transition-colors" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-surface-container-high text-on-surface text-[10px] p-2 rounded-lg shadow-lg border border-outline-variant whitespace-normal w-48 z-50 text-center font-bold">
                            Harga mungkin tidak sesuai, harap periksa kembali melalui aplikasi/website resmi
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Showtimes (Cinema specific) */}
                  {selectedCinemaId && (
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-2">
                        {row.matchedSchedules.map((sched: any, sIdx: number) => {
                          const todayStr = new Date().toLocaleDateString('sv');
                          const isToday = filters.selectedDate === todayStr;
                          let highlightIdx = -1;
                          if (isToday) {
                            const now = new Date();
                            const currentMinutes = now.getHours() * 60 + now.getMinutes();
                            highlightIdx = (sched.times as string[]).findIndex((t) => {
                              const [h, m] = t.split(':').map(Number);
                              return (h * 60 + m) >= currentMinutes;
                            });
                          } else if (sched.times.length > 0) {
                            highlightIdx = 0;
                          }

                          return (
                            <div key={sIdx} className="flex flex-col gap-1">
                              <span className="text-[9px] font-extrabold text-primary uppercase tracking-wide">
                                {sched.studioType} • Rp {sched.price.toLocaleString('id-ID')}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {(sched.times as string[]).map((time: string, tIdx: number) => {
                                  const isHighlighted = tIdx === highlightIdx;
                                  return (
                                    <span
                                      key={time}
                                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer shadow-sm ${isHighlighted
                                          ? 'bg-primary text-white border border-primary font-extrabold scale-105'
                                          : 'bg-surface-container-low border border-outline-variant/60 text-on-background hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                      {time}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  )}

                  {/* Action */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onSelectMovie(row.movie)}
                      className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-primary/90 px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Detail dan Jadwal
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
