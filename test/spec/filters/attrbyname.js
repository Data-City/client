'use strict';

describe('Filter: attrbyname', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var attrbyname;
  beforeEach(inject(function ($filter) {
    attrbyname = $filter('attrbyname');
  }));

  it('should return the input prefixed with "attrbyname filter:"', function () {
    var text = 'angularjs';
    expect(attrbyname(text)).toBe('attrbyname filter: ' + text);
  });

});
