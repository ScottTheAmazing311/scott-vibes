import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="on-dark bg-charcoal">
      <div className="wrap">
        <div className="rule" />
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5">
          <p className="text-sm font-semibold tracking-[-0.02em]">{site.name}</p>
          <span className="label">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
