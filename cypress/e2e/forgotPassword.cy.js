import 'cypress-axe';
import logViolation from "./violationFunction"

describe('forgot password Page Accessibility test', () => {
  it('Has no detectable a11y violations on load', () => {
    cy.visit('http://192.168.1.8:5173/forgotpassword');
    cy.get('#root', { timeout: 10000 }).should('exist');
    cy.injectAxe();
    cy.checkA11y(null, null, logViolation); // defaults to checking entire document
  });
});

