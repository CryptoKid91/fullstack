import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Blog } from './Blog';

const blog = {
	title: 'Testing with Jest',
	author: 'Tester',
	url: 'www.exampple.com',
	likes: 42,
	user: {
		username: 'bob',
	},
};

const dummy = () => {};

describe('A Blog component', () => {
	test('renders content', () => {
		render(
			<Blog
				blog={blog}
				user={{ username: 'bob' }}
				addLike={dummy}
				deleteBlog={dummy}
			/>
		);

		const title = screen.getByText(blog.title, { exact: false });
		expect(title).toBeDefined();

		const author = screen.getByText(blog.author, { exact: false });
		expect(author).toBeDefined();
	});

	test('calls addLike once for every like-button press', async () => {
		const mockHandler = jest.fn();

		render(
			<Blog
				blog={blog}
				user={{ username: 'bob' }}
				addLike={mockHandler}
				deleteBlog={dummy}
			/>
		);

		const user = userEvent.setup();
		const button = screen.getByText('Like');
		await user.dblClick(button);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
