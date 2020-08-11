import { Perceptor } from '../Perceptors/front/index.js';
import { CraterUi } from './pages/CraterUi.js';

window.perceptor = new Perceptor();
window.system = {};
const craterUi = new CraterUi();
let viewSet = false;
window.log = console.log;

function setupView() {
    let view = {};
    view.primaryColor = 'rgb(255, 255, 255)';
    view.secondaryColor = 'rgb(0, 0, 0)';
    view.accientColor = 'rgb(64, 168, 45)';

    system.loadView(view);
    viewSet = true;
}

function route() {
    document.body.removeChildren({ except: ['#main-notifications', '#open-notifications'] });
    if (!viewSet) {
        setupView();
    }

    document.body.makeElement({
        element: 'header', attributes: { id: 'main-header' }
    });

    document.body.makeElement({
        element: 'main', attributes: { id: 'main-window' }
    });

    document.body.makeElement({
        element: 'footer', attributes: { id: 'main-footer' }
    });

    let { url, pathname } = location;
    if (!perceptor.isset(system.user) || system.user == 'undefined') {
        if (!(pathname == '/' || pathname == '/index.html')) {
            system.redirect('index.html');
        }
        else {
            display();
        }

    }
    else if (pathname == '/' || pathname == '/index.html') {
        if (system.user == 'undefined') {
            display();
        }
        else {
            system.redirect('dashboard.html');
        }
    }
    else if (pathname == '/aboutus.html') {

    }
    else {
        craterUi.init();
    }

    toggleNotifications();
}

function display() {
    let header = document.body.find('#main-header');
    document.body.cssRemove(['grid-template-rows']);
    header.cssRemove(['display']);
    setupView();
    header.makeElement([
        {
            element: 'a', attributes: { id: 'site-details', href: 'index.html' }, children: [
                { element: 'img', attributes: { id: 'site-logo', src: 'images/logo.png' } },
                { element: 'h5', attributes: { id: 'site-name' }, text: 'Crater' }
            ]
        },
        {
            element: 'nav', attributes: { id: 'big-nav' }, children: [
                { element: 'a', attributes: { href: 'index.html?page=login', class: 'get-started btn btn-medium' }, text: 'Sign In' }
            ]
        },
        {
            element: 'nav', attributes: { id: 'small-nav' }, children: [
                { element: 'span', attributes: { class: 'toggle toggle-open' } },
                {
                    element: 'div', attributes: { id: 'header-side-bar' }, children: [
                        { element: 'a', attributes: { href: 'aboutus.html', class: 'nav-link' }, text: 'About us' },
                        { element: 'a', attributes: { href: 'work.html', class: 'nav-link' }, text: 'Work' },
                        { element: 'a', attributes: { href: 'info.html', class: 'nav-link' }, text: 'Info' },
                        { element: 'a', attributes: { href: 'index.html?page=login', class: 'get-started btn btn-medium' }, text: 'Sign In' }
                    ]
                }
            ]
        }
    ]);

    header.find('.toggle').addEventListener('click', event => {
        event.target.classList.toggle('toggle-open');
        event.target.classList.toggle('toggle-close');
        if (!perceptor.isset(header.find('#header-side-bar').css().display)) {
            header.find('#header-side-bar').css({ display: 'grid' });
        }
        else {
            header.find('#header-side-bar').cssRemove(['display']);
        }
    });

    header.addEventListener('click', event => {
        if (event.target.classList.contains('get-started')) {
            login(document.body.find('#main-window-container'));
        }
    });

    let main = document.body.find('#main-window');
    main.makeElement({
        element: 'section', attributes: { id: 'landing' }, children: [
            {
                element: 'div', attributes: { id: 'main-window-container' }, children: [
                    {
                        element: 'div', attributes: { class: 'descriptive-link' }, children: [
                            { element: 'h5', attributes: { class: 'descriptive-link-title' }, html: 'Crater API' },
                            { element: 'p', attributes: { class: 'descriptive-link-text' }, text: '' },
                            { element: 'a', attributes: { class: 'btn btn-big' }, text: '' }
                        ]
                    },
                ]
            },
            {
                element: 'img', attributes: { id: 'main-banner', src: 'images/banner.png' }
            }
        ]
    });

    if (perceptor.urlSplitter(location).vars.page == 'login') {
        login(document.body.find('#main-window-container'));
    }
}

