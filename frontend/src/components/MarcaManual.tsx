/** Marca de la app: una mano abierta (saludo en LSC) con un corazón en la
 * palma ("amor"). Geométrica y simple a propósito, para que funcione bien
 * a tamaños pequeños y como elemento animado del hero de Login. */
import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function MarcaManual({ className, style }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <rect x="17" y="30" width="30" height="27" rx="12" />
        <rect x="14" y="10" width="8" height="24" rx="4" transform="rotate(-8 18 22)" />
        <rect x="24" y="4" width="8" height="28" rx="4" transform="rotate(-2 28 18)" />
        <rect x="34" y="4" width="8" height="28" rx="4" transform="rotate(3 38 18)" />
        <rect x="44" y="8" width="8" height="24" rx="4" transform="rotate(10 48 20)" />
        <rect x="6" y="26" width="16" height="9" rx="4.5" transform="rotate(-24 14 30)" />
      </g>
      <path
        d="M32 48c-5-4.2-11-4.6-11-10.6 0-3.4 2.9-6 6.2-6 2 0 3.8 1 4.8 2.6 1-1.6 2.8-2.6 4.8-2.6 3.3 0 6.2 2.6 6.2 6 0 6-6 6.4-11 10.6Z"
        fill="var(--color-coral, #ff5a5f)"
      />
    </svg>
  );
}
