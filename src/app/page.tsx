"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, ExternalLink } from "lucide-react";
import { ParallaxScrollSecond } from "@/components/ui/parallax-scroll";

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

/* ─── DISCOGRAPHY (back catalog only — matches Bandcamp) ─── */

const DISCOGRAPHY = [
  { title: "You Can\u2019t Serve Two Masters", year: "2013", src: "/images/album-art/ycsm.jpg", link: "https://theketamines.bandcamp.com", type: "LP", label: "Mammoth Cave" },
  { title: "Spaced Out", year: "2012", src: "/images/album-art/spaced-out.jpg", link: "https://theketamines.bandcamp.com", type: "LP", label: "Southpaw" },
  { title: "Line By Line", year: "2011", src: "/images/album-art/hozac.jpg", link: "https://theketamines.bandcamp.com", type: "7\"", label: "HoZac" },
  { title: "All The Colours Of Your Heart", year: "2013", src: "/images/album-art/colours.jpg", link: "https://theketamines.bandcamp.com", type: "7\"", label: "Pleasence" },
  { title: "Eleven Eleven EP", year: "2014", src: "/images/album-art/eleven-eleven.jpg", link: "https://theketamines.bandcamp.com", type: "7\" EP", label: "Hosehead" },
  { title: "A Rotten Bond", year: "2012", src: "/images/album-art/rotten-bond.jpg", link: "https://theketamines.bandcamp.com", type: "7\"", label: "HoZac" },
  { title: "So Hot!", year: "2013", src: "/images/album-art/so-hot.jpg", link: "https://theketamines.bandcamp.com", type: "7\"", label: "Odd Box" },
  { title: "Stay Awake", year: "2014", src: "/images/album-art/stay-awake.jpg", link: "https://theketamines.bandcamp.com", type: "7\"", label: "Pleasence" },
];

/* ─── PRESS QUOTES (one per outlet) ─── */

const PRESS_QUOTES = [
  {
    quote: "The best sell for Spaced Out comes from their palpable excitement to be making this music. \u201CEvil Intentions\u201D begins with the copied-and-pasted opening strains of Steppenwolf\u2019s \u201CMagic Carpet Ride.\u201D It\u2019s surprising that the song goes on to impress, since just the hint of that overplayed, infectious melody is a tough act to follow. They pull it off because behind their eccentric tendencies and hallucinogenic moniker, these guys build solid song structures: verse, chorus, and bridge, all strung together by solid hooks.",
    source: "Pitchfork",
  },
  {
    quote: "You Can\u2019t Serve Two Masters is one of the better psych listens of the year; its ability to surprise is so engaging that it reminds us never to judge a book by its cover.",
    source: "PopMatters",
    rating: "7/10",
  },
  {
    quote: "There\u2019s something that thrills me when people get away with these completely ludicrous, dumb, nursery-rhyme riffs, and I\u2019ve always been jealous of them.",
    source: "Consequence of Sound",
    attribution: "Jarrett Samson (Tough Age)",
  },
  {
    quote: "Ketamines threw down a monster set of ultra-catchy and inventive garage rock that had the main stage writhing and shimmying.",
    source: "Exclaim!",
  },
  {
    quote: "Canada\u2019s Ketamines shed many of the garage rock pretenses and go the quirky power pop route. It\u2019s a deft move and shows you what a brilliant band the Ketamines are.",
    source: "The Finest Kiss",
  },
  {
    quote: "The word ketamine refers to two things: one is the name of an anesthetic substance famous for being a recreational sedative. The other refers to a five-piece acid-wash pop band. Both are highly addictive.",
    source: "CiTR Discorder",
  },
  {
    quote: "Surfy, reverby, drugged-up freak pop. Mixing it up with different instruments and multiple vocalists, it\u2019s got a very free-form feel.",
    source: "Razorcake",
  },
  {
    quote: "Side B\u2019s \u2018Turning You On\u2019\u2019s a teen monster movie throb, the one where the zombie rises off the floor and tries to grab some flesh before getting bounced out of the party.",
    source: "Weird Canada",
  },
  {
    quote: "Their two new 7-inch singles diverge from the scrappy psych punk and power pop of their recent LP. All The Colours Of Your Heart is oddly funky in a psychedelic garage way.",
    source: "NOW Magazine",
  },
  {
    quote: "You Can\u2019t Serve Two Masters has the effect of a shaken up can of pop that has burst and has been left out in the sun too long. It is sticky, gritty and catchy as hell.",
    source: "Revolution Rock / CJAM 99.1",
  },
  {
    quote: "They still harness the hazy, confident stride of the dazed legends that came before them, and their psychedelic pop should carry them straight into the arms of today\u2019s most jaded with ease.",
    source: "HoZac Records",
  },
  {
    quote: "Ketamines (Toronto, ON) \u2014 They just released a super memorable slab of oh-so-catchy garage pop and essentially have an open invitation to play Sled Island 2013 anytime they want.",
    source: "Sled Island Festival",
  },
];

