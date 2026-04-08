import { PyramidLoader } from "@/components/ui/pyramid-loader";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4">
      <PyramidLoader size="lg" label="Loading" />
    </div>
  );
}
