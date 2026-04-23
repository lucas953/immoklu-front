import createMiddleware from "next-intl/middleware";
import { routing } from "@immoklu/i18n";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|es|fr)/:path*"]
};
