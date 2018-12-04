// Promise polyfill.
import Promise from 'promise-polyfill';
window.Promise = Promise

// Fetch polyfill, needs Promise to work.
// import 'whatwg-fetch'