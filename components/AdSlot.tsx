"use client";

/**
 * Reusable AdSense placeholder.
 *
 * After AdSense approval:
 *   1. Set `ADSENSE_CLIENT_ID` and `ADSENSE_SLOT_ID` below.
 *   2. The placeholder is replaced everywhere this component is used.
 *
 * Until then, a subtle "広告枠" placeholder is shown so layout shifts stay
 * minimal once real ads land.
 */

const ADSENSE_CLIENT_ID = ""; // e.g. "ca-pub-1234567890123456"
const ADSENSE_SLOT_ID = "";   // e.g. "1234567890"

interface Props {
  /** Used as DOM id and AdSense data-ad-slot fallback. */
  slotName: string;
  /** Optional Tailwind class overrides for the wrapper. */
  className?: string;
  /** Optional inline style overrides. */
  style?: React.CSSProperties;
}

export default function AdSlot({ slotName, className = "", style }: Props) {
  const enabled = ADSENSE_CLIENT_ID !== "" && ADSENSE_SLOT_ID !== "";

  if (enabled) {
    return (
      <div
        id={`ad-${slotName}`}
        className={`my-4 flex justify-center ${className}`}
        style={style}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", maxWidth: 728 }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={ADSENSE_SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      id={`ad-${slotName}`}
      data-ad-slot={slotName}
      className={`my-4 mx-auto w-full max-w-3xl border border-dashed border-white/15 rounded-lg p-6 text-center text-xs text-white/30 ${className}`}
      style={style}
    >
      広告枠（AdSense審査後に表示されます）
    </div>
  );
}
