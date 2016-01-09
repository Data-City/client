'use strict';

describe('Directive: minmaxavg', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<minmaxavg></minmaxavg>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the minmaxavg directive');
  }));
});
