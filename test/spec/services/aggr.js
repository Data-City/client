'use strict';

describe('Service: AGGR', function () {

  // instantiate service
  var AGGR,
    init = function () {
      inject(function (_AGGR_) {
        AGGR = _AGGR_;
      });
    };

  // load the service's module
  beforeEach(module('datacityApp'));

  it('should do something', function () {
    init();

    expect(!!AGGR).toBe(true);
  });

  it('should be configurable', function () {
    module(function (AGGRProvider) {
      AGGRProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(AGGR.greet()).toEqual('Lorem ipsum');
  });

});
