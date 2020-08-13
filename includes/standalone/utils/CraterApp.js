import { CraterWebParts } from './CraterWebParts.js';
import { Connection } from './Connection.js';
import { Icons } from './Icons.js';
import { Images } from './Images.js';
import { PropertyPane } from './PropertyPane.js';

export class CraterApp {
	constructor() {
		this.domContent;
		this.app;
		this.propertyPane = new PropertyPane({ sharePoint: this });
		this.saved = false;
		this.editted = false;
		this.changingState = false;
		this.savedWebPart;
		this.dontSave = false;
		this.craterWebparts = new CraterWebParts({ sharePoint: this });
		this.displayPanelWindow;
		this.displayPanelWindowExpanded = false;
		this.pasteActive = false;
		this.pasteElement;
		this.stored = {};
		this.minHeight = '500px';
		this.connectable = [
			'list', 'slider', 'counter', 'tiles', 'news', 'table', 'buttons', 'events', 'carousel', 'datelist', 'event', 'accordion', 'newscarousel', 'threedimensionalslider'
		];
		this.containers = [
			'section', 'tab', 'panel', 'crater', 'row'
		];
		this.webparts = [
			'Panel', 'List', 'Slider', 'Counter', 'Tiles', 'News', 'Table', 'TextArea', 'Icons', 'Buttons', 'Count Down', 'Tab', 'Events', 'Carousel', 'Map', 'Date List', 'Instagram', 'Facebook', 'Youtube', 'Twitter', 'Before After', 'Event', 'PowerBI', 'Employee Directory', 'Birthday', 'Calendar', 'Frame', 'Accordion', 'News Carousel', 'Three Dimensional Slider', 'Background', 'Row', 'Image', 'Image Caption'
		];

		this.properties = {
			page: location.origin + location.pathname,
			dom: {
				generated: false,
				content: ""
			},
			pane: {
				generated: false,
				content: {}
			},
			states: {
				currentPosition: 0,
				data: []
			}
		};

		this.attributes = {
			page: location.origin + location.pathname,
			dom: {
				generated: false,
				content: ""
			},
			pane: {
				generated: false,
				content: {}
			},
			states: {
				currentPosition: 0,
				data: []
			}
		};

		this.prototypes = {};

		this.images = Images;
		this.icons = Icons;

		this.connection = new Connection({ sharepoint: this });
	}

