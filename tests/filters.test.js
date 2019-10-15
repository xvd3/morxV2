const morx = require('../index.js');

describe('Validator functionality', () => {
  test('Should successfully extract required, email param and transform to upper case', () => {
    const paramSpec = morx.spec()
      .build('email', 'required:1,filters:toUpper')
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
    expect(morxResult).toHaveProperty('params.email', 'DDD@GMAIL.COM');
  });

  test('Should extract required, amount param and transform to double using custom validator', () => {
    morx.registerFilter('doubleNumericVal', (value) => value * 2);
    const paramSpec = morx.spec()
      .build('amount', 'required:1,filters:doubleNumericVal')
      .end();
    const testParams = {
      amount: 20,
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.amount', 40);
  });

  test('Should extract required, amount param and transform to an incremented value using custom validator with multiple arguments', () => {
    morx.registerFilter('incrementBy', (value, incrementValue) => (value * 1) + incrementValue);
    const paramSpec = morx.spec()
      .build('amount', 'required:1,filters:incrementBy')
      .end();
    paramSpec.amount.config = {
      incrementBy: {
        args: [400],
      },
    };
    const testParams = {
      amount: 20,
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.amount', 420);
  });
});
