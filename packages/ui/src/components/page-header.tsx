"use client";

export function PageHeader({
  eyebrow,
  title,
  description
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
}>) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{eyebrow}</p>
      <h1 className="text-4xl font-semibold">{title}</h1>
      {description ? <p className="max-w-2xl text-lg text-neutral-700">{description}</p> : null}
    </div>
  );
}
