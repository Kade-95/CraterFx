import { ElementModifier } from './../ElementModifier';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

class EmployeeDirectory extends ElementModifier {
    public params: any;
    public paneContent: any;
    public element: any;
    private key: any;
    private users: any;
    private openImage: any = 'https://pngimg.com/uploads/plus/plus_PNG22.png';
    private closeImage: any = 'https://i.dlpng.com/static/png/1442324-minus-png-minus-png-1600_1600_preview.png';

    constructor(params) {
        super({ sharePoint: params.sharePoint });
        this.sharePoint = params.sharePoint;
        this.params = params;
    }

    public render(params) {
        let employeeDirectory = this.createKeyedElement({
            element: 'div', attributes: { class: 'crater-component crater-employee-directory', 'data-type': 'employeedirectory' }, children: [
                {
                    element: 'div', attributes: { class: 'crater-employee-directory-content', id: 'crater-employee-directory-content' }, children: [
                        {
                            element: 'div', attributes: { class: 'crater-employee-directory-main-view', id: 'crater-employee-directory-main-view' }, children: [
                                {
                                    element: 'menu', attributes: { class: 'crater-employee-directory-menu', id: 'crater-employee-directory-menu' }, children: [
                                        { element: 'input', attributes: { placeholder: 'Search by Name...', id: 'crater-employee-directory-search-query' } },
                                        {
                                            element: 'div', attributes: { style: { display: 'grid', alignItems: 'center', gridTemplateColumns: 'max-content max-content', gridGap: '1em' } }, children: [
                                                { element: 'select', attributes: { id: 'crater-employee-directory-search-type', class: 'btn' }, options: ['All', 'By Name', 'By Department', 'By Job Title'] },
                                                { element: 'img', attributes: { class: 'crater-employee-directory-icon', id: 'crater-employee-directory-sync', title: 'Refresh', src: this.sharePoint.images.sync } }
                                            ]
                                        }
                                    ]
                                },
                                { element: 'div', attributes: { class: 'crater-employee-directory-display', id: 'crater-employee-directory-display' } }
                            ]
                        }
                    ]
                }
            ]
        });

        this.func.objectCopy(params, employeeDirectory.dataset);
        this.key = this.key || employeeDirectory.dataset.key;
        let settings = {
            searchType: 'All',
            searchQuery: '',
            mailApp: 'Outlook',
            messageApp: 'Teams',
            callApp: 'Teams',
            employees: [],
            defaultAvater: this.sharePoint.images.user,
            avaterBackground: '#008000'
        };

        this.sharePoint.saveSettings(employeeDirectory, settings);

        localStorage[`crater-${this.key}`] = JSON.stringify(settings);
        return employeeDirectory;
    }

