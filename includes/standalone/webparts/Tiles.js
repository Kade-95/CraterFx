import { ElementModifier } from './../ElementModifier';

class Tiles extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	private backgroundImage = "";
	private backgroundColor = '#999999';
	private color = 'white';
	private columns: any = 3;
	private duration: any = 10;
	private height: any = 0;
	private backgroundPosition: any = 'left';
	private backgroundSize: any = '100px';

	private key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.backgroundImage = this.sharePoint.images.append;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source))
			params.source = [
				{ name: 'Tile One', about: 'Hello welcome to this place', icon: this.sharePoint.icons.plus, color: '#333333', link: 'https://google.com' },
				{ name: 'Tile Two', about: 'Hello welcome to this place', icon: this.sharePoint.icons.plus, color: '#999999', link: 'https://google.com' },
				{ name: 'Tile Three', about: 'Hello welcome to this place', icon: this.sharePoint.icons.plus, color: '#666666', link: 'https://google.com' }
			];

		let tiles = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-tiles', 'data-type': 'tiles' } });

		let content = tiles.makeElement({
			element: 'div', attributes: { class: 'crater-tiles-content', id: 'crater-tiles-content' }
		});

		// add all the tiles
		for (let tile of params.source) {
			content.append(this.createElement({
				element: 'div', attributes: { class: 'crater-tiles-content-column', style: { backgroundColor: tile.color } }, children: [
					{
						element: 'a', attributes: { class: 'crater-tiles-content-column-link', id: 'link', style: { display: 'none' }, href: tile.link }
					},
					{
						element: 'i', attributes: { class: 'crater-tiles-content-column-image', 'data-icon': tile.icon }
					},
					{
						element: 'div', attributes: { class: 'crater-tiles-content-column-details' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'crater-tiles-content-column-details-name', id: 'name' }, text: tile.name
							}),
							this.createElement({ element: 'div', attributes: { class: 'crater-tiles-content-column-details-about', id: 'about' }, text: tile.about }),
						]
					},
				]
			}));
		}

		//set the webparts pre-defined settings
		this.func.objectCopy(params, tiles.dataset);
		this.key = this.key || tiles.dataset['key'];
		let settings = {
			columns: 3,
			duration: 10,
			backgroundSize: 'auto 60%',
			backgroundPosition: 'center',
			layout: 'Slideup'
		};

		this.sharePoint.saveSettings(tiles, settings);

		return tiles;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		//at most 3 in a row
		//if not upto 3 make it to match parents width
		let tiles = this.element.findAll('.crater-tiles-content-column');
		let { length } = tiles;
		let currentContent;

		//fetch the settings
		this.columns = settings.columns / 1;
		this.duration = settings.duration;
		this.backgroundPosition = settings.backgroundPosition;
		this.backgroundSize = settings.backgroundSize;

		this.height = this.element.css().height;

		this.element.findAll('.crater-tiles-content').forEach(content => {
			content.remove();
		});

		//set dimension properties and get height
		for (let i = 0; i < length; i++) {
			let tile = tiles[i];

			if (i % this.columns == 0) {
				let columns = this.columns;

				if (this.columns > length - i) {
					columns = length - i;
				}

				currentContent = this.element.makeElement({ element: 'div', attributes: { class: 'crater-tiles-content', style: { 'gridTemplateColumns': `repeat(${columns}, 1fr)` } } });
			}

			currentContent.append(tile);
			//set tile background position [left, right, center]
			let tileBackground: any = {};
			tile.find('.crater-tiles-content-column-image').cssRemove(['margin-left']);
			tile.find('.crater-tiles-content-column-image').cssRemove(['margin-right']);

			let getPosition = position => {
				if (position == 'left') return 'right';
				else if (position == 'right') return 'left';
				else return position;
			};

			let direction = getPosition(this.func.trem(this.backgroundPosition).toLowerCase());

			tileBackground[`margin-${direction}`] = 'auto';
			tileBackground.fontSize = this.backgroundSize;

			tile.find('.crater-tiles-content-column-image').css(tileBackground);

			if (!this.func.isset(this.height) || tile.position().height > this.height) {
				this.height = tile.position().height;
			}
			//set height to the height of the longest tile
			this.height = this.height || tile.position().height;

			tile.find('.crater-tiles-content-column-details-name').css({ fontSize: settings.nameFontSize, fontFamily: settings.nameFontFamily, justifyContent: settings.nameTextAlign });

			let aboutTextAlign;
			if (settings.aboutTextAlign == 'Left') {
				aboutTextAlign = 'flex-start';
			}
			else if (settings.aboutTextAlign == 'Right') {
				aboutTextAlign = 'flex-end';
			}
			else {
				aboutTextAlign = 'center';
			}
			tile.find('.crater-tiles-content-column-details-about').css({ fontSize: settings.aboutFontSize, fontFamily: settings.aboutFontFamily, justifyContent: aboutTextAlign });

			if (settings.style == 'Defualt') {
				tile.find('.crater-tiles-content-column-details').css({ border: 'none' });
			}
			else if (settings.style == 'Bordered') {
				tile.find('.crater-tiles-content-column-details').css({ borderColor: settings.borderColor, borderWidth: settings.borderSize, borderStyle: settings.borderType });
			}
		}

		this.element.css({ gridTemplateRows: `repeat(${Math.ceil(length / this.columns)}, '1fr)`, height: this.height });

		this.height = this.func.isset(settings.height)
			? settings.height
			: this.height;

		if (this.func.isset(this.height) && this.height.toString().indexOf('px') == -1) this.height += 'px';

		let animation = settings.layout.toLowerCase();
		//run animation
		for (let i = 0; i < length; i++) {
			let tile = tiles[i];
			tile.css({ height: this.height });// set the gotten height

			//reset tile view to un-hovered
			tile.find('.crater-tiles-content-column-details').clearClasses('crater-tiles-content-column-details');
			tile.find('.crater-tiles-content-column-details').classList.add(`crater-tiles-content-column-details-${animation}-short`);
			tile.find('.crater-tiles-content-column-image').cssRemove(['display']);

			//animate when hovered
			tile.addEventListener('mouseenter', event => {
				if (animation == 'twist') {
					tile.find('.crater-tiles-content-column-image').hide();
					tile.classList.remove('crater-tiles-content-column-untwist');
					tile.classList.add('crater-tiles-content-column-twist');
					setTimeout(() => {
						tile.classList.add('crater-tiles-content-column-untwist');
						tile.classList.remove('crater-tiles-content-column-twist');
					}, 500);
				}
				tile.find('.crater-tiles-content-column-details').classList.add(`crater-tiles-content-column-details-${animation}-full`);
				tile.find('.crater-tiles-content-column-details').classList.remove(`crater-tiles-content-column-details-${animation}-short`);
			});

			tile.addEventListener('mouseleave', event => {
				if (animation == 'twist') {
					tile.find('.crater-tiles-content-column-image').cssRemove(['height', 'display']);
					tile.classList.remove('crater-tiles-content-column-untwist');
					tile.classList.add('crater-tiles-content-column-twist');
					setTimeout(() => {
						tile.classList.add('crater-tiles-content-column-untwist');
						tile.classList.remove('crater-tiles-content-column-twist');
					}, 500);
				}
				tile.find('.crater-tiles-content-column-details').classList.add(`crater-tiles-content-column-details-${animation}-short`);
				tile.find('.crater-tiles-content-column-details').classList.remove(`crater-tiles-content-column-details-${animation}-full`);
			});

			tile.addEventListener('click', event => {
				tile.find('.crater-tiles-content-column-link').click();
			});
		}
	}

	public setUpPaneContent(params): any {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			let tiles = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-tiles-content-column');
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ tiles }));

			let namePane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card name-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: "Name Styles"
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Text Align', options: ['Left', 'Center', 'Right']
							})
						]
					})
				]
			});

			let aboutPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card about-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: "About Style"
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Text Align', options: ['Left', 'Center', 'Right']
							})
						]
					})
				]
			});

			let settingsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card settings-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: "Settings"
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Duration', value: settings.duration
							}),
							this.cell({
								element: 'input', name: 'Columns', value: settings.columns || ''
							}),
							this.cell({
								element: 'input', name: 'Background Size', value: settings.backgroundSize || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'BackgroundPosition', options: ['Left', 'Right', 'Center']
							}),
							this.cell({
								element: 'input', name: 'Height', value: settings.height || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Layout', options: ['Slideup', 'Slideleft', 'Twist']
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							}),
							this.cell({
								element: 'select', name: 'Style', options: ['Default', 'Bordered']
							}),
							this.cell({
								element: 'input', name: 'Border Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'Border Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Border Type', list: this.func.borderTypes
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let tilesPane = this.createElement({
			element: 'div', attributes: { class: 'card tiles-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: "Tile"
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.tiles.length; i++) {
			tilesPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-tiles-content-column-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-tiles-content-column' }),
					this.cell({
						element: 'i', name: 'Image', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': params.tiles[i].find('.crater-tiles-content-column-image').dataset.icon }
					}),
					this.cell({
						element: 'input', name: 'Name', value: params.tiles[i].find('#name').textContent
					}),
					this.cell({
						element: 'input', name: 'About', value: params.tiles[i].find('#about').textContent
					}),
					this.cell({
						element: 'input', name: 'Link', value: params.tiles[i].find('#link').href
					}),
					this.cell({
						element: 'input', name: 'Color', dataAttributes: { type: 'color' }
					}),
					this.cell({
						element: 'input', name: 'Background', dataAttributes: { type: 'color', value: '#ffffff' }
					})
				]
			});
		}
		return tilesPane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let content = draftDom.find('.crater-tiles-content');
		let tiles = draftDom.findAll('.crater-tiles-content-column');

		let columnPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-tiles-content-column-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-tiles-content-column' }),
				this.cell({
					element: 'i', name: 'Image', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.sharePoint.icons.plus }
				}),
				this.cell({
					element: 'input', name: 'Name', value: 'Name'
				}),
				this.cell({
					element: 'input', name: 'About', value: 'About'
				}),
				this.cell({
					element: 'input', name: 'Link', value: '#'
				}),
				this.cell({
					element: 'input', name: 'Color', dataAttributes: { type: 'color' }
				}),
				this.cell({
					element: 'input', name: 'Background', dataAttributes: { type: 'color', value: '#ffffff' }
				})
			]
		});

		let columnPrototype = this.createElement({
			element: 'div', attributes: { class: 'crater-tiles-content-column', style: { backgroundColor: this.color } }, children: [
				{
					element: 'a', attributes: { class: 'crater-tiles-content-column-link', id: 'link', style: { display: 'none' }, href: '#' }
				},
				{
					element: 'i', attributes: { class: 'crater-tiles-content-column-image', 'data-icon': this.sharePoint.icons.plus }
				},
				{
					element: 'div', attributes: { class: 'crater-tiles-content-column-details' }, children: [
						{
							element: 'div', attributes: { class: 'crater-tiles-content-column-details-name', id: 'name' }, text: 'Name'
						},
						{ element: 'div', attributes: { class: 'crater-tiles-content-column-details-about', id: 'about' }, text: 'About' },
					]
				},
			]
		});

		let tilescolumnHandler = (tilesColumnPane, tilesColumnDom) => {
			tilesColumnPane.addEventListener('mouseover', event => {
				tilesColumnPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			tilesColumnPane.addEventListener('mouseout', event => {
				tilesColumnPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			tilesColumnPane.find('#Image-cell').checkChanges(() => {
				tilesColumnDom.find('.crater-tiles-content-column-image').removeClasses(tilesColumnDom.find('.crater-tiles-content-column-image').dataset.icon);
				tilesColumnDom.find('.crater-tiles-content-column-image').addClasses(tilesColumnPane.find('#Image-cell').dataset.icon);
				tilesColumnDom.find('.crater-tiles-content-column-image').dataset.icon = tilesColumnDom.find('.crater-tiles-content-column-image').dataset.icon;
			});

			tilesColumnPane.find('#Name-cell').onChanged(value => {
				tilesColumnDom.find('.crater-tiles-content-column-details-name').innerHTML = value;
			});

			tilesColumnPane.find('#About-cell').onChanged(value => {
				tilesColumnDom.find('.crater-tiles-content-column-details-about').innerHTML = value;
			});

			tilesColumnPane.find('#Link-cell').onChanged(value => {
				tilesColumnDom.find('.crater-tiles-content-column-link').href = value;
			});

			tilesColumnPane.find('#Color-cell').onChanged(color => {
				tilesColumnDom.css({ color });
			});

			tilesColumnPane.find('#Background-cell').onChanged(backgroundColor => {
				tilesColumnDom.css({ backgroundColor });
			});

			tilesColumnPane.find('.delete-crater-tiles-content-column').addEventListener('click', event => {
				tilesColumnDom.remove();
				tilesColumnPane.remove();
			});

			tilesColumnPane.find('.add-before-crater-tiles-content-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				tilesColumnDom.before(newColumnPrototype);
				tilesColumnPane.before(newColumnPanePrototype);
				tilescolumnHandler(newColumnPanePrototype, newColumnPrototype);
			});

			tilesColumnPane.find('.add-after-crater-tiles-content-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				tilesColumnDom.after(newColumnPrototype);
				tilesColumnPane.after(newColumnPanePrototype);
				tilescolumnHandler(newColumnPanePrototype, newColumnPrototype);
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newColumnPrototype = columnPrototype.cloneNode(true);
			let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

			content.append(newColumnPrototype);//c
			this.paneContent.find('.tiles-pane').append(newColumnPanePrototype);

			tilescolumnHandler(newColumnPanePrototype, newColumnPrototype);
		});

		this.paneContent.findAll('.crater-tiles-content-column-pane').forEach((tilesColumnPane, position) => {
			tilescolumnHandler(tilesColumnPane, tiles[position]);
		});

		let namePane = this.paneContent.find('.name-pane');
		let aboutPane = this.paneContent.find('.about-pane');
		let settingsPane = this.paneContent.find('.settings-pane');

		namePane.find('#Font-Style-cell').onChanged();
		namePane.find('#Font-Size-cell').onChanged();
		namePane.find('#Text-Align-cell').onChanged();

		aboutPane.find('#Font-Style-cell').onChanged();
		aboutPane.find('#Font-Size-cell').onChanged();
		aboutPane.find('#Text-Align-cell').onChanged();

		settingsPane.find('#Duration-cell').onChanged();
		settingsPane.find('#Columns-cell').onChanged();
		settingsPane.find('#BackgroundPosition-cell').onChanged();
		settingsPane.find('#Background-Size-cell').onChanged();
		settingsPane.find('#Height-cell').onChanged();
		settingsPane.find('#Layout-cell').onChanged();
		settingsPane.find('#Link-Window-cell').onChanged();
		settingsPane.find('#Style-cell').onChanged();
		settingsPane.find('#Border-Color-cell').onChanged();
		settingsPane.find('#Border-Size-cell').onChanged();
		settingsPane.find('#Border-Type-cell').onChanged();

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			//update webpart            

			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

			settings.nameFontFamily = namePane.find('#Font-Style-cell').value;
			settings.nameFontSize = namePane.find('#Font-Size-cell').value;
			settings.nameTextAlign = namePane.find('#Text-Align-cell').value == 'Right' ? 'flex-end' : namePane.find('#Text-Align-cell').value;

			settings.aboutFontFamily = aboutPane.find('#Font-Style-cell').value;
			settings.aboutFontSize = aboutPane.find('#Font-Size-cell').value;
			settings.aboutTextAlign = aboutPane.find('#Text-Align-cell').value;

			//save the new settings
			settings.duration = settingsPane.find('#Duration-cell').value;
			settings.columns = settingsPane.find('#Columns-cell').value;
			settings.backgroundPosition = settingsPane.find('#BackgroundPosition-cell').value;
			settings.backgroundSize = settingsPane.find('#Background-Size-cell').value;
			settings.height = settingsPane.find('#Height-cell').value;
			settings.layout = settingsPane.find('#Layout-cell').value || settings.layout;
			settings.linkWindow = settingsPane.find('#Link-Window-cell').value;
			settings.style = settingsPane.find('#Style-cell').value || settings.style;
			settings.borderColor = settingsPane.find('#Border-Color-cell').value || 'black';
			settings.borderSize = settingsPane.find('#Border-Size-cell').value || '1px';
			settings.borderType = settingsPane.find('#Border-Type-cell').value || 'solid';

			this.sharePoint.saveSettings(this.element, settings);

		});
	}

	public update(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');
		let metadata = params.connection.metadata || {};
		let options = params.connection.options || [];

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				icon: { element: 'select', attributes: { id: 'meta-data-icon', name: 'Icon' }, options, selected: metadata.icon },
				name: { element: 'select', attributes: { id: 'meta-data-name', name: 'Name' }, options, selected: metadata.name },
				about: { element: 'select', attributes: { id: 'meta-data-about', name: 'About' }, options, selected: metadata.about },
				color: { element: 'select', attributes: { id: 'meta-data-color', name: 'Color' }, options, selected: metadata.color }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.name = updateWindow.find('#meta-data-name').value;
			params.connection.metadata.about = updateWindow.find('#meta-data-about').value;
			params.connection.metadata.color = updateWindow.find('#meta-data-color').value;

			params.container = draftDom;
			params.flag = true;

			this.runUpdate(params);
			updateWindow.find('.form-error').css({ display: 'unset' });
			updateWindow.find('.form-error').textContent = 'Drafted Updated';
		});

		if (!this.func.isnull(paneConnection)) {
			paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {

				this.element.innerHTML = draftDom.innerHTML;

				this.element.css(draftDom.css());

				this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			});
		}

		return updateWindow;
	}

	public runUpdate(params) {
		let source = this.func.extractFromJsonArray(params.connection.metadata, params.source);
		let key = this.key || params.container.dataset.key;
		let newContent = this.render({ source });
		params.container.find('.crater-tiles-content').innerHTML = newContent.find('.crater-tiles-content').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;
	
		if (params.flag == true) {
			this.paneContent.find('.tiles-pane').innerHTML = this.generatePaneContent({ tiles: newContent.findAll('.crater-tiles-content-column') }).innerHTML;
	
			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Tiles };