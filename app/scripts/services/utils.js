'use strict';

angular.module('bbvaBenchmarkApp')
  .service('Utils', function Utils() {
    
    var _parseToDataTable = function(response, p_header){

		var data = new google.visualization.DataTable();
		var _auxCasting = [];
		var _type;

		for(var _i = 0; _i < p_header.length; _i++){
			_type = (p_header[_i][0] == "float" || p_header[_i][0] == "integer") ? "number" : p_header[_i][0];
			data.addColumn(_type, p_header[_i][1])
		}
	    $.each(response.result.rows, function(i, item) {
	    	_auxCasting = [];
	    	for(var _i = 0; _i < p_header.length; _i++){
	    		if(p_header[_i][0] == "integer"){
	    			_auxCasting.push(parseInt(item.f[_i].v));
	    		}else if (p_header[_i][0] == "float"){
	    			_auxCasting.push(parseFloat(item.f[_i].v));
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
