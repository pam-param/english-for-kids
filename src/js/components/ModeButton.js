import { MODES } from '../constants';

export default class ModeButton {
  constructor(isPlay = false) {
    this.isPlay = isPlay;
    this.modeButton = document.querySelector('.mode-button');
    this.slider = document.querySelector('.slider');

    this.initButton();
  }

  initButton() {
    this.modeButton.checked = this.isPlay;
    this.modeButton.addEventListener('change', this.changeMode);
  }

  changeMode = () => {
    this.isPlay = this.modeButton.checked;

    this.slider.innerText = this.isPlay ? MODES.Play : MODES.Train;

    const event = new CustomEvent('changeMode', {
      detail: { isPlay: this.isPlay },
    });

    document.dispatchEvent(event);
  }
}
