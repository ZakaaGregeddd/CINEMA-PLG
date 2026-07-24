import React from 'react';
import { Movie } from '@/types/cinema';
import { X, Star, Clock, Ticket, MapPin, Film } from 'lucide-react';

interface MovieModalProps {
  movie: Movie | null;
  selectedCinemaId?: string | null;
  onClose: () => void;
  selectedDate?: string;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  selectedCinemaId,
  onClose,
  selectedDate = new Date().toLocaleDateString('sv')
}) => {
  if (!movie) return null;

  const schedulesToDisplay = selectedCinemaId
    ? movie.schedules.filter((s) => s.cinemaId === selectedCinemaId)
    : movie.schedules;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-3xl overflow-hidden shadow-2xl text-on-background max-h-[90vh] flex flex-col">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 scrollbar-thin p-5 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">

            {/* Left Side: Full Poster View */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
              <div className="relative aspect-[2/3] w-full max-w-[240px] md:max-w-none mx-auto rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 bg-surface-container-high">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20">
                  {movie.ageRating}
                </div>
              </div>

              {/* TMDB & Info badges on Left under Poster */}
              <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant flex justify-around text-center w-full max-w-[240px] md:max-w-none mx-auto shadow-sm">
                <div className="flex-1 border-r border-outline-variant/50">
                  <div className="flex items-center gap-0.5 text-amber-600 font-extrabold text-sm justify-center">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {movie.rating}
                  </div>
                  <span className="text-[9px] text-on-surface-variant font-bold">TMDB</span>
                </div>
                <div className="flex-1 border-r border-outline-variant/50">
                  <div className="font-extrabold text-on-background text-xs">{movie.duration}</div>
                  <span className="text-[9px] text-on-surface-variant font-bold">Durasi</span>
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-primary text-xs truncate px-1">{movie.genre[0] || '-'}</div>
                  <span className="text-[9px] text-on-surface-variant font-bold">Genre</span>
                </div>
              </div>
            </div>

            {/* Right Side: Movie Details & Schedules */}
            <div className="flex-1 space-y-5">

              {/* Header Info */}
              <div>
                <span className="text-[10px] font-extrabold text-primary mb-1 block uppercase tracking-wider">
                  {movie.genre.join(' • ')}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-background leading-tight">{movie.title}</h2>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="text-[11px] text-on-surface-variant/80 mt-1 italic">Original Title: {movie.originalTitle}</p>
                )}
              </div>

              {/* Video Trailer Panel */}
              {movie.trailerUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-outline-variant/20 shadow-lg max-h-72">
                  <iframe
                    src={`${movie.trailerUrl}?autoplay=0&mute=0`}
                    title={`${movie.title} Official Trailer`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Director & Cast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-surface-container-low/75 p-3 rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant font-bold block mb-0.5">Sutradara:</span>
                  <span className="text-on-background font-extrabold text-xs">{movie.director}</span>
                </div>
                <div className="bg-surface-container-low/75 p-3 rounded-xl border border-outline-variant/40">
                  <span className="text-on-surface-variant font-bold block mb-0.5">Pemeran Utama:</span>
                  <span className="text-on-background font-extrabold text-xs">{movie.cast.join(', ')}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-[11px] font-extrabold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  Sinopsis Film
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed text-justify">{movie.synopsis}</p>
              </div>

              {/* Schedules */}
              <div>
                <h3 className="text-[11px] font-extrabold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-outline-variant/20 pb-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  {selectedCinemaId ? 'Jadwal Kelas & Studio' : 'Jadwal Penayangan di Bioskop Palembang'}
                </h3>

                {schedulesToDisplay.length === 0 ? (
                  <div className="bg-surface-container-low p-6 rounded-2xl text-center text-xs text-on-surface-variant font-medium border border-outline-variant/30">
                    Tidak ada jadwal untuk bioskop ini.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {schedulesToDisplay.map((sched, sIdx) => (
                      <div
                        key={`${sched.cinemaId}-${sched.studioType}-${sIdx}`}
                        className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant hover:border-primary/40 transition-all flex flex-col gap-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-on-background text-xs">
                            {selectedCinemaId ? sched.studioType : sched.cinemaName}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            Rp {sched.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {!selectedCinemaId && (
                          <div className="text-[9px] text-primary font-extrabold uppercase tracking-wide">
                            {sched.studioType}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-1">
                          {(() => {
                            const todayStr = new Date().toLocaleDateString('sv');
                            const isToday = selectedDate === todayStr;
                            let highlightIdx = -1;
                            if (isToday) {
                              const now = new Date();
                              const currentMinutes = now.getHours() * 60 + now.getMinutes();
                              highlightIdx = sched.times.findIndex((t: string) => {
                                const [h, m] = t.split(':').map(Number);
                                return (h * 60 + m) >= currentMinutes;
                              });
                            } else if (sched.times.length > 0) {
                              highlightIdx = 0;
                            }

                            return sched.times.map((t: string, tIdx: number) => {
                              const isHighlighted = tIdx === highlightIdx;
                              return (
                                <span
                                  key={t}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer shadow-sm ${isHighlighted
                                      ? 'bg-primary text-white border border-primary font-extrabold scale-105'
                                      : 'bg-surface-container-lowest border border-outline-variant/60 text-on-background hover:border-primary hover:text-primary'
                                    }`}
                                >
                                  {t}
                                </span>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

