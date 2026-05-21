import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL must be configured for Vercel deployments.");
}

export default withNextIntl({
  reactStrictMode: true,
  transpilePackages: ["@immoklu/ui", "@immoklu/types", "@immoklu/i18n", "@immoklu/api-client"]
});
