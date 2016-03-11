'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:loadingpanel
 * @description
 * # loadingpanel
 */
angular.module('datacityApp')
    .directive('loadingpanel', function($log, $location) {
        return {
            template: '<div class="panel panel-primary">' +
                '<div class="panel-heading"><span class="glyphicon glyphicon-hourglass"></span> {{msg}}</div>' +
                '<div class="panel-body">' +
                '<div class="progress" ng-hide="percentage >= 100">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="{{percentage}}" aria-valuemin="0" aria-valuemax="100" ng-style="width={width:\'{{percentage}}%\'}" style="min-width: 2em;">' +
                '{{percentage}}%' +
                '</div>' +
                '</div>' +
                '<div class="alert alert-success" role="alert" ng-show="percentage >= 100"><strong>Fertig!</strong> {{finishMsg}}</div>' +
                '<a href="{{buttonUrl}}" class="btn btn-default pull-right" aria-label="Left Align" ng-show="percentage >= 100">' +
                '{{buttonMsg}}' +
                '</a>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.spinnerOptions = {
                    position: 'relative'
                };

                scope.msg = attrs.msg;
                scope.finishMsg = attrs.finishmsg;
                scope.buttonUrl = attrs.buttonurl;
                scope.buttonMsg = attrs.buttonmsg;
                scope.percentage = attrs.percentage;
                $log.info(attrs);
            }
        };
    });
