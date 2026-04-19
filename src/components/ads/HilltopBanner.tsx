import { useEffect, useRef, useState } from "react";

/**
 * Adsterra (highperformanceformat.com) iframe banner.
 *
 * Each ad is rendered inside an isolated <iframe srcDoc> so the `atOptions`
 * global from one banner cannot clobber another, and a slow/blocked ad
 * network can never break the parent React app.
 */

type BannerKey =
  | "468x60"
  | "728x90"
  | "320x50"
  | "160x600"
  | "160x300";

const BANNERS: Record<BannerKey, { key: string; width: number; height: number }> = {
  "468x60": { key: "955942fae601c50aac5c81e9b9a186ab", width: 468, height: 60 },
  "728x90": { key: "189ee00bb5584138e2611f7d8bcde2a8", width: 728, height: 90 },
  "320x50": { key: "3f8b1e93063a51e89d80617dea9d4d36", width: 320, height: 50 },
  "160x600": { key: "26871cafca684994c0d48b4294559c68", width: 160, height: 600 },
  "160x300": { key: "7b6c59190432c3cd7c3a0f4b490e7281", width: 160, height: 300 },
};

interface HilltopBannerProps {
  size: BannerKey;
  className?: string;
  label?: boolean;
}

const buildSrcDoc = (key: string, width: number, height: number) => `<!doctype html>
<html><head><meta charset="utf-8" />
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}body{display:flex;align-items:center;justify-content:center;}</style>
</head><body>
<script type="text/javascript">
  atOptions = { 'key':'${key}', 'format':'iframe', 'height':${height}, 'width':${width}, 'params':{} };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body></html>`;

export const HilltopBanner = ({ size, className = "", label = true }: HilltopBannerProps) => {
  const { key, width, height } = BANNERS[size];
  const srcDoc = buildSrcDoc(key, width, height);

  return (
    <div className={`w-full my-6 flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">
          Advertisement
        </span>
      )}
      <iframe
        title={`ad-${size}`}
        srcDoc={srcDoc}
        width={width}
        height={height}
        style={{ border: 0, maxWidth: "100%", display: "block" }}
        scrolling="no"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

/**
 * Picks ONE banner size based on viewport width and renders it.
 * Avoids mounting 3 ad iframes at once (which wastes bandwidth and used
 * to clobber the shared `atOptions` global).
 */
export const ResponsiveHilltopBanner = ({ className = "" }: { className?: string }) => {
  const [size, setSize] = useState<BannerKey | null>(null);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      if (w >= 1024) setSize("728x90");
      else if (w >= 640) setSize("468x60");
      else setSize("320x50");
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  if (!size) {
    return <div className={`w-full my-6 ${className}`} style={{ minHeight: 60 }} />;
  }

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <HilltopBanner size={size} />
    </div>
  );
};
