// Make no-ops for each injection
export default function({ }, inject) {
	
	// Inject a scroll to top helper 
	inject('scrollTo', () => {} )
	
	// Inject a scroll to top helper 
	inject('scrollToTop', () => {} )
	
	// Syntactic sugare for getitng the scrolling boolean
	inject('scrollComplete', () => {} )
	
	// Handle beforeLeave transition events (e.g. the transition has started)
	inject('beforePageLeave', () => {} )
	
	// Handle afterEnter transition events (e.g. the transition is done)
	inject('afterPageEnter', () => {} )
	
}