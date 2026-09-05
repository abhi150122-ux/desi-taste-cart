import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

type RetryImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function RetryImage({ src, fallbackSrc, onError, ...props }: RetryImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retried, setRetried] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setRetried(false);
    setFailed(false);
  }, [src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onError?.(event);
    const originalSrc = String(src ?? "");

    if (!retried && originalSrc) {
      const retryUrl = new URL(originalSrc, window.location.href);
      retryUrl.searchParams.set("retry", Date.now().toString());
      console.warn("[IMAGE] First request failed; retrying", { url: originalSrc, retryUrl: retryUrl.toString() });
      setRetried(true);
      setCurrentSrc(retryUrl.toString());
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
