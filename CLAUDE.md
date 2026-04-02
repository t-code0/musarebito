# 蒸され人（むされびと） CEO オーケストレーター v6

## あなたの役割
HONMONOプロジェクト App4「蒸され人」のCEOエージェント。
9体の専門エージェントをTaskツールで並列・順次起動し、MVPを完成させる。
人間の確認・承認は不要。エラーは自力で3回まで修正を試みる。

---

## プロジェクト概要
- サービス名: 蒸され人（むされびと）
- フォルダ名: musarebito
- Vercelドメイン: honmono-sauna
- コンセプト: 「食べログのサウナ版」＋「本物スコア＋AI要約付き」
- URL構造: /[lang]/sauna/[prefecture]/[id]（必須）

## 技術スタック
- Next.js 14 (App Router) + TypeScript + Tailwind CSS (PWA対応)
- Supabase（App1〜3と同じプロジェクトを流用）
- Google Maps JavaScript API + Places API
- Claude API（口コミ要約・本物スコア算出）
  - 生成: claude-haiku-4-5-20251001
  - 品質チェック: claude-sonnet-4-6
- Vercel デプロイ

## MVP機能（これだけ。追加しない）
1. エリア検索でサウナ施設一覧表示（地図付き）
2. Google Places APIで施設情報・口コミを自動取得
3. Claudeが「この施設の特徴まとめ」を自動生成
4. 本物スコア表示（清潔さ・設備・スタッフ・ととのい度）
5. ユーザーが口コミ・写真を投稿できる

---

## 最重要合格基準（全エージェント共通）

**「ターゲットユーザーが課金してまで使いたいと思うか」**

以下3条件を全て満たさない限り不合格・差し戻し：
1. 他では絶対に見つからない情報がある
2. 毎日使う理由がある（データが蓄積されて価値が増す）
3. 信頼できると感じる（根拠・出典が明示されている）

## App4 蒸され人 固有の合格条件
- [ ] AI要約で「この施設の特徴を30秒で把握」できる
- [ ] 本物スコアに「清潔さ・設備・スタッフ・ととのい度」の内訳が見える
- [ ] サウナイキタイにない情報（健康効果・混雑傾向）がある
- [ ] #サウナ #ととのい でシェアしたくなるスコア画像がある

不合格条件（即差し戻し）：
- Googleマップと同じ情報しかない
- AI要約がなく口コミをそのまま羅列している
- サウナ好きが「これは知らなかった」と思う情報がない

---

## スキルズ（全エージェント必読）

### スキル1: UI/UXレシピ
- スコア・ランク表示は画面上部1/3以内に配置
- タップ領域は44px以上、本文フォント16px以上
- ローディング中はスケルトンUIを表示（空白画面禁止）
- シェアボタンはスコア表示の直下（タップ2回以内でシェア）
- フロントエンド実装前に必ず読む: C:\Users\Owner\AppData\Local\AnthropicClaude\app-*\resources\app\node_modules\@anthropic-ai\claude-code\dist\skills\public\frontend-design\SKILL.md
- Inter/Roboto/Arialフォント禁止（AIスロップデザイン禁止）
- デザイン: メイン深緑#1B4332、アクセントアンバー#D97706、モバイルファースト

### スキル2: データ取得・キャッシュレシピ
- 全APIにタイムアウト設定（10秒）
- エラー時はフォールバックデータを表示（空白画面禁止）
- Google Places API: Supabaseで24時間キャッシュ必須（コスト対策）
- 月次予算上限: Google Maps API 5,000円に設定
- ユーザーへのエラーメッセージは日本語で具体的に

### スキル3: Claude API活用レシピ
- 役割を明確に指定（「あなたはサウナ専門家です」）
- 出力フォーマットはJSONで指定（安定化）
- 根拠・出典を必ず含めるよう指示
- Haiku: 口コミ要約・タグ付け・大量生成
- Sonnet: 品質チェック・複雑な判断
- 1リクエストあたり最大トークン数を設定
- 詳細ページを開いた時のみClaude呼び出し（一覧ページでは呼ばない）

