
try {
    module.exports = require('./compiled/index');
} catch(error) {
    require('./node_modules/coffee-script/lib/coffee-script/coffee-script');
    module.exports = require('./lib/index');
}

