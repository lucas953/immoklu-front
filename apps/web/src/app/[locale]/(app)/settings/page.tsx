"use client";

import { useAuthSessionQuery } from "@immoklu/api-client";

export default function SettingsPage() {
  const sessionQuery = useAuthSessionQuery();
  const session = sessionQuery.data;

  if (!session) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold">Workspace profile</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="text-xl font-semibold">User</h2>
          <dl className="mt-4 space-y-2 text-sm text-neutral-700">
            <div>
              <dt className="font-medium">Name</dt>
              <dd>{session.user.fullName}</dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd>{session.user.email}</dd>
            </div>
            <div>
              <dt className="font-medium">Language</dt>
              <dd>{session.user.preferredLocale}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="text-xl font-semibold">Workspace</h2>
          <dl className="mt-4 space-y-2 text-sm text-neutral-700">
            <div>
              <dt className="font-medium">Name</dt>
              <dd>{session.workspace.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Country</dt>
              <dd>{session.workspace.countryCode}</dd>
            </div>
            <div>
              <dt className="font-medium">Currency</dt>
              <dd>{session.workspace.defaultCurrency}</dd>
            </div>
            <div>
              <dt className="font-medium">Timezone</dt>
              <dd>{session.workspace.timezone}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
