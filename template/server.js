const path = require('path')
const Package = require('./package.json')

module.exports = class {
  constructor (router, logger, mongoose, options) {
    this.options = typeof options === 'object' ? options : {}
    this.package = Package
    this.router = router

    this.name = this.options.name || Package.title || 'Helio App'
    this.root = this.options.root || '/'
    this.static = this.options.static || path.join(__dirname, 'dist')

    // Setup CORS Allowed Origins
    this.corsAllowedOrigins = this.options.corsAllowedOrigins || ['http://localhost:3000']

    // Executes before every request
    this.router.all('*', (req, res, next) => {
      return next()
    })

    // Setup the app's routes
    this.router.get('/', this.index.bind(this))
  }

  index (req, res, next) {
    res.json({ success: true, name: this.name })
  }
}
