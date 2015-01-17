var autotestApp = angular.module("autotestApp");

autotestApp.controller("memoryController", function($scope, $rootScope) {
    var actionToCase = {};
    var caseDisplay = {};
    var actionTip = {};
    var meminfoMap = {};

    $scope.x2AxisTickFormatFunction = function(){
        return function(d){
            if (d in actionToCase) {
                return actionToCase[d];
            } else {
                return '';
            }
        }
    }
    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            if (d in caseDisplay) {
                return caseDisplay[d];
            } else {
                return '';
            }
        }
    }
    $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return '<p>' + actionTip[index] + '</p>' +
                '<p>' +  y + ' at ' + x + '</p>'
        }
    }

    var colorArray = ['#CC0000', '#FF6666', '#FFE6E6'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    $scope.memoryData = [
        {
            "key": "Memory",
            "values": [] 
        }
    ];

    $scope.$on('elementClick.directive', function(angularEvent, event){
        var index = event.series.values[event.pointIndex][0];
        var data = {
            title: actionTip[index],
            content: meminfoMap[index]
        };
        $rootScope.$broadcast('showdialog', data);
    });

    $scope.$on('repoprt:memory', function(event, data) {
        $scope.$apply(function () {
            actionToCase = data.actionToCase;
            caseDisplay = data.caseDisplay;
            actionTip = data.actionTip;
            meminfoMap = data.meminfoMap;
            $scope.memoryData[0].values = data.memoryData;
        });
    });
});

autotestApp.controller("reportController", function($scope, $rootScope) {
    $scope.reportNavSelect = 1;
    $scope.$on('showdialog', function(event, data) {
        $scope.$apply(function () {
            $scope.dialog = data;
            $('#myModal').modal('show');
        });
    });

	$scope.selectReportFile = function(event) {
		var files = event.target.files;
        var file = files[0];
	    var reader = new FileReader();

	    // If we use onloadend, we need to check the readyState.
	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	        var result = evt.target.result;
	        var jsonObject = JSON.parse(result);
	        if (jsonObject && jsonObject.memory) {
                var actionToCase = {};
                var caseDisplay = {};
		        var memoryData = [];
                var actionTip = {};
                var meminfoMap = {};
                jsonObject.memory.forEach(function(value, caseIndex) {
                    value.records.forEach(function(value, actionIndex) {
                        var index = memoryData.length + 1;
                        actionToCase[index] = caseIndex + 1;
                        caseDisplay[index] = 'Case ' + (caseIndex + 1) + ' : Action ' + (actionIndex + 1);
                        actionTip[index] = value.action;
                        meminfoMap[index] = value.meminfo;
                        memoryData.push([index, value.heap]);
                    });
                });

                $rootScope.$broadcast('repoprt:memory', {'meminfoMap': meminfoMap, 'memoryData': memoryData, 'actionToCase': actionToCase, 'caseDisplay': caseDisplay, 'actionTip': actionTip});
	        }
	      }
		};

	    reader.readAsText(file);
	}

});