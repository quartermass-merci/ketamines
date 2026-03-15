"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

export interface PressQuote {
  quote: string;
  source: string;
  attribution?: string;
  rating?: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: PressQuote & { tempId: number };
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-red text-black border-red"
          : "z-0 bg-[#111] text-offwhite/80 border-white/10 hover:border-red/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(255,0,0,0.3)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-red/50" : "bg-white/10"
        )}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      {testimonial.rating && (
        <div
          className={cn(
            "mb-3 inline-block text-xs font-mono px-2 py-0.5 border",
            isCenter ? "border-black/30 text-black/80" : "border-white/20 text-grey-mid"
          )}
        >
          {testimonial.rating}
        </div>
      )}
      <h3
        className={cn(
          "text-sm sm:text-base font-light leading-relaxed",
          isCenter ? "text-black" : "text-offwhite/80"
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-xs font-mono tracking-[0.1em] uppercase",
          isCenter ? "text-black/70" : "text-grey-mid"
        )}
      >
        &mdash; {testimonial.source}
        {testimonial.attribution && (
          <span className="block mt-1 normal-case tracking-normal text-[10px]">
            {testimonial.attribution}
          </span>
        )}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC<{ quotes: PressQuote[] }> = ({
  quotes,
}) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(
    quotes.map((q, i) => ({ ...q, tempId: i }))
  );

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-14 w-14 items-center justify-center text-2xl transition-colors bg-black border-2 border-white/20 hover:bg-red hover:text-black hover:border-red"
          aria-label="Previous quote"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="flex h-14 w-14 items-center justify-center text-2xl transition-colors bg-black border-2 border-white/20 hover:bg-red hover:text-black hover:border-red"
          aria-label="Next quote"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
