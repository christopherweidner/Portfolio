import type { CSSProperties } from "react";
import {
  INTERCHANGE_BODY,
  PLACEHOLDER_BODY,
  type Line,
} from "@/content/learning";
import type { ResolvedStop } from "@/lib/network";

type Props = { resolved: ResolvedStop };

function bodyFor(resolved: ResolvedStop): string {
  if (resolved.stop.body) return resolved.stop.body;
  return resolved.isInterchange ? INTERCHANGE_BODY : PLACEHOLDER_BODY;
}

function kickerFor(resolved: ResolvedStop, first: Line): string {
  return resolved.isInterchange ? "Interchange" : first.note;
}

/** The written half. Presentational; it renders whatever stop it is handed. */
export default function StopDetail({ resolved }: Props) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      {/* key on the stop makes React remount this, which replays the entrance */}
      <div key={resolved.key} className="reveal flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-label opacity-75">
          {kickerFor(resolved, resolved.lines[0])}
        </span>
        <h2 className="font-serif text-[clamp(1.4rem,2.8vw,2rem)] font-medium leading-[1.08] tracking-[-0.015em]">
          {resolved.stop.title}
        </h2>
        <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
          {bodyFor(resolved)}
        </p>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {resolved.lines.map((line) => (
          <li
            key={line.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-label"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: `var(--line-${line.tone})` } as CSSProperties}
            />
            {line.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
