const validator = require('validator');

const customValidators = {};
const customFilters = {};

function throwErrorWhen(errorFlag, messageArg) {
  const message = messageArg || 'Error';
  if (errorFlag) {
    throw new Error(message);
  }
  return null;
}

function propWalkBreak() {
  throw new Error('propwalkcircuitbreak');
}

function propWalk(object, callback) {
  const props = Object.keys(object);
  try {
    props.forEach((prop) => {
      callback(prop, propWalkBreak, object[prop]);
    });
  } catch (e) {
    if (e.message !== 'propwalkcircuitbreak') {
      throw e;
    }
  }
}

function registerValidator(validatorNameArg, validatorFuncArg) {
  // validator name should be a valid string
  const validatorName = `${validatorNameArg}`;
  const validatorFunc = validatorFuncArg;
  const typeOfValidatorFunc = typeof validatorFunc;
  const errMsg = `Expected validatorFuncArg to be of type function. Got: ${typeOfValidatorFunc}`;
  throwErrorWhen(typeOfValidatorFunc !== 'function', errMsg);
  customValidators[validatorName] = validatorFunc;
}

function registerFilter(filterNameArg, filterFuncArg) {
  // filter name should be a valid string
  const filterName = `${filterNameArg}`;
  const filterFunc = filterFuncArg;
  const typeOfFilterFunc = typeof filterFunc;
  const errMsg = `Expected filterFuncArg to be of type function. Got: ${typeOfFilterFunc}`;
  throwErrorWhen(typeOfFilterFunc !== 'function', errMsg);
  customFilters[filterName] = filterFunc;
}

registerFilter('toUpper', (strArg) => {
  const str = `${strArg}`;
  return str.toUpperCase();
});

registerFilter('toLower', (strArg) => {
  const str = `${strArg}`;
  return str.toLowerCase();
});

registerValidator('regex', (strArg, regexArg, isNot) => {
  const str = `${strArg}`;
  let testResult = regexArg.test(str);
  if (isNot) {
    testResult = !testResult;
  }
  return testResult;
});

registerValidator('truthy', (valueArg) => {
  const value = valueArg * 1;
  return !!value;
});

/**
 *
 * @param {*} value
 * @param {*} validators
 * @param {*} extras
 * extras.args [1,2,3,4]
 * extras.message
 */
function validateParamValue(value, validators, extras) {
  let noErrors = true;
  const message = [];
  validators.forEach((v) => {
    // custom validator should have a higher preference
    const vFunc = customValidators[v] || validator[v];
    const vfuncExtras = extras[v];
    const vfuncExtraArgs = (vfuncExtras && vfuncExtras.args) || [];
    const vfuncExtraCustomErrorMessage = (vfuncExtras && vfuncExtras.message);

    if (vFunc) {
      if (!vFunc(`${value}`, ...vfuncExtraArgs)) {
        const validateParamErrorMsg = `${value} failed ${v} validation`;
        message.push(vfuncExtraCustomErrorMessage || validateParamErrorMsg);
        noErrors = false;
      }
    } else {
      throwErrorWhen(true, `Validator ${v} not found`);
    }
  });

  return {
    noErrors,
    message: message.join(', '),
  };
}

function transformParamValue(valueArg, filters, extras) {
  let value = valueArg;
  filters.forEach((f) => {
    const filter = customFilters[f] || validator[f];
    const filterExtras = extras[f];
    const filterExtraArgs = (filterExtras && filterExtras.args) || [];
    if (filter) {
      value = filter(`${value}`, ...filterExtraArgs);
    } else {
      throwErrorWhen(true, `Filter ${f} not found`);
    }
  });

  return value;
}

/**
 *
 * @param {*} paramSourceArg
 * @param {*} paramSpecArg
 * @param {*} optionsArg
 * optionsArg.throwErrorOnFirstFail
 * optionsArg.failOnFirstError
 * optionsArg.throwError
 *
 * spec.config.validatorName.message [Error message to use when validator fails]
 * spec.config.validatorName.args [Extra arguments to pass to the validator or filter function]
 * spec.required [Value processed by spec is expected to be defined. Doesn't check for truthiness,
 * if 0 is passed and param is required, it passes. Consider using truthy validator if you want
 * truthy checks]
 * spec.noMap [Don't include param processed with spec in the final params object.
 * Useful for cases where you just want to validate the value is correct but not
 * use the value in a final service call with the params list]
 * spec.eg [Example value to test the spec with if running morxjest]
 */
function processParams(paramSourceArg, paramSpecArg, optionsArg) {
  const paramSource = paramSourceArg || {};
  const paramSpec = paramSpecArg || {};
  const options = optionsArg || {};
  const extractedParams = {};
  const errorMessages = [];
  const failedParams = [];
  const notParamValues = {};
  let noErrors = true;

  propWalk(paramSpec, (param, breakCb) => {
    const spec = paramSpec[param];
    const filters = spec.filters ? spec.filters.split('.') : [];
    const validators = spec.validators ? spec.validators.split('.') : [];
    const config = spec.config || {};
    let paramValue = paramSource[param];
    const typeOfParamValueFlag = typeof paramValue === 'undefined';
    const paramValueEmptyFlag = paramValue === '';
    const defaultRequireErrorMsg = spec.requireErrorMsg;
    if (spec.required && (typeOfParamValueFlag || paramValueEmptyFlag)) {
      noErrors = false;
      errorMessages.push(defaultRequireErrorMsg || `${param} is required`);
      failedParams.push(param);
      throwErrorWhen(options.throwErrorOnFirstFail, errorMessages.join(','));
      if (options.failOnFirstError) {
        breakCb();
      }
    } else if (!typeOfParamValueFlag) {
      const validated = validateParamValue(paramValue, validators, config);
      if (validated.noErrors) {
        if (!typeOfParamValueFlag) {
          paramValue = transformParamValue(paramValue, filters, config);
          // If value is not needed as an extracted param ignore it.
          if (!spec.notParam) {
            if (!spec.map) {
              extractedParams[param] = paramValue;
            } else {
              extractedParams[param] = paramValue;
            }
          } else {
            notParamValues[param] = paramValue;
          }
        }
      } else {
        noErrors = false;
        errorMessages.push(validated.message);
        failedParams.push(param);
        throwErrorWhen(options.throwErrorOnFirstFail, validated.message);
        if (options.failOnFirstError) {
          breakCb();
        }
      }
    }
  });

  const errorMessagesStr = errorMessages.join(' , ');
  throwErrorWhen(options.throwError && !noErrors, errorMessagesStr);
  return {
    noErrors,
    params: extractedParams,
    failedParams,
    excludedParams: notParamValues,
    errorMessages: errorMessagesStr,
  };
}

module.exports = {
  registerValidator,
  registerFilter,
  processParams,
};
