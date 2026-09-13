"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { links, youtubeWatch } from "@/data/links";

/**
 * Latest video.
 *
 * Shows the YouTube thumbnail until it is clicked, then swaps in the real iframe
 * with controls. Not embedding the player up-front keeps YouTube's scripts (and
 * cookies) off the page for anyone who never presses play.
 *
 * "Watch on YouTube" uses a youtube.com/watch URL, which mobile deep-links into the
 * native app when installed and falls back to a new browser tab when it isn't.
 */
export default function LatestVideo() {
  const [playing, setPlaying] = useState(false);
  const { id, title } = links.latestVideo;
  const watchUrl = youtubeWatch(id);

  return (
    <Section id="latest-video" className="scroll-mt-20">
      <SectionHeading eyebrow="Latest video" title="See it played." lead="A night at a Lostcoz table, start to finish." />

      <Reveal y={40} className="mt-10 md:mt-14">
        <div className="glass-panel glass-sheen overflow-hidden rounded-2xl p-3 sm:p-4">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-canvas-deep">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&controls=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${title}`}
                className="group/play absolute inset-0 size-full"
                data-cursor="text" data-cursor-text="Play"
              >
                {/* YouTube's own thumbnail — plain <img>, since i.ytimg.com is not a configured next/image host */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-expo group-hover/play:scale-105"
                  loading="lazy"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgb(7_7_9/0.55))]" />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-orange text-fg-inverse shadow-glow-orange transition-transform duration-500 ease-out-back group-hover/play:scale-110"
                >
                  <span className="ml-1 text-2xl leading-none">▶</span>
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-3">
            <p className="font-display text-title uppercase">{title}</p>
            <Button href={watchUrl} variant="ghost" size="sm" magnetic={false}>Watch on YouTube</Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
