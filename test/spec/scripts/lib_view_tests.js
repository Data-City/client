'use strict';

describe('lib_view Tests', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('sollte eine Addition durchführen', inject(function ($compile) {
    expect(addition(3,4)).toBe(7);
    expect(addition(4,7)).toBe(3);
    //expect(element.text()).toBe('this is the choosedatasource directive');
  }));
});