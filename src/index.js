import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

//
// import { templateFunction } from './templates/country-list.hbs';
// console.log(Handlebars.VERSION);

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),

  DEBOUNCE_DELAY: 300,
};
let nameValue = '';

refs.input.addEventListener(
  'input',
  debounce(onInputFunc, refs.DEBOUNCE_DELAY)
);
refs.countryList.addEventListener('click', onCountryListClick);

function onCountryListClick(e) {
  if (e.target) {
    nameValue = e.target.childNodes[1].data;
    return;
  }
  console.dir(e.target.childNodes[1].data);
  console.log(nameValue);
}

function onInputFunc(e) {
  e.preventDefault();
  nameValue = refs.input.value.trim();

  fetchCountries(nameValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryList.innerHTML = '';

        return;
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderUserList(countries);
      } else {
        renderCountryCard(countries);
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
      refs.countryCard.innerHTML = '';
      refs.countryList.innerHTML = '';
    });
}

// console.log('name', nameValue);

function renderUserList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <p><b><img src = "${country.flags.svg}" alt="Flag" width = "30px"/></b> ${country.name.official}</p>    
            </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
  refs.countryCard.innerHTML = '';
}

function renderCountryCard(countries) {
  const markup = countries
    .map(country => {
      return `<p><b><img src = "${
        country.flags.svg
      }" alt="Flag" width = "30px"/></b> ${country.name.official}</p>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>population</b>: ${country.population}</p>
              <p><b>languages</b>: ${Object.values(country.languages)}</p>

            </li>`;
    })
    .join('');
  refs.countryCard.innerHTML = markup;
  refs.countryList.innerHTML = '';
}

// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов
// Notify.failure('Qui timide rogat docet negare');
// Notify.info('Cogito ergo sum');
// Notify.warning('Memento te hominem esse');
// Notify.success('Sol lucet omnibus');
