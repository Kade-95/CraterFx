class PropertyPane {
    constructor(params) {
        this.paneContent = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-content' }
        }).monitor();
        this.paneStyle = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-style' }
        }).monitor();
        this.paneConnection = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-connection' }
        }).monitor();
    }

    render(element) {
        craterApp.app.findAll('.webpart-options').forEach(option => {
            option.hide();
        });

        craterApp.expandHeight();

        this.element = element;

        let key = this.element.dataset['key'];
        if (!kerdx.isset(key)) {
            alert("This element cannot be editted");
            return;
        }

        if (!kerdx.isset(craterApp.attributes.pane.content[key])) {
            craterApp.attributes.pane.content[key] = { content: '', styles: '', settings: {}, draft: { dom: '', html: '', pane: { content: '', styles: '' } } };
        }

        let content = [
            { name: 'Content', owner: 'Content' },
            { name: 'Styles', owner: 'Styles' },
        ];

        if (kerdx.isset(this.element.dataset.connectible)) {
            content.push({ name: 'Connection', owner: 'Connection' });
        }

        let menus = craterApp.craterWebparts.menu({
            content,
            padding: '1em 0em'
        });

        this.editor = kerdx.createElement({
            element: 'div', attributes: { class: 'crater-editor' }
        });

        let editWindow = kerdx.createElement({
            element: 'div', attributes: {
                class: 'crater-edit-window'
            },
            children: [
                menus,
                this.editor
            ]
        });

        this.currentWindow = '';

        menus.addEventListener('click', event => {
            let item = event.target;

            if (!item.classList.contains('crater-menu-item')) item = item.getParents('.crater-menu-item');

            if (kerdx.isnull(item)) return;

            if (item.dataset.owner == 'Content' && this.currentWindow != 'Content') {
                this.setUpContent(this.element);
            }
            else if (item.dataset.owner == 'Styles' && this.currentWindow != 'Styles') {
                this.setUpStyle(key);
            }
            else if (item.dataset.owner == 'Connection' && this.currentWindow != 'Connection') {
                this.setUpConnection(key);
            }

            this.currentWindow = item.dataset.owner;

            menus.findAll('.crater-menu-item').forEach(mItem => {
                mItem.cssRemove(['background-color']);
            });

            item.css({ backgroundColor: `var(--lighter-primary-color)` });
        });

        editWindow.makeElement({
            element: 'div', attributes: { class: 'crater-editor-buttons' }, children: [
                {
                    element: 'button', attributes: { id: 'crater-editor-save', class: 'btn' }, text: 'Save'
                },
                {
                    element: 'button', attributes: { id: 'crater-editor-cancel', class: 'btn' }, text: 'Cancel'
                }
            ]
        });

        if (element.dataset.type == 'crater') {
            editWindow.find('.crater-editor-buttons').makeElement({
                element: 'button', attributes: { id: 'crater-editor-update', class: 'btn' }, text: 'Update', attatchment: 'prepend'
            });
        }

        editWindow.addEventListener('click', event => {
            if (event.target.id == 'crater-editor-save') {//save is clicked
                craterApp.attributes.pane.content[key].styles = this.paneStyle.innerHTML;

                if (kerdx.isset(craterApp.attributes.pane.content[key].draft.dom.dataset.backgroundImage)) {
                    this.element.setBackgroundImage(craterApp.attributes.pane.content[key].draft.dom.dataset.backgroundImage);
                }

                craterApp.saved = true;
                craterApp.savedWebPart = this.element;

                console.log('Crater edition saved');
                craterApp.restoreHeight();
                editWindow.remove();
            }
            else if (event.target.id == 'crater-editor-cancel') {//keep draft and exit
                this.clearDraft(craterApp.attributes.pane.content[key].draft);
                console.log('Crater edition cancelled');
                craterApp.restoreHeight();
                editWindow.remove();
            }
            else if (event.target.id == 'crater-editor-update') {
                craterApp.update((state) => {
                    editWindow.remove();
                    console.log('Crater Updated');
                });
            }
        });

        craterApp.app.append(editWindow);
        this.setUpContent(this.element);
        return editWindow;
    }

    setUpContent(element, prototype) {
        // get webpart
        let key = element.dataset.key;
        // return 
        if (craterApp.attributes.pane.content[key].draft.html == '') {
            craterApp.attributes.pane.content[key].draft.dom = element.cloneNode(true);
            craterApp.attributes.pane.content[key].draft.html = craterApp.attributes.pane.content[key].draft.dom.outerHTML;
        }
        else {
            craterApp.attributes.pane.content[key].draft.dom = kerdx.createElement(craterApp.attributes.pane.content[key].draft.html);
        }

        let draftDom = craterApp.attributes.pane.content[key].draft.dom;
        let type = draftDom.dataset.type;

        if (kerdx.isset(prototype)) {
            return craterApp.craterWebparts[type]({ action: 'setUpPaneContent', element, draft: draftDom, sharePoint: craterApp });
        }

        this.editor.innerHTML = '';
        this.editor.append(craterApp.craterWebparts[type]({ action: 'setUpPaneContent', element: this.element, draft: draftDom, sharePoint: craterApp }));

        craterApp.craterWebparts[type]({ action: 'listenPaneContent', element: this.element, draft: draftDom, sharePoint: craterApp });

        this.editor.findAll('.crater-color-picker').forEach(picker => {
            picker.remove();
        });

        this.editor.findAll('.crater-pop-up').forEach(popup => {
            popup.remove();
        });
    }

    setUpConnection(key) {
        // get webpart
        let type = this.element.dataset.type;
        if (typeof craterApp.attributes.pane.content[key].connection != 'object') {
            craterApp.attributes.pane.content[key].connection = { type: 'Same Site', realTime: 'No', details: {}, options: [], metadata: {} };
        }
        let elementConnection = craterApp.attributes.pane.content[key].connection;
        let connection = JSON.parse(JSON.stringify(elementConnection));

        let update = craterApp.craterWebparts[type]({ action: 'update', element: this.element, sharePoint: craterApp, connection });
        update.find('.kerdx-form-error').innerHTML = '';
        update.find('.kerdx-form-error').hide();

        this.paneConnection = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-connection' },
        }).monitor();

        let getDisplayOptions = (connectionType) => {
            if (connectionType == 'Same Site') {
                return kerdx.createForm({
                    title: 'Same Site Connection', attributes: { id: 'connection-form', class: 'form' },
                    contents: {
                        list: { element: 'input', attributes: { id: 'connection-list', name: 'List', value: connection.details.List || '' } },
                    },
                    buttons: {
                        submit: { element: 'button', attributes: { id: 'create-connection', class: 'btn' }, text: 'Submit' },
                    }
                });
            }
            else if (connectionType == 'Other Sharepoint Site') {
                return kerdx.createForm({
                    title: 'Another SharePoint Site Connection', attributes: { id: 'connection-form', class: 'form' },
                    contents: {
                        link: { element: 'input', attributes: { id: 'connection-link', name: 'Link', value: connection.details.Link || '' } },
                        list: { element: 'input', attributes: { id: 'connection-list', name: 'List', value: connection.details.Link || '' } },
                    },
                    buttons: {
                        submit: { element: 'button', attributes: { id: 'create-connection', class: 'btn' }, text: 'Submit' },
                    }
                });
            }
            else if (connectionType == 'RSS Feed') {
                return kerdx.createForm({
                    title: 'RSS Feed Connection', attributes: { id: 'connection-form', class: 'form' },
                    contents: {
                        link: { element: 'input', attributes: { id: 'connection-link', name: 'Link', value: connection.details.Link || '' } },
                        count: { element: 'input', attributes: { id: 'connection-count', name: 'Count', type: 'number', min: 1, value: connection.details.Count || '' } },
                        keywords: { element: 'input', attributes: { id: 'connection-keywords', name: 'Keywords', validate: 'no', value: connection.details.Keywords || '' } }
                    },
                    buttons: {
                        submit: { element: 'button', attributes: { id: 'create-connection', class: 'btn' }, text: 'Submit' },
                    }
                });
            }
        };

        this.paneConnection.makeElement({
            element: 'div', attributes: { class: 'crater-connection-content' }, children: [
                {
                    element: 'section', attributes: { class: 'crater-connection-try' }, children: [
                        {
                            element: 'div', attributes: { class: 'crater-connection-settings' }, children: [
                                kerdx.cell({ element: 'select', name: 'Type', options: ['Same Site', 'Other Sharepoint Site', 'RSS Feed'], selected: connection.type }),
                                kerdx.cell({ element: 'select', name: 'Real Time', options: ['Yes', 'No'], selected: connection.realTime }),
                            ]
                        },
                        { element: 'div', attributes: { id: 'crater-connection-type-option' } },
                        { element: 'div', attributes: { id: 'crater-connection-type-option' } }
                    ]
                },
                {
                    element: 'section', attributes: { class: 'crater-connection-get' }, children: [
                        update
                    ]
                }
            ]
        });

        this.paneConnection.find('#crater-connection-type-option').makeElement({ element: getDisplayOptions(connection.type) });
        let getWindow = this.paneConnection.find('.crater-connection-get');

        this.paneConnection.find('#Type-cell').onChanged(value => {
            this.paneConnection.find('#crater-connection-type-option').innerHTML = '';
            this.paneConnection.find('#crater-connection-type-option').makeElement({ element: getDisplayOptions(value) });
            connection.type = value;
        });

        this.paneConnection.find('#Real-Time-cell').onChanged(value => {
            connection.realTime = value;
        });

        this.paneConnection.find('.kerdx-form-error').innerHTML = '';

        this.paneConnection.addEventListener('click', event => {
            let target = event.target;

            let fetchData = (link, list, form, formError) => {
                if (!kerdx.validateForm(form)) {
                    formError.textContent = 'Form not filled correctly';
                    return;
                }
                
                craterApp.connection.find({ link, list, data: '' }).then(source => {
                    connection.options = kerdx.getObjectArrayKeys(source);
                    update = craterApp.craterWebparts[type]({ action: 'update', element: this.element, sharePoint: craterApp, connection, source });
                    getWindow.innerHTML = '';
                    getWindow.append(update);

                    formError.textContent = 'Connected';
                });
            };

            if (target.id == 'create-connection') {
                event.preventDefault();
                let form = target.getParents('.form');
                let formError = form.find('.kerdx-form-error');
                formError.css({ display: 'unset' });
                formError.textContent = 'Connecting...';
                connection.details = kerdx.jsonForm(form);

                if (connection.type == 'Same Site') {
                    connection.details.Link = craterApp.connection.getSite();
                    fetchData(connection.details.Link, connection.details.List, form, formError);
                }
                else if (connection.type == 'Other Sharepoint Site') {
                    fetchData(connection.details.Link, connection.details.List, form, formError);
                }
                else if (connection.type == 'RSS Feed') {
                    if (!kerdx.validateForm(form)) {
                        formError.textContent = 'Form not filled correctly';
                        return;
                    }

                    craterApp.connection.getRSSFeed(connection.details.Link, connection.details.Count, connection.details.Keywords).then(source => {
                        formError.textContent = 'Connected';

                        connection.options = kerdx.getObjectArrayKeys(source);

                        update = craterApp.craterWebparts[type]({ action: 'update', element: this.element, sharePoint: craterApp, connection, source });
                        getWindow.innerHTML = '';
                        getWindow.append(update);
                    });
                }
            }
        });

        this.editor.innerHTML = '';
        this.editor.append(this.paneConnection);

        this.paneConnection.addEventListener('mutated', event => {
            craterApp.attributes.pane.content[key].draft.html = craterApp.attributes.pane.content[key].draft.dom.outerHTML;
        });

        this.editor.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            craterApp.attributes.pane.content[key].connection = JSON.parse(JSON.stringify(connection));
        });
    }

    setUpStyle(key) {
        this.paneStyle = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-style' }
        }).monitor();

        if (craterApp.attributes.pane.content[key].draft.pane.styles != '') {
            this.paneStyle.innerHTML = craterApp.attributes.pane.content[key].draft.pane.styles;
        }
        else if (craterApp.attributes.pane.content[key].styles != '') {
            this.paneStyle.innerHTML = craterApp.attributes.pane.content[key].styles;
        }
        else {
            let paddings = { paddingTop: 'Padding Top', paddingLeft: 'Padding Left', paddingBottom: 'Padding Bottom', paddingRight: 'Padding Bottom' };
            let paddingBlock = craterApp.craterWebparts.createStyleBlock({ children: paddings, title: "Paddings", element: this.element, options: { sync: true } });
            this.paneStyle.append(paddingBlock);

            let margins = { marginTop: 'Margin Top', marginLeft: 'Margin Left', marginBottom: 'Margin Bottom', marginRight: 'Margin Right' };
            let marginBlock = craterApp.craterWebparts.createStyleBlock({ children: margins, title: "Margins", element: this.element, options: { sync: true } });
            this.paneStyle.append(marginBlock);

            let borders = { borderTop: 'Border Top', borderLeft: 'Border Left', borderBottom: 'Border Bottom', borderRight: 'Border Right' };
            let borderBlock = craterApp.craterWebparts.createStyleBlock({ children: borders, title: "Borders", element: this.element, options: { sync: true } });
            this.paneStyle.append(borderBlock);

            let borderRadius = { borderTopLeftRadius: 'Top-Left Radius', borderBottomLeftRadius: 'Bottom-Left Radius', borderTopRightRadius: 'Top-Right Radius', borderBottomRightRadius: 'Bottom-Right Radius', };
            let borderRadiusBlock = craterApp.craterWebparts.createStyleBlock({ children: borderRadius, title: "Border Radius", element: this.element, options: { sync: true } });
            this.paneStyle.append(borderRadiusBlock);

            let fonts = { fontSize: 'Font Size', fontWeight: 'Boldness', fontFamily: 'Font Style', color: 'Font Color' };
            let fontBlock = craterApp.craterWebparts.createStyleBlock({ children: fonts, title: "fonts", element: this.element });
            this.paneStyle.append(fontBlock);

            let backgrounds = { backgroundColor: 'Background Color', backgroundSize: 'Background Size', backgroundRepeat: 'Background Repeat', backgroundImage: 'Background Image', backgroundPosition: 'Background Position', boxShadow: 'Box Shadow' };
            let backgroundBlock = craterApp.craterWebparts.createStyleBlock({ children: backgrounds, title: "Backgrounds", element: this.element });
            this.paneStyle.append(backgroundBlock);

            let dimensions = { textAlign: 'Text Align', verticalAlign: 'Vertical Align', position: 'Position', visibility: 'Visibility', display: 'Display' };
            let dimensionBlock = craterApp.craterWebparts.createStyleBlock({ children: dimensions, title: "Size", element: this.element });
            this.paneStyle.append(dimensionBlock);


            let height = { height: 'Height', minHeight: 'Minimium Height', maxHeight: 'Maximium Height' };
            let heightBlock = craterApp.craterWebparts.createStyleBlock({ children: height, title: "Height", element: this.element });
            this.paneStyle.append(heightBlock);

            let width = { width: 'Width', minWidth: 'Minimium Width', maxWidth: 'Maximium Width' };
            let widthBlock = craterApp.craterWebparts.createStyleBlock({ children: width, title: "Width", element: this.element });
            this.paneStyle.append(widthBlock);

            let display = { display: 'Display', gridTemplateColumns: 'Columns', gridTemplateRows: 'Rows' };
            let displayBlock = craterApp.craterWebparts.createStyleBlock({ children: display, title: "Display", element: this.element });
            this.paneStyle.append(displayBlock);
        }

        this.editor.innerHTML = '';
        this.editor.append(this.paneStyle);

        this.paneStyle.findAll('.crater-style-attr').forEach(element => {
            element.onChanged(value => {
                let action = {};

                if (craterApp.attributes.pane.content[key].sync[element.dataset['styleSync']]) {
                    element.getParents('.crater-style-block').findAll('.crater-style-attr').forEach(styler => {
                        styler.value = value;
                        styler.setAttribute('value', value);
                        action[styler.dataset['action']] = value;
                        craterApp.attributes.pane.content[key].draft.dom.css(action);
                    });
                } else {
                    action[element.dataset['action']] = value;
                    craterApp.attributes.pane.content[key].draft.dom.css(action);
                }
            });
        });

        this.paneStyle.findAll('.crater-toggle-style-sync').forEach(element => {
            element.addEventListener('click', event => {
                craterApp.attributes.pane.content[key].sync[element.dataset['style']] = !craterApp.attributes.pane.content[key].sync[element.dataset['style']];
                element.src = craterApp.attributes.pane.content[key].sync[element.dataset['style']] ? craterApp.images.sync : craterApp.images.async;
            });
        });

        craterApp.craterWebparts.sharePoint = craterApp;

        let backgroundImageCell = this.paneStyle.find('#Background-Image-cell').parentNode;

        this.paneStyle.find('#Background-Image-cell').checkChanges(() => {
            craterApp.attributes.pane.content[key].draft.dom.setBackgroundImage(this.paneStyle.find('#Background-Image-cell').src);
        });

        this.paneStyle.find('#Background-Color-cell').onChanged(backgroundColor=>{
            craterApp.attributes.pane.content[key].draft.dom.css({ backgroundColor });
        });
        
        this.paneStyle.find('#Font-Color-cell').onChanged(color=>{
            craterApp.attributes.pane.content[key].draft.dom.css({ color });
        });

        this.paneStyle.addEventListener('mutated', event => {
            craterApp.attributes.pane.content[key].draft.pane.styles = this.paneStyle.innerHTML;
            craterApp.attributes.pane.content[key].draft.html = craterApp.attributes.pane.content[key].draft.dom.outerHTML;
        });
    }

    clearDraft(draft) {
        draft.pane.content = '';// clear draft content
        draft.pane.styles = '';// clear draft style
        draft.html = '';

        console.log('Draft cleared');
    }
}

export {
    PropertyPane
};