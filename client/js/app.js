'use strict';

class KeyboardRaceApp {
  constructor(angular) {
    return angular
      .module('keyboardRaceApp', ['ngMaterial', 'ui.router', 'ui.ace'])
      .config(['$stateProvider', '$urlRouterProvider', this.config])
      .run(['$rootScope', this.run]);
  }
  config($stateProvider, $urlRouterProvider) {
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
  run($rootScope) {
    $rootScope.io = io.connect('http://localhost:3000');

    //prevent returning to previous page by pressing backspace key
    angular.element(window.document).on('keydown', function(e) {
      const BACKSPACE_KEY_CODE = 8;

      if (e.keyCode === BACKSPACE_KEY_CODE && e.target === window.document.body) {
        e.preventDefault();
      }
    });
  }
}

let keyboardRaceApp = new KeyboardRaceApp(angular);
