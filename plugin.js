// Get settings from the module
const options = JSON.parse('<%= options %>');

// Export the plugin config
export default function({ app, store }, inject) {

	// Make the VueX module
	const vuexModule = {
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
	}

	// Add our VueX module to the store.  I tried to make a seperate file but
	// something gets confused in the Nuxt module. It seems to want to preserve
	// state by default, so I'm explicitly disabling this so state doesn't end
	// up undefined when running in SSR
	store.registerModule('ptah', vuexModule, {
		preserveState: false
	})

	// Scroll to an element or value
	function scrollTo (target) {

		// Figure out the offset we're scrolling to
		const scrollY = target instanceof Element ?
			Math.floor(target.getBoundingClientRect().top + window.scrollY) :
			parseInt(target)

		// Start scrolling
		store.commit('ptah/startScroll', executeScroll(scrollY)

		// Update the scolling boolean after it's done
		.then(function() {
			store.commit('ptah/stopScroll')
		}))
	}

	// Do native scrolling and watch for scroll to complete. Using polling
	let checkScrollDone;
	function executeScroll(scrollY) {

		// If already at target, immediately resolve
		if (window.scrollY == scrollY) return Promise.resolve()

		// Cancel previous scroll listener
		if (checkScrollDone) {
			window.removeEventListener('scroll', checkScrollDone, { passive: true })
		}

		// Make promise
		return new Promise(resolve => {

			// Check if the scroll has finished
			checkScrollDone = () => {
				if (window.scrollY != scrollY) return
				window.removeEventListener('scroll', checkScrollDone, { passive: true })
				checkScrollDone = null
				resolve()
			}

			// Start scrolling and listener for complete
			window.addEventListener('scroll', checkScrollDone, { passive: true })
			window.scrollTo({ top: scrollY, behavior: 'smooth' })
		})
	}

	// Scroll to the current anchor on the page
	function scollToHash() {

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

	// Syntactic sugare for getting the scrolling boolean
	inject('scrollComplete', function () {
		return store.state.ptah.scrolling;
	})

	// Handle beforeLeave transition events (e.g. the transition has started)
	inject('beforePageLeave', function() {
		this.$store.commit('ptah/transitioning', true)
	})

	// Handle afterEnter transition events (e.g. the transition is done),
	// scrolling if there is a relevant hash after waiting a tick (at minimum).
	inject('afterPageEnter', function() {
		this.$store.commit('ptah/transitioning', false)
		setTimeout(scollToHash, options.afterPageChangeDelay)
	})

	// Set the vertical offset at runtime
	inject('setVerticalOffset', function(height) {
		options.animatedScrollTo.verticalOffset = height
	})

	// Scroll to top when switching to page with a new path. This hook is fired
	// before asyncData. We're not scrolling to top on query param changes or
	// hash changes which are assumed to be the same page. When from.name is
	// undefined, this indicates the initial request and thus no need to scroll.
	app.router.beforeEach((to, from, next) => {
		if (process.client && from.name && to.path != from.path) scrollTo(0)
		next()
	})

	// Wait until scrolling to top has finished. This hook is fired after
	// asyncData but before navigation happens
	app.router.beforeResolve((to, from, next) => {
		if (process.client) store.state.ptah.scrolling.then(next)
		else next()
	})

}
