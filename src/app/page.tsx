"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";
import { ParallaxScrollSecond } from "@/components/ui/parallax-scroll";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import type { PressQuote } from "@/components/ui/stagger-testimonials";

/* ─── IMAGE MANIFESTS ─── */

const ALL_PHOTOS = [
  ...Array.from({ length: 15 }, (_, i) => `/images/live/live-${String(i + 1).padStart(2, "0")}.jpg`),
  ...Array.from({ length: 8 }, (_, i) => `/images/press/press-${String(i + 1).padStart(2, "0")}.jpg`),
];

/* ─── TRACKLIST (from back cover) ─── */

const TRACKS = [
  { num: "01", title: "Same Old Story", side: "A", file: "/audio/01-same-old-story.m4a" },
  { num: "02", title: "I Want Some Blood", side: "A", file: "/audio/02-i-want-some-blood.m4a" },
  { num: "03", title: "The Salaryman Vanishes", side: "A", file: "/audio/03-the-salaryman-vanishes.m4a" },
  { num: "04", title: "(I'm) Guarding the Beast", side: "A", file: "/audio/04-im-guarding-the-beast.m4a" },
  { num: "05", title: "You Are Not Real", side: "A", file: "/audio/05-you-are-not-real.m4a" },
  { num: "06", title: "Donchuknow?", side: "B", file: "/audio/06-donchuknow.m4a" },
  { num: "07", title: "Automatic", side: "B", file: "/audio/07-automatic.m4a" },
  { num: "08", title: "U Fell For It", side: "B", file: "/audio/08-u-fell-for-it.m4a" },
  { num: "09", title: "Do The Ideology", side: "B", file: "/audio/09-ideology.m4a" },
  { num: "10", title: "No Big Deal", side: "B", file: "/audio/10-no-big-deal.m4a" },
];

/* ─── DISCOGRAPHY ─── */

const DISCOGRAPHY = [
  { title: "Burned Out!", year: "2026", src: "/images/album-art/front-cover.png", link: "https://theketamines.bandcamp.com", type: "LP" },
  { title: "Automatic EP", year: "2023", src: "/images/album-art/automatic-ep.jpg", link: "https://theketamines.bandcamp.com", type: "EP" },
  { title: "Stay Awake / Always Small", year: "2014", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "7\"" },
  { title: "11:11 EP", year: "2014", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "EP" },
  { title: "All The Colours Of Your Heart", year: "2013", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "7\"" },
  { title: "So Hot!", year: "2013", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "7\"" },
  { title: "You Can\u2019t Serve Two Masters", year: "2013", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "LP" },
  { title: "The Ketamines / The Vignettes", year: "2012", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "Split" },
  { title: "Spaced Out", year: "2012", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "LP" },
  { title: "Line By Line", year: "2011", src: "/images/album-art/discography.jpg", link: "https://theketamines.bandcamp.com", type: "7\"" },
];

/* ─── PRESS QUOTES (for stagger cards) ─── */

