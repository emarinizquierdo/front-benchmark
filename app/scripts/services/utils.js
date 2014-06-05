'use strict';

angular.module('bbvaBenchmarkApp')
  .service('Utils', function Utils() {
    
    var _parseToDataTable = function(response, p_header){

		var data = new google.visualization.DataTable();
		var _auxCasting = [];
		var _type;
		var _fields = (response.schema) ? response.schema.fields : [];

		for(var _i = 0; _i < _fields.length; _i++){
			_type = ( _fields[_i].type.toLowerCase() == "float" || _fields[_i].type.toLowerCase() == "integer") ? "number" : _fields[_i].type.toLowerCase();
			data.addColumn(_type, _fields[_i].name)
		}

	    $.each(response.result.rows, function(i, item) {
	    	_auxCasting = [];
	    	for(var _i = 0; _i < _fields.length; _i++){
	    		if(_fields[_i].type.toLowerCase() == "integer"){
	    			_auxCasting.push(parseInt(item.f[_i].v));
	    		}else if (_fields[_i].type.toLowerCase() == "float"){
	    			_auxCasting.push(parseFloat(item.f[_i].v));
	    		}else if (_fields[_i].type.toLowerCase() == "boolean"){
	    			var _auxBoolean = (item.f[_i].v && item.f[_i].v.toLowerCase() == "true");
	    			_auxCasting.push(_auxBoolean);
	    		}else{
	    			_auxCasting.push(item.f[_i].v);
	    		}			
			}
	      	data.addRow(_auxCasting);
	    });

	    return data;

	}

	this.parseToDataTable = _parseToDataTable;

  });
