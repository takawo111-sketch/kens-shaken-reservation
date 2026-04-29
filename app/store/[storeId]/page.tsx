'use client';

import { useEffect, useState } from 'react';

type Slot = { id: string; start: string; remaining: number };
type Store = { id: string; name: string };

export default function StorePage({ params }: { params: { storeId: string } }) {
  const [store, setStore] = useState<Store | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    slotId: '', name: '', phone: '', email: '', carModel: '', modelCode: '', typeDesignationNumber: '', classificationNumber: '', expirationDate: '', needLoanerCar: 'no'
  });

  useEffect(() => {
    fetch(`/api/stores?storeId=${params.storeId}`).then((r) => r.json()).then(setStore);
    fetch(`/api/slots?storeId=${params.storeId}`).then((r) => r.json()).then(setSlots);
  }, [params.storeId]);

  async function submit() {
    const res = await fetch('/api/reservations', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, storeId: params.storeId, needLoanerCar: form.needLoanerCar === 'yes' })
    });
    const data = await res.json();
    setMessage(`仮予約を受け付けました。概算見積: ¥${data.estimateYen.toLocaleString()}`);
  }

  return <main>
    <h1>{store?.name ?? '店舗'} の予約</h1>
    <div className="card">
      <label>希望日時（予約枠）</label>
      <select value={form.slotId} onChange={(e)=>setForm({...form,slotId:e.target.value})}>
        <option value="">選択してください</option>
        {slots.map(s => <option key={s.id} value={s.id}>{new Date(s.start).toLocaleString()}（残り{s.remaining}）</option>)}
      </select>
      <div className="grid">
        {['name','phone','email','carModel','modelCode','typeDesignationNumber','classificationNumber','expirationDate'].map((k)=><div key={k}><label>{k}</label><input type={k==='expirationDate'?'date':'text'} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})}/></div>)}
      </div>
      <label>代車希望</label>
      <select value={form.needLoanerCar} onChange={(e)=>setForm({...form,needLoanerCar:e.target.value})}><option value="no">不要</option><option value="yes">希望</option></select>
      <button onClick={submit}>仮予約する</button>
      <p>{message}</p>
      <p className="small">※入力後、受付メールと概算見積メールを自動送信（MVPではコンソール出力）</p>
    </div>
  </main>;
}
