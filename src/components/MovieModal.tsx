import React from 'react';
import { Movie } from '@/types/cinema';
import { X, Star, Clock, Ticket, MapPin } from 'lucide-react';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-3xl overflow-hidden shadow-2xl my-8 text-on-background">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all shadow-md"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-outline-variant/30">
            <div>
              <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wide">
                {movie.genre.join(' • ')}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">{movie.title}</h2>
              {movie.originalTitle && (
                <p className="text-xs text-on-surface-variant/85 mt-0.5">Judul Asli: {movie.originalTitle}</p>
              )}
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-2xl border border-outline-variant">
              <div className="text-center px-3 border-r border-outline-variant">
                <div className="flex items-center gap-1 text-amber-600 font-extrabold text-lg justify-center">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {movie.rating}
                </div>
                <span className="text-[10px] text-on-surface-variant font-bold">Rating TMDB</span>
              </div>
              <div className="text-center px-3 border-r border-outline-variant">
                <div className="font-extrabold text-on-background text-base">{movie.duration}</div>
                <span className="text-[10px] text-on-surface-variant font-bold">Durasi</span>
              </div>
              <div className="text-center px-3">
                <div className="font-extrabold text-primary text-base">{movie.ageRating}</div>
                <span className="text-[10px] text-on-surface-variant font-bold">Klasifikasi</span>
              </div>
            </div>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
              <span className="text-on-surface-variant font-bold block mb-1">Sutradara:</span>
              <span className="text-on-background font-extrabold text-sm">{movie.director}</span>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
              <span className="text-on-surface-variant font-bold block mb-1">Pemeran Utama:</span>
              <span className="text-on-background font-extrabold text-sm">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-2">
              Sinopsis Film
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{movie.synopsis}</p>
          </div>

          {/* Schedules */}
          <div>
            <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Ticket className="w-4 h-4" />
              Jadwal Penayangan di Bioskop Palembang
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {movie.schedules.map((sched) => (
                <div
                  key={sched.cinemaId}
                  className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-on-background text-sm">{sched.cinemaName}</span>
                    <span className="text-xs font-bold text-emerald-600">
                      Rp {sched.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-[10px] text-primary font-bold mb-2 uppercase tracking-wide">
                    {sched.studioType}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sched.times.map((t) => (
                      <span
                        key={t}
                        className="bg-surface-container-lowest hover:bg-primary hover:text-white text-on-background text-xs font-bold px-2.5 py-1 rounded-lg border border-outline-variant transition-all cursor-pointer shadow-sm"
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
