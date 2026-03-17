"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, ExternalLink, ChevronDown } from "lucide-react";
import { ParallaxScrollSecond } from "@/components/ui/parallax-scroll";

import { GoesOutComesInUnderline, ComesInGoesOutUnderline } from "@/components/ui/underline-animation";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

/* ─── IMAGE MANIFESTS ─── */

const ALL_PHOTOS = [
  ...Array.from({ length: 52 }, (_, i) => `/images/live/live-${String(i + 1).padStart(2, "0")}.jpg`),
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
  /* Row 1 */
  { title: "Spaced Out", year: "2012", src: "/images/album-art/spaced-out.jpg", link: "https://ketamines.bandcamp.com/album/spaced-out-lp", type: "LP", label: "Mammoth Cave / Southpaw" },
  { title: "You Can\u2019t Serve Two Masters", year: "2013", src: "/images/album-art/ycsm.jpg", link: "https://ketamines.bandcamp.com/album/you-cant-serve-two-masters-lp", type: "LP", label: "Mammoth Cave / Southpaw" },
  { title: "Line By Line", year: "2011", src: "/images/album-art/hozac.jpg", link: "https://ketamines.bandcamp.com/album/hozac-7", type: "7\"", label: "HoZac" },
  { title: "A Rotten Bond", year: "2012", src: "/images/album-art/rotten-bond.jpg", link: "https://ketamines.bandcamp.com/album/a-rotten-bond-7", type: "7\"", label: "Odd Box" },
  /* Row 2 */
  { title: "All The Colours Of Your Heart", year: "2013", src: "/images/album-art/colours.jpg", link: "https://ketamines.bandcamp.com/album/all-the-colours-of-your-heart-7", type: "7\"", label: "Pleasence" },
  { title: "Eleven Eleven EP", year: "2014", src: "/images/album-art/eleven-eleven.jpg", link: "https://ketamines.bandcamp.com/album/eleven-eleven-7-ep", type: "7\" EP", label: "Leaning Trees" },
  { title: "So Hot!", year: "2013", src: "/images/album-art/so-hot.jpg", link: "https://ketamines.bandcamp.com/album/so-hot-7", type: "7\"", label: "Hosehead" },
  { title: "Stay Awake", year: "2014", src: "/images/album-art/stay-awake.jpg", link: "https://ketamines.bandcamp.com/album/stay-awake-7", type: "7\"", label: "Mint" },
];

/* ─── PRESS QUOTES (all equal treatment, with links) ─── */

