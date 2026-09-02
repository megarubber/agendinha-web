// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'slide-right', mode: 'out-in' },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/eslint-module",
    "@nuxt/icon",
    "@nuxt/fonts",
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config: any) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Agendinha',
      short_name: 'Agendinha',
      theme_color: '#000000'
    }
  },
  icon: {
    customCollections: [
      {
        prefix: "icons",
        dir: "./app/assets/icons",
      },
    ],
  },
  eslint: {},
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/",
      googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
      vapidPublicKey: process.env.NUXT_VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY
    },
  },
  css: ['~/assets/css/main.css'],
});
