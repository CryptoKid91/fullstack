import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewBlog } from './NewBlog';

const blog = {
	title: 'Testing with Jest',
	author: 'Tester',
	url: 'www.exampple.com',
	likes: 42,
	user: {
		username: 'bob',
	},
};

test('renders content', async () => {
	const mockHandler = jest.fn();

	const { container } = render(<NewBlog createBlog={mockHandler} />);

	const user = userEvent.setup();
	const button = screen.getByText('Create');

	const titleInput = container.querySelector('#title-input');
	const authorInput = container.querySelector('#author-input');
	const urlInput = container.querySelector('#url-input');

	await user.type(titleInput, blog.title);
	await user.type(authorInput, blog.author);
	await user.type(urlInput, blog.url);
	await user.click(button);

	expect(mockHandler.mock.calls).toHaveLength(1);
	expect(mockHandler.mock.calls[0][0].title).toBe(blog.title);
	expect(mockHandler.mock.calls[0][0].author).toBe(blog.author);
	expect(mockHandler.mock.calls[0][0].url).toBe(blog.url);
	expect(mockHandler.mock.calls[0][0].likes).toBe(0);
});
