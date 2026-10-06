import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Rotation in degrees. Negative leans left. */
  tilt?: number;
  /** Makes the whole card one link. */
  href?: string;
  /** Makes the whole card one button. Takes precedence over `href`. */
  onClick?: () => void;
  /** Accessible name for a button card whose content is only an image. */
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The site's card: rounded, shadowed, slightly tilted. Purely presentational.
 * A card with `href` or `onClick` is one control and straightens on hover and
 * focus.
 */
export default function TiltCard({ tilt = 0, href, onClick, label, className = "", children }: Props) {
  const style = { "--tilt": `${tilt}deg` } as CSSProperties;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={label} data-interactive className={`tilt-card ${className}`} style={style}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} data-interactive className={`tilt-card block ${className}`} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={`tilt-card ${className}`} style={style}>
      {children}
    </div>
  );
}
