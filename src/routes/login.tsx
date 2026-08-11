import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, Container } from "@/components/site-layout";
import { useShop } from "@/context/shop";

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || password.length < 4) {
      toast.error("Enter your mobile/email and a password of at least 4 characters");
      return;
    }
    login({
      name: id.includes("@") ? id.split("@")[0]! : "Jain Customer",
      email: id.includes("@") ? id : "customer@jaindesiandpure.in",
      mobile: id.includes("@") ? "9876543210" : id,
    });
    toast.success("Logged in successfully");
    navigate({ to: "/account" });
  };

  return (
    <SiteLayout>
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-accent/25 bg-card p-8">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Leaf className="size-6" />
          </span>
          <h1 className="mt-4 text-center text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Login to Jain Desi and Pure</p>

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

          <button
            type="button"
            onClick={() => {
              login({ name: "Google User", email: "google.user@gmail.com", mobile: "9876500000" });
              toast.success("Signed in with Google");
              navigate({ to: "/account" });
            }}
            className="mt-3 w-full rounded-xl border py-3 text-sm font-semibold"
          >
            Continue with Google
          </button>

          <div className="mt-4 flex justify-between text-xs">
            <button type="button" onClick={() => toast("Password reset link sent to your mobile")} className="text-muted-foreground hover:text-primary">
              Forgot Password?
            </button>
            <Link to="/signup" className="font-semibold text-primary">
              Create Account
            </Link>
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}