	render(params = {}) {
		this.domElement = params.container || document;
		this.craterWebparts.loadCss(this.domElement.head);

		this.connection.context = this.context;
		if (!this.renderedOnce) {
			this.attributes['_id'] = this.properties.id;
			if (this.properties['deleted'] == true) {
				this.domElement.body.textContent = 'Crater Deleted';
				return;
			}

			this.app = kerdx.createElement({
				element: 'div', attributes: { class: 'crater', id: 'webpart-container', style: { width: '100%', zIndex: '1' }, text: 'Loading Crater...' }
			}).monitor();

			let display = () => {
				if (this.attributes.dom.generated && this.attributes.dom.content != '') {// check if webpart has been created before
					this.domContent = kerdx.createElement(this.attributes.dom.content);
				}
				else {
					this.domContent = this.appendWebpart(this.app, 'crater');
					this.domContent.find('#undo-me').css({ opacity: 0.3 });
					this.domContent.find('#redo-me').css({ opacity: 0.3 });
				}

				this.app.appendChild(this.domContent);
				this.attributes.dom.content = this.app.innerHTML;
				this.attributes.dom.generated = true;

				this.runAll();

				if (this.attributes.states.data.length == 0) {
					this.attributes.states.data[0] = this.app.innerHTML;
				}

				this.app.findAll('.crater-display-panel').forEach(element => {
					element.remove();
				});

				if (!kerdx.isnull(this.domContent)) {
					this.app.addEventListener('click', event => {
						let element = event.target;
						if (!(element.classList.contains('crater-display-panel') || element.getParents('.crater-display-panel') || element.classList.contains('new-component'))) {
							for (let displayPanel of this.app.findAll('.crater-display-panel')) {
								displayPanel.remove();
							}
						}

						if (this.inEditMode()) { //check if in edit mode
							if (element.id == 'edit-me') {//if edit is clicked
								this.propertyPane.render(element.getParents('data-key'));
							}
							else if (element.id == 'append-me') {//if append is clicked
								this.addWebpart(element);
							}
							else if (element.id == 'delete-me') {// if delete is clicked
								this.deleteWebpart(element);
							}
							else if (element.id == 'clone-me') {
								if (element.getParents('.crater-component').classList.contains('crater-crater')) {
									localStorage.craterClone = JSON.stringify(this.attributes);
									alert('Crater Cloning complete');
								}
								else {
									let choose = kerdx.choose({ note: 'What do you want to do?', options: ["Copy", "Clone"] });

									this.app.append(choose.display);
									choose.choice.then((res) => {
										if (res.toLowerCase() == 'clone') {
											this.cloneWebpart(element);
										}
										else if (res.toLowerCase() == 'copy') {
											this.pasteActive = true;
											this.pasteElement = element.getParents('.crater-component');
										}
									});
								}
							}
							else if (element.id == 'paste-me') {
								this.pasteWebpart(element);
							}
							else if (element.id == 'undo-me') {
								this.undoWebpart(element);
							}
							else if (element.id == 'redo-me') {
								this.redoWebpart(element);
							}
							else if (element.classList.contains('change-text')) {
								this.editText(element);
							}
							else if (element.classList.contains('upload-image')) {
								this.uploadImage(element);
							}
							else if (element.classList.contains('upload-icon')) {
								this.uploadIcon(element);
							}
							else if (element.classList.contains('delete-upload-image')) {
								this.deleteUploadImage(element);
							}
							else if (element.classList.contains('delete-upload-icon')) {
								this.deleteUploadIcon(element);
							}
						}

						if (element.nodeName == 'A' && element.hasAttribute('href')) {
							event.preventDefault();
							this.openLink(element);
						}
					});
					this.initializeCrater();
				}
			};

			this.domElement.body.appendChild(this.app);
			if (!this.isLocal) {
				this.connection.fetchApp(this.properties.id)
					.then(result => {
						if (!kerdx.isnull(result)) {
							this.attributes = result;
						}
						else {
							kerdx.objectCopy(this.properties, this.attributes);
						}

						display();
					})
					.catch((err) => {
						alert(`Crater Error (${err})`);
						display();
					});
			}
			else {
				this.attributes = this.properties;
				display();
			}

			this.app.addEventListener('mutated', event => {
				//check for changes
				if (this.dontSave) {
					this.dontSave = false;
				}
				else if (!this.changingState) {
					this.attributes.dom.content = this.app.innerHTML;
					if (this.saved || this.editted) {
						this.saveCrater();
					}
				} else {
					this.changingState = false;
				}
			});
		}
	}

	runAll() {
		let keyedElements = this.app.findAll('.keyed-element');
		for (let i = 0; i < keyedElements.length; i++) {
			if (keyedElements[i].hasAttribute('data-type')) {
				let type = keyedElements[i].dataset.type;
				this.craterWebparts[type]({ action: 'rendered', element: keyedElements[i], sharePoint: this });
				let settings = this.attributes.pane.content[keyedElements[i].dataset.key].settings;

				if (kerdx.isset(settings) && Object.keys(settings).length != 0) {
					this.saveSettings(keyedElements[i], settings);
					settings = {};
				}

				let connection = this.attributes.pane.content[keyedElements[i].dataset.key].connection;
				if (this.connectable.includes(type) && kerdx.isset(connection) && connection.realTime == 'Yes') {
					let details = connection.details;
					if (connection.type == 'RSS Feed') {
						this.connection.getRSSFeed(details.Link, details.Count, details.Keywords).then(source => {
							this.craterWebparts[type]({ action: 'runUpdate', element: keyedElements[i], sharePoint: this, connection, source, container: keyedElements[i] });
						});
					}
					else {
						this.connection.find({ link: details.Link, list: details.List, data: '' }).then(source => {
							this.craterWebparts[type]({ action: 'runUpdate', element: keyedElements[i], sharePoint: this, connection, source, container: keyedElements[i] });
						});
					}
				}
			}
		}
	}

