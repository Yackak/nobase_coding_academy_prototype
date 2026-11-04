import { useRef } from 'react';
import { gsap } from 'gsap';
import { useSceneMotion } from '../hooks/useSceneMotion';

export type CourseLevel = 'elementary' | 'middle' | 'high';

const descriptions: Record<CourseLevel, string> = {
  elementary: '학습 예시. I can learn. 문장을 완성하고 2분의 1 더하기 4분의 1은 4분의 3이라는 분수의 개념을 연결합니다.',
  middle: '학습 예시. Practice makes progress. 문장의 핵심을 살펴보고 개념, 복습, 확인의 순서로 점검합니다.',
  high: '학습 예시. 2x 더하기 4는 10. 양변에서 4를 빼면 2x는 6. 양변을 2로 나누면 x는 3입니다.',
};

function Check({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10" /></svg>;
}

export default function CourseScene({ level }: { level: CourseLevel }) {
  const sceneRef = useRef<HTMLElement>(null);

  useSceneMotion(sceneRef, root => {
    const select = gsap.utils.selector(root);
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    if (level === 'elementary') {
      timeline
        .from(select('.word-tile'), { x: -18, y: 10, rotation: -5, opacity: .2, stagger: .12, duration: .5 }, 0)
        .from(select('.math-unit'), { y: 12, scale: .75, opacity: 0, stagger: .12, duration: .45 }, .4)
        .from(select('.math-result'), { scale: .8, opacity: 0, duration: .35 }, .8);
    } else if (level === 'middle') {
      timeline
        .from(select('.sentence-underline'), { scaleX: 0, transformOrigin: 'left center', duration: .65 }, 0)
        .from(select('.review-cell'), { y: 8, opacity: .2, stagger: .1, duration: .35 }, .35)
        .from(select('.review-cell path'), { strokeDashoffset: 24, stagger: .1, duration: .3 }, .6);
    } else {
      timeline
        .from(select('.equation-step'), { x: 16, opacity: .1, stagger: .22, duration: .4 }, 0)
        .from(select('.equation-link'), { scaleY: 0, transformOrigin: 'center top', stagger: .22, duration: .25 }, .2)
        .from(select('.equation-check path'), { strokeDashoffset: 24, duration: .35 }, .8);
    }
    return timeline;
  }, [level]);

  return (
    <figure ref={sceneRef} className={`course-scene course-scene-${level}`} role="img" aria-label={descriptions[level]}>
      <figcaption><span>LEARNING NOTE</span><span>학습 예시</span></figcaption>
      {level === 'elementary' && <div className="course-scene-content" aria-hidden="true">
        <div className="word-tiles"><span className="word-tile">I</span><span className="word-tile">can</span><span className="word-tile word-tile-green">learn.</span></div>
        <div className="mini-equation"><span className="math-unit"><i className="fraction-half" />½</span><b>+</b><span className="math-unit"><i className="fraction-quarter" />¼</span><b>=</b><span className="math-result">¾</span></div>
      </div>}
      {level === 'middle' && <div className="course-scene-content" aria-hidden="true">
        <p className="course-sentence"><span>Practice<span className="sentence-underline" /></span> makes progress.</p>
        <div className="review-cells">{['개념', '복습', '확인'].map(label => <span className="review-cell" key={label}><Check />{label}</span>)}</div>
      </div>}
      {level === 'high' && <div className="course-equations" aria-hidden="true">
        <div className="equation-step"><span>01</span><p>2x + 4 = 10</p></div>
        <span className="equation-link" />
        <div className="equation-step"><span>02</span><p>2x = 6</p></div>
        <span className="equation-link" />
        <div className="equation-step equation-final"><span>03</span><p>x = 3</p><Check className="equation-check" /></div>
      </div>}
    </figure>
  );
}
