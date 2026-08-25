import Image from "next/image";
import type { CSSProperties, RefObject } from "react";
import type { Moment } from "@/content/sport";

type Props = {
  moment: Moment;
  /** Supplied only for the drifting instance; the parked one has no ref. */
  plateRef?: RefObject<HTMLDivElement | null>;
  /** Height and placement come from the caller. Width follows the aspect. */
  className?: string;
  /** The `sizes` hint next/image needs to pick a resolution. */
  sizes: string;
  priority?: boolean;
};

/**
 * A photograph plate.
 *
 * The caller sets a height; the width comes from the photo's own aspect ratio,
 * so nothing is ever cropped — the frame changes shape between a landscape
 * race shot and a portrait one instead. That shape change is deliberate: it
 * reads as designed rather than as a mismatched crop.
 *
 * Purely presentational. It knows nothing about pointers or animation, which
 * is why it never sets a transform — useAnchoredDrift writes that from outside.
 */
export default function RoamingPlate({
  moment,
  plateRef,
  className = "",
  sizes,
  priority = false,
}: Props) {
  return (
    <div
      ref={plateRef}
      aria-hidden
      className={`media plate w-auto ${className}`}
      style={
        {
          "--pa": moment.angle ?? "150deg",
          aspectRatio: moment.aspect ?? "3/2",
        } as CSSProperties
      }
    >
      {moment.image ? (
        <Image
          src={moment.image}
          alt={moment.alt ?? ""}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      ) : null}
    </div>
  );
}
