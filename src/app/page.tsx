'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { DashboardTable } from '@/components/DashboardTable';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { PALEMBANG_MOVIES, PALEMBANG_CINEMAS } from '@/data/palembangData';
import { FilterOptions, Movie } from '@/types/cinema';
import { MapPin, Film, Sparkles, AlertCircle } from 'lucide-react';

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

  // Filter movies based on search and selected cinema
  const filteredMovies = useMemo(() => {
    return PALEMBANG_MOVIES.filter((movie) => {
      // Filter by text search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchGenre = movie.genre.some((g) => g.toLowerCase().includes(q));
        const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchGenre && !matchCast) return false;
      }

      // Filter by single selected cinema from Sidebar
      if (selectedCinemaId) {
        const isShowing = movie.schedules.some((s) => s.cinemaId === selectedCinemaId);
        if (!isShowing) return false;
      }

      // Filter by selected chain (XXI / CGV / Cinepolis)
      if (filters.selectedChain !== 'ALL') {
        const matchChain = movie.schedules.some((s) => s.chain === filters.selectedChain);
        if (!matchChain) return false;
      }

      return true;
    });
  }, [filters, selectedCinemaId]);

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        selectedCinemaId={selectedCinemaId}
        onSelectCinema={(id) => setSelectedCinemaId(id)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Banner / Cinema Selection Header */}
        <div className="bg-gradient-to-r from-surface via-surface-hover to-surface border border-surface-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Jadwal Bioskop Kota Palembang Real-Time
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                {selectedCinema ? selectedCinema.name : 'Dashboard Bioskop Palembang'}
              </h2>
              <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
                {selectedCinema
                  ? selectedCinema.address
                  : 'Lihat seluruh film yang sedang tayang, lokasi bioskop XXI, CGV, Cinepolis, jadwal jam tayang, serta perbandingan harga tiket terupdate di Palembang.'}
              </p>
            </div>

            {selectedCinema && (
              <div className="bg-background/80 p-4 rounded-2xl border border-surface-border text-xs space-y-1.5 shrink-0">
                <div className="text-text-muted">Telepon: <span className="text-white font-bold">{selectedCinema.phone}</span></div>
                <div className="text-text-muted">Studio: <span className="text-primary font-bold">{selectedCinema.studios.join(', ')}</span></div>
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
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Matriks Jadwal & Perbandingan Harga
              </h3>
              <span className="text-xs text-text-muted">
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
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Katalog Film Tayang ({filteredMovies.length})
              </h3>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="bg-surface/50 border border-surface-border rounded-2xl p-12 text-center">
                <AlertCircle className="w-10 h-10 text-text-muted mx-auto mb-2" />
                <h4 className="font-bold text-white">Tidak ada film yang cocok</h4>
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
