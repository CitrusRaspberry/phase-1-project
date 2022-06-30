module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{css,html,js}'
	],
	swDest: './service-worker/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};