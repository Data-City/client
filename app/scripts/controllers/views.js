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
    $scope.chosenView = null;

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

    $scope.setChosenView = function (view) {
      if ($scope.chosenView === view) {
        $scope.chosenView = null;
      } else {
        $scope.chosenView = view;
      }
      $log.info($scope.chosenView);
    }

    // Initialization
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }

    $scope.deleteView = function(view) {
      
    };

    function View() {
      this.name = "Neue Ansicht";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
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


    $scope.jstimeToFormatedTime = function (jstime) {
      var d = new Date(jstime);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }
  });
