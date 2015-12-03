'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:ViewsCtrl
 * @description
 * # ViewsCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('ViewsCtrl', function ($scope, $route, $routeParams, $log, $http) {
    View.prototype.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.collID = null;
    $scope.views = null;
    $scope.numberOfViews = null;

    var username = "a";
    var password = "a";
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    $scope.getViews = function () {
      getViews(database, collection, username, password, $http, function (response) {
        $scope.views = response.data._embedded['rh:doc'];
        $scope.numberOfViews = $scope.views.length;
      });
    }

    // Initialization
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }
    
    
    
    /*
    function View() { }
    View.prototype.name = "Neue Ansicht";
    View.prototype.collID = $scope.collID;
    View.prototype.creator = username;
    View.prototype.timeOfCreation = Date.now();
    View.prototype.lastModifiedBy = null;
    View.prototype.timeOfLastModification = View.prototype.timeOfCreation;
    View.prototype.dimensions = {
      hoehe: null,
      flaeche: null,
      farbe: null,
      district: null
    };
    */

    function View() {
      this.name = "Neue Ansicht";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = null;
      this.timeOfLastModification = View.prototype.timeOfCreation;
      this.dimensions = {
        hoehe: null,
        flaeche: null,
        farbe: null,
        district: null
      }
    }

    $scope.newView = function (collID) {

      var newView = new View();
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
      });
    };
  });
