'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { DashboardTable } from '@/components/DashboardTable';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { PALEMBANG_MOVIES, PALEMBANG_CINEMAS } from '@/data/palembangData';
import { FilterOptions, Movie } from '@/types/cinema';
import { Sparkles, AlertCircle, MapPin, Phone, Video } from 'lucide-react';

export default function Home() {
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    selectedCinemaIds: [],
    selectedChain: 'ALL',
    timeSlot: 'ALL',
    maxPrice: 150000,
  });

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
    });
    setSelectedCinemaId(null);
  };

  const filteredMovies = useMemo(() => {
    return PALEMBANG_MOVIES.filter((movie) => {
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
  }, [filters, selectedCinemaId]);

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
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Jadwal Bioskop Kota Palembang Real-Time
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {selectedCinema ? selectedCinema.name : 'Palembang Cinemas Schedule'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-2 max-w-2xl leading-relaxed font-semibold">
                {selectedCinema
                  ? selectedCinema.address
                  : 'Lihat seluruh film yang sedang tayang, lokasi bioskop XXI, CGV, Cinepolis, jadwal jam tayang, serta perbandingan harga tiket terupdate di Palembang.'}
              </p>
            </div>

            {selectedCinema && (
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
            )}
          </div>
        </div>

        {/* Global Filter Bar */}
        <FilterBar filters={filters} onChangeFilter={setFilters} onReset={resetFilters} />

        {/* Dashboard Content Switcher */}
        {viewMode === 'table' ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>

      {/* Detail Movie & Trailer Modal */}
      <MovieModal movie={activeMovie} onClose={() => setActiveMovie(null)} />
    </div>
  );
}
