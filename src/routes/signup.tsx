import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout, Container } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { apiRegisterCustomer, setAuthToken } from "@/lib/api";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Jain Desi and Pure" },
      { name: "description", content: "Create your account to shop pure desi groceries with faster checkout." },
      { property: "og:title", content: "Create Account — Jain Desi and Pure" },
      { property: "og:description", content: "Join Jain Desi and Pure in under a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { login } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\d{10}$/.test(form.mobile) || !form.email.includes("@")) {
      toast.error("Enter a valid name, 10 digit mobile and email");
      return;
    }
    if (form.password.length < 6 || form.password !== form.confirm) {
      toast.error("Passwords must match and be at least 6 characters");
      return;
    }
    if (!agree) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    try {
      const result = await apiRegisterCustomer({
        name: form.name,
        full_name: form.name,
        mobile: form.mobile,
        phone: form.mobile,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });

      const token = typeof result === "object" && result && "token" in result ? String(result.token ?? "") : "";
      const userData = (result && typeof result === "object" && "user" in result && result.user) || {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
      };

      if (token) setAuthToken(token);

      login({
        id: userData?.id ?? userData?.customer_id,
        name: userData?.name || form.name,
        email: userData?.email || form.email,
        mobile: userData?.mobile || userData?.phone || form.mobile,
      });

      toast.success("Account created successfully");
      navigate({ to: "/account" });
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <SiteLayout>
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-accent/25 bg-card p-8">
          <h1 className="text-center text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Pure Desi Taste, Naturally Better</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {(
              [
                ["name", "Full Name", "text"],
                ["mobile", "Mobile", "tel"],
                ["email", "Email", "email"],
                ["password", "Password", "password"],
                ["confirm", "Confirm Password", "password"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block text-xs font-medium">
                {label}
                <input
                  type={type}
                  value={form[key]}
                  maxLength={80}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
            ))}

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-[var(--primary)]"
              />
              I agree to Terms &amp; Conditions
            </label>

            <button type="submit" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Login
            </Link>
          </p>
        </div>
      </Container>
    </SiteLayout>
  );
}
