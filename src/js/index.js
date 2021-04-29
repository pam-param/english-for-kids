import Application from './components/Application';
import { importAll } from './helpers';

const images = importAll(require.context('../', true, /\.(png|jpe?g)$/));
const audio = importAll(require.context('../', true, /\.mp3$/));

window.addEventListener('DOMContentLoaded', () => {
  Application.init();
});
