'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Slot = { id: string; start: string; remaining: number };
type Store = { id: string; name: string };

type FormState = {
  slotId: string;
  name: string;
  phone: string;
  email: string;
  carModel: string;
  modelCode: string;
  typeDesignationNumber: string;
  classificationNumber: string;
  expirationDate: string;
  needLoanerCar: 'no' | 'yes';
};

const fieldDefs: Array<{ key: keyof FormState; label: string; type?: 'text' | 'date' }> = [
  { key: 'name', label: '氏名' },
  { key: 'phone', label: '電話番号' },
  { key: 'email', label: 'メールアドレス' },
  { key: 'carModel', label: '車種' },
  { key: 'modelCode', label: '型式' },
  { key: 'typeDesignationNumber', label: '型式指定番号' },
  { key: 'classificationNumber', label: '類別区分番号' },
  { key: 'expirationDate', label: '車検満了日', type: 'date' }
];

export default function StorePage() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const [store, setStore] = useState<Store | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>({
    slotId: '',
    name: '',
    phone: '',
    email: '',
    carModel: '',
    modelCode: '',
    typeDesignationNumber: '',
    classificationNumber: '',
    expirationDate: '',
    needLoanerCar: 'no'
  });

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/stores?storeId=${storeId}`).then((r) => r.json()).then(setStore);
    fetch(`/api/slots?storeId=${storeId}`).then((r) => r.json()).then(setSlots);
  }, [storeId]);

  async function submit() {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, storeId, needLoanerCar: form.needLoanerCar === 'yes' })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? 'エラーが発生しました');
      return;
    }
    setMessage(`仮予約を受け付けました。概算見積: ¥${data.estimateYen.toLocaleString()}`);
  }

  return (
    <main>
      <h1>{store?.name ?? '店舗'} の予約</h1>
      <div className="card">
        <label>希望日時（予約枠）</label>
        <select value={form.slotId} onChange={(e) => setForm({ ...form, slotId: e.target.value })}>
          <option value="">選択してください</option>
          {slots.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.start).toLocaleString()}（残り{s.remaining}）
            </option>
          ))}
        </select>
        <div className="grid">
          {fieldDefs.map((f) => (
            <div key={f.key}>
              <label>{f.label}</label>
              <input
                type={f.type ?? 'text'}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <label>代車希望</label>
        <select value={form.needLoanerCar} onChange={(e) => setForm({ ...form, needLoanerCar: e.target.value as 'yes' | 'no' })}>
          <option value="no">不要</option>
          <option value="yes">希望</option>
        </select>
        <button onClick={submit}>仮予約する</button>
        <p>{message}</p>
        <p className="small">※入力後、受付メールと概算見積メールを自動送信（MVPではコンソール出力）</p>
      </div>
    </main>
  );
}
