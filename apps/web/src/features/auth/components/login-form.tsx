"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLoginMutation } from "@immoklu/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/auth-card";
import { FormMessage } from "@/components/form-message";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const loginMutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
    router.push(`/${locale}/dashboard`);
  });

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your workspace and continue where you left off."
      footer={
        <div className="flex items-center justify-between">
          <Link href={`/${locale}/register`} className="font-medium text-[var(--accent)]">
            Create account
          </Link>
          <Link href={`/${locale}/forgot-password`} className="font-medium text-[var(--accent)]">
            Forgot password
          </Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
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

        {loginMutation.isError ? <FormMessage tone="error">{loginMutation.error.message}</FormMessage> : null}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}
