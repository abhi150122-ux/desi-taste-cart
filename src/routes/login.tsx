import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container } from "@/components/site-layout";
import { useShop } from "@/context/shop";
import { apiLoginCustomer, setAuthToken } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Jain Desi and Pure" },
      { name: "description", content: "Login to track orders, save addresses and shop faster." },
      { property: "og:title", content: "Login — Jain Desi and Pure" },
      { property: "og:description", content: "Welcome back to pure desi shopping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useShop();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [resetStep, setResetStep] = useState<"idle" | "email" | "otp" | "reset">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || password.length < 4) {
      toast.error("Enter your mobile/email and a password of at least 4 characters");
      return;
    }

    try {
      const payload = id.includes("@")
        ? { email: id, password }
        : { mobile: id, phone: id, password };

      const result = await apiLoginCustomer(payload);
      const token = typeof result === "object" && result && "token" in result ? String(result.token ?? "") : "";
      const userData = (result && typeof result === "object" && "user" in result && result.user) || {
        name: id.includes("@") ? id.split("@")[0]! : "Jain Customer",
        email: id.includes("@") ? id : "customer@jaindesiandpure.in",
        mobile: id.includes("@") ? "9876543210" : id,
      };

      if (token) setAuthToken(token);

      login({
        id: userData?.id ?? userData?.customer_id,
        name: userData?.name || (id.includes("@") ? id.split("@")[0]! : "Jain Customer"),
        email: userData?.email || (id.includes("@") ? id : "customer@jaindesiandpure.in"),
        mobile: userData?.mobile || userData?.phone || userData?.phone_number || (id.includes("@") ? "9876543210" : id),
      });

      toast.success("Logged in successfully");
      navigate({ to: "/account" });
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please try again.");
    }
  };

  const handleForgotPasswordRequest = async () => {
    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      toast.error("Enter a valid email to receive the reset OTP");
      return;
    }

    try {
      setResetLoading(true);
      await import("@/lib/api").then(({ apiSendPasswordResetOtp }) => apiSendPasswordResetOtp({ email: normalizedEmail }));
      setResetStep("otp");
      setResetOtp("");
      toast.success("OTP sent to your email");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset OTP");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotPasswordVerify = async () => {
    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail || !/^[0-9]{6}$/.test(resetOtp)) {
      toast.error("Enter the 6-digit verification code");
      return;
    }

    try {
      setResetLoading(true);
      await import("@/lib/api").then(({ apiVerifyPasswordResetOtp }) => apiVerifyPasswordResetOtp({ email: normalizedEmail, otp: resetOtp }));
      setResetStep("reset");
      toast.success("OTP verified successfully");
    } catch (error: any) {
      toast.error(error?.message || "OTP verification failed");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotPasswordReset = async () => {
    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail || !/^[0-9]{6}$/.test(resetOtp) || newPassword.length < 4) {
      toast.error("Enter a valid OTP and a password of at least 4 characters");
      return;
    }

    try {
      setResetLoading(true);
      await import("@/lib/api").then(({ apiResetPassword }) => apiResetPassword({ email: normalizedEmail, otp: resetOtp, password: newPassword }));
      setResetStep("idle");
      setResetEmail("");
      setResetOtp("");
      setNewPassword("");
      toast.success("Password reset successfully");
    } catch (error: any) {
      toast.error(error?.message || "Password reset failed");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SiteLayout>
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-accent/25 bg-card p-8">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Leaf className="size-6" />
          </span>
          <h1 className="mt-4 text-center text-2xl font-bold">
            {resetStep === "idle" ? "Welcome Back" : resetStep === "email" ? "Reset Password" : resetStep === "otp" ? "Verify OTP" : "Set New Password"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {resetStep === "idle" ? "Login to Jain Desi and Pure" : "Use the email verification flow to reset your password."}
          </p>

          {resetStep === "idle" ? (
            <>
              <form onSubmit={submit} className="mt-6 space-y-3">
                <label className="block text-xs font-medium">
                  Mobile / Email
                  <input
                    value={id}
                    maxLength={80}
                    onChange={(e) => setId(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block text-xs font-medium">
                  Password
                  <input
                    type="password"
                    value={password}
                    maxLength={64}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <button type="submit" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
                  Login
                </button>
              </form>

              <div className="mt-4 flex justify-between text-xs">
                <button type="button" onClick={() => { setResetStep("email"); setResetEmail(""); }} className="text-muted-foreground hover:text-primary">
                  Forgot Password?
                </button>
                <Link to="/signup" className="font-semibold text-primary">
                  Create Account
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-3">
              {resetStep === "email" && (
                <>
                  <label className="block text-xs font-medium">
                    Email Address
                    <input
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordRequest}
                    disabled={resetLoading}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
                  >
                    {resetLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {resetStep === "otp" && (
                <>
                  <label className="block text-xs font-medium">
                    Verification Code
                    <input
                      value={resetOtp}
                      maxLength={6}
                      onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                      className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordVerify}
                    disabled={resetLoading}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
                  >
                    {resetLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetStep("email")}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary"
                  >
                    Use another email
                  </button>
                </>
              )}

              {resetStep === "reset" && (
                <>
                  <label className="block text-xs font-medium">
                    New Password
                    <input
                      type="password"
                      value={newPassword}
                      maxLength={64}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordReset}
                    disabled={resetLoading}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetStep("idle")}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary"
                  >
                    Back to login
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Container>
    </SiteLayout>
  );
}
