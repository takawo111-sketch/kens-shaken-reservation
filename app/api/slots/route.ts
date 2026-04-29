import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { Reservation, Slot } from '@/lib/types';

export function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('storeId');
  const slots = readJson<Slot[]>('slots.json', []);
  const reservations = readJson<Reservation[]>('reservations.json', []);
  const filtered = storeId ? slots.filter((s) => s.storeId === storeId) : slots;
  const result = filtered.map((slot) => {
    const used = reservations.filter((r) => r.slotId === slot.id).length;
    return { ...slot, remaining: Math.max(0, slot.capacity - used) };
  });
  return NextResponse.json(result);
}
