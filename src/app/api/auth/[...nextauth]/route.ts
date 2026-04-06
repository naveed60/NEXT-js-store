// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NextAuth = (require("next-auth") as any).default;
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
