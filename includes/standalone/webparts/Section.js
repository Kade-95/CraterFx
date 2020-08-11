import { ElementModifier } from './../ElementModifier';
import { CraterWebParts } from './../CraterWebParts';

class Section extends ElementModifier {
    public params: any;
    private element: any;
    private paneContent: any;
    private key: any;
    private craterWebparts: any;

    constructor(params) {
        super({ sharePoint: params.sharePoint });
        this.sharePoint = params.sharePoint;
        this.params = params;
        this.craterWebparts = new CraterWebParts(params);
    }

    public render(params) {
        params.height = params.height || '100px';
        let section = this.createKeyedElement({
            element: 'div', attributes: { class: 'crater-component crater-container crater-section', 'data-type': 'section', style: { minHeight: params.height } }, options: ['Append', 'Edit', 'Delete', 'Clone'], type: 'crater-section', alignOptions: 'right', children: [
                { element: 'div', attributes: { class: 'crater-section-content', id: 'crater-section-content' } }
            ]
        });
        
        this.key = section.dataset['key'];
        return section;
    }

    public rendered(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        //get the the section's view[tabbed, straight]
        let view = settings.linkWindow;

        //fetch the section menu
        let menu = this.element.find('.crater-section-menu');

        if (!this.func.isnull(menu) && this.func.isset(this.element.dataset.view) && this.element.dataset.view == 'Tabbed') {//if menu exists and section is tabbed
            menu.findAll('li').forEach(li => {
                let found = false;
                let owner = li.dataset.owner;
                for (let keyedElement of this.element.find('.crater-section-content').findAll('.keyed-element')) {
                    if (owner == keyedElement.dataset.key) {
                        found = true;
                        li.innerText = this.func.isset(keyedElement.dataset.title) ? keyedElement.dataset.title : keyedElement.dataset.type;
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
                    this.element.findAll('.keyed-element').forEach(keyedElement => {
                        keyedElement.classList.add('in-active');
                        if (li.dataset.owner == keyedElement.dataset.key) {
                            keyedElement.classList.remove('in-active');
                        }
                    });
                }
            });
            if (this.element.dataset.view == 'Tabbed') {
                //click the last menu
                let menuButtons = menu.findAll('li');
                menuButtons[menuButtons.length - 1].click();
            }
        }
        this.dragSize();
        this.showOptions(this.element);
    }

    private dragSize() {
        this.element.cssRemove(['cursor']);
        if (!this.sharePoint.inEditMode) return;
        let position,
            direction,
            keyedContainer = this.element.getParents('.keyed-element'),
            keyedContainerPosition = keyedContainer.position(),
            parent = this.element.parentNode,
            sections = parent.childNodes,
            nextSibling = this.element.nextSibling,
            previousSibling = this.element.previousSibling,
            sibling;

        let getDirection = (event) => {
            position = this.element.position();
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
            position = this.element.position();
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

            if (this.func.isnull(sibling) || !sibling.classList.contains('crater-section')) {
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
                keyedContainerSettings.widths[sections.indexOf(this.element)] = myWidth + 'px';

                this.sharePoint.attributes.pane.content[keyedContainer.dataset.key].settings.widths[sections.indexOf(this.element)] = myWidth + 'px';

                this.sharePoint.attributes.pane.content[keyedContainer.dataset.key].settings.widths[sections.indexOf(sibling)] = mySiblingWidth + 'px';

                this.sharePoint.attributes.pane.content[keyedContainer.dataset.key].settings.columnsSizes = this.func.stringReplace(this.sharePoint.attributes.pane.content[keyedContainer.dataset.key].settings.widths.toString(), ',', ' ');

                parent.css({ gridTemplateColumns: this.sharePoint.attributes.pane.content[keyedContainer.dataset.key].settings.columnsSizes });
            }
        };

        let resizeHeight = (event) => {
            position = this.element.position();
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
                    this.element.css({ minHeight: `${myHeight}px` });
                }
            }
        };

