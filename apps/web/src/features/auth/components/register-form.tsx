"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRegisterMutation } from "@immoklu/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/auth-card";
import { FormMessage } from "@/components/form-message";
import { registerSchema, type RegisterFormValues } from "../schemas";

export function RegisterForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const registerMutation = useRegisterMutation();
  const guessedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const preferredLocale = locale === "en" || locale === "es" || locale === "fr" ? locale : "en";
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      workspaceName: "",
      countryCode: "ES",
      defaultCurrency: "EUR",
      preferredLocale,
      timezone: guessedTimeZone
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    await registerMutation.mutateAsync(payload);
    router.push(`/${locale}/dashboard`);
  });

  return (
    <AuthCard
      title="Create your workspace"
      subtitle="We'll provision your user account, workspace settings, and starter categories immediately."
      footer={
        <div>
          Already have an account?{" "}
          <Link href={`/${locale}/login`} className="font-medium text-[var(--accent)]">
            Sign in
          </Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Full name</span>
            <input
              {...form.register("fullName")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            />
            {form.formState.errors.fullName ? (
              <span className="text-sm text-red-600">{form.formState.errors.fullName.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Workspace name</span>
            <input
              {...form.register("workspaceName")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            />
            {form.formState.errors.workspaceName ? (
              <span className="text-sm text-red-600">{form.formState.errors.workspaceName.message}</span>
            ) : null}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input
            {...form.register("email")}
            type="email"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
          />
          {form.formState.errors.email ? (
            <span className="text-sm text-red-600">{form.formState.errors.email.message}</span>
          ) : null}
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Password</span>
            <input
              {...form.register("password")}
              type="password"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            />
            {form.formState.errors.password ? (
              <span className="text-sm text-red-600">{form.formState.errors.password.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Confirm password</span>
            <input
              {...form.register("confirmPassword")}
              type="password"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            />
            {form.formState.errors.confirmPassword ? (
              <span className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Country code</span>
            <input
              {...form.register("countryCode")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 uppercase outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Default currency</span>
            <input
              {...form.register("defaultCurrency")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 uppercase outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Language</span>
            <select
              {...form.register("preferredLocale")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Timezone</span>
            <input
              {...form.register("timezone")}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            />
          </label>
        </div>

        {registerMutation.isError ? <FormMessage tone="error">{registerMutation.error.message}</FormMessage> : null}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
        >
          {registerMutation.isPending ? "Creating workspace..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
