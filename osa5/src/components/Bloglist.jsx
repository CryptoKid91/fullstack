import { Blog } from './Blog';

export const Bloglist = ({ blogs, user, logout }) => (
	<div>
		Logged in as {user} <button onClick={logout}>logout</button>
		<br />
		{blogs.map((blog) => (
			<Blog key={blog.id} blog={blog} />
		))}
	</div>
);
