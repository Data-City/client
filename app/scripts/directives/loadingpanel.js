'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:loadingpanel
 * @description
 * # loadingpanel
 */
angular.module('datacityApp')
    .directive('loadingpanel', function($log) {
        return {
            template: '<div class="panel panel-primary">' +
                '<div class="panel-heading"><span class="glyphicon glyphicon-hourglass"></span> {{msg}}</div>' +
                '<div class="panel-body">' +
                '<div class="progress">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="{{percentage}}" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: {{percentage}}%;">' +
                '{{percentage}}%' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.spinnerOptions = {
                    position: 'relative'
                };

                scope.msg = attrs.msg;
                scope.percentage = attrs.percentage;
                $log.info(attrs);
            }
        };
    });
