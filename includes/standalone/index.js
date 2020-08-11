import { App } from './App.js';
window.crater = new App();

document.addEventListener('DOMContentLoaded', event => {    
    crater.render();
});