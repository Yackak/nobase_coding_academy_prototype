(() => {
  'use strict';
  const config = window.NOBASE_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dialog = $('#contact-dialog');
  let selectedInterest = '';
  let toastTimer;

  const stages = [
    {eyebrow:'나의 코딩 출발점을 알아가는 시간',title:'코딩 출발점 노트',intro:'코드를 쓰기 전에, 생각을 풀어내는 방법부터 살펴봅니다.',rows:[['문제를 작은 단계로 나누기','순서를 정해 생각할 수 있나요?','논리'],['반복되는 규칙 찾아보기','같은 행동을 묶어 표현해요.','패턴'],['내가 만들고 싶은 것 이야기하기','흥미에서 출발하는 첫 프로젝트','관심']],note:'코딩 경험이 없어도 괜찮아요. 어떻게 생각했는지부터 함께 살펴봐요.'},
    {eyebrow:'나에게 필요한 다음 한 걸음',title:'이번 주 코딩 계획',intro:'무엇을 만들지 정하고, 필요한 개념을 하나씩 연결합니다.',rows:[['오늘의 목표 정하기','키보드로 움직이는 캐릭터 만들기','목표'],['필요한 개념 연결하기','이벤트 · 좌표 · 조건문','개념'],['작은 기능부터 구현하기','한 번에 한 가지 기능씩 완성해요.','실행']],note:'어려운 기능도 작게 나누면 시작할 수 있어요. 오늘 할 수 있는 것부터 해봐요.'},
    {eyebrow:'직접 만들며 이해하는 시간',title:'만들고, 고치는 노트',intro:'따라 쓰기에서 한 걸음 더, 코드가 움직이는 이유를 배웁니다.',rows:[['예제의 동작 예상하기','실행하기 전에 결과를 생각해요.','예측'],['내 아이디어로 바꿔 보기','조건과 숫자를 바꾸면 어떻게 될까요?','실습'],['오류의 원인 찾아보기','예상과 다른 부분을 하나씩 확인해요.','디버깅']],note:'오류는 실패가 아니라 힌트예요. 고치는 과정도 코딩의 중요한 일부입니다.'},
    {eyebrow:'성장을 확인하는 시간',title:'나의 프로젝트 회고',intro:'완성한 결과와 만들어 온 과정을 함께 돌아봅니다.',rows:[['내 코드 직접 설명하기','어떤 생각으로 만들었는지 이야기해요.','발표'],['잘한 점과 어려웠던 점 찾기','이번 프로젝트에서 배운 것을 정리해요.','회고'],['다음 기능 상상하기','한 가지 개선할 점을 정해요.','다음 목표']],note:'완성한 작품만큼, 끝까지 생각하고 고쳐 본 경험이 소중해요.'}
  ];
  function selectStage(index, moveFocus = false) {
    const stage = stages[index];
    const tabs = $$('.system-tab');
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    $('#learning-panel').setAttribute('aria-labelledby', tabs[index].id);
    $('#report-eyebrow').textContent = stage.eyebrow;
    $('#report-title').textContent = stage.title;
    $('#report-number').textContent = String(index + 1).padStart(2, '0');
    $('#report-intro').textContent = stage.intro;
    $('#report-note').textContent = stage.note;
    $('#report-body').replaceChildren(...stage.rows.map(([title, description, badge]) => {
      const row = document.createElement('div');
      row.className = 'report-row';
      row.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg><div><span></span><p></p></div><span></span>';
      $('div > span', row).textContent = title;
      $('p', row).textContent = description;
      $(':scope > span', row).textContent = badge;
      return row;
    }));
    if (moveFocus) tabs[index].focus();
  }
  $$('.system-tab').forEach((tab, index) => {
    tab.addEventListener('click', () => selectStage(index));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % stages.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + stages.length - 1) % stages.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = stages.length - 1;
      if (next !== undefined) {event.preventDefault();selectStage(next, true);}
    });
  });
  selectStage(0);

  function notify(message) {
    clearTimeout(toastTimer);
    $('.toast').textContent = message;
    $('.toast').classList.add('show');
    toastTimer = setTimeout(() => $('.toast').classList.remove('show'), 3200);
  }
  function inquiry() {
    return `안녕하세요, 노베이스 학원 코딩 수업을 문의드립니다.\n학생 학년: \n관심 과정: ${selectedInterest || '스크래치 / 파이썬 / 웹 프로젝트'}\n코딩 경험: \n궁금한 점: `;
  }
  async function copyText(text, label) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      notify(label);
    } catch {
      if (!dialog.open) dialog.showModal();
      $('#inquiry-text').textContent = text;
      let area = $('.manual-copy', dialog);
      if (!area) {area = document.createElement('textarea');area.className = 'manual-copy';area.readOnly = true;area.setAttribute('aria-label','복사할 문구');$('.inquiry-preview').append(area);}
      area.value = text;area.focus();area.select();
      notify('문구를 선택했습니다. 길게 눌러 복사하거나 ⌘C / Ctrl+C를 눌러 주세요.');
    }
  }
  function showContact(interest = '') {
    selectedInterest = interest;
    $('#inquiry-text').textContent = inquiry();
    $('.manual-copy', dialog)?.remove();
    if (!dialog.open) dialog.showModal();
  }
  function validHttps(value) {
    try {return new URL(value).protocol === 'https:';} catch {return false;}
  }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => {
    selectedInterest = button.dataset.interest || '';
    if (button.dataset.contact === 'kakao' && validHttps(config.kakaoUrl)) {
      window.open(config.kakaoUrl, '_blank', 'noopener,noreferrer');
    } else if (button.dataset.contact === 'phone' && config.phone && !config.demoMode) {
      const phone = config.phone.replace(/[^\d+]/g, '');
      if (window.matchMedia('(max-width: 700px)').matches) window.location.href = `tel:${phone}`;
      else copyText(config.phone, '전화번호를 복사했습니다.');
    } else showContact(selectedInterest);
  }));
  $$('.copy-inquiry').forEach(button => button.addEventListener('click', () => {
    if (!dialog.open) selectedInterest = '';
    copyText(inquiry(), '상담 문의 문구를 복사했습니다.');
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  const menuButton = $('.menu-toggle');
  const menu = $('#mobile-menu');
  function closeMenu(returnFocus = false) {
    menu.hidden = true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','메뉴 열기');
    if (history.state?.nobaseMenu) history.replaceState(null, '', location.href);
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    if (!menu.hidden) {closeMenu();return;}
    menu.hidden = false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','메뉴 닫기');
    history.pushState({nobaseMenu:true}, '', location.href);
  });
  $$('a,button', menu).forEach(item => item.addEventListener('click', () => closeMenu()));
  window.addEventListener('popstate', () => closeMenu());
  document.addEventListener('keydown', event => {if (event.key === 'Escape' && !menu.hidden) closeMenu(true);});
  document.addEventListener('click', event => {if (!menu.hidden && !$('.site-header').contains(event.target)) closeMenu();});
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {if(event.matches) closeMenu();});

  for (const key of ['subjects','schedule','tuition']) {
    if (config[key]) $$(`[data-info="${key}"], [data-faq="${key}"]`).forEach(el => el.textContent = config[key]);
  }
  if (config.address) $('#address-text').textContent = config.address;
  if (validHttps(config.mapUrl)) {$('#map-link').href = config.mapUrl;$('#map-link').hidden = false;}
  if (config.phone && !config.demoMode) {
    $('#copy-phone').hidden = false;
    $('#copy-phone').lastChild.textContent = `${config.phone} 복사`;
    $('#copy-phone').addEventListener('click', () => copyText(config.phone, '전화번호를 복사했습니다.'));
  }
  if (config.consultationHours) $('#contact-status').textContent = `${config.consultationHours}${config.demoMode ? ' · 운영시간 예시' : ''}`;
  $('#copyright-year').textContent = new Date().getFullYear();

  const navLinks = $$('.desktop-nav a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));});
    }, {rootMargin:'-15% 0px -55% 0px',threshold:0});
    navLinks.forEach(link => {const section = $(link.hash);if(section) observer.observe(section);});
  }
})();
