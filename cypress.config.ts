import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        evalCode(code) {
          // This would require additional setup for running TS/JS code
          // For now, return null - in real implementation you'd eval the code
          return null;
        },
      });
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
  },

  downloadsFolder: "cypress/downloads",
  fixturesFolder: "cypress/fixtures",
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",

  env: {
    // Add environment variables for testing
    NODE_ENV: "test",
  },
});
