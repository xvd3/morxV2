const specer = require('./lib/morxspecer');
const extractor = require('./lib/paramextractor');

const morx = {};

morx.spec = specer.spec;
morx.validate = extractor.processParams;
module.exports = morx;
