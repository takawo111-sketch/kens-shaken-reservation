# kens-shaken-reservation

車検予約システムのローカルMVP（Next.js）。

## できること（MVP）

- 店舗一覧と、店舗別予約ページ
- 事前設定した予約枠の表示
- 仮予約の登録（tentative）
- 車両情報ベースの概算見積もり計算
- 受付メール/見積メール送信（MVPではサーバーコンソールに出力）
- 店舗スタッフ向け管理画面（予約一覧）

## 前提環境

初心者向けに、まず以下を準備してください。

1. **Node.js 20以上** をインストール
   - 確認コマンド: `node -v`
2. **npm** が使えることを確認
   - 確認コマンド: `npm -v`

## ローカル起動手順

プロジェクトフォルダで、以下を順番に実行します。

### 1) 依存パッケージをインストール

```bash
npm install
```

### 2) 開発サーバーを起動

```bash
npm run dev
```

起動に成功すると、通常は次のようなURLが表示されます。

- `http://localhost:3000`

ブラウザでURLを開いてください。

## 画面URL

- トップページ: `http://localhost:3000/`
- 店舗ページ（例）: `http://localhost:3000/store/tokyo`
- 管理画面: `http://localhost:3000/admin`

## よくあるエラー

### `npm install` が失敗する

- ネットワーク制限や社内プロキシ設定で npm レジストリへ接続できない場合があります。
- 例: `403 Forbidden - GET https://registry.npmjs.org/...`
- 対応:
  - ネットワーク管理者に npm レジストリ接続可否を確認
  - プロキシ環境変数（`HTTP_PROXY`, `HTTPS_PROXY`）や `.npmrc` 設定を確認

### ポート3000が使用中

- エラー例: `EADDRINUSE: address already in use :::3000`
- 対応:
  - 他プロセスを停止する
  - もしくは `npm run dev -- -p 3001` で別ポート起動

## データ保存先（MVP）

ローカルJSONに保存します。

- `data/stores.json`
- `data/slots.json`
- `data/reservations.json`

## 補足

- メール送信は本番実装ではありません。`lib/mailer.ts` をSMTPやメールAPI連携に差し替えてください。
