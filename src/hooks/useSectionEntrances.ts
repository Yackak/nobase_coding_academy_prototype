import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const entranceTargets = [
  '.section-top',
  '.about-grid > div',
  '.guide-heading',
  '.guide-list > div',
  '.faq-grid > div',
  '.contact-main > div',
  '.location-card',
  '.principles > div',
].join(', ');

type EntranceState = {
  element: HTMLElement;
  inView: boolean;
  complete: boolean;
  tween?: gsap.core.Tween;
  context?: gsap.Context;
};

/** Content stays visible until its one short entrance starts in the viewport. */
export function useSectionEntrances() {
  useGSAP(() => {
    const main = document.getElementById('main');
    if (!main || !('IntersectionObserver' in window)) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const states = new Map<HTMLElement, EntranceState>();
    main.querySelectorAll<HTMLElement>(entranceTargets).forEach(element => {
      if (element.closest('.hero, .system, .site-header, .mobile-cta, .mobile-consult-bar')) return;
      states.set(element, {
        element,
        inView: false,
        complete: !!document.activeElement && element.contains(document.activeElement),
      });
    });

    const finish = (state: EntranceState) => {
      state.complete = true;
      state.tween?.progress(1).pause();
      observer.unobserve(state.element);
    };

    const update = (state: EntranceState) => {
      if (state.complete) return;
      if (reduced.matches) { finish(state); return; }
      if (document.hidden || !state.inView) { state.tween?.pause(); return; }
      if (!state.tween) {
        // The observer runs asynchronously, so capture its tween for StrictMode cleanup.
        state.context = gsap.context(() => {
          state.tween = gsap.fromTo(state.element, { opacity: .5, y: 12 }, {
            opacity: 1,
            y: 0,
            duration: .52,
            ease: 'power2.out',
            paused: true,
            onComplete: () => {
              state.complete = true;
              observer.unobserve(state.element);
            },
          });
        }, state.element);
      }
      state.tween?.play();
    };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const state = states.get(entry.target as HTMLElement);
        if (!state) continue;
        state.inView = entry.isIntersecting;
        update(state);
      }
    }, { threshold: 0, rootMargin: '0px 0px -16px 0px' });

    const updateAll = () => states.forEach(update);
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const state of states.values()) {
        if (!state.complete && state.element.contains(event.target)) finish(state);
      }
    };

    states.forEach(state => { if (!state.complete) observer.observe(state.element); });
    document.addEventListener('visibilitychange', updateAll);
    document.addEventListener('focusin', onFocus);
    reduced.addEventListener('change', updateAll);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateAll);
      document.removeEventListener('focusin', onFocus);
      reduced.removeEventListener('change', updateAll);
      states.forEach(state => state.context?.revert());
    };
  }, { dependencies: [] });
}