/* ─── COMRADES LIST ─── */

const COMRADES = "Absolutely Free, Actual Water, AHNA, Aids Wolf, Apollo Ghosts, Atomic Don, Audacity, Aunty Panty, Average Times, B-Lines, B.A. Johnston, Babysitter, Bad Naked, The Ballantynes, Bare Wires, Barreracudas, The Beaten Hearts, Beliefs, The Beverlys, The Bicycles, Bidini Band, Bile Sister, The Blind Shake, The Bonaduces, Bonnie Doon, Brave Radar, Brazilian Money, Brews Willis, Bronx Cheerleader, The Browns, Burnt Ones, Caves, Cellphone, Century Palm, Chad VanGaalen, Chains of Love, Chico No Face, Cindy Lee, Concrete Hearts, Connosseurs of Porn, Cosmonauts, The Courtneys, Cousins, Cozy, Crocodile, Crosss, The Cry, The Cryptomaniacs, D\u2019Eon, Damo Suzuki, Dany Laj and The Looks, Darcy Spindle, Davila 666, The Dead Beat, Dead Ghosts, Dirty Beaches, Disasterbators, Dog Day, The Doozies, Dorothea Paas, Duchess Says, Dusted, Elevator, Elevator Through, Elevator to Hell, Ell V Gore, Elliot, Eric\u2019s Trip, Extra Happy Ghost!!!, The Famines, Far-Out Fangtooth, Favour, Feel Alright, Femme Accident, Femminielli, Feral Children, Fill Spectre, Fist City, Fleshmoves, The Florals, The Forever, The Forks, Freak Heat Waves, Freelove Fenner, The Fresh and Onlys, Fresh Snow, Friendo, Fungi Girls, Fuzzy Numbers, Gal Gracen, Gay, Gentleman Jesse and His Men, GOBBLE GOBBLE, Gold, The Gooeys, The Grand Pantrymen, Grave Babies, Growing Pains, Grown-Ups, Hag Face, Hank and Lilly, Haunted Souls, Heaven For Real, High Rise II, The Highest Order, Hobo Cubes, Homostupids, HSY, Human Eye, Hunters, I-Spy, Ian Manhire, J. Sherri, James Leroy and the Giant, The James Leroy Power Trio, Jay Holy, JAZZ, Jeans Boots, The Jeremy Clarkson, JFM, Jil Peace, JLK, John Jerome and The Congregation, Juan Wauters, Kappa Chow, King Cobb Steelie, King Tuff, Korean Gut, KRANG, Kris Ellestad, Lab Coast, Lantern, Legato Vipers, Lets Go, Long Long Long, Mac, Mac DeMarco, Man Legs, Man Made Hill, Manic Attracts, Mavo, Meat Curtains, Mexican Slang, Microdot, The Mitts, The Moby Dicks, Mode Moderne, Modern Nature, Monomyth, Moon, Moonwood, Mothers Children, The Mutators, The Myelin Sheaths, Mystics, Nap Eyes, Needlecraft, Needles//Pins, Nervous Talk, Noble Savages, Nu Sensae, The Numerators, The Nymphets, OBN III, Open Channels, The Ostrich, Ought, Outdoor Minors, Outtacontroller, P.S. I Love You, Painted Thin, Parquet Courts, Peace for Bombs, Peelander Z, Personal and the Pizza, Pink Noise, Pink Wine, Play Guitar, Pleasure Leftists, Pop Crimes, Porter Hall, Pow Wows, Pregnancy Scares, Preoccupations, Propagandhi, Protruders, Pryors, Quiet Loudly, Quilt, Radians, Red Fisher, Red Mass, Redd Kross, Renny Wilson, Rick White, Role Mach, The Sadies, Sam Coffey and the Iron Lungs, Scattered Clouds, Schoolteacher, The Sedatives, Sexy Merlin, Shadowy Men on a Shadowy Planet, Shannon and the Clams, Sharp Ends, Shearing Pinx, Sheer Agony, Shipyards, Shitty Neighbours, Shooting Guns, Shotgun Jimmie, The Shrapnelles, Silver Dapple, Simply Saucer, Skin Flowers, Slim Twig, Slime Street, Sonic Boom, The Soupcans, Stalwart Sons, Start Something, Steve Adamyk Band, Stolen Minks, Stoopid Idiots, Strange Attractor, Strange Boys, Stressed Out, Student Teacher, Sun Arraw, Taylor Knox Band, Teen Liver, Teenanger, Teledrome, Tess Parks, Thee Oh Sees, The Thrashers, Timecopz, Times New Viking, Tonetta, Tonstartssbandht, Topless Mongos, Tough Age, Ultimate Painting, Ultrathin, Uncle Bad Touch, Us Girls, The Valley Boys, Village, Voicemail, Warm Soda, Wax Mannequin, White Mystery, White Poppy, The White Wires, The Wicked Awesomes, WLMRT, The Wolf Note, Women, Woolworm, Wrong Hole, Wyrd Visions, X Ray Eyeballs, Yellow Teeth, Young Governor, Zacht Automaat, Zebrassieres".split(", ");

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
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    setIsPlaying(!isPlaying);
  };

  const prev = () => setCurrentTrack((t) => Math.max(0, t - 1));
  const next = () => setCurrentTrack((t) => Math.min(TRACKS.length - 1, t + 1));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="border border-white/10 bg-black/80 backdrop-blur-sm">
      <audio ref={audioRef} preload="metadata" />
      <div className="max-h-[420px] overflow-y-auto">
        {(["A", "B"] as const).map((side) => (
          <div key={side}>
            <div className="px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-mono text-red border-b border-white/5">
              Side {side}
            </div>
            {TRACKS.filter((t) => t.side === side).map((track) => {
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

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-offwhite/80 truncate max-w-[60%]">
            {TRACKS[currentTrack].num}. {TRACKS[currentTrack].title}
          </span>
          <span className="text-xs font-mono text-grey-mid">
            {fmt(progress)} / {fmt(duration)}
          </span>
        </div>
        <div className="w-full h-1 bg-white/10 cursor-pointer mb-3 group" onClick={seek}>
          <div className="h-full bg-red transition-all duration-100 group-hover:bg-white" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
        </div>
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

/* ─── DIVIDER ─── */

function Divider() {
  return (
    <div className="w-full max-w-5xl mx-auto flex items-center gap-4 py-10 px-6">
      <div className="flex-1 h-px bg-white/10" />
      <div className="w-1.5 h-1.5 bg-red rotate-45" />
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
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="relative w-10 h-10 invert opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/images/logos/main-logo.jpg" alt="K" fill className="object-contain" />
        </div>
        <div className="flex gap-6 text-[10px] tracking-[0.2em] uppercase font-mono text-grey-mid">
          {[
            ["#music", "Music"],
            ["#about", "About"],
            ["#press", "Press"],
            ["#videos", "Videos"],
            ["#photos", "Photos"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── SCROLL REVEAL ─── */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── SCROLLING COMRADES MARQUEE ─── */

function ComradesMarquee() {
  // Split into 4 rows, each scrolling in alternating directions
  const rows = useMemo(() => {
    const perRow = Math.ceil(COMRADES.length / 4);
    return [
      COMRADES.slice(0, perRow),
      COMRADES.slice(perRow, perRow * 2),
      COMRADES.slice(perRow * 2, perRow * 3),
      COMRADES.slice(perRow * 3),
    ];
  }, []);

  return (
    <div className="overflow-hidden space-y-1 py-6">
      {rows.map((row, i) => (
        <div key={i} className="relative overflow-hidden whitespace-nowrap">
          <div
            className={i % 2 === 0 ? "animate-marquee-slow" : "animate-marquee-slow-reverse"}
            style={{ animationDuration: `${60 + i * 15}s` }}
          >
            {[...row, ...row].map((name, j) => (
              <span key={`${name}-${j}`} className="inline-block text-[11px] font-mono text-offwhite/25 hover:text-red transition-colors duration-200 mx-2">
                {name}
                {j < row.length * 2 - 1 && <span className="text-white/10 ml-2">&bull;</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN EPK ─── */

function EPK() {
  return (
    <div className="min-h-screen bg-black">
      <Nav />

      {/* ═══ HERO: MASSIVE ALBUM ART ═══ */}
      <section className="pt-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/album-art/front-cover.png"
                alt="Burned Out! — Front Cover"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/album-art/back-cover.png"
                alt="Burned Out! — Back Cover"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Title strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-[0.25em] uppercase font-mono text-grey-mid"
          >
            <span className="text-white">THE KETAMINES</span>
            <span className="text-red">/</span>
            <span>BURNED OUT!</span>
            <span className="text-red">/</span>
            <span>LP</span>
            <span className="text-red">/</span>
            <span>10 TRACKS</span>
            <span className="text-red">/</span>
            <span>2026</span>
          </motion.div>
        </div>
      </section>

      {/* ═══ PLAYER (no header — immediately listenable) ═══ */}
      <section id="music" className="px-4 sm:px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <AudioPlayer />
        </motion.div>
      </section>

      <Divider />

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-10 text-center">About</h2>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          {/* Hero quote */}
          <Reveal>
            <p className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.1] text-center text-red mb-12">
              Sorry what is this?
            </p>
          </Reveal>

          {/* Bio — broken into digestible blocks */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-7 space-y-6">
              <Reveal>
                <p className="text-base sm:text-lg leading-relaxed text-offwhite/80">
                  Burned Out! is the first new Ketamine LP in over a decade. Over the last six years, James Leroy and I have written and recorded around forty new songs, and of that batch, we think these are the 10 best, among the better songs we&rsquo;ve ever recorded.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-base sm:text-lg leading-relaxed text-offwhite/80">
                  We initially wanted to return to our fuzz/psych roots that defined our best work, but we&rsquo;ve also remained firmly genre-agnostic, which can be confusing to some people who only listen to one thing. Genre is so boring; we&rsquo;ve always hated being lumped into one thing or another. But there are lots of genre-agnostic bands that are popular now, so maybe this is our moment.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-base sm:text-lg leading-relaxed text-offwhite/80">
                  This new work shamelessly steals many ideas from the Canadian DIY underground we&rsquo;ve been involved with since James and I released a split cassette in 1996: my side was as &ldquo;10% Gain,&rdquo; which was heavy Jawbreaker worship; his side was amazing skate-punk crap-core in the vein of FYP as &ldquo;NCL.&rdquo; Since then, we&rsquo;ve evolved, changed, and grown, and we are so excited to be back at it.
                </p>
              </Reveal>
            </div>

            {/* Sidebar stats */}
            <div className="md:col-span-5 space-y-6">
              <Reveal delay={0.15}>
                <div className="border border-white/10 p-6 space-y-4">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-red mb-4">Past Masters</div>
                  <p className="text-sm leading-relaxed text-offwhite/70">
                    Between 2011 and 2015, Ketamines released two full-length albums and six 7&rdquo; singles across eight independent labels in three countries.
                  </p>
                  <p className="text-sm leading-relaxed text-offwhite/70">
                    <em className="text-offwhite/90">You Can&rsquo;t Serve Two Masters</em> (2013) was named to the PopMatters best albums of the year, charted in the upper reaches of Canadian college radio for months, and drew praise from Pitchfork, Exclaim!, Weird Canada, and Discorder.
                  </p>
                  <p className="text-sm leading-relaxed text-offwhite/70">
                    The band&rsquo;s live shows featured a deliberately rotating roster that eventually included over 100 musicians over the run, extracted from our friends in bands like Tough Age, Dirty Beaches, Century Palm, and Fist City.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="border border-white/10 p-6">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-grey-mid mb-3">Label History</div>
                  <div className="flex flex-wrap gap-1.5">
                    {LABELS.map((label) => (
                      <span key={label} className="text-[10px] font-mono px-2 py-1 border border-white/10 text-offwhite/50 hover:text-white hover:border-white/30 transition-colors">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Comrades — dynamic scrolling marquee */}
          <Reveal className="mt-12">
            <div className="border-t border-b border-white/5">
              <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-grey-mid text-center pt-6 pb-2">
                Comrades we ruthlessly borrowed from
              </div>
              <ComradesMarquee />
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ═══ DISCOGRAPHY ═══ */}
      <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-10 text-center">Discography</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {DISCOGRAPHY.map((album, i) => (
            <Reveal key={album.title} delay={i * 0.05}>
              <a
                href={album.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden border border-white/5 group-hover:border-red/50 transition-all duration-300">
                  <Image
                    src={album.src}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-light leading-tight group-hover:text-red transition-colors">{album.title}</div>
                  <div className="text-[10px] font-mono text-grey-mid mt-0.5">{album.year} &middot; {album.type} &middot; {album.label}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══ PRESS ═══ */}
      <section id="press" className="py-8">
        <Reveal>
          <div className="px-4 sm:px-6 max-w-6xl mx-auto">
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-4 text-center">Press</h2>
          </div>
        </Reveal>

        {/* Outlet marquee */}
        <div className="overflow-hidden mb-10 border-y border-white/5 py-4">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {["PITCHFORK", "EXCLAIM!", "POPMATTERS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "NOW MAGAZINE", "WEIRD CANADA", "SLED ISLAND", "HOZAC RECORDS", "CiTR DISCORDER", "THE FINEST KISS", "REVOLUTION ROCK",
              "PITCHFORK", "EXCLAIM!", "POPMATTERS", "CONSEQUENCE OF SOUND", "RAZORCAKE", "NOW MAGAZINE", "WEIRD CANADA", "SLED ISLAND", "HOZAC RECORDS", "CiTR DISCORDER", "THE FINEST KISS", "REVOLUTION ROCK"
            ].map((name, i) => (
              <span key={i} className="text-3xl sm:text-5xl font-display uppercase text-white/8">{name}</span>
            ))}
          </div>
        </div>

        {/* Pitchfork feature quote (hero treatment) */}
        <Reveal className="px-4 sm:px-6 max-w-4xl mx-auto mb-12">
          <div className="border-l-2 border-red pl-6 py-2">
            <blockquote className="text-lg sm:text-xl leading-relaxed font-light text-offwhite/90 italic">
              &ldquo;{PRESS_QUOTES[0].quote}&rdquo;
            </blockquote>
            <cite className="block mt-4 text-xs tracking-[0.2em] uppercase font-mono text-red not-italic">
              {PRESS_QUOTES[0].source}
            </cite>
          </div>
        </Reveal>

        {/* Remaining quotes in grid */}
        <div className="px-4 sm:px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESS_QUOTES.slice(1).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              viewport={{ once: true }}
              className="quote-card border border-white/5 p-6 flex flex-col justify-between"
            >
              <blockquote className="text-sm leading-relaxed font-light text-offwhite/75 mb-4">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <cite className="text-[10px] tracking-[0.15em] uppercase font-mono text-red not-italic">{item.source}</cite>
                {item.rating && <span className="text-[10px] font-mono text-grey-mid border border-white/10 px-2 py-0.5">{item.rating}</span>}
              </div>
              {item.attribution && <div className="text-[10px] text-grey-mid mt-2 font-mono">&mdash; {item.attribution}</div>}
            </motion.div>
          ))}
        </div>

        {/* Oprah image */}
        <Reveal className="mt-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative aspect-video overflow-hidden border border-white/10">
              <Image src="/images/press/oprah.jpg" alt="Ketamines capture Oprah's attention" fill className="object-cover" sizes="672px" />
            </div>
          </div>
        </Reveal>
      </section>

      <Divider />

      {/* ═══ VIDEOS ═══ */}
      <section id="videos" className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-10 text-center">Videos</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS.map((video, i) => (
            <Reveal key={video.vimeoId} delay={i * 0.1}>
              <div className="group">
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
                  <div className="text-[10px] font-mono text-grey-mid">{video.subtitle}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══ PHOTOS ═══ */}
      <section id="photos" className="py-8">
        <Reveal>
          <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-10 text-center px-4">Photos</h2>
        </Reveal>
        <div className="max-w-7xl mx-auto">
          <ParallaxScrollSecond images={ALL_PHOTOS} />
        </div>
      </section>

      <Divider />

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-10">Contact</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-md aspect-[2.5/1]">
                <Image src="/images/logos/black-metal-logo.png" alt="Ketamines" fill className="object-contain invert" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
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
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-mono text-grey-mid tracking-[0.15em] uppercase">Ketamines &copy; 2026</div>
          <div className="text-[10px] font-mono text-white/10 tracking-[0.15em] uppercase">This EPK is confidential</div>
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
