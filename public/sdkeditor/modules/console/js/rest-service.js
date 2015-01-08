console.factory('restService', function ($http) {
	var listServerScripts = function(success, error) {
		$http.get('/sdkeditor/api/scripts').success(function(array) {
			if (array) {
				success(array);
			} else {
				success([]);
			}
		}).error(function(data, status, headers, config) {
			error(data);
		});
	};
	var saveScript = function(success, error) {
		$http.post('/sdkeditor/api/scripts', script).success(function(data){
	    	success(data);
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};
	var deleteScript = function(id, success, error) {
		$http.delete('/sdkeditor/api/scripts/' + id).success(function(data){
	    	success();
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};

	return {
		listServerScripts: function(success, error) {
			return listServerScripts(success, error);
		},
		saveScript: function(success, error) {
			return saveScript(success, error);
		},
		deleteScript: function(id, success, error) {
			return deleteScript(id, success, error);
		}
	};
});