var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportController", function($scope) {
        $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 45
                },
                clipEdge: true,
                staggerLabels: true,
                transitionDuration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Test case (count)',
                    showMaxMin: false,
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Heap size in Mb',
                    axisLabelDistance: 40,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };

	$scope.selectReportFile = function(event) {
		var files = event.target.files;
        var file = files[0];
	    var reader = new FileReader();

	    // If we use onloadend, we need to check the readyState.
	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	        var result = evt.target.result;
	        var jsonObject = JSON.parse(result);
	        if (jsonObject != null) {
		        $scope.$apply(function() {
	        		$scope.memData = jsonObject.memory;
	        		$scope.netData = jsonObject.network;
	        		$scope.cpuData = jsonObject.cpu;
	        	});
	        }
	      }
		};

	    reader.readAsText(file);
	}

        $scope.cupOptions = {
            chart: {
                type: 'stackedAreaChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                x: function(d){return d.label;},
                y: function(d){return d.percent;},
                useVoronoi: false,
                clipEdge: true,
                transitionDuration: 500,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.format(',.f')(d);
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        return d3.format(',.f')(d);
                    }
                }
            }
        };
});