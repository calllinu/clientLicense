describe('Profile Page Tests', () => {
    const userEmail = 'clupascu003@gmail.com';
    const userPassword = '123123C@';

    const mockEmployee = {
        employee: {
            fullName: 'Jane Doe',
            employeeCNP: '1234567890123',
            dateOfBirth: '1990-01-01',
            dateOfHiring: '2020-01-01',
            qualification: 'High School',
            yearsOfExperience: 5,
        },
    };

    Cypress.Commands.add('loginUI', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type(userPassword);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    });

    beforeEach(() => {
        cy.intercept('GET', '**/employee?userId=*', {
            statusCode: 200,
            body: mockEmployee,
        }).as('getEmployee');

        cy.loginUI();
        cy.contains('Profile').click();
    });

    it('should display profile information correctly', () => {
        cy.get('.ant-card').should('exist');
        cy.contains(mockEmployee.employee.fullName).should('exist');
    });

    it('should update profile successfully', () => {
        cy.intercept('PUT', '**/employee/update', {
            statusCode: 200,
            body: {success: true},
        }).as('updateEmployee');

        cy.get('input[name="fullName"]').clear().type('Jane Doe');
        cy.get('input[name="employeeCNP"]').clear().type('9876543210987');
        cy.get('.ant-picker-input input').eq(0).clear().type('01-01-1995');
        cy.get('.ant-picker-input input').eq(1).clear().type('01-01-2021');
        cy.get('.ant-select').eq(0).click();
        cy.get('.ant-select-item-option').contains('High School').click();

        cy.get('button[type="submit"]').click();

        cy.contains('Your profile has been successfully updated!').should('exist');
    });
});