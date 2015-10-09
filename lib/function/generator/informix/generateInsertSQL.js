'use strict';

var extend = require('../../../utils/object').extend;

function factory (type, config, load, typed) {
	var latex = require('../../../utils/latex.js');

  /**
   * generate ASCII insert statement for informix database for given source data. 
   * This can be saved in file and run multiple times 
   *
   * Syntax:
   *
   *    dscopy.generateInsertSQL(CopyContextObject)
   *
   * Examples:
   *
   *    dscopy.generateInsertSQL(CopyContextObject)  // returns insert into test (id,name) values (1,'test');
   *
   *
   * See also:
   *
   *    generateUpdateSQL
   *
   * @param  {any} CopyContextObject what contains metadata of data to be copied
   * @return {String} Generate SQL
   */
  var generateInsertSQL = typed('generateInsertSQL',{
    // we extend the signatures of addScalar with signatures dealing with matrices
    'any': function (CopyContextObjectStr) {
    	var CopyContextObject = JSON.parse(CopyContextObjectStr);
    	var responseSQL = "";
    	var insertPrefix = "INSERT INTO ";
    	var columnNameMetadata = CopyContextObject.metadata["columnNameMetadata"];
    	insertPrefix = insertPrefix + CopyContextObject.metadata.entityName +" (";
    	for (var columnName in columnNameMetadata) {
    	    if (columnNameMetadata.hasOwnProperty(columnName)) {
    	    	insertPrefix = insertPrefix + columnName +","
    	    }
    	}
    	
    	insertPrefix = insertPrefix.substring(0,insertPrefix.length-1);
    	insertPrefix = insertPrefix + ") values (";
    	
    	
    	
    	// Iterate over all rows
    	for (var dataIndex in CopyContextObject.data) {
    		if (CopyContextObject.data.hasOwnProperty(dataIndex)) {
    			// Now Iterate over each Column
    			var rowObject = CopyContextObject.data[dataIndex];
    			var dataSQL = "";
    			for (var rowKey in rowObject) {
    				if (rowObject.hasOwnProperty(rowKey)) {
    					var metadataForColumn = columnNameMetadata[rowKey.toUpperCase()];
    					// Do Case Insensitive match
    					//string1.match(/AbC/i)
    					if(dataSQL != ""){
    						dataSQL = dataSQL + ","; 
    					}
    					
    					if(metadataForColumn.columnTypeName.match(/int/i)){
    						dataSQL = dataSQL+ rowObject[rowKey];
    					}else if(metadataForColumn.columnTypeName.match(/long/i)){
    						dataSQL = dataSQL+ rowObject[rowKey];
    					}else if(metadataForColumn.columnTypeName.match(/date/i)){
    						dataSQL = dataSQL+ "'"+(new Date(rowObject[rowKey])).mmddyyyy()+"'";
    					}else if(metadataForColumn.columnTypeName.match(/time/i)){
    						dataSQL = dataSQL+ "'"+(new Date(rowObject[rowKey])).mmddyyyy()+"'";
    					}else{
    						dataSQL = dataSQL+ "'"+rowObject[rowKey]+"'";
    					}
    					
    				}
    			}/// End of row Iteration
    			
    			responseSQL = responseSQL+insertPrefix + dataSQL +");<br/>";
    			
    		}
    	}
    	

    	return responseSQL;
    }
  });

  generateInsertSQL.toTex = '\\left(${args[0]}' + latex.operators['generateInsertSQL'] + '\\right)';
  
  return generateInsertSQL;
}

exports.name = 'generateInsertSQL';
exports.factory = factory;
