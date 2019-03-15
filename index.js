// Deps
const path = require('path')
const defaultsDeep = require('lodash.defaultsdeep')

// Module def
module.exports = function (options) {
  
  // Default module options
  options = defaultsDeep(options, {
    css: true, // Include the css
    anchorSelector: '[data-anchor={{anchor}}]',
    transition: {
      name: 'page',
      mode: '', // So that the transition between pages feels faster
      beforeLeave: function() { this.$store.commit('ptah/transitioning', true) },
      afterEnter: function() { this.$store.commit('ptah/transitioning', false) },
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
  
  // Add the plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-page-transition-and-anchor-handler.js',
    ssr: false,
    options: JSON.stringify(options), // Pass through all options
  })
}

// Add Meta
module.exports.meta = require('./package.json')