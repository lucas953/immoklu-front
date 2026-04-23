export function FormMessage({
  tone,
  children
}: Readonly<{
  tone: "error" | "success";
  children: React.ReactNode;
}>) {
  const className =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${className}`}>{children}</div>;
}
