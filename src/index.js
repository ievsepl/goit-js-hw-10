import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
  DEBOUNCE_DELAY: 300,
};

refs.input.addEventListener('input', debounce(onInputCountry, 500));
refs.countryList.addEventListener('click', onCountryClick);

function onInputCountry(e) {
  e.preventDefault();
  let inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearAll();
    return;
  } else {
    renderCountriesData(inputValue);
  }
}

function renderCountriesData(inputCountryName) {
  fetchCountries(inputCountryName)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearAll();
      } else if (countries.length <= 10 && countries.length >= 2) {
        renderUserList(countries);
        refs.countryCard.innerHTML = '';
      } else {
        renderCountryCard(countries);
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
      clearAll();
    });
}

function renderUserList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <p s><b><img src = "${country.flags.svg}" alt="Flag" width = "40px"/></b> ${country.name.official}</p>    
            </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
  const markup = countries
    .map(country => {
      return `<p><b><img src = "${
        country.flags.svg
      }" alt="Flag" width = "30px"/></b> ${country.name.official}</p>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>population</b>: ${country.population}</p>
              <p><b>languages</b>: ${Object.values(country.languages)}</p> `;
    })
    .join('');
  refs.countryCard.innerHTML = markup;
}

function onCountryClick(e) {
  if (e.target) {
    console.log(e.target.textContent);
    let putCountry = e.target.textContent.trim();
    renderCountriesData(putCountry);
  }
}

function clearAll() {
  refs.countryCard.innerHTML = '';
  refs.countryList.innerHTML = '';
}
