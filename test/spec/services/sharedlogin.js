'use strict';

describe('Service: sharedLogin', function () {

  // load the service's module
  beforeEach(module('datacityApp'));

  // instantiate service
  var sharedLogin;
  beforeEach(inject(function (_sharedLogin_) {
    sharedLogin = _sharedLogin_;
  }));

  it('should recognize this service', function () {
    expect(!!sharedLogin).toBe(true);
  });
  
  it('should change the loggedIn status', function() {
    sharedLogin.loggedIn = false;
    expect(sharedLogin.getLoggedIn()).toBe(false);
    sharedLogin.login("a", "a");
    expect(sharedLogin.getLoggedIn()).toBe(true);
    
    // Test logout function
    sharedLogin.logout();
    expect(sharedLogin.getLoggedIn()).toBe(false);
    expect(sharedLogin.loggedIn).toBe(false);
    expect(sharedLogin.getUsername()).toBe("");
    expect(sharedLogin.getPassword()).toBe("");
  });
  
  it('should get the right username and password after login', function() {
    sharedLogin.login("a", "a");
    
    expect(sharedLogin.getUsername()).toBe("a");
    expect(sharedLogin.getPassword()).toBe("a");
    
  });
});
