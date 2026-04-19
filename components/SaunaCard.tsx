"use client";

import Link from "next/link";
import { Sauna, getFirstPhoto } from "@/types/sauna";
import { prefEn, cityRomaji } from "@/lib/i18n";

interface Props {
  sauna: Sauna;
  lang: string;
}

export default function SaunaCard({ sauna, lang }: Props) {
  const thumb = getFirstPhoto(sauna.photos);

  return (
    <Link
      href={`/${lang}/sauna/${sauna.prefecture}/${sauna.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-gray-200">
        {thumb ? (
          <img
            src={thumb}
            alt={sauna.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {sauna.is_closed && (
          <div className="absolute top-1 left-1 bg-gray-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
            {lang === "en" ? "Closed" : "閉業"}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-3">
        <h3 className={`font-bold text-xs sm:text-sm leading-tight line-clamp-2 ${sauna.is_closed ? "text-gray-400" : "text-[#1B4332]"}`}>
          {sauna.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {sauna.rating && (
            <>
              <span className="text-[10px] sm:text-xs">⭐</span>
              <span className="text-[10px] sm:text-xs font-medium">{sauna.rating}</span>
            </>
          )}
          <span className="text-[10px] sm:text-xs text-gray-400 truncate">
            {lang === "en"
              ? (sauna.city ? cityRomaji(sauna.city) : prefEn(sauna.prefecture))
              : (sauna.city || sauna.prefecture)}
          </span>
        </div>
      </div>
    </Link>
  );
}