const PRESS_QUOTES = [
  /* ─── Row 1: Pitchfork / VICE / Raven Sings the Blues ─── */
  {
    quote: "The best sell for Spaced Out comes from their palpable excitement to be making this music. \u201CEvil Intentions\u201D begins with the copied-and-pasted opening strains of Steppenwolf\u2019s \u201CMagic Carpet Ride.\u201D It\u2019s surprising that the song goes on to impress, since just the hint of that overplayed, infectious melody is a tough act to follow. They pull it off because behind their eccentric tendencies and hallucinogenic moniker, these guys build solid song structures: verse, chorus, and bridge, all strung together by solid hooks.",
    source: "Pitchfork",
    link: "https://pitchfork.com/reviews/albums/16370-ketamines-spaced-out/",
  },
  {
    quote: "HoZac makes a lot of records for a label of their size. Most are forgettable, but when they make a good one, oh boy, is it good. This one sounds good. That\u2019s the limits of my descriptive power. \"Sounds good.\" Lots of sound effects like when a person materializes in a He-Man cartoon.",
    source: "VICE",
    link: "https://web.archive.org/web/20131101042729/http://www.vice.com/read/records-00000106-v18n12",
  },
  {
    quote: "With catchy harmonies and an array of effects, the band picks up the psych-punk torch and brandishes it like a weapon. The A-side is a syrupy serving of psychedelic pop that will have you yearning for your Twinkeyz and Simply Saucer records all over again. They show no signs of slippage on the flip and all in all, this makes for a very intriguing debut.",
    source: "Raven Sings the Blues",
    link: "https://web.archive.org/web/20120626205634/http://ravensingstheblues.blogspot.com/2011/10/ketamines-line-by-line-7-ketamines-are.html",
  },
  /* ─── Row 2 ─── */
  {
    quote: "There\u2019s something that thrills me when people get away with these completely ludicrous, dumb, nursery-rhyme riffs, and I\u2019ve always been jealous of them.",
    source: "Consequence of Sound",
    attribution: "Jarrett Samson (Tough Age)",
    link: "https://consequence.net/2017/09/canadian-punks-tough-age-share-the-origins-of-their-new-single-me-in-glue-stream/",
  },
  {
    quote: "They still harness the hazy, confident stride of the dazed legends that came before them, and their psychedelic pop should carry them straight into the arms of today\u2019s most jaded with ease.",
    source: "Sled Island",
    link: "https://m.sledisland.com/2012/the-ketamins",
  },
  {
    quote: "The word ketamine refers to two things: one is the name of an anesthetic substance famous for being a recreational sedative. The other refers to a five-piece acid-wash pop band. Both are highly addictive.",
    source: "CiTR Discorder",
  },
  /* ─── Row 3 ─── */
  {
    quote: "Ketamines channel a shit-ton of energy into their trashy psych-outs, bringing a bit of garage-leaning surf-pop into the picture for their own bizarre flavor. We can only hope they\u2019ll be back in 2013 with more of the bubbly, hook-heavy madness.",
    source: "Styrofoam Drone",
    attribution: "Top 25 of 2012",
    link: "https://styrofoamdrone.com/2012/",
  },
  {
    quote: "All The Colours of Your Heart reminded me of Ian Dury and the Blockheads especially with the organ and funk influence meets a poppy Fall. \u2026 \u2018Turning You On\u2019 is a complete psychedelic garage rock freakout that would be well in line with 13th Floor Elevators while adding in a surf pop calmness and quirky lead to jerk you back out your calmness.",
    source: "Audio Ammunition",
    link: "https://audioammunition.blogspot.com/2014/05/reviews.html",
  },
  {
    quote: "You Can\u2019t Serve Two Masters has the effect of a shaken up can of pop that has burst and has been left out in the sun too long. It is sticky, gritty and catchy as hell.",
    source: "Revolution Rock",
    attribution: "Best Albums 2013",
    link: "https://revrock.blogspot.com/2013/12/2013-highlights-show-489.html",
  },
  /* ─── Row 4 ─── */
  {
    quote: "Canada\u2019s Ketamines come from a garage rock background, but on You Can\u2019t Serve Two Masters they shed many of the garage rock pretenses and go the quirky power pop route. The sound is cleaner and lyrics are pointed and since the sound is cleaner the vocal melodies shine brighter. It\u2019s a deft move and shows you what a brilliant band the Ketamines are.",
    source: "Finest Kiss",
    attribution: "Best Albums of 2013",
    link: "https://finestkiss.wordpress.com/2013/12/22/best-of-2013-albums/",
  },
  {
    quote: "Side A kicks off proceedings with \u2018Colours\u2019\u2019s wicked Steve-Cropper-jonesing GEETAR licks bumping with some uptight rythym urgency. Hit a sideways pogo to \u2018chase away the gloom\u2019, as our heroes say. \u2026 Imagine Sky Saxon lighting boards for The Meters, and you\u2019re almost there.",
    source: "Weird Canada",
    link: "https://weirdcanada.com/category/format/page/129/",
  },
  {
    quote: "Holy shit, you guys, why on earth did I sleep so hard on Ketamines? \"Line By Line\" is the most succulent slice of hard hitting, impartible, almost bubblegum garage pop song that I\u2019ve heard in some time. Imagine the best clarion bursts of guitar, the most charming vocal harmonies, and references to drugs rolled up in like, a cloud made of cotton candy and you\u2019ll see why this song is bringing tons of sunshine into my world.",
    source: "Nu Wave Brain Wave",
    link: "https://web.archive.org/web/20111003220459/http://nuravebrainwave.com/2011/09/mp3-ketamines-line-by-line/",
  },
  /* ─── Row 5 (bottom): PopMatters / Exclaim! / Lights In Pairs ─── */
  {
    quote: "From the venerable Mammoth Cave Records, the first \u201Cfull length\u201D from the Ketamines is 28 minutes of fuzzed out rock and roll at its best. There are some real gems here that sound like they were composed in the most spirited of garages.",
    source: "Lights In Pairs",
    attribution: "Best Albums of 2012",
    link: "http://lightsinpairs.wordpress.com/2013/01/05/best-albums-of-2012/",
  },
  {
    quote: "You Can\u2019t Serve Two Masters is one of the better psych listens of the year; its ability to surprise is so engaging that it reminds us never to judge a book by its cover.",
    source: "PopMatters",
    rating: "7/10",
    link: "https://www.popmatters.com/175477-the-ketaminesyou-cant-serve-two-masters-2495722138.html",
  },
  {
    quote: "Ketamines threw down a monster set of ultra-catchy and inventive garage rock that had the main stage writhing and shimmying.",
    source: "Exclaim!",
    link: "https://exclaim.ca/music/article/wyrd_fest_iii_featuring_red_mass_long_long_long_famines_tonstartssbandht_das_amore-waldorf_hotel_vancouver_bc_may_22",
  },
];

