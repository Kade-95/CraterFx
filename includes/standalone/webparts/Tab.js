import { ElementModifier } from './../ElementModifier';
import { CraterWebParts } from './../CraterWebParts';

class Tab extends ElementModifier {
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
		let tab = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-container crater-tab', 'data-type': 'tab' }, options: ['append', 'edit', 'delete', 'clone'], children: [
				{
					element: 'div', attributes: { class: 'crater-tab-container', id: 'crater-tab-container' }, children: [
						this.menu({ content: [] }),
						{
							element: 'div', attributes: { class: 'crater-tab-content', id: 'crater-tab-content' }
						}
					]
				}
			]
		});

		return tab;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let tabContainer = this.element.find('.crater-tab-container');
		let menu = this.element.find('.crater-menu');
		let tabContents = this.element.find('.crater-tab-content');
		let allKeyedElements = this.element.find('.crater-tab-content').childNodes;

		let list = [];

		for (let keyedElement of allKeyedElements) {
			if (keyedElement.classList.contains('keyed-element')) {
				list.push({
					name: keyedElement.dataset.title || keyedElement.dataset.type,
					owner: keyedElement.dataset.key,
					icon: (this.func.isset(keyedElement.dataset.icon)) ? keyedElement.dataset.icon : this.sharePoint.icons[keyedElement.dataset.type]
				});
			}
		}

		menu.innerHTML = this.menu({ content: list }).innerHTML;
		menu.css({ gridTemplateColumns: `repeat(${list.length}, 1fr)` });

		let showIcons = settings.showMenuIcons || 'yes';
		let iconSize = settings.iconSize || '2em';
		let style = settings.style || 'Default';
		let justify = settings.justify || 'Center';
		let menuLocation = settings.location || 'Top';
		let tabs = menu.findAll('.crater-menu-item');

		//onmneu clicked change to the webpart
		menu.addEventListener('click', event => {
			let item = event.target;
			if (!item.classList.contains('crater-menu-item')) {
				item = item.getParents('.crater-menu-item');
			}

			if (!this.func.isnull(item) && item.classList.contains('crater-menu-item')) {
				for (let keyedElement of this.element.find('.crater-tab-content').childNodes) {
					if (keyedElement.classList.contains('keyed-element')) {
						keyedElement.classList.add('in-active');
						if (item.dataset.owner == keyedElement.dataset.key) {
							keyedElement.classList.remove('in-active');
						}
					}
				}
			}
		});

		let menuButtons = menu.findAll('.crater-menu-item');
		if (this.func.setNotNull(menuButtons[menuButtons.length - 1])) menuButtons[menuButtons.length - 1].click();

		this.showOptions(this.element);

		menu.cssRemove(['border-bottom', 'border-top', 'border']);
		tabContainer.cssRemove(['border']);
		tabContents.cssRemove(['border']);

		for (let i = 0; i < tabs.length; i++) {
			let color = '#000000';
			let background = '#ffffff';

			if (this.func.isset(allKeyedElements[i].dataset.background)) background = allKeyedElements[i].dataset.background;
			if (this.func.isset(allKeyedElements[i].dataset.color)) color = allKeyedElements[i].dataset.color;

			tabs[i].css({ background, color });
			tabs[i].cssRemove(['box-shadow', 'border-top']);
			tabs[i].find('.crater-menu-item-icon').css({ width: iconSize });
			if (showIcons.toLowerCase() == 'yes') {
				tabs[i].find('.crater-menu-item-icon').cssRemove(['display']);
			}
			else {
				tabs[i].find('.crater-menu-item-icon').css({ display: 'none' });
			}
		}

		if (style == 'Default') {

		}
		else if (style == 'Boxed') {
			menu.css({ border: '1px solid black' });
			tabContents.css({ border: '1px solid black' });
		}
		else if (style == 'Filled') {
			let color;
			let background;
			for (let i = 0; i < tabs.length; i++) {
				color = '#000000';
				background = '#999999';
				if (i != tabs.length - 1) {
					if (this.func.isset(allKeyedElements[i].dataset.background)) background = allKeyedElements[i].dataset.background;
					if (this.func.isset(allKeyedElements[i].dataset.color)) color = allKeyedElements[i].dataset.color;

					tabs[i].css({ background });
					tabs[i].find('.crater-menu-item-text').css({ color });
				}
				else {
					tabs[i].css({ background: 'white', borderTop: `5px solid ${background}` });
					tabs[i].find('.crater-menu-item-text').css({ color: 'black' });
				}

				tabs[i].addEventListener('click', event => {
					for (let j = 0; j < tabs.length; j++) {
						color = '#000000';
						background = '#999999';
						if (j != i) {
							if (this.func.isset(allKeyedElements[j].dataset.background)) background = allKeyedElements[j].dataset.background;
							if (this.func.isset(allKeyedElements[j].dataset.color)) color = allKeyedElements[j].dataset.color;

							tabs[j].css({ background });
							tabs[j].find('.crater-menu-item-text').css({ color });
						}
						else {
							tabs[j].css({ background: 'white', borderTop: `5px solid ${background}` });
							tabs[j].find('.crater-menu-item-text').css({ color: 'black' });
						}
					}
				});
			}
		}
		else if (style == 'Bared') {
			if (menuLocation == 'Top' || menuLocation == 'Bottom') {
				for (let i = 0; i < tabs.length; i++) {
					if (i == tabs.length - 1) continue;
					tabs[i].css({ boxShadow: '1px 0 #000000' });
				}
			}
			else {
				for (let i = 0; i < tabs.length; i++) {
					if (i == tabs.length - 1) continue;
					tabs[i].css({ boxShadow: '0 1px #000000' });
				}
			}
		}

		if (justify == 'Center') {
			menu.css({ justifyContent: 'center' });
		}
		else if (justify == 'Left') {
			menu.css({ justifyContent: 'flex-start' });
		}
		else if (justify == 'Right') {
			menu.css({ justifyContent: 'flex-end' });
		}
		else if (justify == 'Spaced') {
			menu.css({ justifyContent: 'space-evenly' });
		}

		tabContainer.cssRemove(['grid-template-columns', 'grid-template-rows', 'grid-area']);
		menu.cssRemove(['grid-area', 'flex-direction']);
		tabContents.cssRemove(['grid-area']);

		if (menuLocation == 'Top') {
			tabContainer.css({ gridTemplateRows: 'max-content 1fr' });
		}
		else if (menuLocation == 'Bottom') {
			tabContainer.css({ gridTemplateRows: '1fr max-content' });
			menu.css({ gridRowStart: 2, gridRowEnd: 2 });
		}
		else if (menuLocation == 'Left') {
			tabContainer.css({ gridTemplateColumns: 'max-content 1fr' });
			menu.css({ gridArea: '1', flexDirection: 'column' });
			tabContents.css({ flexDirection: 'column' });
		}
		else if (menuLocation == 'Right') {
			tabContainer.css({ gridTemplateColumns: '1fr max-content' });
			menu.css({ flexDirection: 'column' });
			tabContents.css({ gridArea: '1', flexDirection: 'column' });
		}
	}

	public generatePaneContent(params) {
		let tabContentsPane = this.createElement({
			element: 'div', attributes: { class: 'card tab-contents-pane' }, children: [
				{
					element: 'div', attributes: { class: 'card-title' }, children: [
						{
							element: 'h2', attributes: { class: 'title' }, text: 'Tab Contents'
						}
					]
				},
			]
		});
		//set the pane for all the webparts in the section
		for (let i = 0; i < params.source.length; i++) {
			tabContentsPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'row crater-tab-content-row-pane'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-tab-content-row' }),
					this.cell({
						element: 'i', name: 'Icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': params.source[i].dataset.icon || '' }
					}),
					this.cell({
						element: 'input', name: 'Title', value: params.source[i].dataset.title || params.source[i].dataset.type
					}),
					this.cell({
						element: 'input', name: 'Menu-Color', dataAttributes: { type: 'color', value: params.source[i].dataset.color || '#000000' }
					}),
					this.cell({
						element: 'input', name: 'Menu-Background', dataAttributes: { type: 'color', value: params.source[i].dataset.background || '#ffffff' }
					})
				]
			});
		}

		return tabContentsPane;
	}

	private setUpPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		});

		let tab = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		//fetch the sections view

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			this.paneContent.makeElement({
				element: 'div', children: [
					{
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					}
				]
			});

			let menus = tab.find('.crater-menu');

			let menuPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'menu-pane card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Menu Settings'
							}
						]
					},
					{
						element: 'div', children: [
							this.cell({
								element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'FontSize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'FontStyle', list: this.func.fontStyles
							}),
							this.cell({
								element: 'select', name: 'ShowIcons', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'input', name: 'IconSize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Style', options: ['Default', 'Boxed', 'Filled', 'Bared']
							}),
							this.cell({
								element: 'select', name: 'Justify', options: ['Spaced', 'Center', 'Left', 'Right']
							}),
							this.cell({
								element: 'select', name: 'Location', options: ['Top', 'Bottom', 'Left', 'Right']
							})
						]
					}
				]
			});

			let elementContents = tab.find('.crater-tab-content').childNodes;

			this.paneContent.append(this.generatePaneContent({ source: elementContents }));

			let settingsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							}
						]
					},
					{
						element: 'div', children: [

						]
					}
				]
			});
		}

		let contents = tab.find('.crater-tab-content').childNodes;
		this.paneContent.find('.tab-contents-pane').innerHTML = this.generatePaneContent({ source: contents }).innerHTML;

		return this.paneContent;
	}

	private listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let menu = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-menu');
		let tabContents = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-tab-content');

		let tabContentDom = tabContents.childNodes;
		let tabContentPane = this.paneContent.find('.tab-contents-pane');

		//fetch the current view of the section
		//create section content pane prototype
		let tabContentPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-tab-content-row-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-tab-content-row' }),
				this.cell({
					element: 'i', name: 'Icon', attributes: {}, dataAttributes: { class: 'crater-icon', 'data-icon': this.sharePoint.icons.plus }
				}),
				this.cell({
					element: 'input', name: 'Title'
				}),
				this.cell({
					element: 'input', name: 'Menu Color', dataAttributes: { type: 'color', value: '#000000' }
				}),
				this.cell({
					element: 'input', name: 'Menu Background', dataAttributes: { type: 'color', value: '#ffffff' }
				})
			]
		});

		//set all the event listeners for the section webparts[add before & after, delete]
		let tabContentRowHandler = (tabContentRowPane, tabContentRowDom) => {

			tabContentRowPane.addEventListener('mouseover', event => {
				tabContentRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			tabContentRowPane.addEventListener('mouseout', event => {
				tabContentRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			tabContentRowPane.find('#Icon-cell').checkChanges(() => {
				tabContentRowDom.dataset.icon = tabContentRowPane.find('#Icon-cell').dataset.icon;
			});

			tabContentRowPane.find('#Title-cell').onChanged(value => {
				tabContentRowDom.dataset.title = value;
			});

			tabContentRowPane.find('#Menu-Color-cell').onChanged(value => {
				tabContentRowDom.dataset.color = value;
			});

			tabContentRowPane.find('#Menu-Background-cell').onChanged(value => {
				tabContentRowDom.dataset.background = value;
			});

			tabContentRowPane.find('.delete-crater-tab-content-row').addEventListener('click', event => {
				tabContentRowDom.remove();
				tabContentRowPane.remove();
			});

			tabContentRowPane.find('.add-before-crater-tab-content-row').addEventListener('click', event => {
				this.paneContent.append(
					this.sharePoint.displayPanel(webpart => {
						let newTabContent = this.sharePoint.appendWebpart(tabContents, webpart.dataset.webpart);
						tabContentRowDom.before(newTabContent.cloneNode(true));
						newTabContent.remove();

						let newSectionContentRow = tabContentPanePrototype.cloneNode(true);
						tabContentRowPane.after(newSectionContentRow);

						tabContentRowHandler(newSectionContentRow, newTabContent);
					})
				);
			});

			tabContentRowPane.find('.add-after-crater-tab-content-row').addEventListener('click', event => {
				this.paneContent.append(
					this.sharePoint.displayPanel(webpart => {
						let newSectionContent = this.sharePoint.appendWebpart(tabContents, webpart.dataset.webpart);
						tabContentRowDom.after(newSectionContent.cloneNode(true));
						newSectionContent.remove();

						let newSectionContentRow = tabContentPanePrototype.cloneNode(true);
						tabContentRowPane.after(newSectionContentRow);

						tabContentRowHandler(newSectionContentRow, newSectionContent);
					})
				);
			});
		};

		let menuPane = this.paneContent.find('.menu-pane');

		menuPane.find('#FontSize-cell').onChanged(fontSize => {
			menu.css({ fontSize });
		});

		menuPane.find('#FontStyle-cell').onChanged(fontFamily => {
			menu.css({ fontFamily });
		});

		menuPane.find('#IconSize-cell').onChanged();
		menuPane.find('#ShowIcons-cell').onChanged();
		menuPane.find('#Style-cell').onChanged();
		menuPane.find('#Location-cell').onChanged();
		menuPane.find('#Justify-cell').onChanged();

		menuPane.find('#BackgroundColor-cell').onChanged(backgroundColor => {
			menu.css({ backgroundColor });
		});

		menuPane.find('#Color-cell').onChanged(color => {
			menu.css({ color });
		});

		//add new webpart to the section
		this.paneContent.find('.new-component').addEventListener('click', event => {
			this.paneContent.append(
				//show the display panel and add the selected webpart
				this.sharePoint.displayPanel(webpart => {
					let newSectionContent = this.sharePoint.appendWebpart(tabContents, webpart.dataset.webpart);
					let newSectionContentRow = tabContentPanePrototype.cloneNode(true);
					tabContentPane.append(newSectionContentRow);

					//listen for events on new webpart
					tabContentRowHandler(newSectionContentRow, newSectionContent);
				})
			);
		});

		this.paneContent.findAll('.crater-tab-content-row-pane').forEach((sectionContent, position) => {
			//listen for events on all webparts
			tabContentRowHandler(sectionContent, tabContentDom[position]);
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

			let keyedElements = this.element.findAll('.keyed-element');
			for (let i = 0; keyedElements.length; i++) {
				this.craterWebparts[keyedElements[i].dataset.type]({ action: 'rendered', element: keyedElements[i], sharePoint: this.sharePoint });
			}

			settings.showMenuIcons = menuPane.find('#ShowIcons-cell').value;
			settings.iconSize = menuPane.find('#IconSize-cell').value;
			settings.style = menuPane.find('#Style-cell').value;
			settings.location = menuPane.find('#Location-cell').value;
			settings.justify = menuPane.find('#Justify-cell').value;

			this.sharePoint.saveSettings(this.element, settings);

		});
	}
}

export { Tab };