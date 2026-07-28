import { NextResponse } from 'next/server';
import { PALEMBANG_MOVIES } from '@/data/palembangData';

// Cache in-memory keyed by date string (e.g. "2026-07-24") to prevent hitting external site too heavily
interface CacheEntry {
  movies: any[];
  availableDates: any[];
  cinemaDates: Record<string, any[]>;
  time: number;
}
const cacheMap = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Prevent Cache Stampede by reusing the same promise for concurrent requests
const activeScrapes = new Map<string, Promise<{ movies: any[]; availableDates: any[]; cinemaDates: Record<string, any[]> }>>();

// Permanent memory cache for movie details (synopsis, director, cast, trailer) as they are static
interface MovieDetails {
  director: string;
  cast: string[];
  synopsis: string;
  trailerUrl?: string;
  rating?: number | string;
}
const movieDetailsCache = new Map<string, MovieDetails>();

const THEATER_URLS = [
  { id: 'cgv-ptc', chain: 'CGV', name: 'CGV PTC Mall', url: 'https://jadwalnonton.com/bioskop/di-palembang/cgv-ptc-mall-palembang.html' },
  { id: 'cgv-soma', chain: 'CGV', name: 'CGV Social Market Palembang', url: 'https://jadwalnonton.com/bioskop/di-palembang/cgv-social-market-palembang-palembang-2.html' },
  { id: 'cgv-transmart', chain: 'CGV', name: 'CGV Transmart Palembang', url: 'https://jadwalnonton.com/bioskop/di-palembang/cgv-transmart-palembang-palembang.html' },
  { id: 'cinepolis-picon', chain: 'Cinepolis', name: 'Cinepolis Palembang Icon', url: 'https://jadwalnonton.com/bioskop/di-palembang/cinemaxx-palembang-icon-palembang.html' },
  { id: 'xxi-internasional', chain: 'XXI', name: 'Internasional XXI', url: 'https://jadwalnonton.com/bioskop/di-palembang/internasional-palembang.html' },
  { id: 'xxi-opi', chain: 'XXI', name: 'OPI Mall XXI', url: 'https://jadwalnonton.com/bioskop/di-palembang/opi-mall-xxi-palembang.html' },
  { id: 'xxi-ps', chain: 'XXI', name: 'Palembang Square XXI', url: 'https://jadwalnonton.com/bioskop/di-palembang/palembang-square-xxi-palembang.html' },
  { id: 'xxi-pim', chain: 'XXI', name: 'PIM XXI', url: 'https://jadwalnonton.com/bioskop/di-palembang/pim-xxi-palembang.html' }
];

