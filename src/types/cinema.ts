export interface Cinema {
  id: string;
  name: string;
  chain: 'XXI' | 'CGV' | 'Cinepolis';
  address: string;
  phone?: string;
  studios: string[];
}

export interface ShowSchedule {
  cinemaId: string;
  cinemaName: string;
  chain: 'XXI' | 'CGV' | 'Cinepolis';
  studioType: string; // e.g. '2D', '3D', 'Velvet', 'VIP', 'IMAX'
  price: number;
  times: string[];
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  poster: string;
  backdrop: string;
  rating: number | string;
  duration: string;
  ageRating: string;
  genre: string[];
  director: string;
  cast: string[];
  synopsis: string;
  trailerUrl?: string;
  schedules: ShowSchedule[];
}

export interface FilterOptions {
  searchQuery: string;
  selectedCinemaIds: string[];
  selectedChain: string; // 'ALL' | 'XXI' | 'CGV' | 'Cinepolis'
  timeSlot: 'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  maxPrice: number;
  selectedDate: string; // Date filter value
}

