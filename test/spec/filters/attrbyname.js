'use strict';

describe('Filter: attrbyname', function () {

  // load the filter's module
  beforeEach(module('datacityApp'));

  // initialize a new instance of the filter before each test
  var attrbyname;
  beforeEach(inject(function ($filter) {
    attrbyname = $filter('attrbyname');
  }));

/* funktioniert nicht, obwohl gleicher Input und gleiche Objekte?
  it('should return the input prefixed with "attrbyname filter:"', function () {
	
	var element1 = {name: 'foobar'};
	var element2 = {name: 'bar'};
	var element3 = {name: 'barfoo'};
	var element4 = {name: 'foo'};
	
	var input = [element1, element2, element3, element4];
	var output = [element1, element2, element3];
	// Das Objekt mit ".name=foo" löschen
    expect(attrbyname(input, element4)).toBe(output);
  });
 */

});
