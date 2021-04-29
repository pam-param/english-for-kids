import {
  PAGES, PAGES_NAMES, CARD_TYPE,
} from '../constants';
import ModeButton from './ModeButton';
import Card from './Card';
import cards from '../data/cards';
import BurgerMenu from './BurgerMenu';
import AudioNotifier from './AudioNotifier';
import GameResult from './GameResult';
import { getRandomInteger, createElement } from '../helpers';

const START_GAME_COMAND = 'Start game';

class Application {
  constructor() {
    this.isPlay = false;
    this.isPlayStarted = false;
    this.currentPage = PAGES.Main;

    this.cards = [];
    this.playCards = [];
    this.errorCount = 0;

    this.mainContainer = document.querySelector('.main-container');
    this.controlGameButton = document.querySelector('.control-game-button');
    this.score = document.querySelector('.score');

    this.initComponents();
  }

  initComponents() {
    this.modeButton = new ModeButton();
    document.addEventListener('changeMode', this.handleChangeMode);

    this.burgerMenu = new BurgerMenu();
    document.addEventListener('openPage', this.openPage);

    this.createCards();

    this.controlGameButton.hidden = !this.isPlay;
    this.controlGameButton.addEventListener('click', this.controlGame);

    this.audioNotifier = new AudioNotifier();

    document.addEventListener('chooseCard', this.chooseCard);

    this.gameResult = new GameResult();
  }

  static init() {
    const application = new Application();
  }

  handleChangeMode = (e) => {
    this.isPlay = e.detail.isPlay;
    this.cards.forEach((card) => card.changeMode());
    this.burgerMenu.changeMode();
    this.updateControlGameButton();
    this.isPlayStarted = false;
    this.clearScore();
    this.errorCount = 0;
  }

  createCards() {
    const cardType = CARD_TYPE.Category;
    const cardNames = cards[0];
    const cardImages = cards.slice(1).map((item) => item[0].image);

    this.cards = cardNames.map((cardName, index) => new Card(
      cardType,
      cardName,
      cardImages[index],
    ));

    const cardElements = this.cards.map((card) => card.getCardElement());
    this.mainContainer.append(...cardElements);
  }

  chooseCategory(e) {
    const category = e.detail.name;
    this.currentPage = Object.values(PAGES_NAMES).indexOf(category);
    const categoryItems = cards[this.currentPage];
    const cardType = CARD_TYPE.Word;

    this.cards.forEach((card, i) => {
      card.updateCard(
        cardType,
        categoryItems[i].word,
        categoryItems[i].image,
        categoryItems[i].translation,
        categoryItems[i].audioSrc,
      );
    });
  }

  openPage = (e) => {
    const { name } = e.detail;

    if (name === PAGES_NAMES.Main) {
      this.currentPage = PAGES.Main;

      const cardType = CARD_TYPE.Category;
      const cardNames = cards[0];
      const cardImages = cards.slice(1).map((item) => item[0].image);

      this.cards.forEach((card, i) => {
        card.updateCard(cardType, cardNames[i], cardImages[i]);
      });
    } else {
      this.chooseCategory(e);

      if (this.isPlay) {
        this.generateWords();
      }
    }

    this.burgerMenu.setActivePage(this.currentPage);
    this.updateControlGameButton();
    this.isPlayStarted = false;
    this.clearScore();
    this.errorCount = 0;
  }

  updateControlGameButton() {
    this.controlGameButton.innerText = START_GAME_COMAND;
    if (this.currentPage === PAGES.Main) {
      this.controlGameButton.hidden = true;
      return;
    }

    this.controlGameButton.hidden = !this.isPlay;
    this.controlGameButton.classList.remove('started');
  }

  controlGame = () => {
    if (this.isPlayStarted) {
      this.sayWord();
    } else {
      this.isPlayStarted = true;
      this.controlGameButton.classList.add('started');
      this.controlGameButton.innerText = '';
      this.generateWords();
      this.sayWord();
    }
  }

  generateWords() {
    this.playCards = [];
    const availableCards = this.cards.slice();

    while (availableCards.length > 0) {
      const index = getRandomInteger(0, availableCards.length - 1);
      this.playCards.push(availableCards[index]);
      availableCards.splice(index, 1);
    }
  }

  sayWord() {
    this.playCards[this.playCards.length - 1].playAudio();
  }

  chooseCard = (e) => {
    if (!this.isPlayStarted) {
      return;
    }

    const chosenCard = e.detail.card;
    const result = (chosenCard === this.playCards[this.playCards.length - 1]);
    this.updateScore(result);

    if (!result) {
      this.audioNotifier.error();
      this.errorCount += 1;
      return;
    }

    this.isPlayStarted = false;
    this.audioNotifier.correct();
    this.playCards.pop().setDisable();

    if (this.playCards.length > 0) {
      setTimeout(() => {
        this.sayWord();
        this.isPlayStarted = true;
      }, 1000);
      return;
    }

    this.finishGame(result);
  }

  finishGame() {
    this.cards.forEach((card) => card.setActive());
    this.clearScore();

    if (this.errorCount === 0) {
      this.audioNotifier.success();
    } else {
      this.audioNotifier.failure();
    }

    this.gameResult.open(this.errorCount);

    const event = new CustomEvent('openPage', {
      detail: { name: PAGES_NAMES.Main },
    });
    document.dispatchEvent(event);

    this.errorCount = 0;
  }

  updateScore(result) {
    const typeStar = result ? 'correct' : 'error';
    const star = createElement({ tag: 'div', classes: ['star', typeStar] });
    this.score.append(star);
  }

  clearScore() {
    const stars = this.score.querySelectorAll('.star');
    stars.forEach((star) => star.remove());
  }
}

export default Application;
