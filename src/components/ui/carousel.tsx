"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect, useCallback } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  onOpenLightbox: () => void;
}

const Slide = ({ slide, index, current, handleSlideClick, onOpenLightbox }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d] flex-shrink-0 w-[70vmin]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] z-10 cursor-pointer"
        onClick={() => {
          if (current === index) {
            onOpenLightbox();
          } else {
            handleSlideClick(index);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/10 transition-all duration-1000" />
          )}
        </div>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-white/10 border border-white/20 rounded-full focus:border-red-500 focus:outline-none hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-white/70" />
    </button>
  );
};

/* ─── Lightbox ─── */
interface LightboxProps {
  src: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}

function Lightbox({ src, onClose, onPrev, onNext, current, total }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close hint */}
      <button
        className="absolute top-6 right-6 text-white/50 hover:text-white text-sm font-mono tracking-wider transition-colors"
        onClick={onClose}
      >
        ESC
      </button>

      {/* Prev arrow */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition rotate-180 z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        title="Previous"
      >
        <IconArrowNarrowRight className="text-white/70" />
      </button>

      {/* Image */}
      <img
        src={src}
        alt={`Photo ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next arrow */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        title="Next"
      >
        <IconArrowNarrowRight className="text-white/70" />
      </button>

      {/* Counter */}
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ─── Carousel ─── */
interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevLightbox = useCallback(() => {
    setCurrent((c) => (c - 1 < 0 ? slides.length - 1 : c - 1));
  }, [slides.length]);
  const nextLightbox = useCallback(() => {
    setCurrent((c) => (c + 1 === slides.length ? 0 : c + 1));
  }, [slides.length]);

  const id = useId();

  return (
    <>
      <div
        className="relative w-[70vmin] h-[70vmin] overflow-hidden"
        style={{ margin: "0 auto" }}
        aria-labelledby={`carousel-heading-${id}`}
      >
        <ul
          className="absolute flex flex-nowrap list-none transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(calc(-${current} * 70vmin))`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
              onOpenLightbox={() => setLightboxOpen(true)}
            />
          ))}
        </ul>
        <div className="absolute bottom-4 left-0 flex items-center justify-center gap-4 w-full z-20">
          <CarouselControl
            type="previous"
            title="Go to previous slide"
            handleClick={handlePreviousClick}
          />
          <span className="text-white/40 text-sm font-mono tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <CarouselControl
            type="next"
            title="Go to next slide"
            handleClick={handleNextClick}
          />
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <Lightbox
          src={slides[current].src}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
          current={current}
          total={slides.length}
        />
      )}
    </>
  );
}
