'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { DashboardTable } from '@/components/DashboardTable';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { PALEMBANG_MOVIES, PALEMBANG_CINEMAS } from '@/data/palembangData';
import { FilterOptions, Movie } from '@/types/cinema';
import { Sparkles, AlertCircle, MapPin, Phone, Video, Clapperboard, ArrowUp } from 'lucide-react';


export default function Home() {
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>(PALEMBANG_MOVIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Generate initial fallback date options (today and next 4 days - 5 days total)
  const [dateOptions, setDateOptions] = useState<Array<{ label: string; value: string }>>(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const options = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayName = days[d.getDay()];
      const dateNum = d.getDate();
      const monthName = months[d.getMonth()];

      const label = i === 0 ? `Hari Ini (${dayName}, ${dateNum} ${monthName})` : `${dayName}, ${dateNum} ${monthName}`;
      const value = d.toISOString().split('T')[0];
      options.push({ label, value });
    }
    return options;
  });

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    selectedCinemaIds: [],
    selectedChain: 'ALL',
    timeSlot: 'ALL',
    maxPrice: 150000,
    selectedDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const cinemaQuery = selectedCinemaId ? `&cinemaId=${selectedCinemaId}` : '';
        const res = await fetch(`/api/movies?date=${filters.selectedDate}${cinemaQuery}`);
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.movies)) {
          setMovies(data.movies);
          setIsLive(data.live || false);
          if (Array.isArray(data.availableDates) && data.availableDates.length > 0) {
            // Sort dates ascending
            const sortedDates = [...data.availableDates].sort((a, b) => a.value.localeCompare(b.value));
            setDateOptions(sortedDates);
          }
        }
      } catch (err) {
        console.error('Failed to load movies from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [filters.selectedDate, selectedCinemaId]);

  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeSlide, setActiveSlide] = useState<number>(0);

  const featuredMovies = useMemo(() => {
    return movies.slice(0, 5);
  }, [movies]);

  useEffect(() => {
    if (selectedCinemaId !== null || featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCinemaId, featuredMovies]);


  const selectedCinema = useMemo(() => {
    return PALEMBANG_CINEMAS.find((c) => c.id === selectedCinemaId) || null;
  }, [selectedCinemaId]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCinemaIds: [],
      selectedChain: 'ALL',
      timeSlot: 'ALL',
      maxPrice: 150000,
      selectedDate: new Date().toISOString().split('T')[0],
    });
    setSelectedCinemaId(null);
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchGenre = movie.genre.some((g) => g.toLowerCase().includes(q));
        const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchGenre && !matchCast) return false;
      }

      if (selectedCinemaId) {
        const isShowing = movie.schedules.some((s) => s.cinemaId === selectedCinemaId);
        if (!isShowing) return false;
      }

      if (filters.selectedChain !== 'ALL') {
        const matchChain = movie.schedules.some((s) => s.chain === filters.selectedChain);
        if (!matchChain) return false;
      }

      return true;
    });
  }, [movies, filters, selectedCinemaId]);


  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        selectedCinemaId={selectedCinemaId}
        onSelectCinema={(id) => setSelectedCinemaId(id)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Banner Header (Cream / Light Premium) */}
        <div
          className={`border border-outline-variant rounded-[32px] shadow-md relative overflow-hidden transition-all duration-500 flex flex-col justify-end ${selectedCinema
              ? 'bg-surface-container-lowest p-6 md:p-8 min-h-[180px]'
              : 'min-h-[380px] md:min-h-[440px] bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950'
            }`}
        >
          {selectedCinema ? (
            <>
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full w-full">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {isLive ? (
                      <>
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span>Jadwal berdasarkan Jadwalnonton.com</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Jadwal Offline / Cadangan</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                    {selectedCinema.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-2 max-w-2xl leading-relaxed font-semibold flex items-center flex-wrap gap-1.5">
                    <span>{selectedCinema.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCinema.name + ' Palembang')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors p-1 bg-primary/10 rounded-md border border-primary/20 shrink-0"
                      title="Buka di Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </a>
                  </p>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant text-[11px] space-y-1.5 shrink-0 font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Telp: {selectedCinema.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-primary" />
                    <span>Studio: {selectedCinema.studios.join(', ')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : featuredMovies.length > 0 ? (
            (() => {
              const currentMovie = featuredMovies[activeSlide % featuredMovies.length];
              const uniqueCinemas = Array.from(new Set(currentMovie.schedules.map((s: any) => s.cinemaName)));
              return (
                <div className="grid grid-cols-12 w-full h-full relative z-10">
                  {/* Left Column - Text Details */}
                  <div className="col-span-12 md:col-span-7 p-6 md:p-10 flex flex-col justify-between h-full text-white">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-primary text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider shrink-0 shadow-md">
                          Featured in Palembang
                        </span>
                        <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] px-3 py-1 rounded-full shrink-0">
                          {currentMovie.genre.join(' • ')}
                        </span>
                        <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] px-3 py-1 rounded-full shrink-0">
                          ★ {currentMovie.rating.toFixed(1)}
                        </span>
                      </div>

                      <h2
                        onClick={() => setActiveMovie(currentMovie)}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-4xl hover:underline cursor-pointer transition-all duration-300 drop-shadow-md"
                      >
                        {currentMovie.title}
                      </h2>

                      <p className="text-xs md:text-sm text-white/80 mt-2 max-w-3xl leading-relaxed font-semibold line-clamp-2 md:line-clamp-3 drop-shadow">
                        {currentMovie.synopsis}
                      </p>

                      {/* Cinema location tags */}
                      <div className="mt-3.5 flex items-start gap-1.5 text-xs text-white/70">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          Tayang di: <strong className="text-white">{uniqueCinemas.join(', ')}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <button
                        onClick={() => setActiveMovie(currentMovie)}
                        className="bg-primary hover:bg-primary/95 text-white font-extrabold text-xs md:text-sm py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => setActiveMovie(currentMovie)}
                        className="bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 text-white font-extrabold text-xs md:text-sm py-3 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        Tonton Trailer
                      </button>
                    </div>

                    {/* Slide indicator dots */}
                    <div className="flex items-center gap-1.5 mt-8 shrink-0">
                      {featuredMovies.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${(activeSlide % featuredMovies.length) === idx ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Full Poster */}
                  <div className="col-span-12 md:col-span-5 h-[240px] md:h-full relative overflow-hidden">
                    <img
                      src={currentMovie.poster}
                      alt={currentMovie.title}
                      className="w-full h-full object-cover md:absolute md:inset-0"
                    />
                    {/* Blending left overlay gradient */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-900 to-transparent pointer-events-none hidden md:block" />
                  </div>
                </div>
              );
            })()
          ) : (
            <>
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full gap-4 p-6 md:p-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                    Palembang Cinemas Schedule
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-2 max-w-2xl leading-relaxed font-semibold">
                    Mencari data jadwal jam tayang langsung dari rujukan terpercaya...
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Global Filter Bar */}
        <FilterBar
          filters={filters}
          onChangeFilter={setFilters}
          onReset={resetFilters}
          isCinemaSelected={selectedCinemaId !== null}
          dateOptions={dateOptions}
        />


        {/* Dashboard Content Switcher */}
        <div id="movie-list" className="scroll-mt-6">
          {loading ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-16 flex flex-col items-center justify-center shadow-md min-h-[350px] animate-in fade-in duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <Clapperboard className="w-8 h-8 animate-bounce" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-on-background tracking-wide">
                Menghubungkan ke Jadwalnonton.com...
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 font-semibold">
                Mengambil jadwal terupdate bioskop Palembang secara real-time
              </p>
              <div className="w-64 h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-6 border border-outline-variant/30">
                <div className="h-full bg-gradient-to-r from-primary to-outline rounded-full animate-progress-bar" />
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Matriks Jadwal & Perbandingan Harga
                </h3>
                <span className="text-xs text-on-surface-variant font-bold">
                  {filteredMovies.length} film ditemukan
                </span>
              </div>
              <DashboardTable
                movies={filteredMovies}
                filters={filters}
                selectedCinemaId={selectedCinemaId}
                onSelectMovie={(movie) => setActiveMovie(movie)}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Katalog Film Tayang ({filteredMovies.length})
                </h3>
              </div>

              {filteredMovies.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-sm">
                  <AlertCircle className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
                  <h4 className="font-bold text-on-background">Tidak ada film yang cocok</h4>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      selectedCinemaId={selectedCinemaId}
                      onSelectMovie={(m) => setActiveMovie(m)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/60 backdrop-blur-sm border-2 border-primary/50 text-primary hover:text-white hover:bg-primary hover:border-primary px-4 py-2.5 rounded-full font-extrabold text-xs transition-all shadow-xl hover:shadow-primary/20 scale-100 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Kembali ke Atas</span>
        </button>
      )}

      {/* Detail Movie & Trailer Modal */}
      <MovieModal
        movie={activeMovie}
        selectedCinemaId={selectedCinemaId}
        selectedDate={filters.selectedDate}
        onClose={() => setActiveMovie(null)}
      />

    </div>
  );
}