    public rendered(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        let displayed = false;
        let display = this.element.find('.crater-employee-directory-display');

        let gmail = 'https://mail.google.com';
        let outlook = 'https://outlook.office365.com/mail';
        let yahoo = 'https://mail.yahoo.com';
        let skype = 'https://www.skype.com/en/business/';
        let teams = 'https://teams.microsoft.com/_#/conversations';

        display.innerHTML = '';

        display.makeElement({ element: 'img', attributes: { src: this.sharePoint.images.loading, style: { placeSelf: 'center', width: '10em', height: '10em' } } });

        let getUsers = () => {
            this.sharePoint.connection.getWithGraph().then(client => {
                client.api('/users')
                    .select('mail, displayName, givenName, id, jobTitle, mobilePhone')
                    .get((_error: any, _result: MicrosoftGraph.User, _rawResponse?: any) => {
                        this.users = _result['value'];

                        let getImage = (id) => {
                            return new Promise((resolve, reject) => {
                                client.api(`/users/${id}/photo/$value`)
                                    .responseType('blob')
                                    .get((error: any, result: any, rawResponse?: any) => {
                                        if (!this.func.setNotNull(result)) return;
                                        settings = JSON.parse(this.element.dataset.settings);
                                        settings.employees[id].photo = result;
                                        this.element.dataset.settings = JSON.stringify(settings);
                                        if (displayed) {
                                            display.find(`#row-${id}`).find('.crater-employee-directory-dp').src = window.URL.createObjectURL(result);
                                        }
                                        resolve();
                                    });
                            });
                        };

                        let getDepartment = (id) => {
                            return new Promise((resolve, reject) => {
                                client.api(`/users/${id}/department`)
                                    .get((error: any, result: any, rawResponse?: any) => {
                                        if (!this.func.setNotNull(result)) return;
                                        settings = JSON.parse(this.element.dataset.settings);
                                        settings.employees[id].department = result.value;
                                        this.element.dataset.settings = JSON.stringify(settings);
                                        resolve();
                                    });
                            });
                        };

                        for (let employee of this.users) {
                            JSON.parse(this.element.dataset.settings).employees[employee.id] = employee;
                            this.element.dataset.settings = JSON.stringify(this.element.dataset.settings);
                            getImage(employee.id);
                            getDepartment(employee.id);
                        }

                        this.displayUsers(display, settings);
                        displayed = true;
                    });
            });
        };

        if (!this.sharePoint.isLocal) {
            getUsers();
        }
        else {
            let samples = [
                { mail: 'Victor.ikeka@ipigroupng.com', id: 0, displayName: 'Ikeka Victor', jobTitle: 'Developer' },
                { mail: 'kennedy.ikeka@ipigroupng.com', id: 1, displayName: 'Ikeka Kennedy', jobTitle: 'Programmer' },
                { mail: 'Frank.ikeka@ipigroupng.com', id: 2, displayName: 'Ikeka Frank', jobTitle: 'Farmer' }
            ];
            this.users = [];
            settings.employees = {};
            for (let i = 0; i < samples.length; i++) {
                this.users.push(samples[i]);
                settings.employees[samples[i].id] = samples[i];
                this.element.dataset.settings = JSON.stringify(settings);
            }

            this.displayUsers(display, settings);
        }

        let changeSearchType = this.element.find('#crater-employee-directory-search-type');
        let changeSearchQuery = this.element.find('#crater-employee-directory-search-query');
        let sync = this.element.find('#crater-employee-directory-sync');

        sync.addEventListener('click', event => {
            getUsers();
        });

        changeSearchType.onChanged(value => {
            settings.searchType = value;
            this.element.dataset.settings = JSON.stringify(settings);
            if (value == 'All') {
                changeSearchQuery.value = '';
                changeSearchQuery.setAttribute('value', '');
            }
            this.displayUsers(display, settings);
        });

        changeSearchQuery.onChanged(value => {
            settings.searchQuery = value;
            this.displayUsers(display, settings);
        });

        let menu = this.element.find('.crater-employee-directory-menu');
        if (menu.position().width < 400) {
            menu.css({ gridTemplateColumns: '1fr' });
        }
        else {
            menu.cssRemove(['grid-template-columns']);
        }

        display.addEventListener('click', event => {
            let element = event.target;
            settings = JSON.parse(this.element.dataset.settings);

            if (element.classList.contains('crater-employee-directory-toggle-view')) {
                element.classList.toggle('open');
                let row = element.getParents('.crater-employee-directory-row');

                display.findAll('.crater-employee-directory-other-details').forEach(other => {
                    other.remove();
                });
                display.findAll('.crater-employee-directory-toggle-view').forEach(toggle => {
                    toggle.addClasses(this.sharePoint.icons.plus);
                });

                if (element.classList.contains('open')) {
                    element.removeClasses(this.sharePoint.icons.plus);
                    element.addClasses(this.sharePoint.icons.times);

                    row.append(this.displayOtherDetails(settings.employees[row.id.replace('row-', '')]));
                }
            }
            else if (element.classList.contains('crater-employee-directory-mail')) {
                let row = element.getParents('.crater-employee-directory-row');

                if (settings.mailApp.toLowerCase() == 'outlook') {
                    window.open(outlook);
                }
                else if (settings.mailApp.toLowerCase() == 'gmail') {
                    window.open(gmail);
                }
                else if (settings.mailApp.toLowerCase() == 'yahoo') {
                    window.open(yahoo);
                }
            }
            else if (element.classList.contains('crater-employee-directory-message')) {
                if (settings.messageApp.toLowerCase() == 'teams') {
                    window.open(teams);
                }
                else if (settings.messageApp.toLowerCase() == 'skype') {
                    window.open(skype);
                }
            }
            else if (element.classList.contains('crater-employee-directory-phone')) {
                if (settings.callApp.toLowerCase() == 'teams') {
                    window.open(teams);
                }
                else if (settings.callApp.toLowerCase() == 'skype') {
                    window.open(skype);
                }
            }
        });
    }

