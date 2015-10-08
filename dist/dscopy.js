/**
 * dscopy.js
 * https://github.com/arayaprolu/dscopyjs
 *
 * dscopy.js is an Datasource copy library for JavaScript and Node.js. It features any datasource to any datasource copier. This take take any datasource as input and create insert/delete/update statements that can be run on any target datasource
 *
 * @version 1.0.0
 * @date    2015-10-08
 *
 * @license
 * Copyright (C) 2013-2015 Ashwin Rayaprolu <arayaprolu@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dscopy"] = factory();
	else
		root["dscopy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(1);

	/**
	 * dscopy.js factory function. Creates a new instance of dscopy.js
	 *
	 * @param {Object} [config] Available configuration options:
	 *                            {number} epsilon
	 *                              Minimum relative difference between two
	 *                              compared values, used by all comparison functions.
	 *                            {string} matrix
	 *                              A string 'matrix' (default) or 'array'.
	 *                            {string} number
	 *                              A string 'number' (default), 'bignumber', or
	 *                              'fraction'
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
	 */
	function create (config) {
	  // create a new dscopy.js instance
	  var dscopy = core.create(config);
	  dscopy.create = create;

	  // import data types, functions, constants, expression parser, etc.
	  dscopy.import(__webpack_require__(13));

	  return dscopy;
	}

	// return a new instance of dscopy.js
	module.exports = create();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var isFactory = __webpack_require__(3).isFactory;
	var deepExtend = __webpack_require__(3).deepExtend;
	var typedFactory = __webpack_require__(4);
	var emitter = __webpack_require__(8);

	var importFactory = __webpack_require__(10);
	var configFactory = __webpack_require__(12);

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Clone an object
	 *
	 *     clone(x)
	 *
	 * Can clone any primitive type, array, and object.
	 * If x has a function clone, this function will be invoked to clone the object.
	 *
	 * @param {*} x
	 * @return {*} clone
	 */
	exports.clone = function clone(x) {
	  var type = typeof x;

	  // immutable primitive types
	  if (type === 'number' || type === 'string' || type === 'boolean' ||
	      x === null || x === undefined) {
	    return x;
	  }

	  // use clone function of the object when available
	  if (typeof x.clone === 'function') {
	    return x.clone();
	  }

	  // array
	  if (Array.isArray(x)) {
	    return x.map(function (value) {
	      return clone(value);
	    });
	  }

	  if (x instanceof Number)    return new Number(x.valueOf());
	  if (x instanceof String)    return new String(x.valueOf());
	  if (x instanceof Boolean)   return new Boolean(x.valueOf());
	  if (x instanceof Date)      return new Date(x.valueOf());
	  if (x && x.isBigNumber === true) return x; // bignumbers are immutable
	  if (x instanceof RegExp)  throw new TypeError('Cannot clone ' + x);  // TODO: clone a RegExp

	  // object
	  var m = {};
	  for (var key in x) {
	    if (x.hasOwnProperty(key)) {
	      m[key] = clone(x[key]);
	    }
	  }
	  return m;
	};

	/**
	 * Extend object a with the properties of object b
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 */
	exports.extend = function(a, b) {
	  for (var prop in b) {
	    if (b.hasOwnProperty(prop)) {
	      a[prop] = b[prop];
	    }
	  }
	  return a;
	};

	/**
	 * Deep extend an object a with the properties of object b
	 * @param {Object} a
	 * @param {Object} b
	 * @returns {Object}
	 */
	exports.deepExtend = function deepExtend (a, b) {
	  // TODO: add support for Arrays to deepExtend
	  if (Array.isArray(b)) {
	    throw new TypeError('Arrays are not supported by deepExtend');
	  }

	  for (var prop in b) {
	    if (b.hasOwnProperty(prop)) {
	      if (b[prop] && b[prop].constructor === Object) {
	        if (a[prop] === undefined) {
	          a[prop] = {};
	        }
	        if (a[prop].constructor === Object) {
	          deepExtend(a[prop], b[prop]);
	        }
	        else {
	          a[prop] = b[prop];
	        }
	      } else if (Array.isArray(b[prop])) {
	        throw new TypeError('Arrays are not supported by deepExtend');
	      } else {
	        a[prop] = b[prop];
	      }
	    }
	  }
	  return a;
	};

	/**
	 * Deep test equality of all fields in two pairs of arrays or objects.
	 * @param {Array | Object} a
	 * @param {Array | Object} b
	 * @returns {boolean}
	 */
	exports.deepEqual = function deepEqual (a, b) {
	  var prop, i, len;
	  if (Array.isArray(a)) {
	    if (!Array.isArray(b)) {
	      return false;
	    }

	    if (a.length != b.length) {
	      return false;
	    }

	    for (i = 0, len = a.length; i < len; i++) {
	      if (!exports.deepEqual(a[i], b[i])) {
	        return false;
	      }
	    }
	    return true;
	  }
	  else if (a instanceof Object) {
	    if (Array.isArray(b) || !(b instanceof Object)) {
	      return false;
	    }

	    for (prop in a) {
	      //noinspection JSUnfilteredForInLoop
	      if (!exports.deepEqual(a[prop], b[prop])) {
	        return false;
	      }
	    }
	    for (prop in b) {
	      //noinspection JSUnfilteredForInLoop
	      if (!exports.deepEqual(a[prop], b[prop])) {
	        return false;
	      }
	    }
	    return true;
	  }
	  else {
	    return (typeof a === typeof b) && (a == b);
	  }
	};

	/**
	 * Test whether the current JavaScript engine supports Object.defineProperty
	 * @returns {boolean} returns true if supported
	 */
	exports.canDefineProperty = function () {
	  // test needed for broken IE8 implementation
	  try {
	    if (Object.defineProperty) {
	      Object.defineProperty({}, 'x', { get: function () {} });
	      return true;
	    }
	  } catch (e) {}

	  return false;
	};

	/**
	 * Attach a lazy loading property to a constant.
	 * The given function `fn` is called once when the property is first requested.
	 * On older browsers (<IE8), the function will fall back to direct evaluation
	 * of the properties value.
	 * @param {Object} object   Object where to add the property
	 * @param {string} prop     Property name
	 * @param {Function} fn     Function returning the property value. Called
	 *                          without arguments.
	 */
	exports.lazy = function (object, prop, fn) {
	  if (exports.canDefineProperty()) {
	    var _uninitialized = true;
	    var _value;
	    Object.defineProperty(object, prop, {
	      get: function () {
	        if (_uninitialized) {
	          _value = fn();
	          _uninitialized = false;
	        }
	        return _value;
	      },

	      set: function (value) {
	        _value = value;
	        _uninitialized = false;
	      },

	      configurable: true,
	      enumerable: true
	    });
	  }
	  else {
	    // fall back to immediate evaluation
	    object[prop] = fn();
	  }
	};

	/**
	 * Traverse a path into an object.
	 * When a namespace is missing, it will be created
	 * @param {Object} object
	 * @param {string} path   A dot separated string like 'name.space'
	 * @return {Object} Returns the object at the end of the path
	 */
	exports.traverse = function(object, path) {
	  var obj = object;

	  if (path) {
	    var names = path.split('.');
	    for (var i = 0; i < names.length; i++) {
	      var name = names[i];
	      if (!(name in obj)) {
	        obj[name] = {};
	      }
	      obj = obj[name];
	    }
	  }

	  return obj;
	};

	/**
	 * Test whether an object is a factory. a factory has fields:
	 *
	 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
	 * - name: string (optional)
	 * - path: string    A dot separated path (optional)
	 * - math: boolean   If true (false by default), the math namespace is passed
	 *                   as fifth argument of the factory function
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	exports.isFactory = function (object) {
	  return object && typeof object.factory === 'function';
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var typedFunction = __webpack_require__(5);
	var digits = __webpack_require__(6).digits;

	// returns a new instance of typed-function
	var createTyped = function () {
	  // initially, return the original instance of typed-function
	  // consecutively, return a new instance from typed.create.
	  createTyped = typedFunction.create;
	  return typedFunction;
	};

	/**
	 * Factory function for creating a new typed instance
	 * @param {Object} type   Object with data types like Complex and BigNumber
	 * @returns {Function}
	 */
	exports.create = function create(type) {
	  // TODO: typed-function must be able to silently ignore signatures with unknown data types

	  // get a new instance of typed-function
	  var typed = createTyped();

	  // define all types. The order of the types determines in which order function
	  // arguments are type-checked (so for performance it's important to put the
	  // most used types first).
	  typed.types = [
	    { name: 'number',               test: function (x) { return typeof x === 'number'; } },
	    { name: 'Complex',              test: function (x) { return x && x.isComplex; } },
	    { name: 'BigNumber',            test: function (x) { return x && x.isBigNumber; } },
	    { name: 'Fraction',             test: function (x) { return x && x.isFraction; } },
	    { name: 'Unit',                 test: function (x) { return x && x.isUnit; } },
	    { name: 'string',               test: function (x) { return typeof x === 'string'; } },
	    { name: 'Array',                test: Array.isArray },
	    { name: 'Matrix',               test: function (x) { return x && x.isMatrix; } },
	    { name: 'DenseMatrix',          test: function (x) { return x && x.isDenseMatrix; } },
	    { name: 'SparseMatrix',         test: function (x) { return x && x.isSparseMatrix; } },
	    { name: 'ImmutableDenseMatrix', test: function (x) { return x && x.isImmutableDenseMatrix; } },
	    { name: 'Range',                test: function (x) { return x && x.isRange; } },
	    { name: 'Index',                test: function (x) { return x && x.isIndex; } },
	    { name: 'boolean',              test: function (x) { return typeof x === 'boolean'; } },
	    { name: 'ResultSet',            test: function (x) { return x && x.isResultSet; } },
	    { name: 'Help',                 test: function (x) { return x && x.isHelp; } },
	    { name: 'function',             test: function (x) { return typeof x === 'function';} },
	    { name: 'Date',                 test: function (x) { return x instanceof Date; } },
	    { name: 'RegExp',               test: function (x) { return x instanceof RegExp; } },
	    { name: 'Object',               test: function (x) { return typeof x === 'object'; } },
	    { name: 'null',                 test: function (x) { return x === null; } },
	    { name: 'undefined',            test: function (x) { return x === undefined; } }
	  ];

	  // TODO: add conversion from BigNumber to number?
	  typed.conversions = [
	    {
	      from: 'number',
	      to: 'BigNumber',
	      convert: function (x) {
	        // note: conversion from number to BigNumber can fail if x has >15 digits
	        if (digits(x) > 15) {
	          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
	          '(value: ' + x + '). ' +
	          'Use function bignumber(x) to convert to BigNumber.');
	        }
	        return new type.BigNumber(x);
	      }
	    }, {
	      from: 'number',
	      to: 'Complex',
	      convert: function (x) {
	        return new type.Complex(x, 0);
	      }
	    }, {
	      from: 'number',
	      to: 'string',
	      convert: function (x) {
	        return x + '';
	      }
	    }, {
	      from: 'BigNumber',
	      to: 'Complex',
	      convert: function (x) {
	        return new type.Complex(x.toNumber(), 0);
	      }
	    }, {
	      from: 'number',
	      to: 'Fraction',
	      convert: function (x) {
	        if (digits(x) > 15) {
	          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to Fraction ' +
	              '(value: ' + x + '). ' +
	              'Use function fraction(x) to convert to Fraction.');
	        }
	        return new type.Fraction(x);
	      }
	    }, {
	      from: 'string',
	      to: 'number',
	      convert: function (x) {
	        var n = Number(x);
	        if (isNaN(n)) {
	          throw new Error('Cannot convert "' + x + '" to a number');
	        }
	        return n;
	      }
	    }, {
	      from: 'boolean',
	      to: 'number',
	      convert: function (x) {
	        return +x;
	      }
	    }, {
	      from: 'boolean',
	      to: 'BigNumber',
	      convert: function (x) {
	        return new type.BigNumber(+x);
	      }
	    }, {
	      from: 'boolean',
	      to: 'string',
	      convert: function (x) {
	        return +x;
	      }
	    }, {
	      from: 'null',
	      to: 'number',
	      convert: function () {
	        return 0;
	      }
	    }, {
	      from: 'null',
	      to: 'string',
	      convert: function () {
	        return 'null';
	      }
	    }, {
	      from: 'null',
	      to: 'BigNumber',
	      convert: function () {
	        return new type.BigNumber(0);
	      }
	    }, {
	      from: 'Array',
	      to: 'Matrix',
	      convert: function (array) {
	        // TODO: how to decide on the right type of matrix to create?
	        return new type.DenseMatrix(array);
	      }
	    }, {
	      from: 'Matrix',
	      to: 'Array',
	      convert: function (matrix) {
	        return matrix.valueOf();
	      }
	    }
	  ];

	  return typed;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * typed-function
	 *
	 * Type checking for JavaScript functions
	 *
	 * https://github.com/josdejong/typed-function
	 */
	'use strict';

	(function (factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // OldNode. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like OldNode.
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    window.typed = factory();
	  }
	}(function () {
	  // factory function to create a new instance of typed-function
	  // TODO: allow passing configuration, types, tests via the factory function
	  function create() {
	    /**
	     * Get a type test function for a specific data type
	     * @param {string} name                   Name of a data type like 'number' or 'string'
	     * @returns {Function(obj: *) : boolean}  Returns a type testing function.
	     *                                        Throws an error for an unknown type.
	     */
	    function getTypeTest(name) {
	      var test;
	      for (var i = 0; i < typed.types.length; i++) {
	        var entry = typed.types[i];
	        if (entry.name === name) {
	          test = entry.test;
	          break;
	        }
	      }

	      if (!test) {
	        var hint;
	        for (i = 0; i < typed.types.length; i++) {
	          entry = typed.types[i];
	          if (entry.name.toLowerCase() == name.toLowerCase()) {
	            hint = entry.name;
	            break;
	          }
	        }

	        throw new Error('Unknown type "' + name + '"' +
	            (hint ? ('. Did you mean "' + hint + '"?') : ''));
	      }
	      return test;
	    }

	    /**
	     * Retrieve the function name from a set of functions, and check
	     * whether the name of all functions match (if given)
	     * @param {Array.<function>} fns
	     */
	    function getName (fns) {
	      var name = '';

	      for (var i = 0; i < fns.length; i++) {
	        var fn = fns[i];

	        // merge function name
	        if (fn.name != '') {
	          if (name == '') {
	            name = fn.name;
	          }
	          else if (name != fn.name) {
	            var err = new Error('Function names do not match (expected: ' + name + ', actual: ' + fn.name + ')');
	            err.data = {
	              actual: fn.name,
	              expected: name
	            };
	            throw err;
	          }
	        }
	      }

	      return name;
	    }

	    /**
	     * Create an ArgumentsError. Creates messages like:
	     *
	     *   Unexpected type of argument (expected: ..., actual: ..., index: ...)
	     *   Too few arguments (expected: ..., index: ...)
	     *   Too many arguments (expected: ..., actual: ...)
	     *
	     * @param {String} fn         Function name
	     * @param {number} argCount   Number of arguments
	     * @param {Number} index      Current argument index
	     * @param {*} actual          Current argument
	     * @param {string} [expected] An optional, comma separated string with
	     *                            expected types on given index
	     * @extends Error
	     */
	    function createError(fn, argCount, index, actual, expected) {
	      var actualType = getTypeOf(actual);
	      var _expected = expected ? expected.split(',') : null;
	      var _fn = (fn || 'unnamed');
	      var anyType = _expected && contains(_expected, 'any');
	      var message;
	      var data = {
	        fn: fn,
	        index: index,
	        actual: actual,
	        expected: _expected
	      };

	      if (_expected) {
	        if (argCount > index && !anyType) {
	          // unexpected type
	          message = 'Unexpected type of argument in function ' + _fn +
	              ' (expected: ' + _expected.join(' or ') + ', actual: ' + actualType + ', index: ' + index + ')';
	        }
	        else {
	          // too few arguments
	          message = 'Too few arguments in function ' + _fn +
	              ' (expected: ' + _expected.join(' or ') + ', index: ' + index + ')';
	        }
	      }
	      else {
	        // too many arguments
	        message = 'Too many arguments in function ' + _fn +
	            ' (expected: ' + index + ', actual: ' + argCount + ')'
	      }

	      var err = new TypeError(message);
	      err.data = data;
	      return err;
	    }

	    /**
	     * Collection with function references (local shortcuts to functions)
	     * @constructor
	     * @param {string} [name='refs']  Optional name for the refs, used to generate
	     *                                JavaScript code
	     */
	    function Refs(name) {
	      this.name = name || 'refs';
	      this.categories = {};
	    }

	    /**
	     * Add a function reference.
	     * @param {Function} fn
	     * @param {string} [category='fn']    A function category, like 'fn' or 'signature'
	     * @returns {string} Returns the function name, for example 'fn0' or 'signature2'
	     */
	    Refs.prototype.add = function (fn, category) {
	      var cat = category || 'fn';
	      if (!this.categories[cat]) this.categories[cat] = [];

	      var index = this.categories[cat].indexOf(fn);
	      if (index == -1) {
	        index = this.categories[cat].length;
	        this.categories[cat].push(fn);
	      }

	      return cat + index;
	    };

	    /**
	     * Create code lines for all function references
	     * @returns {string} Returns the code containing all function references
	     */
	    Refs.prototype.toCode = function () {
	      var code = [];
	      var path = this.name + '.categories';
	      var categories = this.categories;

	      for (var cat in categories) {
	        if (categories.hasOwnProperty(cat)) {
	          var category = categories[cat];

	          for (var i = 0; i < category.length; i++) {
	            code.push('var ' + cat + i + ' = ' + path + '[\'' + cat + '\'][' + i + '];');
	          }
	        }
	      }

	      return code.join('\n');
	    };

	    /**
	     * A function parameter
	     * @param {string | string[] | Param} types    A parameter type like 'string',
	     *                                             'number | boolean'
	     * @param {boolean} [varArgs=false]            Variable arguments if true
	     * @constructor
	     */
	    function Param(types, varArgs) {
	      // parse the types, can be a string with types separated by pipe characters |
	      if (typeof types === 'string') {
	        // parse variable arguments operator (ellipses '...number')
	        var _types = types.trim();
	        var _varArgs = _types.substr(0, 3) === '...';
	        if (_varArgs) {
	          _types = _types.substr(3);
	        }
	        if (_types === '') {
	          this.types = ['any'];
	        }
	        else {
	          this.types = _types.split('|');
	          for (var i = 0; i < this.types.length; i++) {
	            this.types[i] = this.types[i].trim();
	          }
	        }
	      }
	      else if (Array.isArray(types)) {
	        this.types = types;
	      }
	      else if (types instanceof Param) {
	        return types.clone();
	      }
	      else {
	        throw new Error('String or Array expected');
	      }

	      // can hold a type to which to convert when handling this parameter
	      this.conversions = [];
	      // TODO: implement better API for conversions, be able to add conversions via constructor (support a new type Object?)

	      // variable arguments
	      this.varArgs = _varArgs || varArgs || false;

	      // check for any type arguments
	      this.anyType = this.types.indexOf('any') !== -1;
	    }

	    /**
	     * Order Params
	     * any type ('any') will be ordered last, and object as second last (as other
	     * types may be an object as well, like Array).
	     *
	     * @param {Param} a
	     * @param {Param} b
	     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
	     */
	    Param.compare = function (a, b) {
	      // TODO: simplify parameter comparison, it's a mess
	      if (a.anyType) return 1;
	      if (b.anyType) return -1;

	      if (contains(a.types, 'Object')) return 1;
	      if (contains(b.types, 'Object')) return -1;

	      if (a.hasConversions()) {
	        if (b.hasConversions()) {
	          var i, ac, bc;

	          for (i = 0; i < a.conversions.length; i++) {
	            if (a.conversions[i] !== undefined) {
	              ac = a.conversions[i];
	              break;
	            }
	          }

	          for (i = 0; i < b.conversions.length; i++) {
	            if (b.conversions[i] !== undefined) {
	              bc = b.conversions[i];
	              break;
	            }
	          }

	          return typed.conversions.indexOf(ac) - typed.conversions.indexOf(bc);
	        }
	        else {
	          return 1;
	        }
	      }
	      else {
	        if (b.hasConversions()) {
	          return -1;
	        }
	        else {
	          // both params have no conversions
	          var ai, bi;

	          for (i = 0; i < typed.types.length; i++) {
	            if (typed.types[i].name === a.types[0]) {
	              ai = i;
	              break;
	            }
	          }

	          for (i = 0; i < typed.types.length; i++) {
	            if (typed.types[i].name === b.types[0]) {
	              bi = i;
	              break;
	            }
	          }

	          return ai - bi;
	        }
	      }
	    };

	    /**
	     * Test whether this parameters types overlap an other parameters types.
	     * @param {Param} other
	     * @return {boolean} Returns true when there are conflicting types
	     */
	    Param.prototype.overlapping = function (other) {
	      for (var i = 0; i < this.types.length; i++) {
	        if (contains(other.types, this.types[i])) {
	          return true;
	        }
	      }
	      return false;
	    };

	    /**
	     * Create a clone of this param
	     * @returns {Param} Returns a cloned version of this param
	     */
	    Param.prototype.clone = function () {
	      var param = new Param(this.types.slice(), this.varArgs);
	      param.conversions = this.conversions.slice();
	      return param;
	    };

	    /**
	     * Test whether this parameter contains conversions
	     * @returns {boolean} Returns true if the parameter contains one or
	     *                    multiple conversions.
	     */
	    Param.prototype.hasConversions = function () {
	      return this.conversions.length > 0;
	    };

	    /**
	     * Tests whether this parameters contains any of the provided types
	     * @param {Object} types  A Map with types, like {'number': true}
	     * @returns {boolean}     Returns true when the parameter contains any
	     *                        of the provided types
	     */
	    Param.prototype.contains = function (types) {
	      for (var i = 0; i < this.types.length; i++) {
	        if (types[this.types[i]]) {
	          return true;
	        }
	      }
	      return false;
	    };

	    /**
	     * Return a string representation of this params types, like 'string' or
	     * 'number | boolean' or '...number'
	     * @param {boolean} [toConversion]   If true, the returned types string
	     *                                   contains the types where the parameter
	     *                                   will convert to. If false (default)
	     *                                   the "from" types are returned
	     * @returns {string}
	     */
	    Param.prototype.toString = function (toConversion) {
	      var types = [];
	      var keys = {};

	      for (var i = 0; i < this.types.length; i++) {
	        var conversion = this.conversions[i];
	        var type = toConversion && conversion ? conversion.to : this.types[i];
	        if (!(type in keys)) {
	          keys[type] = true;
	          types.push(type);
	        }
	      }

	      return (this.varArgs ? '...' : '') + types.join('|');
	    };

	    /**
	     * A function signature
	     * @param {string | string[] | Param[]} params
	     *                         Array with the type(s) of each parameter,
	     *                         or a comma separated string with types
	     * @param {Function} fn    The actual function
	     * @constructor
	     */
	    function Signature(params, fn) {
	      var _params;
	      if (typeof params === 'string') {
	        _params = (params !== '') ? params.split(',') : [];
	      }
	      else if (Array.isArray(params)) {
	        _params = params;
	      }
	      else {
	        throw new Error('string or Array expected');
	      }

	      this.params = new Array(_params.length);
	      for (var i = 0; i < _params.length; i++) {
	        var param = new Param(_params[i]);
	        this.params[i] = param;
	        if (i === _params.length - 1) {
	          // the last argument
	          this.varArgs = param.varArgs;
	        }
	        else {
	          // non-last argument
	          if (param.varArgs) {
	            throw new SyntaxError('Unexpected variable arguments operator "..."');
	          }
	        }
	      }

	      this.fn = fn;
	    }

	    /**
	     * Create a clone of this signature
	     * @returns {Signature} Returns a cloned version of this signature
	     */
	    Signature.prototype.clone = function () {
	      return new Signature(this.params.slice(), this.fn);
	    };

	    /**
	     * Expand a signature: split params with union types in separate signatures
	     * For example split a Signature "string | number" into two signatures.
	     * @return {Signature[]} Returns an array with signatures (at least one)
	     */
	    Signature.prototype.expand = function () {
	      var signatures = [];

	      function recurse(signature, path) {
	        if (path.length < signature.params.length) {
	          var i, newParam, conversion;

	          var param = signature.params[path.length];
	          if (param.varArgs) {
	            // a variable argument. do not split the types in the parameter
	            newParam = param.clone();

	            // add conversions to the parameter
	            // recurse for all conversions
	            for (i = 0; i < typed.conversions.length; i++) {
	              conversion = typed.conversions[i];
	              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
	                var j = newParam.types.length;
	                newParam.types[j] = conversion.from;
	                newParam.conversions[j] = conversion;
	              }
	            }

	            recurse(signature, path.concat(newParam));
	          }
	          else {
	            // split each type in the parameter
	            for (i = 0; i < param.types.length; i++) {
	              recurse(signature, path.concat(new Param(param.types[i])));
	            }

	            // recurse for all conversions
	            for (i = 0; i < typed.conversions.length; i++) {
	              conversion = typed.conversions[i];
	              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
	                newParam = new Param(conversion.from);
	                newParam.conversions[0] = conversion;
	                recurse(signature, path.concat(newParam));
	              }
	            }
	          }
	        }
	        else {
	          signatures.push(new Signature(path, signature.fn));
	        }
	      }

	      recurse(this, []);

	      return signatures;
	    };

	    /**
	     * Compare two signatures.
	     *
	     * When two params are equal and contain conversions, they will be sorted
	     * by lowest index of the first conversions.
	     *
	     * @param {Signature} a
	     * @param {Signature} b
	     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
	     */
	    Signature.compare = function (a, b) {
	      if (a.params.length > b.params.length) return 1;
	      if (a.params.length < b.params.length) return -1;

	      // count the number of conversions
	      var i;
	      var len = a.params.length; // a and b have equal amount of params
	      var ac = 0;
	      var bc = 0;
	      for (i = 0; i < len; i++) {
	        if (a.params[i].hasConversions()) ac++;
	        if (b.params[i].hasConversions()) bc++;
	      }

	      if (ac > bc) return 1;
	      if (ac < bc) return -1;

	      // compare the order per parameter
	      for (i = 0; i < a.params.length; i++) {
	        var cmp = Param.compare(a.params[i], b.params[i]);
	        if (cmp !== 0) {
	          return cmp;
	        }
	      }

	      return 0;
	    };

	    /**
	     * Test whether any of the signatures parameters has conversions
	     * @return {boolean} Returns true when any of the parameters contains
	     *                   conversions.
	     */
	    Signature.prototype.hasConversions = function () {
	      for (var i = 0; i < this.params.length; i++) {
	        if (this.params[i].hasConversions()) {
	          return true;
	        }
	      }
	      return false;
	    };

	    /**
	     * Test whether this signature should be ignored.
	     * Checks whether any of the parameters contains a type listed in
	     * typed.ignore
	     * @return {boolean} Returns true when the signature should be ignored
	     */
	    Signature.prototype.ignore = function () {
	      // create a map with ignored types
	      var types = {};
	      for (var i = 0; i < typed.ignore.length; i++) {
	        types[typed.ignore[i]] = true;
	      }

	      // test whether any of the parameters contains this type
	      for (i = 0; i < this.params.length; i++) {
	        if (this.params[i].contains(types)) {
	          return true;
	        }
	      }

	      return false;
	    };

	    /**
	     * Generate the code to invoke this signature
	     * @param {Refs} refs
	     * @param {string} prefix
	     * @returns {string} Returns code
	     */
	    Signature.prototype.toCode = function (refs, prefix) {
	      var code = [];

	      var args = new Array(this.params.length);
	      for (var i = 0; i < this.params.length; i++) {
	        var param = this.params[i];
	        var conversion = param.conversions[0];
	        if (param.varArgs) {
	          args[i] = 'varArgs';
	        }
	        else if (conversion) {
	          args[i] = refs.add(conversion.convert, 'convert') + '(arg' + i + ')';
	        }
	        else {
	          args[i] = 'arg' + i;
	        }
	      }

	      var ref = this.fn ? refs.add(this.fn, 'signature') : undefined;
	      if (ref) {
	        return prefix + 'return ' + ref + '(' + args.join(', ') + '); // signature: ' + this.params.join(', ');
	      }

	      return code.join('\n');
	    };

	    /**
	     * Return a string representation of the signature
	     * @returns {string}
	     */
	    Signature.prototype.toString = function () {
	      return this.params.join(', ');
	    };

	    /**
	     * A group of signatures with the same parameter on given index
	     * @param {Param[]} path
	     * @param {Signature} [signature]
	     * @param {Node[]} childs
	     * @constructor
	     */
	    function Node(path, signature, childs) {
	      this.path = path || [];
	      this.param = path[path.length - 1] || null;
	      this.signature = signature || null;
	      this.childs = childs || [];
	    }

	    /**
	     * Generate code for this group of signatures
	     * @param {Refs} refs
	     * @param {string} prefix
	     * @param {Node | undefined} [anyType]  Sibling of this node with any type parameter
	     * @returns {string} Returns the code as string
	     */
	    Node.prototype.toCode = function (refs, prefix, anyType) {
	      // TODO: split this function in multiple functions, it's too large
	      var code = [];

	      if (this.param) {
	        var index = this.path.length - 1;
	        var conversion = this.param.conversions[0];
	        var comment = '// type: ' + (conversion ?
	                (conversion.from + ' (convert to ' + conversion.to + ')') :
	                this.param);

	        // non-root node (path is non-empty)
	        if (this.param.varArgs) {
	          if (this.param.anyType) {
	            // variable arguments with any type
	            code.push(prefix + 'if (arguments.length > ' + index + ') {');
	            code.push(prefix + '  var varArgs = [];');
	            code.push(prefix + '  for (var i = ' + index + '; i < arguments.length; i++) {');
	            code.push(prefix + '    varArgs.push(arguments[i]);');
	            code.push(prefix + '  }');
	            code.push(this.signature.toCode(refs, prefix + '  '));
	            code.push(prefix + '}');
	          }
	          else {
	            // variable arguments with a fixed type
	            var getTests = function (types, arg) {
	              var tests = [];
	              for (var i = 0; i < types.length; i++) {
	                tests[i] = refs.add(getTypeTest(types[i]), 'test') + '(' + arg + ')';
	              }
	              return tests.join(' || ');
	            }.bind(this);

	            var allTypes = this.param.types;
	            var exactTypes = [];
	            for (var i = 0; i < allTypes.length; i++) {
	              if (this.param.conversions[i] === undefined) {
	                exactTypes.push(allTypes[i]);
	              }
	            }

	            code.push(prefix + 'if (' + getTests(allTypes, 'arg' + index) + ') { ' + comment);
	            code.push(prefix + '  var varArgs = [arg' + index + '];');
	            code.push(prefix + '  for (var i = ' + (index + 1) + '; i < arguments.length; i++) {');
	            code.push(prefix + '    if (' + getTests(exactTypes, 'arguments[i]') + ') {');
	            code.push(prefix + '      varArgs.push(arguments[i]);');

	            for (var i = 0; i < allTypes.length; i++) {
	              var conversion_i = this.param.conversions[i];
	              if (conversion_i) {
	                var test = refs.add(getTypeTest(allTypes[i]), 'test');
	                var convert = refs.add(conversion_i.convert, 'convert');
	                code.push(prefix + '    }');
	                code.push(prefix + '    else if (' + test + '(arguments[i])) {');
	                code.push(prefix + '      varArgs.push(' + convert + '(arguments[i]));');
	              }
	            }
	            code.push(prefix + '    } else {');
	            code.push(prefix + '      throw createError(name, arguments.length, i, arguments[i], \'' + exactTypes.join(',') + '\');');
	            code.push(prefix + '    }');
	            code.push(prefix + '  }');
	            code.push(this.signature.toCode(refs, prefix + '  '));
	            code.push(prefix + '}');
	          }
	        }
	        else {
	          if (this.param.anyType) {
	            // any type
	            code.push(prefix + '// type: any');
	            code.push(this._innerCode(refs, prefix, anyType));
	          }
	          else {
	            // regular type
	            var type = this.param.types[0];
	            var test = type !== 'any' ? refs.add(getTypeTest(type), 'test') : null;

	            code.push(prefix + 'if (' + test + '(arg' + index + ')) { ' + comment);
	            code.push(this._innerCode(refs, prefix + '  ', anyType));
	            code.push(prefix + '}');
	          }
	        }
	      }
	      else {
	        // root node (path is empty)
	        code.push(this._innerCode(refs, prefix, anyType));
	      }

	      return code.join('\n');
	    };

	    /**
	     * Generate inner code for this group of signatures.
	     * This is a helper function of Node.prototype.toCode
	     * @param {Refs} refs
	     * @param {string} prefix
	     * @param {Node | undefined} [anyType]  Sibling of this node with any type parameter
	     * @returns {string} Returns the inner code as string
	     * @private
	     */
	    Node.prototype._innerCode = function (refs, prefix, anyType) {
	      var code = [];
	      var i;

	      if (this.signature) {
	        code.push(prefix + 'if (arguments.length === ' + this.path.length + ') {');
	        code.push(this.signature.toCode(refs, prefix + '  '));
	        code.push(prefix + '}');
	      }

	      var nextAnyType;
	      for (i = 0; i < this.childs.length; i++) {
	        if (this.childs[i].param.anyType) {
	          nextAnyType = this.childs[i];
	          break;
	        }
	      }

	      for (i = 0; i < this.childs.length; i++) {
	        code.push(this.childs[i].toCode(refs, prefix, nextAnyType));
	      }

	      if (anyType && !this.param.anyType) {
	        code.push(anyType.toCode(refs, prefix, nextAnyType));
	      }

	      var exceptions = this._exceptions(refs, prefix);
	      if (exceptions) {
	        code.push(exceptions);
	      }

	      return code.join('\n');
	    };

	    /**
	     * Generate code to throw exceptions
	     * @param {Refs} refs
	     * @param {string} prefix
	     * @returns {string} Returns the inner code as string
	     * @private
	     */
	    Node.prototype._exceptions = function (refs, prefix) {
	      var index = this.path.length;

	      if (this.childs.length === 0) {
	        // TODO: can this condition be simplified? (we have a fall-through here)
	        return [
	          prefix + 'if (arguments.length > ' + index + ') {',
	          prefix + '  throw createError(name, arguments.length, ' + index + ', arguments[' + index + ']);',
	          prefix + '}'
	        ].join('\n');
	      }
	      else {
	        var keys = {};
	        var types = [];

	        for (var i = 0; i < this.childs.length; i++) {
	          var node = this.childs[i];
	          if (node.param) {
	            for (var j = 0; j < node.param.types.length; j++) {
	              var type = node.param.types[j];
	              if (!(type in keys) && !node.param.conversions[j]) {
	                keys[type] = true;
	                types.push(type);
	              }
	            }
	          }
	        }

	        return prefix + 'throw createError(name, arguments.length, ' + index + ', arguments[' + index + '], \'' + types.join(',') + '\');';
	      }
	    };

	    /**
	     * Split all raw signatures into an array with expanded Signatures
	     * @param {Object.<string, Function>} rawSignatures
	     * @return {Signature[]} Returns an array with expanded signatures
	     */
	    function parseSignatures(rawSignatures) {
	      // FIXME: need to have deterministic ordering of signatures, do not create via object
	      var signature;
	      var keys = {};
	      var signatures = [];
	      var i;

	      for (var types in rawSignatures) {
	        if (rawSignatures.hasOwnProperty(types)) {
	          var fn = rawSignatures[types];
	          signature = new Signature(types, fn);

	          if (signature.ignore()) {
	            continue;
	          }

	          var expanded = signature.expand();

	          for (i = 0; i < expanded.length; i++) {
	            var signature_i = expanded[i];
	            var key = signature_i.toString();
	            var existing = keys[key];
	            if (!existing) {
	              keys[key] = signature_i;
	            }
	            else {
	              var cmp = Signature.compare(signature_i, existing);
	              if (cmp < 0) {
	                // override if sorted first
	                keys[key] = signature_i;
	              }
	              else if (cmp === 0) {
	                throw new Error('Signature "' + key + '" is defined twice');
	              }
	              // else: just ignore
	            }
	          }
	        }
	      }

	      // convert from map to array
	      for (key in keys) {
	        if (keys.hasOwnProperty(key)) {
	          signatures.push(keys[key]);
	        }
	      }

	      // order the signatures
	      signatures.sort(function (a, b) {
	        return Signature.compare(a, b);
	      });

	      // filter redundant conversions from signatures with varArgs
	      // TODO: simplify this loop or move it to a separate function
	      for (i = 0; i < signatures.length; i++) {
	        signature = signatures[i];

	        if (signature.varArgs) {
	          var index = signature.params.length - 1;
	          var param = signature.params[index];

	          var t = 0;
	          while (t < param.types.length) {
	            if (param.conversions[t]) {
	              var type = param.types[t];

	              for (var j = 0; j < signatures.length; j++) {
	                var other = signatures[j];
	                var p = other.params[index];

	                if (other !== signature &&
	                    p &&
	                    contains(p.types, type) && !p.conversions[index]) {
	                  // this (conversion) type already exists, remove it
	                  param.types.splice(t, 1);
	                  param.conversions.splice(t, 1);
	                  t--;
	                  break;
	                }
	              }
	            }
	            t++;
	          }
	        }
	      }

	      return signatures;
	    }

	    /**
	     * create a map with normalized signatures as key and the function as value
	     * @param {Signature[]} signatures   An array with split signatures
	     * @return {Object.<string, Function>} Returns a map with normalized
	     *                                     signatures as key, and the function
	     *                                     as value.
	     */
	    function mapSignatures(signatures) {
	      var normalized = {};

	      for (var i = 0; i < signatures.length; i++) {
	        var signature = signatures[i];
	        if (signature.fn && !signature.hasConversions()) {
	          var params = signature.params.join(',');
	          normalized[params] = signature.fn;
	        }
	      }

	      return normalized;
	    }

	    /**
	     * Parse signatures recursively in a node tree.
	     * @param {Signature[]} signatures  Array with expanded signatures
	     * @param {Param[]} path            Traversed path of parameter types
	     * @return {Node}                   Returns a node tree
	     */
	    function parseTree(signatures, path) {
	      var i, signature;
	      var index = path.length;
	      var nodeSignature;

	      var filtered = [];
	      for (i = 0; i < signatures.length; i++) {
	        signature = signatures[i];

	        // filter the first signature with the correct number of params
	        if (signature.params.length === index && !nodeSignature) {
	          nodeSignature = signature;
	        }

	        if (signature.params[index] != undefined) {
	          filtered.push(signature);
	        }
	      }

	      // sort the filtered signatures by param
	      filtered.sort(function (a, b) {
	        return Param.compare(a.params[index], b.params[index]);
	      });

	      // recurse over the signatures
	      var entries = [];
	      for (i = 0; i < filtered.length; i++) {
	        signature = filtered[i];
	        // group signatures with the same param at current index
	        var param = signature.params[index];

	        // TODO: replace the next filter loop
	        var existing = entries.filter(function (entry) {
	          return entry.param.overlapping(param);
	        })[0];

	        //var existing;
	        //for (var j = 0; j < entries.length; j++) {
	        //  if (entries[j].param.overlapping(param)) {
	        //    existing = entries[j];
	        //    break;
	        //  }
	        //}

	        if (existing) {
	          if (existing.param.varArgs) {
	            throw new Error('Conflicting types "' + existing.param + '" and "' + param + '"');
	          }
	          existing.signatures.push(signature);
	        }
	        else {
	          entries.push({
	            param: param,
	            signatures: [signature]
	          });
	        }
	      }

	      // parse the childs
	      var childs = new Array(entries.length);
	      for (i = 0; i < entries.length; i++) {
	        var entry = entries[i];
	        childs[i] = parseTree(entry.signatures, path.concat(entry.param))
	      }

	      return new Node(path, nodeSignature, childs);
	    }

	    /**
	     * Generate an array like ['arg0', 'arg1', 'arg2']
	     * @param {number} count Number of arguments to generate
	     * @returns {Array} Returns an array with argument names
	     */
	    function getArgs(count) {
	      // create an array with all argument names
	      var args = [];
	      for (var i = 0; i < count; i++) {
	        args[i] = 'arg' + i;
	      }

	      return args;
	    }

	    /**
	     * Compose a function from sub-functions each handling a single type signature.
	     * Signatures:
	     *   typed(signature: string, fn: function)
	     *   typed(name: string, signature: string, fn: function)
	     *   typed(signatures: Object.<string, function>)
	     *   typed(name: string, signatures: Object.<string, function>)
	     *
	     * @param {string | null} name
	     * @param {Object.<string, Function>} signatures
	     * @return {Function} Returns the typed function
	     * @private
	     */
	    function _typed(name, signatures) {
	      var refs = new Refs();

	      // parse signatures, expand them
	      var _signatures = parseSignatures(signatures);
	      if (_signatures.length == 0) {
	        throw new Error('No signatures provided');
	      }

	      // parse signatures into a node tree
	      var node = parseTree(_signatures, []);

	      //var util = require('util');
	      //console.log('ROOT');
	      //console.log(util.inspect(node, { depth: null }));

	      // generate code for the typed function
	      var code = [];
	      var _name = name || '';
	      var _args = getArgs(maxParams(_signatures));
	      code.push('function ' + _name + '(' + _args.join(', ') + ') {');
	      code.push('  "use strict";');
	      code.push('  var name = \'' + _name + '\';');
	      code.push(node.toCode(refs, '  '));
	      code.push('}');

	      // generate body for the factory function
	      var body = [
	        refs.toCode(),
	        'return ' + code.join('\n')
	      ].join('\n');

	      // evaluate the JavaScript code and attach function references
	      var factory = (new Function(refs.name, 'createError', body));
	      var fn = factory(refs, createError);

	      //console.log('FN\n' + fn.toString()); // TODO: cleanup

	      // attach the signatures with sub-functions to the constructed function
	      fn.signatures = mapSignatures(_signatures);

	      return fn;
	    }

	    /**
	     * Calculate the maximum number of parameters in givens signatures
	     * @param {Signature[]} signatures
	     * @returns {number} The maximum number of parameters
	     */
	    function maxParams(signatures) {
	      var max = 0;

	      for (var i = 0; i < signatures.length; i++) {
	        var len = signatures[i].params.length;
	        if (len > max) {
	          max = len;
	        }
	      }

	      return max;
	    }

	    /**
	     * Get the type of a value
	     * @param {*} x
	     * @returns {string} Returns a string with the type of value
	     */
	    function getTypeOf(x) {
	      var obj;

	      for (var i = 0; i < typed.types.length; i++) {
	        var entry = typed.types[i];

	        if (entry.name === 'Object') {
	          // Array and Date are also Object, so test for Object afterwards
	          obj = entry;
	        }
	        else {
	          if (entry.test(x)) return entry.name;
	        }
	      }

	      // at last, test whether an object
	      if (obj && obj.test(x)) return obj.name;

	      return 'unknown';
	    }

	    /**
	     * Test whether an array contains some entry
	     * @param {Array} array
	     * @param {*} entry
	     * @return {boolean} Returns true if array contains entry, false if not.
	     */
	    function contains(array, entry) {
	      return array.indexOf(entry) !== -1;
	    }

	    // data type tests
	    var types = [
	      { name: 'number',    test: function (x) { return typeof x === 'number' } },
	      { name: 'string',    test: function (x) { return typeof x === 'string' } },
	      { name: 'boolean',   test: function (x) { return typeof x === 'boolean' } },
	      { name: 'Function',  test: function (x) { return typeof x === 'function'} },
	      { name: 'Array',     test: Array.isArray },
	      { name: 'Date',      test: function (x) { return x instanceof Date } },
	      { name: 'RegExp',    test: function (x) { return x instanceof RegExp } },
	      { name: 'Object',    test: function (x) { return typeof x === 'object' } },
	      { name: 'null',      test: function (x) { return x === null } },
	      { name: 'undefined', test: function (x) { return x === undefined } }
	    ];

	    // configuration
	    var config = {};

	    // type conversions. Order is important
	    var conversions = [];

	    // types to be ignored
	    var ignore = [];

	    // temporary object for holding types and conversions, for constructing
	    // the `typed` function itself
	    // TODO: find a more elegant solution for this
	    var typed = {
	      config: config,
	      types: types,
	      conversions: conversions,
	      ignore: ignore
	    };

	    /**
	     * Construct the typed function itself with various signatures
	     *
	     * Signatures:
	     *
	     *   typed(signatures: Object.<string, function>)
	     *   typed(name: string, signatures: Object.<string, function>)
	     */
	    typed = _typed('typed', {
	      'Object': function (signatures) {
	        var fns = [];
	        for (var signature in signatures) {
	          if (signatures.hasOwnProperty(signature)) {
	            fns.push(signatures[signature]);
	          }
	        }
	        var name = getName(fns);

	        return _typed(name, signatures);
	      },
	      'string, Object': _typed,
	      // TODO: add a signature 'Array.<function>'
	      '...Function': function (fns) {
	        var err;
	        var name = getName(fns);
	        var signatures = {};

	        for (var i = 0; i < fns.length; i++) {
	          var fn = fns[i];

	          // test whether this is a typed-function
	          if (!(typeof fn.signatures === 'object')) {
	            err = new TypeError('Function is no typed-function (index: ' + i + ')');
	            err.data = {index: i};
	            throw err;
	          }

	          // merge the signatures
	          for (var signature in fn.signatures) {
	            if (fn.signatures.hasOwnProperty(signature)) {
	              if (signatures.hasOwnProperty(signature)) {
	                if (fn.signatures[signature] !== signatures[signature]) {
	                  err = new Error('Signature "' + signature + '" is defined twice');
	                  err.data = {signature: signature};
	                  throw err;
	                }
	                // else: both signatures point to the same function, that's fine
	              }
	              else {
	                signatures[signature] = fn.signatures[signature];
	              }
	            }
	          }
	        }

	        return _typed(name, signatures);
	      }
	    });

	    /**
	     * Find a specific signature from a (composed) typed function, for
	     * example:
	     *
	     *   typed.find(fn, ['number', 'string'])
	     *   typed.find(fn, 'number, string')
	     *
	     * Function find only only works for exact matches.
	     *
	     * @param {Function} fn                   A typed-function
	     * @param {string | string[]} signature   Signature to be found, can be
	     *                                        an array or a comma separated string.
	     * @return {Function}                     Returns the matching signature, or
	     *                                        throws an errror when no signature
	     *                                        is found.
	     */
	    function find (fn, signature) {
	      if (!fn.signatures) {
	        throw new TypeError('Function is no typed-function');
	      }

	      // normalize input
	      var arr;
	      if (typeof signature === 'string') {
	        arr = signature.split(',');
	        for (var i = 0; i < arr.length; i++) {
	          arr[i] = arr[i].trim();
	        }
	      }
	      else if (Array.isArray(signature)) {
	        arr = signature;
	      }
	      else {
	        throw new TypeError('String array or a comma separated string expected');
	      }

	      var str = arr.join(',');

	      // find an exact match
	      var match = fn.signatures[str];
	      if (match) {
	        return match;
	      }

	      // TODO: extend find to match non-exact signatures

	      throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + arr.join(', ') + '))');
	    }

	    /**
	     * Convert a given value to another data type.
	     * @param {*} value
	     * @param {string} type
	     */
	    function convert (value, type) {
	      var from = getTypeOf(value);

	      // check conversion is needed
	      if (type === from) {
	        return value;
	      }

	      for (var i = 0; i < typed.conversions.length; i++) {
	        var conversion = typed.conversions[i];
	        if (conversion.from === from && conversion.to === type) {
	          return conversion.convert(value);
	        }
	      }

	      throw new Error('Cannot convert from ' + from + ' to ' + type);
	    }

	    // attach types and conversions to the final `typed` function
	    typed.config = config;
	    typed.types = types;
	    typed.conversions = conversions;
	    typed.ignore = ignore;
	    typed.create = create;
	    typed.find = find;
	    typed.convert = convert;

	    // add a type
	    typed.addType = function (type) {
	      if (!type || typeof type.name !== 'string' || typeof type.test !== 'function') {
	        throw new TypeError('Object with properties {name: string, test: function} expected');
	      }

	      typed.types.push(type);
	    };

	    // add a conversion
	    typed.addConversion = function (conversion) {
	      if (!conversion
	          || typeof conversion.from !== 'string'
	          || typeof conversion.to !== 'string'
	          || typeof conversion.convert !== 'function') {
	        throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
	      }

	      typed.conversions.push(conversion);
	    };

	    return typed;
	  }

	  return create();
	}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var NumberFormatter = __webpack_require__(7);

	/**
	 * Test whether value is a number
	 * @param {*} value
	 * @return {boolean} isNumber
	 */
	exports.isNumber = function(value) {
	  return typeof value === 'number';
	};

	/**
	 * Check if a number is integer
	 * @param {number | boolean} value
	 * @return {boolean} isInteger
	 */
	exports.isInteger = function(value) {
	  return isFinite(value)
	      ? (value == Math.round(value))
	      : false;
	  // Note: we use ==, not ===, as we can have Booleans as well
	};

	/**
	 * Calculate the sign of a number
	 * @param {number} x
	 * @returns {*}
	 */
	exports.sign = function(x) {
	  if (x > 0) {
	    return 1;
	  }
	  else if (x < 0) {
	    return -1;
	  }
	  else {
	    return 0;
	  }
	};

	/**
	 * Convert a number to a formatted string representation.
	 *
	 * Syntax:
	 *
	 *    format(value)
	 *    format(value, options)
	 *    format(value, precision)
	 *    format(value, fn)
	 *
	 * Where:
	 *
	 *    {number} value   The value to be formatted
	 *    {Object} options An object with formatting options. Available options:
	 *                     {string} notation
	 *                         Number notation. Choose from:
	 *                         'fixed'          Always use regular number notation.
	 *                                          For example '123.40' and '14000000'
	 *                         'exponential'    Always use exponential notation.
	 *                                          For example '1.234e+2' and '1.4e+7'
	 *                         'auto' (default) Regular number notation for numbers
	 *                                          having an absolute value between
	 *                                          `lower` and `upper` bounds, and uses
	 *                                          exponential notation elsewhere.
	 *                                          Lower bound is included, upper bound
	 *                                          is excluded.
	 *                                          For example '123.4' and '1.4e7'.
	 *                     {number} precision   A number between 0 and 16 to round
	 *                                          the digits of the number.
	 *                                          In case of notations 'exponential' and
	 *                                          'auto', `precision` defines the total
	 *                                          number of significant digits returned
	 *                                          and is undefined by default.
	 *                                          In case of notation 'fixed',
	 *                                          `precision` defines the number of
	 *                                          significant digits after the decimal
	 *                                          point, and is 0 by default.
	 *                     {Object} exponential An object containing two parameters,
	 *                                          {number} lower and {number} upper,
	 *                                          used by notation 'auto' to determine
	 *                                          when to return exponential notation.
	 *                                          Default values are `lower=1e-3` and
	 *                                          `upper=1e5`.
	 *                                          Only applicable for notation `auto`.
	 *    {Function} fn    A custom formatting function. Can be used to override the
	 *                     built-in notations. Function `fn` is called with `value` as
	 *                     parameter and must return a string. Is useful for example to
	 *                     format all values inside a matrix in a particular way.
	 *
	 * Examples:
	 *
	 *    format(6.4);                                        // '6.4'
	 *    format(1240000);                                    // '1.24e6'
	 *    format(1/3);                                        // '0.3333333333333333'
	 *    format(1/3, 3);                                     // '0.333'
	 *    format(21385, 2);                                   // '21000'
	 *    format(12.071, {notation: 'fixed'});                // '12'
	 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
	 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
	 *
	 * @param {number} value
	 * @param {Object | Function | number} [options]
	 * @return {string} str The formatted value
	 */
	exports.format = function(value, options) {
	  if (typeof options === 'function') {
	    // handle format(value, fn)
	    return options(value);
	  }

	  // handle special cases
	  if (value === Infinity) {
	    return 'Infinity';
	  }
	  else if (value === -Infinity) {
	    return '-Infinity';
	  }
	  else if (isNaN(value)) {
	    return 'NaN';
	  }

	  // default values for options
	  var notation = 'auto';
	  var precision = undefined;

	  if (options) {
	    // determine notation from options
	    if (options.notation) {
	      notation = options.notation;
	    }

	    // determine precision from options
	    if (exports.isNumber(options)) {
	      precision = options;
	    }
	    else if (options.precision) {
	      precision = options.precision;
	    }
	  }

	  // handle the various notations
	  switch (notation) {
	    case 'fixed':
	      return exports.toFixed(value, precision);

	    case 'exponential':
	      return exports.toExponential(value, precision);

	    case 'auto':
	      return exports
	          .toPrecision(value, precision, options && options.exponential)

	          // remove trailing zeros after the decimal point
	          .replace(/((\.\d*?)(0+))($|e)/, function () {
	            var digits = arguments[2];
	            var e = arguments[4];
	            return (digits !== '.') ? digits + e : e;
	          });

	    default:
	      throw new Error('Unknown notation "' + notation + '". ' +
	          'Choose "auto", "exponential", or "fixed".');
	  }
	};

	/**
	 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	 * @param {number} value
	 * @param {number} [precision]  Number of digits in formatted output.
	 *                              If not provided, the maximum available digits
	 *                              is used.
	 * @returns {string} str
	 */
	exports.toExponential = function(value, precision) {
	  return new NumberFormatter(value).toExponential(precision);
	};

	/**
	 * Format a number with fixed notation.
	 * @param {number} value
	 * @param {number} [precision=0]        Optional number of decimals after the
	 *                                      decimal point. Zero by default.
	 */
	exports.toFixed = function(value, precision) {
	  return new NumberFormatter(value).toFixed(precision);
	};

	/**
	 * Format a number with a certain precision
	 * @param {number} value
	 * @param {number} [precision=undefined] Optional number of digits.
	 * @param {{lower: number, upper: number}} [options]  By default:
	 *                                                    lower = 1e-3 (excl)
	 *                                                    upper = 1e+5 (incl)
	 * @return {string}
	 */
	exports.toPrecision = function(value, precision, options) {
	  return new NumberFormatter(value).toPrecision(precision, options);
	};

	/**
	 * Count the number of significant digits of a number.
	 *
	 * For example:
	 *   2.34 returns 3
	 *   0.0034 returns 2
	 *   120.5e+30 returns 4
	 *
	 * @param {number} value
	 * @return {number} digits   Number of significant digits
	 */
	exports.digits = function(value) {
	  return value
	      .toExponential()
	      .replace(/e.*$/, '')          // remove exponential notation
	      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
	      .length
	};

	/**
	 * Minimum number added to one that makes the result different than one
	 */
	exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

	/**
	 * Compares two floating point numbers.
	 * @param {number} x          First value to compare
	 * @param {number} y          Second value to compare
	 * @param {number} [epsilon]  The maximum relative difference between x and y
	 *                            If epsilon is undefined or null, the function will
	 *                            test whether x and y are exactly equal.
	 * @return {boolean} whether the two numbers are equal
	*/
	exports.nearlyEqual = function(x, y, epsilon) {
	  // if epsilon is null or undefined, test whether x and y are exactly equal
	  if (epsilon == null) return x == y;

	  // use "==" operator, handles infinities
	  if (x == y) return true;

	  // NaN
	  if (isNaN(x) || isNaN(y)) return false;

	  // at this point x and y should be finite
	  if(isFinite(x) && isFinite(y)) {
	    // check numbers are very close, needed when comparing numbers near zero
	    var diff = Math.abs(x - y);
	    if (diff < exports.DBL_EPSILON) {
	      return true;
	    }
	    else {
	      // use relative error
	      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
	    }
	  }

	  // Infinite and Number or negative Infinite and positive Infinite cases
	  return false;
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Format a number using methods toPrecision, toFixed, toExponential.
	 * @param {number | string} value
	 * @constructor
	 */
	function NumberFormatter (value) {
	  // parse the input value
	  var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
	  if (!match) {
	    throw new SyntaxError('Invalid number');
	  }

	  var sign         = match[1];
	  var coefficients = match[2];
	  var exponent     = parseFloat(match[4] || '0');

	  var dot = coefficients.indexOf('.');
	  exponent += (dot !== -1) ? (dot - 1) : (coefficients.length - 1);

	  this.sign = sign;
	  this.coefficients = coefficients
	      .replace('.', '')  // remove the dot (must be removed before removing leading zeros)
	      .replace(/^0*/, function (zeros) {
	        // remove leading zeros, add their count to the exponent
	        exponent -= zeros.length;
	        return '';
	      })
	      .replace(/0*$/, '') // remove trailing zeros
	      .split('')
	      .map(function (d) {
	        return parseInt(d);
	      });

	  if (this.coefficients.length === 0) {
	    this.coefficients.push(0);
	    exponent++;
	  }

	  this.exponent = exponent;
	}

	/**
	 * Format a number with fixed notation.
	 * @param {number} [precision=0]        Optional number of decimals after the
	 *                                      decimal point. Zero by default.
	 */
	NumberFormatter.prototype.toFixed = function (precision) {
	  var rounded = this.roundDigits(this.exponent + 1 + (precision || 0));
	  var c = rounded.coefficients;
	  var p = rounded.exponent + 1; // exponent may have changed

	  // append zeros if needed
	  var pp = p + (precision || 0);
	  if (c.length < pp) {
	    c = c.concat(zeros(pp - c.length));
	  }

	  // prepend zeros if needed
	  if (p < 0) {
	    c = zeros(-p + 1).concat(c);
	    p = 1;
	  }

	  // insert a dot if needed
	  if (precision) {
	    c.splice(p, 0, (p === 0) ? '0.' : '.');
	  }

	  return this.sign + c.join('');
	};

	/**
	 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	 * @param {number} [precision]  Number of digits in formatted output.
	 *                              If not provided, the maximum available digits
	 *                              is used.
	 */
	NumberFormatter.prototype.toExponential = function (precision) {
	  // round if needed, else create a clone
	  var rounded = precision ? this.roundDigits(precision) : this.clone();
	  var c = rounded.coefficients;
	  var e = rounded.exponent;

	  // append zeros if needed
	  if (c.length < precision) {
	    c = c.concat(zeros(precision - c.length));
	  }

	  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
	  var first = c.shift();
	  return this.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
	      'e' + (e >= 0 ? '+' : '') + e;
	};

	/**
	 * Format a number with a certain precision
	 * @param {number} [precision=undefined] Optional number of digits.
	 * @param {{lower: number | undefined, upper: number | undefined}} [options]
	 *                                       By default:
	 *                                         lower = 1e-3 (excl)
	 *                                         upper = 1e+5 (incl)
	 * @return {string}
	 */
	NumberFormatter.prototype.toPrecision = function(precision, options) {
	  // determine lower and upper bound for exponential notation.
	  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
	  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

	  var abs = Math.abs(Math.pow(10, this.exponent));
	  if (abs < lower || abs >= upper) {
	    // exponential notation
	    return this.toExponential(precision);
	  }
	  else {
	    var rounded = precision ? this.roundDigits(precision) : this.clone();
	    var c = rounded.coefficients;
	    var e = rounded.exponent;

	    // append trailing zeros
	    if (c.length < precision) {
	      c = c.concat(zeros(precision - c.length));
	    }

	    // append trailing zeros
	    // TODO: simplify the next statement
	    c = c.concat(zeros(e - c.length + 1 +
	        (c.length < precision ? precision - c.length : 0)));

	    // prepend zeros
	    c = zeros(-e).concat(c);

	    var dot = e > 0 ? e : 0;
	    if (dot < c.length - 1) {
	      c.splice(dot + 1, 0, '.');
	    }

	    return this.sign + c.join('');
	  }
	};

	/**
	 * Crete a clone of the NumberFormatter
	 * @return {NumberFormatter} Returns a clone of the NumberFormatter
	 */
	NumberFormatter.prototype.clone = function () {
	  var clone = new NumberFormatter('0');
	  clone.sign = this.sign;
	  clone.coefficients = this.coefficients.slice(0);
	  clone.exponent = this.exponent;
	  return clone;
	};

	/**
	 * Round the number of digits of a number *
	 * @param {number} precision  A positive integer
	 * @return {NumberFormatter}  Returns a new NumberFormatter with the rounded
	 *                            digits
	 */
	NumberFormatter.prototype.roundDigits = function (precision) {
	  var rounded = this.clone();
	  var c = rounded.coefficients;

	  // prepend zeros if needed
	  while (precision <= 0) {
	    c.unshift(0);
	    rounded.exponent++;
	    precision++;
	  }

	  if (c.length > precision) {
	    var removed = c.splice(precision);

	    if (removed[0] >= 5) {
	      var i = precision - 1;
	      c[i]++;
	      while (c[i] === 10) {
	        c.pop();
	        if (i === 0) {
	          c.unshift(0);
	          rounded.exponent++;
	          i++;
	        }
	        i--;
	        c[i]++;
	      }
	    }
	  }

	  return rounded;
	};

	/**
	 * Create an array filled with zeros.
	 * @param {number} length
	 * @return {Array}
	 */
	function zeros(length) {
	  var arr = [];
	  for (var i = 0; i < length; i++) {
	    arr.push(0);
	  }
	  return arr;
	}

	module.exports = NumberFormatter;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Emitter = __webpack_require__(9);

	/**
	 * Extend given object with emitter functions `on`, `off`, `once`, `emit`
	 * @param {Object} obj
	 * @return {Object} obj
	 */
	exports.mixin = function (obj) {
	  // create event emitter
	  var emitter = new Emitter();

	  // bind methods to obj (we don't want to expose the emitter.e Array...)
	  obj.on   = emitter.on.bind(emitter);
	  obj.off  = emitter.off.bind(emitter);
	  obj.once = emitter.once.bind(emitter);
	  obj.emit = emitter.emit.bind(emitter);

	  return obj;
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	function E () {
		// Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
		on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});
	    
	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });
	    
	    return this;
	  },

	  once: function (name, callback, ctx) {
	    var self = this;
	    var fn = function () {
	      self.off(name, fn);
	      callback.apply(ctx, arguments);
	    };
	    
	    return this.on(name, fn, ctx);
	  },

	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;
	    
	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }
	    
	    return this;
	  },

	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];
	    
	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback) liveEvents.push(evts[i]);
	      }
	    }
	    
	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	    (liveEvents.length) 
	      ? e[name] = liveEvents
	      : delete e[name];
	    
	    return this;
	  }
	};

	module.exports = E;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lazy = __webpack_require__(3).lazy;
	var isFactory = __webpack_require__(3).isFactory;
	var traverse = __webpack_require__(3).traverse;
	var extend = __webpack_require__(3).extend;
	var ArgumentsError = __webpack_require__(11);

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


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Create a syntax error with the message:
	 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
	 * @param {string} fn     Function name
	 * @param {number} count  Actual argument count
	 * @param {number} min    Minimum required argument count
	 * @param {number} [max]  Maximum required argument count
	 * @extends Error
	 */
	function ArgumentsError(fn, count, min, max) {
	  if (!(this instanceof ArgumentsError)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.fn = fn;
	  this.count = count;
	  this.min = min;
	  this.max = max;

	  this.message = 'Wrong number of arguments in function ' + fn +
	      ' (' + count + ' provided, ' +
	      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

	  this.stack = (new Error()).stack;
	}

	ArgumentsError.prototype = new Error();
	ArgumentsError.prototype.constructor = Error;
	ArgumentsError.prototype.name = 'ArgumentsError';
	ArgumentsError.prototype.isArgumentsError = true;

	module.exports = ArgumentsError;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var object = __webpack_require__(3);

	function factory (type, config, load, typed, dscopy) {
	  /**
	   * Set configuration options for dscopy.js, and get current options.
	   * Will emit a 'config' event, with arguments (curr, prev).
	   * @param {Object} [options] Available options:
	   *                            {number} epsilon
	   *                              Minimum relative difference between two
	   *                              compared values, used by all comparison functions.
	   *                            {string} matrix
	   *                              A string 'matrix' (default) or 'array'.
	   *                            {string} number
	   *                              A string 'number' (default) or 'bignumber'
	   *                            {number} precision
	   *                              The number of significant digits for BigNumbers.
	   *                              Not applicable for Numbers.
	   *                            {string} parenthesis
	   *                              How to display parentheses in LaTeX and string
	   *                              output.
	   * @return {Object} Returns the current configuration
	   */
	  return function _config(options) {
	    if (options) {
	      var prev = object.clone(config);

	      // merge options
	      object.deepExtend(config, options);

	      var curr = object.clone(config);

	      // emit 'config' event
	      dscopy.emit('config', curr, prev);

	      return curr;
	    }
	    else {
	      return object.clone(config);
	    }
	  };
	}

	exports.name = 'config';
	exports.dscopy = true; // request the dscopy namespace as fifth argument
	exports.factory = factory;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = [
	  //require('./type'),        // data types (Matrix, Complex, Unit, ...)
	  //require('./constants'),   // constants
	  //require('./expression'),  // expression parsing
	  __webpack_require__(14)    // functions
	  //require('./json'),        // serialization utility (math.json.reviver)
	  //require('./error')        // errors
	  //require('./core/core')        // errors
	];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = [
	  __webpack_require__(15)      // DDL Generator
	];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = [
	  __webpack_require__(16)      // Informix Generator
	];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = [
	  __webpack_require__(17)      // Insert SQL Generator
	];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extend = __webpack_require__(3).extend;

	function factory (type, config, load, typed) {
		var latex = __webpack_require__(18);

	  /**
	   * generate insert statement for informix database for given source data 
	   *
	   * Syntax:
	   *
	   *    dscopy.generateInsertSQL(CopyContextObject)
	   *
	   * Examples:
	   *
	   *    dscopy.generateInsertSQL(CopyContextObject)              // returns insert into test (id,name) values (1,'test');
	   *
	   *
	   * See also:
	   *
	   *    generateUpdateSQL
	   *
	   * @param  {any} CopyContextObject what containts metadata of data to be copied
	   * @return {String} Sum of `x` and `y`
	   */
	  var generateInsertSQL = typed('generateInsertSQL',{
	    // we extend the signatures of addScalar with signatures dealing with matrices
	    'any, any': function (CopyContextObject) {
	    	
	    	var responseSQL = "INSERT INTO ";
	    	var columnNameMetadata = CopyContextObject.columnNameMetadata;
	    	responseSQL = responseSQL + CopyContextObject.entityName +" (";
	    	for (var columnName in columnNameMetadata) {
	    	    if (columnNameMetadata.hasOwnProperty(columnName)) {
	    	    	responseSQL = responseSQL + columnName +","
	    	    }
	    	}
	    	
	    	responseSQL = responseSQL + ")";
	    	return responseSQL;
	    }
	  });

	  generateInsertSQL.toTex = '\\left(${args[0]}' + latex.operators['generateInsertSQL'] + '\\right)';
	  
	  return generateInsertSQL;
	}

	exports.name = 'generateInsertSQL';
	exports.factory = factory;


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	exports.symbols = {
	  // GREEK LETTERS
	  Alpha: 'A',     alpha: '\\alpha',
	  Beta: 'B',      beta: '\\beta',
	  Gamma: '\\Gamma',    gamma: '\\gamma',
	  Delta: '\\Delta',    delta: '\\delta',
	  Epsilon: 'E',   epsilon: '\\epsilon',  varepsilon: '\\varepsilon',
	  Zeta: 'Z',      zeta: '\\zeta',
	  Eta: 'H',       eta: '\\eta',
	  Theta: '\\Theta',    theta: '\\theta',    vartheta: '\\vartheta',
	  Iota: 'I',      iota: '\\iota',
	  Kappa: 'K',     kappa: '\\kappa',    varkappa: '\\varkappa',
	  Lambda: '\\Lambda',   lambda: '\\lambda',
	  Mu: 'M',        mu: '\\mu',
	  Nu: 'N',        nu: '\\nu',
	  Xi: '\\Xi',       xi: '\\xi',
	  Omicron: 'O',   omicron: 'o',
	  Pi: '\\Pi',       pi: '\\pi',       varpi: '\\varpi',
	  Rho: 'P',       rho: '\\rho',      varrho: '\\varrho',
	  Sigma: '\\Sigma',    sigma: '\\sigma',    varsigma: '\\varsigma',
	  Tau: 'T',       tau: '\\tau',
	  Upsilon: '\\Upsilon',  upsilon: '\\upsilon',
	  Phi: '\\Phi',      phi: '\\phi',      varphi: '\\varphi',
	  Chi: 'X',       chi: '\\chi',
	  Psi: '\\Psi',      psi: '\\psi',
	  Omega: '\\Omega',    omega: '\\omega',
	  //logic
	  'true': '\\mathrm{True}',
	  'false': '\\mathrm{False}',
	  //other
	  i: 'i', //TODO use \i ??
	  inf: '\\infty',
	  Inf: '\\infty',
	  infinity: '\\infty',
	  Infinity: '\\infty',
	  oo: '\\infty',
	  lim: '\\lim',
	  'undefined': '\\mathbf{?}'
	};

	exports.operators = {
	  'transpose': '^\\top',
	  'factorial': '!',
	  'pow': '^',
	  'dotPow': '.^\\wedge', //TODO find ideal solution
	  'unaryPlus': '+',
	  'unaryMinus': '-',
	  'bitNot': '~', //TODO find ideal solution
	  'not': '\\neg',
	  'multiply': '\\cdot',
	  'divide': '\\frac', //TODO how to handle that properly?
	  'dotMultiply': '.\\cdot', //TODO find ideal solution
	  'dotDivide': '.:', //TODO find ideal solution
	  'mod': '\\mod',
	  'add': '+',
	  'subtract': '-',
	  'to': '\\rightarrow',
	  'leftShift': '<<',
	  'rightArithShift': '>>',
	  'rightLogShift': '>>>',
	  'equal': '=',
	  'unequal': '\\neq',
	  'smaller': '<',
	  'larger': '>',
	  'smallerEq': '\\leq',
	  'largerEq': '\\geq',
	  'bitAnd': '\\&',
	  'bitXor': '\\underline{|}',
	  'bitOr': '|',
	  'and': '\\wedge',
	  'xor': '\\veebar',
	  'or': '\\vee'
	};

	exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

	var units = {
	  deg: '^\\circ'
	};

	//@param {string} name
	//@param {boolean} isUnit
	exports.toSymbol = function (name, isUnit) {
	  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
	  if (isUnit) {
	    if (units.hasOwnProperty(name)) {
	      return units[name];
	    }
	    return '\\mathrm{' + name + '}';
	  }

	  if (exports.symbols.hasOwnProperty(name)) {
	    return exports.symbols[name];
	  }
	  else if (name.indexOf('_') !== -1) {
	    //symbol with index (eg. alpha_1)
	    var index = name.indexOf('_');
	    return exports.toSymbol(name.substring(0, index)) + '_{'
	      + exports.toSymbol(name.substring(index + 1)) + '}';
	  }
	  return name;
	};


/***/ }
/******/ ])
});
;