"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HonmonoScore from "@/components/HonmonoScore";
import ReviewModal from "@/components/ReviewModal";
import { Sauna, Review } from "@/types/sauna";

export default function SaunaDetailPage() {
  const params = useParams();
  const lang = params.lang as string;
  const prefecture = decodeURIComponent(params.prefecture as string);
  const id = params.id as string;

  const [sauna, setSauna] = useState<Sauna | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/sauna/${id}`);
      const data = await res.json();
      setSauna(data.sauna);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch sauna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (!sauna) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">サウナが見つかりませんでした</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 bg-[#1B4332]">
        {sauna.photos && sauna.photos[0] ? (
          <img
            src={sauna.photos[0]}
            alt={sauna.name}
            className="w-full h-full object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto">
          <a
            href={`/${lang}/sauna/${encodeURIComponent(prefecture)}`}
            className="text-emerald-300 hover:text-white text-sm mb-2 inline-block"
          >
            ← {prefecture}のサウナ一覧
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {sauna.name}
          </h1>
          <p className="text-gray-300 mt-1">{sauna.address}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            {sauna.photos && sauna.photos.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#1B4332] mb-4">写真</h2>
                <div className="grid grid-cols-3 gap-2">
                  {sauna.photos.slice(0, 6).map((photo, i) => {
                    const photoUrl = photo.startsWith("http")
                      ? photo
                      : `https://places.googleapis.com/v1/${photo}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
                    return (
                      <a key={i} href={photoUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={photoUrl}
                          alt={`${sauna.name} 写真${i + 1}`}
                          className="w-full h-28 md:h-36 object-cover rounded-lg hover:opacity-80 transition"
                        />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* AI Summary */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-3 flex items-center gap-2">
                この施設の特徴
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {sauna.ai_summary || "要約を生成中..."}
              </p>
            </section>

            {/* Food Info */}
            {(() => {
              const fi = sauna.food_info;
              if (!fi) return null;
              const hasRestaurant = fi.restaurant && fi.restaurant !== "不明" && fi.restaurant.trim() !== "";
              const validFoods = (fi.local_food || []).filter((f: string) => f !== "不明" && f.trim() !== "");
              const validSpots = (fi.nearby_spots || []).filter((s: string) => s !== "不明" && s.trim() !== "");
              if (!hasRestaurant && validFoods.length === 0 && validSpots.length === 0) return null;
              return (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#1B4332] mb-4">
                    🍜 グルメ＆周辺情報
                  </h2>
                  <div className="space-y-4">
                    {hasRestaurant && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 mb-1">施設内の名物メニュー</h3>
                        <p className="text-gray-700">{fi.restaurant}</p>
                      </div>
                    )}
                    {validFoods.length > 0 && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 mb-1">周辺ご当地グルメ</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {validFoods.map((food: string, i: number) => (
                            <li key={i}>{food}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {validSpots.length > 0 && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 mb-1">近くの観光スポット</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {validSpots.map((spot: string, i: number) => (
                            <li key={i}>{spot}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Info */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-4">
                施設情報
              </h2>
              <dl className="space-y-3">
                {sauna.phone && (
                  <div className="flex">
                    <dt className="w-24 text-gray-500 text-sm">電話</dt>
                    <dd className="text-gray-700">{sauna.phone}</dd>
                  </div>
                )}
                {sauna.website && (
                  <div className="flex">
                    <dt className="w-24 text-gray-500 text-sm">Web</dt>
                    <dd>
                      <a
                        href={sauna.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {sauna.website}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="w-24 text-gray-500 text-sm">Instagram</dt>
                  <dd>
                    {sauna.website && sauna.website.includes("instagram.com") ? (
                      <a
                        href={sauna.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        公式Instagram
                      </a>
                    ) : (
                      <a
                        href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(sauna.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        @{sauna.name}を検索
                      </a>
                    )}
                  </dd>
                </div>
                {sauna.rating && (
                  <div className="flex">
                    <dt className="w-24 text-gray-500 text-sm">Google評価</dt>
                    <dd className="text-[#D97706] font-medium">
                      ★ {sauna.rating}
                    </dd>
                  </div>
                )}
                {sauna.opening_hours && (
                  <div>
                    <dt className="text-gray-500 text-sm mb-1">営業時間</dt>
                    <dd className="text-gray-700 text-sm space-y-0.5">
                      {sauna.opening_hours.map((h, i) => (
                        <p key={i}>{typeof h === "object" && "text" in h ? h.text : String(h)}</p>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1B4332]">口コミ</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#D97706] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B45309] transition-colors"
                >
                  口コミを書く
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  まだ口コミはありません
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#D97706]">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div>
            <HonmonoScore
              score={sauna.honmono_score}
              detail={sauna.score_detail}
            />
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          saunaId={id}
          onClose={() => setShowReviewModal(false)}
          onSubmitted={fetchData}
        />
      )}
    </main>
  );
}
