import appConfig from "./app.config";
import adminConfig from "./admin.config";
import tutorConfig from "./tutor.config";
import { NextAuthConfig } from "next-auth";

const target = process.env.AUTH_APP as "app" | "tutor" | "admin";

if (!target) {
  throw new Error(
    `Invalid AUTH_APP target: ${target}. Check your .env file. you should provide AUTH_APP environment in your .env file.`
  );
}

let config: NextAuthConfig;

switch (target) {
  case "app":
    config = appConfig;
    break;
  case "admin":
    config = adminConfig;
    break;
  case "tutor":
    config = tutorConfig;
    break;
}

export default config;