const PRESS_QUOTES: PressQuote[] = [
  { quote: "Full of succinct, pop-influenced garage-psych, You Can\u2019t Serve Two Masters moves quickly and goes for the gut with great results.", source: "PopMatts", rating: "7/10" },
  { quote: "There\u2019s something that thrills me when people get away with these completely ludicrous, dumb, nursery-rhyme riffs, and I\u2019ve always been jealous of them.", source: "Consequence of Sound", attribution: "Jarrett Samson (Tough Age)" },
  { quote: "Ketamines threw down a monster set of ultra-catchy and inventive garage rock that had the main stage writhing and shimmying.", source: "Exclaim!" },
  { quote: "Canada\u2019s Ketamines shed many of the garage rock pretenses and go the quirky power pop route. It\u2019s a deft move and shows you what a brilliant band the Ketamines are.", source: "The Finest Kiss" },
  { quote: "The word ketamine refers to two things: one is the name of an anesthetic substance famous for being a recreational sedative. The other refers to a five-piece acid-wash pop band. Both are highly addictive.", source: "CiTR Discorder" },
  { quote: "Surfy, reverby, drugged-up freak pop. Mixing it up with different instruments and multiple vocalists, it\u2019s got a very free-form feel.", source: "Razorcake" },
  { quote: "What stands out on You Can\u2019t Serve Two Masters is the execution: great hooks are left alone to work their magic, most notably on the intoxicating title track and the bouncy \u2018Lawncare.\u2019", source: "PopMatts" },
  { quote: "You Can\u2019t Serve Two Masters is one of the better psych listens of the year; its ability to surprise is so engaging that it reminds us never to judge a book by its cover.", source: "PopMatts" },
  { quote: "It proves difficult to not fall in love with the perky spirit of \u2018Line by Line.\u2019 The dichotomy in their sound is excellent, showing off plenty of influences ranging in an eight-minute, three-track span.", source: "Styrofoam Drone" },
  { quote: "When your album spends 11 straight weeks in the Top 10 albums for Canadian college radio stations, you must\u2019ve done something right, right? No shit.", source: "Styrofoam Drone" },
  { quote: "Ketamines channel a shit-ton of energy into their trashy psych-outs, bringing a bit of garage-leaning surf-pop into the picture for their own bizarre flavor.", source: "Styrofoam Drone" },
  { quote: "How Ketamines can create such warming, vibrant sounds in the great white north is still confusing our team of scientists.", source: "HoZac Records" },
  { quote: "They still harness the hazy, confident stride of the dazed legends that came before them, and their psychedelic pop should carry them straight into the arms of today\u2019s most jaded with ease.", source: "HoZac Records" },
  { quote: "You Can\u2019t Serve Two Masters has the effect of a shaken up can of pop that has burst and has been left out in the sun too long. It is sticky, gritty and catchy as hell.", source: "Revolution Rock / CJAM 99.1" },
  { quote: "\u2018Stay Awake\u2019 is the band going straight for the radio with the closest thing to a \u2018hit\u2019 that the band has ever recorded.", source: "Audio Ammunition" },
  { quote: "Side B\u2019s \u2018Turning You On\u2019\u2019s a teen monster movie throb, the one where the zombie rises off the floor and tries to grab some flesh before getting bounced out of the party.", source: "Weird Canada" },
  { quote: "Their two new 7-inch singles diverge from the scrappy psych punk and power pop of their recent LP. All The Colours Of Your Heart is oddly funky in a psychedelic garage way.", source: "NOW Magazine" },
  { quote: "Ketamines (Toronto, ON) \u2014 They just released a super memorable slab of oh-so-catchy garage pop and essentially have an open invitation to play Sled Island 2013 anytime they want.", source: "Sled Island Festival" },
  { quote: "I listened to the Ketamines. Their song \u2018Kill Me Now, Please\u2019 is awesome. Way better than most stuff out there now.", source: "Mumbling Jack" },
  { quote: "The loose set was composed of tracks from their forthcoming LP, and judging by the response of the enthusiastic crowd, their debut should take them well beyond their isolated home of Lethbridge.", source: "Exclaim!" },
];

/* ─── VIDEOS ─── */

const VIDEOS = [
  { title: "Line By Line", subtitle: "HoZac 7\"", vimeoId: "70032699" },
  { title: "Live at CFUV", subtitle: "Radio Session", vimeoId: "49894750" },
  { title: "All the Colours of Your Heart", subtitle: "Music Video", vimeoId: "65181857" },
  { title: "You Can\u2019t Serve Two Masters", subtitle: "Music Video", vimeoId: "70258207" },
];

const LABELS = [
  "HoZac Records (Chicago)", "Odd Box Records (UK)", "Mammoth Cave Recording Co. (Toronto)",
  "Southpaw Records (US)", "Pleasence Records (Toronto)", "Hosehead Records (Toronto)",
  "Leaning Trees Records (Saskatoon)", "Mint Records (Vancouver)",
];

