import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import gsap from 'gsap';
import { asset } from '../lib/assets';

const layers = ['book', 'sprout-closed', 'sprout', 'pencil'] as const;
export default function HeroScene() {
  const scene = useRef<HTMLElement>(null);
  const depth = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const visible = useRef(false);
  const userPaused = useRef(false);
  const hasReduced = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const loaded = useRef(new Set<string>());

  useEffect(() => {
    const images = [...(scene.current?.querySelectorAll<HTMLImageElement>('.scene-stage img') || [])];
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) loaded.current.add(img.src.split('/').pop()!.replace('.webp', ''));
      else if (img.complete) setFailed(true);
    });
    if (loaded.current.size === layers.length) setReady(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(media.matches);
      if (media.matches) { hasReduced.current = true; userPaused.current = false; setCompleted(true); }
      if (media.matches && depth.current) { gsap.killTweensOf(depth.current); gsap.set(depth.current, { rotateX: 0, rotateY: 0 }); }
    };
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    if (!ready || failed || !scene.current) return;
    const element = scene.current;
    let observer: IntersectionObserver | undefined;
    const updatePlayback = () => {
      const animation = timeline.current;
      if (!animation || animation.progress() === 1) return;
      const play = visible.current && !document.hidden && !userPaused.current && !reduced;
      if (play) animation.play(); else animation.pause();
      setPlaying(play);
    };
    const context = gsap.context(() => {
      if (reduced) { setPlaying(false); return; }
      const animation = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' }, onComplete: () => { setPlaying(false); setCompleted(true); } });
      timeline.current = animation;
      animation.fromTo('.scene-book', { y: 16, rotation: -1.2 }, { y: 0, rotation: 0, duration: .6 }, 0)
        .fromTo('.scene-sprouts', { scaleY: .18, opacity: 0 }, { scaleY: 1, opacity: 1, duration: .7, transformOrigin: '47.7% 84.5%' }, .35)
        .fromTo('.scene-sprout-closed', { opacity: 1 }, { opacity: 0, duration: .5 }, .65)
        .fromTo('.scene-sprout', { opacity: 0 }, { opacity: 1, duration: .5 }, .65)
        .fromTo('.scene-pencil', { x: -13, y: 10, rotation: -7 }, { x: 0, y: 0, rotation: 0, duration: .8 }, 1)
        .fromTo('.scene-underline', { scaleX: 0 }, { scaleX: 1, duration: .65, transformOrigin: 'left center' }, 1.05)
        .fromTo('.scene-chip', { y: 12, opacity: 0, rotation: -3 }, { y: 0, opacity: 1, rotation: 0, stagger: .15, duration: .65 }, 1.6);
      if (hasReduced.current) animation.progress(1).pause();
      observer = new IntersectionObserver(entries => {
        visible.current = entries[0].isIntersecting;
        updatePlayback();
      }, { threshold: .2 });
      observer.observe(element);
    }, element);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', updatePlayback); context.revert(); timeline.current = null; };
  }, [ready, failed, reduced]);

  function togglePlayback() {
    const animation = timeline.current;
    if (!animation || reduced) return;
    if (playing) { userPaused.current = true; animation.pause(); setPlaying(false); }
    else {
      userPaused.current = false;
      if (animation.progress() === 1) { setCompleted(false); animation.restart(); } else animation.play();
      setPlaying(true);
    }
  }
  function move(event: PointerEvent<HTMLElement>) {
    if (!ready || failed || reduced || userPaused.current || !depth.current || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    gsap.to(depth.current, { rotateY: x * 4, rotateX: -y * 4, duration: .45, overwrite: true });
  }
  function resetDepth() { if (depth.current) gsap.to(depth.current, { rotateX: 0, rotateY: 0, duration: reduced ? 0 : .5, overwrite: true }); }
  useEffect(() => () => { if (depth.current) gsap.killTweensOf(depth.current); }, []);

  return <figure ref={scene} className={`hero-visual hero-scene${ready && !failed ? ' scene-ready' : ''}`} onPointerMove={move} onPointerLeave={resetDepth} aria-label="책에서 새싹이 자라는 노베이스 브랜드 일러스트">
    <img className="hero-image scene-poster" src={asset('assets/learning-hero.webp')} alt="펼친 책에서 새싹이 자라는 모습" width="1400" height="1120" fetchPriority="high" />
    <div ref={depth} className="scene-depth" aria-hidden="true">
      <div className="scene-stage">
        <div className="scene-halo" /><div className="scene-shadow" />
        <img className="scene-book" src={asset('assets/motion/book.webp')} alt="" width="960" height="960" onLoad={() => { loaded.current.add('book'); if (loaded.current.size === layers.length) setReady(true); }} onError={() => setFailed(true)} />
        <div className="scene-sprouts">
          {(['sprout-closed', 'sprout'] as const).map(name => <img key={name} className={`scene-${name}`} src={asset(`assets/motion/${name}.webp`)} alt="" width="560" height="560" onLoad={() => { loaded.current.add(name); if (loaded.current.size === layers.length) setReady(true); }} onError={() => setFailed(true)} />)}
        </div>
        <img className="scene-pencil" src={asset('assets/motion/pencil.webp')} alt="" width="560" height="560" onLoad={() => { loaded.current.add('pencil'); if (loaded.current.size === layers.length) setReady(true); }} onError={() => setFailed(true)} />
        <div className="scene-chip chip-english"><small>ENGLISH</small><strong>I can learn.</strong><span className="scene-underline" /></div>
        <div className="scene-chip chip-math"><small>MATH</small><strong>한 걸음씩, 차근차근.</strong><span>이해가 자신감이 되도록</span></div>
      </div>
    </div>
    <div className="scene-heading"><span>GROW AT YOUR OWN PACE</span><strong>가능성은 기초에서 자랍니다.</strong></div>
    {ready && !failed && !reduced && <button type="button" className="scene-control" onClick={togglePlayback} aria-label={playing ? '브랜드 애니메이션 일시정지' : '브랜드 애니메이션 재생'}><span aria-hidden="true">{playing ? 'Ⅱ' : '↻'}</span>{playing ? '잠시 멈춤' : completed ? '다시 보기' : '이어서 보기'}</button>}
    <figcaption>노베이스의 배움을 표현한 브랜드 일러스트</figcaption>
  </figure>;
}