	openLink(element) {
		let source = element.href;
		let webpart = element;
		if (!(element.classList.contains('crater-component'))) webpart = element.getParents('.crater-component');
		let openAt = 'same window';
		let webpartSettings = webpart.dataset.settings;
		if (kerdx.isset(webpartSettings)) {
			webpartSettings = JSON.parse(webpartSettings);
			openAt = webpartSettings.linkWindow || openAt;
		}
		if (openAt.toLowerCase() == 'pop up') {
			let content = kerdx.createElement({ element: 'iframe', attributes: { src: source } });

			let popUp = kerdx.popUp(content, { attributes: { style: { width: '100%', height: '100%' } } });
			this.expandHeight();
		}
		else if (openAt.toLowerCase() == 'new window') {
			window.open(source);
		}
		else {
			window.open(source, '_self');
		}
	}

	initializeCrater() {
		this.app.findAll('.crater-edit-window').forEach(element => {
			element.remove();
		});
		this.app.findAll('.crater-pop-up').forEach(element => {
			element.remove();
		});
		this.app.findAll('.webpart-options').forEach(element => {
			element.css({ display: 'none' });
		});
	}

	appendWebpart(parent, webpart) {
		//fetch webpart and append it to the section || 
		let element = this.craterWebparts[webpart]({ action: 'render', sharePoint: this });
		parent.append(element);
		this.craterWebparts[webpart]({ action: 'rendered', element, sharePoint: this });

		if (kerdx.isset(this.domContent)) {
			this.craterWebparts['crater']({ action: 'rendered', element: this.domContent, sharePoint: this });
		}
		return element;
	}

	displayPanel(selected) {
		this.webparts.sort();

		this.displayPanelWindow = kerdx.createElement({
			element: 'div', attributes: { class: 'crater-display-panel' }
		});

		let controls = this.displayPanelWindow.makeElement({
			element: 'div', attributes: { class: 'display-pane-controls' }
		});

		//search box 
		this.displayPanelWindow.makeElement({
			element: 'input', attributes: { id: 'search-webpart', placeHolder: 'Search' }
		})
			.onChanged(value => {
				let foundWebParts = [];
				for (let i of this.webparts) {
					if (i.toLowerCase().indexOf(value.toLowerCase()) != -1) {
						foundWebParts.push(i);
					}
				}

				this.updateDisplayPaneWebPart({ webparts: foundWebParts });
			});

		this.displayPanelWindow.makeElement({
			element: 'div', attributes: { class: 'crater-select-webparts', id: 'crater-select-webpart' }
		});

		this.updateDisplayPaneWebPart({ webparts: this.webparts });

		controls.makeElement({
			element: 'img', attributes: { id: 'toggle', src: this.images.maximize, class: 'crater-icon display-pane-controls-button' }
		}).addEventListener('click', event => {
			event.target.classList.toggle('wide');
			if (event.target.classList.contains('wide')) {
				event.target.src = this.images.minimize;
			} else {
				event.target.src = this.images.maximize;
			}

			this.displayPanelWindow.classList.toggle('wide');
		});

		controls.makeElement({
			element: 'img', attributes: { id: 'close', src: this.images.close, class: 'crater-icon display-pane-controls-button' }
		}).addEventListener('click', event => {
			this.displayPanelWindow.remove();
			this.restoreHeight();
		});

		this.displayPanelWindow.addEventListener('click', event => {
			let element = event.target;
			if (element.classList.contains('crater-single-webpart') || !kerdx.isnull(element.getParents('.crater-single-webpart'))) {
				//   //select webpart to append
				if (!element.classList.contains('crater-single-webpart')) element = element.getParents('.crater-single-webpart');
				selected(element);
				this.displayPanelWindow.remove();
				this.restoreHeight();
			}
		});

		return this.displayPanelWindow;
	}

