const dummy = (_blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, i) => sum + i.likes, 0);

module.exports = {
	dummy,
	totalLikes,
};