        let drag = event => {
            if (this.func.isset(direction.along)) {
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

        this.element.addEventListener('mousemove', getDirection, false);

        this.element.addEventListener('mousedown', event => {
            this.element.removeEventListener('mousemove', getDirection, false);
            direction = getDirection(event);
            this.element.addEventListener('mousemove', drag, false);
            keyedContainer.css({ cursor: direction.cursor });
        });

        this.element.addEventListener('mouseup', event => {
            this.element.addEventListener('mousemove', getDirection, false);
            this.element.removeEventListener('mousemove', drag, false);
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

    private generatePaneContent(params) {
        let sectionContentsPane = this.createElement({
            element: 'div', attributes: { class: 'card section-contents-pane' }, children: [
                this.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        this.createElement({
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
                    this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-section-content-row' }),
                    { element: 'span', attributes: { class: 'crater-section-webpart-name' }, text: params.source[i].dataset.type }
                ]
            });
        }

        return sectionContentsPane;
    }

    private setUpPaneContent(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);
        this.paneContent = this.createElement({
            element: 'div',
            attributes: { class: 'crater-property-content' }
        }).monitor();

        //fetch the sections view
        let view = settings.linkWindow;

        if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
        }
        else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
        }
        else {
            this.paneContent.makeElement({
                element: 'div', children: [
                    this.createElement({
                        element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
                    })
                ]
            });

            let elementContents = this.element.find('.crater-section-content').findAll('.keyed-element');

            this.paneContent.append(this.generatePaneContent({ source: elementContents }));

            let settingsPane = this.paneContent.makeElement({
                element: 'div', attributes: { class: 'card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Settings'
                            })
                        ]
                    }),
                ]
            });
        }

        let contents = this.element.find('.crater-section-content').findAll('.keyed-element');
        this.paneContent.find('.section-contents-pane').innerHTML = this.generatePaneContent({ source: contents }).innerHTML;

        return this.paneContent;
    }

    private listenPaneContent(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        let settings = JSON.parse(params.element.dataset.settings);

        this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

        let sectionContents = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-section-content');

        let sectionContentDom = sectionContents.childNodes;
        let sectionContentPane = this.paneContent.find('.section-contents-pane');

        //create section content pane prototype
        let sectionContentPanePrototype = this.createElement({
            element: 'div',
            attributes: {
                style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-section-content-row-pane row'
            },
            children: [
                this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-section-content-row' }),
                this.createElement({
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
                this.paneContent.append(
                    this.sharePoint.displayPanel(webpart => {
                        let newSectionContent = this.sharePoint.appendWebpart(sectionContents, webpart.dataset.webpart);
                        sectionContentRowDom.before(newSectionContent.cloneNode(true));
                        newSectionContent.remove();

                        let newSectionContentRow = sectionContentPanePrototype.cloneNode(true);
                        sectionContentRowPane.after(newSectionContentRow);

                        sectionContentRowHandler(newSectionContentRow, newSectionContent);
                    })
                );
            });

            sectionContentRowPane.find('.add-after-crater-section-content-row').addEventListener('click', event => {
                this.paneContent.append(
                    this.sharePoint.displayPanel(webpart => {
                        let newSectionContent = this.sharePoint.appendWebpart(sectionContents, webpart.dataset.webpart);
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
        this.paneContent.find('.new-component').addEventListener('click', event => {
            this.paneContent.append(
                //show the display panel and add the selected webpart
                this.sharePoint.displayPanel(webpart => {
                    let newSectionContent = this.sharePoint.appendWebpart(sectionContents, webpart.dataset.webpart);
                    let newSectionContentRow = sectionContentPanePrototype.cloneNode(true);
                    sectionContentPane.append(newSectionContentRow);

                    //listen for events on new webpart
                    sectionContentRowHandler(newSectionContentRow, newSectionContent);
                })
            );
        });

        this.paneContent.findAll('.crater-section-content-row-pane').forEach((sectionContent, position) => {
            //listen for events on all webparts
            sectionContentRowHandler(sectionContent, sectionContentDom[position]);
        });

        //monitor pane contents and note the changes
        this.paneContent.addEventListener('mutated', event => {
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        //save the the noted changes when save button is clicked
        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
            this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;

            this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

            let keyedElements = sectionContents.children;
            for (let i = 0; i < keyedElements.length; i++) {
                this.craterWebparts[keyedElements[i].dataset.type]({ action: 'rendered', element: keyedElements[i], sharePoint: this.sharePoint });
            }

            this.sharePoint.saveSettings(this.element, settings);
        });
    }
}

export { Section };