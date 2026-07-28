import React from 'react';
import { Movie } from '@/types/cinema';
import { Star, Clock, MapPin, Play, Ticket, Info } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  selectedCinemaId?: string | null;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, selectedCinemaId, onSelectMovie }) => {
  const schedulesToDisplay = selectedCinemaId
    ? movie.schedules.filter((s) => s.cinemaId === selectedCinemaId)
    : movie.schedules;

  const locations = schedulesToDisplay.map((s) => s.cinemaName.replace(' Palembang', ''));
  const uniqueLocations = Array.from(new Set(locations));
  const locationsText = uniqueLocations.join(', ');

  const studios = schedulesToDisplay.map((s) => s.studioType);
  const uniqueStudios = Array.from(new Set(studios));
  const studiosText = uniqueStudios.join(', ');

  const prices = schedulesToDisplay.map((s) => s.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceText =
    prices.length === 0
      ? 'Tidak tersedia'
      : minPrice === maxPrice
      ? `Rp ${minPrice.toLocaleString('id-ID')}`
      : `Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')}`;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-md flex flex-col group">
      {/* Movie Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container-high">
        <img
          src={movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* Rating & Age Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" />
            {movie.rating}
          </span>
          <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-lg border border-white/10">
            {movie.ageRating}
          </span>
        </div>

        {/* Floating Play Button */}
        <button
          onClick={() => onSelectMovie(movie)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
        >
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </button>

        {/* Floating Movie Title Info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <div className="flex items-center gap-1 text-[9px] text-white/80 mb-0.5 font-bold">
            <Clock className="w-2.5 h-2.5 text-primary" />
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genre.slice(0, 2).join(', ')}</span>
          </div>
          <h3 className="font-extrabold text-white text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </div>
      </div>

      {/* Movie Info Details */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2 text-xs font-semibold text-on-surface-variant leading-relaxed">
          <div className="bg-surface-container-low/70 p-2.5 rounded-xl border border-outline-variant/30 flex flex-col gap-1.5">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-extrabold uppercase text-primary tracking-wide block mb-0.5">
                  {selectedCinemaId ? 'Kelas Studio:' : 'Tersedia di:'}
                </span>
                <span className="text-[10px] text-on-background font-bold line-clamp-2">
                  {selectedCinemaId ? studiosText : locationsText || 'Bioskop terpilih'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 border-t border-outline-variant/20 pt-1.5 mt-0.5">
              <Ticket className="w-3.5 h-3.5 text-primary shrink-0" />
              <div>
                <span className="text-[9px] font-extrabold uppercase text-primary tracking-wide block">Harga Tiket:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-emerald-600 font-extrabold">{priceText}</span>
                  <div className="relative group/tooltip inline-block align-middle">
                    <Info className="w-3.5 h-3.5 text-on-surface-variant/60 hover:text-primary cursor-pointer transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-surface-container-high text-on-surface text-[10px] p-2 rounded-lg shadow-lg border border-outline-variant whitespace-normal w-48 z-50 text-center font-bold">
                      Harga mungkin berbeda. Mohon periksa melalui aplikasi resmi.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectMovie(movie)}
          className="w-full py-1.5 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant font-bold text-[10px] transition-all flex items-center justify-center gap-1 border border-outline-variant/70 shadow-sm cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5" />
          Detail dan Jadwal
        </button>
      </div>
    </div>
  );
};
