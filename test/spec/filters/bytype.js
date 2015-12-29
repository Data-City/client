'use strict';

describe('Filter: bytype', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var bytype;
  beforeEach(inject(function ($filter) {
    bytype = $filter('bytype');
  }));

  it('should return the input prefixed with "bytype filter:"', function () {
    var text = 'angularjs';
    expect(bytype(text)).toBe('bytype filter: ' + text);
  });

});
