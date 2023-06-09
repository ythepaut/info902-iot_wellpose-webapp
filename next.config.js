/** @type {import('next').NextConfig} */
const nextConfig = require("next-pwa")({
    dest: "public",
});

module.exports = nextConfig({
    publicRuntimeConfig: {
        environment: process.env.ENVIRONMENT,
    },
    serverRuntimeConfig: {
        mongodbUri: process.env.MONGODB_URI,
        mongodbDatabase: process.env.MONGODB_DATABASE,
    },
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ["fr", "en"],
        defaultLocale: "fr",
    },
});
