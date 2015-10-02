'use strict';

keyboardRaceApp.controller('GameCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  return new GameCtrl($scope, $rootScope);
}]);

class GameCtrl {
  constructor($scope, $rootScope) {
    let me = this;
    this.io = $rootScope.io;
    this.currentPosition = 0;
    this.io.on('startGame', function(data) {
      me.numberOfWords = data.numberOfWords;
      $scope.$apply();
      console.log(data);
    });
    this.io.on('updateStatus', function(data) {
      console.log(data);
    });
  }
  findOpponents() {
    this.io.emit('findOpponents', {
      numberOfOpponents: 1
    });
  }
  sendMessage() {
    this.io.emit('updateStatus', {
      qwe: 'qwe'
    });
  }
}