	updateDisplayPaneWebPart(params) {
		this.displayPanelWindow.find('#crater-select-webpart').innerHTML = '';//clear window
		for (let single of params.webparts) {
			let name = kerdx.stringReplace(single.toLowerCase(), ' ', '');
			this.displayPanelWindow.find('#crater-select-webpart').makeElement({
				element: 'div', attributes: { class: 'crater-single-webpart', 'data-webpart': name }, children: [
					kerdx.createElement({//set the icon
						element: 'i', attributes: { class: 'image', 'data-icon': this.icons[name] }
					}),
					kerdx.createElement({
						element: 'a', attributes: { class: 'title' }, text: single//set the text
					})
				]
			});
		}
	}

	inEditMode() {
		// let editing = this.displayMode == DisplayMode.Edit;
		// if (!editing) {
		// 	this.app.findAll('.webpart-option').forEach(option => {
		// 		option.show();
		// 	});
		// }
		return true;
	}

	get isLocal() {
		return location.hostname == 'localhost';
	}

	addWebpart(element) {
		this.app.findAll('.crater-display-panel').forEach(panel => {
			panel.remove();
		});
		let generatedWebpart = this.displayPanel(webpart => {
			let container = element.getParents('.crater-panel') || element.getParents('.crater-tab') || element.getParents('.crater-section');

			if (container.classList.contains('crater-section')) {
				this.appendWebpart(container.find('.crater-section-content'), webpart.dataset.webpart);
			} else if (container.classList.contains('crater-panel')) {
				this.appendWebpart(container.find('.crater-panel-webparts'), webpart.dataset.webpart);
			} else if (container.classList.contains('crater-tab')) {
				this.appendWebpart(container.find('.crater-tab-content'), webpart.dataset.webpart);
				this.craterWebparts['tab']({ action: 'rendered', element: container, sharePoint: this });
			}

			this.editted = true;
		});

		this.app.append(generatedWebpart);
		this.expandHeight();
	}

	deleteWebpart(element) {
		if (confirm("Do you want to continue with this action")) {//confirm deletion
			let key = element.getParents('data-key').dataset.key;
			if (element.getParents('data-key').outerHTML == this.domContent.outerHTML) {
				//if element is the base webpart
				this.domContent.getParents('.ControlZone').remove();
				this.attributes.dom.content = 'Webpart Deleted';
			}
			else if (element.getParents('data-key').classList.contains('crater-section')) {
				//if element is a section
				element = element.getParents('data-key');
				let container = element.getParents('data-key');
				element.remove();
				let settings = JSON.parse(container.dataset.settings);
				settings.columns -= 1;
				settings.columnsSizes = `repeat(${settings.columns} 1fr)`;

				this.saveSettings(container, settings);
				this.craterWebparts[container.dataset.type]({ action: 'rendered', element: this.domContent, sharePoint: this, resetWidth: true });
			}
			else {
				element = element.getParents('data-key');
				let container = element.getParents('data-key');
				element.remove();

				this.craterWebparts[container.dataset.type]({ action: 'rendered', element: container, sharePoint: this });

				this.attributes.dom.content = this.domContent.outerHTML;
			}
			this.editted = true;
		}
	}

	cloneWebpart(element) {
		let webpart = element.getParents('.crater-component');
		let clone = webpart.cloneNode(true);

		let container = webpart.getParents('.crater-component');

		let newKey = this.craterWebparts.generateKey();
		clone.dataset.key = newKey;
		this.attributes.pane.content[newKey] = this.attributes.pane.content[webpart.dataset.key];

		if (container.classList.contains('crater-crater')) {
			let settings = JSON.parse(container.dataset.settings);
			settings.columns = settings.columns + 1;
			this.saveSettings(container, settings);

			container.find('.crater-sections-container').css({ gridTemplateColumns: `repeat(${settings.columns}, 1fr)` });
		}

		webpart.after(clone);

		this.craterWebparts[clone.dataset.type]({ action: 'rendered', element: clone, sharePoint: this });

		this.craterWebparts[container.dataset.type]({ action: 'rendered', element: container, sharePoint: this });
		this.editted = true;
	}

