import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  reactStrictMode: true,
  transpilePackages: ["@immoklu/ui", "@immoklu/types", "@immoklu/i18n", "@immoklu/api-client"]
});
