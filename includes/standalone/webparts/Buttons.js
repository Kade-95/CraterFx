import { ElementModifier } from './../ElementModifier';

class Buttons extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	private key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	//create the Button webpart
	public render(params) {
		if (!this.func.isset(params.source)) params.source = [
			{ title: 'Facebook', link: 'https://facebook.com', icon: this.sharePoint.icons.plus, text: 'Button1' },
			{ title: 'Twitter', link: 'https://twitter.com', icon: this.sharePoint.icons.plus, text: 'Button2' },
			{ title: 'Youtube', link: 'https://youtube.com', icon: this.sharePoint.icons.plus, text: 'Button3' }
		];

		let button = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-buttons', 'data-type': 'buttons' } });

		let content = button.makeElement({
			element: 'div', attributes: { class: 'crater-buttons-content', id: 'crater-buttons-content' }
		});

		for (let singleButton of params.source) {
			content.makeElement({
				element: 'a', attributes: { class: 'crater-buttons-single', href: singleButton.link, title: singleButton.title }, children: [
					{ element: 'i', attributes: { class: 'crater-buttons-icon', 'data-icon': singleButton.icon } },
					{ element: 'span', attributes: { class: 'crater-buttons-text' }, text: singleButton.text }
				]
			});
		}

		this.func.objectCopy(params, button.dataset);
		this.key = this.key || button.dataset['key'];

		return button;
	}

	//add functionalities ofter button has been rendered
	public rendered(params) {
		this.params = params;
		this.element = params.element;
		this.key = this.element.dataset['key'];
		const settings = JSON.parse(this.element.dataset.settings);


		let buttons = this.element.findAll('.crater-buttons-single');

		let { imageDisplay } = settings;
		let { imageSize } = settings;
		let { fontSize } = settings;
		let { fontFamily } = settings;
		let { width } = settings;
		let { height } = settings;
		let { layout } = settings;
		let { hover } = settings;

		buttons.forEach(button => {
			button.css({ height, width });
			button.find('.crater-buttons-text').css({ fontSize, fontFamily });
			button.find('.crater-buttons-icon').css({ fontSize: imageSize });

			if (imageDisplay == 'No') button.find('.crater-buttons-icon').hide();
			else button.find('.crater-buttons-icon').show();

			if (layout == 'Oval') {
				button.css({ borderRadius: '100%' });
			}
			else if (layout == 'Round Edges') {
				button.css({ borderRadius: '10px' });
			}
			else {
				button.cssRemove(['border-radius']);
			}

			let position = button.position();

			if (hover == 'Zoom in') {
				button.onHover({ css: { padding: '1.5em' } });
			}
			else if (hover == 'Zoom out') {
				button.onHover({ css: { padding: '.5em' } });
			}
		});

		console.log(settings);
	}

	//set up Button Pane content
	public setUpPaneContent(params): any {
		this.element = params.element;
		this.key = params.element.dataset['key'];

		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		}).monitor();

		//check if button draft is empty
		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		//check if button pane has been generated before
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		//generate new button pane
		else {
			let button = this.sharePoint.attributes.pane.content[this.key].draft.dom;
			let buttons = button.findAll('.crater-buttons-single');

			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ buttons }));

			let settings = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card settings-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: "Button Settings"
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Image Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Image Display', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'input', name: 'Font Size'
							}),
							this.cell({
								element: 'input', name: 'Font Family'
							}),
							this.cell({
								element: 'input', name: 'Width'
							}),
							this.cell({
								element: 'input', name: 'Height'
							}),
							this.cell({
								element: 'select', name: 'Layout', options: ['Block', 'Oval', 'Round Edges']
							}),
							this.cell({
								element: 'select', name: 'Position', options: ['Left', 'Center', 'Right']
							}),
							this.cell({
								element: 'select', name: 'Hover', options: ['Zoom in', 'Zoom out']
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	private generatePaneContent(params) {
		let buttonContents = this.createElement({
			element: 'div', attributes: { class: 'card content-pane' }, children: [
				{
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: "Button Contents"
						})
					]
				}
			]
		});
		for (let element of params.buttons) {
			buttonContents.makeElement({
				element: 'div', attributes: { class: 'row button-pane' }, children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-single-button' }),
					this.cell({
						element: 'i', name: 'Image', edit: 'upload-icon', attributes: {}, dataAttributes: { class: 'crater-icon', 'data-icon': element.find('.crater-buttons-icon').dataset.icon }
					}),
					this.cell({
						element: 'input', name: 'Text',
					}),
					this.cell({
						element: 'input', name: 'Link'
					}),
					this.cell({
						element: 'input', name: 'FontColor', dataAttributes: { type: 'color' }
					}),
					this.cell({
						element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
					})
				]
			});
		}

		return buttonContents;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		const settings = JSON.parse(this.element.dataset.settings);
		//fetch panecontent and monitor it
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		//fetch the content of Button
		let content = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-buttons-content');
		let singleButtons = content.findAll('.crater-buttons-single');

		//fetch the icon
		let icons = content.findAll('.crater-buttons-icon');

		//fetch the text
		let texts = content.findAll('.crater-buttons-text');

		let buttonPrototype = this.createElement({
			element: 'a', attributes: { class: 'crater-buttons-single', href: 'www.google.com', title: 'Title' }, children: [
				{ element: 'i', attributes: { class: 'crater-buttons-icon', 'data-icon': this.sharePoint.icons.plus } },
				{ element: 'span', attributes: { class: 'crater-buttons-text' }, text: 'Button' }
			]
		});

		let buttonPanePrototype = this.createElement({
			element: 'div', attributes: { class: 'row button-pane' }, children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-single-button' }),
				this.cell({
					element: 'i', name: 'Image', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.sharePoint.icons.plus }
				}),
				this.cell({
					element: 'input', name: 'Text',
				}),
				this.cell({
					element: 'input', name: 'Link'
				}),
				this.cell({
					element: 'input', name: 'FontColor',
				}),
				this.cell({
					element: 'input', name: 'BackgroundColor',
				})
			]
		});

		let buttonHandler = (buttonPane, buttonDom) => {
			//set the text of the button
			buttonPane.addEventListener('mouseover', event => {
				buttonPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			buttonPane.addEventListener('mouseout', event => {
				buttonPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			buttonPane.find('.delete-crater-single-button').addEventListener('click', event => {
				buttonDom.remove();
				buttonPane.remove();
			});

			buttonPane.find('.add-before-crater-single-button').addEventListener('click', event => {
				let newButtonPrototype = buttonPrototype.cloneNode(true);
				let newButtonPanePrototype = buttonPanePrototype.cloneNode(true);

				buttonDom.before(newButtonPrototype);
				buttonPane.before(newButtonPanePrototype);
				buttonHandler(newButtonPanePrototype, newButtonPrototype);
			});

			buttonPane.find('.add-after-crater-single-button').addEventListener('click', event => {
				let newButtonPrototype = buttonPrototype.cloneNode(true);
				let newButtonPanePrototype = buttonPanePrototype.cloneNode(true);

				buttonDom.after(newButtonPrototype);
				buttonPane.after(newButtonPanePrototype);
				buttonHandler(newButtonPanePrototype, newButtonPrototype);
			});

			buttonPane.find('#Text-cell').onChanged(value => {
				buttonDom.find('.crater-buttons-text').innerText = value;
			});

			buttonPane.find('#Link-cell').onChanged(href => {
				buttonDom.setAttribute('href', href);
			});

			buttonPane.find('#FontColor-cell').onChanged(color => {
				buttonDom.find('.crater-buttons-text').css({ color });
			});

			buttonPane.find('#BackgroundColor-cell').onChanged(backgroundColor => {
				buttonDom.css({ backgroundColor });
			});

			buttonPane.find('#Image-cell').checkChanges(() => {
				buttonDom.find('.crater-buttons-icon').removeClasses(buttonDom.find('.crater-buttons-icon').dataset.icon);
				buttonDom.find('.crater-buttons-icon').addClasses(buttonPane.find('#Image-cell').dataset.icon);
				buttonDom.find('.crater-buttons-icon').dataset.icon = buttonPane.find('#Image-cell').dataset.icon;
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newButtonPrototype = buttonPrototype.cloneNode(true);
			let newButtonPanePrototype = buttonPanePrototype.cloneNode(true);

			content.append(newButtonPrototype);//c
			this.paneContent.find('.content-pane').append(newButtonPanePrototype);

			buttonHandler(newButtonPanePrototype, newButtonPrototype);
		});

		this.paneContent.findAll('.button-pane').forEach((singlePane, position) => {
			buttonHandler(singlePane, singleButtons[position]);
		});

		let settingsPane = this.paneContent.find('.settings-pane');

		settingsPane.find('#Font-Size-cell').onChanged();

		settingsPane.find('#Font-Family-cell').onChanged();

		settingsPane.find('#Width-cell').onChanged();

		settingsPane.find('#Height-cell').onChanged();

		settingsPane.find('#Image-Display-cell').onChanged();

		settingsPane.find('#Image-Size-cell').onChanged();

		settingsPane.find('#Layout-cell').onChanged();

		settingsPane.find('#Position-cell').onChanged(position => {
			draftDom.find('.crater-buttons-content').css({ textAlign: position.toLowerCase() });
		});

		settingsPane.find('#Hover-cell').onChanged();

		// on panecontent changed set the state
		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		//on save clicked save the webpart settings and re-render
		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.imageSize = settingsPane.find('#Image-Size-cell').value;
			settings.imageDisplay = settingsPane.find('#Image-Display-cell').value;
			settings.fontSize = settingsPane.find('#Font-Size-cell').value;
			settings.fontFamily = settingsPane.find('#Font-Family-cell').value;
			settings.width = settingsPane.find('#Width-cell').value;
			settings.height = settingsPane.find('#Height-cell').value;
			settings.layout = settingsPane.find('#Layout-cell').value;
			settings.hover = settingsPane.find('#Hover-cell').value;

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
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Image' }, options, selected: metadata.image },
				link: { element: 'select', attributes: { id: 'meta-data-link', name: 'Link' }, options, selected: metadata.link },
				title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options, selected: metadata.title, note: 'Text shown when button is hovered' },
				text: { element: 'select', attributes: { id: 'meta-data-text', name: 'Text' }, options, selected: metadata.text }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.link = updateWindow.find('#meta-data-link').value;
			params.connection.metadata.title = updateWindow.find('#meta-data-title').value;
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
		params.container.find('.crater-buttons-content').innerHTML = newContent.find('.crater-buttons-content').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.content-pane').innerHTML = this.generatePaneContent({ buttons: newContent.findAll('.crater-buttons-single') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Buttons };