import { useEffect, useRef } from "react";

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
  /** Optional label shown above the ad (e.g. "Advertisement") */
  label?: boolean;
}

/**
 * HilltopAds iframe banner. Each instance loads its own invoke.js into a
 * dedicated container so multiple sizes can coexist on the same page.
 */
export const HilltopBanner = ({ size, className = "", label = true }: HilltopBannerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { key, width, height } = BANNERS[size];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Avoid double-injection on hot reloads / re-renders
    if (container.dataset.loaded === "true") return;
    container.dataset.loaded = "true";

    // Inline atOptions script
    const opts = document.createElement("script");
    opts.type = "text/javascript";
    opts.text = `atOptions = { 'key':'${key}', 'format':'iframe', 'height':${height}, 'width':${width}, 'params':{} };`;
    container.appendChild(opts);

    // Loader script
    const loader = document.createElement("script");
    loader.type = "text/javascript";
    loader.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    loader.async = true;
    container.appendChild(loader);
  }, [key, width, height]);

  return (
    <div className={`w-full my-6 flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        style={{ width, height, maxWidth: "100%" }}
        className="overflow-hidden"
      />
    </div>
  );
};

/**
 * Responsive horizontal banner: shows 728x90 on lg+, 468x60 on sm+, 320x50 on mobile.
 * Renders all three but hides via CSS so the right one fills naturally.
 */
export const ResponsiveHilltopBanner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      <div className="block sm:hidden">
        <HilltopBanner size="320x50" label />
      </div>
      <div className="hidden sm:block lg:hidden">
        <HilltopBanner size="468x60" label />
      </div>
      <div className="hidden lg:block">
        <HilltopBanner size="728x90" label />
      </div>
    </div>
  );
};
