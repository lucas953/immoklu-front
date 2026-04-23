export function AuthCard({
  title,
  subtitle,
  footer,
  children
}: Readonly<{
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <p className="text-sm text-neutral-600">{subtitle}</p>
      </div>
      {children}
      {footer ? <div className="border-t border-[var(--border)] pt-4 text-sm text-neutral-600">{footer}</div> : null}
    </div>
  );
}
