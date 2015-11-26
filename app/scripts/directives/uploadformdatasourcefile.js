'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:uploadformdatasourcefile
 * @description
 * # uploadformdatasourcefile
 */
angular.module('datacityApp')
  .directive('uploadformdatasourcefile', function () {
    return {
      template: `
        <div class="container">
	        <h3>Eine .csv-Datei hochladen:</h3>
		      <input name="Datei" type="file" size="50" accept="csv/*">
		      <button type="button" class="btn btn-default" onclick="">Datei hochladen</button>
        </div>`,
      restrict: 'E',
      /*
      link: function postLink(scope, element, attrs) {
        element.text('');
      }*/
    };
  });
