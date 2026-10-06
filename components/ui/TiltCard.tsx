import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Rotation in degrees. Negative leans left. */
  tilt?: number;
  /** Makes the whole card one link. */
  href?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The site's card: rounded, shadowed, slightly tilted. Purely presentational.
 * A card with `href` is a single link and straightens on hover and focus.
 */
export default function TiltCard({ tilt = 0, href, className = "", children }: Props) {
  const style = { "--tilt": `${tilt}deg` } as CSSProperties;

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
