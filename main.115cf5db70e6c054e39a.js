(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"0HMw":function(t,e,n){},QfWi:function(t,e,n){"use strict";n.r(e);n("JBxO"),n("FdtR"),n("0HMw"),n("JauC");var r=n("QJ3N");r.defaults.styling="material",r.defaults.icons="material",document.querySelector(".search-form__input").addEventListener("input",(function(t){var e=t.target.value;if(0===e.length)return;(function(t){return fetch("https://restcountries.eu/rest/v2/name/"+t,{method:"GET",headers:{Accept:"application/json"}}).then((function(t){if(t.ok)return t.json();throw new Error("Error fetching data")}))})(e).then((function(t){t.length>10&&Object(r.error)({text:"To many matches found. Please enter more specific query"})})).catch((function(t){Object(r.error)({text:""+t})}))}))}},[["QfWi",1,2]]]);
//# sourceMappingURL=main.115cf5db70e6c054e39a.js.map