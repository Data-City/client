'use strict';

describe('Controller: StoredviewCtrl', function () {

  // load the controller's module
  beforeEach(module('datacityApp'));

  var StoredviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoredviewCtrl = $controller('StoredviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StoredviewCtrl.awesomeThings.length).toBe(3);
  });
});