	pasteWebpart(element) {
		let clone;

		if (element.getParents('.crater-component').classList.contains('crater-crater')) {
			clone = JSON.parse(localStorage.craterClone);
			Object.keys(clone).map(key => {
				this.attributes[key] = clone[key];
			});
			this.domContent = kerdx.createElement(this.attributes.dom.content);
			this.app.innerHTML = '';
			this.app.appendChild(this.domContent);
			this.runAll();
		}
		else {
			clone = this.pasteElement.cloneNode(true);
			let container = element.getParents('.crater-container');
			let newKey = this.craterWebparts.generateKey();
			clone.dataset.key = newKey;
			this.attributes.pane.content[newKey] = this.attributes.pane.content[this.pasteElement.dataset.key];

			if (container.classList.contains('crater-section')) {
				container.find('.crater-section-content').append(clone);
			}
			else if (container.classList.contains('crater-panel')) {
				container.find('.crater-panel-content').append(clone);
			}
			else if (container.classList.contains('crater-tab')) {
				container.find('.crater-tab-content').append(clone);
			}

			this.craterWebparts[clone.dataset.type]({ action: 'rendered', element: clone, sharePoint: this });

			this.craterWebparts[container.dataset.type]({ action: 'rendered', element: container, sharePoint: this });

			this.pasteActive = false;
			this.editted = true;
		}
	}

	changeState() {
		this.changingState = true;
		this.app.innerHTML = this.attributes.states.data[this.attributes.states.currentPosition] || this.app.innerHTML;
		this.runAll();

		this.setCorrection();
	}

	redoWebpart(element) {
		if (this.attributes.states.data.length > this.attributes.states.currentPosition + 1) {
			this.attributes.states.currentPosition = this.attributes.states.currentPosition + 1;
			this.changeState();
		}
	}

	undoWebpart(element) {
		if (this.attributes.states.currentPosition != 0) {
			this.attributes.states.currentPosition = this.attributes.states.currentPosition - 1;
			this.changeState();
		}
	}

	saveCrater() {
		//show options of the keyed elements
		if (this.saved) {
			let type = this.savedWebPart.dataset.type;
			//start the re-running the webpart
			this.craterWebparts[type]({ action: 'rendered', element: this.savedWebPart, sharePoint: this });
			this.propertyPane.clearDraft(this.attributes.pane.content[this.savedWebPart.dataset.key].draft);
		}
		this.attributes.states.currentPosition = this.attributes.states.currentPosition / 1 + 1;
		this.app.find('#undo-me').css({ opacity: 1 });
		for (let i in this.attributes.states.data) {
			if (i < this.attributes.states.currentPosition) continue;
			this.attributes.states.data.pop(i);
		}
		this.attributes.states.data.push(this.attributes.dom.content);

		this.saved = false;
		this.editted = false;

		if (!this.isLocal) {
			this.connection.putApp(this.attributes).then(result => {
				this.properties.id = result;
				this.attributes.id = result;
				console.log('Crater Uploaded');
			});
		}
	}

	setCorrection() {
		if (this.attributes.states.currentPosition == 0) {
			this.app.find('#undo-me').css({ opacity: 0.3 });
		} else {
			this.app.find('#undo-me').css({ opacity: 1 });
		}

		if (this.attributes.states.currentPosition + 1 == this.attributes.states.data.length) {
			this.app.find('#redo-me').css({ opacity: 0.3 });
		}
		else {
			this.app.find('#redo-me').css({ opacity: 1 });
		}
	}

	editText(element) {
		let cell = element.getParents('.cell');
		let cellData = cell.find('.cell-data');

		let content = kerdx.createElement({
			element: 'div', attributes: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center', background: 'white' } }
		});

		let textEditor = kerdx.textEditor({ content: cellData.cloneNode(true), width: '90%' });
		let done = kerdx.createElement({
			element: 'div', children: [
				{ element: 'button', attributes: { class: 'btn' }, text: 'Done' }
			]
		});

		content.append(textEditor, done);

		let popUp = kerdx.popUp(content, { attributes: { style: { width: '100%', height: '100%' } } });

		let editor;
		textEditor.onAdded(() => {
			editor = textEditor.find('#crater-the-WYSIWYG').contentWindow.document.body;
		});

		done.addEventListener('click', event => {
			cellData.copy(editor);
			popUp.remove();
		});
	}

