'use strict';

describe('Directive: chooseexistingmongodbcollection', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chooseexistingmongodbcollection></chooseexistingmongodbcollection>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the chooseexistingmongodbcollection directive');
  }));
});
