import appConfig from "./app.config";
import adminConfig from "./admin.config";
import tutorConfig from "./tutor.config";
import { NextAuthConfig } from "next-auth";

const target = process.env.AUTH_APP as "app" | "tutor" | "admin";

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
