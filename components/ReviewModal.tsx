"use client";

import { useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

interface Props {
  saunaId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReviewModal({ saunaId, onClose, onSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files].slice(0, 3));
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photos.length === 0) return [];
    const sb = getSupabase();
    const urls: string[] = [];
    for (const file of photos) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${saunaId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await sb.storage.from("review-photos").upload(path, file);
      if (uploadErr) {
        console.error("[ReviewModal] Photo upload failed:", uploadErr);
        throw new Error(`写真アップロード失敗: ${uploadErr.message}`);
      }
      const { data } = sb.storage.from("review-photos").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!body.trim()) { setError("口コミを入力してください"); return; }

    setSubmitting(true);
    try {
      const photoUrls = await uploadPhotos();

      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sauna_id: saunaId,
          user_id: "anonymous",
          rating,
          body: body.trim(),
          photo_url: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
        }),
      });

      if (!res.ok) {
        let errMsg = `投稿に失敗しました (HTTP ${res.status})`;
        try {
          const data = await res.json();
          if (data.error) errMsg = data.error;
        } catch {}
        console.error("[ReviewModal] API error:", res.status, errMsg);
        throw new Error(errMsg);
      }
      onSubmitted();
      onClose();
    } catch (err) {
      console.error("[ReviewModal] Submit error:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1B4332]">口コミを書く</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">評価</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? "" : "opacity-30"}`}>⭐</button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">口コミ（1000文字以内）</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={5}
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none"
              placeholder="サウナの感想を書いてください..." />
            <p className="text-xs text-gray-400 mt-1 text-right">{body.length} / 1000</p>
          </div>

          {/* Photo upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">写真（最大3枚）</label>
            {photos.length > 0 && (
              <div className="flex gap-2 mb-2">
                {photos.map((file, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">&times;</button>
                  </div>
                ))}
              </div>
            )}
            {photos.length < 3 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-sm text-blue-600 hover:underline">+ 写真を追加</button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFiles} className="hidden" />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-[#1B4332] text-white py-3 rounded-lg font-medium hover:bg-[#2D6A4F] disabled:opacity-50 transition-colors">
            {submitting ? "投稿中..." : "投稿する"}
          </button>
        </form>
      </div>
    </div>
  );
}
