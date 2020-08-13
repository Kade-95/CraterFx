import { Kerdx } from 'https://kade-95.github.io/kerdx/index.js';
window.kerdx = new Kerdx();

import { accordion } from '../webparts/Accordion.js';
// import { Background } from '../webparts/Background.js';
// import { BeforeAfter } from '../webparts/BeforeAfter.js';
// import { Birthday } from '../webparts/Birthday.js';
// import { Buttons } from '../webparts/Buttons.js';
// import { Calendar } from '../webparts/Calender.js';
// import { Carousel } from '../webparts/Carousel.js';
// import { CountDown } from '../webparts/CountDown.js';
// import { Counter } from '../webparts/Counter.js';
import { crater } from '../webparts/Crater.js';
// import { DateList } from '../webparts/DateList.js';
// import { EmployeeDirectory } from '../webparts/EmployeeDirectory.js';
// import { Event } from '../webparts/Event.js';
// import { Facebook } from '../webparts/Facebook.js';
// import { Frame } from '../webparts/Frame.js';
// import { Icons } from '../webparts/Icons.js';
// import { Instagram } from '../webparts/Instagram.js';
// import { List } from '../webparts/List.js';
// import { Map } from '../webparts/Map.js';
// import { News } from '../webparts/News.js';
// import { NewsCarousel } from '../webparts/NewsCarousel.js';
// import { Panel } from '../webparts/Panel.js';
// import { PowerBI } from '../webparts/PowerBI.js';
import { section } from '../webparts/Section.js';
// import { Slider } from '../webparts/Slider.js';
// import { Tab } from '../webparts/Tab.js';
// import { Table } from '../webparts/Table.js';
// import { TextArea } from '../webparts/TextArea.js';
// import { ThreeDimensionalSlider } from '../webparts/ThreeDimensionalSlider.js';
// import { Tiles } from '../webparts/Tiles.js';
// import { Twitter } from '../webparts/Twitter.js';
// import { YouTube } from '../webparts/Youtube.js';
// import { Row } from '../webparts/Row.js';
// import { TaskManager } from '../webparts/TaskManager.js';
// import { Image } from '../webparts/Image.js';
// import { ImageCaption } from '../webparts/ImageCaption.js';


export class CraterWebParts {
    menu(params) {
        //create the menu element
        let menus = kerdx.createElement({
            element: 'ul', attributes: { class: 'crater-menu' }
        });

        //add the menu children and set the width
        for (let menu of params.content) {
            menus.makeElement({
                element: 'li', attributes: { id: `${menu.owner.toLowerCase()}-menu-item`, class: 'crater-menu-item', 'data-owner': menu.owner }, children: [
                    { element: 'img', attributes: { class: 'crater-menu-item-icon', src: menu.icon || '' } },
                    { element: 'a', attributes: { class: 'crater-menu-item-text' }, text: menu.name }
                ]
            });
        }
        menus.css({ gridTemplateColumns: `repeat(${params.content.length}, 1fr)` });
        return menus;
    }

    loadCss(element) {
        let styles = [
            'styles/root.css',
            'styles/containers.css',
            'styles/editwindow.css',
            'styles/displayPanel.css',
            'styles/animations.css',
            'styles/connection.css',
            'styles/crater.css',
            'styles/form.css',
            'styles/event.css',
            'styles/list.css',
            'styles/slider.css',
            'styles/counter.css',
            'styles/tiles.css',
            'styles/sections.css',
            'styles/news.css',
            'styles/table.css',
            'styles/panel.css',
            'styles/special.css',
            'styles/textarea.css',
            'styles/icons.css',
            'styles/buttons.css',
            'styles/countdown.css',
            'styles/tab.css',
            'styles/carousel.css',
            'styles/map.css',
            'styles/datelist.css',
            'styles/instagram.css',
            'styles/beforeafter.css',
            'styles/table.css',
            'styles/powerbi.css',
            'styles/calender.css',
            'styles/employeedirectory.css',
            'styles/accordion.css',
            'styles/birthday.css',
            'styles/newscarousel.css',
            'styles/background.css',
            'styles/threedimentionalslider.css',
            'styles/taskmanager.css',
            'styles/row.css',
            'styles/image.css',
            'styles/frame.css',
            'styles/imagecaption.css',
            './../../fontawesome/css/all.css'
        ];

        for (let style of styles) {
            element.makeElement({
                element: 'link', attributes: { href: style, type: 'text/css', rel: 'stylesheet' }
            });
        }
    }

