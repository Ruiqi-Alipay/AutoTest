var autotestApp = angular.module("autotestApp");

autotestApp.controller("dataController", function($scope, $rootScope, dataService) {
    $scope.reports = dataService.getServerReport();

    $scope.x2AxisTickFormatFunction = function(){
        return function(d){
            if (d in $scope.actionToCase) {
                return $scope.actionToCase[d];
            } else {
                return '';
            }
        }
    }
    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            if (d in $scope.caseDisplay) {
                return $scope.caseDisplay[d];
            } else {
                return '';
            }
        }
    }
    $scope.memoryToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> Heap: ' +  y + ' Mb / ' + x + '</p>'
        }
    }
    $scope.networkToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> Sent: ' +  $scope.sentMap[index] + ' Kb Rev: ' + $scope.receiveMap[index] + ' Kb / ' + x + '</p>'
        }
    }
    $scope.cpuToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> CPU: ' +  y + '% / ' + x + '</p>'
        }
    }

    $scope.memoryData = [
        {
            "key": "Memory",
            "values": [] 
        }
    ];
    $scope.networkData = [
        {
            "key": "Network",
            "values": [] 
        }
    ];
    $scope.cpuData = [
        {
            "key": "CPU",
            "values": [] 
        }
    ];

    $scope.$on('elementClick.directive', function(angularEvent, event){
        var index = event.series.values[event.pointIndex][0];
        var content;
        if (event.series.key === 'Memory') {
            content = $scope.meminfoMap[index] + '\n\n' + $scope.logMap[index];
        } else if (event.series.key === 'Network') {
            content = $scope.logMap[index];
        } else if (event.series.key === 'CPU') {
            content = $scope.logMap[index];
        }

        $rootScope.$broadcast('showdialog', {
            title: $scope.actionTip[index],
            content: content
        });
    });

    $scope.$on('repoprt:newdata', function(event, data) {
        $scope.$apply(function () {
            $scope.memoryData[0].values = data.memoryData;
            $scope.networkData[0].values = data.networkData;
            $scope.cpuData[0].values = data.cpuData;
        });
    });
});

autotestApp.controller("reportController", function($scope, $rootScope) {
    $scope.selectReport;

    var onLoadReport = function(title, data) {
        $scope.title = title;
        var records = JSON.parse(data);
        if (records) {
            $scope.actionToCase = {};
            $scope.caseDisplay = {};
            $scope.actionTip = {};
            $scope.meminfoMap = {};
            $scope.sentMap = {};
            $scope.receiveMap = {};
            $scope.logMap = {};

            var memoryData = [];
            var networkData = [];
            var cpuData = [];
            records.forEach(function(record, index) {
                var actionIndex = index + 1;
                var caseIndex = record.index + 1;
                $scope.actionToCase[actionIndex] = caseIndex;
                $scope.caseDisplay[actionIndex] = 'Case ' + caseIndex + ' : Action ' + actionIndex;
                $scope.actionTip[actionIndex] = record.action;
                $scope.meminfoMap[actionIndex] = record.meminfo;
                $scope.logMap[actionIndex] = record.log;
                $scope.sentMap[actionIndex] = record.sent;
                $scope.receiveMap[actionIndex] = record.reve;

                memoryData.push([actionIndex, record.heap]);
                networkData.push([actionIndex, record.sent + record.reve]);
                cpuData.push([actionIndex, record.cpu]);
            });

            $rootScope.$broadcast('repoprt:newdata', {'memoryData': memoryData, 'networkData': networkData, 'cpuData': cpuData});
        }
    };

    $scope.$on('showdialog', function(event, data) {
        $scope.$apply(function () {
            $scope.dialog = data;
            $('#myModal').modal('show');
        });
    });
    $scope.$on('')

    $scope.loadReportFromLocal = function() {
        var pom = document.createElement('input');
        pom.setAttribute('type', 'file');
        pom.setAttribute('accept', '.report');
        pom.setAttribute('onchange', "angular.element(document.getElementById('viewRoot')).scope().localReadFile(this)");
        pom.click();
    };

    $scope.loadScriptFromServer = function(index) {
        $scope.selectReport = $scope.reports[index];
        onLoadReport($scope.selectReport.title, $scope.selectReport.content);
    };

	$scope.localReadFile = function(event) {
		var files = event.files;
        var file = files[0];
	    var reader = new FileReader();

	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) {
            onLoadReport(file.title, evt.target.result);
	      }
		};

	    reader.readAsText(file);
	};

    $scope.saveReport = function() {
        $http.post('/autotest/api/testreport', $scope.selectReport).success(function(data){
            $rootScope.$broadcast('toastMessage', '保存成功');
        }).error(function(data, status, headers, config) {
            $rootScope.$broadcast('toastMessage', '保存失败：' + data);
        });
    };
});