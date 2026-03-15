"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ─── IMAGE MANIFESTS (edit these to add/remove photos) ─── */

const LIVE_PHOTOS = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/live/live-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `The Ketamines live ${i + 1}`,
}));

const PRESS_PHOTOS = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/press/press-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `The Ketamines press ${i + 1}`,
}));

/* ─── PRESS QUOTES ─── */

const PRESS_QUOTES = [
  {
    quote:
      "Full of succinct, pop-influenced garage-psych, You Can't Serve Two Masters moves quickly and goes for the gut with great results.",
    source: "PopMatts",
    rating: "7/10",
  },
  {
    quote:
      "There's something that thrills me when people get away with these completely ludicrous, dumb, nursery-rhyme riffs, and I've always been jealous of them.",
    source: "Consequence of Sound",
    attribution: "Jarrett Samson (Tough Age)",
  },
  {
    quote:
      "Ketamines threw down a monster set of ultra-catchy and inventive garage rock that had the main stage writhing and shimmying.",
    source: "Exclaim!",
  },
  {
    quote:
      "Canada's Ketamines shed many of the garage rock pretenses and go the quirky power pop route. It's a deft move and shows you what a brilliant band the Ketamines are.",
    source: "The Finest Kiss",
  },
  {
    quote:
      "The word ketamine refers to two things: one is the name of an anesthetic substance famous for being a recreational sedative. The other refers to a five-piece acid-wash pop band. Both are highly addictive.",
    source: "CiTR Discorder",
  },
  {
    quote:
      "Surfy, reverby, drugged-up freak pop. Mixing it up with different instruments and multiple vocalists, it's got a very free-form feel.",
    source: "Razorcake",
  },
];

/* ─── TRACKLIST ─── */

const TRACKLIST = [
  { side: "A", tracks: ["I Want Some Blood", "The Salaryman Vanishes", "Same Old Story", "Guarding the Beast", "You Are Not Real"] },
  { side: "B", tracks: ["Donchu Know?", "Automatic", "You Fell For It", "Started Seeing", "Do The Ideology"] },
];

/* ─── LABELS ─── */

const LABELS = [
  "HoZac Records (Chicago)",
  "Odd Box Records (UK)",
  "Mammoth Cave Recording Co. (Toronto)",
  "Southpaw Records (US)",
  "Pleasence Records (Toronto)",
  "Hosehead Records (Toronto)",
  "Leaning Trees Records (Saskatoon)",
  "Mint Records (Vancouver)",
];

