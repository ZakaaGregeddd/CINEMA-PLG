import React from 'react';
import { Movie, ShowSchedule } from '@/types/cinema';
import { Star, Clock, MapPin, Play, Ticket, Sparkles } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  selectedCinemaId?: string | null;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, selectedCinemaId, onSelectMovie }) => {
  // Filter schedules if a specific cinema is selected
  const schedulesToDisplay = selectedCinemaId
    ? movie.schedules.filter((s) => s.cinemaId === selectedCinemaId)
    : movie.schedules;

  return (
    <div className="bg-surface/80 border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-xl flex flex-col group">
      {/* Movie Image & Overlay Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-surface-border">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-black/60 backdrop-blur-md text-amber-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {movie.rating}
          </span>
          <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/20">
            {movie.ageRating}
          </span>
        </div>

        {/* Floating Play Button */}
        <button
          onClick={() => onSelectMovie(movie)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          title="Lihat Detail & Trailer"
        >
          <Play className="w-6 h-6 fill-black ml-0.5" />
        </button>

        {/* Bottom Title Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted mb-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.genre.slice(0, 2).join(', ')}</span>
          </div>
          <h3 className="font-extrabold text-white text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </div>
      </div>

      {/* Card Content - Bioskop & Schedule */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        {/* Schedules by Cinema */}
        <div className="space-y-3">
          {schedulesToDisplay.slice(0, 3).map((sched) => (
            <div key={sched.cinemaId} className="bg-background/60 p-2.5 rounded-xl border border-surface-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1">{sched.cinemaName}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400">
                  Rp {sched.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sched.times.map((time) => (
                  <span
                    key={time}
                    className="bg-surface hover:bg-primary hover:text-black border border-surface-border text-white text-[11px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {schedulesToDisplay.length > 3 && (
            <p className="text-[11px] text-center text-text-muted italic">
              +{schedulesToDisplay.length - 3} lokasi bioskop Palembang lainnya
            </p>
          )}
        </div>

        {/* Card Footer Action */}
        <button
          onClick={() => onSelectMovie(movie)}
          className="w-full py-2.5 px-4 rounded-xl bg-surface-hover hover:bg-primary text-white hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-2 border border-surface-border"
        >
          <Ticket className="w-4 h-4" />
          Lihat Sinopsis & Seluruh Jadwal
        </button>
      </div>
    </div>
  );
};
