"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuthSessionQuery, useLogoutMutation } from "@immoklu/api-client";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/tenants", label: "Tenants" },
  { href: "/leases", label: "Leases" },
  { href: "/payments", label: "Payments" },
  { href: "/expenses", label: "Expenses" },
  { href: "/documents", label: "Documents" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];

export function WebAppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const sessionQuery = useAuthSessionQuery();
  const logoutMutation = useLogoutMutation();
  const locale = params.locale ?? "en";
  const session = sessionQuery.data;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push(`/${locale}/login`);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Immoklu</p>
            <h2 className="mt-2 text-2xl font-semibold">Finance OS</h2>
            {session ? (
              <div className="mt-5 rounded-2xl bg-[var(--muted)] p-4 text-sm text-neutral-700">
                <p className="font-medium">{session.workspace.name}</p>
                <p>{session.user.fullName}</p>
              </div>
            ) : null}
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={[
                  "block rounded-2xl px-4 py-3 text-sm text-neutral-700 transition hover:bg-[var(--muted)]",
                  pathname === `/${locale}${item.href}` ? "bg-[var(--muted)] font-medium text-neutral-900" : ""
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-8 w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-[var(--muted)]"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </button>
        </aside>
        <main className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
