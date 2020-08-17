import { Kerdx, Database } from 'https://kade-95.github.io/kerdx/index.js';
window.kerdx = new Kerdx();
window.db = Database('crater');
import { CraterApp } from './utils/CraterApp.js';
window.craterApp = new CraterApp();
let craterDetails;

function switchCraterMode(event) {
    let mode = this.dataset.mode;
    craterApp.switchMode(mode);

    mode = mode == 'Edit' ? 'Preview' : 'Edit'
    this.dataset.mode = mode;
    this.textContent = mode;
}

function init() {
    try {
        craterDetails = JSON.parse(localStorage.craterApp);
    } catch (error) {
        craterDetails = { mode: 'Preview' };
    }
    let mode = craterDetails.mode == 'Edit' ? 'Preview' : 'Edit';

    let header = document.body.makeElement({
        element: 'header', attributes: { id: 'crater-header' }, children: [
            { element: 'a', attributes: { class: 'btn btn-small', id: 'switch-mode', 'data-mode': mode }, text: mode },
            { element: 'a', attributes: { class: 'btn btn-small', id: 'republish', }, text: 'Republish' }
        ]
    });

    let main = document.body.makeElement({
        element: 'main', attributes: { id: 'crater-window' }, children: [

        ]
    });

    header.find('#switch-mode').addEventListener('click', switchCraterMode);
    header.find('#republish').addEventListener('click', event=>{
        craterApp.republish();
    });
}

document.addEventListener('DOMContentLoaded', event=>{
    let url = kerdx.urlSplitter(location.href);
    document.body.dataset.user = url.vars.user;
    init();
    craterApp.render({ container: { body: document.body.find('#crater-window'), head: document.head }, user: document.body.dataset.user});
});