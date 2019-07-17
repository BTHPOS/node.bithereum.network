'use strict';

angular.module('Application', [
  'ngRoute',
  'Application.Controllers'
]).
config(['$locationProvider', '$interpolateProvider', '$routeProvider', function($locationProvider, $interpolateProvider, $routeProvider) {

    // URL prefix
    $locationProvider.hashPrefix('!');

    // Application routing
    $routeProvider
      .when("/", {
          templateUrl : "/views/pages/page-landing.html"
      })
}])

.run(['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", function() {
        $anchorScroll();
    });
}]);
