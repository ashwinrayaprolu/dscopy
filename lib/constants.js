'use strict';

var object = require('./utils/object');
var bigConstants = require('./utils/bignumber/constants');

function factory (type, config, load, typed, dscopy) {
  // listen for changed in the configuration, automatically reload
  // constants when needed
  dscopy.on('config', function (curr, prev) {
    if (curr.number !== prev.number) {
      factory(type, config, load, typed, dscopy);
    }
  });

  dscopy['true']     = true;
  dscopy['false']    = false;
  dscopy['null']     = null;
  dscopy['uninitialized'] = require('./utils/array').UNINITIALIZED;

  if (config.number === 'bignumber') {
    dscopy['Infinity'] = new type.BigNumber(Infinity);
    dscopy['NaN']      = new type.BigNumber(NaN);

    object.lazy(dscopy, 'pi',  function () {return bigConstants.pi(type.BigNumber)});
    object.lazy(dscopy, 'tau', function () {return bigConstants.tau(type.BigNumber)});
    object.lazy(dscopy, 'e',   function () {return bigConstants.e(type.BigNumber)});
    object.lazy(dscopy, 'phi', function () {return bigConstants.phi(type.BigNumber)}); // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in dscopy)
    object.lazy(dscopy, 'E',       function () {return dscopy.e;});
    object.lazy(dscopy, 'LN2',     function () {return new type.BigNumber(2).ln();});
    object.lazy(dscopy, 'LN10',    function () {return new type.BigNumber(10).ln()});
    object.lazy(dscopy, 'LOG2E',   function () {return new type.BigNumber(1).div(new type.BigNumber(2).ln());});
    object.lazy(dscopy, 'LOG10E',  function () {return new type.BigNumber(1).div(new type.BigNumber(10).ln())});
    object.lazy(dscopy, 'PI',      function () {return dscopy.pi});
    object.lazy(dscopy, 'SQRT1_2', function () {return new type.BigNumber('0.5').sqrt()});
    object.lazy(dscopy, 'SQRT2',   function () {return new type.BigNumber(2).sqrt()});
  }
  else {
    dscopy['Infinity'] = Infinity;
    dscopy['NaN']      = NaN;

    dscopy.pi  = dscopy.PI;
    dscopy.tau = dscopy.PI * 2;
    dscopy.e   = dscopy.E;
    dscopy.phi = 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in dscopy)
    dscopy.E           = dscopy.e;
    dscopy.LN2         = dscopy.LN2;
    dscopy.LN10        = dscopy.LN10;
    dscopy.LOG2E       = dscopy.LOG2E;
    dscopy.LOG10E      = dscopy.LOG10E;
    dscopy.PI          = dscopy.pi;
    dscopy.SQRT1_2     = dscopy.SQRT1_2;
    dscopy.SQRT2       = dscopy.SQRT2;
  }

  // complex i
  dscopy.i = new type.Complex(0, 1);

  // meta information
  dscopy.version = require('./version');
}

exports.factory = factory;
exports.lazy = false;  // no lazy loading of constants, the constants themselves are lazy when needed
exports.dscopy = true;   // request access to the dscopy namespace