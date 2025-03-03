Cypress.Commands.add('login', ({ username, password }) => {
	cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
		username,
		password,
	}).then(({ body }) => {
		localStorage.setItem('user', JSON.stringify(body));
		cy.visit('http://localhost:5173');
	});
});

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
	cy.request({
		url: `${Cypress.env('BACKEND')}/blogs`,
		method: 'POST',
		body: { title, author, url },
	});

	cy.visit('http://localhost:5173');
});
