import './css/styles.css';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputEl: document.querySelector('#search-box'),
    listCountriesEl: document.querySelector('.country-list'),
    cardCountryEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

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