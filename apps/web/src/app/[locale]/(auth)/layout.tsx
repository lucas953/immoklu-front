export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">Immoklu</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">
            Rental operations that feel modern, clear, and financially trustworthy.
          </h1>
          <p className="max-w-xl text-lg text-neutral-700">
            Start with secure access, a workspace configured for your market, and room to scale into a full landlord
            operating system.
          </p>
        </section>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
