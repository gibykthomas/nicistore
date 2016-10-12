// Load config according to environment
var config = require('../config/client/' + process.env.NODE_ENV);
export default config;