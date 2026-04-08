"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PyramidLoader } from "@/components/ui/pyramid-loader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AuthMode = "signin" | "signup";

type AuthAnimatedCardProps = {
  initialMode?: AuthMode;
  redirectTo?: string;
};

export function AuthAnimatedCard({
  initialMode = "signin",
  redirectTo = "/nextshop",
}: AuthAnimatedCardProps) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [signingOut, setSigningOut] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isSignup = mode === "signup";
  const modeLabel = useMemo(
    () => (isSignup ? "Sign up mode" : "Sign in mode"),
    [isSignup],
  );

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmitSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInLoading(true);

    const result = await signIn("credentials", {
      email: signInForm.email,
      password: signInForm.password,
      redirect: false,
    });

    setSignInLoading(false);

    if (result?.error) {
      toast.error("Incorrect email or password");
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  };

  const handleSubmitSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignUpError(null);
    setSignUpLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpForm),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        const message = payload.message ?? "Unable to register";
        setSignUpError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created. You can sign in now.");
      setSignInForm((prev) => ({
        ...prev,
        email: signUpForm.email,
        password: "",
      }));
      setMode("signin");
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out right now");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="auth-shell">
      <div
        className={cn("auth-card", isSignup && "auth-card--signup")}
        aria-label={modeLabel}
      >
        <div className="auth-mobile-switch" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            role="tab"
            aria-selected={!isSignup}
            className={cn(
              "auth-mobile-switch__button",
              !isSignup && "auth-mobile-switch__button--active",
            )}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSignup}
            className={cn(
              "auth-mobile-switch__button",
              isSignup && "auth-mobile-switch__button--active",
            )}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <section
          className={cn(
            "auth-form-panel auth-form-panel--signin",
            isSignup && "auth-form-panel--inactive",
          )}
          aria-hidden={isSignup}
        >
          <form className="auth-form" onSubmit={handleSubmitSignIn}>
            <header className="auth-form__header">
              <p className="auth-form__eyebrow">Welcome back</p>
              <h1 className="auth-form__title">Sign in</h1>
              <p className="auth-form__subtitle">
                Use your account to continue shopping.
              </p>
            </header>

            {status === "authenticated" && (
              <div className="auth-inline-card">
                <p className="auth-inline-card__title">Already signed in</p>
                <p className="auth-inline-card__text">{session?.user?.email}</p>
                <div className="auth-inline-card__actions">
                  <button
                    type="button"
                    className="auth-action auth-action--ghost"
                    onClick={() => {
                      router.push(redirectTo);
                      router.refresh();
                    }}
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    className="auth-action auth-action--ghost"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? (
                      <span className="auth-action__loader">
                        <PyramidLoader size="xs" />
                        Signing out...
                      </span>
                    ) : (
                      "Switch account"
                    )}
                  </button>
                </div>
              </div>
            )}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                disabled={isSignup}
                autoComplete="email"
                value={signInForm.email}
                onChange={(event) =>
                  setSignInForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                required
                disabled={isSignup}
                autoComplete="current-password"
                value={signInForm.password}
                onChange={(event) =>
                  setSignInForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </label>

            <button
              type="submit"
              disabled={signInLoading || isSignup}
              className="auth-action auth-action--primary"
            >
              {signInLoading ? (
                <span className="auth-action__loader">
                  <PyramidLoader size="xs" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="auth-inline-link">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="auth-inline-link__button"
              >
                Create one
              </button>
            </p>
          </form>
        </section>

        <section
          className={cn(
            "auth-form-panel auth-form-panel--signup",
            !isSignup && "auth-form-panel--inactive",
          )}
          aria-hidden={!isSignup}
        >
          <form className="auth-form" onSubmit={handleSubmitSignUp}>
            <header className="auth-form__header">
              <p className="auth-form__eyebrow">Create your account</p>
              <h1 className="auth-form__title">Sign up</h1>
              <p className="auth-form__subtitle">
                Join NextShop and keep your orders in one place.
              </p>
            </header>

            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                required
                disabled={!isSignup}
                autoComplete="name"
                value={signUpForm.name}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                disabled={!isSignup}
                autoComplete="email"
                value={signUpForm.email}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                minLength={6}
                required
                disabled={!isSignup}
                autoComplete="new-password"
                value={signUpForm.password}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </label>

            {signUpError ? (
              <p className="auth-form__error" role="alert">
                {signUpError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={signUpLoading || !isSignup}
              className="auth-action auth-action--primary"
            >
              {signUpLoading ? (
                <span className="auth-action__loader">
                  <PyramidLoader size="xs" />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="auth-inline-link">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="auth-inline-link__button"
              >
                Sign in
              </button>
            </p>
          </form>
        </section>

        <aside className="auth-overlay-shell" aria-hidden="true">
          <div className="auth-overlay">
            <section className="auth-overlay-pane auth-overlay-pane--left">
              <p className="auth-overlay-pane__eyebrow">Welcome back</p>
              <h2 className="auth-overlay-pane__title">Hello, Friend!</h2>
              <p className="auth-overlay-pane__text">
                To keep connected, sign in with your personal details.
              </p>
              <button
                type="button"
                className="auth-action auth-action--outline"
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
            </section>

            <section className="auth-overlay-pane auth-overlay-pane--right">
              <p className="auth-overlay-pane__eyebrow">New here?</p>
              <h2 className="auth-overlay-pane__title">Create Account</h2>
              <p className="auth-overlay-pane__text">
                Enter your personal details and start your journey with us.
              </p>
              <button
                type="button"
                className="auth-action auth-action--outline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
