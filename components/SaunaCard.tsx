"use client";

import Link from "next/link";
import { Sauna } from "@/types/sauna";

interface Props {
  sauna: Sauna;
  lang: string;
}

export default function SaunaCard({ sauna, lang }: Props) {
  const scoreColor =
    (sauna.honmono_score ?? 0) >= 80
      ? "bg-emerald-600"
      : (sauna.honmono_score ?? 0) >= 60
        ? "bg-amber-600"
        : "bg-red-600";

  return (
    <Link
      href={`/${lang}/sauna/${sauna.prefecture}/${sauna.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative h-48 bg-gray-200">
        {sauna.photos && sauna.photos[0] ? (
          <img
            src={sauna.photos[0]}
            alt={sauna.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {sauna.honmono_score !== null && (
          <div
            className={`absolute top-3 right-3 ${scoreColor} text-white text-sm font-bold px-3 py-1 rounded-full`}
          >
            {sauna.honmono_score}点
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-[#1B4332] mb-1">{sauna.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {sauna.city || sauna.prefecture}
        </p>
        {sauna.rating && (
          <div className="flex items-center gap-1">
            <span className="text-[#D97706]">★</span>
            <span className="text-sm font-medium">{sauna.rating}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
