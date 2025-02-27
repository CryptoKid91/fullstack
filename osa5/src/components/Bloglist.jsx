import { Blog } from './Blog';

export const Bloglist = ({ blogs, user, logout, addLike, deleteBlog }) => (
	<div>
		Logged in as {user.name} <button onClick={logout}>logout</button>
		<br />
		<br />
		{blogs
			.sort((a, b) => b.likes - a.likes)
			.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					addLike={addLike(blog)}
					user={user}
					deleteBlog={deleteBlog(blog)}
				/>
			))}
	</div>
);
