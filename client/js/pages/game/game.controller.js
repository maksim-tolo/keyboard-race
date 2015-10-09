'use strict';

keyboardRaceApp.controller('GameCtrl', ['$rootScope', '$state', '$sce', function($rootScope, $state, $sce) {
  return new GameCtrl($rootScope, $state, $sce);
}]);

class GameCtrl {
  constructor($rootScope, $state, $sce) {
    this.$sce = $sce;
    this.$rootScope = $rootScope;
    this.currentPosition = 0;
    this.io = $rootScope.io;
    if ($rootScope.gameData) {
      this.words = $rootScope.gameData.words;
      this.text = this.getText(this.currentPosition);
      this.numberOfWords = $rootScope.gameData.numberOfWords;
      this.opponents = $rootScope.gameData.opponents;
      this.io.on('updateStatus', this.updateOpponentsStatus.bind(this));
    } else {
      $state.go('home');
    }
  }
  updateStatus() {
    this.io.emit('updateStatus', {
      position: this.currentPosition
    });
  }
  updateOpponentsStatus(data) {
    for (let i = 0; i < this.opponents.length; i++) {
      if (this.opponents[i].userId === data.userId) {
        this.opponents[i].position = data.position;
        this.$rootScope.$apply();
        return;
      }
    }
  }
  compareWords(e) {
    const SPACE_KEY_CODE = 32;

    if (e.keyCode === SPACE_KEY_CODE) {
      if (this.userInput === this.words[this.currentPosition]) {
        this.currentPosition++;
        this.updateStatus();
        this.userInput = '';
        this.text = this.getText(this.currentPosition);
      }
    }
  }
  getText(currentPosition) {
    let text = '';

    this.words.forEach(function(word, index) {
      if (index === currentPosition) {
        text += '<span class="highlightedText">' + word + '</span> ';
      } else {
        text += (word + ' ');
      }
    });
    return this.$sce.trustAsHtml(text);
  };
}