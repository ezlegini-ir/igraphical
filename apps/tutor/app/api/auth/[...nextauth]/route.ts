import { handlers } from "@igraph/auth";

// for understanding the auth flow of this constant, you can refer to the auth.config.ts file in the packages/auth folder
// this constant is used to determine which auth config to use based on the AUTH_APP environment variable
// here we just wnna reject the request if the AUTH_APP is not set
// this is because we are using the auth config in the auth.config.ts file to determine which auth config to use
const targetApp = process.env.AUTH_APP as "app" | "admin" | "tutor";

if (!targetApp || targetApp !== "tutor") {
  throw new Error("AUTH_APP not defined. Try do define it in the .env file");
}

export const { GET, POST } = handlers;
