// Promise polyfill.
import Promise from 'promise-polyfill';
window.Promise = Promise

// Object.assign()
import objectAssign from 'es6-object-assign'
objectAssign.polyfill()

// Fetch polyfill, needs Promise to work.
// import 'whatwg-fetch'