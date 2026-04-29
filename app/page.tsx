import Link from 'next/link';
import { readJson } from '@/lib/db';
import { Store } from '@/lib/types';

export default function Home() {
  const stores = readJson<Store[]>('stores.json', []);
  return (
    <main>
      <h1>車検予約MVP</h1>
      <div className="card">
        <h2>店舗を選択</h2>
        {stores.map((store) => (
          <p key={store.id}>
            <Link href={`/store/${store.id}`}>{store.name} の予約ページ</Link>
          </p>
        ))}
      </div>
      <div className="card">
        <Link href="/admin">店舗スタッフ管理画面へ</Link>
      </div>
    </main>
  );
}