	uploadIcon(element) {
		let cell = element.getParents('.cell');
		let cellData = cell.find('.cell-data');

		let storedIcons = [];
		for (let name in this.icons) {
			storedIcons.push({
				icon: kerdx.createElement({ element: 'i', attributes: { 'data-icon': this.icons[name] } }).outerHTML,
				name: name.toUpperCase(),
				value: this.icons[name]
			});
		}

		let selectIconTable = kerdx.createTable({ contents: storedIcons, rowClass: 'single-icon', search: true, title: 'Select Icon', projection: { value: -1 } });

		let popUp = kerdx.popUp(selectIconTable, { attributes: { style: { width: '100%', height: '100%', overflow: 'hidden', justifyContent: 'center' } } });

		kerdx.listenTable({ options: ['edit'], table: selectIconTable }, {
			click: event => {
				let target = event.target;
				let { row } = target.getParents('.kerdx-table-column-cell').dataset;
				let table = target.getParents('.kerdx-table');
				let value = table.find(`.kerdx-table-column[data-name="value"]`).find(`.kerdx-table-column-cell[data-row="${row}"]`).dataset.value;

				cellData.removeClasses(cellData.dataset.icon);
				cellData.addClasses(value);
				cellData.dataset.icon = value;
				popUp.remove();
			},
		});

	}

