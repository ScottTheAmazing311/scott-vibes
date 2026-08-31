/** Re-mounts on every route change, so the mask reveal plays per page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
