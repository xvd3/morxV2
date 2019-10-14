const morx = require('../index.js');
const errorProxy = require('../lib/errorproxy');

describe('Validator functionality', () => {

  test('Should successfully extract a mix of all params', () => {
    morx.registerFilter('convertPercentage', (value) => {
      return (value * 1) / 100;
    })
    morx.registerValidator('lessThan', (value, max) => {
      return (value * 1) < max
    })
    morx.registerValidator('isWithin', (value, max, min) => {
      return ((value * 1) < max) && ((value * 1) > min)
    });
    const paramSpec = morx.spec()
      .build('email', 'required:1,validators:isEmail,filters:toUpper')
      .build('fullname', 'required:1,filters:toUpper')
      .build('fee', 'required:1,validators:lessThan')
      .build('age', 'required:1,validators:isWithin')
      .build('interestRate', 'required:1,filters:convertPercentage')
      .end();
      paramSpec.fee.config = {
        lessThan: {
          args: [100]
        }
      }
      paramSpec.age.config = {
        isWithin: {
          args: [25, 18]
        }
      }
    const testParams = {
      email: 'ddd@gmail.com',
      fullname: 'David Ola',
      fee: 55,
      age: 20,
      interestRate: 45
    };
    const morxResult = morx.validate(testParams, paramSpec);
    expect(morxResult).toHaveProperty('noErrors');
    expect(morxResult).toHaveProperty('params');
    expect(morxResult).toHaveProperty('failedParams');
    expect(morxResult).toHaveProperty('excludedParams');
    expect(morxResult).toHaveProperty('errorMessages');
    expect(morxResult.noErrors).toBe(true);
    expect(morxResult).toHaveProperty('params.email', 'DDD@GMAIL.COM');
    expect(morxResult).toHaveProperty('params.fullname', 'DAVID OLA');
    expect(morxResult).toHaveProperty('params.age', 20);
    expect(morxResult).toHaveProperty('params.fee', 55);
    expect(morxResult).toHaveProperty('params.interestRate', 0.45);
  });

});
