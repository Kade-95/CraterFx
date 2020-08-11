import { ElementModifier } from './../ElementModifier';
import { ColorPicker } from './../ColorPicker';

class Counter extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	private backgroundImage = '';
	private backgroundColor = '#999999';
	private color = 'white';
	private columns: number = 3;
	private duration: number = 10;
	private height: any = 0;
	private backgroundPosition: any;
	private backgroundWidth: any;
	private backgroundHeight: any;
	private key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.backgroundImage = this.sharePoint.images.append;
		this.params = params;
	}

	public render(params) {
		let data = { name: 'Count One', count: 50, image: "https://acollectivemind.files.wordpress.com/2013/12/season-4-complete-cast-poster-the-walking-dead-the-walking-dead-35777405-2528-670.png", icon: this.sharePoint.icons.plus, unit: '%', color: '#333333', link: 'https://www.nairaland.com' };

		if (!this.func.isset(params.source)) params.source = [
			data, data, data
		];

		let counter = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-counter', 'data-type': 'counter' } });

		let content = counter.makeElement({
			element: 'div', attributes: { class: 'crater-counter-content', id: 'crater-counter-content' }
		});

		for (let count of params.source) {
			content.append(
				this.createElement({
					element: 'div', attributes: { class: 'crater-counter-content-column', 'data-background-image': count.image.Url || count.image, style: { backgroundColor: count.color } }, children: [
						{
							element: 'span', attributes: { class: 'crater-background-filter' }
						},
						{
							element: 'i', attributes: { class: 'crater-counter-content-column-image', 'data-icon': count.icon }
						},
						{
							element: 'div', attributes: { class: 'crater-counter-content-column-details' }, children: [
								this.createElement({
									element: 'span', attributes: {
										class: 'crater-counter-content-column-details-value'
									}, children: [
										this.createElement({ element: 'a', attributes: { 'data-count': count.count, class: 'crater-counter-content-column-details-value-count', id: 'count' }, text: count.count }),
										this.createElement({ element: 'a', attributes: { class: 'crater-counter-content-column-details-value-unit', id: 'unit' }, text: count.unit })
									]
								}),
								this.createElement({ element: 'a', attributes: { class: 'crater-counter-content-column-details-name', id: 'name', href: count.link }, text: count.name }),
							]
						}
					]
				})
			);
		}

		this.func.objectCopy(params, counter.dataset);
		this.key = this.key || counter.dataset.key;
		//upload the pre-defined settings of the webpart
		let settings = {
			columns: 3,
			duration: 10,
			backgroundSize: 'auto 40%',
			backgroundPosition: 'Left',
			counter: { backgroundIcons: 'Normal', iconStyle: 'None', boxStyle: 'Solid', backgroundView: 'None', linkOption: 'Link' },
			linkWindow: 'Same Window'
		};

		this.sharePoint.saveSettings(counter, settings);

		return counter;
	}

	public rendered(params) {
		this.params = params;
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let counters = this.element.findAll('.crater-counter-content-column');
		let { length } = counters;
		let currentContent;

		this.columns = settings.columns / 1;
		this.duration = settings.duration / 1;
		this.backgroundPosition = settings.backgroundPosition;
		this.backgroundWidth = settings.backgroundWidth;
		this.backgroundHeight = settings.backgroundHeight;

		this.height = this.element.css().height;

		this.element.findAll('.crater-counter-content').forEach(content => {
			content.remove();
		});

		//set the dimensions and get the height
		return new Promise((resolve, reject) => {
			for (let i = 0; i < length; i++) {
				let counter = counters[i];

				if (i % this.columns == 0) {
					let columns = this.columns;

					if (this.columns > length - i) {
						columns = length - i;
					}

					currentContent = this.element.makeElement({ element: 'div', attributes: { class: 'crater-counter-content', style: { 'gridTemplateColumns': `repeat(${columns}, 1fr)`, gridGap: settings.gap } } });
				}

				currentContent.append(counter);
				counter.find('.crater-counter-content-column-image').css({ height: this.backgroundHeight, width: this.backgroundWidth, filter: `blur(${settings.backgroundFilter})` });

				if (settings.showIcons == 'No') {
					counter.find('.crater-counter-content-column-image').hide();
				} else {
					counter.find('.crater-counter-content-column-image').show();
				}

				if (settings.counter.backgroundIcons.toLowerCase() === 'normal') {
					this.element.querySelectorAll('.crater-counter-content-column').forEach(counterDiv => {
						const styleIcons = (settings.counter.iconStyle.toLowerCase() === 'none') ? '50px' : '30px';
						counterDiv.querySelector('.crater-counter-content-column-image').style.width = styleIcons;
						counterDiv.querySelector('.crater-counter-content-column-image').style.height = styleIcons;
						counterDiv.style.paddingLeft = '5%';
						counterDiv.querySelector('.crater-counter-content-column-image').style.zIndex = '1';
						counterDiv.querySelector('.crater-counter-content-column-image').style.marginLeft = 'unset';
						counterDiv.querySelector('.crater-counter-content-column-image').style.marginRight = 'unset';
						counterDiv.style.overflow = 'auto';
						counterDiv.querySelector('.crater-counter-content-column-image').style.position = 'relative';
					});
				}

				if (settings.counter.linkOption.toLowerCase() === 'link') {
					this.element.querySelectorAll('.crater-counter-content-column').forEach(followLink => {
						followLink.querySelectorAll('.crater-background-filter').forEach(filterBackground => {
							filterBackground.style.zIndex = '-1';
						});
						followLink.addEventListener('mouseover', e => {
							followLink.style.cursor = 'pointer';
						});
						followLink.addEventListener('mouseout', e => {
							followLink.style.cursor = 'unset';
						});

						followLink.addEventListener('click', e => {
							followLink.querySelector('.crater-counter-content-column-details-name').click();
						});
					});
				} else if (settings.counter.linkOption.toLowerCase() === 'unlink') {
					this.element.querySelectorAll('.crater-counter-content-column').forEach(followLink => {
						followLink.querySelectorAll('.crater-background-filter').forEach(filterBackground => {
							filterBackground.style.zIndex = 'unset';
						});
					});
				}

				if (this.backgroundPosition != 'Right') {
					counter.find('.crater-counter-content-column-image').css({ gridColumnStart: 1, gridRowStart: 1 });
					counter.find('.crater-counter-content-column-details').css({ gridColumnStart: 2, gridRowStart: 1 });
					// counter.find('.crater-counter-content-column-details').css({ textAlign: 'right' });
					if (settings.counter.backgroundIcons.toLowerCase() === 'split') {
						this.element.querySelectorAll('.crater-counter-content-column').forEach(counterDiv => {
							counterDiv.querySelector('.crater-counter-content-column-image').style.width = '100px';
							counterDiv.querySelector('.crater-counter-content-column-image').style.height = '80px';
							counterDiv.style.paddingLeft = '0';
							counterDiv.querySelector('.crater-counter-content-column-image').style.zIndex = '1';
							counterDiv.querySelector('.crater-counter-content-column-image').style.marginLeft = '-50px';
							if (counterDiv.querySelector('.crater-counter-content-column-image').style.marginRight) counterDiv.querySelector('.crater-counter-content-column-image').style.marginRight = 'unset';
							counterDiv.style.overflow = 'hidden';
							counterDiv.querySelector('.crater-counter-content-column-image').style.position = 'absolute';
						});
					}
				} else {
					counter.find('.crater-counter-content-column-image').css({ gridColumnStart: 3, gridRowStart: 1 });
					counter.find('.crater-counter-content-column-details').css({ gridColumnStart: 1, gridRowStart: 1 });
					// counter.find('.crater-counter-content-column-details').css({ textAlignLast: 'left' });
					if (settings.counter.backgroundIcons.toLowerCase() === 'split') {
						this.element.querySelectorAll('.crater-counter-content-column').forEach(counterDiv => {
							counterDiv.querySelector('.crater-counter-content-column-image').style.width = '100px';
							counterDiv.querySelector('.crater-counter-content-column-image').style.height = '80px';
							counterDiv.querySelector('.crater-counter-content-column-image').style.zIndex = '1';
							counterDiv.style.paddingRight = '0';
							counterDiv.querySelector('.crater-counter-content-column-image').style.marginRight = '-60px';
							if (counterDiv.querySelector('.crater-counter-content-column-image').style.marginLeft) counterDiv.querySelector('.crater-counter-content-column-image').style.marginLeft = 'unset';
							counterDiv.style.overflow = 'hidden';
							counterDiv.querySelector('.crater-counter-content-column-image').style.position = 'relative';
						});
					}
				}

				let count = counter.find('#count').dataset['count'];

				counter.find('#count').innerHTML = 0;
				counter.find('#unit').css({ visibility: 'hidden' });

				let interval = setInterval(() => {
					counter.find('#count').innerHTML = counter.find('#count').innerHTML / 1 + 1 / 1;
					if (counter.find('#count').innerHTML == count) {
						counter.find('#unit').css({ visibility: 'unset' });
						clearInterval(interval);
					}
				}, this.duration / count);

				if (!this.func.isset(this.height) || counter.position().height > this.height) {
					this.height = counter.position().height;
				}
			}
			if (this.height.toString().indexOf('px') == -1) this.height += 'px';

			this.element.css({ gridTemplateRows: `repeat(${Math.ceil(length / this.columns)}, '1fr)`, height: this.height });


			if (this.func.isset(settings.height)) {
				this.height = settings.height;
			}

			//set the height of the counter
			for (let i = 0; i < length; i++) {
				let counter = counters[i];
				counter.css({ height: this.height });
			}
		});
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
			let counters = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-counter-content-column');

			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ counters }));

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
								element: 'input', name: 'BackgroundWidth', value: settings.backgroundWidth || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'BackgroundHeight', value: settings.backgroundHeight || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'BackgroundPosition', options: ['Left', 'Right']
							}),
							this.cell({
								element: 'input', name: 'Box Height', value: settings.height || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show Icons', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'input', name: 'Gap', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Background Filter'
							}),
							this.cell({
								element: 'select', name: 'style', options: ['Solid', 'Simple', 'Border', 'Gradient', 'Shadow']
							}),
							this.cell({
								element: 'select', name: 'icon-style', options: ['Circle', 'Square', 'None']
							}),
							this.cell({
								element: 'select', name: 'background-icon-style', options: ['Split', 'Normal']
							}),
							this.cell({
								element: 'select', name: 'background-view', options: ['Transparent', 'Absolute', 'None']
							}),
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card link-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: "Link Options"
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'link-option', options: ['Link', 'Unlink']
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							}),
						]
					})
				]
			});
		}

		this.paneContent.find('#Box-Height-cell').value = settings.height || '';

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let counterPane = this.createElement({
			element: 'div', attributes: { class: 'card counter-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: "Counters"
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.counters.length; i++) {
			counterPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-counter-content-column-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-counter-content-column' }),
					this.cell({
						element: 'i', name: 'Icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': params.counters[i].find('.crater-counter-content-column-image').dataset.icon }
					}),
					this.cell({
						element: 'img', name: 'BackgroundImage', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: params.counters[i].dataset.backgroundImage || '' }
					}),
					this.cell({
						element: 'input', name: 'Icon-size', value: params.counters[i].find('.crater-counter-content-column-image').css()['font-size']
					}),
					this.cell({
						element: 'input', name: 'Icon-color', dataAttributes: { type: 'color' }, value: params.counters[i].find('.crater-counter-content-column-image').css().color
					}),
					this.cell({
						element: 'input', name: 'Count', value: params.counters[i].find('#count').textContent
					}),
					this.cell({
						element: 'input', name: 'Unit', value: params.counters[i].find('#unit').textContent
					}),
					this.cell({
						element: 'input', name: 'Name', value: params.counters[i].find('#name').textContent
					}),
					this.cell({
						element: 'input', name: 'count-color', dataAttributes: { type: 'color' }, value: this.func.isset(params.counters[i].css().color) ? params.counters[i].css().color : this.color, list: this.func.colors
					}),
					this.cell({
						element: 'input', name: 'name-color', dataAttributes: { type: 'color' }, value: this.func.isset(params.counters[i].querySelector('.crater-counter-content-column-details-name').css().color) ? params.counters[i].querySelector('.crater-counter-content-column-details-name').css().color : this.color, list: this.func.colors
					}),
					this.cell({
						element: 'input', name: 'Background', dataAttributes: { type: 'color' }, value: this.func.isset(params.counters[i].css()['background-color']) ? params.counters[i].css()['background-color'] : this.backgroundColor, list: this.func.colors
					}),
					this.cell({
						element: 'input', name: 'url', value: params.counters[i].querySelector('.crater-counter-content-column-details-name').href
					})
				]
			});
		}

		return counterPane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let content = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-counter-content');
		let counters = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-counter-content-column');


		let columnPrototype = this.createElement({
			element: 'div', attributes: { class: 'crater-counter-content-column keyed-element', 'data-background-image': 'https://picsum.photos/200', style: { backgroundColor: this.backgroundColor, color: this.color } }, children: [
				{
					element: 'i', attributes: { class: 'crater-counter-content-column-image', 'data-icon': this.sharePoint.icons.pencil }
				},
				this.createElement({
					element: 'div', attributes: { class: 'crater-counter-content-column-details' }, children: [
						this.createElement({
							element: 'span', attributes: { class: 'crater-counter-content-column-details-value' }, children: [
								this.createElement({ element: 'a', attributes: { 'data-count': 100, class: 'crater-counter-content-column-details-value-count', id: 'count' }, text: 100 }),
								this.createElement({ element: 'a', attributes: { class: 'crater-counter-content-column-details-value-unit', id: 'unit' }, text: 'Unit' }),
							]
						}),
						this.createElement({ element: 'a', attributes: { class: 'crater-counter-content-column-details-name', id: 'name' }, text: 'Name' }),
					]
				})
			]
		});

		let columnPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-counter-content-column-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-counter-content-column' }),
				this.cell({
					element: 'i', name: 'Icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': columnPrototype.querySelector('.crater-counter-content-column-image').dataset.icon }
				}),
				this.cell({
					element: 'img', name: 'BackgroundImage', edit: 'upload-image', attributes: {}, dataAttributes: { class: 'crater-icon', src: columnPrototype.dataset.backgroundImage }
				}),
				this.cell({
					element: 'input', name: 'Icon-size'
				}),
				this.cell({
					element: 'input', name: 'Icon-color', dataAttributes: { type: 'color' }
				}),
				this.cell({
					element: 'input', name: 'Count'
				}),
				this.cell({
					element: 'input', name: 'Unit'
				}),
				this.cell({
					element: 'input', name: 'Name'
				}),
				this.cell({
					element: 'input', name: 'count-color', dataAttributes: { type: 'color' }, list: this.func.colors
				}),
				this.cell({
					element: 'input', name: 'name-color', dataAttributes: { type: 'color' }, list: this.func.colors
				}),
				this.cell({
					element: 'input', name: 'Background', dataAttributes: { type: 'color' }, value: this.backgroundColor, list: this.func.colors
				}),
				this.cell({
					element: 'input', name: 'url', value: 'Url'
				})
			]
		});


		let countercolumnHandler = (counterColumnPane, counterColumnDom) => {
			counterColumnPane.addEventListener('mouseover', event => {
				counterColumnPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			counterColumnPane.addEventListener('mouseout', event => {
				counterColumnPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			counterColumnPane.find('#Icon-cell').checkChanges(() => {
				counterColumnDom.find('.crater-counter-content-column-image').removeClasses(counterColumnDom.find('.crater-counter-content-column-image').dataset.icon);
				counterColumnDom.find('.crater-counter-content-column-image').addClasses(counterColumnPane.find('#Icon-cell').dataset.icon);
				counterColumnDom.find('.crater-counter-content-column-image').dataset.icon = counterColumnPane.find('#Icon-cell').dataset.icon;
			});

			counterColumnPane.find('#BackgroundImage-cell').checkChanges(() => {
				if (settings.counter['backgroundView'].toLowerCase() === 'transparent') {
					const colorValue = counterColumnPane.querySelector('#Background-cell').getAttribute('value');
					const colorOpacity = (colorValue.indexOf('#') !== -1) ? 'rgba(' + parseInt(colorValue.substring(1, 3), 16) + ',' + parseInt(colorValue.substring(3, 5), 16) + ',' + parseInt(colorValue.substring(5, 7), 16) + ',0.45)' : 'rgba(' + parseInt(ColorPicker.rgbToHex(colorValue).substring(1, 3), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(3, 5), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(5, 7), 16) + ',0.45)';
					const bgWidth = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundWidth-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().width + "px";
					const bgHeight = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundHeight-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().height + "px";
					counterColumnDom.css({ backgroundSize: `${bgWidth} ${bgHeight}` });
					counterColumnDom.style.background = `linear-gradient(
						${colorOpacity}, 
						${colorOpacity}
					  ), url(${counterColumnPane.find('#BackgroundImage-cell').src}) center center`;
				} else if (settings.counter['backgroundView'].toLowerCase() === 'absolute') {
					counterColumnDom.style.background = "unset";
					counterColumnDom.style.backgroundAttachment = "unset";
					counterColumnDom.style.backgroundClip = "unset";
					counterColumnDom.style.backgroundOrigin = "unset";
					counterColumnDom.style.backgroundPositionX = "unset";
					counterColumnDom.style.backgroundPositionY = "unset";
					counterColumnDom.style.backgroundRepeat = "unset";
					counterColumnDom.setBackgroundImage(counterColumnPane.find('#BackgroundImage-cell').src);
					counterColumnDom.css({ backgroundSize: `${this.element.find('.crater-counter-content-column').getBoundingClientRect().width + "px"} ${this.element.find('.crater-counter-content-column').getBoundingClientRect().height + "px"}` });
				}
			});

			counterColumnPane.find('#Icon-size-cell').onChanged(fontSize => {
				counterColumnDom.find('.crater-counter-content-column-image').css({
					fontSize
				});
				counterColumnPane.find('#Icon-size-cell').value = fontSize;
			});

			counterColumnPane.find('#Icon-color-cell').onchange = () => {
				counterColumnDom.find('.crater-counter-content-column-image').css({
					color: counterColumnPane.find('#Icon-color-cell').value
				});
				counterColumnPane.find('#Icon-color-cell').setAttribute('value', counterColumnPane.find('#Icon-color-cell').value);
			};

			counterColumnPane.find('#Count-cell').onChanged(value => {
				counterColumnDom.find('.crater-counter-content-column-details-value-count').dataset['count'] = value;
			});

			counterColumnPane.find('#Unit-cell').onChanged(value => {
				counterColumnDom.find('.crater-counter-content-column-details-value-unit').innerHTML = value;
			});

			counterColumnPane.find('#Name-cell').onChanged(value => {
				counterColumnDom.find('.crater-counter-content-column-details-name').innerHTML = value;
			});

			counterColumnPane.find('#count-color-cell').addEventListener('change', event => {
				const color = counterColumnPane.find('#count-color-cell').value;
				counterColumnDom.css({ color });
				counterColumnPane.find('#count-color-cell').setAttribute('value', color);
			});

			counterColumnPane.find('#name-color-cell').onchange = (event) => {
				const color = counterColumnPane.find('#name-color-cell').value;
				counterColumnDom.querySelector('.crater-counter-content-column-details-name').css({ color });
				counterColumnPane.find('#name-color-cell').setAttribute('value', color);
			};

			counterColumnPane.find('#Background-cell').addEventListener('change', () => {
				const backgroundColor = counterColumnPane.find('#Background-cell').value;
				counterColumnDom.css({ backgroundColor });
				counterColumnPane.find('#Background-cell').setAttribute('value', backgroundColor);
			});

			counterColumnPane.find('#url-cell').onChanged(value => {
				counterColumnDom.find('.crater-counter-content-column-details-name').href = value;
			});

			counterColumnPane.find('.delete-crater-counter-content-column').addEventListener('click', event => {
				counterColumnDom.remove();
				counterColumnPane.remove();
			});

			counterColumnPane.find('.add-before-crater-counter-content-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				counterColumnDom.before(newColumnPrototype);
				counterColumnPane.before(newColumnPanePrototype);
				countercolumnHandler(newColumnPanePrototype, newColumnPrototype);
			});

			counterColumnPane.find('.add-after-crater-counter-content-column').addEventListener('click', event => {
				let newColumnPrototype = columnPrototype.cloneNode(true);
				let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

				counterColumnDom.after(newColumnPrototype);
				counterColumnPane.after(newColumnPanePrototype);
				countercolumnHandler(newColumnPanePrototype, newColumnPrototype);
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newColumnPrototype = columnPrototype.cloneNode(true);
			let newColumnPanePrototype = columnPanePrototype.cloneNode(true);

			content.append(newColumnPrototype);//c
			this.paneContent.find('.counter-pane').append(newColumnPanePrototype);

			countercolumnHandler(newColumnPanePrototype, newColumnPrototype);
		});

		this.paneContent.findAll('.crater-counter-content-column-pane').forEach((counterColumnPane, position) => {
			countercolumnHandler(counterColumnPane, counters[position]);
		});

		let linkCell = this.paneContent.querySelector('.link-pane').querySelector('#link-option-cell');
		linkCell.value = settings.counter['linkOption'];
		linkCell.onchange = () => {
			settings.counter['linkOption'] = linkCell.value;
		};

		this.paneContent.find('#Duration-cell').onChanged();
		this.paneContent.find('#Columns-cell').onChanged();
		this.paneContent.find('#Box-Height-cell').onChanged();
		this.paneContent.find('#Gap-cell').onChanged();
		this.paneContent.find('#Show-Icons-cell').onChanged();
		this.paneContent.find('#Background-Filter-cell').onChanged();
		this.paneContent.find('#BackgroundWidth-cell').onChanged();
		this.paneContent.find('#BackgroundHeight-cell').onChanged();
		this.paneContent.find('#Link-Window-cell').onChanged();

		let styleCell = this.paneContent.find('#style-cell');
		styleCell.value = settings.counter['boxStyle'];
		styleCell.onchange = () => {
			styleCell.value = styleCell.value;
			settings.counter['boxStyle'] = styleCell.value;
			switch (styleCell.value.toLowerCase()) {
				case 'solid':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						counterBox.style.color = '#fff';
						counterBox.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						counterBox.style.boxShadow = `none`;
						counterBox.style.border = 'none';
						counterBox.querySelector('.crater-counter-content-column-details-name').style.color = '#000';
					});
					break;

				case 'simple':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						counterBox.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						counterBox.style.backgroundColor = 'white';
						counterBox.style.backgroundImage = 'none';
						counterBox.style.border = 'none';
					});
					break;

				case 'border':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						const colorVal = counterBox.style.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						counterBox.style.color = colorVal;
						counterBox.style.backgroundColor = 'white';
						counterBox.style.backgroundImage = 'none';
						counterBox.style.boxShadow = 'none';
						counterBox.style.border = `1px solid ${colorVal}`;
					});
					break;

				case 'gradient':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						counterBox.style.color = '#fff';
						counterBox.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						counterBox.style.boxShadow = `0px 0px 10px rgba(0,0,0,0.8)`;
						counterBox.style.border = `none`;
						counterBox.querySelector('.crater-counter-content-column-details-name').style.color = '#000';
					});
					break;

				case 'shadow':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						const colorVal = counterBox.style.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						counterBox.style.color = colorVal;
						counterBox.style.backgroundColor = `white`;
						counterBox.style.boxShadow = `0px 0px 10px rgba(3,3,3,1)`;
						counterBox.style.border = `none`;
					});
					break;

			}
		};

		let IconStyleCell = this.paneContent.find('#icon-style-cell');
		IconStyleCell.value = settings.counter['iconStyle'];
		IconStyleCell.onchange = () => {
			switch (IconStyleCell.value.toLowerCase()) {
				case 'circle':
					draftDom.querySelectorAll('.crater-counter-content-column-image').forEach(counterIcon => {
						const colorVal = counterIcon.parentElement.style.color || '#fff';
						counterIcon.style.border = `1px solid ${colorVal}`;
						counterIcon.style.borderRadius = `50%`;
						counterIcon.style.padding = `5%`;
					});
					settings.counter['iconStyle'] = 'Circle';
					break;

				case 'square':
					draftDom.querySelectorAll('.crater-counter-content-column-image').forEach(counterIcon => {
						const colorVal = counterIcon.parentElement.style.color || '#fff';
						counterIcon.style.border = `1px solid ${colorVal}`;
						counterIcon.style.borderRadius = `0`;
						counterIcon.style.padding = `5%`;
					});
					settings.counter['iconStyle'] = 'Square';
					break;

				case 'none':
					draftDom.querySelectorAll('.crater-counter-content-column-image').forEach(counterIcon => {
						const colorVal = counterIcon.parentElement.style.color || '#fff';
						counterIcon.style.border = `0`;
						counterIcon.style.borderRadius = `0`;
						counterIcon.style.padding = `0`;
					});
					settings.counter['iconStyle'] = 'None';
					break;

			}
		};

		let bcStyleCell = this.paneContent.find('#background-icon-style-cell');
		bcStyleCell.value = settings.counter['backgroundIcons'];
		bcStyleCell.onchange = () => {
			switch (bcStyleCell.value.toLowerCase()) {
				case 'split':
					settings.counter['backgroundIcons'] = 'Split';
					break;

				case 'normal':
					settings.counter['backgroundIcons'] = 'Normal';
					break;
			}
		};

		let bcViewCell = this.paneContent.find('#background-view-cell');
		bcViewCell.value = settings.counter['backgroundView'];

		bcViewCell.onchange = () => {
			settings.counter['backgroundView'] = bcViewCell.value;
			switch (bcViewCell.value.toLowerCase()) {
				case 'transparent':
					const columnDivs = draftDom.querySelectorAll('.crater-counter-content-column');
					const paneDivs = this.paneContent.querySelector('.counter-pane').querySelectorAll('#BackgroundImage-cell');
					for (let i = 0; i < columnDivs.length; i++) {
						const colorValue = paneDivs[i].parentElement.parentElement.querySelector('#Background-cell').getAttribute('value');
						const colorOpacity = (paneDivs[i].parentElement.parentElement.querySelector('#Background-cell').getAttribute('value').indexOf('#') !== -1) ? 'rgba(' + parseInt(colorValue.substring(1, 3), 16) + ',' + parseInt(colorValue.substring(3, 5), 16) + ',' + parseInt(colorValue.substring(5, 7), 16) + ',0.45)' : 'rgba(' + parseInt(ColorPicker.rgbToHex(colorValue).substring(1, 3), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(3, 5), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(5, 7), 16) + ',0.45)';
						const bgWidth = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundWidth-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().width + "px";
						const bgHeight = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundHeight-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().height + "px";
						columnDivs[i].css({ backgroundSize: `${bgWidth} ${bgHeight}` });
						columnDivs[i].style.background = `linear-gradient(
						${colorOpacity}, 
						${colorOpacity}
					  ), url(${paneDivs[i].src}) center center`;
					}
					break;

				case 'absolute':
					const columnDivs2 = draftDom.querySelectorAll('.crater-counter-content-column');
					const paneDivs2 = this.paneContent.querySelector('.counter-pane').querySelectorAll('#BackgroundImage-cell');
					for (let i = 0; i < columnDivs2.length; i++) {
						const colorValue = paneDivs2[i].parentElement.parentElement.querySelector('#Background-cell').getAttribute('value');
						const colorOpacity = (paneDivs2[i].parentElement.parentElement.querySelector('#Background-cell').getAttribute('value').indexOf('#') !== -1) ? 'rgba(' + parseInt(colorValue.substring(1, 3), 16) + ',' + parseInt(colorValue.substring(3, 5), 16) + ',' + parseInt(colorValue.substring(5, 7), 16) + ',0.45)' : 'rgba(' + parseInt(ColorPicker.rgbToHex(colorValue).substring(1, 3), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(3, 5), 16) + ',' + parseInt(ColorPicker.rgbToHex(colorValue).substring(5, 7), 16) + ',0.45)';
						columnDivs2[i].style.background = "unset";
						columnDivs2[i].style.backgroundAttachment = "unset";
						columnDivs2[i].style.backgroundClip = "unset";
						columnDivs2[i].style.backgroundOrigin = "unset";
						columnDivs2[i].style.backgroundPositionX = "unset";
						columnDivs2[i].style.backgroundPositionY = "unset";
						columnDivs2[i].style.backgroundRepeat = "unset";
						columnDivs2[i].setBackgroundImage(paneDivs2[i].src);
						const bgWidth = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundWidth-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().width + "px";
						const bgHeight = this.paneContent.querySelector('.settings-pane').querySelector('#BackgroundHeight-cell').value || this.element.find('.crater-counter-content-column').getBoundingClientRect().height + "px";
						columnDivs2[i].css({ backgroundSize: `${bgWidth} ${bgHeight}` });
					}
					break;

				case 'none':
					draftDom.querySelectorAll('.crater-counter-content-column').forEach(counterBox => {
						counterBox.style.boxShadow = `none`;
						counterBox.style.border = 'none';
						counterBox.style.background = "unset";
						counterBox.style.backgroundAttachment = "unset";
						counterBox.style.backgroundClip = "unset";
						counterBox.style.backgroundOrigin = "unset";
						counterBox.style.backgroundPositionX = "unset";
						counterBox.style.backgroundPositionY = "unset";
						counterBox.style.backgroundRepeat = "unset";
						counterBox.style.backgroundImage = 'unset';
						counterBox.style.color = '#fff';
						counterBox.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
					});
					break;
			}
		};
		this.paneContent.find('#Link-Window-cell').value = settings.linkWindow;

		this.paneContent.find('#BackgroundPosition-cell').value = settings.backgroundPosition;
		settings.backgroundPosition = this.paneContent.find('#BackgroundPosition-cell').value;
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

			settings.height = this.paneContent.find('#Box-Height-cell').value;

			settings.gap = this.paneContent.find('#Gap-cell').value;

			settings.showIcons = this.paneContent.find('#Show-Icons-cell').value;

			settings.backgroundFilter = this.paneContent.find('#Background-Filter-cell').value;

			settings.backgroundWidth = this.paneContent.find('#BackgroundWidth-cell').value;

			settings.backgroundHeight = this.paneContent.find('#BackgroundHeight-cell').value;

			settings.backgroundPosition = this.paneContent.find('#BackgroundPosition-cell').value;

			settings.linkWindow = this.paneContent.find('#Link-Window-cell').value;

			this.element.findAll('.crater-counter-content-column').forEach((element, position) => {
				let pane = this.paneContent.findAll('.crater-counter-content-column-pane')[position];

				if (this.func.isset(pane.dataset.backgroundImage)) {
					element.setBackgroundImage(pane.dataset.backgroundImage);
				}
			});

			this.sharePoint.saveSettings(this.element, settings);
		});
	}

	public update(params) {
		this.element = params.element;
		this.key = this.element.dataset.key;
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');
		let metadata = params.connection.metadata || {};
		let options = params.connection.options || [];

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Icon' }, options, selected: metadata.image },
				icon: { element: 'select', attributes: { id: 'meta-data-icon', name: 'Icon' }, options, selected: metadata.icon },
				name: { element: 'select', attributes: { id: 'meta-data-name', name: 'Name' }, options, selected: metadata.name },
				count: { element: 'select', attributes: { id: 'meta-data-count', name: 'Count' }, options, selected: metadata.count },
				unit: { element: 'select', attributes: { id: 'meta-data-unit', name: 'Unit' }, options, selected: metadata.unit },
				color: { element: 'select', attributes: { id: 'meta-data-color', name: 'Color' }, options, selected: metadata.color }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.icon = updateWindow.find('#meta-data-icon').value;
			params.connection.metadata.name = updateWindow.find('#meta-data-name').value;
			params.connection.metadata.count = updateWindow.find('#meta-data-count').value;
			params.connection.metadata.unit = updateWindow.find('#meta-data-unit').value;
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
		params.container.find('.crater-counter-content').innerHTML = newContent.find('.crater-counter-content').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.counter-pane').innerHTML = this.generatePaneContent({ counters: newContent.findAll('.crater-counter-content-column') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Counter };