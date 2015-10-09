'use strict';

var extend = require('../../../utils/object').extend;

function factory (type, config, load, typed) {
	var latex = require('../../../utils/latex.js');

  /**
   * Generate column value in ASCII format from given datatype and value 
   *
   * Syntax:
   *
   *    dscopy.generateColumnValue(MetadataObject,ColumnName,ColumnValue)
   *
   * Examples:
   *
   *    dscopy.generateColumnValue(MetadataObject,ColumnName,ColumnValue)  // returns insert into test (id,name) values (1,'test');
   *
   *
   * See also:
   *
   *    generateUpdateSQL
   *
   * @param  {any} CopyContextObject what contains metadata of data to be copied
   * @return {String} Generate SQL
   */
  var generateColumnValue = typed('generateColumnValue',{
    // we extend the signatures of addScalar with signatures dealing with matrices
    'any,string,any ': function (MetadataObject,ColumnName,ColumnValue) {
    	var responseValue = "";
    	
    	return responseValue;
    }
  });

  generateColumnValue.toTex = '\\left(${args[0]}' + latex.operators['generateColumnValue'] + '\\right)';
  
  return generateColumnValue;
}

exports.name = 'generateColumnValue';
exports.factory = factory;
