import { NextResponse } from 'next/server';
import { PALEMBANG_MOVIES } from '@/data/palembangData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('id');
  const query = searchParams.get('q');
  const cinemaId = searchParams.get('cinemaId');

  let movies = PALEMBANG_MOVIES;

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
        m.genre.some((g) => g.toLowerCase().includes(qLower)) ||
        m.cast.some((c) => c.toLowerCase().includes(qLower))
    );
  }

  if (cinemaId) {
    movies = movies.filter((m) => m.schedules.some((s) => s.cinemaId === cinemaId));
  }

  return NextResponse.json({
    status: 'success',
    total: movies.length,
    movies,
  });
}
