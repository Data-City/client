'use strict';

describe('Service: REST', function () {

  // instantiate service
  var REST,
    init = function () {
      inject(function (_REST_) {
        REST = _REST_;
      });
    };

  // load the service's module
  beforeEach(module('datacityApp'));

  it('should do something', function () {
    init();

    expect(!!REST).toBe(true);
  });

   /* heißt nicht mehr RESTProvider und die aggr.js hat keine Funktion mit "setSalutation"
  it('should be configurable', function () {
    module(function (RESTProvider) {
      RESTProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(REST.greet()).toEqual('Lorem ipsum');
  });
*/
});
