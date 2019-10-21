const specer = require('./lib/morxspecer');
const extractorFunc = require('./lib/paramextractor');

/**
 * If you call morxExport()
 * You get a closure that allows you
 * have contained config for each morx instance you require
 * 
 * For backward compatibility, we will get default values and set on the
 * export function as well so morx works as it used to
 */

const globalExtractor = extractorFunc();
function morxExport () {
  const morx = {};
  const extractor = extractorFunc();
  morx.spec = specer.spec;
  morx.validate = extractor.processParams;
  morx.registerValidator = extractor.registerValidator;
  morx.registerFilter = extractor.registerFilter;
  morx.setCustomErrorClass = extractor.setCustomErrorClass;
  morx.getCustom = extractor.getCustom; 
  return morx;
}

morxExport.spec = specer.spec;
morxExport.validate = globalExtractor.processParams;
morxExport.registerValidator = globalExtractor.registerValidator;
morxExport.registerFilter = globalExtractor.registerFilter;
morxExport.setCustomErrorClass = globalExtractor.setCustomErrorClass;
morxExport.getCustom = globalExtractor.getCustom;
module.exports = morxExport;
