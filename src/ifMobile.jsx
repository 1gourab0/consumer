// hooks/useIsMobile.ts
import { createSignal, onCleanup, onMount } from 'solid-js';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = createSignal(false);

  const checkSize = () => {
    setIsMobile(window.innerWidth <= breakpoint);
  };

  onMount(() => {
    checkSize();
    window.addEventListener('resize', checkSize);
    onCleanup(() => window.removeEventListener('resize', checkSize));
  });

  return isMobile;
}