async function scrapeSchedules(dateStr?: string): Promise<{ movies: any[]; availableDates: any[]; cinemaDates: Record<string, any[]> }> {
  const allMoviesMap = new Map<string, any>();
  const allDatesMap = new Map<string, string>();
  const cinemaDates: Record<string, any[]> = {};
  const formattedDate = dateStr ? dateStr.replace(/-/g, '') : ''; // e.g. "2026-07-24" -> "20260724"

  // Scrape all theater pages in parallel with a slight stagger delay to prevent triggering rate-limiting timeouts
  const fetchPromises = THEATER_URLS.map(async (theater, index) => {
    await new Promise((resolve) => setTimeout(resolve, index * 150));
    try {
      const url = formattedDate ? `${theater.url}?date=${formattedDate}` : theater.url;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${url}, status: ${response.status}`);
        return;
      }

      const html = await response.text();

      // Parse available dates for this theater
      const theaterDates: Array<{ value: string; label: string }> = [];
      const dateListMatch = html.match(/id="tgl_ftab"[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (dateListMatch) {
        const dateLinks = [...dateListMatch[1].matchAll(/(?:href|data-ref)="[^"]*?date=([0-9]{8})"[^>]*>([^<]+)</g)];
        for (const link of dateLinks) {
          const dateVal = link[1];
          const label = link[2].trim();
          const yyyymmdd = `${dateVal.substring(0, 4)}-${dateVal.substring(4, 6)}-${dateVal.substring(6, 8)}`;
          theaterDates.push({ value: yyyymmdd, label });
          allDatesMap.set(yyyymmdd, label);
        }
      }
      if (theaterDates.length > 0) {
        cinemaDates[theater.id] = theaterDates;
      }

      // Find the thealist section
      const listStartIndex = html.indexOf('<div class="thealist');
      if (listStartIndex === -1) return;

      const listEndIndex = html.indexOf('</div></div><div class="side"', listStartIndex);
      const listHtml = html.substring(listStartIndex, listEndIndex !== -1 ? listEndIndex : html.length);

      // Split by movie items
      const items = listHtml.split('<div class="item">').slice(1);

      for (const item of items) {
        // Parse Title and detail Url
        const titleMatch = item.match(/<h2><a\s*href="([^"]+)"[^>]*>([^<]+)<\/a>/);
        if (!titleMatch) continue;
        const detailUrl = titleMatch[1].trim();
        const title = titleMatch[2].trim();

        // Parse Age Rating
        const ageMatch = item.match(/<span class="right rating[^>]*>([^<]+)<\/span>/);
        const ageRating = ageMatch ? ageMatch[1].trim() : 'R13+';

        // Parse Poster
        const posterMatch = item.match(/<img[^>]*class="poster"[^>]*src="([^"]+)"/);
        const poster = posterMatch ? posterMatch[1].trim() : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';

        // Parse Genres & Duration
        const descMatch = item.match(/<p>([^<]+) - ([^<]+)<\/p>/);
        let genres: string[] = [];
        let duration = '100 Min';
        if (descMatch) {
          genres = descMatch[1].split(',').map((g) => g.trim());
          duration = descMatch[2].trim();
        }

        // Parse Actor / Cast list if present
        const castMatch = item.match(/Actors\s*:\s*([\s\S]*?)<\/p>/);
        let cast: string[] = ['Aktor'];
        if (castMatch) {
          const actorsHtml = castMatch[1];
          const actorMatches = [...actorsHtml.matchAll(/>([^<]+)</g)];
          if (actorMatches.length > 0) {
            cast = actorMatches.map((m) => m[1].trim());
          }
        }

        const synopsis = `Film ${title} sedang tayang di bioskop Palembang.`;

        // Split item by showgroups (studio types / classes)
        const schedules: any[] = [];
        const groups = item.split('<span class="showgroup"');

        for (let i = 1; i < groups.length; i++) {
          const groupHtml = groups[i];
          const typeMatch = groupHtml.match(/^[^>]*>([^<]+)<\/span>/);
          if (!typeMatch) continue;
          const studioType = typeMatch[1].trim();

          const priceMatch = groupHtml.match(/Tiket Rp\s*([0-9.]+)/);
          const price = priceMatch ? parseInt(priceMatch[1].replace(/\./g, ''), 10) : 40000;

          const times: string[] = [];
          const timeMatches = [...groupHtml.matchAll(/<li[^>]*>([0-9:]+)<\/li>/g)];
          for (const tm of timeMatches) {
            times.push(tm[1]);
          }

          if (times.length > 0) {
            schedules.push({
              cinemaId: theater.id,
              cinemaName: theater.name,
              chain: theater.chain,
              studioType,
              price,
              times
            });
          }
        }

        if (schedules.length === 0) {
          // Try regular parsing if no showgroup headings found
          const priceMatch = item.match(/Tiket Rp\s*([0-9.]+)/);
          const price = priceMatch ? parseInt(priceMatch[1].replace(/\./g, ''), 10) : 40000;
          const times: string[] = [];
          const timeMatches = [...item.matchAll(/<li[^>]*>([0-9:]+)<\/li>/g)];
          for (const tm of timeMatches) {
            times.push(tm[1]);
          }

          if (times.length > 0) {
            schedules.push({
              cinemaId: theater.id,
              cinemaName: theater.name,
              chain: theater.chain,
              studioType: 'Regular 2D',
              price,
              times
            });
          }
        }

        const movieKey = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (allMoviesMap.has(movieKey)) {
          const existing = allMoviesMap.get(movieKey);
          existing.schedules.push(...schedules);
        } else {
          allMoviesMap.set(movieKey, {
            id: `movie-${movieKey}`,
            title,
            originalTitle: title,
            poster,
            backdrop: poster,
            rating: 'Unknown',
            duration,
            ageRating,
            genre: genres,
            director: 'Sutradara',
            cast,
            synopsis,
            detailUrl,
            schedules
          });
        }
      }
    } catch (err) {
      console.error(`Error scraping theater ${theater.name}:`, err);
    }
  });

  await Promise.all(fetchPromises);

  // Scrape each movie detail page in parallel to get actual synopsis and trailer
  const movieDetailPromises = Array.from(allMoviesMap.values()).map(async (movie: any) => {
    if (!movie.detailUrl) return;

    // Check movie details static cache first to prevent redundant outgoing fetches
    const cachedDetails = movieDetailsCache.get(movie.detailUrl);
    if (cachedDetails) {
      movie.director = cachedDetails.director;
      movie.cast = cachedDetails.cast;
      movie.synopsis = cachedDetails.synopsis;
      movie.trailerUrl = cachedDetails.trailerUrl;
      if (cachedDetails.rating) {
        movie.rating = cachedDetails.rating;
      }
      return;
    }

    try {
      const detailRes = await fetch(movie.detailUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000)
      });
      if (!detailRes.ok) return;
      const html = await detailRes.text();

      // 1. Parse Director
      const directorMatch = html.match(/<span class="sjdl">Director<\/span>\s*<span class="sisi"><a[^>]*>([^<]+)<\/a><\/span>/);
      if (directorMatch) {
        movie.director = directorMatch[1].trim();
      }

      // 2. Parse Casts
      const actorsMatch = html.match(/<span class="sjdl">Casts<\/span>\s*<span class="sisi actors">([\s\S]*?)<\/span>/);
      if (actorsMatch) {
        const actorLinks = [...actorsMatch[1].matchAll(/<a[^>]*>([^<]+)<\/a>/g)];
        if (actorLinks.length > 0) {
          movie.cast = actorLinks.map((m) => m[1].trim());
        }
      }

      // 3. Parse Trailer URL
      const trailerMatch = html.match(/<iframe[^>]*class="vtrail"[^>]*src="([^"]+)"/);
      if (trailerMatch) {
        movie.trailerUrl = trailerMatch[1].trim();
      }

      // 4. Parse Synopsis
      const synStartIndex = html.indexOf('id="tr_synf"');
      if (synStartIndex !== -1) {
        const synEndIndex = html.indexOf('</div>', synStartIndex);
        const synHtml = html.substring(synStartIndex, synEndIndex);
        
        // Extract paragraph
        const paragraphs = [...synHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)];
        if (paragraphs.length > 0) {
          const cleanSynopsis = paragraphs[0][1]
            .replace(/&ndash;/g, '–')
            .replace(/&mdash;/g, '—')
            .replace(/<[^>]*>/g, '') // strip any tag
            .trim();
          if (cleanSynopsis) {
            movie.synopsis = cleanSynopsis;
          }
        }
      }

      // Fetch real rating from OMDB API using public key
      let realRating: number | string = 'Unknown';
      try {
        const omdbRes = await fetch(
          `http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(movie.title)}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (omdbRes.ok) {
          const omdbData = await omdbRes.json();
          if (omdbData && omdbData.Response === 'True' && omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
            const parsed = parseFloat(omdbData.imdbRating);
            if (!isNaN(parsed)) {
              realRating = parsed;
            }
          }
        }
      } catch (omdbErr) {
        console.error(`Error fetching OMDB rating for ${movie.title}:`, omdbErr);
      }

      movie.rating = realRating;

      // Store in memory cache to bypass future fetches
      movieDetailsCache.set(movie.detailUrl, {
        director: movie.director,
        cast: movie.cast,
        synopsis: movie.synopsis,
        trailerUrl: movie.trailerUrl,
        rating: movie.rating
      });
    } catch (err) {
      console.error(`Error scraping movie details for ${movie.title}:`, err);
    }
  });

  await Promise.all(movieDetailPromises);

  // Fallback if no dates parsed
  if (allDatesMap.size === 0) {
    const today = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const yyyymmdd = d.toISOString().split('T')[0];
      const label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
      allDatesMap.set(yyyymmdd, label);
    }
  }

  // Sort dates ascending
  const availableDates = Array.from(allDatesMap.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.value.localeCompare(b.value));

  return {
    movies: Array.from(allMoviesMap.values()),
    availableDates,
    cinemaDates
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('id');
  const query = searchParams.get('q');
  const cinemaId = searchParams.get('cinemaId');
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const now = Date.now();
  let movies: any[] | null = null;
  let availableDates: any[] | null = null;
  let cinemaDates: Record<string, any[]> = {};
  let isFromCache = false;

  const cached = cacheMap.get(dateParam);
  if (cached && now - cached.time < CACHE_DURATION) {
    movies = cached.movies;
    availableDates = cached.availableDates;
    cinemaDates = cached.cinemaDates;
    isFromCache = true;
  } else {
    try {
      // Reuse active scrape promises for concurrent requests (Thundering Herd / Cache Stampede protection)
      let activeScrape = activeScrapes.get(dateParam);
      if (!activeScrape) {
        console.log(`[API] Scrape Cache Miss for date ${dateParam}. Initiating live scrape...`);
        activeScrape = scrapeSchedules(dateParam);
        activeScrapes.set(dateParam, activeScrape);
      } else {
        console.log(`[API] Scrape Cache Pending for date ${dateParam}. Reusing active scraping process...`);
      }

      const res = await activeScrape;
      
      // Clean up after resolution
      activeScrapes.delete(dateParam);

      if (res.movies && res.movies.length > 0) {
        cacheMap.set(dateParam, {
          movies: res.movies,
          availableDates: res.availableDates,
          cinemaDates: res.cinemaDates,
          time: now
        });
        movies = res.movies;
        availableDates = res.availableDates;
        cinemaDates = res.cinemaDates;
      }
    } catch (err) {
      activeScrapes.delete(dateParam);
      console.error(`Error fetching live schedules for date ${dateParam}`, err);
    }
  }

  // Fallback to local mock data if scraping fails or returns empty
  if (!movies || movies.length === 0) {
    movies = PALEMBANG_MOVIES;
  }

  // Filter dates specifically for this cinema if requested
  if (cinemaId && cinemaDates && cinemaDates[cinemaId]) {
    availableDates = cinemaDates[cinemaId];
  }

  if (!availableDates || availableDates.length === 0) {
    // Generate default fallback dates
    const today = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    availableDates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const yyyymmdd = d.toISOString().split('T')[0];
      const label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
      availableDates.push({ value: yyyymmdd, label });
    }
  }

  if (movieId) {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) {
      return NextResponse.json({ status: 'error', message: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', movie });
  }

  if (query) {
    const qLower = query.toLowerCase();
    movies = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(qLower) ||
        m.genre.some((g: string) => g.toLowerCase().includes(qLower)) ||
        m.cast.some((c: string) => c.toLowerCase().includes(qLower))
    );
  }

  if (cinemaId) {
    movies = movies.filter((m) => m.schedules.some((s: any) => s.cinemaId === cinemaId));
  }

  return NextResponse.json({
    status: 'success',
    total: movies.length,
    movies,
    availableDates,
    live: !isFromCache || cacheMap.has(dateParam)
  });
}
