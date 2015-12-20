'use strict';

describe('Controller: ViewsCtrl', function () {

  // load the controller's module
  beforeEach(module('datacityApp'));

  var ViewsCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    ViewsCtrl = $controller('ViewsCtrl', {
      $scope: $scope
      // place here mocked dependencies
    });
  }));

  it('should format a jstime nicely', function () {
    var jstime = 1450611200996;
    expect($scope.jstimeToFormatedTime(jstime)).toBe("20.12.2015 12:33:20");

  });
  /*
    //Schönere Darstellung der Zeit
    $scope.jstimeToFormatedTime = function (jstime) {
      var d = new Date(jstime);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
    */
});
