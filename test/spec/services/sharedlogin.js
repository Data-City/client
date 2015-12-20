'use strict';

describe('Service: sharedLogin', function () {

  // load the service's module
  beforeEach(module('datacityApp'));

  // instantiate service
  var sharedLogin;
  beforeEach(inject(function (_sharedLogin_) {
    sharedLogin = _sharedLogin_;
  }));

  it('should do something', function () {
    expect(!!sharedLogin).toBe(true);
  });

});
