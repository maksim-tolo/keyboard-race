'use strict';

keyboardRaceApp.controller('HomeCtrl', ['$rootScope', '$state', function($rootScope, $state) {
  return new HomeCtrl($rootScope, $state);
}]);

//TODO: find opponents by pressing on Enter key
class HomeCtrl {
  constructor($rootScope, $state) {
    this.io = $rootScope.io;
    this.numberOfOpponents = 1;
    this.io.on('startGame', function(data) {
      $rootScope.gameData = data;
      $state.go('game');
    });
  }
  findOpponents() {
    this.io.emit('findOpponents', {
      numberOfOpponents: +this.numberOfOpponents,
      userName: this.userName
    });
    this.loading='indeterminate';
  }
}