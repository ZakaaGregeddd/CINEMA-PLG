import React from 'react';
import { Movie } from '@/types/cinema';
import { X, Star, Clock, User, Film, Ticket, MapPin, Play } from 'lucide-react';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface border border-surface-border rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Trailer / Backdrop Header */}
        <div className="relative w-full aspect-video max-h-96 bg-black">
          {movie.trailerUrl ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1&mute=0`}
              title={`${movie.title} Official Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <span>{movie.genre.join(' • ')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">{movie.title}</h2>
              {movie.originalTitle && (
                <p className="text-xs text-text-muted mt-0.5">Judul Asli: {movie.originalTitle}</p>
              )}
            </div>

            <div className="flex items-center gap-4 bg-background/80 p-3 rounded-2xl border border-surface-border">
              <div className="text-center px-3 border-r border-surface-border">
                <div className="flex items-center gap-1 text-amber-400 font-extrabold text-lg">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {movie.rating}
                </div>
                <span className="text-[10px] text-text-muted">Rating TMDB</span>
              </div>
              <div className="text-center px-3 border-r border-surface-border">
                <div className="font-extrabold text-white text-base">{movie.duration}</div>
                <span className="text-[10px] text-text-muted">Durasi</span>
              </div>
              <div className="text-center px-3">
                <div className="font-extrabold text-primary text-base">{movie.ageRating}</div>
                <span className="text-[10px] text-text-muted">Klasifikasi</span>
              </div>
            </div>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-background/50 p-3.5 rounded-xl border border-surface-border">
              <span className="text-text-muted font-semibold block mb-1">Sutradara:</span>
              <span className="text-white font-bold text-sm">{movie.director}</span>
            </div>
            <div className="bg-background/50 p-3.5 rounded-xl border border-surface-border">
              <span className="text-text-muted font-semibold block mb-1">Pemeran Utama:</span>
              <span className="text-white font-bold text-sm">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">
              Sinopsis Film
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">{movie.synopsis}</p>
          </div>

          {/* All Palembang Cinemas Schedule */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              Jadwal Penayangan di Bioskop Palembang
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {movie.schedules.map((sched) => (
                <div
                  key={sched.cinemaId}
                  className="bg-background/80 p-4 rounded-2xl border border-surface-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{sched.cinemaName}</span>
                    <span className="text-xs font-bold text-emerald-400">
                      Rp {sched.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-xs text-primary font-semibold mb-2">{sched.studioType}</div>
                  <div className="flex flex-wrap gap-2">
                    {sched.times.map((t) => (
                      <span
                        key={t}
                        className="bg-surface hover:bg-primary hover:text-black text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-surface-border transition-all cursor-pointer"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
