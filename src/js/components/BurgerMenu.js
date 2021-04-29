import { PAGES, PAGES_NAMES, PAGES_EMODJI } from '../constants';
import { createElement } from '../helpers';

class BurgerMenu {
  constructor() {
    this.buttonElement = document.querySelector('.burger-button');
    this.menuItems = [];
    this.initElements();
  }

  initElements() {
    this.menuElement = createElement({ tag: 'nav', classes: ['burger-menu'] });
    document.body.append(this.menuElement);

    const list = createElement({ tag: 'ol', classes: ['burger-menu-list'] });
    this.menuElement.append(list);

    const keys = Object.keys(PAGES_NAMES);

    this.menuItems = keys.map((key) => {
      const menuItem = createElement(
        {
          tag: 'li',
          classes: ['burger-menu-item'],
          attributes: { 'data-name': PAGES_NAMES[key] },
        },
      );
      /*
      use innerHTML to insert emodji
      */
      menuItem.innerHTML = `${PAGES_EMODJI[key]} ${PAGES_NAMES[key]}`;
      menuItem.addEventListener('click', this.openPage);

      return menuItem;
    });

    list.append(...this.menuItems);

    this.activePage = PAGES.Main;
    this.setActivePage(this.activePage);

    this.overlayElement = createElement({ tag: 'div', classes: ['overlay'] });
    document.body.append(this.overlayElement);
    this.overlayElement.addEventListener('click', this.toggleMenu);

    this.buttonElement.addEventListener('click', this.toggleMenu);
  }

  toggleMenu = () => {
    this.buttonElement.classList.toggle('open');
    this.menuElement.classList.toggle('opened');
    this.overlayElement.classList.toggle('opened');
    document.body.classList.toggle('noscroll');
  }

  openPage = (e) => {
    this.toggleMenu();

    const event = new CustomEvent('openPage', {
      detail: { name: e.target.dataset.name },
    });

    document.dispatchEvent(event);
  }

  setActivePage(page) {
    if (page !== this.activePage) {
      this.menuItems[this.activePage].classList.remove('active');
      this.activePage = page;
    }

    this.menuItems[this.activePage].classList.add('active');
  }

  changeMode() {
    this.buttonElement.classList.toggle('play-mode');
  }
}

export default BurgerMenu;
