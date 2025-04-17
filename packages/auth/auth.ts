import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { database } from "@igraph/database";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(database),
  session: { strategy: "jwt" },
  ...authConfig,
});