### スキル4: SEO自動生成レシピ
- URLに /[lang]/ を含める（例: /ja/sauna/tokyo/xxx）
- 各ページにOGP・title・descriptionを動的生成
- 構造化データ（JSON-LD）を実装
- ページ速度: LCP 2.5秒以内
- ローカルSEO: 「地域名＋サウナ」「地域名＋サウナ おすすめ」

### スキル5: 収益化実装レシピ
- サウナグッズ・タオルのAmazonアフィリリンクを施設詳細ページ下部に配置
- rel="nofollow sponsored"を付与
- クリック数をSupabaseでトラッキング
- アドセンス: スコア表示の下・口コミリストの間に自然に挿入

---

## 実行手順

### PHASE 1: PLAN（3エージェントを並列Taskで同時起動）

**Task A - 市場調査** （outputs/01_market_research.md に出力）
以下を調査・出力せよ：
- サウナイキタイとの差別化ポイント（3つ）
- ターゲットペルソナ（サウナ民・#ととのい層）
- SEOキーワード候補10個（地域名＋サウナ系）
- X(Twitter)投稿ネタ5案

**Task B - 機能設計** （outputs/02_feature_spec.md に出力）
以下を設計せよ：
- MVP5機能の詳細仕様とユーザーストーリー
- 本物スコアロジック（清潔さ・設備・スタッフ・ととのい度 各0-25点、計0-100点）
- 画面遷移図（トップ→一覧→詳細→口コミ投稿）

**Task C - 技術設計** （outputs/03_tech_design.md + outputs/sql/schema.sql に出力）
以下を設計・作成せよ：

ディレクトリ構成（Next.js App Router）、API Routes一覧

schema.sql の内容：
```sql
-- saunasテーブル
create table saunas (
  id uuid primary key default gen_random_uuid(),
  place_id text unique not null,
  name text not null,
  prefecture text not null,
  city text,
  address text,
  lat float,
  lng float,
  rating float,
  phone text,
  website text,
  opening_hours jsonb,
  photos jsonb,
  google_reviews jsonb,
  ai_summary text,
  honmono_score int,
  score_detail jsonb,
  cached_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- reviewsテーブル
create table sauna_reviews (
  id uuid primary key default gen_random_uuid(),
  sauna_id uuid references saunas(id) on delete cascade,
  user_id text,
  rating int check (rating between 1 and 5),
  body text check (length(body) >= 10),
  photo_url text,
  created_at timestamptz default now()
);

-- RLS
alter table saunas enable row level security;
alter table sauna_reviews enable row level security;
create policy "saunas_select" on saunas for select using (true);
create policy "saunas_insert" on saunas for insert with check (auth.role() = 'service_role');
create policy "reviews_select" on sauna_reviews for select using (true);
create policy "reviews_insert" on sauna_reviews for insert with check (true);
```

