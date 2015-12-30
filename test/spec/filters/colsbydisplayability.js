'use strict';

describe('Filter: colsbydisplayability', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var colsbydisplayability;
  beforeEach(inject(function ($filter) {
    colsbydisplayability = $filter('colsbydisplayability');
  }));

});
