import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputEl: document.querySelector('#search-box'),
    listCountriesEl: document.querySelector('.country-list'),
    cardCountryEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', onInput);

const BASE_URL = 'https://restcountries.com/v3.1/name';
const FILTERS = 'fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/${name}?&${FILTERS}`).then(response => {
    if (!response.ok) {
      Notify.failure('Oops, there is no country with that name');
    }
    return response.json();
  });
};

function createItemsMarkup(result) {
  return result
    .map(
      ({ name, flags }) =>
        `<li class="country-item">
        <img src="${flags.svg}" alt="${name.official}" class="country-flag" />
        <p class="country-name">${name.official}</p>
      </li>`
    )
    .join('');
};

function renderListMarkup(result) {
  refs.listCountriesEl.innerHTML = createItemsMarkup(result);
};

function createInfoMarkup(result) {
  return result.map(
    ({ capital, population, languages }) => 
      `<ul class="country-info__list">
        <li class="country-info__list">Capital:&nbsp${capital}</li>
        <li class="country-info__list">Population:&nbsp${population}</li>
        <li class="country-info__list">Languages:&nbsp${Object.values(
          languages
        )}</li>
      </ul>`
  );
};

function renderCardMarkup(result) {
  renderListMarkup(result);
  refs.cardCountryEl.innerHTML = createInfoMarkup(result);
};

function clear() {
  refs.cardCountryEl.innerHTML = '';
  refs.listCountriesEl.innerHTML = '';
};

function onInput(evt) {
  let name = evt.target.value.trim();
  if (name === '') {
    clear();
  } else {
    fetchCountries(name).then(onCheck).catch(onError);
    };
};

function onCheck(result) {
  if (result.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (result.length === 1) {
    clear();
    renderCardMarkup(result);
  } else {
    clear();
    renderListMarkup(result);
    };
};

function onError(error) {
  clear();
  Notify.failure('Oops, something is wrong');
};