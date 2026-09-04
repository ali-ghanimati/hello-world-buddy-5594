import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/store/auth";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Button } from "@/components/base/Button";
import { TextField } from "@/components/base/Input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام | شیکو" },
      {
        name: "description",
        content:
          "ورود به حساب کاربری شیکو یا ساخت حساب جدید برای پیگیری سفارش‌ها.",
      },
      { property: "og:title", content: "ورود و ثبت‌نام | شیکو" },
      {
        property: "og:description",
        content: "ورود به حساب کاربری شیکو یا ساخت حساب جدید.",
      },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    identifier: "",
    password: "",
    confirm: "",
    remember: true,
  });

  const set =
    (key: keyof typeof form) =>
    (e: { target: { value: string } }) => {
      setForm((current) => ({
        ...current,
        [key]: e.target.value,
      }));
    };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    const next: Record<string, string> = {};

    if (!form.identifier.trim()) {
      next.identifier = "شماره موبایل یا ایمیل را وارد کنید.";
    }

    if (form.password.length < 6) {
      next.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }

    if (tab === "register") {
      if (form.name.trim().length < 3) {
        next.name = "نام خود را کامل وارد کنید.";
      }

      if (form.password !== form.confirm) {
        next.confirm = "تکرار رمز عبور مطابقت ندارد.";
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setSubmitting(true);

    try {
      if (tab === "login") {
        await login(form.identifier.trim());
      } else {
        await register(
          form.name.trim(),
          form.identifier.trim(),
        );
      }

      await navigate({ to: "/account" });
    } catch {
      setErrors({
        submit:
          "در انجام عملیات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-shiko py-10">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "ورود و ثبت‌نام" },
        ]}
      />

      <div className="mx-auto mt-6 max-w-md">
        <h1 className="text-2xl font-black">
          حساب کاربری شیکو
        </h1>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          برای پیگیری سفارش‌ها و ذخیره نشانی‌ها وارد شوید.
        </p>

        <div
          className="mt-7 grid grid-cols-2 rounded-sm border border-border p-1"
          role="tablist"
        >
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => {
                if (submitting) return;

                setTab(t);
                setErrors({});
              }}
              className={cn(
                "rounded-sm py-2.5 text-sm transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary",
              )}
            >
              {t === "login" ? "ورود" : "ثبت‌نام"}
            </button>
          ))}
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="mt-6 space-y-4 rounded-md border border-border bg-card p-5"
        >
          {tab === "register" && (
            <TextField
              label="نام و نام خانوادگی"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              autoComplete="name"
              disabled={submitting}
            />
          )}

          <TextField
            label="شماره موبایل یا ایمیل"
            value={form.identifier}
            onChange={set("identifier")}
            error={errors.identifier}
            dir="ltr"
            autoComplete="username"
            disabled={submitting}
          />

          <TextField
            label="رمز عبور"
            type="password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete={
              tab === "login"
                ? "current-password"
                : "new-password"
            }
            disabled={submitting}
          />

          {tab === "register" && (
            <TextField
              label="تکرار رمز عبور"
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              autoComplete="new-password"
              disabled={submitting}
            />
          )}

          {tab === "login" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.remember}
                disabled={submitting}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    remember: e.target.checked,
                  }))
                }
                className="accent-[var(--color-accent)]"
              />

              مرا به خاطر بسپار
            </label>
          )}

          {errors.submit && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.submit}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
           
