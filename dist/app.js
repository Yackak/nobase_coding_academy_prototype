(() => {
  'use strict';
  const config = window.NOBASE_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dialog = $('#contact-dialog');
  let selectedInterest = '';
  let toastTimer;
  let manualCopyValue = null;
  const defaultDialogTitle = $('#dialog-title').innerHTML;
  const defaultDialogDescription = $('#dialog-description').innerHTML;
  const defaultPreviewLabel = $('.inquiry-preview small', dialog).textContent;
  const dialogCopyButton = $('.copy-inquiry', dialog);
  const defaultCopyButton = dialogCopyButton.innerHTML;

  const stages = [
    {eyebrow:'지금의 이해에서 시작하는 학습',title:'영어·수학 진단 노트',intro:'얼마나 배웠는지보다, 어떤 부분에서 막히는지 먼저 살펴봅니다.',rows:[['영어 기본기 살펴보기','어휘 · 문장 이해 · 독해의 출발점','영어'],['수학 개념 확인하기','배운 개념을 설명하고 적용할 수 있나요?','수학'],['학교 학습 상황 알아보기','최근 시험과 평소 학습 습관을 돌아봐요.','진단']],note:'틀린 문제는 부족한 부분을 알려주는 힌트예요. 지금의 이해에서 차근차근 시작해요.'},
    {eyebrow:'학생에게 필요한 다음 한 걸음',title:'나에게 맞는 학습 계획',intro:'현재 수준과 학교 진도에 맞춰 이번 학습의 우선순위를 정합니다.',rows:[['영어 학습 목표 정하기','보완할 어휘와 문법, 독해 내용을 정해요.','영어'],['수학 학습 순서 세우기','취약 개념부터 문제 적용까지 연결해요.','수학'],['내신 일정 함께 확인하기','학교 시험 범위와 준비 과정을 살펴봐요.','계획']],note:'무조건 빠른 진도보다, 이해하고 넘어갈 수 있는 계획이 중요해요.'},
    {eyebrow:'배운 내용을 내 것으로 만드는 시간',title:'수업과 복습 노트',intro:'설명 듣기에서 끝나지 않고, 직접 풀고 다시 확인합니다.',rows:[['배운 내용 직접 설명하기','영어 문장과 수학 개념을 내 말로 표현해요.','이해'],['문제에 적용해 보기','문법·독해와 개념·유형 문제를 연습해요.','적용'],['오답의 이유 다시 짚기','어디에서 헷갈렸는지 확인하고 다시 풀어요.','복습']],note:'정답을 기억하는 것보다 풀이의 이유를 이해하는 연습을 이어가요.'},
    {eyebrow:'학교 학습과 연결하는 점검',title:'내신 점검과 피드백',intro:'시험 준비 과정과 취약한 부분을 점검하고 다음 학습으로 이어갑니다.',rows:[['학교 시험 범위 점검하기','배운 내용 중 빠진 부분이 없는지 확인해요.','내신'],['취약 유형 보완하기','반복되는 오답과 서술형 풀이를 돌아봐요.','보완'],['다음 학습 목표 정하기','점검한 내용을 바탕으로 학습 방향을 조정해요.','피드백']],note:'점수와 함께 학습 과정도 돌아보며, 다음 시험을 위한 기본기를 쌓아가요.'}
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
    return `안녕하세요, 노베이스 학원 영어·수학 수업을 문의드립니다.\n학생 학년: \n관심 과정: ${selectedInterest || '초등 고학년 / 중등 내신 / 고등 내신'}\n관심 과목: 영어 / 수학\n현재 학습 고민: \n궁금한 점: `;
  }
  async function copyText(text, label, allowManualCopy = true) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      notify(label);
    } catch {
      if (!allowManualCopy) {
        notify('번호를 복사하지 못했어요. 휴대폰에서 전화 상담 버튼을 이용해 주세요.');
        return;
      }
      manualCopyValue = text;
      $('#dialog-title').textContent = '복사할 내용';
      $('#dialog-description').textContent = '아래 내용을 선택해 직접 복사해 주세요.';
      $('.inquiry-preview small', dialog).textContent = '복사할 내용';
      dialogCopyButton.innerHTML = '<svg aria-hidden="true"><use href="#i-copy"/></svg>다시 복사하기';
      if (!dialog.open) dialog.showModal();
      $('#inquiry-text').textContent = text;
      let area = $('.manual-copy', dialog);
      if (!area) {area = document.createElement('textarea');area.className = 'manual-copy';area.readOnly = true;area.setAttribute('aria-label','복사할 내용');$('.inquiry-preview').append(area);}
      area.value = text;area.focus();area.select();
      notify('문구를 선택했습니다. 길게 눌러 복사하거나 ⌘C / Ctrl+C를 눌러 주세요.');
    }
  }
  function showContact(interest = '') {
    selectedInterest = interest;
    manualCopyValue = null;
    $('#dialog-title').innerHTML = defaultDialogTitle;
    $('#dialog-description').innerHTML = defaultDialogDescription;
    $('.inquiry-preview small', dialog).textContent = defaultPreviewLabel;
    dialogCopyButton.innerHTML = defaultCopyButton;
    $('#inquiry-text').textContent = inquiry();
    $('.manual-copy', dialog)?.remove();
    if (!dialog.open) dialog.showModal();
  }
  function validHttps(value) {
    try {return new URL(value).protocol === 'https:';} catch {return false;}
  }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => {
    const interest = button.dataset.interest || '';
    if (button.dataset.contact === 'kakao' && validHttps(config.kakaoUrl)) {
      window.open(config.kakaoUrl, '_blank', 'noopener,noreferrer');
    } else if (button.dataset.contact === 'phone' && config.phone && !config.demoMode) {
      const phone = config.phone.replace(/[^\d+]/g, '');
      if (window.matchMedia('(max-width: 700px)').matches) window.location.href = `tel:${phone}`;
      else copyText(config.phone, '전화번호를 복사했습니다.', false);
    } else showContact(interest);
  }));
  $$('.copy-inquiry').forEach(button => button.addEventListener('click', () => {
    if (!dialog.open) selectedInterest = '';
    const isManualCopy = dialog.open && manualCopyValue !== null;
    copyText(isManualCopy ? manualCopyValue : inquiry(), isManualCopy ? '내용을 복사했습니다.' : '상담 문의 문구를 복사했습니다.');
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
    const copyPhoneButton = $('#copy-phone');
    if (copyPhoneButton) {
      copyPhoneButton.hidden = false;
      copyPhoneButton.setAttribute('aria-label', '전화번호 복사');
      copyPhoneButton.addEventListener('click', () => copyText(config.phone, '전화번호를 복사했습니다.', false));
    }
  }
  const copyAddressButton = $('#copy-address');
  if (copyAddressButton && config.address) copyAddressButton.addEventListener('click', () => copyText(config.address, '주소를 복사했습니다.'));
  if (config.consultationHours) $('#contact-status').textContent = config.consultationHours;
  $('#copyright-year').textContent = new Date().getFullYear();

  const navLinks = $$('.desktop-nav a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));});
    }, {rootMargin:'-15% 0px -55% 0px',threshold:0});
    navLinks.forEach(link => {const section = $(link.hash);if(section) observer.observe(section);});
  }
})();
