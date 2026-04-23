import { AppSessionGate } from "@/components/app-session-gate";
import { WebAppShell } from "@/components/web-app-shell";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppSessionGate>
      <WebAppShell>{children}</WebAppShell>
    </AppSessionGate>
  );
}
