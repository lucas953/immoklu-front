"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@immoklu/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/auth-card";
import { FormMessage } from "@/components/form-message";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPasswordMutation();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      form.setValue("token", token);
    }
  }, [form, searchParams]);

  const onSubmit = form.handleSubmit(async (values) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    await resetPasswordMutation.mutateAsync(payload);
    router.push(`/${locale}/dashboard`);
  });

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Use the token from the reset step to establish a new password and restore your session."
      footer={
        <Link href={`/${locale}/login`} className="font-medium text-[var(--accent)]">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Reset token</span>
          <input
            {...form.register("token")}
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
          />
          {form.formState.errors.token ? (
            <span className="text-sm text-red-600">{form.formState.errors.token.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">New password</span>
          <input
            {...form.register("newPassword")}
            type="password"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
          />
          {form.formState.errors.newPassword ? (
            <span className="text-sm text-red-600">{form.formState.errors.newPassword.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Confirm new password</span>
          <input
            {...form.register("confirmPassword")}
            type="password"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
          />
          {form.formState.errors.confirmPassword ? (
            <span className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</span>
          ) : null}
        </label>

        {resetPasswordMutation.isError ? <FormMessage tone="error">{resetPasswordMutation.error.message}</FormMessage> : null}

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
        >
          {resetPasswordMutation.isPending ? "Updating password..." : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
