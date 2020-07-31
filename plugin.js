// Deps
import animatedScrollTo from 'animated-scroll-to'

// Get settings from the module
const options = JSON.parse('<%= options %>');

// Export the plugin config
export default function({ app, route, store }, inject) {

	// Add our VueX module to the store.  I tried to make a seperate file but
	// something gets confused in the Nuxt module
	store.registerModule('ptah', {
		namespaced: true,
		state: {
			scrolling: process.client ? Promise.resolve() : null,
			isScrolling: false,
			isTransitioning: false,
		},
		mutations: {

			// Track scrolling
			startScroll: function(state, promise) {
				state.scrolling = promise;
				state.isScrolling = true
			},

			// Mark the scroll stopped
			stopScroll: function(state) {
				state.isScrolling = false
			},

			// Track transitioning
			transitioning: function(state, bool) {
				state.isTransitioning = bool
			},
		}
	})

	// Scroll and store whether a scroll is happening in vuex
	const scrollTo = function(target) {
		store.commit('ptah/startScroll', animatedScrollTo(target, {
			...options.animatedScrollTo,
		})

		// Update the scolling boolean after it's done
		.then(function() {
			store.commit('ptah/stopScroll')
		}))
	}

	// Scroll to the current anchor on the page
	const scollToHash = function() {

		// Require a hash
		if (!app.router.currentRoute.hash) return
		const anchor = app.router.currentRoute.hash.substring(1)

		// Check for element on the page to match the hash
		const selector = options.anchorSelector.replace('{{anchor}}', anchor)
		const el = document.querySelector(selector)
		if (!el) return

		// Scroll to the anchor
		scrollTo(el)
	}

	// React to route changes when only the hash changes.  Other page changes are
	// handled by the global layout transition.
	app.router.afterEach(function (to, from) {
		if (to.path === from.path && to.hash !== from.hash) {
			scollToHash();
		}
	})

	// Listen for the initial page build and then wait a bit for it to finish
	// rendering.
	window.onNuxtReady(function() {
		return setTimeout(scollToHash, options.initialDelay);
	})

	// Inject a scroll to top helper
	inject('scrollTo', scrollTo)

	// Inject a scroll to top helper
	inject('scrollToTop', function () {
		scrollTo(0)
	})

	// Syntactic sugare for getitng the scrolling boolean
	inject('scrollComplete', function () {
		return store.state.ptah.scrolling;
	})

	// Handle beforeLeave transition events (e.g. the transition has started)
	inject('beforePageLeave', function() {
		this.$store.commit('ptah/transitioning', true)
	})
	// Handle afterEnter transition events (e.g. the transition is done)
	inject('afterPageEnter', function() {
		this.$store.commit('ptah/transitioning', false)
		scollToHash() // If route change included a hash, scroll to it
	})

	// Set the vertical offset at runtime
	inject('setVerticalOffset', function(height) {
		options.animatedScrollTo.verticalOffset = height
	})
}
