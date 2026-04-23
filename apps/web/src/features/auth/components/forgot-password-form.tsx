"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useForgotPasswordMutation } from "@immoklu/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/auth-card";
import { FormMessage } from "@/components/form-message";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas";

export function ForgotPasswordForm() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [issuedResetToken, setIssuedResetToken] = useState<string | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await forgotPasswordMutation.mutateAsync(values);
    setIssuedResetToken(response.resetToken ?? null);
  });

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your account email and we’ll create a reset token for your next step."
      footer={
        <Link href={`/${locale}/login`} className="font-medium text-[var(--accent)]">
          Back to sign in
        </Link>
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

        {forgotPasswordMutation.isError ? (
          <FormMessage tone="error">{forgotPasswordMutation.error.message}</FormMessage>
        ) : null}

        {forgotPasswordMutation.isSuccess ? (
          <FormMessage tone="success">
            Reset token created. {issuedResetToken ? `Development token: ${issuedResetToken}` : "Check your email flow."}
          </FormMessage>
        ) : null}

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
        >
          {forgotPasswordMutation.isPending ? "Creating reset token..." : "Create reset token"}
        </button>
      </form>
    </AuthCard>
  );
}
