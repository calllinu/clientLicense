// cypress.config.cjs
const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: false,
        setupNodeEvents(on, config) {
            on("before:run", (details) => {
                console.log("Resolved spec files:", details.specs);
            });
        },
    },
});
