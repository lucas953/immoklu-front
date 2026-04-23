"use client";

import { useAuthSessionQuery, useRefreshSessionMutation } from "@immoklu/api-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppSessionGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const sessionQuery = useAuthSessionQuery();
  const refreshMutation = useRefreshSessionMutation();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);
  const { mutateAsync: refreshSession, isError: refreshFailed, isPending: refreshPending } = refreshMutation;

  useEffect(() => {
    if (sessionQuery.isError && !hasTriedRefresh) {
      setHasTriedRefresh(true);
      void refreshSession().catch(() => {
        router.replace(`/${locale}/login`);
      });
      return;
    }

    if (sessionQuery.isError && hasTriedRefresh && refreshFailed) {
      router.replace(`/${locale}/login`);
    }
  }, [hasTriedRefresh, locale, refreshFailed, refreshSession, router, sessionQuery.isError]);

  if (sessionQuery.isPending || refreshPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm text-neutral-600">
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return null;
  }

  return <>{children}</>;
}
