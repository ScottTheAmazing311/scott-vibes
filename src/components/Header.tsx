import Link from "next/link";
import { site } from "@/lib/content";

export default function Header() {
  return (
    <header className="hdr fixed inset-x-0 top-0 z-40 border-b border-charcoal/15 bg-ivory">
      <div className="wrap flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
          {site.name}
        </Link>
        <a href={`mailto:${site.email}`} className="pill pill-outline py-1.5! text-[0.8125rem]">
          Email me
        </a>
      </div>
    </header>
  );
}
