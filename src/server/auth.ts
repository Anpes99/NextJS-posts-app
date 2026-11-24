import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
