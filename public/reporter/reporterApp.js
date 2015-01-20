var reporterApp = angular.module("reporterApp", ['nvd3ChartDirectives']);

reporterApp.controller("reporterController", function($scope, $location, restService) {
    var parameter = $location.search();
    var report;

    if (parameter.type === 'memory') {
        $scope.header = {
            main: '内存使用报告',
            sub: 'Dalvik Heap'
        };
    } else if (parameter.type === 'network') {
        $scope.header = {
            main: '流量使用报告',
            sub: '发送/接收'
        };
    } else if (parameter.type === 'cpu') {
        $scope.header = {
            main: 'CPU使用报告',
            sub: '使用占比'
        };
    }

    var refresh = function() {
        restService.getReport(parameter.title, function(array) {
            if (!array) {
                return;
            }

            report = array[0];
            var records = JSON.parse(report.content);
            if (records) {
                $scope.actionToCase = {};
                $scope.caseDisplay = {};
                $scope.actionTip = {};
                $scope.meminfoMap = {};
                $scope.sentMap = {};
                $scope.receiveMap = {};
                $scope.logMap = {};

                var data = [];
                records.forEach(function(record, index) {
                    var actionIndex = index + 1;
                    var caseIndex = record.index + 1;
                    $scope.actionToCase[actionIndex] = caseIndex;
                    $scope.caseDisplay[actionIndex] = 'Case ' + caseIndex;
                    $scope.actionTip[actionIndex] = record.action;
                    $scope.sentMap[actionIndex] = record.sent;
                    $scope.receiveMap[actionIndex] = record.reve;

                    if (parameter.type === 'memory') {
                        data.push([actionIndex, record.heap]);
                    } else if (parameter.type === 'network') {
                        data.push([actionIndex, record.sent + record.reve]);
                    } else if (parameter.type === 'cpu') {
                        data.push([actionIndex, record.cpu]);
                    }
                });

                $scope.reportData[0].values = data;
            }
        });
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
    $scope.getToolTip = function(){
        return function(key, x, y, e, graph) {
            var index = e.series.values[e.pointIndex][0];
            if (parameter.type === 'memory') {
                return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                    '<p> Heap: ' +  y + ' Mb / ' + x + '</p>';
            } else if (parameter.type === 'network') {
                return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                    '<p> Sent: ' +  $scope.sentMap[index] + ' Kb Rev: ' + $scope.receiveMap[index] + ' Kb / ' + x + '</p>';
            } else if (parameter.type === 'cpu') {
                return "<p style='background: gray'>" + $scope.actionTip[index] + '</p>' +
                                '<p> CPU: ' +  y + '% / ' + x + '</p>'
            }
        }
    };

    $scope.closeLog = function() {
        $scope.log = undefined;
    };

    $scope.reportData = [
        {
            "key": parameter.type,
            "values": [] 
        }
    ];

    $scope.$on('elementClick.directive', function(angularEvent, event){
        var index = event.series.values[event.pointIndex][0];
        $scope.log = {
            content: 'Loading..',
            title: $scope.actionTip[index]
        };

        restService.getReportData(report.title, index, function(data) {
            var content;
            if (parameter.type === 'memory') {
                content = data.mem + '\n\n' + data.log;
            } else if (parameter.type === 'network') {
                content = data.log;
            } else if (parameter.type === 'cpu') {
                content = data.log;
            }

            $scope.log.content = content;
        });
    });

    refresh();
});