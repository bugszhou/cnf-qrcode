if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dist/cnf-qrcode.js')
} else {
  module.exports = require('./dist/cnf-qrcode.common.js')
}
