import { useState } from 'react';

export const NewBlog = ({ createBlog }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		const success = await createBlog({
			title,
			author,
			url,
			likes: 0,
		});
		if (success) {
			setTitle('');
			setAuthor('');
			setUrl('');
		}
	};

	return (
		<div>
			<h2>Create new</h2>
			<form onSubmit={handleSubmit}>
				Title:{' '}
				<input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					id="title-input"
				/>
				<br />
				Author:{' '}
				<input
					value={author}
					onChange={(event) => setAuthor(event.target.value)}
					id="author-input"
				/>
				<br />
				URL:{' '}
				<input
					value={url}
					onChange={(event) => setUrl(event.target.value)}
					id="url-input"
				/>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};
