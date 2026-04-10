"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthAnimatedCard } from "@/components/auth/auth-animated-card";
import { PyramidLoader } from "@/components/ui/pyramid-loader";

function getRedirectPath(value: string | null) {
  if (!value) return "/nextshop";

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const parsed = new URL(value);
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/nextshop";
  } catch {
    return "/nextshop";
  }
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = getRedirectPath(
    searchParams.get("redirect") ?? searchParams.get("callbackUrl"),
  );
  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";

  return <AuthAnimatedCard initialMode={initialMode} redirectTo={redirectTo} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[520px] items-center justify-center px-4 py-10">
          <PyramidLoader size="lg" label="Loading..." />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
