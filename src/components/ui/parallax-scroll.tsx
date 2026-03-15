"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const ParallaxScrollSecond = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateXFirst = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXThird = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotateXThird = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const third = Math.ceil(images.length / 3);
  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <>
      <div
        className={cn(
          "h-[40rem] items-start overflow-y-auto w-full",
          className
        )}
        ref={gridRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
          <div className="grid gap-10">
            {firstPart.map((el, idx) => (
              <motion.div
                style={{
                  y: translateYFirst,
                  x: translateXFirst,
                  rotateZ: rotateXFirst,
                }}
                key={"grid-1" + idx}
                onClick={() => setLightboxImg(el)}
                className="cursor-pointer"
              >
                <Image
                  src={el}
                  className="h-80 w-full object-cover object-left-top !m-0 !p-0 grayscale hover:grayscale-0 transition-all duration-500"
                  height={400}
                  width={400}
                  alt="The Ketamines"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {secondPart.map((el, idx) => (
              <motion.div
                key={"grid-2" + idx}
                onClick={() => setLightboxImg(el)}
                className="cursor-pointer"
              >
                <Image
                  src={el}
                  className="h-80 w-full object-cover object-left-top !m-0 !p-0 grayscale hover:grayscale-0 transition-all duration-500"
                  height={400}
                  width={400}
                  alt="The Ketamines"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {thirdPart.map((el, idx) => (
              <motion.div
                style={{
                  y: translateYThird,
                  x: translateXThird,
                  rotateZ: rotateXThird,
                }}
                key={"grid-3" + idx}
                onClick={() => setLightboxImg(el)}
                className="cursor-pointer"
              >
                <Image
                  src={el}
                  className="h-80 w-full object-cover object-left-top !m-0 !p-0 grayscale hover:grayscale-0 transition-all duration-500"
                  height={400}
                  width={400}
                  alt="The Ketamines"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white z-[101]"
              onClick={() => setLightboxImg(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImg}
                alt="The Ketamines"
                width={1200}
                height={800}
                className="max-h-[90vh] w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
