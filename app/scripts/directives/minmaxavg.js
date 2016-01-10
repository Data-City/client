'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:minmaxavg
 * @description
 * # minmaxavg
 */
angular.module('datacityApp')
    .directive('minmaxavg', function () {
        return {
            template: '<div class="row container">' +
            '<div class="col-md-4 col-sm-4" > <span class="pull-left">Minimum: {{min}} </span></div>' +
            '<div class="col-md-4 col-sm-4" > <span class="center-block text-center" > Durchschnitt: {{avg}} </span></div>' +
            '<div class="col-md-4 col-sm-4" > <span class="pull-right" > Maximum: {{max}} </span></div>' +
            '</div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.min = attrs.min;
                scope.avg = attrs.avg;
                scope.max = attrs.max;
            }
        };
    });
