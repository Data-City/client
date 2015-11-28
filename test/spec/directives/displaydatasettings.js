'use strict';

describe('Directive: displaydatasettings', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<displaydatasettings></displaydatasettings>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the displaydatasettings directive');
  }));
});
