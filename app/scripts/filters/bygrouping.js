'use strict';

/**
 * @ngdoc filter
 * @name datacityApp.filter:bygrouping
 * @function
 * @description
 * # bygrouping
 * Filter in the datacityApp.
 */
angular.module('datacityApp')
    .filter('bygrouping', function($log) {
        return function(input, useGrouping, grouping) {
            // Keine Gruppierung => Alles zurück
            if (!useGrouping || !grouping) {
                return input;
            }
            // Gruppierung => Filtern
            else {
                var output = [];
                input.forEach(function(element) {
                    if (grouping.field && grouping.attrs && (grouping.field.name === element.name || grouping.attrs[element.name])) {
                        output.push(element); // mitnehmen
                    }
                });
                return output;
            }
        };
    });
