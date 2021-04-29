import { createElement } from '../helpers';

const AUDIO_EVENTS = {
  Error: 'audio/error.mp3',
  Correct: 'audio/correct.mp3',
  Success: 'audio/success.mp3',
  Failure: 'audio/failure.mp3',
};

class AudioNotifier {
  constructor() {
    Object.keys(AUDIO_EVENTS).forEach((key) => {
      const event = key.toLocaleLowerCase();
      const audioElement = `${event}Element`;

      this[audioElement] = createElement(
        {
          tag: 'audio',
          attributes: {
            src: AUDIO_EVENTS[key],
          },
        },
      );

      this[event] = () => {
        this[audioElement].currentTime = 0;
        this[audioElement].play();
      };
    });
  }

  playSound(name) {
    this[name].currentTime = 0;
    this[name].play();
  }
}

export default AudioNotifier;
