'use strict';

describe('Filter: bytype', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var bytype;
  beforeEach(inject(function ($filter) {
    bytype = $filter('bytype');
  }));


});
