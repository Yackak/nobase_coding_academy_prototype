import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { useSceneMotion } from '../hooks/useSceneMotion';
import EditorialImage from './EditorialImage';

const stages = [
  { id: 'diagnosis', label: '현재 수준 확인', summary: '과목별 이해도와 학습 고민부터', short: '진단', eyebrow: '지금의 이해에서 시작하는 학습', title: '영어·수학 진단 노트', intro: '얼마나 배웠는지보다, 어떤 부분에서 막히는지 먼저 살펴봅니다.', rows: [['영어 기본기 살펴보기', '어휘 · 문장 이해 · 독해의 출발점', '영어'], ['수학 개념 확인하기', '배운 개념을 설명하고 적용할 수 있나요?', '수학'], ['학교 학습 상황 알아보기', '최근 시험과 평소 학습 습관을 돌아봐요.', '진단']], note: '틀린 문제는 부족한 부분을 알려주는 힌트예요. 지금의 이해에서 차근차근 시작해요.' },
  { id: 'plan', label: '나에게 맞는 학습 계획', summary: '학교 진도와 부족한 개념을 함께', short: '계획', eyebrow: '학생에게 필요한 다음 한 걸음', title: '나에게 맞는 학습 계획', intro: '현재 수준과 학교 진도에 맞춰 이번 학습의 우선순위를 정합니다.', rows: [['영어 학습 목표 정하기', '보완할 어휘와 문법, 독해 내용을 정해요.', '영어'], ['수학 학습 순서 세우기', '취약 개념부터 문제 적용까지 연결해요.', '수학'], ['내신 일정 함께 확인하기', '학교 시험 범위와 준비 과정을 살펴봐요.', '계획']], note: '무조건 빠른 진도보다, 이해하고 넘어갈 수 있는 계획이 중요해요.' },
  { id: 'study', label: '수업과 복습', summary: '영어 문장과 수학 풀이를 내 것으로', short: '복습', eyebrow: '배운 내용을 내 것으로 만드는 시간', title: '수업과 복습 노트', intro: '설명 듣기에서 끝나지 않고, 직접 풀고 다시 확인합니다.', rows: [['배운 내용 직접 설명하기', '영어 문장과 수학 개념을 내 말로 표현해요.', '이해'], ['문제에 적용해 보기', '문법·독해와 개념·유형 문제를 연습해요.', '적용'], ['오답의 이유 다시 짚기', '어디에서 헷갈렸는지 확인하고 다시 풀어요.', '복습']], note: '정답을 기억하는 것보다 풀이의 이유를 이해하는 연습을 이어가요.' },
  { id: 'feedback', label: '내신 점검과 피드백', summary: '시험 범위와 오답을 확인하고 다음 목표로', short: '피드백', eyebrow: '학교 학습과 연결하는 점검', title: '내신 점검과 피드백', intro: '시험 준비 과정과 취약한 부분을 점검하고 다음 학습으로 이어갑니다.', rows: [['학교 시험 범위 점검하기', '배운 내용 중 빠진 부분이 없는지 확인해요.', '내신'], ['취약 유형 보완하기', '반복되는 오답과 서술형 풀이를 돌아봐요.', '보완'], ['다음 학습 목표 정하기', '점검한 내용을 바탕으로 학습 방향을 조정해요.', '피드백']], note: '점수와 함께 학습 과정도 돌아보며, 다음 시험을 위한 기본기를 쌓아가요.' },
] as const;