    private displayOtherDetails(user) {
        let otherDetials = this.createElement({
            element: 'div', attributes: { class: 'crater-employee-directory-other-details' }, children: [
                this.cell({ element: 'span', text: user.department || '', name: 'Department' }),
                this.cell({ element: 'span', text: user.office || '', name: 'Location' }),
                this.cell({ element: 'span', text: user.jobTitle || '', name: 'Job' }),
                this.cell({ element: 'span', text: user.mobilePhone || '', name: 'Mobile Phone' })
            ]
        });
        return otherDetials;
    }

    public displayUsers(display, settings) {
        display.innerHTML = '';

        for (let i = 0; i < this.users.length; i++) {
            let employee = this.users[i];
            if (settings.searchQuery != '') {
                let { department } = settings.employees[employee.id];
                let { jobTitle } = settings.employees[employee.id];

                if (settings.searchType == 'All') {
                    if (!(
                        employee.displayName.toLowerCase().includes(settings.searchQuery.toLowerCase()) ||
                        (this.func.setNotNull(department) && department.toLowerCase().includes(settings.searchQuery.toLowerCase())) ||
                        (this.func.setNotNull(jobTitle) && jobTitle.toLowerCase().includes(settings.searchQuery.toLowerCase()))
                    )) continue;
                }
                else if (settings.searchType == 'By Name') {
                    if (!employee.displayName.toLowerCase().includes(settings.searchQuery.toLowerCase())) continue;
                }
                else if (settings.searchType == 'By Department') {
                    if (!this.func.setNotNull(department)) continue;
                    if (!department.toLowerCase().includes(settings.searchQuery.toLowerCase())) continue;
                }
                else if (settings.searchType == 'By Job Title') {
                    if (!this.func.setNotNull(jobTitle)) continue;
                    if (!jobTitle.toLowerCase().includes(settings.searchQuery.toLowerCase())) continue;
                }
            }

            let photo = settings.defaultAvater;
            let image = settings.employees[employee.id].photo;
            if (this.func.setNotNull(settings.employees[employee.id].photo)) {
                photo = window.URL.createObjectURL(image);
            }

            let row = display.makeElement({
                element: 'div', attributes: { class: 'crater-employee-directory-row', id: `row-${employee.id}`, style: { background: settings.rowBackground } }, children: [
                    { element: 'img', attributes: { class: 'crater-employee-directory-dp', src: photo, style: { background: settings.avaterBackground } } },
                    {
                        element: 'span', attributes: { class: 'crater-employee-directory-details' }, children: [
                            { element: 'p', attributes: { class: 'crater-employee-directory-name' }, text: employee.displayName },
                            { element: 'p', attributes: { class: 'crater-employee-directory-mail' }, text: employee.mail },
                            { element: 'p', attributes: { class: 'crater-employee-directory-job' }, text: employee.jobTitle },
                            { element: 'p', attributes: { class: 'crater-employee-directory-contact' } },
                            {
                                element: 'span', attributes: { class: 'crater-employee-directory-contact' }, children: [
                                    { element: 'i', attributes: { class: 'crater-employee-directory-icon crater-employee-directory-mail', 'data-icon': this.sharePoint.icons.envelope } },
                                    { element: 'i', attributes: { class: 'crater-employee-directory-icon crater-employee-directory-message', 'data-icon': this.sharePoint.icons.comments } },
                                    { element: 'i', attributes: { class: 'crater-employee-directory-icon crater-employee-directory-phone', 'data-icon': this.sharePoint.icons.phone } }
                                ]
                            }
                        ]
                    },
                    { element: 'i', attributes: { class: 'crater-employee-directory-icon crater-employee-directory-toggle-view', 'data-icon': this.sharePoint.icons.plus } }
                ]
            });

            if (settings.roundRowEgdes == 'Yes') {
                row.css({ borderRadius: '10px' });
            }
        }
    }

