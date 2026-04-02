## 作業開始前の必須手順（新規タスク開始時のみ）
1. プロジェクトファイルの quality_gates_v7.md を読む
2. プロジェクトファイルの CLAUDE_CEO_v7.md を読む
## 成果物提出前の必須手順（タスク完了時に必ず実行）
1. quality_gates_v7.md の合格条件を全項目チェック
2. ブラウザで動作確認
3. 全項目合格するまで自分で修正してから報告
4. 合格していない場合は自分で差し戻して修正すること
---
# 蒸され人（むされびと） 指示書 v7

## あなたの役割
あなたはシニアフルスタックエンジニアです。
蒸され人をサウナ好きが毎日使うレベルで実装してください。

## ブランド
HONMONOブランドから独立したキャラクター系ブランド

## プロジェクト概要
- サービス名: 蒸され人（むされびと）
- フォルダ名: musarebito
- Vercelドメイン: honmono-sauna
- コンセプト: 「食べログのサウナ版」＋「本物スコア＋AI要約付き」
- URL構造: /[lang]/sauna/[prefecture]/[id]（必須）
- GitHub: https://github.com/t-code0/musarebito
- 本番: https://musarebito.vercel.app
- 状況: 本番稼働中

## 合格基準（quality_gates_v7.md App4 参照）
- AI要約でこの施設の特徴を30秒で把握できる
- 本物スコアに清潔さ・設備・スタッフ・ととのい度の内訳が見える
- サウナイキタイにない情報（健康効果論文・混雑傾向）がある
- シェアしたくなるスコア画像がある

## 技術スタック
- Next.js 14 (App Router) + TypeScript + Tailwind CSS (PWA対応)
- Supabase（App1〜3と同じプロジェクトを流用）
- Vercel（デプロイ）
- Google Maps JavaScript API + Places API
- Claude API（口コミ要約・本物スコア算出）
  - 生成: claude-haiku-4-5-20251001
  - 品質チェック: claude-sonnet-4-6

## MVP機能（これだけ。追加しない）
1. エリア検索でサウナ施設一覧表示（地図付き）
2. Google Places APIで施設情報・口コミを自動取得
3. Claudeが「この施設の特徴まとめ」を自動生成
4. 本物スコアを表示（清潔さ・設備・スタッフ・ととのい度）
5. ユーザーが口コミ・写真を投稿できる

## スキルズ・エージェント構成
CLAUDE_CEO_v7.md を参照

## デザイン
- メイン深緑#1B4332、アクセントアンバー#D97706、モバイルファースト
- Inter/Roboto/Arialフォント禁止（AIスロップデザイン禁止）

## 禁止事項
- MVPを超えた機能を作る
- 合格基準を満たさない状態での報告
- Google Maps APIのコスト上限を設定しない
- Inter/Roboto/Arialフォントの使用
- SUPABASE_SERVICE_ROLE_KEYをNEXT_PUBLIC_にする
- 一覧ページでClaude APIを呼ぶ
- Googleマップと同じ情報しかない状態でのリリース