export default function LearningSystem() {
  const [selected, setSelected] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const previousStage = useRef(0);
  const stage = stages[selected] ?? stages[0];

  useSceneMotion(reportRef, root => {
    const select = gsap.utils.selector(root);
    const previous = previousStage.current;
    previousStage.current = selected;
    return gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      .fromTo(select('.learning-route-fill'), { scaleX: previous / 3 }, { scaleX: selected / 3, duration: .5 }, 0)
      .from(select('.learning-route-step.is-current .learning-route-dot'), { scale: .75, duration: .4 }, .12)
      .from(select('.report-row-check path'), { strokeDashoffset: 24, duration: .25, stagger: .12 }, .12)
      .from(select('.row-title-mark'), { scaleX: 0, transformOrigin: 'left center', duration: .4, stagger: .1 }, .12)
      .from(select('.report-row p'), { y: 5, opacity: .3, duration: .3, stagger: .1 }, .2);
  }, [selected]);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stages.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + stages.length - 1) % stages.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = stages.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setSelected(next);
      tabsRef.current[next]?.focus();
    }
  }

  return <section className="system section" id="system" aria-labelledby="system-title">
    <div className="container">
      <div className="system-intro">
        <div className="system-copy">
        <span className="section-label">THE NOBASE WAY <span>03 — 학습관리</span></span>
        <h2 id="system-title">배우는 순간부터<br />스스로 풀 수 있을 때까지.</h2>
        <p>어디에서 막히는지 살피고, 필요한 학습을 정합니다.<br /> 개념 이해부터 복습과 내신 점검까지.</p>
        </div>
        <EditorialImage kind="learning-plan" className="system-visual" caption="작은 계획이 꾸준한 배움으로 이어지도록" />
      </div>
      <div className="system-grid">
      <div className="system-steps">
        <p className="system-step-label">네 단계로 살펴보는 노베이스의 학습관리</p>
        <div className="system-tabs" role="tablist" aria-label="학습관리 단계" aria-orientation="vertical">
          {stages.map((item, index) => <button
            key={item.id}
            ref={element => { tabsRef.current[index] = element; }}
            id={`tab-${item.id}`}
            className={`system-tab${index === selected ? ' active' : ''}`}
            type="button"
            role="tab"
            aria-selected={index === selected}
            aria-controls="learning-panel"
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={event => onTabKey(event, index)}
          ><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.label}</strong><small>{item.summary}</small></div><svg aria-hidden="true"><use href="#i-arrow" /></svg></button>)}
        </div>
        <a className="report-jump text-link" href="#learning-panel">선택한 단계의 예시 보기<svg aria-hidden="true"><use href="#i-arrow" /></svg></a>
      </div>

      <div className="learning-preview">
        <div ref={reportRef} className="report" id="learning-panel" role="tabpanel" aria-labelledby={`tab-${stage.id}`} tabIndex={0}>
          <div className="report-header"><span className="report-brand"><svg aria-hidden="true"><use href="#i-sprout" /></svg>NOBASE</span><span className="example-label">학습관리 예시</span></div>
          <div className="report-title-line"><div><small id="report-eyebrow">{stage.eyebrow}</small><h3 id="report-title">{stage.title}</h3></div><span className="report-number" id="report-number">{String(selected + 1).padStart(2, '0')}</span></div>
          <p className="report-intro" id="report-intro">{stage.intro}</p>

          <div className="learning-route" aria-hidden="true" style={{ '--route-progress': selected / 3 } as CSSProperties}>
            <div className="learning-route-line"><span className="learning-route-fill" /></div>
            <ol>{stages.map((item, index) => <li key={item.id} className={`learning-route-step${index < selected ? ' is-complete' : ''}${index === selected ? ' is-current' : ''}`}>
              <span className="learning-route-dot">{index < selected ? <svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10" /></svg> : String(index + 1).padStart(2, '0')}</span><span>{item.short}</span>
            </li>)}</ol>
          </div>

          <div className="report-body" id="report-body">
            {stage.rows.map(([title, description, badge], index) => <div className="report-row" key={index}>
              <svg className="report-row-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10" /></svg>
              <div><span className="report-row-title"><span className="row-title-mark" aria-hidden="true" />{title}</span><p>{description}</p></div><span>{badge}</span>
            </div>)}
          </div>
          <div className="teacher-note"><span>함께 생각해요</span><p id="report-note">{stage.note}</p><svg aria-hidden="true"><use href="#i-sprout" /></svg></div>
          <div className="report-footer"><span>ONE STEP AT A TIME</span><span>노베이스 학원</span></div>
        </div>
        <p className="sample-note">이해를 돕기 위한 예시이며 실제 학생의 기록이 아닙니다.<br /> 세부 관리 방식과 피드백 주기는 과정에 따라 안내합니다.</p>
      </div>
    </div>
    </div>
  </section>;
}