    setCraterKey(element) {
        return new Promise((resolve, reject) => {
            let key = '';
            let found = false;
            if (!kerdx.isset(window['craterdom'])) window['craterdom'] = {};
            if (!element.hasAttribute('domKey')) {
                do {
                    key = kerdx.generateRandom(32);
                    found = kerdx.isset(window['craterdom'][key]);
                } while (found);

                element.dataset.craterKey = key;
                window['craterdom'][key] = this;
            }
            resolve(key);
        });
    }

    showOptions(element) {
        let handlePaste = (webpart) => {
            if (webpart.classList.contains('crater-container')) {
                if (craterApp.pasteActive) {
                    webpart.find('.webpart-options').find('#paste-me').show();
                } else {
                    webpart.find('.webpart-options').find('#paste-me').hide();
                }
            }
            else if (webpart.classList.contains('crater-crater')) {
                if (kerdx.isset(localStorage.craterClone)) {
                    webpart.find('.webpart-options').find('#paste-me').show();
                }
                else {
                    webpart.find('.webpart-options').find('#paste-me').hide();
                }
            }
        };

        if (element.hasAttribute('data-key')) {
            craterApp.dontSave = true;
            element.find('.webpart-options').hide();
        }

        element.findAll('.keyed-element').forEach(keyedElement => {
            if (keyedElement.hasAttribute('data-key')) {
                craterApp.dontSave = true;
                keyedElement.find('.webpart-options').hide();
            }
        });

        element.addEventListener('mouseenter', event => {
            craterApp.dontSave = true;
            if (element.hasAttribute('data-key') && craterApp.inEditMode()) {
                element.find('.webpart-options').show();
                handlePaste(element);
            }
        });

        element.addEventListener('mouseleave', event => {
            if (element.hasAttribute('data-key')) {
                craterApp.dontSave = true;
                element.find('.webpart-options').hide();
            }
        });

        element.findAll('.keyed-element').forEach(keyedElement => {
            keyedElement.addEventListener('mouseenter', event => {
                if (keyedElement.hasAttribute('data-key') && craterApp.inEditMode()) {
                    craterApp.dontSave = true;
                    keyedElement.find('.webpart-options').show();
                    handlePaste(keyedElement);
                }
            });

            keyedElement.addEventListener('mouseleave', event => {
                if (keyedElement.hasAttribute('data-key')) {
                    craterApp.dontSave = true;
                    keyedElement.find('.webpart-options').hide();
                }
            });
        });
    }

    createKeyedElement(params) {
        let key = this.generateKey();
        if (!kerdx.isset(params.attributes)) params.attributes = {};
        params.attributes['data-key'] = key;
        if (!kerdx.isset(params.attributes['data-type'])) params.attributes['data-type'] = 'sample';

        craterApp.attributes.pane.content[key] = { content: '', styles: '', connection: '', settings: {}, sync: {}, draft: { dom: '', html: '', pane: { content: '', styles: '', connection: '' } } };

        if (!kerdx.isset(params.options)) params.options = ['Edit', 'Delete', 'Clone'];

        let options = params.options;
        delete params.options;

        let element = kerdx.createElement(params);
        element.dataset.settings = JSON.stringify({ linkWindow: 'Pop Up' });

        if (element.classList.contains('crater-container')) {
            options.push('Paste');
        }

        let optionsMenu = this.webPartOptions({ options, title: params.attributes['data-type'] });

        element.prepend(optionsMenu);

        if (kerdx.isset(params.alignOptions)) {
            let align = {};
            if (params.alignOptions == 'bottom') {
                element.find('.webpart-options').css({ top: 'unset' });
            }
            align[params.alignOptions] = '0px';
            element.find('.webpart-options').css(align);
            if (params.alignOptions == 'center') {
                element.find('.webpart-options').css({ margin: '0em 3em' });
            }
        }

        element.classList.add('keyed-element');

        if (craterApp.connectable.includes(params.attributes['data-type'].toLowerCase())) {
            element.dataset.connectible = 'true';
        }

        return element;
    }

    webPartOptions(params) {
        let optionContainer = kerdx.createElement({
            element: 'div', attributes: { class: 'webpart-options', style: { background: 'rgba(225, 225, 225, .8)' } }
        });

        let options = {
            append: craterApp.icons.plus,
            view: craterApp.icons.eye,
            edit: craterApp.icons.pen,
            delete: craterApp.icons.trash,
            clone: craterApp.icons.copy,
            paste: craterApp.icons.paste,
            undo: craterApp.icons.undo,
            redo: craterApp.icons.redo
        };


        for (let option of params.options) {
            optionContainer.makeElement({
                element: 'i', attributes: {
                    class: 'webpart-option', id: option.toLowerCase() + '-me', 'data-icon': options[option.toLowerCase()], alt: option[0], title: `${option} ${params.title}`, style: { display: option.toLowerCase() == 'paste' ? 'none' : '' }
                }
            });
        }

        if (kerdx.isset(params.attributes)) optionContainer.setAttributes(params.attributes);
        return optionContainer;
    }

