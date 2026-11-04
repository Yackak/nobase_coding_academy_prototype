import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { config } from '../config';

type ContactKind = 'phone' | 'kakao';
type OverlayKind = 'menu' | 'dialog';
type HistoryState = Record<string, unknown> & {
  nobaseOverlay?: OverlayKind;
  nobaseOverlaySession?: string;
  nobaseScrollRestoration?: ScrollRestoration;
};
type OverlayController = {
  open: (kind: OverlayKind, fromHistory?: boolean) => void;
  close: (afterClose?: () => void, returnFocus?: boolean) => void;
  navigate: (href: string) => void;
  current: () => OverlayKind | null;
};
type PageLock = {
  top: number;
  restoration: ScrollRestoration;
  focus: HTMLElement | null;
  styles: Pick<CSSStyleDeclaration, 'position' | 'top' | 'width'>;
  inertElements: Array<{ element: HTMLElement; inert: boolean }>;
};
type ContactContextValue = {
  contact: (kind: ContactKind, interest?: string) => void;
  copyInquiry: () => void;
  copyAddress: () => void;
  copyPhone: () => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: (afterClose?: () => void) => void;
  navigateToSection: (href: string) => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact(): ContactContextValue {
  const value = useContext(ContactContext);
  if (!value) throw new Error('useContact must be used within ContactProvider');
  return value;
}

function Icon({ name }: { name: string }) {
  return <svg aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

function inquiry(interest: string): string {
  return `안녕하세요, 노베이스 학원 영어·수학 수업을 문의드립니다.\n학생 학년: \n관심 과정: ${interest || '초등 고학년 / 중등 내신 / 고등 내신'}\n관심 과목: 영어 / 수학\n현재 학습 고민: \n궁금한 점: `;
}

function validHttps(value: string | null | undefined): value is string {
  if (!value) return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayKind | null>(null);
  const [interest, setInterest] = useState('');
  const [manualCopy, setManualCopy] = useState<{ value: string } | null>(null);
  const [toast, setToast] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mobileContactRef = useRef<HTMLElement>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<OverlayController | null>(null);
  const interestRef = useRef('');
  const fallbackRef = useRef<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const mobile = window.matchMedia('(max-width: 767px)');
    const session = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const initialRestoration = history.scrollRestoration;
    let active: OverlayKind | null = null;
    let lock: PageLock | null = null;
    let lastLock: PageLock | null = null;
    let closingHistory = false;
    let afterHistoryClose: (() => void) | undefined;
    let restorationFrame: number | null = null;

    const state = () => (history.state && typeof history.state === 'object' ? history.state : {}) as HistoryState;
    const isOverlayEntry = () => state().nobaseOverlaySession === session;
    const restoreScroll = (top: number) => {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, top);
      document.documentElement.style.scrollBehavior = previous;
    };
    const lockPage = (kind: OverlayKind, fromHistory: boolean, returnFocus?: HTMLElement | null) => {
      const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lock = {
        top: window.scrollY,
        restoration: fromHistory ? state().nobaseScrollRestoration || initialRestoration : history.scrollRestoration,
        focus: returnFocus === undefined ? focus : returnFocus,
        styles: {
          position: document.body.style.position,
          top: document.body.style.top,
          width: document.body.style.width,
        },
        inertElements: kind === 'menu'
          ? [...document.querySelectorAll<HTMLElement>('main, .site-footer, .mobile-contact')].map(element => ({ element, inert: element.inert }))
          : [],
      };
      history.scrollRestoration = 'manual';
      Object.assign(document.body.style, { position: 'fixed', top: `-${lock.top}px`, width: '100%' });
      document.body.classList.add(`${kind}-open`);
      lock.inertElements.forEach(({ element }) => { element.inert = true; });
    };
    const hide = (returnFocus = true) => {
      if (!active || !lock) return;
      const kind = active;
      active = null;
      lastLock = lock;
      lock = null;
      setOverlay(null);
      if (kind === 'dialog' && dialogRef.current?.open) dialogRef.current.close();
      document.body.classList.remove(`${kind}-open`);
      lastLock.inertElements.forEach(({ element, inert }) => { element.inert = inert; });
      Object.assign(document.body.style, lastLock.styles);
      restoreScroll(lastLock.top);
      if (returnFocus && lastLock.focus?.isConnected) lastLock.focus.focus({ preventScroll: true });
    };
    const finishTraversal = (afterClose?: () => void) => {
      const snapshot = lastLock;
      closingHistory = true;
      if (restorationFrame !== null) window.cancelAnimationFrame(restorationFrame);
      // The browser restores persisted scroll after popstate. Keep manual mode
      // until the next frame so closing an overlay preserves the reading position.
      restorationFrame = window.requestAnimationFrame(() => {
        restorationFrame = null;
        if (snapshot) {
          restoreScroll(snapshot.top);
          history.scrollRestoration = snapshot.restoration;
        }
        closingHistory = false;
        afterClose?.();
      });
    };
    const open = (kind: OverlayKind, fromHistory = false) => {
      if (closingHistory || active === kind || (kind === 'menu' && !mobile.matches)) return;
      const replacing = active !== null;
      const previousFocus = lock?.focus;
      if (replacing) {
        hide(false);
        history.scrollRestoration = lastLock?.restoration || initialRestoration;
      }
      active = kind;
      lockPage(kind, fromHistory, replacing ? previousFocus : undefined);
      setOverlay(kind);
      if (!fromHistory) {
        const next: HistoryState = {
          ...state(),
          nobaseOverlay: kind,
          nobaseOverlaySession: session,
          nobaseScrollRestoration: lock?.restoration || initialRestoration,
        };
        if (replacing) history.replaceState(next, '', location.href);
        else history.pushState(next, '', location.href);
      }
    };
    const close = (afterClose?: () => void, returnFocus = true) => {
      if (!active) { afterClose?.(); return; }
      hide(returnFocus);
      if (isOverlayEntry()) {
        closingHistory = true;
        afterHistoryClose = afterClose;
        history.back();
      } else {
        history.scrollRestoration = lastLock?.restoration || initialRestoration;
        afterClose?.();
      }
    };
    const navigate = (href: string) => {
      if (!href.startsWith('#')) return;
      const target = document.getElementById(href === '#' ? 'main' : href.slice(1));
      if (!target) return;
      history.pushState(null, '', href);
      const heading = target.querySelector<HTMLElement>('h1, h2, h3') || target;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    };
    const onPopState = () => {
      if (closingHistory) {
        const next = afterHistoryClose;
        afterHistoryClose = undefined;
        finishTraversal(next);
        return;
      }
      const kind = isOverlayEntry() ? state().nobaseOverlay : undefined;
      if (active && active !== kind) {
        hide();
        finishTraversal(() => {
          if (kind === 'dialog' || (kind === 'menu' && mobile.matches)) open(kind, true);
        });
        return;
      }
      if (kind === 'dialog' || (kind === 'menu' && mobile.matches)) open(kind, true);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (active !== 'menu') return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...document.querySelectorAll<HTMLElement>('.site-header a[href], .site-header button:not([disabled])')]
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (!mobile.matches && active === 'menu') close(undefined, false); };

    controllerRef.current = { open, close, navigate, current: () => active };
    window.addEventListener('popstate', onPopState);
    document.addEventListener('keydown', onKeyDown);
    mobile.addEventListener('change', onResize);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('keydown', onKeyDown);
      mobile.removeEventListener('change', onResize);
      if (restorationFrame !== null) window.cancelAnimationFrame(restorationFrame);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      const snapshot = lock || lastLock;
      if (lock) {
        lock.inertElements.forEach(({ element, inert }) => { element.inert = inert; });
        Object.assign(document.body.style, lock.styles);
        restoreScroll(lock.top);
      }
      document.body.classList.remove('menu-open', 'dialog-open');
      if (dialogRef.current?.open) dialogRef.current.close();
      if (snapshot) history.scrollRestoration = snapshot.restoration;
      if (isOverlayEntry()) {
        const cleanState = { ...state() };
        delete cleanState.nobaseOverlay;
        delete cleanState.nobaseOverlaySession;
        delete cleanState.nobaseScrollRestoration;
        history.replaceState(cleanState, '', location.href);
      }
      controllerRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const bar = mobileContactRef.current;
    if (!bar) return;
    const rootStyle = document.documentElement.style;
    const previousValue = rootStyle.getPropertyValue('--contact-height');
    const previousPriority = rootStyle.getPropertyPriority('--contact-height');
    const measure = () => {
      const height = bar.getBoundingClientRect().height;
      // Hidden menus/dialogs retain the last real height. Safe-area padding is
      // already added by the footer/toast CSS, so do not count it twice here.
      if (height <= 0) return;
      const style = getComputedStyle(bar);
      const safeArea = Math.max(0, parseFloat(style.paddingBottom) - parseFloat(style.paddingTop));
      const value = `${Math.ceil(height - safeArea)}px`;
      if (rootStyle.getPropertyValue('--contact-height') !== value) rootStyle.setProperty('--contact-height', value);
    };
    const observer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    observer?.observe(bar);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      if (previousValue) rootStyle.setProperty('--contact-height', previousValue, previousPriority);
      else rootStyle.removeProperty('--contact-height');
    };
  }, []);

  useLayoutEffect(() => {
    if (overlay === 'dialog' && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    if (overlay === 'menu') document.querySelector<HTMLElement>('#mobile-menu a')?.focus({ preventScroll: true });
  }, [overlay]);

  useLayoutEffect(() => {
    if (overlay !== 'dialog' || !manualCopy) return;
    manualCopyRef.current?.focus({ preventScroll: true });
    manualCopyRef.current?.select();
  }, [overlay, manualCopy]);

  const notify = useCallback((message: string) => {
    if (!mountedRef.current) return;
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => { setToast(''); toastTimerRef.current = null; }, 3200);
  }, []);

  const copyText = useCallback(async (text: string, success: string, allowManualCopy = true) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      notify(success);
    } catch {
      if (!mountedRef.current) return;
      if (!allowManualCopy) {
        notify('번호를 복사하지 못했어요. 휴대폰에서 전화 상담 버튼을 이용해 주세요.');
        return;
      }
      fallbackRef.current = text;
      setManualCopy({ value: text });
      controllerRef.current?.open('dialog');
      notify('문구를 선택했습니다. 길게 눌러 복사하거나 ⌘C / Ctrl+C를 눌러 주세요.');
    }
  }, [notify]);

  const contact = useCallback((kind: ContactKind, selectedInterest = '') => {
    if (kind === 'kakao' && validHttps(config.kakaoUrl)) {
      window.open(config.kakaoUrl, '_blank', 'noopener,noreferrer');
    } else if (kind === 'phone' && config.phone && !config.demoMode) {
      const phone = config.phone.replace(/[^\d+]/g, '');
      if (window.matchMedia('(max-width: 767px)').matches) window.location.href = `tel:${phone}`;
      else void copyText(config.phone, '전화번호를 복사했습니다.', false);
    } else {
      interestRef.current = selectedInterest;
      setInterest(selectedInterest);
      fallbackRef.current = null;
      setManualCopy(null);
      controllerRef.current?.open('dialog');
    }
  }, [copyText]);

  const copyInquiry = useCallback(() => {
    const insideDialog = controllerRef.current?.current() === 'dialog';
    const manualValue = insideDialog ? fallbackRef.current : null;
    const value = manualValue ?? inquiry(insideDialog ? interestRef.current : '');
    void copyText(value, manualValue !== null ? '내용을 복사했습니다.' : '상담 문의 문구를 복사했습니다.');
  }, [copyText]);
  const copyAddress = useCallback(() => { if (config.address) void copyText(config.address, '주소를 복사했습니다.'); }, [copyText]);
  const copyPhone = useCallback(() => { if (config.phone && !config.demoMode) void copyText(config.phone, '전화번호를 복사했습니다.', false); }, [copyText]);
  const openMenu = useCallback(() => { controllerRef.current?.open('menu'); }, []);
  const closeMenu = useCallback((afterClose?: () => void) => { controllerRef.current?.close(afterClose, !afterClose); }, []);
  const navigateToSection = useCallback((href: string) => { controllerRef.current?.navigate(href); }, []);
  const context = useMemo<ContactContextValue>(() => ({
    contact, copyInquiry, copyAddress, copyPhone, menuOpen: overlay === 'menu', openMenu, closeMenu, navigateToSection,
  }), [contact, copyInquiry, copyAddress, copyPhone, overlay, openMenu, closeMenu, navigateToSection]);
  const toastContent = <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite" aria-atomic="true">{toast}</div>;

  return <ContactContext.Provider value={context}>
    {children}
    <nav ref={mobileContactRef} className="mobile-contact" aria-label="빠른 상담">
      <button type="button" onClick={() => contact('phone')}><Icon name="phone" />전화 상담</button>
      <button type="button" onClick={() => contact('kakao')}><Icon name="chat" /><span>카카오톡{!validHttps(config.kakaoUrl) && <small>준비 중</small>}</span></button>
    </nav>
    <dialog ref={dialogRef} id="contact-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"
      onCancel={event => { event.preventDefault(); controllerRef.current?.close(); }}
      onClose={() => { if (controllerRef.current?.current() === 'dialog') controllerRef.current.close(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) controllerRef.current?.close();
      }}>
      <button type="button" className="dialog-close" aria-label="닫기" onClick={() => controllerRef.current?.close()}>×</button>
      <div className="dialog-icon"><Icon name="phone" /></div>
      <span className="section-label">HELLO, NOBASE</span>
      <h2 id="dialog-title">{manualCopy ? '복사할 내용' : <>상담은 전화로<br />편하게 시작하세요.</>}</h2>
      <p id="dialog-description">{manualCopy ? '아래 내용을 선택해 직접 복사해 주세요.' : <>카카오톡 상담 링크는 추후 업데이트할 예정입니다.<br /> 아래 전화 상담 버튼으로 학습 상담을 문의해 주세요.</>}</p>
      <button type="button" className="button button-green" onClick={() => contact('phone')}><Icon name="phone" />전화로 상담하기</button>
      <div className="inquiry-preview">
        <small>{manualCopy ? '복사할 내용' : '이렇게 문의를 시작해 보세요'}</small>
        <p id="inquiry-text">{manualCopy?.value ?? inquiry(interest)}</p>
        {manualCopy && <textarea ref={manualCopyRef} className="manual-copy" aria-label="복사할 내용" readOnly value={manualCopy.value} />}
      </div>
      <button type="button" className="button button-outline copy-inquiry" onClick={copyInquiry}><Icon name="copy" />{manualCopy ? '다시 복사하기' : '문의 문구 복사하기'}</button>
      {overlay === 'dialog' && toastContent}
    </dialog>
    {overlay !== 'dialog' && toastContent}
  </ContactContext.Provider>;
}