/* ─── PASSWORD GATE ─── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === "burnt") {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className={`relative flex flex-col items-center gap-10 ${shake ? "animate-shake" : ""}`}>
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 fade-up invert">
          <Image src="/images/logos/main-logo.jpg" alt="The Ketamines" fill className="object-contain" priority />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 fade-up-delay-1">
          <label className="text-xs tracking-[0.3em] uppercase text-grey-mid font-mono">Enter Password</label>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="bg-transparent border-b-2 border-white/30 focus:border-white text-white text-center text-2xl tracking-[0.2em] font-mono py-2 px-6 w-64 outline-none transition-colors duration-300 placeholder:text-white/10"
            placeholder="_ _ _ _ _"
            autoComplete="off"
          />
          {error && <p className="text-red text-xs tracking-[0.2em] uppercase font-mono animate-pulse">Wrong password</p>}
          <button type="submit" className="mt-2 text-xs tracking-[0.3em] uppercase text-grey-mid hover:text-white transition-colors duration-300 font-mono">[ Enter ]</button>
        </form>
      </div>
    </div>
  );
}

/* ─── AUDIO PLAYER ─── */

function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      if (currentTrack < TRACKS.length - 1) {
        setCurrentTrack((t) => t + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[currentTrack].file;
    if (isPlaying) audio.play();
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const prev = () => setCurrentTrack((t) => Math.max(0, t - 1));
  const next = () => setCurrentTrack((t) => Math.min(TRACKS.length - 1, t + 1));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border border-white/10 bg-black/50 backdrop-blur-sm">
      <audio ref={audioRef} preload="metadata" />

      {/* Track list */}
      <div className="max-h-80 overflow-y-auto">
        {(["A", "B"] as const).map((side) => (
          <div key={side}>
            <div className="px-4 py-2 text-xs tracking-[0.3em] uppercase font-mono text-red border-b border-white/5">
              Side {side}
            </div>
            {TRACKS.filter((t) => t.side === side).map((track, i) => {
              const idx = TRACKS.indexOf(track);
              return (
                <button
                  key={track.num}
                  onClick={() => { setCurrentTrack(idx); setIsPlaying(true); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5 border-b border-white/5 ${
                    currentTrack === idx ? "bg-white/5 text-white" : "text-offwhite/60"
                  }`}
                >
                  <span className="text-xs font-mono w-6 shrink-0 text-grey-mid">{track.num}</span>
                  {currentTrack === idx && isPlaying ? (
                    <span className="w-4 shrink-0"><Volume2 size={14} className="text-red animate-pulse" /></span>
                  ) : (
                    <span className="w-4 shrink-0"><Play size={14} className="text-grey-mid" /></span>
                  )}
                  <span className="text-sm">{track.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Player controls */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-offwhite/80 truncate max-w-[60%]">
            {TRACKS[currentTrack].num}. {TRACKS[currentTrack].title}
          </span>
          <span className="text-xs font-mono text-grey-mid">
            {fmt(progress)} / {fmt(duration)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 cursor-pointer mb-3 group" onClick={seek}>
          <div
            className="h-full bg-red transition-all duration-100 group-hover:bg-white"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} className="text-grey-mid hover:text-white transition-colors"><SkipBack size={18} /></button>
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-red hover:text-red transition-all">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={next} className="text-grey-mid hover:text-white transition-colors"><SkipForward size={18} /></button>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION DIVIDER ─── */

function Divider() {
  return (
    <div className="w-full flex items-center gap-4 py-8">
      <div className="flex-1 h-px bg-white/10" />
      <div className="w-2 h-2 bg-red rotate-45" />
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

/* ─── NAV ─── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/5" : ""
    }`}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="relative w-10 h-10 invert opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/images/logos/main-logo.jpg" alt="K" fill className="object-contain" />
        </div>
        <div className="flex gap-6 text-xs tracking-[0.2em] uppercase font-mono text-grey-mid">
          <a href="#music" className="hover:text-white transition-colors">Music</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#press" className="hover:text-white transition-colors">Press</a>
          <a href="#photos" className="hover:text-white transition-colors">Photos</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
}

/* ─── SCROLL REVEAL ─── */

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

/* ─── PARALLAX HERO (album art reveal) ─── */

const SECTION_HEIGHT = 1500;

function HeroSection() {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;
  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["170%", "100%"]);
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]);

  return (
    <div style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }} className="relative w-full">
      {/* Centre image — front cover */}
      <motion.div
        className="sticky top-0 h-screen w-full"
        style={{
          clipPath,
          backgroundSize,
          opacity,
          backgroundImage: "url(/images/album-art/front-cover.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Floating parallax images */}
      <div className="mx-auto max-w-5xl px-4 pt-[200px]">
        <ParallaxImg
          src="/images/press/press-01.jpg"
          alt="The Ketamines"
          start={-200}
          end={200}
          className="w-1/3"
        />
        <ParallaxImg
          src="/images/album-art/back-cover.png"
          alt="Burned Out! back cover"
          start={200}
          end={-250}
          className="mx-auto w-2/3"
        />
        <ParallaxImg
          src="/images/live/live-01.jpg"
          alt="The Ketamines live"
          start={-200}
          end={200}
          className="ml-auto w-1/3"
        />
        <ParallaxImg
          src="/images/press/press-02.jpg"
          alt="The Ketamines"
          start={0}
          end={-500}
          className="ml-24 w-5/12"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-black/0 to-black" />
    </div>
  );
}

function ParallaxImg({
  className, alt, src, start, end,
}: {
  className?: string; alt: string; src: string; start: number; end: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });
  const imgOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${className} grayscale hover:grayscale-0 transition-all duration-500`}
      ref={ref}
      style={{ transform, opacity: imgOpacity }}
    />
  );
}

/* ─── MAIN EPK ─── */

function EPK() {
  return (
    <div className="min-h-screen bg-black">
      <Nav />

      {/* ═══ HERO: Album Art Side by Side ═══ */}
      <section className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 fade-up">
            <div className="relative aspect-square overflow-hidden group">
              <Image
                src="/images/album-art/front-cover.png"
                alt="Burned Out! — Front Cover"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden group">
              <Image
                src="/images/album-art/back-cover.png"
                alt="Burned Out! — Back Cover"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TITLE BLOCK ═══ */}
      <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto text-center">
        <Reveal>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display uppercase leading-[0.85] tracking-tight glitch-text"
            data-text="BURNED OUT!"
          >
            BURNED OUT!
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase font-mono text-grey-mid">
            <span>THE KETAMINES</span>
            <span className="text-red">///</span>
            <span>LP</span>
            <span className="text-red">///</span>
            <span>10 TRACKS</span>
            <span className="text-red">///</span>
            <span>2026</span>
          </div>
        </Reveal>
      </section>

      <Divider />

      {/* ═══ MUSIC PLAYER ═══ */}
      <Reveal>
        <section id="music" className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8 text-center">
            Listen
          </h2>
          <AudioPlayer />
        </section>
      </Reveal>

      <Divider />

      {/* ═══ DISCOGRAPHY ═══ */}
      <Reveal>
        <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8 text-center">
            Discography
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {DISCOGRAPHY.map((album) => (
              <a
                key={album.title + album.year}
                href={album.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden border border-white/5 group-hover:border-red/50 transition-colors">
                  <Image
                    src={album.src}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-light leading-tight">{album.title}</div>
                  <div className="text-xs font-mono text-grey-mid">{album.year} &middot; {album.type}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ ABOUT ═══ */}
      <Reveal>
        <section id="about" className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8 text-center">
            About
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-center">
              <span className="text-red font-display text-3xl sm:text-4xl">Sorry what is this?</span>
            </p>

            <p className="text-base leading-relaxed text-offwhite/80">
              Burned Out! is the first new Ketamine LP in over a decade. Over the last six years, James Leroy and I have written and recorded around forty new songs, and of that batch, we think these are the 10 best, among the better songs we&rsquo;ve ever recorded. We initially wanted to return to our fuzz/psych roots that defined our best work, but we&rsquo;ve also remained firmly genre-agnostic, which can be confusing to some people who only listen to one thing. Genre is so boring; we&rsquo;ve always hated being lumped into one thing or another. But there are lots of genre-agnostic bands that are popular now, so maybe this is our moment. This new work shamelessly steals many ideas from the Canadian DIY underground we&rsquo;ve been involved with since James, and I released a split cassette in 1996: my side was as &ldquo;10% Gain,&rdquo; which was heavy Jawbreaker worship; his side was amazing skate-punk crap-core in the vein of FYP as &ldquo;NCL.&rdquo; Since then, we&rsquo;ve evolved, changed, and grown, and we are so excited to be back at it.
            </p>

            <p className="text-xs leading-relaxed text-offwhite/40 font-mono">
              Shout out to our comrades who we ruthlessly borrowed from here: Absolutely Free, Actual Water, AHNA, Aids Wolf, Apollo Ghosts, Atomic Don, Audacity, Aunty Panty, Average Times, B-Lines, B.A. Johnston, Babysitter, Bad Naked, The Ballantynes, Bare Wires, Barreracudas, The Beaten Hearts, Beliefs, The Beverlys, The Bicycles, Bidini Band, Bile Sister, The Blind Shake, The Bonaduces, Bonnie Doon, Brave Radar, Brazilian Money, Brews Willis, Bronx Cheerleader, The Browns, Burnt Ones, Caves, Cellphone, Century Palm, Chad VanGaalen, Chains of Love, Chico No Face, Cindy Lee, Concrete Hearts, Connosseurs of Porn, Cosmonauts, The Courtneys, Cousins, Cozy, Crocodile, Crosss, The Cry, The Cryptomaniacs, D&rsquo;Eon, Damo Suzuki, Dany Laj and The Looks, Darcy Spindle, Davila 666, The Dead Beat, Dead Ghosts, Dirty Beaches, Disasterbators, Dog Day, The Doozies, Dorothea Paas, Duchess Says, Dusted, Elevator, Elevator Through, Elevator to Hell, Ell V Gore, Elliot, Eric&rsquo;s Trip, Extra Happy Ghost!!!, The Famines, Far-Out Fangtooth, Favour, Feel Alright, Femme Accident, Femminielli, Feral Children, Fill Spectre, Fist City, Fleshmoves, The Florals, The Forever, The Forks, Freak Heat Waves, Freelove Fenner, The Fresh and Onlys, Fresh Snow, Friendo, Fungi Girls, Fuzzy Numbers, Gal Gracen, Gay, Gentleman Jesse and His Men, GOBBLE GOBBLE, Gold, The Gooeys, The Grand Pantrymen, Grave Babies, Growing Pains, Grown-Ups, Hag Face, Hank and Lilly, Haunted Souls, Heaven For Real, High Rise II, The Highest Order, Hobo Cubes, Homostupids, HSY, Human Eye, Hunters, I-Spy, Ian Manhire, J. Sherri, James Leroy and the Giant, The James Leroy Power Trio, Jay Holy, JAZZ, Jeans Boots, The Jeremy Clarkson, JFM, Jil Peace, JLK, John Jerome and The Congregation, Juan Wauters, Kappa Chow, King Cobb Steelie, King Tuff, Korean Gut, KRANG, Kris Ellestad, Lab Coast, Lantern, Legato Vipers, Lets Go, Long Long Long, Mac, Mac DeMarco, Man Legs, Man Made Hill, Manic Attracts, Mavo, Meat Curtains, Mexican Slang, Microdot, The Mitts, The Moby Dicks, Mode Moderne, Modern Nature, Monomyth, Moon, Moonwood, Mothers Children, The Mutators, The Myelin Sheaths, Mystics, Nap Eyes, Needlecraft, Needles//Pins, Nervous Talk, Noble Savages, Nu Sensae, The Numerators, The Nymphets, OBN III, Open Channels, The Ostrich, Ought, Outdoor Minors, Outtacontroller, P.S. I Love You, Painted Thin, Parquet Courts, Peace for Bombs, Peelander Z, Personal and the Pizza, Pink Noise, Pink Wine, Play Guitar, Pleasure Leftists, Pop Crimes, Porter Hall, Pow Wows, Pregnancy Scares, Preoccupations, Propagandhi, Protruders, Pryors, Quiet Loudly, Quilt, Radians, Red Fisher, Red Mass, Redd Kross, Renny Wilson, Rick White, Role Mach, The Sadies, Sam Coffey and the Iron Lungs, Scattered Clouds, Schoolteacher, The Sedatives, Sexy Merlin, Shadowy Men on a Shadowy Planet, Shannon and the Clams, Sharp Ends, Shearing Pinx, Sheer Agony, Shipyards, Shitty Neighbours, Shooting Guns, Shotgun Jimmie, The Shrapnelles, Silver Dapple, Simply Saucer, Skin Flowers, Slim Twig, Slime Street, Sonic Boom, The Soupcans, Stalwart Sons, Start Something, Steve Adamyk Band, Stolen Minks, Stoopid Idiots, Strange Attractor, Strange Boys, Stressed Out, Student Teacher, Sun Arraw, Taylor Knox Band, Teen Liver, Teenanger, Teledrome, Tess Parks, Thee Oh Sees, The Thrashers, Timecopz, Times New Viking, Tonetta, Tonstartssbandht, Topless Mongos, Tough Age, Ultimate Painting, Ultrathin, Uncle Bad Touch, Us Girls, The Valley Boys, Village, Voicemail, Warm Soda, Wax Mannequin, White Mystery, White Poppy, The White Wires, The Wicked Awesomes, WLMRT, The Wolf Note, Women, Woolworm, Wrong Hole, Wyrd Visions, X Ray Eyeballs, Yellow Teeth, Young Governor, Zacht Automaat, Zebrassieres
            </p>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xs tracking-[0.3em] uppercase font-mono text-red mb-4 text-center">Past Masters</h3>
              <p className="text-base leading-relaxed text-offwhite/80">
                Between 2011 and 2015, Ketamines released two full-length albums and six 7&rdquo; singles across eight independent labels in three countries, including HoZac Records (Chicago), Southpaw (Oakland), Mint Records (Vancouver), Pleasence Records (Toronto), and Hosehead Records.
              </p>
              <p className="text-base leading-relaxed text-offwhite/80 mt-4">
                <em>You Can&rsquo;t Serve Two Masters</em> (2013) was named to the Pop Matters best albums of the year, charted in the upper reaches of Canadian college radio for months, and drew praise from Pitchfork, Exclaim!, Weird Canada, and Discorder.
              </p>
              <p className="text-base leading-relaxed text-offwhite/80 mt-4">
                The band&rsquo;s live shows featured a deliberately rotating roster that eventually included over 100 musicians over the run, extracted from our friends in bands like Tough Age, Dirty Beaches, Century Palm, and Fist City. PK has also put out almost 100 releases on Mammoth Cave Recording Co. (2009&ndash;2015) and later Pleasence Records (2016&ndash;2023);
              </p>
            </div>

            {/* Labels */}
            <div className="pt-8 border-t border-white/10 text-center">
              <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-4">Label History</div>
              <div className="flex flex-wrap justify-center gap-2">
                {LABELS.map((label) => (
                  <span key={label} className="text-xs font-mono px-3 py-1 border border-white/10 text-offwhite/60 hover:text-white hover:border-white/30 transition-colors">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ PRESS ═══ */}
      <Reveal>
        <section id="press" className="py-12">
          <div className="px-4 sm:px-6 max-w-5xl mx-auto">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-4 text-center">Press</h2>
          </div>

          {/* Marquee */}
          <div className="overflow-hidden mb-8 border-y border-white/5 py-4">
            <div className="animate-marquee whitespace-nowrap flex gap-8">
              {["PITCHFORK", "EXCLAIM!", "POPMATTS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "VICE", "NOW MAGAZINE", "CBC MUSIC", "WEIRD CANADA", "SLED ISLAND", "HOZAC RECORDS",
                "PITCHFORK", "EXCLAIM!", "POPMATTS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "VICE", "NOW MAGAZINE", "CBC MUSIC", "WEIRD CANADA", "SLED ISLAND", "HOZAC RECORDS"
              ].map((name, i) => (
                <span key={i} className="text-2xl sm:text-4xl font-display uppercase text-white/10">{name}</span>
              ))}
            </div>
          </div>

          {/* Press quote grid */}
          <div className="px-4 sm:px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESS_QUOTES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="quote-card border border-white/5 p-6 flex flex-col justify-between"
              >
                <blockquote className="text-sm leading-relaxed font-light text-offwhite/80 mb-4">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <cite className="text-xs tracking-[0.15em] uppercase font-mono text-red not-italic">{item.source}</cite>
                  {item.rating && <span className="text-xs font-mono text-grey-mid border border-white/10 px-2 py-0.5">{item.rating}</span>}
                </div>
                {item.attribution && <div className="text-xs text-grey-mid mt-2 font-mono">&mdash; {item.attribution}</div>}
              </motion.div>
            ))}
          </div>

          {/* Oprah */}
          <Reveal className="mt-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative aspect-video overflow-hidden border border-white/10 group">
                <Image src="/images/press/oprah.jpg" alt="Ketamines capture Oprah's attention" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="672px" />
              </div>
              <p className="text-center text-xs tracking-[0.2em] uppercase font-mono text-grey-mid mt-4"></p>
            </div>
          </Reveal>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ VIDEOS ═══ */}
      <Reveal>
        <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8 text-center">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIDEOS.map((video) => (
              <div key={video.vimeoId} className="group">
                <div className="relative aspect-video overflow-hidden border border-white/10 group-hover:border-red/50 transition-colors bg-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&color=ff0000&title=0&byline=0&portrait=0`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute inset-0 w-full h-full"
                    title={video.title}
                  />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-light">{video.title}</div>
                  <div className="text-xs font-mono text-grey-mid">{video.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ PHOTOS (Parallax Scroll with Lightbox) ═══ */}
      <Reveal>
        <section id="photos" className="py-12 max-w-7xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8 text-center px-4">
            Photos
          </h2>
          <ParallaxScrollSecond images={ALL_PHOTOS} />
        </section>
      </Reveal>

      <Divider />

      {/* ═══ CONTACT ═══ */}
      <Reveal>
        <section id="contact" className="px-4 sm:px-6 py-16 max-w-3xl mx-auto text-center">
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">Contact</h2>

          {/* Black metal logo centred */}
          <div className="relative w-full max-w-lg mx-auto h-32 sm:h-48 mb-12 opacity-80">
            <Image src="/images/logos/black-metal-logo.png" alt="Ketamines" fill className="object-contain invert" />
          </div>

          <div className="space-y-4">
            <a href="mailto:pklawton@gmail.com" className="block text-lg font-mono text-red hover:text-white transition-colors">
              pklawton@gmail.com
            </a>
            <a href="tel:+16472412575" className="block text-lg font-mono text-offwhite/50 hover:text-white transition-colors">
              647.241.2575
            </a>
            <a
              href="https://theketamines.bandcamp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-xs tracking-[0.3em] uppercase font-mono border border-white/20 hover:border-red hover:text-red px-8 py-3 transition-all duration-300"
            >
              theketamines.bandcamp.com
            </a>
          </div>
        </section>
      </Reveal>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-grey-mid tracking-[0.1em]">THE KETAMINES &copy; {new Date().getFullYear()}</div>
          <div className="text-xs font-mono text-white/10 tracking-[0.1em]">THIS EPK IS CONFIDENTIAL</div>
          <div className="relative w-24 h-6 opacity-30">
            <Image src="/images/logos/secondary-logo.jpg" alt="The Ketamines" fill className="object-contain invert" />
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── PAGE ROOT ─── */

export default function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("ketamines-epk-unlocked");
      if (saved === "true") setUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setEntering(true);
    sessionStorage.setItem("ketamines-epk-unlocked", "true");
    setTimeout(() => setUnlocked(true), 600);
  };

  if (!unlocked) {
    return (
      <div className={entering ? "transition-opacity duration-500 opacity-0" : ""}>
        <PasswordGate onUnlock={handleUnlock} />
      </div>
    );
  }

  return <EPK />;
}