    generateKey() {
        let found = true;
        let key = kerdx.generateRandom(10);
        while (found) {
            key = kerdx.generateRandom(10);
            found = craterApp.attributes.pane.content.hasOwnProperty(key);
        }
        return key;
    }

    paneOptions(params) {
        //create the options element
        let options = kerdx.createElement({
            element: 'span', attributes: { class: 'crater-content-options', style: { visibility: 'hidden' } }
        });

        //set the options data
        let paneOptionsData = {
            'AB': { title: 'Add Before', class: 'add-before' },
            'AA': { title: 'Add After', class: 'add-after' },
            'D': { title: 'Delete', class: 'delete' }
        };

        //append the options data to options
        if (kerdx.isset(params.options)) {
            for (let option of params.options) {
                options.makeElement({
                    element: 'button', text: option, attributes: { class: `${paneOptionsData[option].class}-${params.owner} small btn`, title: paneOptionsData[option].title }
                });
            }
        }
        else {
            options.append(
                kerdx.createElement({
                    element: 'button', text: 'AB', attributes: { class: `add-before-${params.owner} small btn`, title: 'Add Before' }
                }),
                kerdx.createElement({
                    element: 'button', text: 'AA', attributes: { class: `add-after-${params.owner} small btn`, title: 'Add After' }
                }),
                kerdx.createElement({
                    element: 'button', text: 'D', attributes: { class: `delete-${params.owner} small btn`, title: 'Delete Row' }
                })
            );
        }

        return options;
    }

    createStyleBlock(params) {
        //create the block
        let block = kerdx.createElement({
            element: 'div', attributes: { class: 'card crater-style-block', style: { margin: '1em', position: 'relative' } }, sync: true, children: [
                kerdx.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        kerdx.createElement({
                            //set the block title
                            element: 'h2', attributes: { class: 'title' }, text: params.title
                        })
                    ]
                }),
            ]
        });

        let blockRow = block.makeElement({
            element: 'div', attributes: { class: 'row' }
        });

        let key = params.element.dataset['key'];

        if (kerdx.isset(params.options)) {//set the options
            let styleOptions = block.makeElement({
                element: 'div', attributes: { class: 'crater-style-options' }
            });

            if (kerdx.isset(params.options.sync)) {//set the sync and async option
                if (!kerdx.isset(craterApp.attributes.pane.content[key].sync[params.title.toLowerCase()])) {
                    craterApp.attributes.pane.content[key].sync[params.title.toLowerCase()] = false;
                }

                let sync = craterApp.attributes.pane.content[key].sync[params.title.toLowerCase()];

                styleOptions.makeElement({
                    element: 'img', attributes: {
                        class: 'crater-style-option crater-toggle-style-sync', alt: sync ? 'Async' : 'Sync', src: sync ? craterApp.images.sync : craterApp.images.async, 'data-style': params.title.toLowerCase()
                    }
                });
            }
        }

        for (let i in params.children) {//append the style data to the block
            let value = '';
            if (kerdx.isset(params.element.css()[kerdx.cssStyleName(i)])) {
                value = params.element.css()[kerdx.cssStyleName(i)];
            }
            let styleSync = '';
            if (kerdx.isset(params.options) && kerdx.isset(params.options.sync)) {
                styleSync = params.title.toLowerCase();
            }

            if (i == 'backgroundImage') {
                blockRow.append(kerdx.cell({
                    element: 'img', edit: 'upload-image', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-icon crater-style-attr' }, name: params.children[i], value, src: craterApp.images.append
                }));
            }
            else if (i == 'fontFamily') {
                let list = kerdx.fontStyles;
                blockRow.append(kerdx.cell({
                    element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list
                }));
            }
            else if (kerdx.isSubString(i, 'color') || kerdx.isSubString(i, 'Color')) {
                let list = kerdx.colors;
                blockRow.append(kerdx.cell({
                    element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list
                }));
            }
            else if (i == 'fontWeight') {
                blockRow.append(kerdx.cell({
                    element: 'select', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, options: kerdx.boldness
                }));
            }
            else if (i == 'fontSize') {
                blockRow.append(kerdx.cell({
                    element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list: kerdx.pixelSizes
                }));
            }
            else {
                blockRow.append(kerdx.cell({
                    element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value
                }));
            }
        }

        return block;
    }
}

