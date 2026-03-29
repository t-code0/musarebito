# 蒸され人（むされびと） CEO

## プロジェクト概要
- サービス名: 蒸され人（むされびと）
- フォルダ名: musarebito
- Vercelドメイン: honmono-sauna
- Next.js 14 + TypeScript + Tailwind + Supabase + Google Maps API + Claude API
- URL構造: /[lang]/sauna/[prefecture]/[id]
- Google Places APIは必ずSupabaseで24時間キャッシュ

## デザイン
- メインカラー: 深緑 #1B4332
- アクセントカラー: アンバー #D97706
- モバイルファースト

## 環境変数
ANTHROPIC_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API_KEY,
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
