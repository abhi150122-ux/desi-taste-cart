import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

type RetryImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function RetryImage({ src, fallbackSrc, onError, ...props }: RetryImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retried, setRetried] = useState(false);
  const [failed, setFailed] = useState(false);
  const retryTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (retryTimer.current) window.clearTimeout(retryTimer.current);
    retryTimer.current = null;
    setCurrentSrc(src);
    setRetried(false);
    setFailed(false);

    return () => {
      if (retryTimer.current) window.clearTimeout(retryTimer.current);
    };
  }, [src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onError?.(event);
    const originalSrc = String(src ?? "");

    if (!retried && originalSrc) {
      const retryUrl = new URL(originalSrc, window.location.href);
      retryUrl.searchParams.set("retry", Date.now().toString());
      setRetried(true);
      const retryDelay = 300 + Math.floor(Math.random() * 900);
      console.warn("[IMAGE] First request failed; retrying", {
        url: originalSrc,
        retryUrl: retryUrl.toString(),
        retryDelay,
      });
      retryTimer.current = window.setTimeout(() => {
        retryTimer.current = null;
        setCurrentSrc(retryUrl.toString());
      }, retryDelay);
      return;
    }

    console.error("[IMAGE] Image failed after retry", { url: currentSrc });
    setFailed(true);
  };

  if (failed && fallbackSrc) {
    return <img {...props} src={fallbackSrc} onError={undefined} />;
  }

  return <img {...props} src={currentSrc} onError={handleError} />;
}
