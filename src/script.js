import { filmsMock } from './filmsMock.js';

const ALL_FILMS = 'all_films';
const FAVOURITE_FILMS = 'favourite_films';

if (!fromStorage(ALL_FILMS) && !fromStorage(FAVOURITE_FILMS)) {
  toStorage(ALL_FILMS, filmsMock);
  toStorage(FAVOURITE_FILMS, []);
}

// ----------------------------------
const storageFilms = fromStorage(ALL_FILMS);
renderFilms(storageFilms, ALL_FILMS);

const favouriteBtn = document.querySelector('.film-cards-container__favourite-films');

favouriteBtn.addEventListener('click', () => handleFilmSwitch(favouriteBtn));

// _________________________

function toStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function fromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function renderFilms(listFilms, listType) {
  const favouriteBtnHTML = document.querySelector('.film-cards-container__favourite-films');

  favouriteBtnHTML.insertAdjacentHTML(
    'afterend',
    `<div id="${listType}" class="film-cards-container"></div>`,
  );

  const filmsContainer = document.querySelector('.film-cards-container');

  if (listFilms.length) {
    listFilms.forEach((film) => renderFilmCard(film, filmsContainer));
  } else {
    filmsContainer.innerHTML = '<div>List is empty</div>';
  }

  const likeBtns = document.querySelectorAll('.film-card__button');
  likeBtns.forEach((btn, i) =>
    btn.addEventListener('click', () => handleLikeClick(listFilms, listType, i)),
  );

  const filmsTitles = document.querySelectorAll('.film-card__title');
  filmsTitles.forEach((title, i) =>
    title.addEventListener('click', () => {
      const clickedFilm = listFilms[i];
      renderFilmModal(clickedFilm, filmsContainer);

      const closeModalBtn = document.querySelector('.close-modal');
      closeModalBtn.addEventListener(
        'click',
        () => {
          const modal = document.querySelector('.modal');
          modal.remove();
        },
        { once: true },
      );
    }),
  );
}

function renderFilmCard(film, targetContainer) {
  const { imgUrl, movieName, releaseYear, isFavourite } = film;

  const btnImg = isFavourite ? 'favourite.png' : 'notFavourite.png';

  targetContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="film-card">
        <img class="film-card__poster" src="${imgUrl}">
        <div class="film-card__title">${movieName}</div>
        <div class="film-card__year">${releaseYear}</div>
        <button class="film-card__button">
          <img class="film-card__button-img" src="./assets/img/${btnImg}">
        </button>
      </div>`,
  );
}

function handleLikeClick(listFilms, listType, i) {
  listFilms[i].isFavourite = !listFilms[i].isFavourite;

  const sortededFilms = sortByIsFavourite(listFilms);
  const sortededFavouriteFilms = sortFavouriteFilms(sortededFilms);

  const filmsListContainer = document.querySelector('.film-cards-container');

  switch (listType) {
    case ALL_FILMS:
      toStorage(ALL_FILMS, sortededFilms);
      toStorage(FAVOURITE_FILMS, sortededFavouriteFilms);
      filmsListContainer.remove();
      renderFilms(sortededFilms, listType);
      break;

    case FAVOURITE_FILMS:
      const newAllFilms = fromStorage(ALL_FILMS);
      newAllFilms[i].isFavourite = !newAllFilms[i].isFavourite;
      toStorage(ALL_FILMS, sortByIsFavourite(newAllFilms));
      toStorage(FAVOURITE_FILMS, sortededFavouriteFilms);
      filmsListContainer.remove();
      renderFilms(sortededFavouriteFilms, listType);
      break;
  }
}

function sortByIsFavourite(films) {
  return films.sort((a, b) => (a.id = b.id)).sort((a) => (a.isFavourite ? -1 : 1));
}

function sortFavouriteFilms(films) {
  return films.filter((film) => film.isFavourite).sort((a, b) => a.id - b.id);
}

function handleFilmSwitch(switchBtn) {
  const filmsContainer = document.querySelector('.film-cards-container');

  const filmsContainerTitle = document.querySelector('.film-cards-container__title');

  switch (filmsContainer.id) {
    case ALL_FILMS:
      filmsContainer.remove();
      switchBtn.innerHTML = 'See All Films';
      filmsContainerTitle.innerHTML = 'Favourite Films';
      renderFilms(fromStorage(FAVOURITE_FILMS), FAVOURITE_FILMS);
      break;

    case FAVOURITE_FILMS:
      filmsContainer.remove();
      switchBtn.innerHTML = 'See Favourite Films';
      filmsContainerTitle.innerHTML = 'All Films';
      renderFilms(fromStorage(ALL_FILMS), ALL_FILMS);
      break;
  }
}

function renderFilmModal(clickedFilm, targetContainer) {
  const { imgUrl, movieName, releaseYear, isFavourite, description } = clickedFilm;

  const btnImg = isFavourite ? 'favourite.png' : 'notFavourite.png';
  targetContainer.insertAdjacentHTML(
    'afterend',
    `
  <div class="modal">
    <div class="modal-content">
    <div class="close-modal">
      <img class="close-modal-icon" src="./assets/img/cross.png">
    </div>

    <img class="film-card__poster" src="${imgUrl}">
    <div class="film-card__title">${movieName}</div>
    <div class="film-card__year">${releaseYear}</div>
    <div class="film-card__description">${description}</div>
    <button class="film-card__button">
      <img class="film-card__button-img" src="./assets/img/${btnImg}">
    </button>
    </div>
  </div>
  `,
  );
}
