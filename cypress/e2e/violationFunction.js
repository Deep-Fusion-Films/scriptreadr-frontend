export default function logViolation(violations) {
    violations.forEach((violation) => {
        cy.log(`Violation: ${violation.id} - ${violation.help}`);
        console.log(`violation details:`, violation);

        violation.nodes.forEach((node) => {
            console.log('Element causing issue:', node.html);
            console.log(`Failure summary:`, node.failureSummary);
        })

    })
    }
