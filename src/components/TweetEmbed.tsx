"use client";

import { useEffect, useRef } from "react";

interface Twttr {
  ready: (fn: (twttr: Twttr) => void) => void;
  widgets: { createTweet: (id: string, el: HTMLElement, options: Record<string, unknown>) => Promise<HTMLElement | undefined> };
}

let widgets: Promise<Twttr> | null = null;

function loadWidgets() {
  widgets ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.onload = () => (window as unknown as { twttr: Twttr }).twttr.ready(resolve);
    script.onerror = reject;
    document.head.append(script);
  });
  return widgets;
}

/** An X post with its photos and video, through X's own widget. If it can't load, the source link below it still works. */
export default function TweetEmbed({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    let live = true;
    loadWidgets()
      .then((twttr) => {
        if (live && el) return twttr.widgets.createTweet(id, el, { dnt: true, conversation: "none" });
      })
      .catch(() => {});
    return () => {
      live = false;
      el?.replaceChildren();
    };
  }, [id]);

  return <div ref={ref} className="max-w-[550px] [&_.twitter-tweet]:my-0!" />;
}