/* ─── COMRADES LIST ─── */

const COMRADES = "Absolutely Free, Actual Water, AHNA, Aids Wolf, Andy Boay, Apollo Ghosts, Atomic Don, Audacity, Aunty Panty, Average Times, B-Lines, B.A. Johnston, Babysitter, Bad Naked, The Ballantynes, Bare Mutants, Bare Wires, Barreracudas, The Beaten Hearts, Beliefs, The Beverlys, The Bicycles, Bidini Band, Bile Sister, The Blind Shake, The Bonaduces, Bonnie Doon, Brat Kings, Brave Radar, Brazilian Money, Brews Willis, Bronx Cheerleader, The Browns, Burnt Ones, Caves, Caymans, Cellphone, Century Palm, Chad VanGaalen, Chains of Love, Chico No Face, Cindy Lee, Concrete Hearts, Connosseurs of Porn, Cosmonauts, The Courtneys, Cousins, Cozy, Crocodile, Crosss, The Cry, The Cryptomaniacs, Damo Suzuki, Dany Laj and The Looks, Darcy Spindle, Davila 666, The Dead Beat, Dead Ghosts, Dirty Beaches, Disasterbators, Dog Day, The Doozies, Dorothea Paas, Duchess Says, Dusted, D\u2019Eon, Each Other, Elevator, Elevator Through, Elevator to Hell, Ell V Gore, Elliot, Eric & The Happy Thoughts, Eric\u2019s Trip, Extra Happy Ghost!!!, The Famines, Far-Out Fangtooth, Favour, Feel Alright, Femme Accident, Femminielli, Feral Children, Fill Spectre, Fist City, Fleshmoves, The Florals, The Forever, The Forks, Freak Heat Waves, Freelove Fenner, The Fresh and Onlys, Fresh Snow, Friendo, Fungi Girls, Fuzzy Numbers, Gal Gracen, Gay, Gentleman Jesse and His Men, GOBBLE GOBBLE, Gold, The Gooeys, The Grand Pantrymen, Grave Babies, Growing Pains, Grown-Ups, Hag Face, Hank and Lilly, Haunted Souls, Heaven For Real, Henry H. Owings, High Rise II, The Highest Order, Hobo Cubes, Homostupids, HSY, Human Eye, Hunters, I-Spy, Ian Manhire, J. Sherri, James Leroy and the Giant, The James Leroy Power Trio, Jay Holy, JAZZ, Jeans Boots, The Jeremy Clarkson, JFM, Jil Peace, JLK, John Jerome and The Congregation, Juan Wauters, K-Holes, The Kamikazes, Kappa Chow, King Cobb Steelie, King Tuff, Korean Gut, KRANG, Kris Ellestad, Lab Coast, Lantern, Legato Vipers, Lets Go, Long Long Long, The Low Sizes, Lungbutter, Mac, Mac DeMarco, Man Legs, Man Made Hill, Manic Attracts, Mavo, Meat Curtains, Mexican Slang, Mickey, Microdot, The Mitts, The Moby Dicks, Mode Moderne, Modern Nature, Monomyth, Moon, Moonwood, Mothers Children, The Mutators, The Myelin Sheaths, Mystics, Nap Eyes, Needlecraft, Needles//Pins, Nervous Talk, Noble Savages, Nu Sensae, The Numerators, The Nymphets, OBN III, Open Channels, The Ostrich, Ought, Outdoor Minors, Outer Minds, Outtacontroller, P.S. I Love You, Painted Thin, Pale Lips, Parquet Courts, PC Worship, Peace for Bombs, Peelander Z, Personal and the Pizza, Pink Noise, Pink Wine, Pissed Jeans, Plastic Act, Play Guitar, Pleasure Leftists, Pop Crimes, Porter Hall, Pow Wows, Pregnancy Scares, Preoccupations, Priors, Private Lives, Propagandhi, Protruders, Pup, Quiet Loudly, Quilt, Radians, Rayon Beach, Red Fisher, Red Mass, Redd Kross, Renny Wilson, Rick White, Roky Erickson, Role Mach, The Sadies, Sam Coffey and the Iron Lungs, Scattered Clouds, Schoolteacher, The Sedatives, Sexy Merlin, Shadowy Men on a Shadowy Planet, Shannon and the Clams, Sharp Ends, Shearing Pinx, Sheer Agony, Shipyards, Shitty Neighbours, Shooting Guns, Shotgun Jimmie, The Shrapnelles, Silver Dapple, Simply Saucer, Skin Flowers, Slim Twig, Slime Street, Sonic Avenues, Sonic Boom, The Soupcans, Squish, Stalwart Sons, Start Something, Steve Adamyk Band, The Stolen Minks, Stoopid Idiots, Strange Attractor, Strange Boys, Stressed Out, Student Teacher, Sun Arraw, Taylor Knox Band, Teen Liver, Teenanger, Teledrome, Tess Parks, Thee Oh Sees, The Thrashers, Timecopz, Times New Viking, Timmy\u2019s Organism, Tonetta, Tonstartssbandht, Topless Mongos, Tough Age, TV Ghost, Tyvek, Ultimate Painting, Ultrathin, Uncle Bad Touch, Us Girls, The Valley Boys, VIDEO, Village, Voicemail, Warm Soda, Wax Mannequin, White Mystery, White Poppy, The White Wires, The Wicked Awesomes, WLMRT, The Wolf Note, Women, Woolworm, Wrong Hole, Wyrd Visions, X Ray Eyeballs, Yellow Teeth, Young Governor, Zacht Automaat, Zebrassieres".split(", ");

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

