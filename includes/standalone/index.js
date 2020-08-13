import { CraterApp } from './utils/CraterApp.js';
window.craterApp = new CraterApp();

document.addEventListener('DOMContentLoaded', event => {    
    craterApp.render({container: document});
});