function login(container) {
    let loading = perceptor.createElement({ element: 'span', attributes: { class: 'loading loading-medium' } });

    let loginForm = perceptor.createForm({
        title: 'Login Form', attributes: { id: 'login-form', class: 'form' },
        contents: {
            email: { element: 'input', attributes: { id: 'email', name: 'email' } },
            password: {
                element: 'input', attributes: { id: 'current-password', name: 'currentPassword', type: 'password', autoComplete: true }
            }
        },
        buttons: {
            submit: { element: 'button', attributes: { id: 'submit' }, text: 'Submit', state: { name: 'submit', owner: '#login-form' } },
        }
    });

    container.render(loginForm);

    loginForm.getState({ name: 'submit' }).addEventListener('click', event => {
        event.preventDefault();
        loginForm.getState({ name: 'submit' }).replaceWith(loading);
        loginForm.setState({ name: 'error', attributes: { style: { display: 'none' } }, text: '' });

        if (!perceptor.validateForm(loginForm)) {
            loading.replaceWith(loginForm.getState({ name: 'submit' }));
            loginForm.setState({ name: 'error', attributes: { style: { display: 'unset' } }, text: 'Faulty form' });

            return;
        }

        loading.replaceWith(loginForm.getState({ name: 'submit' }));
        let data = perceptor.jsonForm(loginForm);
        data.action = 'login';

        system.connect({ data }).then(result => {
            let note;
            if (result == '404') {
                note = 'User not found';
            }
            else if (result == 'Incorrect') {
                note = 'Username or Password Incorrect';
            }
            else {
                system.user = result.user;
                system.userType = result.userType;
                setupView();
                system.redirect(craterUi.currentPage);
                note = 'Welcome back!!! ' + data.email;
            }

            system.notify({ note });
        });
    });
}

function toggleNotifications() {
    let openNotifications = document.body.find('#open-notifications');
    let closeNotifications = document.body.find('#close-notifications');
    let notificationsBlock = closeNotifications.parentNode;

    openNotifications.addEventListener('click', event => {
        notificationsBlock.css({ display: 'grid' });
    });

    closeNotifications.addEventListener('click', event => {
        notificationsBlock.cssRemove(['display']);
    });
}

system.smallScreen = window.matchMedia("(min-width: 700px)");
system.realSmallScreen = window.matchMedia("(min-width: 500px)");

system.redirect = url => {
    window.history.pushState('page', 'title', perceptor.api.prepareUrl(url));
    route();
}

system.reload = () => {
    system.redirect(location.href);
}

system.get = (params) => {
    let data = { params: JSON.stringify(params) };
    data.action = 'find';
    return system.connect({ data });
}

system.notify = (params) => {

    params.duration = params.duration || 10;

    let openNotifications = document.body.find('#open-notifications');
    let closeNotifications = document.body.find('#close-notifications');
    let notificationsBlock = closeNotifications.parentNode;

    openNotifications.click();

    let note = perceptor.createElement({
        element: 'span', attributes: { class: 'single-notification' }, children: [
            { element: 'p', attributes: { class: 'single-notification-text' }, text: params.note }
        ]
    });

    if (perceptor.isset(params.link)) {
        note.makeElement({ element: 'a', attributes: { href: params.link, class: 'fas fa-eye', title: 'see notification' } }
        );
    }

    let closeNote = () => {
        note.remove();
        if (notificationsBlock.findAll('.single-notification').length == 0) {
            closeNotifications.click();
        }
    }

    let close = note.makeElement({ element: 'i', attributes: { class: 'fas fa-times', title: 'close notification' } }
    );

    close.addEventListener('click', closeNote)

    if (params.duration != 'sticky') {
        params.duration = 1000 * params.duration;

        let animate = setTimeout(() => {
            closeNote();
            clearTimeout(animate);
        }, params.duration);
    }

    notificationsBlock.find('#main-notifications-window').prepend(note);
}

