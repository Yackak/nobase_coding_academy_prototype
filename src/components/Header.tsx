import { useEffect, useState, type MouseEvent } from 'react';
import { asset } from '../lib/assets';
import { useContact } from './ContactProvider';

const links = [
  { href: '#about', label: '학원 소개' },
  { href: '#programs', label: '교육과정' },
  { href: '#system', label: '학습관리' },
  { href: '#guide', label: '수강 안내' },
  { href: '#faq', label: '자주 묻는 질문' },
  { href: '#contact', label: '상담 · 오시는 길' },
];
const desktopLinks = links.filter(link => !['#guide', '#faq'].includes(link.href));

export default function Header() {
  const { contact, menuOpen, openMenu, closeMenu, navigateToSection } = useContact();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`); });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    desktopLinks.forEach(link => {
      const section = document.getElementById(link.href.slice(1));
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const followMenuLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!menuOpen) return;
    event.preventDefault();
    closeMenu(() => navigateToSection(href));
  };

  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#" aria-label="노베이스 학원 홈" onClick={event => followMenuLink(event, '#')}>
        <img src={asset('assets/nobase-logo.png')} width="809" height="503" alt="노베이스 학원 NOBASE ACADEMY" />
      </a>
      <nav className="desktop-nav" aria-label="주 메뉴">
        {desktopLinks.map(link => <a key={link.href} href={link.href} className={activeSection === link.href ? 'active' : undefined} aria-current={activeSection === link.href ? 'location' : undefined}>{link.label}</a>)}
      </nav>
      <button type="button" className="button button-green header-contact" onClick={() => contact('phone')}>
        <svg aria-hidden="true"><use href="#i-phone" /></svg>전화 상담<svg className="small-icon" aria-hidden="true"><use href="#i-diagonal" /></svg>
      </button>
      <button type="button" className="menu-toggle" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => menuOpen ? closeMenu() : openMenu()}><span /><span /></button>
    </div>
    <nav className="mobile-menu" id="mobile-menu" aria-label="모바일 메뉴" hidden={!menuOpen}>
      <p className="mobile-menu-label">기초부터 내신까지, 노베이스</p>
      {links.map((link, index) => <a key={link.href} href={link.href} onClick={event => followMenuLink(event, link.href)}>{link.label}<span>{String(index + 1).padStart(2, '0')}</span></a>)}
      <p className="mobile-menu-note">영어 · 수학<br /><span>초등 고학년 · 중고 내신 집중관리</span></p>
    </nav>
  </header>;
}
