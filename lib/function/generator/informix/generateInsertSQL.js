'use strict';

var extend = require('../../../utils/object').extend;

function factory (type, config, load, typed) {
	var latex = require('../../../utils/latex.js');

  /**
   * generate insert statement for informix database for given source data 
   *
   * Syntax:
   *
   *    dscopy.generateInsertSQL(x, y)
   *
   * Examples:
   *
   *    dscopy.generateInsertSQL(x, y)              // returns insert into test (id,name) values (1,'test');
   *
   *
   * See also:
   *
   *    generateUpdateSQL
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */
  var generateInsertSQL = typed('generateInsertSQL',{
    // we extend the signatures of addScalar with signatures dealing with matrices
    'any, any': function (x, y) {
      // use matrix implementation
      return "Sample Generated SQL";
    }
  });

  generateInsertSQL.toTex = '\\left(${args[0]}' + latex.operators['generateInsertSQL'] + '${args[1]}\\right)';
  
  return generateInsertSQL;
}

exports.name = 'generateInsertSQL';
exports.factory = factory;
