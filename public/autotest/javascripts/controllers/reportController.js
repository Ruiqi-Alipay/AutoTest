var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportController", function($scope) {

});

autotestApp.controller("dataController", function($scope, $rootScope, dataService) {
    var refresh = function() {
        var report = dataService.getSelectReport();
        if (!report) {
            return;
        }

        var records = JSON.parse(report.content);
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
                $scope.caseDisplay[actionIndex] = 'Case ' + caseIndex;
                $scope.actionTip[actionIndex] = record.action;
                $scope.sentMap[actionIndex] = record.sent;
                $scope.receiveMap[actionIndex] = record.reve;

                memoryData.push([actionIndex, record.heap]);
                networkData.push([actionIndex, record.sent + record.reve]);
                cpuData.push([actionIndex, record.cpu]);
            });

            $scope.memoryData[0].values = memoryData;
            $scope.networkData[0].values = networkData;
            $scope.cpuData[0].values = cpuData;
        }
    };

    $scope.x2AxisTickFormatFunction = function(){
        return function(d){
            if (d in $scope.actionToCase) {
                return $scope.actionToCase[d];
            } else {
                return '';
            }
        }
    };
    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            if (d in $scope.caseDisplay) {
                return $scope.caseDisplay[d];
            } else {
                return '';
            }
        }
    };
    $scope.memoryToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> Heap: ' +  y + ' Mb / ' + x + '</p>'
        }
    };
    $scope.networkToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> Sent: ' +  $scope.sentMap[index] + ' Kb Rev: ' + $scope.receiveMap[index] + ' Kb / ' + x + '</p>'
        }
    };
    $scope.cpuToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                '<p> CPU: ' +  y + '% / ' + x + '</p>'
        }
    };

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
        var report = dataService.getSelectReport();
        dataService.getReportData(report.title, index, function(data) {
            var content;
            if (event.series.key === 'Memory') {
                content = data.mem + '\n\n' + data.log;
            } else if (event.series.key === 'Network') {
                content = data.log;
            } else if (event.series.key === 'CPU') {
                content = data.log;
            }

            $rootScope.$broadcast('showdialog', {
                title: $scope.actionTip[index],
                content: content
            });
        });
    });

    refresh();
});