'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('datacityApp'));

  var MainCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, REST) {
    $scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: $scope
      // place here mocked dependencies
    });
  }));

  /*
  it('should attach a list of awesomeThings to the scope', function () {
    //expect(MainCtrl.awesomeThings.length).toBe(3);
  });
  */
    it('Sollte die richtige ID zurück geben', function () {
      var object = {"data":{"_links":{"self":{"href":"/prelife/Benedetto10"},"curies":[]},"_id":"Benedetto10","_created_on":"2016-01-08T11:21:18Z","_etag":{"$oid":"568f9bae0a975a2d4a6204e3"},"_collection-props-cached":false,"_returned":80,"_embedded":{
       //Data wurde hier raus genommen
      }},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"url":"https://pegenau.com:16392/prelife/Benedetto10","headers":{"Accept":"application/json, text/plain, */*","Authorization":"Basic YTph"}},"statusText":"OK"};
      
      expect($scope.getIdOfCollection(object)).toBe("Benedetto10");
  });
  
  it('Sollte den Link richtig erstellen', function() {
      expect($scope.getMyLink("123456")).toBe("#/data/preview/123456");
  });
  
});