const LABEL_LOGOS = [
  { src: "/images/labels/hozac.png", alt: "HoZac Records", invert: true },
  { src: "/images/labels/mammoth-cave.png", alt: "Mammoth Cave Recording Co.", invert: true },
  { src: "/images/labels/southpaw.png", alt: "Southpaw Records", invert: true },
  { src: "/images/labels/pleasence.png", alt: "Pleasence Records", invert: true },
  { src: "/images/labels/hosehead.png", alt: "Hosehead Records", invert: true },
  { src: "/images/labels/leaning-trees.png", alt: "Leaning Trees Records", invert: true },
  { src: "/images/labels/mint.png", alt: "Mint Records", invert: false },
];

/* ─── ANIMATED EQUALIZER BARS ─── */

const EQ_ANIMATE = { scaleY: [0.4, 1, 0.6, 0.9, 0.4] };
const EQ_TRANSITIONS = [0, 0.2, 0.4].map((delay) => ({
  duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" as const,
}));

const EqBars = React.memo(function EqBars() {
  return (
    <div className="flex items-end gap-[2px] h-3.5 w-4 shrink-0">
      {EQ_TRANSITIONS.map((transition, i) => (
        <motion.div
          key={i}
          className="w-[3px] h-full bg-red rounded-sm origin-bottom"
          animate={EQ_ANIMATE}
          transition={transition}
        />
      ))}
    </div>
  );
});

