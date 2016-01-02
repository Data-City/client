'use strict';

/**
 * Filtert Attribute nach ihrer Wählbarkeit
 * 
 * @ngdoc filter
 * @name datacityApp.filter:bychooseability
 * @function
 * @description
 * # bychooseability
 * Filter in the datacityApp.
 */
angular.module('datacityApp')
  .filter('bychooseability', function () {
    return function (attrs) {
      var out = [];
      if (attrs) {
        attrs.forEach(function (element, index) {
          if (element.chooseable) {
            out.push(element);
          }
        });
      }
      return out;
    };
  });
