'use strict';

/**
 * @ngdoc overview
 * @name datacityApp
 * @description
 * # datacityApp
 *
 * Main module of the application.
 */
angular
  .module('datacityApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/datasets', {
        templateUrl: 'views/datasets.html',
        controller: 'DatasetsCtrl',
        controllerAs: 'datasets'
      })
      .when('/views', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/city', {
        templateUrl: 'views/city.html',
        controller: 'CityCtrl',
        controllerAs: 'city'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
