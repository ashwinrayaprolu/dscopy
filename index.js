var core = require('./core');

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
  dscopy.import(require('./lib'));

  return dscopy;
}

// return a new instance of dscopy.js
module.exports = create();
