import { ElementModifier } from './../ElementModifier';
//maintain same width
class Icons extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	private key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source)) params.source = [
			{ title: 'Instagram', link: 'https://instgram.com', class: this.sharePoint.icons.instagram, image: this.sharePoint.images.append },
			{ title: 'Snapchat', link: 'https://snapchat.com', class: this.sharePoint.icons.snapchat, image: this.sharePoint.images.append },
			{ title: 'WhatsApp', link: 'https://whatsapp.com', class: this.sharePoint.icons.whatsapp, image: this.sharePoint.images.append }
		];

		let icons = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-icons', 'data-type': 'icons' } });

		let content = icons.makeElement({
			element: 'div', attributes: { class: 'crater-icons-content', id: 'crater-icons-content' }
		});

		for (let icon of params.source) {
			content.makeElement(
				{
					element: 'div', attributes: { id: 'crater-icons-icon-div', class: 'crater-icons-icon-div' }, children: [
						{
							element: 'a', attributes: { class: 'crater-icons-icon crater-curve', title: icon.title, href: icon.link }, children: [
								{
									element: 'i', attributes: { class: `crater-icons-icon-image`, 'data-icon': icon.class }
								}]
						}
					]
				}
			);
		}

		this.sharePoint.saveSettings(icons, { displayStyle: 'Square', hoverStyle: 'Zoom', curved: 'Yes' });
		this.key = this.key || icons.dataset.key;

		return icons;
	}

	public rendered(params) {
		this.params = params;
		this.element = params.element;
		const settings = JSON.parse(this.element.dataset.settings);
		this.key = this.element.dataset['key'];

		let icons = this.element.findAll('.crater-icons-icon-div');

		this.element.querySelectorAll('.crater-icons-icon').forEach(iconBox => {
			iconBox.style.padding = '.4vw';
			if (iconBox.querySelector('i').classList.contains('fa-5x')) {
				iconBox.style.width = '70px';
				return;
			}

			if (iconBox.querySelector('i').classList.contains('fa-4x')) {
				iconBox.style.width = '60px';
				return;
			}

			if (iconBox.querySelector('i').classList.contains('fa-3x')) {
				iconBox.style.width = '50px';
				return;
			}

			if (iconBox.querySelector('i').classList.contains('fa-2x')) {
				iconBox.style.width = '40px';
				return;
			}

			if (iconBox.querySelector('i').classList.contains('fa-1x')) {
				iconBox.style.width = '30px';
				return;
			}
		});
		switch (settings.hoverStyle.toLowerCase()) {
			case 'zoom':
				this.element.querySelectorAll('.crater-icons-icon').forEach(iconBox => {
					iconBox.onmouseover = () => {
						iconBox.style.transition = 'padding .25s ease-in-out';
						iconBox.style.padding = `.8vw`;
					};

					iconBox.onmouseout = () => {
						iconBox.style.transition = 'padding .25s ease-in-out';
						iconBox.style.padding = `.4vw`;
					};
				});
				break;

			case 'lighten':
				this.element.querySelectorAll('.crater-icons-icon').forEach(iconBox => {
					iconBox.onmouseover = () => {
						iconBox.style.transition = 'opacity .25s ease-in-out';
						iconBox.style.opacity = `.6`;
					};

					iconBox.onmouseout = () => {
						iconBox.style.transition = 'opacity .25s ease-in-out';
						iconBox.style.opacity = `1`;
					};
				});
				break;

			case 'fill up':
				this.element.querySelectorAll('.crater-icons-icon').forEach(iconBox => {
					const iconColor = iconBox.querySelector('i').css().color || 'white';
					const boxColor = iconBox.css().backgroundColor || 'rgb(58, 56, 56)';
					iconBox.onmouseover = () => {
						iconBox.parentElement.style.height = '0';
						iconBox.parentElement.style.transition = 'all .25s ease-in-out';
						iconBox.style.backgroundColor = iconColor;
						iconBox.parentElement.style.backgroundColor = boxColor;
						iconBox.querySelector('i').style.color = boxColor;
						iconBox.parentElement.style.height = 'auto';
					};

					iconBox.onmouseout = () => {
						iconBox.parentElement.style.transition = 'all .25s ease-in-out';
						iconBox.style.backgroundColor = boxColor;
						iconBox.parentElement.style.backgroundColor = 'transparent';
						iconBox.querySelector('i').style.color = iconColor;
					};
				});
				break;
		}
	}

	public generatePaneContent(params) {
		let iconsPane = this.createElement({
			element: 'div', attributes: { class: 'card counter-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: "Icons"
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.icons.length; i++) {
			iconsPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'row crater-icons-icon-pane'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-icons-icon-div' }),
					this.cell({
						element: 'i', name: 'Image', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': params.icons[i].querySelector('.crater-icons-icon-image').dataset.icon }
					}),
					this.cell({
						element: 'input', name: 'Title', value: params.icons[i].querySelector('.crater-icons-icon').getAttribute('title')
					}),
					this.cell({
						element: 'input', name: 'Link', value: params.icons[i].querySelector('.crater-icons-icon').getAttribute('href')
					}),
					this.cell({
						element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: params.icons[i].css()['background-color']
					}),
					this.cell({
						element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: params.icons[i].querySelector('i').css()['color']
					})
				]
			});
		}

		return iconsPane;
	}

	public setUpPaneContent(params): any {
		this.element = params.element;
		this.key = params.element.dataset['key'];

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
			let icons = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-icons-icon-div');
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ icons }));

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
								element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color' }, list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color' }, list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'Curved', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'SpaceBetween', options: ['open', 'close']
							}),
							this.cell({
								element: 'select', name: 'display-style', options: ['Circle', 'Square', 'Outline Circle', 'Outline Square']
							}),
							this.cell({
								element: 'select', name: 'hover-style', options: ['Zoom', 'Lighten', 'Fill Up']
							}),
							this.cell({
								element: 'input', name: 'font-size', value: this.element.querySelector('.crater-icons-icon-image').style.fontSize
							}),
							this.cell({
								element: 'input', name: 'box-width', value: this.element.querySelector('.crater-icons-icon').css().width || '70px'
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let content = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-icons-content');
		let icons = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-icons-icon-div');
		const draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		const settings = JSON.parse(this.element.dataset.settings);

		let iconPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-icons-icon-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-icons-icon-div' }),
				this.cell({
					element: 'i', name: 'Image', attributes: {}, edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.sharePoint.icons.instagram }
				}),
				this.cell({
					element: 'input', name: 'Title', value: 'Title'
				}),
				this.cell({
					element: 'input', name: 'Link', value: 'Link'
				}),
				this.cell({
					element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: ''
				}),
				this.cell({
					element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: ''
				})]
		});

		let iconPrototype = this.createElement({
			element: 'div', attributes: { id: 'crater-icons-icon-div', class: 'crater-icons-icon-div' }, children: [
				{
					element: 'a', attributes: { class: 'crater-icons-icon crater-curve', title: 'Sample', href: 'https://www.nairaland.com' }, children: [
						{
							element: 'i', attributes: { class: `crater-icons-icon-image`, 'data-icon': this.sharePoint.icons.instagram }
						}]
				}
			]
		});

		let iconHandler = (iconPane, iconDom) => {
			iconPane.addEventListener('mouseover', event => {
				iconPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			iconPane.addEventListener('mouseout', event => {
				iconPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			iconPane.find('#Image-cell').checkChanges(() => {
				iconDom.find('.crater-icons-icon-image').removeClasses(iconDom.find('.crater-icons-icon-image').dataset.icon);
				iconDom.find('.crater-icons-icon-image').addClasses(iconPane.find('#Image-cell').dataset.icon);
				iconDom.find('.crater-icons-icon-image').dataset.icon = iconPane.find('#Image-cell').dataset.icon;
			});

			iconPane.find('#Link-cell').onChanged(value => {
				iconDom.querySelector('a').setAttribute('href', value);
			});

			iconPane.find('#Title-cell').onChanged(value => {
				iconDom.querySelector('a').setAttribute('title', value);
			});

			iconPane.find('#background-color-cell').onchange = () => {
				iconDom.querySelector('.crater-icons-icon').css({
					backgroundColor: iconPane.find('#background-color-cell').value
				});
				iconPane.find('#background-color-cell').setAttribute('value', iconPane.find('#background-color-cell').value);
			};

			iconPane.find('#color-cell').onchange = () => {
				iconDom.querySelector('i').css({
					color: iconPane.find('#color-cell').value
				});
				iconPane.find('#color-cell').setAttribute('value', iconPane.find('#color-cell').value);
			};

			iconPane.find('.delete-crater-icons-icon-div').addEventListener('click', event => {
				iconDom.remove();
				iconPane.remove();
			});

			iconPane.find('.add-before-crater-icons-icon-div').addEventListener('click', event => {
				let newIconPrototype = iconPrototype.cloneNode(true);
				let newColumnPanePrototype = iconPanePrototype.cloneNode(true);

				iconDom.before(newIconPrototype);
				iconPane.before(newColumnPanePrototype);
				iconHandler(newColumnPanePrototype, newIconPrototype);
			});

			iconPane.find('.add-after-crater-icons-icon-div').addEventListener('click', event => {
				let newIconPrototype = iconPrototype.cloneNode(true);
				let newColumnPanePrototype = iconPanePrototype.cloneNode(true);
				// iconDom.parentNode.insertBefore(newIconPrototype, iconDom.nextElementSibling);
				iconDom.after(newIconPrototype);
				iconPane.after(newColumnPanePrototype);
				iconHandler(newColumnPanePrototype, newIconPrototype);
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newIconPrototype = iconPrototype.cloneNode(true);
			let newIconPanePrototype = iconPanePrototype.cloneNode(true);

			content.append(newIconPrototype);//c
			this.paneContent.find('.counter-pane').append(newIconPanePrototype);

			iconHandler(newIconPanePrototype, newIconPrototype);
		});

		this.paneContent.findAll('.crater-icons-icon-pane').forEach((iconPane, position) => {
			iconHandler(iconPane, icons[position]);
		});

		this.paneContent.querySelector('#box-width-cell').addEventListener('change', () => {
			const { value: width } = this.paneContent.querySelector('#box-width-cell');
			draftDom.querySelectorAll('.crater-icons-icon').forEach(icon => icon.css({ width }));
			this.paneContent.querySelector('#box-width-cell').setAttribute('value', width);
		});

		this.paneContent.find('#Curved-cell').value = settings.curved;

		this.paneContent.find('#SpaceBetween-cell').value = this.paneContent.find('#SpaceBetween-cell').dataset.space || 'open';
		this.paneContent.find('#SpaceBetween-cell').onchange = (event) => {
			const settingsPane = this.paneContent.querySelector('.settings-pane');
			const { value } = this.paneContent.find('#SpaceBetween-cell');
			this.paneContent.find('#SpaceBetween-cell').setAttribute('data-space', value);
			switch (value.toLowerCase()) {
				case 'open':
					const newCell = this.cell({
						element: 'input', name: 'space-value',
					});
					settingsPane.children[1].insertBefore(newCell, settingsPane.children[1].find('#SpaceBetween-cell').parentElement.nextElementSibling);
					settingsPane.querySelector('#space-value-cell').onChanged();
					break;
				case 'close':
					if (settingsPane.querySelector('#space-value-cell')) settingsPane.querySelector('#space-value-cell').parentElement.remove();
					break;
			}

		};

		this.paneContent.find('#Curved-cell').onChanged(value => {
			settings.curved = value;
		});

		this.paneContent.find('#BackgroundColor-cell').onchange = () => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-icons-icon-div').forEach(icon => {
				icon.querySelector('.crater-icons-icon').css({
					backgroundColor: this.paneContent.find('#BackgroundColor-cell').value
				});
			});
			this.paneContent.find('#BackgroundColor-cell').setAttribute('value', this.paneContent.find('#BackgroundColor-cell').value);
		};

		this.paneContent.find('#Color-cell').onchange = () => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-icons-icon-div').forEach(icon => {
				icon.querySelector('i').css({
					color: this.paneContent.find('#Color-cell').value
				});
			});
			this.paneContent.find('#Color-cell').setAttribute('value', this.paneContent.find('#Color-cell').value);
		};

		const displayStyle = this.paneContent.find('#display-style-cell');
		displayStyle.value = settings['displayStyle'];
		displayStyle.onchange = () => {
			settings['displayStyle'] = displayStyle.value;
			switch (displayStyle.value.toLowerCase()) {
				case 'circle':
					draftDom.querySelectorAll('.crater-icons-icon-div').forEach(iconBox => {
						const iconLink = iconBox.querySelector('.crater-icons-icon');
						console.log(iconLink);
						iconLink.css({
							borderRadius: '50%',
							border: 'none'
						});
					});
					break;

				case 'square':
					draftDom.querySelectorAll('.crater-icons-icon-div').forEach(iconBox => {
						const iconLink = iconBox.querySelector('.crater-icons-icon');
						iconLink.css({
							borderRadius: 0,
							border: 'none'
						});
					});
					break;

				case 'outline circle':
					draftDom.querySelectorAll('.crater-icons-icon-div').forEach(iconBox => {
						const iconLink = iconBox.querySelector('.crater-icons-icon');
						const backgroundColor = iconBox.querySelector('i').css().color;
						iconBox.querySelector('i').css({ color: iconLink.css().backgroundColor });
						iconLink.css({
							borderRadius: '50%',
							border: `2px solid ${iconLink.css().backgroundColor}`,
							backgroundColor,
						});
					});
					break;

				case 'outline square':
					draftDom.querySelectorAll('.crater-icons-icon-div').forEach(iconBox => {
						const iconLink = iconBox.querySelector('.crater-icons-icon');
						const backgroundColor = iconBox.querySelector('i').css().color;
						iconBox.querySelector('i').css({ color: iconLink.css().backgroundColor });
						iconLink.css({
							borderRadius: 0,
							border: `2px solid ${iconLink.css().backgroundColor}`,
							backgroundColor,
						});
					});
					break;
			}
		};

		const hoverStyle = this.paneContent.find('#hover-style-cell');
		hoverStyle.value = settings['hoverStyle'];
		hoverStyle.onchange = () => {
			settings['hoverStyle'] = hoverStyle.value;
		};

		this.paneContent.find('#font-size-cell').onchange = () => {
			draftDom.querySelectorAll('.crater-icons-icon-image').forEach(icon => {
				icon.style.fontSize = this.paneContent.find('#font-size-cell').value;
				this.paneContent.find('#font-size-cell').setAttribute('value', this.paneContent.find('#font-size-cell').value);
			});
		};

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			const margin = (this.paneContent.querySelector('#space-value-cell')) ? this.paneContent.querySelector('#space-value-cell').value : '-.3em';

			this.element.findAll('.crater-icons-icon-div').forEach(icon => {
				if (this.paneContent.find('#Curved-cell').value == 'Yes') {
					icon.querySelector('.crater-icons-icon').classList.add('crater-curve');
				} else {
					icon.querySelector('.crater-icons-icon').classList.remove('crater-curve');
				}

				icon.css({ margin });
			});

			this.sharePoint.saveSettings(this.element, settings);
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
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Image' }, options, selected: metadata.image},
				title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options, selected: metadata.title},
				link: { element: 'select', attributes: { id: 'meta-data-link', name: 'Link' }, options, selected: metadata.link},
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.title = updateWindow.find('#meta-data-title').value;
			params.connection.metadata.link = updateWindow.find('#meta-data-link').value;
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
		params.container.find('.crater-icons-content').innerHTML = newContent.find('.crater-icons-content').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.counter-pane').innerHTML = this.generatePaneContent({ icons: newContent.findAll('.crater-icons-icon') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Icons };