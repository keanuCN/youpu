"use client";

import React, { useEffect, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "./data-state";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc?: string | null;
  srcSetType?: "image/webp";
  fallbackLabel: string;
  fallbackClassName?: string;
  fallbackMode?: "placeholder" | "muted" | "empty";
};

/** 外部图片失败时保留布局，并显示统一的本地占位。 */
export function SafeImage({
  src,
  fallbackSrc,
  alt,
  className,
  fallbackLabel,
  fallbackClassName,
  fallbackMode = "placeholder",
  onError,
  srcSet,
  srcSetType,
  sizes,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(!src);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    setFailed(!src);
    setUsingFallback(false);
  }, [src, fallbackSrc]);

  if (!src || failed) {
    const fallbackClasses = fallbackClassName ?? className;
    if (fallbackMode === "empty") {
      return <div aria-hidden="true" className={cn("h-full w-full", fallbackClasses)} />;
    }
    if (fallbackMode === "muted") {
      return <div role="img" aria-label={`${fallbackLabel} 图片暂不可用`} className={cn("h-full w-full bg-secondary", fallbackClasses)} />;
    }
    return <MediaPlaceholder label={fallbackLabel} className={cn("h-full w-full", fallbackClasses)} />;
  }

  const image = (
    <img
      {...props}
      src={usingFallback && fallbackSrc ? fallbackSrc : src}
      srcSet={!usingFallback && !srcSetType ? srcSet : undefined}
      sizes={!usingFallback && !srcSetType ? sizes : undefined}
      alt={alt}
      className={className}
      decoding={props.decoding ?? "async"}
      onError={(event) => {
        if (fallbackSrc && !usingFallback && src !== fallbackSrc) {
          setUsingFallback(true);
          onError?.(event);
          return;
        }
        setFailed(true);
        onError?.(event);
      }}
    />
  );

  if (srcSetType && srcSet && !usingFallback) {
    return (
      <picture className="contents">
        <source type={srcSetType} srcSet={srcSet} sizes={sizes} />
        {image}
      </picture>
    );
  }

  return image;
}
