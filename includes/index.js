window.system = {};

import { Kerdx } from 'https://kade-95.github.io/kerdx/index.js';
import { CraterUi } from './pages/CraterUi.js';

window.kerdx = new Kerdx();
const craterUi = new CraterUi();
let viewSet = false;
window.log = console.log;

system.setupView = () => {
    let view = {};
    view.primaryColor = 'rgb(255, 255, 255)';
    view.secondaryColor = 'rgb(0, 0, 0)';
    view.accientColor = 'rgb(64, 168, 45)';

    system.loadView(view);
    viewSet = true;
}

system.route = () => {
    document.body.removeChildren({ except: ['#main-notifications', '#open-notifications'] });
    if (!viewSet) {
        system.setupView();
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
    if (!kerdx.isset(system.user) || system.user == 'undefined') {
        if (!(pathname == '/' || pathname == '/index.html')) {
            system.redirect('index.html');
        }
        else {
            system.display();
        }

    }
    else if (pathname == '/' || pathname == '/index.html') {
        if (system.user == 'undefined') {
            system.display();
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

    system.toggleNotifications();
}

system.display = () => {
    let header = document.body.find('#main-header');
    document.body.cssRemove(['grid-template-rows']);
    header.cssRemove(['display']);
    system.setupView();
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
    let url = kerdx.urlSplitter(location.href);

    header.find('.toggle').addEventListener('click', event => {
        event.target.classList.toggle('toggle-open');
        event.target.classList.toggle('toggle-close');
        if (!kerdx.isset(header.find('#header-side-bar').css().display)) {
            header.find('#header-side-bar').css({ display: 'grid' });
        }
        else {
            header.find('#header-side-bar').cssRemove(['display']);
        }
    });

    header.addEventListener('click', event => {
        if (event.target.classList.contains('get-started')) {
            system.login(document.body.find('#main-window-container'));
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
                            { element: 'a', attributes: { class: 'btn btn-big', href: 'index.html?page=createTenant' }, text: 'Create Tenant' }
                        ]
                    },
                ]
            },
            {
                element: 'img', attributes: { id: 'main-banner', src: 'images/banner.png' }
            }
        ]
    });

    if (url.vars.page == 'login') {
        system.login(main.find('#main-window-container'));
    }
    else if (url.vars.page == 'createTenant') {
        system.createTenant(main.find('#main-window-container'));
    }
    else if (url.vars.page == 'displayCrater') {
        system.displayCrater();
    }
}

system.login = (container) => {
    let loading = kerdx.createElement({ element: 'span', attributes: { class: 'loading loading-medium' } });

    let loginForm = kerdx.createForm({
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

        if (!kerdx.validateForm(loginForm)) {
            loading.replaceWith(loginForm.getState({ name: 'submit' }));
            loginForm.setState({ name: 'error', attributes: { style: { display: 'unset' } }, text: 'Faulty form' });

            return;
        }

        loading.replaceWith(loginForm.getState({ name: 'submit' }));
        let data = kerdx.jsonForm(loginForm);
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
                system.setupView();
                system.redirect(craterUi.currentPage);
                note = 'Welcome back!!! ' + data.email;
            }

            system.notify({ note });
        });
    });
}

system.createTenant = (container) => {
    let tenantForm = kerdx.createForm({
        title: 'Tenant Form', attributes: { id: 'tenant-form', class: 'form' },
        contents: {
            tenant: { element: 'input', attributes: { id: 'tenant', name: 'tenant' } },
            admin: { element: 'input', attributes: { id: 'admin', name: 'admin' } },
            password: {
                element: 'input', attributes: { id: 'password', name: 'password', type: 'password', autoComplete: true }
            }
        },
        buttons: {
            submit: { element: 'button', attributes: { id: 'submit' }, text: 'Create' },
        }
    });

    container.render(tenantForm);

    tenantForm.addEventListener('submit', event => {
        event.preventDefault();

        let formValidation = kerdx.validateForm(tenantForm, { nodeNames: ['INPUT'] });

        if (!formValidation.flag) {
            tenantForm.setState({ name: 'error', attributes: { style: { display: 'unset' } }, text: `Form ${formValidation.elementName} is faulty` });
            return;
        }

        let data = kerdx.jsonForm(tenantForm);
        data.action = 'createTenant';

        system.connect({ data }).then(result => {
            let note;
            if (result == 'found') {
                note = 'Tenant with name already Exists';
            }
            else {
                document.body.dataset.user = result.user;
                document.body.dataset.userType = result.userType;
                system.setupView(result.user);
                system.redirect('dashboard.html');
                note = 'Welcome' + data.admin;
            }

            system.notify({ note });
        });
    });
}

system.toggleNotifications = () => {
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

system.displayCrater = () => {
    let craterWindow = kerdx.createElement({
        element: 'iframe', attributes: { id: 'crater-window', style: { height: '100%', width: '100%' } }
    });
    craterWindow.src = `includes/standalone/index.html?user=${system.user}`;
    let popUpCrater = kerdx.popUp(craterWindow, { attributes: { style: { width: '100%', height: '100%' } } });
}

system.redirect = url => {
    window.history.pushState('page', 'title', kerdx.api.prepareUrl(url));
    system.route();
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

    let note = kerdx.createElement({
        element: 'span', attributes: { class: 'single-notification' }, children: [
            { element: 'p', attributes: { class: 'single-notification-text' }, text: params.note }
        ]
    });

    if (kerdx.isset(params.link)) {
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
    let progressBar = kerdx.createElement({ element: 'input', attributes: { class: 'ajax-progress', type: 'progress' } });
    params.onprogress = (stage) => {
        progressBar.css({ width: stage + '%' })
    }

    return new Promise((resolve, reject) => {
        document.body.append(progressBar);
        kerdx.api.ajax(params)
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
    view.lightPrimaryColor = kerdx.colorHandler.addOpacity(view.primaryColor, 0.5);
    view.lighterPrimaryColor = kerdx.colorHandler.addOpacity(view.primaryColor, 0.2);
    view.lightSecondaryColor = kerdx.colorHandler.addOpacity(view.secondaryColor, 0.5);
    view.lighterSecondaryColor = kerdx.colorHandler.addOpacity(view.secondaryColor, 0.2);
    view.lightAccientColor = kerdx.colorHandler.addOpacity(view.accientColor, 0.5);
    view.lighterAccientColor = kerdx.colorHandler.addOpacity(view.accientColor, 0.2);

    let rootCss = document.head.find('#root-css');
    if (kerdx.isnull(rootCss)) {
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
    system.route();

    if (true) {
        kerdx.api.makeWebapp(event => {
            system.route();
        });
    }
});
