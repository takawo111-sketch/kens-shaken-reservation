import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { Store } from '@/lib/types';

export function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('storeId');
  const stores = readJson<Store[]>('stores.json', []);
  if (storeId) return NextResponse.json(stores.find((s) => s.id === storeId) ?? null);
  return NextResponse.json(stores);
}
