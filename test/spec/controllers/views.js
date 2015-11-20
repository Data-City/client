'use strict';

describe('Controller: ViewsCtrl', function () {

  // load the controller's module
  beforeEach(module('datacityApp'));

  var ViewsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewsCtrl = $controller('ViewsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewsCtrl.awesomeThings.length).toBe(3);
  });
});
