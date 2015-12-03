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
    $scope.collection = null;
    $scope.attributesOfCollection = null;

    var username = "a";
    var password = "a";
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    $scope.getViews = function (func) {
      getViews(database, collection, username, password, $http, function (response) {
        $scope.views = response.data._embedded['rh:doc'];
        if ($scope.views && $scope.views.length) {
          $scope.numberOfViews = $scope.views.length;
          if (func) {
            func($scope.views);
          }
        }
      });
    }

    $scope.updateView = function () {
      updateView($scope.chosenView, username, password, $http, function (response) {
        var id = $scope.chosenView._id;
        $scope.chosenView = null;
        $scope.getViews(function (views) {
          for (var arrayIndex in views) {
            $log.info(views[arrayIndex]);
            if (views[arrayIndex]._id === id) {
              $scope.setChosenView(views[arrayIndex]);
            }
          }
        });
      });
    }

    $scope.setChosenView = function (view) {
      if ($scope.chosenView === view) {
        $scope.chosenView = null;
        $scope.collection = null;
        $scope.attributesOfCollection = null;
      } else {
        $scope.chosenView = view;
        getCollection("prelife", $scope.chosenView.collID, username, password, $http, function (resp) {
          $scope.collection = resp;
          $log.info($scope.collection);

          var firstDocument = $scope.collection.data._embedded['rh:doc'][0];
          var attrs = [];
          for (var key in firstDocument) {
            if (!key.startsWith('_', 0)) {
              attrs.push(key);
            }
          }
          $scope.attributesOfCollection = attrs;
          $log.info(attrs);
        });

      }
      $log.info($scope.chosenView);
    }

    // Initialization
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }

    $scope.deleteView = function (view) {
      deleteView(view, username, password, $http, function (response) {
        console.log(response);
        $scope.getViews();
      });
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
