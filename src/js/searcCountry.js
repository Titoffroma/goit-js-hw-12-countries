import createCountryList from '../templates/CountryList.hbs';
import createResultList from '../templates/ResultList.hbs';
import { error } from '@pnotify/core';
var debounce = require('lodash.debounce');

const countryInputRef = document.querySelector('.search-form__input');
const resultRef = document.querySelector('.result');
const countryAPItoFetch = 'https://restcountries.eu/rest/v2/name/';
const fullName = '?fullText=true';
let countryNameAPItoFetch;

function getRestData(countryName, full = false) {
  resultRef.textContent = 'SEARCHING...  ' + countryName;
  resultRef.classList.add('anim');
  countryNameAPItoFetch = full
    ? countryAPItoFetch + countryName + fullName
    : countryAPItoFetch + countryName;
  return fetch(countryNameAPItoFetch, {
    headers: {
      Accept: 'application/json',
    },
  }).then(response => {
    if (response.ok) return response.json();
    if (response.status == 404) {
      return response.json();
    }
    throw new Error('Error fetching data');
  });
}

function createData(event) {
  removeError();
  const countryName = event.target.value;
  if (countryName.length === 0) return;
  fetchData(countryName);
}

function operateData(data) {
  clearResult();
  if (data.message) {
    error({
      text: data.message,
    });
    return;
  }
  if (data.length > 10) {
    pushError();
    return;
  }
  if (data.length === 1) {
    operateDataAtOnce(data);
    return;
  }
  if (data.length > 1) {
    enableResultListListner(data);
  }
}

function operateDataAtOnce(countryName) {
  clearResult();
  resultRef.innerHTML = createResultList(countryName);
}

function clearResult() {
  resultRef.textContent = '';
  resultRef.classList.remove('anim');
  removeError();
}

function removeError() {
  const errorRef = document.querySelector('.error');
  if (errorRef) errorRef.remove();
}

function pushError() {
  error({
    text: 'To many matches found. Please enter more specific query',
  });
}

function enableResultListListner(data) {
  resultRef.innerHTML = createCountryList(data);
  const listRef = document.querySelector('.country-list');
  listRef.addEventListener('click', resultListenToFetch, { once: true });
}

function resultListenToFetch(event) {
  countryInputRef.value = event.target.textContent;
  fetchDataAtOnce(countryInputRef.value);
}

function fetchData(countryName) {
  return getRestData(countryName)
    .then(operateData)
    .catch(err => {
      error({
        text: `${err}`,
        type: 'error',
      });
    });
}

function fetchDataAtOnce(countryName) {
  return getRestData(countryName, true)
    .then(operateDataAtOnce)
    .catch(err => {
      error({
        text: `${err}`,
        type: 'error',
      });
    });
}

countryInputRef.addEventListener('input', debounce(createData, 500));
