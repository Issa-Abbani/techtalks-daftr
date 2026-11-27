/*
 * Browser test setup. Tests run against the production build (`npm run build`
 * first), served on port 3123, in your installed Google Chrome.
 */
import { defineConfig } from "@playwright/test";

const PORT = 3123;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Uses the locally installed Google Chrome, so no browser download is needed.
    channel: "chrome",
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
