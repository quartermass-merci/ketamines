'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  // Distribute images across 3 columns (masonry-style)
  const cols: string[][] = [[], [], []];
  images.forEach((img, i) => {
    cols[i % 3].push(img);
  });

  return (
    <div className="mx-auto grid w-full gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
      {cols.map((col, colIdx) => (
        <div key={colIdx} className="grid gap-4 sm:gap-6">
          {col.map((src, index) => (
            <AnimatedImage
              key={src}
              alt={`Live photo ${colIdx * col.length + index + 1}`}
              src={src}
              ratio={
                // Alternate between landscape and portrait for visual rhythm
                (colIdx + index) % 3 === 0 ? 4 / 5 :
                (colIdx + index) % 3 === 1 ? 3 / 4 :
                1
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface AnimatedImageProps {
  alt: string;
  src: string;
  className?: string;
  ratio: number;
}

function AnimatedImage({ alt, src, ratio }: AnimatedImageProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <AspectRatio
      ref={ref}
      ratio={ratio}
      className="relative size-full overflow-hidden border border-white/5"
    >
      <img
        alt={alt}
        src={src}
        className={cn(
          'size-full object-cover opacity-0 transition-all duration-1000 ease-in-out scale-105',
          {
            'opacity-100 scale-100': isInView && !isLoading,
          },
        )}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </AspectRatio>
  );
}
