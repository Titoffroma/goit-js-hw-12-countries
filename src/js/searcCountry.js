import createCountryList from '../templates/CountryList.hbs';
import createResultList from '../templates/ResultList.hbs';
import { error } from '@pnotify/core';
var debounce = require('lodash.debounce');

const countryInputRef = document.querySelector('.search-form__input');
const resultRef = document.querySelector('.result');
countryInputRef.addEventListener('input', debounce(createData, 500));

const getRestData = function (countryName) {
  resultRef.textContent = 'SEARCHING...  ' + countryName;
  resultRef.classList.add('anim');
  return fetch(`https://restcountries.eu/rest/v2/name/${countryName}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(response => {
    if (response.ok) return response.json();
    throw new Error('Error fetching data');
  });
};

function createData(event) {
  console.log('hi');
  const countryName = event.target.value;
  removeError();

  if (countryName.length === 0) return;

  getRestData(countryName)
    .then(operateData)
    .catch(err => {
      error({
        text: `${err}`,
        type: 'error',
      });
    });
}

function operateData(data) {
  resultRef.textContent = '';
  resultRef.classList.remove('anim');
  removeError();
  console.log(data);
  if (data.length > 10) {
    error({
      text: 'To many matches found. Please enter more specific query',
    });
    return;
  }

  if (data.length === 1) {
    resultRef.innerHTML = createResultList(data);
    return;
  }

  if (data.length > 1) {
    resultRef.innerHTML = createCountryList(data);
    const listRef = document.querySelector('.country-list');
    listRef.addEventListener(
      'click',
      event => {
        countryInputRef.value = event.target.textContent;
        getRestData(event.target.textContent)
          .then(operateData)
          .catch(err => {
            error({
              text: `${err}`,
              type: 'error',
            });
          });
      },
      { once: true },
    );
  }
}

function removeError() {
  const errorRef = document.querySelector('.error');
  if (errorRef) errorRef.remove();
}
