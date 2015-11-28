'use strict';

describe('Directive: choosedatasource', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<choosedatasource></choosedatasource>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the choosedatasource directive');
  }));
});
