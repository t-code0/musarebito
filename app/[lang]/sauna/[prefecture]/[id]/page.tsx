"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import HonmonoScore from "@/components/HonmonoScore";
import ReviewModal from "@/components/ReviewModal";
import SaunaGoods from "@/components/SaunaGoods";
import AdSlot from "@/components/AdSlot";
import { Sauna, Review, getFirstPhoto } from "@/types/sauna";
import { t, normalizeLang, type Lang } from "@/lib/i18n";

interface VoteTally {
  up: number;
  down: number;
  total: number;
  percentage: number;
}

interface SaunaWithEn extends Sauna {
  ai_summary_en?: string | null;
}

export default function SaunaDetailPage() {
  const params = useParams();
  const lang: Lang = normalizeLang(params.lang as string);
  const prefecture = decodeURIComponent(params.prefecture as string);
  const id = params.id as string;

  const [sauna, setSauna] = useState<SaunaWithEn | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [lightbox, setLightbox] = useState<{ urls: string[]; idx: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [votes, setVotes] = useState<VoteTally>({ up: 0, down: 0, total: 0, percentage: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/sauna/${id}`, { cache: "no-store" });
      const data = await res.json();
      setSauna(data.sauna);
      setReviews(data.reviews || []);
      if (data.votes) setVotes(data.votes);
      return data.sauna;
    } catch (error) {
      console.error("Failed to fetch sauna:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Check localStorage for prior vote on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const voted = localStorage.getItem(`musarebito_voted_${id}`);
    if (voted) setHasVoted(true);
  }, [id]);

  const handleVote = useCallback(
    async (type: "up" | "down") => {
      if (hasVoted || voting) return;
      setVoting(true);
      try {
        const res = await fetch(`/api/sauna/${id}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });
        if (res.ok) {
          const data = await res.json();
          setVotes(data);
          localStorage.setItem(`musarebito_voted_${id}`, type);
          setHasVoted(true);
        }
      } catch (e) {
        console.error("Vote failed:", e);
      } finally {
        setVoting(false);
      }
    },
    [hasVoted, voting, id]
  );

  useEffect(() => { fetchData(); }, [fetchData]);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowRight" && lightbox.urls.length > 1) {
        setLightbox({ urls: lightbox.urls, idx: (lightbox.idx + 1) % lightbox.urls.length });
      } else if (e.key === "ArrowLeft" && lightbox.urls.length > 1) {
        setLightbox({ urls: lightbox.urls, idx: (lightbox.idx - 1 + lightbox.urls.length) % lightbox.urls.length });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  // Trigger background refresh once per page load when ai_summary is missing
  // (score is computed inline in /api/sauna/[id], so it's already present)
  const refreshTriggered = useRef(false);
  useEffect(() => {
    if (!sauna || refreshTriggered.current) return;
    const needsAi =
      !sauna.ai_summary ||
      !Array.isArray(sauna.photos) ||
      sauna.photos.length === 0 ||
      (lang === "en" && !sauna.ai_summary_en);
    if (!needsAi) return;
    refreshTriggered.current = true;
    // Fire-and-forget background refresh
    fetch(`/api/sauna/refresh/${id}`, { method: "POST" }).catch(() => {});
  }, [sauna, id, lang]);

  // Poll for ai_summary while it's still missing
  useEffect(() => {
    if (!sauna || pollCount >= 10) return;
    const needsJa = !sauna.ai_summary;
    const needsEn = lang === "en" && !sauna.ai_summary_en;
    if (!needsJa && !needsEn) return;
    const timer = setTimeout(async () => {
      const updated = await fetchData();
      setPollCount((c) => c + 1);
      const ok =
        updated?.ai_summary && (lang !== "en" || updated?.ai_summary_en);
      if (ok) setPollCount(10);
    }, 3000);
    return () => clearTimeout(timer);
  }, [sauna, pollCount, fetchData, lang]);

  // Photo list for lightbox
  const photoList: string[] = sauna && Array.isArray(sauna.photos) ? sauna.photos : [];

  // JSON-LD structured data (LocalBusiness / HealthAndBeautyBusiness)
  const jsonLd = useMemo(() => {
    if (!sauna) return null;
    const url = `https://musarebito.vercel.app/${lang}/sauna/${encodeURIComponent(prefecture)}/${id}`;
    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "@id": url,
      name: sauna.name,
      url,
      address: {
        "@type": "PostalAddress",
        streetAddress: sauna.address || "",
        addressRegion: sauna.prefecture || "",
        addressLocality: sauna.city || "",
        addressCountry: "JP",
      },
    };
    if (sauna.lat && sauna.lng) {
      data.geo = { "@type": "GeoCoordinates", latitude: sauna.lat, longitude: sauna.lng };
    }
    if (sauna.phone) data.telephone = sauna.phone;
    if (sauna.website) data.sameAs = [sauna.website];
    if (sauna.rating) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: sauna.rating,
        bestRating: 5,
        reviewCount:
          (sauna.score_detail && (sauna.score_detail as Record<string, unknown>).review_count) ||
          (sauna.google_reviews ? sauna.google_reviews.length : undefined) ||
          1,
      };
    }
    if (Array.isArray(sauna.opening_hours) && sauna.opening_hours.length > 0) {
      data.openingHours = sauna.opening_hours
        .map((h) => (typeof h === "object" && h && "text" in h ? (h as { text: string }).text : String(h)))
        .filter(Boolean);
    }
    if (Array.isArray(sauna.photos) && sauna.photos.length > 0) {
      data.image = sauna.photos.slice(0, 6);
    }
    if (sauna.ai_summary) data.description = sauna.ai_summary;
    return data;
  }, [sauna, lang, prefecture, id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500">{t("detail_loading", lang)}</p>
        </div>
      </main>
    );
  }

  if (!sauna) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t("detail_not_found", lang)}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 100%)" }}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Header Image */}
      <div className="relative h-64 md:h-80 bg-[#1a0a0a]">
        {getFirstPhoto(sauna.photos) ? (
          <img
            src={getFirstPhoto(sauna.photos)!}
            alt={sauna.name}
            className="w-full h-full object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto">
          <a
            href={`/${lang}`}
            className="text-green-300 hover:text-green-200 text-base mb-1 inline-block"
          >
            {t("back_to_top", lang)}
          </a>
          <br />
          <a
            href={`/${lang}/sauna/${encodeURIComponent(prefecture)}`}
            className="text-red-300 hover:text-white text-base mb-2 inline-block"
          >
            {t("detail_back_to_list", lang, { pref: prefecture })}
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{sauna.name}</h1>
          <p className="text-gray-300 mt-1">{sauna.address}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Mobile: Score first (before photos) */}
        <div className="md:hidden mb-8">
          <HonmonoScore
            score={sauna.honmono_score}
            detail={sauna.score_detail}

          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photos */}
            {photoList.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#1B4332] mb-4">{t("detail_photos", lang)}</h2>
                <button onClick={() => setLightbox({ urls: photoList, idx: 0 })} className="w-full">
                  <img
                    src={photoList[0]}
                    alt={sauna.name}
                    className="w-full h-[300px] object-cover rounded-xl hover:opacity-90 transition"
                    loading="eager"
                  />
                </button>
                {photoList.length > 1 && (
                  <div className="grid grid-cols-5 gap-1.5 mt-2">
                    {photoList.slice(1, 6).map((photo, i) => (
                      <button key={i} onClick={() => setLightbox({ urls: photoList, idx: i + 1 })}>
                        <img src={photo} alt={`${sauna.name} ${i + 2}`}
                          className="w-full h-16 md:h-20 object-cover rounded-md hover:opacity-80 transition"
                          loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* AI Summary */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-3">{t("detail_features", lang)}</h2>
              <p className="text-gray-700 leading-relaxed">
                {(() => {
                  const summary =
                    lang === "en" ? sauna.ai_summary_en || sauna.ai_summary : sauna.ai_summary;
                  if (summary) return summary;
                  if (sauna.google_reviews && sauna.google_reviews.length > 0)
                    return t("detail_features_loading", lang);
                  return t("detail_features_empty", lang);
                })()}
              </p>
            </section>

            {/* Honmono Vote */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-3">{t("detail_vote_title", lang)}</h2>
              {votes.total > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>
                      <strong className="text-[#1B4332] text-lg">{votes.percentage}%</strong>
                      <span className="ml-1">{t("detail_vote_label", lang)}</span>
                    </span>
                    <span className="text-gray-500">
                      {votes.total}
                      {t("detail_vote_count", lang)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1B4332] transition-all"
                      style={{ width: `${votes.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote("up")}
                  disabled={hasVoted || voting}
                  className="flex-1 py-3 rounded-lg font-bold text-white bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("detail_vote_yes", lang)}
                </button>
                <button
                  onClick={() => handleVote("down")}
                  disabled={hasVoted || voting}
                  className="flex-1 py-3 rounded-lg font-bold text-white bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("detail_vote_no", lang)}
                </button>
              </div>
              {hasVoted && (
                <p className="text-xs text-gray-500 mt-2 text-center">{t("detail_vote_thanks", lang)}</p>
              )}
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
                  <h2 className="text-xl font-bold text-[#1B4332] mb-4">グルメ＆周辺情報</h2>
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
                          {validFoods.map((food: string, i: number) => <li key={i}>{food}</li>)}
                        </ul>
                      </div>
                    )}
                    {validSpots.length > 0 && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 mb-1">近くの観光スポット</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {validSpots.map((spot: string, i: number) => <li key={i}>{spot}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Google Map */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-4">{t("detail_access", lang)}</h2>
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDwjqPnGN30_4dzEMQoTE11d6PsAskDp1A&q=${encodeURIComponent(sauna.name + " " + sauna.address)}&zoom=15`}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 12 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sauna.name + " " + sauna.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-600 hover:underline text-sm mt-3"
              >
                {t("detail_open_in_maps", lang)}
              </a>
            </section>

            {/* Facility Facts (sauna/water bath temp etc) */}
            {(() => {
              const facts =
                (sauna.score_detail as Record<string, unknown> | null)?.facility_facts as
                  | {
                      sauna_temp_c: number | null;
                      water_bath_temp_c: number | null;
                      has_outside_air: boolean | null;
                      loyly_type: string | null;
                    }
                  | undefined;
              if (!facts) return null;
              const items = [
                facts.sauna_temp_c != null && {
                  emoji: "🔥",
                  label: t("detail_facts_sauna_temp", lang),
                  value: `${facts.sauna_temp_c}℃`,
                },
                facts.water_bath_temp_c != null && {
                  emoji: "💧",
                  label: t("detail_facts_water_temp", lang),
                  value: `${facts.water_bath_temp_c}℃`,
                },
                facts.has_outside_air !== null && {
                  emoji: "🌳",
                  label: t("detail_facts_outside_air", lang),
                  value: facts.has_outside_air ? t("detail_facts_yes", lang) : t("detail_facts_no", lang),
                },
                facts.loyly_type && {
                  emoji: "♨️",
                  label: t("detail_facts_loyly", lang),
                  value: facts.loyly_type,
                },
              ].filter(Boolean) as { emoji: string; label: string; value: string }[];
              if (items.length === 0) return null;
              return (
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#1B4332] mb-4">{t("detail_facts", lang)}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map((it) => (
                      <div
                        key={it.label}
                        className="rounded-lg p-3 text-center border border-gray-200 bg-gray-50"
                      >
                        <div className="text-2xl mb-1">{it.emoji}</div>
                        <div className="text-xs text-gray-500">{it.label}</div>
                        <div className="text-lg font-bold text-[#1B4332]">{it.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Info */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1B4332] mb-4 text-center">{t("detail_info", lang)}</h2>
              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 items-baseline">
                {sauna.phone && (
                  <>
                    <dt className="text-right pr-4 text-gray-500 text-sm">{t("detail_info_phone", lang)}</dt>
                    <dd className="text-left text-gray-700 text-sm">{sauna.phone}</dd>
                  </>
                )}
                {sauna.website && (
                  <>
                    <dt className="text-right pr-4 text-gray-500 text-sm">{t("detail_info_web", lang)}</dt>
                    <dd className="text-left min-w-0">
                      <a href={sauna.website} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all">{sauna.website}</a>
                    </dd>
                  </>
                )}
                <dt className="text-right pr-4 text-gray-500 text-sm">{t("detail_info_instagram", lang)}</dt>
                <dd className="text-left min-w-0">
                    {sauna.website && sauna.website.includes("instagram.com") ? (
                      <a href={sauna.website} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm">公式Instagram</a>
                    ) : (
                      <a href={`https://www.instagram.com/explore/tags/${encodeURIComponent(sauna.name.replace(/[\s&()（）・\-\[\]「」]/g, ""))}/`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all">#{sauna.name.replace(/[\s&()（）・\-\[\]「」]/g, "")} の投稿を見る</a>
                    )}
                  </dd>
                {sauna.rating && (
                  <>
                    <dt className="text-right pr-4 text-gray-500 text-sm">{t("detail_info_rating", lang)}</dt>
                    <dd className="text-left text-[#D97706] font-medium text-sm">★ {sauna.rating}</dd>
                  </>
                )}
                {sauna.opening_hours && (
                  <>
                    <dt className="text-right pr-4 text-gray-500 text-sm">{t("detail_info_hours", lang)}</dt>
                    <dd className="text-left text-gray-700 text-sm space-y-0.5">
                      {sauna.opening_hours.map((h, i) => (
                        <p key={i}>{typeof h === "object" && "text" in h ? h.text : String(h)}</p>
                      ))}
                    </dd>
                  </>
                )}
              </dl>
            </section>

            {/* Premium Teaser */}
            <section className="rounded-xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)" }}>
              <div className="blur-sm pointer-events-none">
                <h3 className="text-white font-bold mb-2">混雑時間帯</h3>
                <div className="flex gap-1 h-16">
                  {[3,5,8,12,15,12,10,8,6,4,2,1].map((h,i) => (
                    <div key={i} className="flex-1 bg-green-500/30 rounded-t" style={{ height: h*4 + "px", marginTop: "auto" }} />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <a href={`/${lang}/premium`} className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg">
                  🔒 プレミアムで詳しく見る
                </a>
              </div>
            </section>

            {/* Ad Slot */}
            <div id="ad-detail-1" className="mx-4 sm:mx-6 mb-4" />

            {/* Reviews */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1B4332]">{t("detail_reviews", lang)}</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#D97706] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B45309] transition-colors"
                >{t("detail_write_review", lang)}</button>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t("detail_no_reviews", lang)}</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString("ja-JP")}</span>
                      </div>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">{review.body}</p>
                      {review.photo_url && (() => {
                        const photoUrl = review.photo_url;
                        let urls: string[] = [];
                        try {
                          const parsed = JSON.parse(photoUrl);
                          if (Array.isArray(parsed)) {
                            urls = parsed.filter((u): u is string => typeof u === "string" && u.length > 0);
                          } else if (typeof parsed === "string") {
                            urls = [parsed];
                          }
                        } catch {
                          urls = [photoUrl];
                        }
                        if (urls.length === 0) return null;
                        return (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {urls.map((url, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setLightbox({ urls, idx: i })}
                              >
                                <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition" />
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column — PC only */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <HonmonoScore
                score={sauna.honmono_score}
                detail={sauna.score_detail}
    
              />
            </div>
          </div>
        </div>

        {/* Sauna Goods (Affiliate) */}
        <div className="clear-both mt-8 mb-8">
          <SaunaGoods source="detail" />
        </div>

        {/* Bottom Ad Slot */}
        <AdSlot slotName="detail-bottom" className="mb-8" />

        {/* Share */}
        <div className="flex justify-center gap-4 mb-8 px-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sauna.name + "の本物スコアは" + (sauna.honmono_score || "?") + "点！ #蒸され人 #サウナ")}&url=${encodeURIComponent("https://musarebito.vercel.app/" + lang + "/sauna/" + encodeURIComponent(prefecture) + "/" + id)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm hover:opacity-80"
          >X</a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://musarebito.vercel.app/" + lang + "/sauna/" + encodeURIComponent(prefecture) + "/" + id)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm hover:opacity-80"
          >LINE</a>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); alert("URLをコピーしました"); }}
            className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm hover:opacity-80"
          >URL</button>
        </div>
      </div>

      {/* Photo Lightbox */}
      {lightbox && lightbox.urls.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          onClick={() => setLightbox(null)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 40 || lightbox.urls.length <= 1) return;
            const next = dx < 0
              ? (lightbox.idx + 1) % lightbox.urls.length
              : (lightbox.idx - 1 + lightbox.urls.length) % lightbox.urls.length;
            setLightbox({ urls: lightbox.urls, idx: next });
          }}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
          >&times;</button>
          {lightbox.urls.length > 1 && (
            <>
              <button
                className="absolute left-2 sm:left-4 text-white text-4xl font-light hover:text-gray-300 z-10 p-4"
                onClick={(e) => { e.stopPropagation(); setLightbox({ urls: lightbox.urls, idx: (lightbox.idx - 1 + lightbox.urls.length) % lightbox.urls.length }); }}
              >&#8249;</button>
              <button
                className="absolute right-2 sm:right-4 text-white text-4xl font-light hover:text-gray-300 z-10 p-4"
                onClick={(e) => { e.stopPropagation(); setLightbox({ urls: lightbox.urls, idx: (lightbox.idx + 1) % lightbox.urls.length }); }}
              >&#8250;</button>
            </>
          )}
          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.urls[lightbox.idx]}
              alt={sauna.name}
              className="max-w-5xl max-h-[80vh] object-contain rounded-lg"
            />
            {lightbox.urls.length > 1 && (
              <p className="mt-3 text-white/80 text-sm font-medium">
                {lightbox.idx + 1} / {lightbox.urls.length}
              </p>
            )}
          </div>
        </div>
      )}

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
