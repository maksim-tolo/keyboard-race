'use strict';

let keyboardRaceApp = angular
  .module('keyboardRaceApp', ['ngMaterial', 'ui.router', 'ui.ace'])
  .config(['$stateProvider', '$urlRouterProvider', Config])
  .run(['$rootScope', Run]);

function Config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "./js/pages/home/home.template.html",
      controller: "HomeCtrl",
      controllerAs: 'homeCtrl'
    })
    .state('game', {
      url: "/game",
      templateUrl: "./js/pages/game/game.template.html",
      controller: "GameCtrl",
      controllerAs: 'gameCtrl'
    });
}

function Run($rootScope) {
  $rootScope.io = io.connect('https://morning-plains-2106.herokuapp.com');
}