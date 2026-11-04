import Header from './components/Header';
import HeroScene from './components/HeroScene';
import LearningSystem from './components/LearningSystem';
import ProgramCard, { programs } from './components/ProgramCard';
import ResponsiveDetails from './components/ResponsiveDetails';
import { ContactProvider, useContact } from './components/ContactProvider';
import { config } from './config';
import { useSectionEntrances } from './hooks/useSectionEntrances';

function Page() {
  useSectionEntrances();
  const { contact, copyInquiry, copyAddress, copyPhone } = useContact();
  return <>
  <a className="skip-link" href="#main">본문으로 바로가기</a>
  <svg className="svg-library" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></symbol>
    <symbol id="i-diagonal" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11c0 4.4-4 8-9 8-1 0-2-.1-3-.4L4 21l1-5C3.1 14.6 3 13 3 11c0-4.4 4-8 9-8s9 3.6 9 8Z"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="m8 3 3 5-3 3c1 3 2 4 5 5l3-3 5 3c0 3-2 5-5 5C9 20 4 15 3 8c0-3 2-5 5-5Z"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/></symbol>
    <symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 21v-8m0 3C4 16 2 10 3 5c7 0 10 4 9 11Zm0-3c0-7 4-11 10-10 0 6-3 10-10 10Z"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol>
  </defs></svg>

  <Header />

  <main id="main">
    <div className="academy-banner"><span className="banner-location">정읍 상동 · 영어 · 수학</span><span className="banner-enrollment">초등 고학년 · 중고 내신 집중관리</span></div>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow"><span className="green-dot"></span>기초부터 내신까지, NOBASE ACADEMY</div>
        <h1 id="hero-title">기초부터 차근차근,<br /> <span>스스로 풀 수</span><br />있을 때까지.</h1>
        <p>영어와 수학, 지금의 수준에서 시작합니다.<br /> 초등 고학년 기초부터 중·고등 내신까지.</p>
        <div className="hero-actions"><button className="button button-green" onClick={() => contact('phone')}>우리 아이 학습 상담<svg><use href="#i-arrow"/></svg></button><a className="text-link" href="#programs">교육과정 살펴보기<svg><use href="#i-diagonal"/></svg></a></div>
        <div className="hero-note"><svg><use href="#i-sprout"/></svg>가능성은 기초에서 자랍니다.</div>
      </div>
      <HeroScene />
    </section>

    <div className="principles container" aria-label="노베이스의 세 가지 교육 방향">
      <div><span className="principle-number">01</span><p><strong>출발점은 달라도 괜찮아요</strong><span>부족한 기초부터 차근차근 채우도록</span></p></div>
      <div><span className="principle-number">02</span><p><strong>진도보다 이해가 먼저예요</strong><span>영어의 문장과 수학의 원리를 이해하도록</span></p></div>
      <div><span className="principle-number">03</span><p><strong>작은 성장이 습관이 되도록</strong><span>꾸준한 복습이 내신 자신감이 되도록</span></p></div>
    </div>

    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div><span className="section-label">OUR PHILOSOPHY <span>01 — 학원 소개</span></span><h2 id="about-title">모르는 건,<br /> <span className="soft-green">시작할 수 있다는 뜻.</span></h2></div>
        <div className="about-copy"><p className="lead">영어가 막막해도, 수학이 어렵게 느껴져도.<br /> 지금의 출발점에서 다시 시작할 수 있습니다.</p><p>어디까지 배웠는지보다 어디에서 막혔는지.<br /> 정답을 맞혔는지보다 풀이를 이해했는지.<br /> 노베이스는 기초를 채우고 스스로 공부하는 힘을 기릅니다.</p><a className="text-link" href="#system">노베이스가 생각하는 배움<svg><use href="#i-arrow"/></svg></a></div>
        <div className="about-bottom"><span className="little-flower" aria-hidden="true">✳</span><p>기초를 채우고, 이해를 넓히고. <strong>꾸준한 학습을 내신 자신감으로.</strong></p><span className="small-caps">GROW AT YOUR OWN PACE</span></div>
      </div>
    </section>

    <section className="programs section container" id="programs" aria-labelledby="programs-title">
      <div className="section-top"><div><span className="section-label">LEARNING JOURNEY <span>02 — 교육과정</span></span><h2 id="programs-title">초등의 기초부터<br />중·고등 내신까지.</h2></div><p>영어와 수학, 학년마다 필요한 학습에 집중합니다.<br /> 현재 수준과 학교 진도를 고려한 과정 안내.</p></div>
      <div className="program-grid">{programs.map(program => <ProgramCard key={program.level} program={program} />)}</div>
      <p className="section-footnote"><span>안내</span>학생의 학년과 관심 과목, 현재 학습 상황을 알려주시면 수강 가능한 과정과 일정을 안내합니다.</p>
    </section>

    <LearningSystem />

    <section className="guide section container" id="guide" aria-labelledby="guide-title">
      <div className="guide-heading"><span className="section-label">BEFORE WE START <span>04 — 수강 안내</span></span><h2 id="guide-title">시작하기 전,<br /> 함께 확인해요.</h2><p>학생의 학년과 현재 수준에 맞는 수업을 찾도록.<br /> 모집 대상과 수강 안내를 먼저 확인해 주세요.</p><a href="#contact" className="text-link">상담 안내 보기<svg><use href="#i-arrow"/></svg></a></div>
      <div className="guide-list"><div><span>01</span><h3>영어 · 수학, 기초부터 내신까지</h3><p data-info="subjects">{config.subjects}</p></div><div><span>02</span><h3>학년에 맞는 수업 일정</h3><p data-info="schedule">{config.schedule}</p></div><div><span>03</span><h3>과정별 수강 안내</h3><p data-info="tuition">{config.tuition}</p></div></div>
    </section>

    <section className="faq section" id="faq" aria-labelledby="faq-title"><div className="container faq-grid"><div><span className="section-label">QUESTIONS & ANSWERS</span><h2 id="faq-title">궁금한 마음,<br /> 미리 살펴보세요.</h2><p>처음이라 궁금한 것들을 모았습니다.</p><span className="faq-mark" aria-hidden="true">Q.</span></div><div className="faq-list">
      <ResponsiveDetails desktopOpen><summary><span>영어나 수학 기초가 부족해도 시작할 수 있나요?</span><span className="faq-plus" aria-hidden="true"></span></summary><div className="faq-answer">기초부터 차근차근 이해하는 학습을 지향합니다. 학생의 학년과 어려워하는 부분을 먼저 알려주세요. 현재 수준과 학습 상황을 상담한 뒤 적합한 과정을 함께 살펴봅니다.</div></ResponsiveDetails>
      <ResponsiveDetails><summary><span>어떤 학년과 과목을 모집하나요?</span><span className="faq-plus" aria-hidden="true"></span></summary><div className="faq-answer" data-faq="subjects">{config.subjects}</div></ResponsiveDetails>
      <ResponsiveDetails><summary><span>중·고등학생은 내신 대비가 가능한가요?</span><span className="faq-plus" aria-hidden="true"></span></summary><div className="faq-answer">중·고등학생은 영어·수학 내신 집중관리를 중심으로 안내합니다. 학교 진도와 시험 범위, 취약한 단원 등을 함께 확인합니다. 학교·학년별 수강 가능 여부와 구체적인 지도 방식은 상담 시 안내합니다.</div></ResponsiveDetails>
      <ResponsiveDetails><summary><span>상담 전에 무엇을 준비하면 좋을까요?</span><span className="faq-plus" aria-hidden="true"></span></summary><div className="faq-answer">학생의 학년, 관심 과목(영어·수학), 최근 학습에서 어려웠던 점을 알려주세요. 중·고등학생은 학교 진도와 시험 준비 상황을 함께 이야기해 주시면 상담에 도움이 됩니다.</div></ResponsiveDetails>
      <ResponsiveDetails><summary><span>수강료와 교재는 어떻게 안내받나요?</span><span className="faq-plus" aria-hidden="true"></span></summary><div className="faq-answer">수강료, 수업 횟수와 시간, 교재와 별도 비용은 학년과 과목에 따라 상담 시 안내합니다. 등록 전에 자세한 수강 조건을 확인해 주세요.</div></ResponsiveDetails>
    </div></div></section>

    <section className="contact section container" id="contact" aria-labelledby="contact-title"><div className="contact-main"><div className="contact-heading"><span className="section-label">YOUR FIRST STEP <span>05 — 상담 안내</span></span><h2 id="contact-title">지금의 고민부터<br />편하게 말씀해 주세요.</h2><p>영어가 어려운 이유, 수학에서 막히는 부분.<br /> 지금의 학습 고민부터 함께 이야기해 주세요.</p><div className="contact-actions"><button className="button button-green" onClick={() => contact('phone')}><svg><use href="#i-phone"/></svg>전화로 상담하기</button><button className="button button-kakao" onClick={() => contact('kakao')}><svg><use href="#i-chat"/></svg>{config.kakaoUrl ? '카카오톡 상담' : '카카오톡 준비 중'}</button></div><p className="mobile-contact-hint">하단의 전화 상담 버튼으로 편하게 문의해 주세요.</p><p className="contact-status" id="contact-status"><span className="status-dot"></span>{config.kakaoUrl ? '카카오톡으로 편하게 학습 상담을 남겨주세요.' : '카카오톡 상담 링크는 추후 업데이트할 예정입니다.'}</p></div><div className="consultation-note"><span className="note-top">상담은 이렇게 시작해요</span><ol><li><span>1</span><div><strong>학생의 이야기를 들려주세요</strong><p>학년 · 영어/수학 · 학습 고민</p></div></li><li><span>2</span><div><strong>맞는 수업을 함께 살펴봐요</strong><p>수업 방식 · 일정 · 수강 안내</p></div></li><li><span>3</span><div><strong>다음 한 걸음을 정해요</strong><p>필요한 안내 확인 후 시작 결정</p></div></li></ol><button className="copy-inquiry text-link" onClick={copyInquiry}><svg><use href="#i-copy"/></svg>상담 문의 예시 복사</button></div></div>
      <div className="location-card" aria-labelledby="location-title">
        <div className="location-info"><span className="section-label">COME SAY HELLO</span><h3 id="location-title">노베이스 학원 오시는 길</h3><p id="address-text">{config.address}</p><p className="road-address">도로명: {config.roadAddress}</p><p className="visit-note">방문 상담 전 전화로 일정을 확인해 주세요.</p><div className="location-tools"><button id="copy-address" onClick={copyAddress} className="text-link"><svg><use href="#i-copy"/></svg>주소 복사</button><button id="copy-phone" onClick={copyPhone} className="text-link"><svg><use href="#i-copy"/></svg>전화번호 복사</button></div></div>
        <a id="map-link" className="naver-map-link" href={config.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="네이버 지도에서 정읍시 상동 74-1 위치 보기, 새 창"><span className="map-provider"><b>N</b> NAVER MAP</span><svg className="map-pin" aria-hidden="true"><use href="#i-pin"/></svg><strong>네이버 지도에서 위치 보기</strong><span>정읍시 상동 74-1 <svg aria-hidden="true"><use href="#i-diagonal"/></svg></span></a>
      </div>
    </section>
  </main>

  <footer className="site-footer"><div className="container"><div className="footer-top"><a className="footer-brand" href="#">노베이스 학원<span>NOBASE ACADEMY</span></a><p>가능성은 기초에서 자랍니다.</p><a className="back-top" href="#" aria-label="페이지 맨 위로"><svg><use href="#i-arrow"/></svg></a></div><div className="footer-bottom"><span>© <span id="copyright-year">2026</span> NOBASE ACADEMY.</span><span>기초부터 차근차근, 스스로 풀 수 있을 때까지.</span></div></div></footer>


  </>;
}

export default function App() { return <ContactProvider><Page /></ContactProvider>; }
