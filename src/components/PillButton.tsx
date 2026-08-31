import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
  /** point the circular arrow down instead of right */
  down?: boolean;
  /** point the circular arrow up instead of right */
  up?: boolean;
  className?: string;
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PillButton({ href, children, outline, down, up, className = "" }: Props) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#");
  const cls = `pill ${outline ? "pill-outline" : ""} ${down ? "pill-down" : ""} ${up ? "pill-up" : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {!outline && (
        <span className="dot">
          <Arrow />
        </span>
      )}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
