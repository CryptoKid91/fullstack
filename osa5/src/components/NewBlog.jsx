import { useState } from 'react';
import { blogService } from '../services/blogs';

export const NewBlog = ({ blogs, setBlogs, notify, setUser }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const createBlog = async (event) => {
		event.preventDefault();
		const newBlog = { title, author, url };
		try {
			const response = await blogService.create(newBlog);
			setBlogs(blogs.concat(response));
			setTitle('');
			setAuthor('');
			setUrl('');
			notify(
				`A new blog with title ${response.title} by ${response.author} added`,
				'notice'
			);
		} catch (error) {
			if (error.name === 'AxiosError' && error.status === 401) {
				notify('Error, user not logged in', 'error');
				window.localStorage.removeItem('user');
				setUser(null);
			} else {
				console.log(error);
				notify(`Error adding new blog: ${error.message}`, 'error');
			}
		}
	};

	return (
		<div>
			<h2>Create new</h2>
			<form onSubmit={createBlog}>
				Title:{' '}
				<input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
				<br />
				Author:{' '}
				<input
					value={author}
					onChange={(event) => setAuthor(event.target.value)}
				/>
				<br />
				URL:{' '}
				<input
					value={url}
					onChange={(event) => setUrl(event.target.value)}
				/>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};
