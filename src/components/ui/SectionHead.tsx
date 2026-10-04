import { SECTION_INDEX } from "@/lib/data";

type Props = {
  id: string;
  label: string;
  /** Heading text before the italic accent word. */
  lead: string;
  /** The single Instrument Serif italic word (with trailing punctuation). */
  accent: string;
  headingId?: string;
  className?: string;
  children?: React.ReactNode;
};

/** "03 — Selected work" tag + heading ending in one serif italic word. */
export default function SectionHead({ id, label, lead, accent, headingId, className = "", children }: Props) {
  return (
    <div className={className}>
      <p className="tag rv">
        <b>{SECTION_INDEX[id]}</b>
        <span aria-hidden="true">—</span>
        <span>{label}</span>
      </p>
      <h2 id={headingId ?? `${id}-title`} className="h-section mt-5">
        <span className="rv-mask">
          <span>
            {lead} <span className="serif-i">{accent}</span>
          </span>
        </span>
      </h2>
      {children}
    </div>
  );
}
