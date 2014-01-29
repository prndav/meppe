    angular.module('mapApp', ['ngAnimate', 'ngRoute', 'ui.state', 'controllers', 'services', 'directives'])
    .value('NEW_TODO_ID', -1)
    .config(['$stateProvider', '$routeProvider', '$urlRouterProvider', '$httpProvider',
            function ($stateProvider, $routeProvider, $urlRouterProvider, $httpProvider) {
              $stateProvider.
              state('home', {
                url:'/',
                templateUrl: 'views/home.html/',
                controller: 'HomeCtrl'
              }).
              state('editMeppe', {
                url: '/meppe/:mapId',
                templateUrl: 'views/meppe.html',
                controller: 'EditTodoCtrl'
              }).
              state('manageMeppes', {
                url: '/manageMeppes',
                templateUrl: 'views/manageMeppes.html',
                controller: 'ManageMeppesCtrl'
              }).
              state('manageCategories', {
                url: '/manageCategories',
                templateUrl: 'views/manageCategories.html',
                controller: 'ManageCategoriesCtrl'
              }).
              state('manageCategories.category', {
                url: '/:category',
                templateUrl: 'views/manageCategories.category.html',
                controller: 'ManageCategoryCtrl' //function($scope, $stateParams) {
              }).
              state('category', {
                url: '/:category',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
              });

              $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

      }])


