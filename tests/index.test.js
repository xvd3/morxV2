const morx = require('../index.js');

describe('Basic functionality', () => {
  test('Should successfully extract integer id param', () => {
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

  test('Should not extract unspecified param', () => {
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
    expect(morxResult).not.toHaveProperty('params.gingerAle');
  });

  test('Should successfully extract negative integer id param', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
      id: -45,
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', -45);
  });

  test('Should successfully extract string id param', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
      id: '45',
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', '45');
  });

  test('Should successfully extract multiple params', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .build('name', 'required:1')
      .end();
    const testParams = {
      id: '45',
      name: 'Lawal Coleson',
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', '45');
    expect(morxResult).toHaveProperty('params.name', 'Lawal Coleson');
  });

  test('Should successfully extract zero string value param', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
      id: '0',
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', '0');
  });

  test('Should successfully extract zero integer value param', () => {
    const paramSpec = morx.spec()
      .build('id', 'required:1')
      .end();
    const testParams = {
      id: 0,
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.id', 0);
  });
});
