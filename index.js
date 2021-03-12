// Deps
const path = require('path')

// Module def
module.exports = function (options) {

	// Default module options
	options = {
		...options,
		...this.options.ptah,
	}

	// Set defaults
	options = {
		css: true, // Include the css
		initialDelay: 500,
		anchorSelector: '[data-anchor={{anchor}}]',
		transition: {
			name: 'ptah',
			mode: '', // So that the transition between pages feels faster
			beforeLeave: function() { this.$beforePageLeave() },
			afterEnter: function() { this.$afterPageEnter() },
			...(options.transition || {}),
		},
		...options
	}

	// This package will controll scroll behavior instead
	this.options.router.scrollBehavior = function() { return false }

	// Set the Nuxt page transition
	this.options.transition = options.transition
	this.options.pageTransition = options.transition // Nuxt >= 2.7

	// Add the class
	if (options.css == true) {
		this.options.css.push(path.resolve(__dirname, 'transition.css'))
	}

	// Stub out client side injections so they don't break usage during SSR
	this.addPlugin({
		src: path.resolve(__dirname, 'no-ops.js'),
		fileName: 'nuxt-page-transition-and-anchor-handler-no-ops.js',
		mode: 'server',
	})

	// Add the plugin, which overrides the no-op injections
	this.addPlugin({
		src: path.resolve(__dirname, 'plugin.js'),
		fileName: 'nuxt-page-transition-and-anchor-handler.js',
		mode: 'client',
		options: JSON.stringify(options), // Pass through all options
	})
}

// Add Meta
module.exports.meta = require('./package.json')
