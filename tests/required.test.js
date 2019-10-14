const morx = require('../index.js');
const errorProxy = require('../lib/errorproxy');

describe('Required functionality', () => {
  test('Should successfully extract required id param', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
      id: 45,
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', 45);
  });

  test('Should return with errors', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(false);
    expect(morxResult.errorMessages).toBe('id is required');
  });


  test('Should throw errors', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
    };
    const options = {
      throwError: true,
    };

    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow();
    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow('id is required');
  });

  test('Should throw custom required errors', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    paramSpec.id.requireErrorMsg = 'An Id is required';
    const testParams = {
    };
    const options = {
      throwError: true,
    };

    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow();
    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow('An Id is required');
  });

  test('Should throw custom required errors', () => {
    const paramSpec = morx.spec()
      .build('id', 'n:1')
      .end();
    paramSpec.id.requireErrorMsg = 'An Id is required';
    const testParams = {
    };
    const options = {
      throwError: true,
    };

    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow();
    expect(errorProxy(morx.validate, [testParams, paramSpec, options])).toThrow('An Id is required');
  });
});
