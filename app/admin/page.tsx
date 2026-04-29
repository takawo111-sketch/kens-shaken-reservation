import { readJson } from '@/lib/db';
import { Reservation, Store } from '@/lib/types';

export default function AdminPage() {
  const stores = readJson<Store[]>('stores.json', []);
  const reservations = readJson<Reservation[]>('reservations.json', []);

  return (
    <main>
      <h1>店舗スタッフ管理画面（MVP）</h1>
      {stores.map((s) => (
        <div className="card" key={s.id}>
          <h2>{s.name}</h2>
          {reservations.filter((r) => r.storeId === s.id).map((r) => (
            <div key={r.id}>
              <strong>{r.name}</strong> / {new Date(r.desiredDateTime).toLocaleString()} / {r.status} / 概算 ¥{r.estimateYen.toLocaleString()}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
