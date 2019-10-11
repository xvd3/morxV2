const Mosc = require('mosc');

const morxSpecer = {};
morxSpecer.spec = (context) => new Mosc({ context });

module.exports = morxSpecer;
