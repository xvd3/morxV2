const specer = require('./lib/morxspecer');
const extractor = require('./lib/paramextractor');

const morx = {};

morx.spec = specer.spec;
morx.validate = extractor.processParams;
morx.registerValidator = extractor.registerValidator;
morx.registerFilter = extractor.registerFilter;
module.exports = morx;
