// Deps
const path = require('path')
const defaultsDeep = require('lodash.defaultsdeep')

// Module def
module.exports = function (options) {
  
  // Default module options
  options = defaultsDeep(options, {
    css: true, // Include the css
    initialDelay: 500,
    anchorSelector: '[data-anchor={{anchor}}]',
    transition: {
      name: 'page',
      mode: '', // So that the transition between pages feels faster
      beforeLeave: function() { this.$beforePageLeave() },
      afterEnter: function() { this.$afterPageEnter() },
    },
    animatedScrollTo: {
      maxDuration: 400
    }
  })
  
  // This package will controll scroll behavior instead
  this.options.router.scrollBehavior = function() { return false }
  
  // Set the Nuxt page transition
  this.options.transition = options.transition
  
  // Add the class
  if (options.css == true) {
    this.options.css.push(path.resolve(__dirname, 'transition.css'))
  }
  
  // Stub out client side injections so they don't break usage during SSR
  this.addPlugin({
    src: path.resolve(__dirname, 'no-ops.js'),
    fileName: 'nuxt-page-transition-and-anchor-handler-no-ops.js',
  })
  
  // Add the plugin, which overrides the no-op injections
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-page-transition-and-anchor-handler.js',
    ssr: false,
    options: JSON.stringify(options), // Pass through all options
  })
}

// Add Meta
module.exports.meta = require('./package.json')