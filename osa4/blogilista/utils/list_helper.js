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

	const authors = [];
	for (const blog of blogs) {
		const i = authors.findIndex((e) => e.author === blog.author);

		if (i === -1) {
			authors.push({
				author: blog.author,
				blogs: 1,
			});
		} else {
			authors[i].blogs++;
		}
	}

	return authors.sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return;
	}

	const authors = [];
	for (const blog of blogs) {
		const i = authors.findIndex((e) => e.author === blog.author);

		if (i === -1) {
			authors.push({
				author: blog.author,
				likes: blog.likes,
			});
		} else {
			authors[i].likes += blog.likes;
		}
	}

	return authors.sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
