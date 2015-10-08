'use strict';

var lazy = require('../utils/object').lazy;
var isFactory = require('../utils/object').isFactory;
var traverse = require('../utils/object').traverse;
var extend = require('../utils/object').extend;
var ArgumentsError = require('../error/ArgumentsError');

function factory (type, config, load, typed, dscopy) {
  /**
   * Import functions from an object or a module
   *
   * Syntax:
   *
   *    dscopy.import(object)
   *    dscopy.import(object, options)
   *
   * Where:
   *
   * - `object: Object`
   *   An object with functions to be imported.
   * - `options: Object` An object with import options. Available options:
   *   - `override: boolean`
   *     If true, existing functions will be overwritten. False by default.
   *   - `silent: boolean`
   *     If true, the function will not throw errors on duplicates or invalid
   *     types. False by default.
   *   - `wrap: boolean`
   *     If true, the functions will be wrapped in a wrapper function
   *     which converts data types like Matrix to primitive data types like Array.
   *     The wrapper is needed when extending dscopy.js with libraries which do not
   *     support these data type. False by default.
   *
   * Examples:
   *
   *    // define new functions and variables
   *    dscopy.import({
   *      myvalue: 42,
   *      hello: function (name) {
   *        return 'hello, ' + name + '!';
   *      }
   *    });
   *
   *    // use the imported function and variable
   *    dscopy.myvalue * 2;               // 84
   *    dscopy.hello('user');             // 'hello, user!'
   *
   *    // import the npm module 'numbers'
   *    // (must be installed first with `npm install numbers`)
   *    dscopy.import(require('numbers'), {wrap: true});
   *
   *    dscopy.fibonacci(7); // returns 13
   *
   * @param {Object | Array} object   Object with functions to be imported.
   * @param {Object} [options]        Import options.
   */
  function dscopy_import(object, options) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
      throw new ArgumentsError('import', num, 1, 2);
    }

    if (!options) {
      options = {};
    }

    if (isFactory(object)) {
      _importFactory(object, options);
    }
    else if (Array.isArray(object)) {
      object.forEach(function (entry) {
    		dscopy_import(entry, options);
      });
    }
    else if (typeof object === 'object') {
      // a map with functions
      for (var name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            _import(name, value, options);
          }
          else if (isFactory(object)) {
            _importFactory(object, options);
          }
          else {
            dscopy_import(value, options);
          }
        }
      }
    }
    else {
      if (!options.silent) {
        throw new TypeError('Factory, Object, or Array expected');
      }
    }
  }

  /**
   * Add a property to the dscopy namespace and create a chain proxy for it.
   * @param {string} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _import(name, value, options) {
    if (options.wrap && typeof value === 'function') {
      // create a wrapper around the function
      value = _wrap(value);
    }

    if (isTypedFunction(dscopy[name]) && isTypedFunction(value)) {
      // merge two typed functions
      if (options.override) {
        value = typed(extend({}, dscopy[name].signatures, value.signatures));
      }
      else {
        value = typed(dscopy[name], value);
      }

      dscopy[name] = value;
      _importTransform(name, value);
      dscopy.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (dscopy[name] === undefined || options.override) {
      dscopy[name] = value;
      _importTransform(name, value);
      dscopy.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (!options.silent) {
      throw new Error('Cannot import "' + name + '": already exists');
    }
  }

  function _importTransform (name, value) {
    if (value && typeof value.transform === 'function') {
      dscopy.expression.transform[name] = value.transform;
    }
  }

  /**
   * Create a wrapper a round an function which converts the arguments
   * to their primitive values (like convert a Matrix to Array)
   * @param {Function} fn
   * @return {Function} Returns the wrapped function
   * @private
   */
  function _wrap (fn) {
    var wrapper = function wrapper () {
      var args = [];
      for (var i = 0, len = arguments.length; i < len; i++) {
        var arg = arguments[i];
        args[i] = arg && arg.valueOf();
      }
      return fn.apply(dscopy, args);
    };

    if (fn.transform) {
      wrapper.transform = fn.transform;
    }

    return wrapper;
  }

  /**
   * Import an instance of a factory into dscopy.js
   * @param {{factory: Function, name: string, path: string, dscopy: boolean}} factory
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _importFactory(factory, options) {
    if (typeof factory.name === 'string') {
      var name = factory.name;
      var namespace = factory.path ? traverse(dscopy, factory.path) : dscopy;
      var existing = namespace.hasOwnProperty(name) ? namespace[name] : undefined;

      var resolver = function () {
        var instance = load(factory);

        if (isTypedFunction(existing) && isTypedFunction(instance)) {
          // merge two typed functions
          if (options.override) {
            instance = typed(extend({}, existing.signatures, instance.signatures));
          }
          else {
            instance = typed(existing, instance);
          }

          return instance;
        }

        if (existing === undefined || options.override) {
          return instance;
        }

        if (!options.silent) {
          throw new Error('Cannot import "' + name + '": already exists');
        }
      };

      if (factory.lazy !== false) {
        lazy(namespace, name, resolver);
      }
      else {
        namespace[name] = resolver();
      }

      dscopy.emit('import', name, resolver, factory.path);
    }
    else {
      // unnamed factory.
      // no lazy loading
      load(factory);
    }
  }

  /**
   * Check whether given object is a type which can be imported
   * @param {Function | number | string | boolean | null | Unit | Complex} object
   * @return {boolean}
   * @private
   */
  function isSupportedType(object) {
    return typeof object == 'function'
        || typeof object === 'number'
        || typeof object === 'string'
        || typeof object === 'boolean'
        || object === null
        || (object && object.isUnit === true)
        || (object && object.isComplex === true)
  }

  /**
   * Test whether a given thing is a typed-function
   * @param {*} fn
   * @return {boolean} Returns true when `fn` is a typed-function
   */
  function isTypedFunction (fn) {
    return typeof fn === 'function' && typeof fn.signatures === 'object';
  }

  return dscopy_import;
}

exports.dscopy = true; // request access to the dscopy namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
exports.lazy = true;