system.connect = (params) => {
    let progressBar = perceptor.createElement({ element: 'input', attributes: { class: 'ajax-progress', type: 'progress' } });
    params.onprogress = (stage) => {
        progressBar.css({ width: stage + '%' })
    }

    return new Promise((resolve, reject) => {
        document.body.append(progressBar);
        perceptor.api.ajax(params)
            .then(result => {
                result = JSON.parse(result);

                if (result == 'Expired') {
                    system.user = 'undefined';
                    system.userType = 'undefined';
                    system.redirect(location.href + 'index.html');
                    system.notify({ note: 'Session has Expired. Login again' });
                }
                else if (result == 'Admin only') {
                    resolve(result);
                    system.notify({ note: 'You are not allowed to do that' });
                }
                else if (result == 'Unknown Request') {
                    system.notify({ note: 'Request Unknown' });
                }
                else {
                    resolve(result);
                }
            })
            .catch(err => {
                reject(err);
            })
            .finally(final => {
                progressBar.remove();
            });
    });
}

system.display404 = (container) => {
    container.render({
        element: 'h1', text: '404 Not Found', attributes: {
            style: {
                width: `var(--match-parent)`, height: `var(--match-parent)`, padding: '5em', textAlign: 'center'
            }
        }
    });
}

system.loadView = (view) => {
    view.lightPrimaryColor = perceptor.colorHandler.addOpacity(view.primaryColor, 0.5);
    view.lighterPrimaryColor = perceptor.colorHandler.addOpacity(view.primaryColor, 0.2);
    view.lightSecondaryColor = perceptor.colorHandler.addOpacity(view.secondaryColor, 0.5);
    view.lighterSecondaryColor = perceptor.colorHandler.addOpacity(view.secondaryColor, 0.2);
    view.lightAccientColor = perceptor.colorHandler.addOpacity(view.accientColor, 0.5);
    view.lighterAccientColor = perceptor.colorHandler.addOpacity(view.accientColor, 0.2);

    let rootCss = document.head.find('#root-css');
    if (perceptor.isnull(rootCss)) {
        rootCss = document.head.makeElement({ element: 'style', attributes: { id: 'root-css' } });
    }

    let colors = `:root {
        --match-parent: -webkit-fill-available;
        --fill-parent: 100%;
        --primary-color: ${view.primaryColor};
        --light-primary-color: ${view.lightPrimaryColor};
        --lighter-primary-color: ${view.lighterPrimaryColor};
        --secondary-color: ${view.secondaryColor};
        --light-secondary-color: ${view.lightSecondaryColor};
        --lighter-secondary-color: ${view.lighterSecondaryColor};
        --accient-color: ${view.accientColor};
        --light-accient-color: ${view.lightAccientColor};
        --lighter-accient-color: ${view.lighterAccientColor};
    }`;
    rootCss.textContent = colors;
}

document.addEventListener('DOMContentLoaded', event => {
    system.user = document.body.dataset.user;
    system.userType = document.body.dataset.userType;

    document.body.makeElement({
        element: 'div', attributes: { id: 'main-notifications' }, children: [
            { element: 'i', attributes: { class: 'icon fas fa-angle-double-left', id: 'close-notifications' } },
            {
                element: 'div', attributes: { id: 'main-notifications-window' }, children: [

                ]
            }
        ]
    });

    document.body.makeElement({ element: 'i', attributes: { class: 'icon fas fa-angle-double-right', id: 'open-notifications' } },
    );
    route();

    if (true) {
        perceptor.api.makeWebapp(event => {
            route();
        });
    }
});
