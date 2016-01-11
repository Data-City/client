'use strict';

/**
 * Tragen Collections "_dc_" im Namen enthalten sie Meta-Daten
 * und sollen nicht als Stadt angezeigt werden
 * 
 * @ngdoc filter
 * @name datacityApp.filter:colsbydisplayability
 * @function
 * @description
 * # colsbydisplayability
 * Filter in the datacityApp.
 */
angular.module('datacityApp')
    .filter('colsbydisplayability', function($log, REST) {
        return function(collections) {
            var displayableCollections = [];

            collections.forEach(function(element, index) {
                /*jshint -W117 */
                if (element._id.indexOf(REST.META_DATA_PART) < 0) {
                    displayableCollections.push(element);
                }
            });

            return displayableCollections;
        };
    });
