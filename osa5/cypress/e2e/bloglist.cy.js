describe('Bloglist ', function () {
	beforeEach(function () {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
		const user = {
			name: 'Testi Ukko',
			username: 'tukko',
			password: 'hunter2',
		};
		cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user);
		cy.visit('');
	});

	it('front page can be opened', function () {
		cy.contains('Blogs');
		cy.contains('Login');
	});

	it('user can log in', function () {
		cy.get('#username').type('tukko');
		cy.get('#password').type('hunter2');
		cy.get('#login-button').click();
		cy.contains('Logged in as Testi Ukko');
	});

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({
				username: 'tukko',
				password: 'hunter2',
			});
		});

		it('a new blog can be created', function () {
			cy.contains('New blog').click();
			cy.get('#title-input').type('a blog created by cypress');
			cy.get('#author-input').type('cypress');
			cy.get('#url-input').type('www.example.com');
			cy.get('#new-blog-button').click();
			cy.contains('a blog created by cypress');
		});

		describe('and a blog exists', function () {
			beforeEach(function () {
				cy.createBlog({
					title: 'first blog created by cypress',
					author: 'cypress',
					url: 'www.example.com',
				});
				cy.createBlog({
					title: 'second blog created by cypress',
					author: 'cypress',
					url: 'www.example.com',
				});
				cy.createBlog({
					title: 'third blog created by cypress',
					author: 'cypress',
					url: 'www.example.com',
				});
			});

			it('it can be liked', function () {
				cy.contains('second blog created by cypress, cypress')
					.contains('Like')
					.click();

				cy.contains('second blog created by cypress, cypress').contains(
					'likes: 1'
				);
			});

			it('it can be deleted', function () {
				cy.contains('second blog created by cypress, cypress')
					.contains('Delete')
					.click();

				cy.get('.notice')
					.should('contain', 'second blog')
					.and('have.css', 'color', 'rgb(0, 128, 0)')
					.and('have.css', 'border-style', 'solid');
				cy.get('.blog').should('not.contain', 'second blog');
			});
		});
	});

	it('login fails with wrong password', function () {
		cy.get('#username').type('tukko');
		cy.get('#password').type('wrong');
		cy.get('#login-button').click();

		cy.get('.error')
			.should('contain', 'wrong credentials')
			.and('have.css', 'color', 'rgb(255, 0, 0)')
			.and('have.css', 'border-style', 'solid');

		cy.get('html').should('not.contain', 'Logged in as');
	});
});
