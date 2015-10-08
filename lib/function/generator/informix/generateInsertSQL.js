'use strict';

var extend = require('../../../utils/object').extend;

function factory (type, config, load, typed) {
	var latex = require('../../../utils/latex.js');

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