function setElements() {
     	CraterWebParts.prototype['accordion'] = params => {
    		return accordion()[params.action](params);
    	};

    // 	CraterWebParts.prototype['imagecaption'] = params => {
    // 		let imagecaption = new ImageCaption({ sharePoint: params.sharePoint });
    // 		return imagecaption[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['image'] = params => {
    // 		let image = new Image({ sharePoint: params.sharePoint });
    // 		return image[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['taskmanager'] = params => {
    // 		let taskmanager = new TaskManager({ sharePoint: params.sharePoint });
    // 		return taskmanager[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['row'] = params => {
    // 		let row = new Row({ sharePoint: params.sharePoint });
    // 		return row[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['threedimensionalslider'] = params => {
    // 		let threedimensionalslider = new ThreeDimensionalSlider({ sharePoint: params.sharePoint });
    // 		return threedimensionalslider[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['background'] = params => {
    // 		let background = new Background({ sharePoint: params.sharePoint });
    // 		return background[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['newscarousel'] = params => {
    // 		let newscarousel = new NewsCarousel({ sharePoint: params.sharePoint });
    // 		return newscarousel[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['frame'] = params => {
    // 		let frame = new Frame({ sharePoint: params.sharePoint });
    // 		return frame[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['calendar'] = params => {
    // 		let calendar = new Calendar({ sharePoint: params.sharePoint });
    // 		return calendar[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['twitter'] = params => {
    // 		let twitter = new Twitter({ sharePoint: params.sharePoint });
    // 		return twitter[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['birthday'] = params => {
    // 		let birthday = new Birthday({ sharePoint: params.sharePoint });
    // 		return birthday[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['employeedirectory'] = params => {
    // 		let employeeDirectory = new EmployeeDirectory({ sharePoint: params.sharePoint });
    // 		return employeeDirectory[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['powerbi'] = params => {
    // 		let powerbi = new PowerBI({ sharePoint: params.sharePoint });
    // 		return powerbi[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['event'] = params => {
    // 		let event = new Event({ sharePoint: params.sharePoint });
    // 		return event[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['youtube'] = params => {
    // 		let youtube = new YouTube({ sharePoint: params.sharePoint });
    // 		return youtube[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['facebook'] = params => {
    // 		let facebook = new Facebook({ sharePoint: params.sharePoint });
    // 		return facebook[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['beforeafter'] = params => {
    // 		let beforeafter = new BeforeAfter({ sharePoint: params.sharePoint });
    // 		return beforeafter[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['map'] = params => {
    // 		let map = new Map({ sharePoint: params.sharePoint });
    // 		return map[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['datelist'] = params => {
    // 		let datelist = new DateList({ sharePoint: params.sharePoint });
    // 		return datelist[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['instagram'] = params => {
    // 		let instagram = new Instagram({ sharePoint: params.sharePoint });
    // 		return instagram[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['carousel'] = params => {
    // 		let carousel = new Carousel({ sharePoint: params.sharePoint });
    // 		return carousel[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['tab'] = params => {
    // 		let tab = new Tab({ sharePoint: params.sharePoint });
    // 		return tab[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['countdown'] = params => {
    // 		let countdown = new CountDown({ sharePoint: params.sharePoint });
    // 		return countdown[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['buttons'] = params => {
    // 		let buttons = new Buttons({ sharePoint: params.sharePoint });
    // 		return buttons[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['icons'] = params => {
    // 		let icons = new Icons({ sharePoint: params.sharePoint });
    // 		return icons[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['textarea'] = params => {
    // 		let textarea = new TextArea({ sharePoint: params.sharePoint });
    // 		return textarea[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['news'] = params => {
    // 		let news = new News({ sharePoint: params.sharePoint });
    // 		return news[params.action](params);
    // 	};

    CraterWebParts.prototype['crater'] = params => {
        return crater()[params.action](params);
    };

    // 	CraterWebParts.prototype['panel'] = params => {
    // 		let panel = new Panel({ sharePoint: params.sharePoint });
    // 		return panel[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['table'] = params => {
    // 		let table = new Table({ sharePoint: params.sharePoint });
    // 		return table[params.action](params);
    // 	};

    CraterWebParts.prototype['section'] = params => {
        return section()[params.action](params);
    };

    // 	CraterWebParts.prototype['slider'] = params => {
    // 		let slider = new Slider({ sharePoint: params.sharePoint });
    // 		return slider[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['list'] = params => {
    // 		let list = new List({ sharePoint: params.sharePoint });
    // 		return list[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['counter'] = params => {
    // 		let counter = new Counter({ sharePoint: params.sharePoint });
    // 		return counter[params.action](params);
    // 	};

    // 	CraterWebParts.prototype['tiles'] = params => {
    // 		let tiles = new Tiles({ sharePoint: params.sharePoint });
    // 		return tiles[params.action](params);
    // 	};
    // 

}

setElements();