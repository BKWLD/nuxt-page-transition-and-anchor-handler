# nuxt-page-transition-and-anchor-handler

This package add animated scrolling to all anchor links using [animated-scroll-to](https://github.com/Stanko/animated-scroll-to).  It also adds a default cross-dissolve page transition which feels faster than the normal Nuxt `out-in` transition.  This works best when you do the second step of **Install**, making the page scroll to top before the transition starts.

## Install

1. Add `nuxt-page-transition-and-anchor-handler` to your `modules` array
2. Add the following to your Nuxt "Page"s `asyncData`:
```js
{
	asyncData: function({app}) {
		// Scrolls to top of the page
		app.$scrollToTop() 
		
		// ... 
		// ...Load your page data
		// ...
		
		// Makes sure scroll has finished before allowing page transition to start
		await app.$scrollComplete() 
	}
}

## Options

- `css` (`true`) - Include the default transition styles (see `transition.css`)
- `initialDelay` (`500`) - How long to wait after the `window.onNuxtReady` event before handling the initial page anchor.  This gives the page a chance to render the elements you are trying to scroll to.
- `anchorSelector` (`[data-anchor={{anchor}}]`) - The selector to scroll to. `{{anchor}}` will be replaced with the URL hash (minus the '#').
- `transition` (see source code) - The Nuxt [transition](https://nuxtjs.org/api/configuration-transition) object
- `animatedScrollTo` (see source code) - Configuration options that can be passed to [animated-scroll-to](https://github.com/Stanko/animated-scroll-to)