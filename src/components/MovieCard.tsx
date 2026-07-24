import React from 'react';
import { Movie } from '@/types/cinema';
import { Star, Clock, MapPin, Play, Ticket } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  selectedCinemaId?: string | null;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, selectedCinemaId, onSelectMovie }) => {
  const schedulesToDisplay = selectedCinemaId
    ? movie.schedules.filter((s) => s.cinemaId === selectedCinemaId)
    : movie.schedules;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-md flex flex-col group">
      {/* Movie Poster Image */}
      <div className="relative h-64 w-full overflow-hidden bg-surface-container-high">
        <img
          src={movie.poster}
          alt={movie.title}
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
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-[10px] text-white/80 mb-0.5 font-bold">
            <Clock className="w-3 h-3 text-primary" />
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.genre.slice(0, 2).join(', ')}</span>
          </div>
          <h3 className="font-extrabold text-white text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </div>
      </div>

      {/* Movie Schedules Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {schedulesToDisplay.slice(0, 3).map((sched) => (
            <div key={sched.cinemaId} className="bg-surface-container-low/70 p-2.5 rounded-xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1 text-[11px] font-bold text-on-background">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1">{sched.cinemaName}</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600">
                  Rp {sched.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sched.times.map((time) => (
                  <span
                    key={time}
                    className="bg-surface-container-lowest hover:bg-primary hover:text-white border border-outline-variant/50 text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {schedulesToDisplay.length > 3 && (
            <p className="text-[10px] text-center text-on-surface-variant/80 italic font-semibold">
              +{schedulesToDisplay.length - 3} Bioskop Lainnya
            </p>
          )}
        </div>

        <button
          onClick={() => onSelectMovie(movie)}
          className="w-full py-2 px-4 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-on-surface-variant font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-outline-variant/70 shadow-sm"
        >
          <Ticket className="w-4 h-4" />
          Lihat Detail & Jadwal
        </button>
      </div>
    </div>
  );
};
