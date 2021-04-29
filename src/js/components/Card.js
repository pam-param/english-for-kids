import { createElement } from '../helpers';
import { CARD_TYPE } from '../constants';

class Card {
  constructor(type, name, image, translation = '', audioSource = '') {
    this.setProperties(type, name, image, translation, audioSource);
    this.isRotated = false;
    this.isPlay = false;
    this.isActive = true;
    this.initElements();
  }

  setProperties(type, name, image, translation = '', audioSource = '') {
    this.type = type;
    this.name = name;
    this.image = image;
    this.translation = translation;
    this.audioSource = audioSource;
  }

  initElements() {
    this.cardWrapper = createElement({ tag: 'div', classes: ['card-wrapper'] });
    this.cardContainerElement = createElement({ tag: 'div', classes: ['card-container'] });
    this.cardWrapper.append(this.cardContainerElement);

    this.frontCardElement = createElement({ tag: 'div', classes: ['card', 'interactive-card'] });
    this.backCardElement = createElement({ tag: 'div', classes: ['card', 'back-card'] });
    this.cardContainerElement.append(this.frontCardElement, this.backCardElement);

    this.frontImageElement = createElement(
      {
        tag: 'img',
        classes: ['card-image'],
        attributes: {
          src: this.image,
          alt: this.name,
        },
      },
    );
    this.contentElement = createElement({ tag: 'div', classes: ['card-content'] });
    this.audioElement = createElement({ tag: 'audio', attributes: { src: this.audioSource } });
    this.frontCardElement.append(this.frontImageElement, this.contentElement, this.audioElement);

    this.nameElement = createElement(
      {
        tag: 'p',
        classes: ['card-name'],
        innerText: this.name,
      },
    );
    this.contentElement.append(this.nameElement);

    this.backImageElement = createElement(
      {
        tag: 'img',
        classes: ['card-image'],
        attributes: {
          src: this.image,
          alt: this.name,
        },
      },
    );
    const backContentElement = createElement({ tag: 'div', classes: ['card-content'] });
    this.backCardElement.append(this.backImageElement, backContentElement);

    this.translationElement = createElement(
      {
        tag: 'p',
        classes: ['card-name'],
        innerText: this.translation,
      },
    );
    backContentElement.append(this.translationElement);

    this.buttonElement = createElement({ tag: 'button', classes: ['card-button'] });
    this.frontCardElement.append(this.buttonElement);
    this.buttonElement.hidden = true;

    this.frontCardElement.addEventListener('click', this.handleClick);
    this.buttonElement.addEventListener('click', this.rotateCard);

    this.cardContainerElement.addEventListener('mouseleave', () => {
      if (this.isRotated && !this.isPlay) {
        this.rotateCard();
      }
    });
  }

  updateElements() {
    this.frontImageElement.classList.toggle('play-mode', this.isPlay);

    if (this.type === CARD_TYPE.Word) {
      this.nameElement.hidden = this.isPlay;
      this.buttonElement.hidden = this.isPlay;
      this.contentElement.hidden = this.isPlay;

      this.frontImageElement.classList.toggle('play-image', this.isPlay);
    } else {
      this.nameElement.hidden = false;
      this.buttonElement.hidden = true;
      this.contentElement.hidden = false;

      this.frontImageElement.classList.remove('play-image');
    }

    this.setActive();
  }

  updateCard(...args) {
    this.setProperties(...args);

    this.frontImageElement.src = this.image;
    this.frontImageElement.alt = this.name;
    this.nameElement.innerText = this.name;
    this.audioElement.src = this.audioSource;

    this.backImageElement.src = this.image;
    this.backImageElement.alt = this.name;
    this.translationElement.innerText = this.translation;

    this.updateElements();
  }

  getCardElement() {
    return this.cardWrapper;
  }

  handleClick = () => {
    if (!this.isActive) {
      return;
    }

    if (this.type === CARD_TYPE.Category) {
      this.openPage();
      return;
    }

    if (!this.isPlay) {
      this.playAudio();
      return;
    }

    const event = new CustomEvent('chooseCard', {
      detail: { card: this },
    });

    document.dispatchEvent(event);
  }

  openPage() {
    const event = new CustomEvent('openPage', {
      detail: { name: this.name },
    });

    document.dispatchEvent(event);
  }

  playAudio() {
    this.audioElement.currentTime = 0;
    this.audioElement.play();
  }

  rotateCard = () => {
    this.isRotated = !this.isRotated;
    this.cardContainerElement.classList.toggle('rotated');
  }

  changeMode() {
    this.isPlay = !this.isPlay;
    this.updateElements();
  }

  setDisable() {
    this.isActive = false;
    this.frontCardElement.classList.add('disabled');
  }

  setActive() {
    this.isActive = true;
    this.frontCardElement.classList.remove('disabled');
  }
}

export default Card;
