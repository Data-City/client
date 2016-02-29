'use strict';

describe('Directive: loadingpanel', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<loadingpanel></loadingpanel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loadingpanel directive');
  }));
});
