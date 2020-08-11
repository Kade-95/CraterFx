import { ElementModifier } from './../ElementModifier';

class Carousel extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	private backgroundImage = '';
	private backgroundColor = '#999999';
	private color = 'white';
	private columns: number = 3;
	private duration: number = 10;
	private key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.backgroundImage = this.sharePoint.images.append;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source)) params.source = [
			{ image: this.sharePoint.images.append, text: 'One here', description: 'Description One' },
			{ image: this.sharePoint.images.edit, text: 'Two now', description: 'Description Two' },
			{ image: this.sharePoint.images.sync, text: 'Three then', description: 'Description Three' },
			{ image: this.sharePoint.images.async, text: 'Four done', description: 'Description Four' },
			{ image: this.sharePoint.images.delete, text: 'Five when', description: 'Description Five' }
		];

		let carousel = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-carousel', 'data-type': 'carousel' } });

		let radioToggle = carousel.makeElement({ element: 'span', attributes: { class: 'crater-top-right', id: 'crater-carousel-controller' } });

		let content = carousel.makeElement({
			element: 'div', attributes: { class: 'crater-carousel-content', id: 'crater-carousel-content' }
		});

		let arrows = carousel.makeElement({
			element: 'div', attributes: { id: 'crater-carousel-arrows' }, children: [
				{ element: 'i', attributes: { class: 'arrow arrow-left', 'data-icon': this.sharePoint.icons['arrow-left'] } },
				{ element: 'i', attributes: { class: 'arrow arrow-right', 'data-icon': this.sharePoint.icons['arrow-right'] } }
			]
		});

		for (let src of params.source) {
			radioToggle.makeElement({ element: 'input', attributes: { type: 'radio', class: 'crater-carousel-radio-toggle' } });
	
			content.makeElement({
				element: 'span', attributes: { class: 'crater-carousel-column' }, children: [
					{ element: 'img', attributes: { class: 'crater-carousel-image', src: src.image.Url || src.image } },
					{ element: 'span', attributes: { class: 'crater-carousel-text' }, text: src.text },
					{ element: 'span', attributes: { class: 'crater-carousel-description' }, text: src.description }
				]
			});
		}

		this.func.objectCopy(params, carousel.dataset);
		this.key = this.key || carousel.dataset.key;
		this.sharePoint.saveSettings(carousel, { columns: 3, duration: 1000 });

		return carousel;
	}

	public rendered(params) {		
		this.params = params;
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.columns = Math.floor(settings.columns);
		this.duration = Math.floor(settings.duration);

		let columns = this.element.findAll('.crater-carousel-column');

		for (let i = 0; i < columns.length; i++) {
			columns[i].querySelector('img').style.width = settings.imageWidth;
			columns[i].querySelector('img').style.height = settings.imageHeight;
			columns[i].css({ height: settings.imageHeight, width: settings.imageWidth, borderSize: settings.borderSize, borderColor: settings.borderColor, borderStyle: settings.borderStyle });
			columns[i].find('.crater-carousel-text').css({ fontFamily: settings.fontFamily, fontSize: settings.fontsize, justifyContent: settings.textPosition });
			columns[i].find('.crater-carousel-description').css({ fontFamily: settings.fontFamily, fontSize: settings.fontsize, justifyContent: settings.textPosition });

			if (settings.showShadow == 'Yes') {
				columns[i].css({ boxShadow: '1px 1px 10px lightgray' });
			}
			else {
				columns[i].cssRemove(['box-shadow']);
			}

			if (settings.curved == 'Yes') {
				columns[i].css({ borderRadius: '10px' });
			}
			else {
				columns[i].cssRemove(['border-radius']);
			}

			if (settings.showText == 'No') {
				columns[i].find('.crater-carousel-text').css({ display: 'none' });
			}
			else {
				columns[i].find('.crater-carousel-text').cssRemove(['display']);
			}

			let backgroundColor = columns[i].css().backgroundColor;
			let textColor = columns[i].find('.crater-carousel-text').css().color || 'black';
			let descriptionColor = columns[i].find('.crater-carousel-description').css().color || 'gray';

			columns[i].addEventListener('mouseenter', event => {
				columns[i].css({ backgroundColor: settings.hoverBackground });
				columns[i].find('.crater-carousel-text').css({ color: settings.hoverTextColor });
				columns[i].find('.crater-carousel-description').css({ color: settings.hoverDescriptionColor });
			});

			columns[i].addEventListener('mouseleave', event => {
				columns[i].css({ backgroundColor });
				columns[i].find('.crater-carousel-text').css({ color: textColor });
				columns[i].find('.crater-carousel-description').css({ color: descriptionColor });
			});
		}
		this.startSlide(settings);
	}

	public startSlide(settings) {
		this.key = this.element.dataset['key'];
		let controller = this.element.find('#crater-carousel-controller'),
			arrows = this.element.findAll('.arrow'),
			radios,
			columns = this.element.findAll('.crater-carousel-column'),
			radio: any,
			key = 0;

		if (this.element.length < 1) return;

		//reset control buttons
		controller.innerHTML = '';

		//stack the first slide ontop
		for (let position = 0; position < columns.length; position++) {
			columns[position].css({ zIndex: 0 });
			if (position == 0) columns[position].css({ zIndex: 1 });
			controller.makeElement({
				element: 'input', attributes: { class: 'crater-carousel-radio-toggle', type: 'radio' }
			});
		}
		radios = controller.findAll('.crater-carousel-radio-toggle');

		//fading and fadeout animation

		let runSliding = () => {
			if (key < 0) key = radios.length - 1;
			if (key >= radios.length) key = 0;
			for (let element of radios) {
				if (radio != element) element.checked = false;
			}

			let getColumns = () => {
				let currentColunms = [];
				for (let i = 0; i < this.columns; i++) {
					currentColunms[i] = key + i;
					if (currentColunms[i] >= columns.length) {
						currentColunms[i] -= columns.length;
					}
				}

				return currentColunms;
			};

			let current = getColumns();
			for (let i = 0; i < columns.length; i++) {
				let position: number = current.indexOf(i);
				if (position != -1) {
					columns[i].show();
					columns[i].css({ gridColumnStart: position + 1, gridRowStart: 1 });
				} else {
					columns[i].hide();
				}
			}
		};

		//move to next slide
		let keepSliding = () => {
			clearInterval(settings.animation);
			settings.animation = setInterval(() => {
				key++;
				runSliding();
			}, settings.duration);
		};

		//run animation when arrow is clicked
		for (let arrow of arrows) {
			arrow.addEventListener('click', event => {
				if (arrow.classList.contains('arrow-left')) {
					key--;
				}
				else if (arrow.classList.contains('arrow-right')) {
					key++;
				}

				clearInterval(settings.animation);
				runSliding();
			});
		}

		//run animation when a controller is clicked
		for (let position = 0; position < radios.length; position++) {
			radios[position].addEventListener('click', () => {
				clearInterval(settings.animation);
				key = position;
				runSliding();
			});
		}

		//click the first controller and set the first slide
		radios[key].click();
		keepSliding();
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
			let columns = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-carousel-column');

			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ columns }));

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
								element: 'input', name: 'Duration', value: settings.duration || ''
							}),
							this.cell({
								element: 'input', name: 'Columns', value: settings.columns || ''
							}),
							this.cell({
								element: 'input', name: 'FontSize'
							}),
							this.cell({
								element: 'input', name: 'FontStyle'
							}),
							this.cell({
								element: 'input', name: 'Image Width', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Image Height', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show Text', value: settings.showText || '', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Show Description', value: settings.showDescription || '', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Curved', value: settings.curved || '', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Shadow', value: settings.showShadow || '', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'input', name: 'Hover Background', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'Hover Text Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'Hover Description Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'Text Position', options: ['Left', 'Center', 'Right']
							}),
							this.cell({
								element: 'input', name: 'Border Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'Border Style', list: this.func.borderTypes
							}),
							this.cell({
								element: 'input', name: 'Border Size', list: this.func.pixelSizes
							}),
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let columnsPane = this.createElement({
			element: 'div', attributes: { class: 'card columns-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: "Columns"
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.columns.length; i++) {
			columnsPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-carousel-column-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-carousel-column' }),
					this.cell({
						element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: params.columns[i].find('.crater-carousel-image').src }
					}),
					this.cell({
						element: 'input', name: 'Text', attributes: {}, value: params.columns[i].find('.crater-carousel-text').innerText || ''
					}),
					this.cell({
						element: 'input', name: 'Text Color', dataAttributes: { type: 'color' }
					}),
					this.cell({
						element: 'input', name: 'Description', attributes: {}, value: params.columns[i].find('.crater-carousel-description').innerText || ''
					}),
					this.cell({
						element: 'input', name: 'Description Color', dataAttributes: { type: 'color' }
					}),
					this.cell({
						element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
					}),
				]
			});
		}

		return columnsPane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		let settingsClone: any = {};
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let domDraft = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let content = domDraft.find('.crater-carousel-content');
		let columns = domDraft.findAll('.crater-carousel-column');

		let columnPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-carousel-column-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-carousel-column' }),
				this.cell({
					element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: this.sharePoint.images.append }
				}),
				this.cell({
					element: 'input', name: 'Text', attributes: {}, value: 'Text Here'
				}),
				this.cell({
					element: 'input', name: 'Color', dataAttributes: { type: 'color' }
				}),
				this.cell({
					element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
				}),
			]
		});

		let columnPrototype = this.createElement({
			element: 'span', attributes: { class: 'crater-carousel-column' }, children: [
				{ element: 'img', attributes: { class: 'crater-carousel-image', src: this.sharePoint.images.append } },
				{ element: 'span', attributes: { class: 'crater-carousel-text' }, text: 'Text Here' }
			]
		});

		let carouselColumnHandler = (columnPane, columnDom) => {
			columnPane.addEventListener('mouseover', event => {
				columnPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			columnPane.addEventListener('mouseout', event => {
				columnPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			columnPane.find('#Image-cell').checkChanges(() => {
				columnDom.find('.crater-carousel-image').src = columnPane.find('#Image-cell').src;
			});

			columnPane.find('#Text-cell').onChanged(value => {
				columnDom.find('.crater-carousel-text').textContent = value;
			});

			columnPane.find('#Text-Color-cell').onChanged(color => {
				columnDom.find('.crater-carousel-text').css({ color });
			});

			columnPane.find('#Description-cell').onChanged(value => {
				columnDom.find('.crater-carousel-description').textContent = value;
			});

			columnPane.find('#Description-Color-cell').onChanged(color => {
				columnDom.find('.crater-carousel-description').css({ color });
			});

			columnPane.find('#BackgroundColor-cell').onChanged(backgroundColor => {
				columnDom.css({ backgroundColor });
			});

			columnPane.find('.delete-crater-carousel-column').addEventListener('click', event => {
				columnDom.remove();
				columnPane.remove();
			});

			columnPane.find('.add-before-crater-carousel-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				columnDom.before(newColumnPrototype);
				columnPane.before(newColumnPanePrototype);
				carouselColumnHandler(newColumnPanePrototype, newColumnPrototype);
			});

			columnPane.find('.add-after-crater-carousel-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				columnDom.after(newColumnPrototype);
				columnPane.after(newColumnPanePrototype);
				carouselColumnHandler(newColumnPanePrototype, newColumnPrototype);
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newColumnPrototype = columnPrototype.cloneNode(true);
			let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

			content.append(newColumnPrototype);//c
			this.paneContent.find('.columns-pane').append(newColumnPanePrototype);

			carouselColumnHandler(newColumnPanePrototype, newColumnPrototype);
		});

		this.paneContent.findAll('.crater-carousel-column-pane').forEach((columnPane, position) => {
			carouselColumnHandler(columnPane, columns[position]);
		});

		let settingsPane = this.paneContent.find('.settings-pane');

		settingsPane.find('#Duration-cell').onChanged();

		settingsPane.find('#Columns-cell').onChanged(value => {
			domDraft.find('.crater-carousel-content').css({ gridTemplateColumns: `repeat(${value}, 1fr)` });
		});

		settingsPane.find('#FontSize-cell').onChanged();
		settingsPane.find('#FontStyle-cell').onChanged();
		settingsPane.find('#Image-Width-cell').onChanged();
		settingsPane.find('#Image-Height-cell').onChanged();
		settingsPane.find('#Show-Text-cell').onChanged();
		settingsPane.find('#Curved-cell').onChanged();
		settingsPane.find('#Shadow-cell').onChanged();
		settingsPane.find('#Hover-Background-cell').onChanged();
		settingsPane.find('#Hover-Text-Color-cell').onChanged();
		settingsPane.find('#Hover-Description-Color-cell').onChanged();
		settingsPane.find('#Text-Position-cell').onChanged();
		settingsPane.find('#Border-Color-cell').onChanged();
		settingsPane.find('#Border-Style-cell').onChanged();
		settingsPane.find('#Border-Size-cell').onChanged();

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.duration = this.paneContent.find('#Duration-cell').value;
			settings.columns = this.paneContent.find('#Columns-cell').value;
			settings.fontsize = settingsPane.find('#FontSize-cell').value;
			settings.fontFamily = settingsPane.find('#FontStyle-cell').value;
			settings.imageWidth = settingsPane.find('#Image-Width-cell').value;
			settings.imageHeight = settingsPane.find('#Image-Height-cell').value;
			settings.showText = settingsPane.find('#Show-Text-cell').value;
			settings.curved = settingsPane.find('#Curved-cell').value;
			settings.showShadow = settingsPane.find('#Shadow-cell').value;
			settings.hoverBackground = settingsPane.find('#Hover-Background-cell').value;
			settings.hoverTextColor = settingsPane.find('#Hover-Text-Color-cell').value;
			settings.hoverDescriptionColor = settingsPane.find('#Hover-Description-Color-cell').value;
			settings.textPosition = settingsPane.find('#Text-Position-cell').value;
			settings.borderColor = settingsPane.find('#Border-Color-cell').value;
			settings.borderStyle = settingsPane.find('#Border-Style-cell').value;
			settings.borderSize = settingsPane.find('#Border-Size-cell').value;

			if (settings.textPosition == 'Right') settings.textPosition = 'flex-end';
			this.sharePoint.saveSettings(this.element, settings, settingsClone);
		});
	}

	public update(params) {		
		this.element = params.element;
		this.key = this.element.dataset['key'];
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');
		let metadata = params.connection.metadata || {};
		let options = params.connection.options || [];

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Image' }, options, selected: metadata.image },
				text: { element: 'select', attributes: { id: 'meta-data-text', name: 'Text' }, options, selected: metadata.text },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.text = updateWindow.find('#meta-data-text').value;
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
		params.container.find('.crater-carousel-content').innerHTML = newContent.find('.crater-carousel-content').innerHTML;;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;
	
		if (params.flag == true) {
			this.paneContent.find('.columns-pane').innerHTML = this.generatePaneContent({ columns: newContent.findAll('.crater-carousel-column') }).innerHTML;
	
			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Carousel };