'use strict';

/**
 * Filtert Attribute nach Typ
 * 
 * @ngdoc filter
 * @name datacityApp.filter:bytype
 * @function
 * @description
 * # bytype
 * Filter in the datacityApp.
 */
angular.module('datacityApp')
  .filter('bytype', function ($log) {
    return function (attrs, datatype) {
      var out = [];
      attrs.forEach(function (element, index) {
        if (element.type === datatype) {
          out.push(element);
        }
      });
      return out;
    };
  });
