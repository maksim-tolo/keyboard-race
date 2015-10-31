'use strict';

keyboardRaceApp.controller('GameCtrl', ['$rootScope', '$state', '$sce', '$mdDialog', function($rootScope, $state, $sce, $mdDialog) {
  return new GameCtrl($rootScope, $state, $sce, $mdDialog);
}]);

//TODO: add list of disconnected players
class GameCtrl {
  constructor($rootScope, $state, $sce, $mdDialog) {
    this.$sce = $sce;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.currentPosition = 0;
    this.io = $rootScope.io;
    this.results = [];
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
        if (this.opponents[i].position === this.numberOfWords) {
          this.results.push({
            userName: this.opponents[i].userName
          });
        }
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
        if (this.currentPosition === this.numberOfWords) {
          this.results.push({
            userName: 'You'
          });
          this.showEndGamePopup(this.results.length);
        }
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
        text += '<span class="highlighted-text">' + word + '</span> ';
      } else {
        text += (word + ' ');
      }
    });
    return this.$sce.trustAsHtml(text);
  }
  showEndGamePopup(position) {
    let confirm = this.$mdDialog.confirm()
      .title('Game over')
      .content('You position is ' + position)
      .ok('Find new game')
      .cancel('See results');
    this.$mdDialog.show(confirm).then(this.endGame.bind(this));
  }
  endGame() {
    this.io.emit('endGame');
    this.$state.go('home');
  }
}