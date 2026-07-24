import { NextResponse } from 'next/server';
import { PALEMBANG_CINEMAS, PALEMBANG_MOVIES } from '@/data/palembangData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cinemaId = searchParams.get('cinemaId');
  const chain = searchParams.get('chain');
  const query = searchParams.get('q');

  let resultCinemas = PALEMBANG_CINEMAS;

  if (cinemaId) {
    resultCinemas = resultCinemas.filter((c) => c.id === cinemaId);
  }

  if (chain && chain !== 'ALL') {
    resultCinemas = resultCinemas.filter((c) => c.chain === chain);
  }

  if (query) {
    const qLower = query.toLowerCase();
    resultCinemas = resultCinemas.filter(
      (c) => c.name.toLowerCase().includes(qLower) || c.address.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    status: 'success',
    total: resultCinemas.length,
    cinemas: resultCinemas,
  });
}
