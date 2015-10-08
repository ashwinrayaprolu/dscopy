var isFactory = require('./../utils/object').isFactory;
var deepExtend = require('./../utils/object').deepExtend;
var typedFactory = require('./typed');
var emitter = require('./../utils/emitter');

var importFactory = require('./import');
var configFactory = require('./config');

/**
 * dscopy.js core. Creates a new, empty dscopy.js instance
 * @param {Object} [options] Available options:
 *                            {number} epsilon
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'matrix' (default) or 'array'.
 *                            {string} number
 *                              A string 'number' (default), 'bignumber', or 'fraction'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 *                            {boolean} predictable
 *                              Predictable output type of functions. When true,
 *                              output type depends only on the input types. When
 *                              false (default), output type can vary depending
 *                              on input values. For example `dscopy.sqrt(-2)`
 *                              returns `NaN` when predictable is false, and
 *                              returns `complex('2i')` when true.
 * @returns {Object} Returns a bare-bone dscopy.js instance containing
 *                   functions:
 *                   - `import` to add new functions
 *                   - `config` to change configuration
 *                   - `on`, `off`, `once`, `emit` for events
 */
exports.create = function create (options) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
    'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // cached factories and instances
  var factories = [];
  var instances = [];

  // create a namespace for the dscopyjs instance, and attach emitter functions
  var dscopy = emitter.mixin({});
  dscopy.type = {};
  dscopy.expression = {
    transform: Object.create(dscopy)
  };

  // create a new typed instance
  dscopy.typed = typedFactory.create(dscopy.type);

  // create configuration options. These are private
  var _config = {
    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-14,

    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'matrix',

    // type of default number output. Choose 'number' (default) or 'bignumber'
    number: 'number',

    // number of significant digits in BigNumbers
    precision: 64,

    // predictable output type of functions. When true, output type depends only
    // on the input types. When false (default), output type can vary depending
    // on input values. For example `dscopy.sqrt(-2)` returns `NaN` when
    // predictable is false, and returns `complex('2i')` when true.
    predictable: false
  };

  if (options) {
    // merge options
    deepExtend(_config, options);
  }

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {{type: string, name: string, factory: Function}} factory
   * @returns {*}
   */
  function load (factory) {
    if (!isFactory(factory)) {
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }

    var index = factories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.dscopy === true) {
        // pass with dscopy namespace
        instance = factory.factory(dscopy.type, _config, load, dscopy.typed, dscopy);
      }
      else {
        instance = factory.factory(dscopy.type, _config, load, dscopy.typed);
      }

      // append to the cache
      factories.push(factory);
      instances.push(instance);
    }
    else {
      // already existing function, return the cached instance
      instance = instances[index];
    }

    return instance;
  }

  // load the import and config functions
  dscopy['import'] = load(importFactory);
  dscopy['config'] = load(configFactory);

  return dscopy;
};
