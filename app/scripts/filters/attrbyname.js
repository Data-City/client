'use strict';

/**
 * Filter für Attribute
 * 
 * Gibt alle Attribute zurück, außer dem benannten
 * 
 * @ngdoc filter
 * @name datacityApp.filter:attrbyname
 * @function
 * @description
 * # attrbyname
 * Filter in the datacityApp.
 */
angular.module('datacityApp')
    .filter('attrbyname', function($log) {
        return function(attrs, attrToDelete) {
            var out = [];
            if (attrs && attrToDelete) {
                attrs.forEach(function(element, index) {
                    if (element.name !== attrToDelete.name) {
                        out.push(element);
                    }
                });
            }
            return out;
        };
    });
