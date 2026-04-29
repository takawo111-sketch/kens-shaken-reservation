import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { calcEstimateYen } from '@/lib/estimate';
import { sendMail } from '@/lib/mailer';
import { Reservation, Slot, Store } from '@/lib/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slots = readJson<Slot[]>('slots.json', []);
  const stores = readJson<Store[]>('stores.json', []);
  const reservations = readJson<Reservation[]>('reservations.json', []);

  const slot = slots.find((s) => s.id === body.slotId && s.storeId === body.storeId);
  if (!slot) return NextResponse.json({ error: '予約枠が不正です' }, { status: 400 });
  const used = reservations.filter((r) => r.slotId === slot.id).length;
  if (used >= slot.capacity) return NextResponse.json({ error: '予約枠が満席です' }, { status: 400 });

  const estimateYen = calcEstimateYen({ carModel: body.carModel, modelCode: body.modelCode, needLoanerCar: body.needLoanerCar });
  const reservation: Reservation = {
    id: randomUUID(),
    storeId: body.storeId,
    slotId: body.slotId,
    desiredDateTime: slot.start,
    name: body.name,
    phone: body.phone,
    email: body.email,
    carModel: body.carModel,
    modelCode: body.modelCode,
    typeDesignationNumber: body.typeDesignationNumber,
    classificationNumber: body.classificationNumber,
    expirationDate: body.expirationDate,
    needLoanerCar: body.needLoanerCar,
    estimateYen,
    status: 'tentative',
    createdAt: new Date().toISOString()
  };

  reservations.push(reservation);
  writeJson('reservations.json', reservations);

  const store = stores.find((s) => s.id === body.storeId);
  await sendMail(body.email, '【仮予約受付】車検予約', `仮予約を受け付けました。概算見積: ¥${estimateYen.toLocaleString()}`);
  if (store) {
    await sendMail(store.email, `【新規仮予約】${store.name}`, `${reservation.name}様の仮予約を受け付けました。`);
  }

  return NextResponse.json(reservation);
}
