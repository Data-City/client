'use strict';

describe('Controller: PlaygroundCtrl', function () {

  // load the controller's module
  beforeEach(module('datacityApp'));

  var PlaygroundCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaygroundCtrl = $controller('PlaygroundCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlaygroundCtrl.awesomeThings.length).toBe(3);
  });
});
