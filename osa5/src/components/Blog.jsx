import PropTypes from 'prop-types';

export const Blog = ({ blog, addLike, user, deleteBlog }) => (
	<div className="blog">
		{blog.title}, {blog.author}, likes: {blog.likes}{' '}
		<button onClick={addLike}>Like</button>{' '}
		{blog.user.username === user.username && (
			<button onClick={deleteBlog}>Delete</button>
		)}
	</div>
);

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	deleteBlog: PropTypes.func.isRequired,
};
