import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { showcaseMedia } from "@/lib/siteContent";

export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.controls = true;
    v.play();
    setPlaying(true);
  };

  return (
    <section id="video" className="relative overflow-hidden bg-surface py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="container-px relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Project Showcase</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            See Our Work In Action
          </h2>
          <p className="mt-5 text-white/70 md:text-lg">
            {showcaseMedia.description}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-elegant">
            <div className="relative aspect-video w-full">
              <video
                ref={ref}
                src={showcaseMedia.videoUrl}
                poster={showcaseMedia.posterUrl}
                className="h-full w-full object-cover"
                playsInline
                preload="metadata"
                muted
                loop
                autoPlay
              />
              {!playing && (
                <button
                  onClick={handlePlay}
                  aria-label="Play project showcase video"
                  className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-black/40 transition-colors"
                >
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground shadow-gold transition-transform group-hover:scale-110 md:h-24 md:w-24">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
                    <Play className="relative ml-1 h-8 w-8 fill-current md:h-10 md:w-10" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
