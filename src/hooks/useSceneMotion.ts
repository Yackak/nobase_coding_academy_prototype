import type { DependencyList, RefObject } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** Animate once when visible; the server-rendered markup is the complete still scene. */
export function useSceneMotion<T extends HTMLElement>(
  scope: RefObject<T | null>,
  build: (root: T) => gsap.core.Timeline,
  dependencies: DependencyList = [],
) {
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let complete = reduced.matches;
    let timeline: gsap.core.Timeline | undefined;
    let motionContext: gsap.Context | undefined;

    const finish = () => {
      complete = true;
      timeline?.progress(1).pause();
    };
    const update = () => {
      if (complete) return;
      if (reduced.matches) { finish(); return; }
      if (!inView || document.hidden) { timeline?.pause(); return; }
      if (!timeline) {
        // Intersection callbacks happen after useGSAP, so own their context explicitly.
        motionContext = gsap.context(() => {
          timeline = build(root);
          timeline.eventCallback('onComplete', () => { complete = true; });
        }, root);
      }
      timeline?.play();
    };
    const onPreferenceChange = () => {
      if (reduced.matches) finish();
      else update();
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && root.contains(event.target)) finish();
    };
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          update();
        }, { threshold: 0, rootMargin: '0px 0px -16px 0px' })
      : undefined;

    observer?.observe(root);
    if (!observer) { inView = true; update(); }
    document.addEventListener('visibilitychange', update);
    document.addEventListener('focusin', onFocus);
    reduced.addEventListener('change', onPreferenceChange);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      document.removeEventListener('focusin', onFocus);
      reduced.removeEventListener('change', onPreferenceChange);
      motionContext?.revert();
    };
  }, { scope, dependencies: [...dependencies], revertOnUpdate: true });
}
