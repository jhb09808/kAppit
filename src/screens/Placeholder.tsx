/** Screens not built yet. Each one is a real route so the nav works end to end. */
export default function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ padding: "calc(28px + var(--safe-t)) 24px", maxWidth: 560 }}>
      <h1 className="t-title">{title}</h1>
      <p className="t-caption" style={{ marginTop: 8 }}>{note}</p>
    </div>
  );
}
