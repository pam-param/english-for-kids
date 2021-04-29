const GAME_RESULTS = {
  Failure: {
    image: 'images/failure.jpg',
    message: 'Failure!',
  },
  Success: {
    image: 'images/success.jpg',
    message: 'Success!',
  },
};

class GameResult {
  constructor() {
    this.resultElement = document.querySelector('.game-result');
    this.messageElement = document.querySelector('.game-result-message');
    this.imageElement = document.querySelector('.game-result-image');
    this.close();
  }

  open(errorCount = 0) {
    this.init(errorCount);
    this.resultElement.classList.remove('closed');

    setTimeout(() => {
      this.close();
    }, 2000);
  }

  close() {
    this.resultElement.classList.add('closed');
  }

  init(errorCount) {
    if (errorCount) {
      this.messageElement.innerText = `${GAME_RESULTS.Failure.message} ${errorCount} errors!`;
      this.imageElement.src = GAME_RESULTS.Failure.image;
    } else {
      this.messageElement.innerText = GAME_RESULTS.Success.message;
      this.imageElement.src = GAME_RESULTS.Success.image;
    }
  }
}

export default GameResult;
