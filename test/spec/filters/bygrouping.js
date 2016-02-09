'use strict';

describe('Filter: bygrouping', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var bygrouping;
  beforeEach(inject(function ($filter) {
    bygrouping = $filter('bygrouping');
  }));

  it('should return the input prefixed with "bygrouping filter:"', function () {
    var text = 'angularjs';
    expect(bygrouping(text)).toBe('bygrouping filter: ' + text);
  });

});
