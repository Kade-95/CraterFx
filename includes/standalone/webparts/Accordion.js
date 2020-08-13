function accordion() {
    let self = {};

    self.render = function (params) {
        if (!kerdx.isset(params.source))
            params.source = [
                { title: 'Person One', content: 'Fat new smallness few supposing suspicion two. Course sir people worthy horses add entire suffer. How one dull get busy dare far. At principle perfectly by sweetness do. As mr started arrival subject by believe. Strictly numerous outlived kindness whatever on we no on addition.' },
                { title: 'Person Two', content: 'In on announcing if of comparison pianoforte projection. Maids hoped gay yet bed asked blind dried point. On abroad danger likely regret twenty edward do. Too horrible consider followed may differed age. An rest if more five mr of. Age just her rank met down way. Attended required so in cheerful an. Domestic replying she resolved him for did. Rather in lasted no within no.' },
                { title: 'Person Three', content: 'Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.' },
            ];

        let title = 'Accordion';
        let accordion = craterApp.craterWebparts.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-accordion', 'data-type': 'accordion' } });

        accordion.makeElement({
            element: 'div', attributes: { class: 'crater-accordion-title', id: 'crater-accordion-title' }, children: [
                { element: 'i', attributes: { class: 'crater-accordion-title-icon', 'data-icon': craterApp.icons.eye, id: 'crater-accordion-title-icon' } },
                { element: 'p', text: title, attributes: { id: 'crater-accordion-title-text' } }
            ]
        });

        let content = accordion.makeElement({ element: 'div', attributes: { class: 'crater-accordion-content', id: 'crater-accordion-content' } });

        let settings = {
            toggleOpen: craterApp.icons.eye,
            toggleClose: craterApp.icons['eye-slash'],
            contentTitle: {},
            contentDetails: {}
        };

        craterApp.saveSettings(accordion, settings);

        for (let row of params.source) {
            content.append(kerdx.createElement({
                element: 'div', attributes: { class: 'crater-accordion-content-row' }, children: [
                    {
                        element: 'span', attributes: { class: 'crater-accordion-content-row-title' }, children: [
                            { element: 'i', attributes: { class: 'crater-accordion-content-row-toggle', closed: 'yes', 'data-icon': settings.toggleOpen } },
                            { element: 'a', attributes: { id: 'title', class: 'crater-accordion-content-row-title-text' }, text: row.title }
                        ]
                    },
                    {
                        element: 'div', attributes: { id: 'content', class: 'crater-accordion-content-row-content' }, children: [
                            { element: 'span', html: row.content }
                        ]
                    }
                ]
            }));
        }

        return accordion;
    }

    self.rendered = function (params) {

        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        let rows = this.element.findAll('.crater-accordion-content-row');
        for (let r = 0; r < rows.length; r++) {
            let row = rows[r];
            let title = row.find('.crater-accordion-content-row-title');
            let toggle = row.find('.crater-accordion-content-row-toggle');
            let content = row.find('.crater-accordion-content-row-content');
            toggle.removeClasses(toggle.dataset.icon);
            toggle.removeClasses(settings.toggleClose);
            toggle.addClasses(settings.toggleOpen);
            toggle.dataset.icon = settings.toggleOpen;

            title.addEventListener('click', event => {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].isAncestor(title)) {
                        let display = rows[i].find('.crater-accordion-content-row-content').css().display;
                        if (display == 'flex') {
                            rows[i].find('.crater-accordion-content-row-content').css({ display: 'none' });
                            rows[i].find('.crater-accordion-content-row-toggle').removeClasses(settings.toggleClose);
                            rows[i].find('.crater-accordion-content-row-toggle').addClasses(settings.toggleOpen);
                        }
                        else {
                            rows[i].find('.crater-accordion-content-row-content').css({ display: 'flex' });
                            rows[i].find('.crater-accordion-content-row-toggle').removeClasses(settings.toggleOpen);
                            rows[i].find('.crater-accordion-content-row-toggle').addClasses(settings.toggleClose);
                        }
                    }
                    else {
                        rows[i].find('.crater-accordion-content-row-content').css({ display: 'none' });
                        rows[i].find('.crater-accordion-content-row-toggle').removeClasses(settings.toggleClose);
                        rows[i].find('.crater-accordion-content-row-toggle').addClasses(settings.toggleOpen);
                    }
                }
            });

            title.addEventListener('mouseenter', event => {
                title.find('.crater-accordion-content-row-title-text').css({ color: settings.hoverColor });
                title.find('.crater-accordion-content-row-toggle').css({ borderColor: settings.hoverColor });
            });

            title.addEventListener('mouseleave', event => {
                title.find('.crater-accordion-content-row-title-text').css({ color: settings.contentTitle.color });
                title.find('.crater-accordion-content-row-toggle').css({ borderColor: settings.contentTitle.color });
            });

            toggle.src = settings.toggleOpen;
            content.hide();

            if (settings.divider == 'No') {
                row.css({ borderBottom: 'none' });
            }
            else {
                row.cssRemove(['border-bottom']);
            }

            if (settings.toggleShow == 'No') {
                toggle.css({ display: 'none' });
            }
            else {
                toggle.cssRemove(['display']);
            }

            if (settings.togglePosition == 'Right') {
                title.css({ gridTemplateColumns: '1fr max-content' });
                toggle.nextSibling.css({ gridColumnStart: 1 });
                toggle.css({ gridColumnStart: 2 });
            }
            else {
                title.css({ gridTemplateColumns: 'max-content 1fr' });
                toggle.css({ gridColumnStart: 1 });
                toggle.nextSibling.css({ gridColumnStart: 2 });
            }
            toggle.css({ gridRowStart: 1 });
            toggle.nextSibling.css({ gridRowStart: 1 });

            if (settings.toggleBorderType == 'None') {
                toggle.css({ border: 'none' });
            }
            else if (settings.toggleBorderType == 'Circle') {
                toggle.cssRemove(['border']);
                toggle.css({ borderRadius: '100%' });
            }
            else if (settings.toggleBorderType == 'Curved') {
                toggle.cssRemove(['border']);
                toggle.css({ borderRadius: '3px' });
            }
            else if (settings.toggleBorderType == 'Square') {
                toggle.cssRemove(['border', 'border-radius']);
            }


            title.css(settings.contentTitle);
            content.css(settings.contentDetails);

        }
    }

    self.setUpPaneContent = function (params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        this.paneContent = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-content' }
        }).monitor();

        if (craterApp.attributes.pane.content[this.key].draft.pane.content != '') {
            this.paneContent.innerHTML = craterApp.attributes.pane.content[this.key].draft.pane.content;
        }
        else if (craterApp.attributes.pane.content[this.key].content != '') {
            this.paneContent.innerHTML = craterApp.attributes.pane.content[this.key].content;
        }
        else {
            let accordionList = craterApp.attributes.pane.content[this.key].draft.dom.find('.crater-accordion-content');
            let accordionListRows = accordionList.findAll('.crater-accordion-content-row');
            this.paneContent.makeElement({
                element: 'div', children: [
                    kerdx.createElement({
                        element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
                    })
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'title-pane card' }, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Accordion Title'
                            })
                        ]
                    }),
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            kerdx.cell({
                                element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.find('.crater-accordion-title-icon').dataset.icon }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'title', value: this.element.find('.crater-accordion-title').textContent
                            }),
                            kerdx.cell({
                                element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'color', dataAttributes: { type: 'color' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'fontsize', value: this.element.find('.crater-accordion-title').css()['font-size']
                            }),
                            kerdx.cell({
                                element: 'input', name: 'height', value: this.element.find('.crater-accordion-title').css()['height'] || ''
                            }),
                            kerdx.cell({
                                element: 'select', name: 'Show', options: ['Yes', 'No']
                            })
                        ]
                    })
                ]
            });

            this.paneContent.append(this.generatePaneContent({ list: accordionListRows }));

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'toggle-pane card' }, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Toggle Settings'
                            })
                        ]
                    }),
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            kerdx.cell({
                                element: 'i', name: 'Open Icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': settings.toggleOpen }
                            }),
                            kerdx.cell({
                                element: 'i', name: 'Close Icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': settings.toggleClose }
                            }),
                            kerdx.cell({
                                element: 'select', name: 'Border Type', options: ['None', 'Circle', 'Square', 'Curved']
                            }),
                            kerdx.cell({
                                element: 'select', name: 'Show', options: ['Yes', 'No']
                            }),
                            kerdx.cell({
                                element: 'select', name: 'Position', options: ['Right', 'Left']
                            })
                        ]
                    })
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'content-title-pane card' }, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Content Title Settings'
                            })
                        ]
                    }),
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            kerdx.cell({
                                element: 'input', name: 'Font Size', list: kerdx.pixelSizes
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Font Style', list: kerdx.fontStyles
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Border', list: kerdx.borderTypes
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Boldness', list: kerdx.boldness
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Alignment', list: kerdx.alignment
                            }),
                        ]
                    })
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'content-details-pane card' }, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Content Details Settings'
                            })
                        ]
                    }),
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            kerdx.cell({
                                element: 'input', name: 'Font Size', list: kerdx.pixelSizes
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Font Style', list: kerdx.fontStyles
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Height', list: kerdx.pixelSizes
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Border', list: kerdx.borderTypes
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Alignment', list: kerdx.alignment
                            }),
                        ]
                    })
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'settings-pane card' }, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Other Settings'
                            })
                        ]
                    }),
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [
                            kerdx.cell({
                                element: 'select', name: 'Show Divider', options: ['Yes', 'No']
                            }),
                            kerdx.cell({
                                element: 'input', name: 'Title Hover Color', dataAttributes: { type: 'color' }
                            })
                        ]
                    })
                ]
            });
        }

        return this.paneContent;
    }

    self.generatePaneContent = function (params) {
        let listPane = kerdx.createElement({
            element: 'div', attributes: { class: 'card list-pane' }, children: [
                kerdx.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        kerdx.createElement({
                            element: 'h2', attributes: { class: 'title' }, text: 'Accordion List'
                        })
                    ]
                }),
            ]
        });

        for (let i = 0; i < params.list.length; i++) {
            listPane.makeElement({
                element: 'div',
                attributes: { class: 'crater-list-row-pane row' },
                children: [
                    craterApp.craterWebparts.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-list-content-row' }),
                    kerdx.cell({
                        element: 'span', edit: 'change-text', name: 'Title', html: params.list[i].find('#title').innerHTML
                    }),
                    kerdx.cell({
                        element: 'span', edit: 'change-text', name: 'Content', html: params.list[i].find('#content').innerHTML
                    }),
                ]
            });
        }

        return listPane;
    }

    self.listenPaneContent = function (params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        let settingsClone = {};

        this.paneContent = craterApp.app.find('.crater-property-content').monitor();
        let draftDom = craterApp.attributes.pane.content[this.key].draft.dom;

        let peopleList = draftDom.find('.crater-accordion-content');
        let peopleListRows = peopleList.findAll('.crater-accordion-content-row');

        let listRowPrototype = kerdx.createElement({
            element: 'div',
            attributes: {
                class: 'crater-list-row-pane row'
            },
            children: [
                craterApp.craterWebparts.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-list-content-row' }),
                kerdx.cell({
                    element: 'span', edit: 'change-text', name: 'Title', value: 'Title'
                }),
                kerdx.cell({
                    element: 'span', edit: 'change-text', name: 'Content', value: 'Content'
                }),
            ]
        });

        let peopleContentRowPrototype = kerdx.createElement({
            element: 'div', attributes: { class: 'crater-accordion-content-row' }, children: [
                {
                    element: 'span', attributes: { class: 'crater-accordion-content-row-title' }, children: [
                        { element: 'i', attributes: { class: 'crater-accordion-content-row-toggle', closed: 'yes', 'data-icon': settings.toggleOpen } },
                        { element: 'a', attributes: { id: 'title', class: 'crater-accordion-content-row-title-text' }, text: 'Title' }
                    ]
                },
                {
                    element: 'span', attributes: { id: 'content', class: 'crater-accordion-content-row-content' }, text: 'Content'
                }
            ]
        });

        let listRowHandler = (listRowPane, listRowDom) => {
            listRowPane.addEventListener('mouseover', event => {
                listRowPane.find('.crater-content-options').css({ visibility: 'visible' });
            });

            listRowPane.addEventListener('mouseout', event => {
                listRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
            });

            listRowPane.find('#Title-cell').checkChanges(event => {
                listRowDom.find('.crater-accordion-content-row-title-text').copy(listRowPane.find('#Title-cell'), []);
            });

            listRowPane.find('#Content-cell').checkChanges(event => {
                listRowDom.find('.crater-accordion-content-row-content').copy(listRowPane.find('#Content-cell'));
            });

            listRowPane.find('.delete-crater-list-content-row').addEventListener('click', event => {
                listRowDom.remove();
                listRowPane.remove();
            });

            listRowPane.find('.add-before-crater-list-content-row').addEventListener('click', event => {
                let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
                let newListRow = listRowPrototype.cloneNode(true);

                listRowDom.before(newPeopleListRow);
                listRowPane.before(newListRow);
                listRowHandler(newListRow, newPeopleListRow);
            });

            listRowPane.find('.add-after-crater-list-content-row').addEventListener('click', event => {
                let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
                let newListRow = listRowPrototype.cloneNode(true);

                listRowDom.after(newPeopleListRow);
                listRowPane.after(newListRow);

                listRowHandler(newListRow, newPeopleListRow);
            });
        };

        let titlePane = this.paneContent.find('.title-pane');
        let toggleSettings = this.paneContent.find('.toggle-pane');
        let contentTitleSettings = this.paneContent.find('.content-title-pane');
        let contentDetailsSettings = this.paneContent.find('.content-details-pane');
        let settingsPane = this.paneContent.find('.settings-pane');

        titlePane.find('#icon-cell').checkChanges(() => {
            draftDom.find('.crater-accordion-title-icon').removeClasses(draftDom.find('.crater-accordion-title-icon').dataset.icon);
            draftDom.find('.crater-accordion-title-icon').addClasses(titlePane.find('#icon-cell').dataset.icon);
            draftDom.find('.crater-accordion-title-icon').dataset.icon = titlePane.find('#icon-cell').dataset.icon;
        });

        titlePane.find('#title-cell').onChanged(value => {
            draftDom.find('.crater-accordion-title').find('p').innerHTML = value;
        });

        titlePane.find('#Show-cell').onChanged(value => {
            if (value == 'No') {
                draftDom.find('.crater-accordion-title').hide();
            } else {
                draftDom.find('.crater-accordion-title').show();
            }
        });

        titlePane.find('#backgroundcolor-cell').onChanged(background => {
            draftDom.find('.crater-accordion-title').css({ background });
        });

        titlePane.find('#color-cell').onChanged(color => {
            draftDom.find('.crater-accordion-title').css({ color });
        });

        titlePane.find('#fontsize-cell').onChanged(value => {
            draftDom.find('.crater-accordion-title').find('p').css({ fontSize: value });
        });

        titlePane.find('#height-cell').onChanged(value => {
            draftDom.find('.crater-accordion-title').css({ height: value });
        });

        toggleSettings.find('#Open-Icon-cell').checkChanges();
        toggleSettings.find('#Close-Icon-cell').checkChanges();
        toggleSettings.find('#Border-Type-cell').onChanged();
        toggleSettings.find('#Show-cell').onChanged();
        toggleSettings.find('#Position-cell').onChanged();

        contentTitleSettings.find('#Font-Size-cell').onChanged();
        contentTitleSettings.find('#Font-Style-cell').onChanged();
        contentTitleSettings.find('#Color-cell').onChanged();
        contentTitleSettings.find('#Background-Color-cell').onChanged();
        contentTitleSettings.find('#Border-cell').onChanged();
        contentTitleSettings.find('#Boldness-cell').onChanged();
        contentTitleSettings.find('#Alignment-cell').onChanged();

        contentDetailsSettings.find('#Font-Size-cell').onChanged();
        contentDetailsSettings.find('#Font-Style-cell').onChanged();
        contentDetailsSettings.find('#Color-cell').onChanged();
        contentDetailsSettings.find('#Background-Color-cell').onChanged();
        contentDetailsSettings.find('#Height-cell').onChanged();
        contentDetailsSettings.find('#Border-cell').onChanged();
        contentDetailsSettings.find('#Alignment-cell').onChanged();

        settingsPane.find('#Show-Divider-cell').onChanged();

        settingsPane.find('#Title-Hover-Color-cell').onChanged();

        this.paneContent.find('.new-component').addEventListener('click', event => {
            let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
            let newListRow = listRowPrototype.cloneNode(true);

            draftDom.find('.crater-accordion-content').append(newPeopleListRow);//c
            this.paneContent.find('.list-pane').append(newListRow);

            listRowHandler(newListRow, newPeopleListRow);
        });

        this.paneContent.findAll('.crater-list-row-pane').forEach((listRow, position) => {
            listRowHandler(listRow, peopleListRows[position]);
        });

        this.paneContent.addEventListener('mutated', event => {
            craterApp.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            craterApp.attributes.pane.content[this.key].draft.html = craterApp.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.element.innerHTML = draftDom.innerHTML;

            this.element.css(draftDom.css());

            craterApp.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
            settings.toggleOpen = toggleSettings.find('#Open-Icon-cell').dataset.icon;
            settings.toggleClose = toggleSettings.find('#Close-Icon-cell').dataset.icon;
            settings.toggleBorderType = toggleSettings.find('#Border-Type-cell').value;
            settings.toggleShow = toggleSettings.find('#Show-cell').value;
            settings.togglePosition = toggleSettings.find('#Position-cell').value;

            settings.divider = settingsPane.find('#Show-Divider-cell').value;
            settings.hoverColor = settingsPane.find('#Title-Hover-Color-cell').value;

            settings.contentTitle.fontSize = contentTitleSettings.find('#Font-Size-cell').value;
            settings.contentTitle.fontFamily = contentTitleSettings.find('#Font-Style-cell').value;
            settings.contentTitle.color = contentTitleSettings.find('#Color-cell').value;
            settings.contentTitle.backgroundColor = contentTitleSettings.find('#Background-Color-cell').value;
            settings.contentTitle.border = contentTitleSettings.find('#Border-cell').value;
            settings.contentTitle.boldness = contentTitleSettings.find('#Boldness-cell').value;
            settings.contentTitle.justifyContent = contentTitleSettings.find('#Alignment-cell').value;

            settings.contentDetails.fontSize = contentDetailsSettings.find('#Font-Size-cell').value;
            settings.contentDetails.fontStyle = contentDetailsSettings.find('#Font-Style-cell').value;
            settings.contentDetails.color = contentDetailsSettings.find('#Color-cell').value;
            settings.contentDetails.backgroundColor = contentDetailsSettings.find('#Background-Color-cell').value;
            settings.contentDetails.border = contentDetailsSettings.find('#Border-cell').value;
            settings.contentDetails.boldness = contentDetailsSettings.find('#Height-cell').value;
            settings.contentDetails.textAlign = contentDetailsSettings.find('#Alignment-cell').value;

            craterApp.saveSettings(this.element, settings, settingsClone);
        });
    }

    self.update = function (params) {
        this.element = params.element;
        this.key = this.element.dataset['key'];
        let draftDom = craterApp.attributes.pane.content[this.key].draft.dom;
        this.paneContent = this.setUpPaneContent(params);

        let paneConnection = craterApp.app.find('.crater-property-connection');
        let metadata = params.connection.metadata || {};
        let options = params.connection.options || [];

        let updateWindow = kerdx.createForm({
            title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
            contents: {
                title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options, selected: metadata.title },
                content: { element: 'select', attributes: { id: 'meta-data-content', name: 'Content' }, options, selected: metadata.content }
            },
            buttons: {
                submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
            }
        });

        updateWindow.find('#update-element').addEventListener('click', event => {
            event.preventDefault();
            params.connection.metadata.title = updateWindow.find('#meta-data-title').value;
            params.connection.metadata.content = updateWindow.find('#meta-data-content').value;
            params.container = draftDom;
            params.flag = true;

            this.runUpdate(params);
            updateWindow.find('.form-error').css({ display: 'unset' });
            updateWindow.find('.form-error').textContent = 'Draft Updated';
        });


        if (!kerdx.isnull(paneConnection)) {
            paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
                this.element.innerHTML = draftDom.innerHTML;

                this.element.css(draftDom.css());

                craterApp.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
            });
        }

        return updateWindow;
    }

    self.runUpdate = function (params) {
        let source = kerdx.extractFromJsonArray(params.connection.metadata, params.source);
        let key = this.key || params.container.dataset.key;
        let newContent = this.render({ source });
        params.container.find('.crater-accordion-content').innerHTML = newContent.find('.crater-accordion-content').innerHTML;
        craterApp.attributes.pane.content[key].draft.html = params.container.outerHTML;

        if (params.flag == true) {
            this.paneContent.find('.list-pane').innerHTML = this.generatePaneContent({ list: newContent.findAll('.crater-accordion -content-row') }).innerHTML;

            craterApp.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
        }
    }

    return self;
}

export { accordion };