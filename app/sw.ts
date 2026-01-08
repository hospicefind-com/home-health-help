/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import {
  NetworkFirst,
  ExpirationPlugin,
} from "serwist";
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const customStrategies = [
  {
    // Fixes the "implicitly has an any type" error by typing the parameter
    matcher: ({ request }: { request: Request }) => {
      const isDocument = request.destination === "document"
      const isRsc = request.headers.get("RSC") === "1";
      return isDocument || isRsc;
    },
    handler: new NetworkFirst({
      cacheName: "pages-runtime-cache",
      plugins: [
        {
          // Optional: ensuring we don't cache error pages
          cacheWillUpdate: async ({ response }) => {
            if (response && response.status === 200) return response;
            return null;
          },
        },

        new ExpirationPlugin({
          maxEntries: 50, // Keep the last 50 visited pages
          maxAgeSeconds: 7 * 24 * 60 * 60, // Clean up after a week
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...customStrategies, ...defaultCache],
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
