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
    'ngTouch',
    'angularSpinner',
    'ui.bootstrap-slider',
  ])
  .config(function ($routeProvider) {
      
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      /*
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
      */
      .when('/city', {
        templateUrl: 'views/city.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/views/', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/views/:collID', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/playground', {
        templateUrl: 'views/playground.html',
        controller: 'PlaygroundCtrl',
        controllerAs: 'playground'
      })
      .otherwise({
        redirectTo: '/data'
      });
  });
