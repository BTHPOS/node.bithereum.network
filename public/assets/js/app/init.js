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
      .when("/faq", {
          templateUrl : "/views/pages/page-faq.html"
      })
      .when("/ourteam", {
          templateUrl : "/views/pages/page-ourteam.html"
      })
      .when("/richlist", {
          templateUrl : "/views/pages/page-richlist.html"
      })
      .when("/resources", {
          templateUrl : "/views/pages/page-resources.html"
      })
      .when("/shirts", {
          templateUrl : "/views/pages/page-shirts.html"
      })
      .when("/address-converter", {
          templateUrl : "/views/pages/page-addressconverter.html"
      })
      .when("/key-converter", {
          templateUrl : "/views/pages/page-keyconverter.html"
      })
}])

.run(['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", function() {
        $anchorScroll();
    });
}]);
