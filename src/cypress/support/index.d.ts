declare namespace Cypress {
    interface Chainable {
        loginUI(): Chainable<void>;
    }
}