outputs/env.example の内容：
```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

PHASE 1完了後、outputs/の3ファイルを確認してPHASE 2へ。

---

### PHASE 2: DO（順次実行）

**Step 1: プロジェクト初期化**
```
cd C:\Users\Owner\Documents\アプリ開発
npx create-next-app@14 musarebito --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd musarebito
npm install @supabase/supabase-js @googlemaps/google-maps-services-js @react-google-maps/api
```

**Step 2: バックエンド実装** （スキル2・3を必読してから実装）

lib/supabase.ts - サーバー・クライアント両用Supabaseクライアント

lib/places.ts - Google Places APIラッパー
- searchSaunas(query, prefecture): Places APIで検索
- getSaunaDetail(placeId): 施設詳細取得
- キャッシュロジック: cached_atが24時間以内ならDBから返す（API呼ばない）

lib/claude.ts - Claude APIラッパー
- generateSummary(reviews, name): 口コミ→施設特徴まとめ200字（Haiku使用）
- calculateHonmonoScore(reviews, data): 清潔さ・設備・スタッフ・ととのい度を各0-25点で算出（Haiku使用）
- モデル: claude-haiku-4-5-20251001

types/sauna.ts - 型定義（Sauna, SaunaDetail, Review, ScoreDetail）

app/api/sauna/search/route.ts (GET ?q=&prefecture=)
- Supabaseキャッシュ確認→なければPlaces API呼び出し
- レスポンス: { saunas: Sauna[] }

app/api/sauna/[id]/route.ts (GET)
- DBから取得、ai_summaryがnullならClaude呼び出して保存
- レスポンス: { sauna: SaunaDetail }

app/api/review/route.ts (POST)
- バリデーション: rating 1-5、body 10文字以上
- sauna_reviewsテーブルに保存

**Step 3: フロントエンド実装** （スキル1・4を必読してから実装）

app/[lang]/page.tsx - トップページ
- ヒーロー: 「あなたの街の本物サウナを探す」
- エリア検索フォーム
- 都道府県クイック選択ボタン（10都道府県）

app/[lang]/sauna/[prefecture]/page.tsx - 施設一覧
- Googleマップ（左）＋施設カードリスト（右）
- 施設カード: 名前・評価・本物スコアバッジ・AI要約プレビュー

app/[lang]/sauna/[prefecture]/[id]/page.tsx - 施設詳細
- generateMetadata でSEO対応
- 本物スコアを大きく表示（S/A/B/C/Dランク）
- スコア内訳バー（清潔さ・設備・スタッフ・ととのい度）
- AI要約ボックス（「Claudeによる特徴まとめ」）
- サウナグッズAmazonアフィリリンク（施設詳細の下）
- 口コミ一覧＋投稿ボタン
- JSON-LD構造化データ

components/HonmonoScore.tsx - スコアバッジ（S/A/B/C/D + 数値 + 内訳）
components/SaunaCard.tsx - 施設カード
components/ReviewModal.tsx - 口コミ投稿モーダル
app/[lang]/sauna/[prefecture]/[id]/loading.tsx - スケルトンUI
app/[lang]/sauna/[prefecture]/[id]/error.tsx - エラー表示

**Step 4: ビルド確認**
```
npm run build
```
エラーが出たら自力で3回まで修正。lint警告も修正する。

---

### PHASE 3: CHECK（3エージェントを並列Taskで同時起動）

**Task D - コードレビュー** （outputs/05_review.md に出力）
確認項目：
- 一覧ページでClaude APIを呼んでいないか
- Google Places APIの24時間キャッシュが実装されているか
- TypeScriptのany禁止が守られているか
- ローディング・エラー状態が実装されているか
- クリティカルな問題は即修正すること

**Task E - セキュリティ審査** （outputs/06_security.md に出力）
確認項目：
- .gitignoreに.env.localが含まれているか
- SUPABASE_SERVICE_ROLE_KEYにNEXT_PUBLIC_が付いていないか
- レビュー投稿にレート制限があるか（なければ追加）
- SupabaseのRLSが有効になっているか
- クリティカルな問題は即修正すること

**Task F - ドキュメント生成** （README.md + outputs/07_deploy_checklist.md に出力）
README.mdに含める：
- サービス概要（1行）
- ローカル起動手順（3ステップ）
- 環境変数一覧
- Supabaseセットアップ（schema.sqlを実行するだけ）

deploy_checklist.mdに含める：
- Vercel環境変数設定リスト
- Google Maps API 予算上限設定（5,000円）
- Google Maps API 許可ドメイン設定
- Supabase本番DB schema.sql実行
- npm run build 確認

---

### PHASE 4: 完了報告

すべてのフェーズ完了後、人間に以下を報告：

```
✅ 蒸され人（むされびと）MVP完成

## 実装済み機能
- エリア検索 + 施設一覧（地図付き）
- 施設詳細（本物スコア・AI要約・口コミ）
- 口コミ投稿

## 起動方法
cd C:\Users\Owner\Documents\アプリ開発\musarebito
npm install
cp .env.example .env.local  ← 環境変数を記入
npm run dev

## デプロイ前に必要なアクション（人間が実施）
1. .env.local に環境変数を設定
2. Supabase で outputs/sql/schema.sql を実行
3. Google Maps API で予算上限5,000円を設定
4. vercel --prod でデプロイ
```

---

## 絶対にやってはいけないこと
- MVPを超えた機能を作る
- 合格基準を満たさないまま完了報告する
- Google Maps APIのコスト上限を設定しない
- Inter/Roboto/Arialフォントを使う
- SUPABASE_SERVICE_ROLE_KEYをNEXT_PUBLIC_にする
- 一覧ページでClaude APIを呼ぶ
