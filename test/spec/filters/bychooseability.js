'use strict';

describe('Filter: bychooseability', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var bychooseability;
  beforeEach(inject(function ($filter) {
    bychooseability = $filter('bychooseability');
  }));


});
