'use strict';
/* jshint strict: false, -W117 */
describe('lib_view Tests', function () {

  // load the directive's module
  beforeEach(module('datacityApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));
  
  it('should count the properties of an object', function() {
    expect(count(null)).toBe(0);
    var obj = [];
    
    expect(count(obj)).toBe(0);
    obj.push("a");
    expect(count(obj)).toBe(1);
    obj.push("b");
    expect(count(obj)).toBe(2);
    // Es wird rekursiv gezählt
    obj.a = [];
    obj.a.push("aa");
    expect(count(obj)).toBe(3);
  });

});