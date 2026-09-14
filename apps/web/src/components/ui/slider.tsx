"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/** data-slot 命名与页面内的样式选择器约定一致（track / range / thumb） */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const thumbCount = Array.isArray(props.value ?? props.defaultValue)
    ? (props.value ?? props.defaultValue)!.length
    : 1;
  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="track" className="relative h-[3px] w-full grow bg-input">
        <SliderPrimitive.Range data-slot="range" className="absolute h-full bg-foreground" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="thumb"
          className="block h-4 w-2 border border-foreground bg-background transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
