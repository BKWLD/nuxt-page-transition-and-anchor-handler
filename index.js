// Deps
const path = require('path')
const defaultsDeep = require('lodash.defaultsdeep')

// Module def
module.exports = function (options) {
  
  // Add the plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-page-transition-and-anchor-handler.js',
    ssr: false,
    
    // Set default options
    options: JSON.stringify(defaultsDeep(options, {
      anchorSelector: '[data-anchor={{anchor}}]',
      animatedScrollTo: {
        maxDuration: 400
      }
    })),
  })
}

// Add Meta
module.exports.meta = require('./package.json')