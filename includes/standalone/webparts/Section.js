function section() {
    let self = {};
    self.render = function (params) {
        params.height = params.height || '100px';
        let section = craterApp.craterWebparts.createKeyedElement({
            element: 'div', attributes: { class: 'crater-component crater-container crater-section', 'data-type': 'section', style: { minHeight: params.height } }, options: ['Append', 'Edit', 'Delete', 'Clone'], type: 'crater-section', alignOptions: 'right', children: [
                { element: 'div', attributes: { class: 'crater-section-content', id: 'crater-section-content' } }
            ]
        });

        self.key = section.dataset['key'];
        return section;
    }

    self.rendered = function (params) {
        self.element = params.element;
        self.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        //get the the section's view[tabbed, straight]
        let view = settings.linkWindow;

        //fetch the section menu
        let menu = self.element.find('.crater-section-menu');

        if (!kerdx.isnull(menu) && kerdx.isset(self.element.dataset.view) && self.element.dataset.view == 'Tabbed') {//if menu exists and section is tabbed
            menu.findAll('li').forEach(li => {
                let found = false;
                let owner = li.dataset.owner;
                for (let keyedElement of self.element.find('.crater-section-content').findAll('.keyed-element')) {
                    if (owner == keyedElement.dataset.key) {
                        found = true;
                        li.innerText = kerdx.isset(keyedElement.dataset.title) ? keyedElement.dataset.title : keyedElement.dataset.type;
                        break;
                    }
                }
                //remove menu that the webpart has been deleted
                if (!found) li.remove();
            });

            //onmneu clicked change to the webpart
            menu.addEventListener('click', event => {
                if (event.target.nodeName == 'LI') {
                    let li = event.target;
                    self.element.findAll('.keyed-element').forEach(keyedElement => {
                        keyedElement.classList.add('in-active');
                        if (li.dataset.owner == keyedElement.dataset.key) {
                            keyedElement.classList.remove('in-active');
                        }
                    });
                }
            });
            if (self.element.dataset.view == 'Tabbed') {
                //click the last menu
                let menuButtons = menu.findAll('li');
                menuButtons[menuButtons.length - 1].click();
            }
        }
        self.dragSize();
        craterApp.craterWebparts.showOptions(self.element);
    }

    self.dragSize = function () {
        self.element.cssRemove(['cursor']);
        if (!craterApp.inEditMode) return;
        let position,
            direction,
            keyedContainer = self.element.getParents('.keyed-element'),
            keyedContainerPosition = keyedContainer.position(),
            parent = self.element.parentNode,
            sections = parent.childNodes,
            nextSibling = self.element.nextSibling,
            previousSibling = self.element.previousSibling,
            sibling;

        let getDirection = (event) => {
            position = self.element.position();
            let along, from, cursor;
            if (event.x <= position.x + 8 && event.y <= position.y + 8) {
                cursor = 'se-resize';
                along = 'xandy';
                from = 'topleft';
            }
            else if (event.x >= position.x + position.width - 8 && event.y >= position.y + position.height - 8) {
                cursor = 'se-resize';
                along = 'xandy';
                from = 'bottomright';
            }
            else if (event.y <= position.y + 8 && event.x >= position.x + position.width - 8) {
                cursor = 'ne-resize';
                along = 'xandy';
                from = 'topright';
            }
            else if (event.x <= position.x + 8 && event.y >= position.y + position.height - 8) {
                cursor = 'ne-resize';
                along = 'xandy';
                from = 'bottomleft';
            }
            else if (event.x <= position.x + 8) {
                cursor = 'ew-resize';
                along = 'x';
                from = 'left';
            }
            else if (event.x >= position.x + position.width - 8) {
                cursor = 'ew-resize';
                along = 'x';
                from = 'right';
            }
            else if (event.y <= position.y + 8) {
                cursor = 'ns-resize';
                along = 'y';
                from = 'up';
            }
            else if (event.y >= position.y + position.height - 8) {
                cursor = 'ns-resize';
                along = 'y';
                from = 'bottom';
            }
            else if (event.type == 'mousemove') {
                cursor = 'unset';
            }

            return { along, from, cursor };
        };

        let showDirection = event => {
            let movement = getDirection(event);
            keyedContainer.css({ cursor: movement.cursor });
        };

        let resizeWidth = (event) => {
            position = self.element.position();
            //make sure that section does not exceed the bounds of the parent/crater
            if (direction.from.includes('left') && event.x > position.right || (direction.from.includes('right') && event.x < position.left)) {
                return;
            }

            //get the closest sibling to action
            if (direction.from.includes('left')) {
                sibling = previousSibling;
            }
            else if (direction.from.includes('right')) {
                sibling = nextSibling;
            }

            if (kerdx.isnull(sibling) || !sibling.classList.contains('crater-section')) {
                return;
            }

            //get the widths of section and sibling for reversing changes
            let currentWidth = position.width;
            let siblingWidth = sibling.position().width;

            if (event.x > position.left - 50 && event.x < position.right + 50) {
                let myWidth = currentWidth;

                if (event.x > position.left) {
                    //Set the new width of section
                    if (direction.from.includes('left')) {
                        myWidth = position.right - event.x;
                    }
                    else if (direction.from.includes('right')) {
                        myWidth = event.x - position.left;
                    }
                }
                else {
                    myWidth = position.right - event.x;
                }

                let mySiblingWidth = siblingWidth + (currentWidth - myWidth);

                // if section or siblings width is less than or equals 50 stop dragging
                if ((myWidth <= 50 || mySiblingWidth <= 50)) return;
                const keyedContainerSettings = JSON.parse(keyedContainer.dataset.settings);
                keyedContainerSettings.widths[sections.indexOf(self.element)] = myWidth + 'px';

                craterApp.attributes.pane.content[keyedContainer.dataset.key].settings.widths[sections.indexOf(self.element)] = myWidth + 'px';

                craterApp.attributes.pane.content[keyedContainer.dataset.key].settings.widths[sections.indexOf(sibling)] = mySiblingWidth + 'px';

                craterApp.attributes.pane.content[keyedContainer.dataset.key].settings.columnsSizes = kerdx.stringReplace(craterApp.attributes.pane.content[keyedContainer.dataset.key].settings.widths.toString(), ',', ' ');

                parent.css({ gridTemplateColumns: craterApp.attributes.pane.content[keyedContainer.dataset.key].settings.columnsSizes });
            }
        };

        let resizeHeight = (event) => {
            position = self.element.position();
            // make sure that section does not exceed the bounds of the parent/crater
            if (direction.from.includes('top') && event.y > keyedContainerPosition.bottom || (direction.from.includes('bottom') && event.y < keyedContainerPosition.top)) {
                return;
            }

            let currentHeight = position.height;

            if (event.y > keyedContainerPosition.top - 100 && event.y < keyedContainerPosition.bottom) {
                let myHeight = currentHeight;

                if (event.y > keyedContainerPosition.top) {
                    //Set the new width of section
                    if (direction.from.includes('top')) {
                        myHeight = keyedContainerPosition.bottom - event.y;
                    }
                    else if (direction.from.includes('bottom')) {
                        myHeight = event.y - keyedContainerPosition.top;
                    }
                }
                else {
                    myHeight = keyedContainerPosition.bottom - event.y;
                }

                if (myHeight >= 100) {
                    self.element.css({ minHeight: `${myHeight}px` });
                }
            }
        };

        let drag = event => {
            if (kerdx.isset(direction.along)) {
                if (direction.along == 'y') {
                    keyedContainer.addEventListener('mousemove', resizeHeight, false);
                }
                else if (direction.along == 'x') {
                    keyedContainer.addEventListener('mousemove', resizeWidth, false);
                }
                else if (direction.along == 'xandy') {
                    keyedContainer.addEventListener('mousemove', resizeWidth, false);
                    keyedContainer.addEventListener('mousemove', resizeHeight, false);
                }
            }
        };

        self.element.addEventListener('mousemove', getDirection, false);

        self.element.addEventListener('mousedown', event => {
            self.element.removeEventListener('mousemove', getDirection, false);
            direction = getDirection(event);
            self.element.addEventListener('mousemove', drag, false);
            keyedContainer.css({ cursor: direction.cursor });
        });

        self.element.addEventListener('mouseup', event => {
            self.element.addEventListener('mousemove', getDirection, false);
            self.element.removeEventListener('mousemove', drag, false);
            keyedContainer.cssRemove(['cursor']);
        });

        keyedContainer.addEventListener('mouseup', event => {
            keyedContainer.removeEventListener('mousemove', resizeHeight, false);
            keyedContainer.removeEventListener('mousemove', resizeWidth, false);
            keyedContainer.cssRemove(['cursor']);
        });

        keyedContainer.addEventListener('leave', event => {
            keyedContainer.removeEventListener('mousemove', resizeHeight, false);
            keyedContainer.removeEventListener('mousemove', resizeWidth, false);
            keyedContainer.cssRemove(['cursor']);
        });
    }

    self.generatePaneContent = function (params) {
        let sectionContentsPane = kerdx.createElement({
            element: 'div', attributes: { class: 'card section-contents-pane' }, children: [
                kerdx.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        kerdx.createElement({
                            element: 'h2', attributes: { class: 'title' }, text: 'Section Contents'
                        })
                    ]
                }),
            ]
        });

        //set the pane for all the webparts in the section
        for (let i = 0; i < params.source.length; i++) {
            sectionContentsPane.makeElement({
                element: 'div',
                attributes: {
                    style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'row crater-section-content-row-pane'
                },
                children: [
                    craterApp.craterWebparts.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-section-content-row' }),
                    { element: 'span', attributes: { class: 'crater-section-webpart-name' }, text: params.source[i].dataset.type }
                ]
            });
        }

        return sectionContentsPane;
    }

    self.setUpPaneContent = function (params) {
        self.element = params.element;
        self.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        self.paneContent = kerdx.createElement({
            element: 'div',
            attributes: { class: 'crater-property-content' }
        }).monitor();

        //fetch the sections view
        let view = settings.linkWindow;

        if (craterApp.attributes.pane.content[self.key].draft.pane.content != '') {
            self.paneContent.innerHTML = craterApp.attributes.pane.content[self.key].draft.pane.content;
        }
        else if (craterApp.attributes.pane.content[self.key].content != '') {
            self.paneContent.innerHTML = craterApp.attributes.pane.content[self.key].content;
        }
        else {
            self.paneContent.makeElement({
                element: 'div', children: [
                    kerdx.createElement({
                        element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
                    })
                ]
            });

            let elementContents = self.element.find('.crater-section-content').findAll('.keyed-element');

            self.paneContent.append(self.generatePaneContent({ source: elementContents }));

            let settingsPane = self.paneContent.makeElement({
                element: 'div', attributes: { class: 'card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
                    kerdx.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            kerdx.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Settings'
                            })
                        ]
                    }),
                ]
            });
        }

        let contents = self.element.find('.crater-section-content').findAll('.keyed-element');
        self.paneContent.find('.section-contents-pane').innerHTML = self.generatePaneContent({ source: contents }).innerHTML;

        return self.paneContent;
    }

    self.listenPaneContent = function (params) {
        self.element = params.element;
        self.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        self.paneContent = craterApp.app.find('.crater-property-content').monitor();

        let sectionContents = craterApp.attributes.pane.content[self.key].draft.dom.find('.crater-section-content');

        let sectionContentDom = sectionContents.childNodes;
        let sectionContentPane = self.paneContent.find('.section-contents-pane');

        //create section content pane prototype
        let sectionContentPanePrototype = kerdx.createElement({
            element: 'div',
            attributes: {
                style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-section-content-row-pane row'
            },
            children: [
                craterApp.craterWebparts.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-section-content-row' }),
                kerdx.createElement({
                    element: 'span', attributes: { class: 'crater-section-webpart-name' }
                }),
            ]
        });

        //set all the event listeners for the section webparts[add before & after, delete]
        let sectionContentRowHandler = (sectionContentRowPane, sectionContentRowDom) => {

            sectionContentRowPane.addEventListener('mouseover', event => {
                sectionContentRowPane.find('.crater-content-options').css({ visibility: 'visible' });
            });

            sectionContentRowPane.addEventListener('mouseout', event => {
                sectionContentRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
            });

            sectionContentRowPane.find('.crater-section-webpart-name').textContent = sectionContentRowDom.dataset.type;

            sectionContentRowPane.find('.delete-crater-section-content-row').addEventListener('click', event => {
                sectionContentRowDom.remove();
                sectionContentRowPane.remove();
            });

            sectionContentRowPane.find('.add-before-crater-section-content-row').addEventListener('click', event => {
                self.paneContent.append(
                    craterApp.displayPanel(webpart => {
                        let newSectionContent = craterApp.appendWebpart(sectionContents, webpart.dataset.webpart);
                        sectionContentRowDom.before(newSectionContent.cloneNode(true));
                        newSectionContent.remove();

                        let newSectionContentRow = sectionContentPanePrototype.cloneNode(true);
                        sectionContentRowPane.after(newSectionContentRow);

                        sectionContentRowHandler(newSectionContentRow, newSectionContent);
                    })
                );
            });

            sectionContentRowPane.find('.add-after-crater-section-content-row').addEventListener('click', event => {
                self.paneContent.append(
                    craterApp.displayPanel(webpart => {
                        let newSectionContent = craterApp.appendWebpart(sectionContents, webpart.dataset.webpart);
                        sectionContentRowDom.after(newSectionContent.cloneNode(true));
                        newSectionContent.remove();

                        let newSectionContentRow = sectionContentPanePrototype.cloneNode(true);
                        sectionContentRowPane.after(newSectionContentRow);

                        sectionContentRowHandler(newSectionContentRow, newSectionContent);
                    })
                );
            });
        };

        //add new webpart to the section
        self.paneContent.find('.new-component').addEventListener('click', event => {
            self.paneContent.append(
                //show the display panel and add the selected webpart
                craterApp.displayPanel(webpart => {
                    let newSectionContent = craterApp.appendWebpart(sectionContents, webpart.dataset.webpart);
                    let newSectionContentRow = sectionContentPanePrototype.cloneNode(true);
                    sectionContentPane.append(newSectionContentRow);

                    //listen for events on new webpart
                    sectionContentRowHandler(newSectionContentRow, newSectionContent);
                })
            );
        });

        self.paneContent.findAll('.crater-section-content-row-pane').forEach((sectionContent, position) => {
            //listen for events on all webparts
            sectionContentRowHandler(sectionContent, sectionContentDom[position]);
        });

        //monitor pane contents and note the changes
        self.paneContent.addEventListener('mutated', event => {
            craterApp.attributes.pane.content[self.key].draft.pane.content = self.paneContent.innerHTML;
            craterApp.attributes.pane.content[self.key].draft.html = craterApp.attributes.pane.content[self.key].draft.dom.outerHTML;
        });

        //save the the noted changes when save button is clicked
        self.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            craterApp.attributes.pane.content[self.key].content = self.paneContent.innerHTML;//update webpart
            self.element.innerHTML = craterApp.attributes.pane.content[self.key].draft.dom.innerHTML;

            self.element.css(craterApp.attributes.pane.content[self.key].draft.dom.css());

            let keyedElements = sectionContents.children;
            for (let i = 0; i < keyedElements.length; i++) {
                craterApp.craterWebparts[keyedElements[i].dataset.type]({ action: 'rendered', element: keyedElements[i], sharePoint: craterApp });
            }

            craterApp.saveSettings(self.element, settings);
        });
    }

    return self;
}

export { section };