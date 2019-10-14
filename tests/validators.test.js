const morx = require('../index.js');
const errorProxy = require('../lib/errorproxy');

describe('Validator functionality', () => {

  test('Should successfully extract required, email param', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail')
      .end();
    const testParams = {
      email: 'ddd@gmail.com',
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.email', 'ddd@gmail.com');
  });

  test('Should successfully extract required, amount param with custom validator', () => {
    morx.registerValidator('isLessThan', (value, max) => {
      return value < max;
    });
    const paramSpec = morx.spec()
      .build('amount', 'required:1,validators:isLessThan')
      .end();
    const testParams = {
      amount: 30,
    };
    paramSpec.amount.config = {
      isLessThan: {
        args: [300],
        message: 'Amount should be less than 300'
      }
    }
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.amount', 30);
  });

  test('Should not extract required, amount param with custom validator', () => {
    morx.registerValidator('isLessThan', (value, max) => {
      return value < max;
    });
    const paramSpec = morx.spec()
      .build('amount', 'required:1,validators:isLessThan')
      .end();
    const testParams = {
      amount: 309,
    };
    paramSpec.amount.config = {
      isLessThan: {
        args: [300],
        message: 'Amount should be less than 300'
      }
    }
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult.noErrors).toBe(false);
    expect(morxResult).toHaveProperty('errorMessages', 'Amount should be less than 300');
  });

  test('Should not extract required, amount param with custom validator accepting two arguments', () => {
    morx.registerValidator('isWithinRange', (value, max, min) => {
      return value > min && value < max;
    });
    const paramSpec = morx.spec()
      .build('amount', 'required:1,validators:isWithinRange')
      .end();
    const testParams = {
      amount: 309,
    };
    paramSpec.amount.config = {
      isWithinRange: {
        args: [305, 300],
        message: 'Amount should be between 300 and 305'
      }
    }
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult.noErrors).toBe(false);
    expect(morxResult).toHaveProperty('errorMessages', 'Amount should be between 300 and 305');
  });

  test('Should not extract required, amount param with custom validator accepting two arguments and throw errors', () => {
    morx.registerValidator('isWithinRange', (value, max, min) => {
      return value > min && value < max;
    });
    const paramSpec = morx.spec()
      .build('amount', 'required:1,validators:isWithinRange')
      .end();
    const testParams = {
      amount: 309,
    };
    const options = {
      throwError: true
    }
    paramSpec.amount.config = {
      isWithinRange: {
        args: [305, 300],
        message: 'Amount should be between 300 and 305'
      }
    }
    const morxResult = errorProxy(morx.validate, [testParams, paramSpec, options]);
    expect(morxResult).toThrow('Amount should be between 300 and 305');
  });

  test('Should successfully extract required, amount param with custom validator accepting two arguments', () => {
    morx.registerValidator('isWithinRange', (value, max, min) => {
      return value > min && value < max;
    });
    const paramSpec = morx.spec()
      .build('amount', 'required:1,validators:isWithinRange')
      .end();
    const testParams = {
      amount: 302,
    };
    paramSpec.amount.config = {
      isWithinRange: {
        args: [305, 300],
        message: 'Amount should be between 300 and 305'
      }
    }
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.amount', 302);
  });

  test('Should not extract required, invalid email param', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail')
      .end();
    const testParams = {
      email: 'dddgmail.com',
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(false);
    expect(morxResult).not.toHaveProperty('params.email');
    expect(morxResult).toHaveProperty('errorMessages', 'dddgmail.com failed isEmail validation');
  });

  test('Should not extract required, invalid email param and throw error', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail')
      .end();
    const testParams = {
      email: 'dddgmail.com',
    };
    const options = {
      throwError: true
    }
    const morxResult = errorProxy(morx.validate, [testParams, paramSpec, options])
    expect(morxResult).toThrow();
    expect(morxResult).toThrow('dddgmail.com failed isEmail validation');
  });

  test('Should not extract required, invalid email param and throw custom error', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail')
      .end();
    paramSpec.email.config = {
      isEmail: {
        message: "Email should be valid"
      }
    }
    const testParams = {
      email: 'dddgmail.com',
    };
    const options = {
      throwError: true
    }
    const morxResult = errorProxy(morx.validate, [testParams, paramSpec, options])
    expect(morxResult).toThrow();
    expect(morxResult).toThrow('Email should be valid');
  });

  test('Should extract required, email param and not throw error', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail')
      .end();
    const testParams = {
      email: 'ddd@gmail.com',
    };
    const options = {
      throwError: true
    }
    const morxResult = errorProxy(morx.validate, [testParams, paramSpec, options])
    expect(morxResult).not.toThrow();
    expect(morxResult).not.toThrow('dddgmail.com failed isEmail validation');
  });

});