	uploadImage(element) {
		let cell = element.getParents('.cell');
		let cellData = cell.find('.cell-data');

		let content = kerdx.createElement({
			element: 'div', attributes: { style: { display: 'flex', flexDirection: 'column', background: 'white' } }
		});

		let menuContent = [
			{ name: 'Select', owner: 'Select' },
			{ name: 'Drive', owner: 'Drive' },
			{ name: 'Link', owner: 'Link' },
		];

		let menu = craterApp.craterWebparts.menu({
			content: menuContent,
			padding: '1em 0em'
		});

		let uploadDriveImage = kerdx.createForm({
			title: 'Upload From Local Drive', attributes: { id: 'upload-drive-image-form', class: 'form', style: { display: 'none' } },
			contents: {
				image: { element: 'input', attributes: { id: 'image-to-upload', name: 'Link', type: 'file' } },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'upload', class: 'btn' }, text: 'Upload' },
			}
		});

		let uploadLinkImage = kerdx.createForm({
			title: 'Upload With Url', attributes: { id: 'upload-link-image-form', class: 'form', style: { display: 'none' } },
			contents: {
				link: { element: 'input', attributes: { id: 'image-link', name: 'Link', type: 'text' } },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'upload', class: 'btn' }, text: 'Upload' },
			}
		});

		let storedImages = [];
		for (let name in this.images) {
			let link = this.images[name].slice(0, 20) + '...';

			storedImages.push({
				image: kerdx.createElement({ element: 'img', attributes: { src: this.images[name], style: { width: '1.5em', height: '1.5em' } } }).outerHTML,
				name,
				link
			});
		}
		let selectImage = kerdx.createElement({
			element: 'div', attributes: { class: 'table-container' }, children: [
				{ element: 'h2', attributes: { class: 'form-title' }, html: 'Select Image from Crater' },
				kerdx.createTable({ contents: storedImages, rowClass: 'single-image' }),
				{
					element: 'button', attributes: { style: { margin: '1em' }, class: 'btn', id: 'select-image' }, text: 'Select'
				}]
		});
		selectImage.find('.table').classList.add('scrollable-table');
		selectImage.find('tbody').css({ maxHeight: '40vh', overflow: 'auto', display: 'block' });

		let selectedImage;

		let uploadImageView = kerdx.createElement({
			element: 'div', attributes: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, children: [
				menu,
				{
					element: 'div', attributes: { style: { width: '80%' } }, children: [
						selectImage, uploadDriveImage, uploadLinkImage
					]
				}
			]
		});

		content.append(uploadImageView);
		let currentWindow = 'Select';

		menu.addEventListener('click', event => {
			let item = event.target;

			if (!item.classList.contains('crater-menu-item')) item = item.getParents('.crater-menu-item');

			if (kerdx.isnull(item)) return;

			if (item.dataset.owner == 'Select' && currentWindow != 'Select') {
				uploadLinkImage.css({ display: 'none' });
				uploadDriveImage.css({ display: 'none' });
				selectImage.cssRemove(['display']);
			}
			else if (item.dataset.owner == 'Drive' && currentWindow != 'Drive') {
				selectImage.css({ display: 'none' });
				uploadLinkImage.css({ display: 'none' });
				uploadDriveImage.cssRemove(['display']);
			}
			else if (item.dataset.owner == 'Link' && currentWindow != 'Link') {
				selectImage.css({ display: 'none' });
				uploadDriveImage.css({ display: 'none' });
				uploadLinkImage.cssRemove(['display']);
			}

			currentWindow = item.dataset.owner;

			menu.findAll('.crater-menu-item').forEach(mItem => {
				mItem.cssRemove(['background-color']);
			});

			item.css({ backgroundColor: `var(--lighter-primary-color)` });
		});

		let popUp = kerdx.popUp(content, { attributes: { style: { width: '100%', height: '100%' } } });

		let allSingleImages = selectImage.findAll('.single-image');
		selectImage.addEventListener('click', event => {
			let target = event.target;
			if (target.id == 'select-image') {
				if (kerdx.isset(selectedImage)) {
					cellData.src = selectedImage;
					popUp.remove();
				}
				else alert('Please Select an Image');
			}
			else {
				if (!target.classList.contains('single-image')) {
					target = target.getParents('.single-image');

					if (!kerdx.isnull(target) && target.classList.contains('single-image')) {
						for (let i = 0; i < allSingleImages.length; i++) {
							allSingleImages[i].cssRemove(['background', 'color']);
						}
						target.css({ background: 'green', color: 'white' });
						selectedImage = target.find('img').src;
					}
				}
			}
		});

		selectImage.ondblclick = event => {
			let target = event.target;
			if (!target.classList.contains('single-image')) target = target.getParents('.single-image');

			if (!kerdx.isnull(target) && target.classList.contains('single-image')) {
				cellData.src = target.find('img').src;
				popUp.remove();
			}
		};

		uploadDriveImage.addEventListener('submit', event => {
			event.preventDefault();
			uploadDriveImage.find('.form-error').textContent = '';
			uploadDriveImage.find('.form-error').cssRemove(['display']);

			if (!kerdx.validateForm(uploadDriveImage)) {
				uploadDriveImage.find('.form-error').textContent = 'Form not filled correctly';
				uploadDriveImage.find('.form-error').css({ display: 'unset' });
				return;
			}

			kerdx.imageToJson(uploadDriveImage.find('#image-to-upload').files[0], (file) => {
				cellData.src = file.src;
				popUp.remove();
			});
		});

		uploadLinkImage.addEventListener('submit', event => {
			event.preventDefault();
			uploadLinkImage.find('.form-error').textContent = '';
			uploadLinkImage.find('.form-error').cssRemove(['display']);

			if (!kerdx.validateForm(uploadLinkImage)) {
				uploadLinkImage.find('.form-error').textContent = 'Form not filled correctly';
				uploadLinkImage.find('.form-error').css({ display: 'unset' });
				return;
			}

			cellData.src = uploadLinkImage.find('#image-link').value;
			popUp.remove();
		});
	}

	deleteUploadImage(element) {
		let cell = element.getParents('.cell');
		let cellData = cell.find('.cell-data');

		cellData.src = '';
	}

	deleteUploadIcon(element) {
		let cell = element.getParents('.cell');
		let cellData = cell.find('.cell-data');

		cellData.dataset.icon = '';
	}

	expandHeight() {
		this.app.css({ minHeight: this.minHeight });
	}

	restoreHeight() {
		if (kerdx.isnull(this.app.find('crater-display-panel')) && kerdx.isnull(this.app.find('crater-edit-window')) && kerdx.isnull(this.app.find('crater-pop-up'))) {
			this.app.cssRemove(['min-height']);
		}
	}

	saveSettings(element, settings, settingsClone) {
		if (kerdx.isset(settingsClone)) {
			kerdx.object.copy(settingsClone, settings);
		}
		element.dataset.settings = JSON.stringify(settings);
	}

	update(callback) {
		let allKeyedElements = this.app.findAll('.keyed-element');

		for (let i = 0; i < allKeyedElements.length; i++) {
			this.updateElement(allKeyedElements[i]);
		}

		callback();
	}

	updateElement(element) {
		let type = element.dataset.type;

		this.prototypes[type] = this.craterWebparts[type]({ action: 'render', sharePoint: this });

		this.prototypes[type].pane = this.propertyPane.setUpContent(this.prototypes[type], true);
		let paneContent = this.propertyPane.setUpContent(element, true);

		let paneContentCards = paneContent.findAll('.card');
		let cells, cardClasses, cell;
		for (let i = 0; i < paneContentCards.length; i++) {//concat cardly to avoid id err
			cells = paneContentCards[i].findAll('.cell-data');
			cardClasses = paneContentCards[i].classList.value.split(' ').join('.');

			for (let j = 0; j < cells.length; j++) {
				cell = this.prototypes[type].pane.find(`.${cardClasses} #${cells[j].id}`);

				if (kerdx.isnull(cell)) {
					continue;
				}

				if (cells[j].nodeName.toLowerCase() == 'input') {
					cells[j].value = cell.value;
					cells[j].setAttribute('value', cell.getAttribute('value'));
				}
				else if (cells[j].nodeName.toLowerCase() == 'select') {
					cells[j].findAll('options').forEach(option => {
						if (option.value == cell.value) {
							option.setAttribute('selected', true);
						}
					});
				}
			}
		}

		this.propertyPane.clearDraft(this.attributes.pane.content[element.dataset.key].draft);
		this.attributes.pane.content[element.dataset.key].content = this.prototypes[type].pane.innerHTML;

		let concat = (old, fresh) => {
			for (let name in fresh) {
				if (fresh[name] instanceof Element) {
					if (!kerdx.isset(old[name])) {
						old[name] = fresh[name];
					}
				}
				else if (typeof fresh[name] == 'object') {
					if (!kerdx.isset(old[name])) {
						old[name] = fresh[name];
					}
					else {
						concat(old[name], fresh[name]);
					}
				}
				else if (!kerdx.isset(old[name])) {
					old[name] = fresh[name];
				}
			}
		};

		let elementSettings = JSON.parse(element.dataset.settings);
		let prototypeSettings = JSON.parse(this.prototypes[type].dataset.settings);
		concat(elementSettings, prototypeSettings);//concat dataset

		let elementData = this.attributes.pane.content[element.dataset.key],
			prototypeData = this.attributes.pane.content[this.prototypes[type].dataset.key];
		concat(elementData, prototypeData);//concat data

		let identifier, twin, id, nodeName;

		let concatUI = (el, pr) => {
			let elAttributes = el.getAttributes(),
				prAttributes = pr.getAttributes();
			concat(elAttributes, prAttributes);
			el.setAttributes(elAttributes);//concat UI

			let children = el.children;
			for (let i = 0; i < children.length; i++) {
				id = children[i].id;
				nodeName = children[i].nodeName;
				identifier = '';
				if (id != '') {
					identifier = `${nodeName}#${id}`;
				}
				else {
					continue;
				}

				twin = pr.find(identifier);
				if (kerdx.isnull(twin)) {
					continue;
				}

				concatUI(children[i], twin);
			}
		};

		concatUI(element, this.prototypes[type]);
	}
}
