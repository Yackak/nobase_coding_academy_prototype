import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export default function ResponsiveDetails({ children, desktopOpen = false, className }: { children: ReactNode; desktopOpen?: boolean; className?: string }) {
  const programDetails = className?.split(/\s+/).includes('program-details') ?? false;
  // Match prerendered HTML first; resolve responsive defaults before client paint.
  const [open, setOpen] = useState(desktopOpen);
  const desktopLayout = useRef(true);
  const mobileProgramOpen = useRef(false);
  const interacted = useRef(false);

  useLayoutEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const sync = () => {
      desktopLayout.current = desktop.matches;
      if (programDetails) setOpen(desktop.matches || mobileProgramOpen.current);
      else if (!interacted.current) setOpen(desktopOpen && desktop.matches);
    };
    sync();
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, [desktopOpen, programDetails]);

  return <details className={className} open={open}
    onClick={event => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('summary')?.parentElement !== event.currentTarget) return;
      interacted.current = true;
      if (programDetails && !desktopLayout.current) mobileProgramOpen.current = !event.currentTarget.open;
    }}
    onToggle={event => {
      // Desktop course summaries are hidden, so their contents must stay open.
      setOpen(programDetails && desktopLayout.current ? true : event.currentTarget.open);
    }}>{children}</details>;
}
