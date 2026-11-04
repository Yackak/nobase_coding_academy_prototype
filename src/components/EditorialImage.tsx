import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { asset } from '../lib/assets';
import { useSceneMotion } from '../hooks/useSceneMotion';

const images = {
  'english-reading': { width: 1536, height: 1024, smallWidth: 799, fallback: '읽고 이해하는 힘' },
  'math-reasoning': { width: 1536, height: 1024, smallWidth: 799, fallback: '생각을 쌓는 과정' },
  'learning-plan': { width: 1536, height: 1024, smallWidth: 799, fallback: '매일의 작은 기록' },
  'quiet-study': { width: 1599, height: 900, smallWidth: 800, fallback: '차분히 배우는 시간' },
} as const;

type EditorialImageProps = {
  kind: keyof typeof images;
  className?: string;
  caption?: string;
  sceneLabel?: string;
  sizes?: string;
};

/** Each image remains a complete, visible still when JavaScript or motion is unavailable. */
function EditorialImageScene({ kind, className = '', caption, sceneLabel, sizes = '(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) calc((100vw - 96px) / 2), 600px' }: EditorialImageProps) {
  const image = images[kind];
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = asset(`image-library/assets/generated/${kind}.webp`);
  const smallSource = asset(`image-library/assets/generated/${kind}-800.webp`);

  // Cached images may finish before React attaches its load handler during hydration.
  useEffect(() => {
    const element = imageRef.current;
    if (!element?.complete) return;
    if (element.naturalWidth > 0) setReady(true);
    else setFailed(true);
  }, []);

  useSceneMotion(imageRef, root => {
    const timeline = gsap.timeline({ paused: true });
    if (!ready || failed) return timeline;
    return timeline.fromTo(root,
      { scale: 1.055, y: 8, opacity: .72, willChange: 'transform, opacity' },
      { scale: 1, y: 0, opacity: 1, duration: .95, ease: 'power2.out', clearProps: 'transform,opacity,willChange' },
    );
  }, [ready, failed]);

  useEffect(() => {
    const frame = frameRef.current;
    const depth = depthRef.current;
    if (!ready || failed || !frame || !depth) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let inView = false;
    let toX: ReturnType<typeof gsap.quickTo>;
    let toY: ReturnType<typeof gsap.quickTo>;
    let toRotationX: ReturnType<typeof gsap.quickTo>;
    let toRotationY: ReturnType<typeof gsap.quickTo>;
    const context = gsap.context(() => {
      const options = { duration: .65, ease: 'power2.out' };
      toX = gsap.quickTo(depth, 'x', options);
      toY = gsap.quickTo(depth, 'y', options);
      toRotationX = gsap.quickTo(depth, 'rotationX', options);
      toRotationY = gsap.quickTo(depth, 'rotationY', options);
    }, frame);

    const reset = (immediate: boolean) => {
      if (immediate) {
        [toX, toY, toRotationX, toRotationY].forEach(quick => quick.tween.pause());
        context.add(() => gsap.set(depth, { x: 0, y: 0, rotationX: 0, rotationY: 0 }));
      } else {
        toX(0); toY(0); toRotationX(0); toRotationY(0);
      }
    };
    const move = (event: PointerEvent) => {
      if (!inView || document.hidden || reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      const bounds = frame.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      toX(x * 3); toY(y * 3); toRotationX(-y * .65); toRotationY(x * .8);
    };
    const leave = () => reset(reduced.matches || document.hidden || !finePointer.matches);
    const onEnvironmentChange = () => {
      if (document.hidden || reduced.matches || !finePointer.matches) reset(true);
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) reset(true);
    }) : undefined;

    if (observer) observer.observe(frame);
    else inView = true;
    frame.addEventListener('pointermove', move);
    frame.addEventListener('pointerleave', leave);
    frame.addEventListener('pointercancel', leave);
    document.addEventListener('visibilitychange', onEnvironmentChange);
    reduced.addEventListener('change', onEnvironmentChange);
    finePointer.addEventListener('change', onEnvironmentChange);

    return () => {
      observer?.disconnect();
      frame.removeEventListener('pointermove', move);
      frame.removeEventListener('pointerleave', leave);
      frame.removeEventListener('pointercancel', leave);
      document.removeEventListener('visibilitychange', onEnvironmentChange);
      reduced.removeEventListener('change', onEnvironmentChange);
      finePointer.removeEventListener('change', onEnvironmentChange);
      context.revert();
    };
  }, [ready, failed]);

  return <figure
    className={`editorial-image ${className}`.trim()}
    aria-label={sceneLabel}
    data-editorial-image={kind}
    data-image-state={failed ? 'fallback' : ready ? 'ready' : 'loading'}
    style={{ '--editorial-native-aspect': `${image.width} / ${image.height}` } as CSSProperties}
  >
    <div ref={frameRef} className="editorial-image__frame">
      {failed ? <div className="editorial-image__fallback" aria-hidden="true">
        <svg viewBox="0 0 24 24"><use href="#i-book" /></svg>
        <span>{image.fallback}</span>
      </div> : <div ref={depthRef} className="editorial-image__depth">
        <img
          ref={imageRef}
          className="editorial-image__photo"
          src={source}
          srcSet={`${smallSource} ${image.smallWidth}w, ${source} ${image.width}w`}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      </div>}
    </div>
    {caption && <figcaption className="editorial-image__caption">{caption}</figcaption>}
  </figure>;
}

export default function EditorialImage(props: EditorialImageProps) {
  return <EditorialImageScene key={props.kind} {...props} />;
}
