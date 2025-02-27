import { useState } from 'react';

export const NewBlog = ({ createBlog }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		const newBlog = { title, author, url, likes: 0 };
		try {
			await createBlog(newBlog);
			setTitle('');
			setAuthor('');
			setUrl('');
		} catch {}
	};

	return (
		<div>
			<h2>Create new</h2>
			<form onSubmit={handleSubmit}>
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
