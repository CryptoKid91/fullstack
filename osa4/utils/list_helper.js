const dummy = (_) => 1;

const totalLikes = (blogs) => {
	if (blogs.length === 0) return 0;
	return blogs.reduce((s, i) => s + i.likes, 0);
};

module.exports = { dummy, totalLikes };
