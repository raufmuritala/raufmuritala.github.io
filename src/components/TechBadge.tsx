export default function TechBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-muted">
      {name}
    </span>
  );
}