/* ─── PASSWORD GATE ─── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      {/* Animated grain background */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className={`relative flex flex-col items-center gap-10 ${shake ? "animate-[shake_0.6s_ease-in-out]" : ""}`}
        style={{ animation: shake ? "shake 0.6s ease-in-out" : undefined }}>
        {/* Main Logo */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 fade-up invert">
          <Image
            src="/images/logos/main-logo.jpg"
            alt="The Ketamines"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 fade-up-delay-1">
          <label className="text-xs tracking-[0.3em] uppercase text-grey-mid font-mono">
            Enter Password
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="bg-transparent border-b-2 border-white/30 focus:border-white text-white text-center text-2xl tracking-[0.2em] font-mono py-2 px-6 w-64 outline-none transition-colors duration-300 placeholder:text-white/10"
              placeholder="_ _ _ _ _"
              autoComplete="off"
            />
          </div>
          {error && (
            <p className="text-red text-xs tracking-[0.2em] uppercase font-mono animate-pulse">
              Wrong password
            </p>
          )}
          <button
            type="submit"
            className="mt-2 text-xs tracking-[0.3em] uppercase text-grey-mid hover:text-white transition-colors duration-300 font-mono"
          >
            [ Enter ]
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
      `}</style>
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── MAIN EPK ─── */

function EPK() {
  return (
    <div className="min-h-screen bg-black">
      <Nav />

      {/* ═══ HERO: ALBUM ART ═══ */}
      <section className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Album Art Side by Side */}
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

          {/* Title Block */}
          <div className="mt-8 md:mt-12 fade-up-delay-1">
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display uppercase leading-[0.85] tracking-tight glitch-text"
              data-text="BURNED OUT!"
            >
              BURNED OUT!
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs tracking-[0.2em] uppercase font-mono text-grey-mid">
              <span>THE KETAMINES</span>
              <span className="text-red">///</span>
              <span>LP</span>
              <span className="text-red">///</span>
              <span>10 TRACKS</span>
              <span className="text-red">///</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRACKLIST ═══ */}
      <Reveal>
        <section className="px-4 sm:px-6 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {TRACKLIST.map((side) => (
              <div key={side.side}>
                <h3 className="text-xs tracking-[0.3em] uppercase font-mono text-red mb-4">
                  Side {side.side}
                </h3>
                <ol className="space-y-2">
                  {side.tracks.map((track, i) => (
                    <li key={track} className="flex items-baseline gap-4 group">
                      <span className="text-xs font-mono text-grey-mid w-6 shrink-0">
                        {String(side.side === "A" ? i + 1 : i + 6).padStart(2, "0")}
                      </span>
                      <span className="text-lg sm:text-xl font-light tracking-wide group-hover:text-red transition-colors duration-300">
                        {track}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ MUSIC PLAYER ═══ */}
      <Reveal>
        <section id="music" className="px-4 sm:px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">
              Listen
            </h2>
            {/* Bandcamp Embed */}
            <div className="bg-grey/50 border border-white/5 p-4 sm:p-6">
              <iframe
                style={{ border: 0, width: "100%", height: "472px" }}
                src="https://bandcamp.com/EmbeddedPlayer/album=1721037270/size=large/bgcol=000000/linkcol=ff0000/artwork=small/transparent=true/"
                seamless
                title="Burned Out! by The Ketamines on Bandcamp"
              />
              <div className="mt-4 flex flex-wrap gap-4">
                <a
                  href="https://theketamines.bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-mono text-grey-mid hover:text-white transition-colors border border-white/10 hover:border-white/30 px-4 py-2"
                >
                  Bandcamp
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ ABOUT ═══ */}
      <Reveal>
        <section id="about" className="px-4 sm:px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">
              About
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
              <div className="lg:col-span-3 space-y-6">
                <p className="text-lg sm:text-xl leading-relaxed font-light">
                  <span className="text-red font-display text-2xl sm:text-3xl">Burned Out!</span> is the first new
                  Ketamines LP in over a decade. Over the last six years, James Leroy and PK Lawton have
                  written and recorded around forty new songs&mdash;these are the 10 best, among the better
                  songs they&rsquo;ve ever recorded.
                </p>
                <p className="text-base leading-relaxed text-offwhite/70">
                  They initially wanted to return to the fuzz/psych roots that defined their best work,
                  but they&rsquo;ve also remained firmly genre-agnostic, which can be confusing to some
                  people who only listen to one thing. Genre is so boring; they&rsquo;ve always hated being
                  lumped into one thing or another. This new work shamelessly steals many ideas from the
                  Canadian DIY underground they&rsquo;ve been involved with since James and PK released a split
                  cassette in 1996.
                </p>
                <p className="text-base leading-relaxed text-offwhite/70">
                  Between 2011 and 2015, Ketamines released two full-length albums and six 7&rdquo; singles
                  across eight independent labels in three countries, including HoZac Records (Chicago),
                  Southpaw (Oakland), Mint Records (Vancouver), Pleasence Records (Toronto), and Hosehead Records.
                </p>
                <p className="text-base leading-relaxed text-offwhite/70">
                  <em>You Can&rsquo;t Serve Two Masters</em> (2013) was named to the PopMatts best albums of the
                  year, charted in the upper reaches of Canadian college radio for months, and drew praise
                  from Pitchfork, Exclaim!, Weird Canada, and Discorder.
                </p>
                <p className="text-base leading-relaxed text-offwhite/70">
                  The band&rsquo;s live shows featured a deliberately rotating roster that eventually included
                  over 100 musicians, extracted from friends in bands like Tough Age, Dirty Beaches,
                  Century Palm, and Fist City. Lawton simultaneously co-ran Mammoth Cave Recording Co.
                  (50+ releases) and later Pleasence Records, with a combined 100+ releases by Canadian artists.
                </p>
              </div>

              {/* Sidebar Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-white/10 p-6 space-y-6">
                  <div>
                    <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-2">Members</div>
                    <div className="text-lg">James Leroy &amp; PK Lawton</div>
                    <div className="text-sm text-offwhite/50 mt-1">+ 100+ rotating live musicians</div>
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-2">Origin</div>
                    <div className="text-lg">Calgary / Toronto, Canada</div>
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-2">Active</div>
                    <div className="text-lg">2010&ndash;2015, 2019&ndash;Present</div>
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-2">Shows</div>
                    <div className="text-3xl font-display">128+</div>
                    <div className="text-sm text-offwhite/50 mt-1">across North America</div>
                  </div>
                </div>

                {/* Labels */}
                <div className="border border-white/10 p-6">
                  <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-4">
                    Label History
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LABELS.map((label) => (
                      <span
                        key={label}
                        className="text-xs font-mono px-3 py-1 border border-white/10 text-offwhite/60 hover:text-white hover:border-white/30 transition-colors"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ PRESS ═══ */}
      <Reveal>
        <section id="press" className="px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">
              Press
            </h2>

            {/* Marquee banner */}
            <div className="overflow-hidden mb-12 border-y border-white/5 py-4">
              <div className="animate-marquee whitespace-nowrap flex gap-8">
                {["PITCHFORK", "EXCLAIM!", "POPMATTS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "VICE", "NOW MAGAZINE", "CBC MUSIC", "WEIRD CANADA",
                  "PITCHFORK", "EXCLAIM!", "POPMATTS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "VICE", "NOW MAGAZINE", "CBC MUSIC", "WEIRD CANADA"
                ].map((name, i) => (
                  <span key={i} className="text-2xl sm:text-4xl font-display uppercase text-white/10">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRESS_QUOTES.map((item, i) => (
                <div key={i} className="quote-card border border-white/5 p-6 flex flex-col justify-between">
                  <blockquote className="text-base leading-relaxed font-light text-offwhite/80 mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <cite className="text-xs tracking-[0.15em] uppercase font-mono text-red not-italic">
                      {item.source}
                    </cite>
                    {item.rating && (
                      <span className="text-xs font-mono text-grey-mid border border-white/10 px-2 py-0.5">
                        {item.rating}
                      </span>
                    )}
                  </div>
                  {item.attribution && (
                    <div className="text-xs text-grey-mid mt-2 font-mono">&mdash; {item.attribution}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Oprah clipping */}
            <Reveal className="mt-12">
              <div className="max-w-2xl mx-auto">
                <div className="relative aspect-video overflow-hidden border border-white/10 group">
                  <Image
                    src="/images/press/oprah.jpg"
                    alt="Ketamines capture Oprah's attention — newspaper clipping"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>
                <p className="text-center text-xs tracking-[0.2em] uppercase font-mono text-grey-mid mt-4">
                  Yes, that Oprah.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ PHOTOS ═══ */}
      <Reveal>
        <section id="photos" className="py-12">
          <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-8">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid">
              Photos
            </h2>
          </div>

          {/* Live Photos — Horizontal scroll strip */}
          <div className="px-4 sm:px-6 mb-4">
            <span className="text-xs tracking-[0.2em] uppercase font-mono text-red">Live</span>
          </div>
          <div className="photo-strip px-4 sm:px-6 mb-12">
            {LIVE_PHOTOS.map((photo, i) => (
              <div key={i} className="relative w-72 sm:w-96 aspect-[3/2] overflow-hidden group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  sizes="384px"
                />
              </div>
            ))}
          </div>

          {/* Press Photos — Grid */}
          <div className="px-4 sm:px-6 mb-4">
            <span className="text-xs tracking-[0.2em] uppercase font-mono text-red">Press</span>
          </div>
          <div className="px-4 sm:px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESS_PHOTOS.map((photo, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

          {/* Discography art */}
          <Reveal className="mt-12 px-4 sm:px-6 max-w-5xl mx-auto">
            <div className="relative w-full aspect-[3/1] overflow-hidden">
              <Image
                src="/images/album-art/discography.jpg"
                alt="Ketamines discography"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <p className="text-center text-xs tracking-[0.2em] uppercase font-mono text-grey-mid mt-4">
              Complete discography artwork
            </p>
          </Reveal>
        </section>
      </Reveal>

      <Divider />

      {/* ═══ CONTACT ═══ */}
      <Reveal>
        <section id="contact" className="px-4 sm:px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">
              Contact
            </h2>

            {/* Black metal logo as section art */}
            <div className="relative w-full max-w-lg mx-auto h-32 sm:h-48 mb-12 opacity-80">
              <Image
                src="/images/logos/black-metal-logo.png"
                alt="Ketamines — Black Metal Logo"
                fill
                className="object-contain invert"
              />
            </div>

            <div className="space-y-4">
              <div className="text-2xl sm:text-3xl font-display uppercase">PK Lawton</div>
              <a
                href="mailto:pklawton@gmail.com"
                className="block text-lg font-mono text-red hover:text-white transition-colors"
              >
                pklawton@gmail.com
              </a>
              <a
                href="tel:+16472412575"
                className="block text-lg font-mono text-offwhite/50 hover:text-white transition-colors"
              >
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
          </div>
        </section>
      </Reveal>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-grey-mid tracking-[0.1em]">
            THE KETAMINES &copy; {new Date().getFullYear()}
          </div>
          <div className="text-xs font-mono text-white/10 tracking-[0.1em]">
            THIS EPK IS CONFIDENTIAL
          </div>
          <div className="flex gap-4">
            {/* Secondary logo small */}
            <div className="relative w-24 h-6 opacity-30">
              <Image
                src="/images/logos/secondary-logo.jpg"
                alt="The Ketamines"
                fill
                className="object-contain invert"
              />
            </div>
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
