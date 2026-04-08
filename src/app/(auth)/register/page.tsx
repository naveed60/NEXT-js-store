"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthAnimatedCard } from "@/components/auth/auth-animated-card";
import { PyramidLoader } from "@/components/ui/pyramid-loader";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/nextshop";

  return <AuthAnimatedCard initialMode="signup" redirectTo={redirectTo} />;
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[520px] items-center justify-center px-4 py-10">
          <PyramidLoader size="lg" label="Loading..." />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
