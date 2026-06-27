"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
  Target,
  UserRound,
  Zap,
} from "lucide-react";

const features = [
  { icon: BrainCircuit, text: "AI-powered task prioritization" },
  { icon: Code2, text: "DSA & LeetCode progress tracking" },
  { icon: Target, text: "Personalized study recommendations" },
];

const particles = [
  ["8%", "14%", "3px", "0s"],
  ["18%", "72%", "2px", "1.2s"],
  ["29%", "34%", "4px", "2.1s"],
  ["42%", "84%", "2px", "0.8s"],
  ["53%", "18%", "3px", "2.8s"],
  ["64%", "64%", "4px", "1.7s"],
  ["76%", "27%", "2px", "3.1s"],
  ["87%", "78%", "3px", "0.4s"],
  ["94%", "43%", "2px", "2.4s"],
];

export default function SignInPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (mode === "signup" && displayName.trim().length < 2) {
      setError("Enter the name you want Zentric to call you.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email: email.trim(),
      name: displayName.trim(),
      password,
      mode,
      keepSignedIn: keepSignedIn ? "true" : "false",
      redirect: false,
    });

    if (result?.ok) {
      window.location.assign("/dashboard");
      return;
    }

    setError(
      mode === "signup"
        ? "An account already exists for this email, or the account could not be created."
        : "Email or password is incorrect. New here? Create a free account below.",
    );
    setLoading(false);
  };

  const switchMode = () => {
    setMode((current) => (current === "signin" ? "signup" : "signin"));
    setError("");
    setNotice("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070F] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div className="pointer-events-none absolute -left-44 top-1/3 size-[560px] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-240px] left-1/3 size-[520px] rounded-full bg-purple-600/12 blur-[150px]" />
      <div className="pointer-events-none absolute -right-48 top-20 size-[520px] rounded-full bg-indigo-600/10 blur-[160px]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden min-h-screen flex-col justify-between border-r border-white/[0.06] px-12 py-10 lg:flex xl:px-20 xl:py-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map(([left, top, size, delay]) => (
              <span
                key={`${left}-${top}`}
                className="auth-particle absolute rounded-full bg-blue-300/45 shadow-[0_0_18px_rgba(96,165,250,0.8)]"
                style={{ left, top, width: size, height: size, animationDelay: delay }}
              />
            ))}
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-[0_0_32px_rgba(79,70,229,0.35)]">
              <Zap className="size-5 fill-white text-white" />
            </div>
            <span className="text-xl font-semibold tracking-[-0.03em]">Zentric</span>
            <span className="ml-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-medium tracking-wide text-blue-300">
              AI Productivity OS
            </span>
          </div>

          <div className="relative max-w-xl pb-4">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">
              <Sparkles className="size-3.5 text-blue-400" />
              Built to turn ambition into momentum
            </div>
            <h1 className="max-w-[620px] text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-white xl:text-6xl">
              Your AI-powered{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                productivity engine.
              </span>
            </h1>
            <p className="mt-7 max-w-[570px] text-base leading-7 text-slate-400 xl:text-[17px]">
              Built for students, developers, and job seekers who want to stop guessing and start
              achieving—with AI that actually understands your goals.
            </p>

            <div className="mt-10 space-y-4">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="group flex items-center gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.07] transition group-hover:border-blue-400/30 group-hover:bg-blue-400/10">
                    <Icon className="size-4 text-blue-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-slate-700">© 2026 Zentric. Focus on what matters.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[450px]">
            <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Zap className="size-4 fill-white text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Zentric</span>
            </div>

            <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.035] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-9">
              <div className="mb-8 text-center">
                <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white">
                  {mode === "signin" ? "Sign in to Zentric" : "Create your Zentric account"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {mode === "signin"
                    ? "Track your goals, one focused day at a time."
                    : "Start building a calmer, smarter path to your goals."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Your name
                    </label>
                    <div className="group relative">
                      <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600 transition group-focus-within:text-blue-400" />
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder="What should Zentric call you?"
                        autoComplete="name"
                        minLength={2}
                        maxLength={50}
                        required
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 hover:border-white/15 focus:border-blue-500/60 focus:bg-blue-500/[0.025] focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-600">
                      This name will appear in your dashboard greeting.
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600 transition group-focus-within:text-blue-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 hover:border-white/15 focus:border-blue-500/60 focus:bg-blue-500/[0.025] focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-slate-300">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() =>
                          setNotice(
                            "Password reset email is not enabled yet. Create a new account or contact the app owner.",
                          )
                        }
                        className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600 transition group-focus-within:text-blue-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      minLength={8}
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 hover:border-white/15 focus:border-blue-500/60 focus:bg-blue-500/[0.025] focus:ring-4 focus:ring-blue-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signin" && (
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(event) => setKeepSignedIn(event.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex size-4 items-center justify-center rounded border border-white/15 bg-white/5 transition peer-checked:border-blue-500 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400/50">
                      {keepSignedIn && <Check className="size-2.5 text-white" strokeWidth={3} />}
                    </span>
                    Keep me signed in for 30 days.
                  </label>
                )}

                {error && (
                  <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-xs leading-5 text-red-300">
                    {error}
                  </p>
                )}
                {notice && !error && (
                  <p className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-3.5 py-3 text-xs leading-5 text-blue-200">
                    {notice}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(79,70,229,0.25)] transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-[0_16px_45px_rgba(79,70,229,0.35)] focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signin" ? "Sign In" : "Create Account"}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-xs text-slate-500">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  {mode === "signin" ? "Create one free." : "Sign in."}
                </button>
              </p>
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-slate-700">
              Protected by encrypted credentials and secure session cookies.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