/* ─── TILT CARD (3D hover) ─── */

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [4, -4]);
  const rotateY = useTransform(x, [0, 1], [-4, 4]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── ANIMATED COUNTER ─── */

function AnimatedNumber({ value, className = "" }: { value: number; className?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = Date.now();
        const duration = 1200;
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayed(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref} className={className}>{displayed}</div>;
}

/* ─── PASSWORD GATE ─── */

const EPK_PASSWORD = "burnt";
const SESSION_KEY = "ketamines-epk-unlocked";

const WRONG_MESSAGES = [
  "Wrong password",
  "Nope, try again",
  "Not even close",
  "Still wrong",
  "You\u2019re really struggling here",
  "Hint: what happens to toast?",
];

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === EPK_PASSWORD) {
      onUnlock();
    } else {
      setAttempts((a) => a + 1);
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword("");
    }
  };

  const errorMsg = WRONG_MESSAGES[Math.min(attempts - 1, WRONG_MESSAGES.length - 1)] || "Wrong password";

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className={`relative flex flex-col items-center gap-10 ${shake ? "animate-shake" : ""}`}>
        <motion.div
          className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 invert"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <Image src="/images/logos/main-logo.jpg" alt="The Ketamines" fill className="object-contain" priority />
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
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
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={attempts}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red text-xs tracking-[0.2em] uppercase font-mono"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className="mt-2 text-xs tracking-[0.3em] uppercase text-grey-mid hover:text-white transition-colors duration-300 font-mono">[ Enter ]</button>
        </motion.form>
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
    if (isPlaying) audio.play().catch(() => {});
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play().catch(() => {}); }
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
                    currentTrack === idx ? "bg-white/5 text-white border-l-2 !border-l-red" : "text-offwhite/60"
                  }`}
                >
                  <span className="text-xs font-mono w-6 shrink-0 text-grey-mid">{track.num}</span>
                  {currentTrack === idx && isPlaying ? (
                    <EqBars />
                  ) : (
                    <span className="w-4 shrink-0"><Play size={14} className="text-grey-mid" /></span>
                  )}
                  <span className="text-base font-medium">{track.title}</span>
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
          <div className="h-full transition-all duration-100" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%", background: "linear-gradient(90deg, #ff0000 0%, #00e5ff 100%)" }} />
        </div>
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} className="text-grey-mid hover:text-white transition-colors"><SkipBack size={18} /></button>
          <button onClick={togglePlay} className={`w-10 h-10 flex items-center justify-center border transition-all ${isPlaying ? "border-red text-red shadow-[0_0_12px_rgba(255,0,0,0.3)]" : "border-white/20 hover:border-red hover:text-red"}`}>
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
    <div className="w-full flex items-center gap-4 py-20">
      <div className="flex-1 h-px bg-white/10" />
      <div className="w-1.5 h-1.5 bg-red rotate-45 divider-diamond" />
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

/* ─── NAV ─── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b border-white/5 ${
      scrolled ? "bg-black/90 backdrop-blur-md" : "bg-black"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="relative w-10 h-10 invert opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/images/logos/main-logo.jpg" alt="K" fill className="object-contain" sizes="40px" />
        </div>
        <div className="flex gap-6 text-[10px] tracking-[0.2em] uppercase font-mono text-offwhite/60">
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

/* ─── COMRADES COLUMNS (collapsible) ─── */

function ComradesColumns() {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_COUNT = 40;

  const visibleNames = expanded ? COMRADES : COMRADES.slice(0, PREVIEW_COUNT);

  const cols = useMemo(() => {
    const perCol = Math.ceil(visibleNames.length / 4);
    return [
      visibleNames.slice(0, perCol),
      visibleNames.slice(perCol, perCol * 2),
      visibleNames.slice(perCol * 2, perCol * 3),
      visibleNames.slice(perCol * 3),
    ];
  }, [visibleNames]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-0">
        {cols.map((col, i) => (
          <div key={i}>
            {col.map((name) => (
              <div key={name} className="text-[11px] font-mono text-offwhite/30 hover:text-red transition-colors duration-200 leading-[1.8]">
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
      {!expanded && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-grey-mid hover:text-white transition-colors border border-white/10 hover:border-white/30 px-5 py-2"
          >
            the list is long... <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── CONTACT EMAIL (click-to-copy) ─── */

function ContactEmail() {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("pklawton@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleClick} className="block text-xl sm:text-2xl font-mono text-red hover:text-white transition-colors font-bold mx-auto">
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="copied" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-white">
            Copied! Now email us.
          </motion.span>
        ) : (
          <motion.span key="email" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            pklawton@gmail.com
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── FOOTER EASTER EGG ─── */

function FooterEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const messages = [
    "This EPK is confidential",
    "Seriously, don\u2019t share this",
    "We\u2019re watching you",
    "OK fine, share it with one person",
    "Actually, share it with everyone",
    "Sign this band already",
    "\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25",
  ];

  return (
    <button
      onClick={() => setClicks((c) => c + 1)}
      className="text-[10px] font-mono text-white/10 hover:text-white/20 tracking-[0.15em] uppercase transition-colors select-none"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={clicks}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {messages[clicks % messages.length]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ─── MAIN EPK ─── */

function EPK() {
  return (
    <div className="min-h-screen bg-black">
      <Nav />

      {/* ═══ ONE-PAGER CONTAINER ═══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6" style={{ paddingTop: '3.5rem' }}>

        {/* ═══ HERO: ALBUM ART ═══ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-1"
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

        {/* Title strip — bold and commanding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 mb-4 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wide leading-none">
            <span className="text-white glitch-text hover:text-red transition-colors duration-300" data-text="THE KETAMINES">THE KETAMINES</span>
            <span className="text-red mx-2 sm:mx-3">/</span>
            <span className="text-red">BURNED OUT!</span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase font-mono text-grey-mid">
            <span>LP</span>
            <span className="text-red">/</span>
            <span>10 TRACKS</span>
            <span className="text-red">/</span>
            <span>2026</span>
          </div>
        </motion.div>

        <div className="mb-8" />

        {/* ═══ PLAYER ═══ */}
        <motion.div
          id="music"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AudioPlayer />
        </motion.div>

        <Divider />

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="py-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-grey-mid mb-12 text-center">About</h2>
        </Reveal>

        <div>
          {/* Album title */}
          <Reveal>
            <p className="text-4xl sm:text-5xl md:text-7xl font-display uppercase leading-[0.95] text-center text-red mb-10">
              Burned Out!
            </p>
          </Reveal>

          {/* James & PK */}
          <Reveal delay={0.05}>
            <div className="flex justify-center mb-12">
              <div className="border border-white/10">
                <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/press/james-and-pk.png"
                    alt="James Leroy and PK Lawton"
                    fill
                    className="object-cover object-top"
                    sizes="512px"
                  />
                </div>
                <div className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase font-mono text-grey-mid text-center">
                  James Leroy &amp; PK Lawton
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal>
            <div className="space-y-5 mb-24">
              <p className="text-sm sm:text-base leading-relaxed text-white text-left">
                James Leroy and I have been making music together since 1996, when we did our first recording session in his basement on a borrowed 8-track cassette recorder. In the 30 years since (!) a lot has changed; we live across the country from each other, I work in design and James works on a farm, but we&rsquo;ve never stopped. Hundreds of dumb songs, mostly written and meticulously iterated on for months and months, mostly for our own entertainment. And then, sometimes we get the itch to put out records and get this thing rolling again, and so here we are. We finally have 10 songs we think people besides us might be interested in.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-white text-left">
                <em>Burned Out!</em> is our first long-player since 2013&rsquo;s <em>You Can&rsquo;t Serve Two Masters</em>. James and I initially bonded over a shared love of the Winnipeg political punk scene, and this might be our most overtly political record yet, but it&rsquo;s also a record about what it means to make art in an environment where art has been completely devalued.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-white text-left">
                Over the last four years, we&rsquo;ve lost so many of our comrades and bandmates: our first collaborator, Christopher Schultzen; Joni Sadler from CKUT, one of our champions in campus and community radio; friends and collaborators from other bands like Cody Prairie Chicken, Chris Reimer, and Phillip Tarr; friends who put us up in their homes like Brendo in Saskatoon. We continue in their honour.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-white text-left">
                We had a great initial run with the Ketamines: 7&quot;s on HoZac, Mint Records, Pleasence, Hosehead, Leaning Trees, and Odd Box in the UK; two well-received LPs. We toured extensively across North America thanks to the push from our friend Annie Southworth at Panache (rest in peace, Queen) and got to play some incredible shows. We opened for Roky Erikson, Sonic Boom, Damon and Naomi, Shadowy Men on a Shadowy Planet.
              </p>

              <p className="text-base sm:text-lg leading-relaxed text-white text-left font-medium">
                This record is for the lifers, like us, who don&rsquo;t know how to quit.
              </p>
            </div>
          </Reveal>

          {/* Fast facts — punk zine style */}
          <Reveal delay={0.2}>
            <div className="mb-16 space-y-8">
              {/* Key facts as punchy lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-sm p-5 hover:border-white/10 transition-colors">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-red mb-2">College Charts</div>
                  <p className="text-lg text-offwhite"><em className="text-white font-medium">You Can&rsquo;t Serve Two Masters</em> &mdash; <span className="text-amber font-bold">#2 Nationally</span></p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-sm p-5 hover:border-white/10 transition-colors">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-red mb-2">SYNCs</div>
                  <p className="text-lg text-offwhite">&ldquo;Line By Line&rdquo; for <span className="text-amber font-bold">Target</span></p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-sm p-5 hover:border-white/10 transition-colors">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-red mb-2">Shows Played</div>
                  <p className="text-lg text-offwhite"><span className="text-amber font-bold text-2xl">175+</span> Across North America</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-sm p-5 hover:border-white/10 transition-colors">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-red mb-2">Location</div>
                  <p className="text-lg text-offwhite">PK lives in Hamilton &middot; James Leroy lives on a farm in Alberta &middot; The current live band is in Toronto</p>
                </div>
              </div>

            </div>
          </Reveal>

          {/* Comrades — 4-column layout */}
          <Reveal className="mt-8">
            <div className="border-t border-white/5 pt-8">
              <div className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid text-center mb-6">
                Burned Out! was influenced by:
              </div>
              <ComradesColumns />
            </div>
          </Reveal>
        </div>
      </section>

        <Divider />

        {/* ═══ DISCOGRAPHY ═══ */}
        <section id="discography" className="py-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-amber/70 mb-12 text-center">Discography</h2>
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
                <TiltCard>
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
                </TiltCard>
                <div className="mt-3">
                  <div className="text-base font-medium leading-tight group-hover:text-red transition-colors">{album.title}</div>
                  <div className="text-sm font-mono mt-1.5">
                    <span className="text-grey-mid">{album.year} &middot; {album.type}</span>
                    <span className="text-offwhite/70"> &middot; {album.label}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

        {/* Labels — infinite scrolling logos */}
        <Reveal>
          <div className="relative py-8 my-12 border-y border-white/5">
            <InfiniteSlider gap={56} reverse speed={30} durationOnHover={60}>
              {LABEL_LOGOS.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className={`h-8 sm:h-10 w-auto select-none opacity-50 hover:opacity-100 transition-opacity ${logo.invert ? "invert" : ""}`}
                  loading="lazy"
                />
              ))}
            </InfiniteSlider>
            <ProgressiveBlur
              blurIntensity={1}
              className="pointer-events-none absolute top-0 left-0 h-full w-[80px]"
              direction="left"
            />
            <ProgressiveBlur
              blurIntensity={1}
              className="pointer-events-none absolute top-0 right-0 h-full w-[80px]"
              direction="right"
            />
          </div>
        </Reveal>

        <Divider />

        {/* ═══ PRESS ═══ */}
        <section id="press" className="py-24">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-grey-mid mb-12 text-center">Press</h2>
          </Reveal>

          {/* Outlet marquee — allowed to overflow container */}
          <div className="overflow-hidden mb-10 border-y border-white/5 py-4 -mx-4 sm:-mx-6 group/marquee">
            <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] whitespace-nowrap flex gap-8">
              {["PITCHFORK", "EXCLAIM!", "POPMATTERS", "CONSEQUENCE OF SOUND", "VICE", "SLED ISLAND", "WEIRD CANADA", "STYROFOAM DRONE", "AUDIO AMMUNITION", "REVOLUTION ROCK", "FINEST KISS", "CiTR DISCORDER", "RAVEN SINGS THE BLUES", "NU WAVE BRAIN WAVE", "LIGHTS IN PAIRS", "HOZAC RECORDS",
                "PITCHFORK", "EXCLAIM!", "POPMATTERS", "CONSEQUENCE OF SOUND", "VICE", "SLED ISLAND", "WEIRD CANADA", "STYROFOAM DRONE", "AUDIO AMMUNITION", "REVOLUTION ROCK", "FINEST KISS", "CiTR DISCORDER", "RAVEN SINGS THE BLUES", "NU WAVE BRAIN WAVE", "LIGHTS IN PAIRS", "HOZAC RECORDS"
              ].map((name, i) => (
                <span key={i} className={`text-3xl sm:text-5xl font-display uppercase ${i % 3 === 0 ? "text-red/10" : i % 3 === 1 ? "text-cyan/8" : "text-white/6"}`}>{name}</span>
              ))}
            </div>
          </div>

          {/* All quotes in uniform grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESS_QUOTES.map((item, i) => {
              const inner = (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="quote-card border border-white/5 p-6 flex flex-col justify-between h-full"
                >
                  <blockquote className="text-sm leading-relaxed font-light text-offwhite/85 mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div>
                    <div className="flex items-center justify-between">
                      <cite className="text-[10px] tracking-[0.15em] uppercase font-mono text-red not-italic">{item.source}</cite>
                      {item.rating && <span className="text-[10px] font-mono text-grey-mid border border-white/10 px-2 py-0.5">{item.rating}</span>}
                    </div>
                    {item.attribution && <div className="text-[10px] text-grey-mid mt-2 font-mono">&mdash; {item.attribution}</div>}
                  </div>
                </motion.div>
              );
              return item.link ? (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                  {inner}
                </a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>

          {/* Oprah image */}
          <Reveal className="mt-10">
            <div className="border border-white/10">
              <div className="relative aspect-[3/1] overflow-hidden">
                <Image src="/images/press/oprah.jpg" alt="Lethbridge Herald: Ketamines capture Oprah's attention" fill className="object-contain bg-[#f5f0e8]" sizes="(max-width: 960px) 100vw, 960px" />
              </div>
              <div className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-mono text-grey-mid text-center">
                Still funny a decade later &mdash; actual clip from the front page of the Lethbridge Herald
              </div>
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* ═══ VIDEOS ═══ */}
        <section id="videos" className="py-24">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-grey-mid mb-12 text-center">Videos</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIDEOS.map((video, i) => (
              <Reveal key={video.vimeoId} delay={i * 0.1}>
                <div className="group">
                  <div className="relative aspect-video overflow-hidden border border-white/10 group-hover:border-red/50 transition-colors bg-black">
                    <iframe
                      src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&color=ff0000&title=0&byline=0&portrait=0`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full"
                      title={video.title}
                    />
                  </div>
                  <div className="mt-3">
                    <div className="text-base font-medium">{video.title}</div>
                    <div className="text-xs font-mono text-grey-mid mt-1">{video.subtitle}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══ PHOTOS ═══ */}
        <section id="photos" className="py-24">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-grey-mid mb-12 text-center">Photos</h2>
          </Reveal>
          <ParallaxScrollSecond images={ALL_PHOTOS} />
        </section>

        <Divider />

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="py-24 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl tracking-[0.3em] uppercase font-mono text-grey-mid mb-12">Contact</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-md aspect-[2.5/1]">
                <div className="absolute inset-0 bg-red/5 blur-3xl rounded-full" />
                <Image src="/images/logos/black-metal-logo.png" alt="Ketamines" fill className="object-contain invert relative z-10" sizes="(max-width: 448px) 100vw, 448px" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xs tracking-[0.3em] uppercase font-mono text-grey-mid mb-8">For booking and label inquiries</p>
            <div className="flex flex-col items-center space-y-5 text-xl sm:text-2xl font-mono uppercase tracking-[0.15em]">
              <ContactEmail />
              <a href="https://ketamines.bandcamp.com" target="_blank" rel="noopener noreferrer" className="text-offwhite/60 hover:text-white transition-colors">
                <ComesInGoesOutUnderline label="BANDCAMP" direction="right" />
              </a>
              <a href="https://www.discogs.com/artist/2376880-Ketamines" target="_blank" rel="noopener noreferrer" className="text-offwhite/60 hover:text-white transition-colors">
                <ComesInGoesOutUnderline label="DISCOGS" direction="left" />
              </a>
              <a href="tel:+16472412575" className="text-offwhite/40 hover:text-white transition-colors text-base mt-4">
                <GoesOutComesInUnderline label="647.241.2575" direction="left" />
              </a>
            </div>
          </Reveal>
        </section>

      </div>{/* end one-pager container */}

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-mono text-grey-mid tracking-[0.15em] uppercase">Ketamines &copy; 2026</div>
          <FooterEasterEgg />
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
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved === "true") setUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setEntering(true);
    sessionStorage.setItem(SESSION_KEY, "true");
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
