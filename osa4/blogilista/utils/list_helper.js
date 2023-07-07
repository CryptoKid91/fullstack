const dummy = (_blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, i) => sum + i.likes, 0);

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return;
	}

	let best = 0;
	for (const [i, blog] of blogs.entries()) {
		if (blog.likes > blogs[best].likes) {
			best = i;
		}
	}

	return blogs[best];
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return;
	}

	const authors = new Map();
	for (const blog of blogs) {
		const count = (authors.get(blog.author) || 0) + 1;
		authors.set(blog.author, count);
	}

	const a = Array.from(authors).sort((a, b) => b[1] - a[1]);
	return { author: a[0][0], blogs: a[0][1] };
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return;
	}

	const authors = new Map();
	for (const blog of blogs) {
		const likes = (authors.get(blog.author) || 0) + blog.likes;
		authors.set(blog.author, likes);
	}

	const a = Array.from(authors).sort((a, b) => b[1] - a[1]);
	return { author: a[0][0], likes: a[0][1] };
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
