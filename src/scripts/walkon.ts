// Walk-on runtime. The video's own clock is the single source of truth for
// labels; the pause button's state follows the video's play/pause events.

interface Walk {
  turnAt: number;
  holdEnd: number;
}

const GATE = "(min-width: 56rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function canPlay(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    matchMedia(GATE).matches &&
    conn?.saveData !== true &&
    document.documentElement.dataset.theme !== "dark"
  );
}

export function activeWalk(t: number, walks: Walk[]): number {
  return walks.findIndex((w) => t >= w.turnAt && t < w.holdEnd);
}

export function initWalkOn(root = document.querySelector<HTMLElement>("[data-walkon]")): void {
  if (!root) return;
  const video = root.querySelector<HTMLVideoElement>("video[data-walkon-video]")!;
  const toggle = root.querySelector<HTMLButtonElement>("button[data-walkon-toggle]")!;
  const labels = [...root.querySelectorAll<HTMLElement>("[data-walkon-label]")];
  const walks: Walk[] = JSON.parse(root.dataset.walks ?? "[]");
  const sources: { src: string; type: string }[] = JSON.parse(root.dataset.sources ?? "[]");

  let attached = false;
  let failed = false;
  let userPaused = false;
  let onScreen = true;

  const showLabel = () => {
    const i = video.paused && !video.seeking && video.currentTime === 0 ? -1 : activeWalk(video.currentTime, walks);
    labels.forEach((el, n) => el.classList.toggle("is-active", n === i && !failed));
  };
  const onFrame = () => {
    showLabel();
    video.requestVideoFrameCallback?.(onFrame);
  };

  const fail = () => {
    failed = true;
    root.classList.remove("is-live", "is-playing");
    toggle.hidden = true;
    showLabel();
  };

  const attach = () => {
    attached = true;
    for (const s of sources) {
      const el = document.createElement("source");
      el.src = s.src;
      el.type = s.type;
      el.addEventListener("error", () => {
        if (el === video.lastElementChild) fail();
      });
      video.append(el);
    }
    video.addEventListener("error", fail);
    video.addEventListener("canplaythrough", () => sync(), { once: true });
    if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(onFrame);
    else video.addEventListener("timeupdate", showLabel);
    video.addEventListener("seeked", showLabel);
    video.load();
  };

  // One place decides whether the video should be running right now.
  const sync = () => {
    if (failed) return;
    const allowed = canPlay();
    root.classList.toggle("is-live", allowed);
    if (allowed && !attached) return attach();
    if (allowed && onScreen && !userPaused && document.visibilityState === "visible") {
      if (video.readyState >= 3 && video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  };

  video.addEventListener("play", () => {
    root.classList.add("is-playing");
    toggle.hidden = false;
    toggle.setAttribute("aria-label", "Pause background video");
  });
  video.addEventListener("pause", () => {
    toggle.setAttribute("aria-label", "Play background video");
  });

  toggle.addEventListener("click", () => {
    userPaused = !video.paused;
    if (userPaused) video.pause();
    else sync();
  });

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (attached) sync();
  }).observe(root);
  document.addEventListener("visibilitychange", () => attached && sync());
  matchMedia(GATE).addEventListener("change", sync);
  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  if (document.readyState === "complete") sync();
  else window.addEventListener("load", sync, { once: true });
}