    public setUpPaneContent(params): any {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        this.paneContent = this.createElement({
            element: 'div',
            attributes: { class: 'crater-property-content' }
        });

        if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
        }
        else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
        }
        else {
            let menuPane = this.paneContent.makeElement({
                element: 'div', attributes: { class: 'card menu-pane' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: "Menu Settings"
                            })
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'input', name: 'Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
                            }),
                            this.cell({
                                element: 'input', name: 'Border Size', list: this.func.pixelSizes
                            }),
                            this.cell({
                                element: 'input', name: 'Border Color', dataAttributes: { type: 'color' }
                            }),
                            this.cell({
                                element: 'input', name: 'Border Type', list: this.func.borderTypes
                            })
                        ]
                    })
                ]
            });

            let searchTypePane = this.paneContent.makeElement({
                element: 'div', attributes: { class: 'card search-type-pane' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: "Search Type Settings"
                            })
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'input', name: 'Shadow', list: this.func.shadows
                            }),
                            this.cell({
                                element: 'input', name: 'Border', list: this.func.borders
                            }),
                            this.cell({
                                element: 'input', name: 'Color', list: this.func.colors
                            }),
                            this.cell({
                                element: 'input', name: 'Background Color', list: this.func.colors
                            })
                        ]
                    })
                ]
            });

            let displayPane = this.paneContent.makeElement({
                element: 'div', attributes: { class: 'card display-pane' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: "Search Result Settings"
                            })
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'input', name: 'Height', list: this.func.pixelSizes
                            }),
                            this.cell({
                                element: 'input', name: 'Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
                            }),
                            this.cell({
                                element: 'input', name: 'Font Color', dataAttributes: { type: 'color', value: '#000000' }
                            }),
                            this.cell({
                                element: 'input', name: 'Font Size', list: this.func.pixelSizes
                            }),
                            this.cell({
                                element: 'input', name: 'Font Style', list: this.func.fontStyles
                            }),
                            this.cell({
                                element: 'img', name: 'Default Avatar', edit: 'upload-image', dataAttributes: { src: settings.defaultAvater, class: 'crater-icon' }
                            }),
                            this.cell({
                                element: 'input', name: 'Avater Background', dataAttributes: { type: 'color', value: settings.avaterBackground }
                            }),
                            this.cell({
                                element: 'select', name: 'Round Row Edges', options: ['Yes', 'No']
                            }),
                            this.cell({
                                element: 'input', name: 'Row Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
                            })
                        ]
                    })
                ]
            });

            let appsPane = this.paneContent.makeElement({
                element: 'div', attributes: { class: 'card apps-pane' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: "Default Apps"
                            })
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'select', name: 'Mail', options: ['Outlook', 'Gmail', 'Yahoo']
                            }),
                            this.cell({
                                element: 'select', name: 'Message', options: ['Teams', 'Skype']
                            }),
                            this.cell({
                                element: 'select', name: 'Call', options: ['Teams', 'Skype']
                            }),
                        ]
                    })
                ]
            });
        }

        return this.paneContent;
    }

    public listenPaneContent(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

        let domDraft = this.sharePoint.attributes.pane.content[this.key].draft.dom;

        let menuPane = this.paneContent.find('.menu-pane');
        let searchTypePane = this.paneContent.find('.search-type-pane');
        let displayPane = this.paneContent.find('.display-pane');
        let appsPane = this.paneContent.find('.apps-pane');

        appsPane.find('#Mail-cell').onChanged();
        appsPane.find('#Message-cell').onChanged();
        appsPane.find('#Call-cell').onChanged();

        menuPane.find('#Border-Color-cell').onChanged(borderColor => {
            let borderType = menuPane.find('#Border-Type-cell').value || 'solid';
            let borderSize = menuPane.find('#Border-Size-cell').value || '1px';
            domDraft.find('.crater-employee-directory-menu').css({ border: `${borderSize} ${borderType} ${borderColor}` });
        });

        menuPane.find('#Border-Size-cell').onChanged(borderSize => {
            let borderType = menuPane.find('#Border-Type-cell').value || 'solid';
            let borderColor = menuPane.find('#Border-Color-cell').value || '1px';
            domDraft.find('.crater-employee-directory-menu').css({ border: `${borderSize} ${borderType} ${borderColor}` });
        });

        menuPane.find('#Border-Type-cell').onChanged(borderType => {
            let borderSize = menuPane.find('#Border-Size-cell').value || 'solid';
            let borderColor = menuPane.find('#Border-Color-cell').value || '1px';
            domDraft.find('.crater-employee-directory-menu').css({ border: `${borderSize} ${borderType} ${borderColor}` });
        });

        menuPane.find('#Background-Color-cell').onChanged(backgroundColor => {
            domDraft.find('.crater-employee-directory-menu').css({ backgroundColor });
        });

        searchTypePane.find('#Shadow-cell').onChanged(boxShadow => {
            domDraft.find('#crater-employee-directory-search-type').css({ boxShadow });
        });

        searchTypePane.find('#Border-cell').onChanged(border => {
            domDraft.find('#crater-employee-directory-search-type').css({ border });
        });

        searchTypePane.find('#Color-cell').onChanged(color => {
            domDraft.find('#crater-employee-directory-search-type').css({ color });
        });

        searchTypePane.find('#Background-Color-cell').onChanged(backgroundColor => {
            domDraft.find('#crater-employee-directory-search-type').css({ backgroundColor });
        });

        displayPane.find('#Height-cell').onChanged(height => {
            domDraft.find('.crater-employee-directory-display').css({ height });
        });

        displayPane.find('#Background-Color-cell').onChanged(backgroundColor => {
            domDraft.find('.crater-employee-directory-display').css({ backgroundColor });
        });

        displayPane.find('#Font-Color-cell').onChanged(color => {
            domDraft.find('.crater-employee-directory-display').css({ color });
        });

        displayPane.find('#Font-Size-cell').onChanged(fontSize => {
            domDraft.find('.crater-employee-directory-display').css({ fontSize });
        });

        displayPane.find('#Font-Style-cell').onChanged(fontFamily => {
            domDraft.find('.crater-employee-directory-display').css({ fontFamily });
        });

        displayPane.find('#Font-Style-cell').onChanged(fontFamily => {
            domDraft.find('.crater-employee-directory-display').css({ fontFamily });
        });

        displayPane.find('#Avater-Background-cell').onChanged();

        displayPane.find('#Round-Row-Edges-cell').onChanged();

        displayPane.find('#Row-Background-Color-cell').onChanged();

        this.paneContent.addEventListener('mutated', event => {
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
            this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());
            this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

            settings.mailApp = appsPane.find('#Mail-cell').value;

            settings.messageApp = appsPane.find('#Message-cell').value;

            settings.callApp = appsPane.find('#Call-cell').value;

            settings.roundRowEgdes = displayPane.find('#Round-Row-Edges-cell').value;

            settings.avaterBackground = displayPane.find('#Avater-Background-cell').value;

            settings.defaultAvater = displayPane.find('#Default-Avatar-cell').src;

            settings.rowBackground = displayPane.find('#Row-Background-Color-cell').value;

            this.sharePoint.saveSettings(this.element, settings);

        });
    }
}

export { EmployeeDirectory };