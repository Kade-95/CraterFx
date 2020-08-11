import { ElementModifier } from './../ElementModifier';

export class Frame extends ElementModifier {
	public key: any;
	public element: any;
	public paneContent: any;

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		const image: { description: string; url: string; } = { description: 'Frame Image', url: 'https://localhost:4321/src/externals/scr/webparts/Screenshot.png' };
		const frame: any = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-frame', 'data-type': 'frame' }, children: [
				{
					element: 'div', attributes: { id: 'crater-frame-container', class: 'crater-frame-container' }, children: [
						{
							element: 'div', attributes: { id: 'crater-frame-container-body', class: 'crater-frame-container-body' }, children: [
								{
									element: 'div', attributes: { class: 'crater-frame-container-header-title-box' }, children: [
										{ element: 'h2', attributes: { class: 'crater-frame-container-header-title' }, text: 'Sample Header' },
									]
								},
								{ element: 'img', attributes: { class: 'crater-frame-container-image', src: image.url, alt: image.description } }
							]
						}
					]
				}
			]
		});
		const settings = { decoration: 'Simple', widthStyle: 'Responsive', display: 'Show', textAlign: 'center' };
		this.sharePoint.saveSettings(frame, settings);
		this.key = frame.dataset.key;

		return frame;
	}

	public rendered(params) {
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset.key;
		this.element = params.element;
		const settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'frame-features-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Frame Features'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'frame-settings row' }, children: [
							this.cell({
								element: 'img', name: 'image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: this.element.querySelector('.crater-frame-container-image').src }
							}),
							this.cell({
								element: 'select', name: 'decoration', options: ['Simple', 'Solid'], value: settings.decoration
							}),
							this.cell({
								element: 'input', name: 'frame-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'width', options: ['Responsive', 'Custom'], value: settings.widthStyle
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'description-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Frame Description'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'span', name: 'title', edit: 'change-text', html: this.element.querySelector('.crater-frame-container-header-title').innerHTML
							}),
							this.cell({
								element: 'select', name: 'text-alignment', dataAttributes: { style: { textTransform: 'uppercase' } }, options: ['left', 'center', 'right'], value: this.element.querySelector('.crater-frame-container-header-title').css()['text-align'] || settings.textAlign
							}),
							this.cell({
								element: 'input', name: 'header-background', dataAttributes: { type: 'color' }, value: this.element.querySelector('.crater-frame-container-header-title-box').css().backgroundColor
							}),
							this.cell({
								element: 'select', name: 'display', options: ['Show', 'Hide'], value: settings.display
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
		this.key = this.element['dataset']['key'];
		this.paneContent = this.sharePoint.app.querySelector('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		const featureSettings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		const featuresPane = this.paneContent.querySelector('.frame-features-pane');
		const descPane = this.paneContent.querySelector('.description-pane');
		if (this.paneContent.querySelector('#image-width-cell') && featureSettings.widthStyle !== 'Custom') this.paneContent.querySelector('#image-width-cell').parentElement.remove();
		if (this.paneContent.querySelector('#image-height-cell') && featureSettings.widthStyle !== 'Custom') this.paneContent.querySelector('#image-height-cell').parentElement.remove();

		featuresPane.querySelector('#image-cell').checkChanges(() => {
			draftDom.querySelector('.crater-frame-container-image').src = featuresPane.querySelector('#image-cell').src;
		});

		const styleValue = featuresPane.querySelector('#decoration-cell');
		styleValue.value = featureSettings.decoration;
		styleValue.onchange = () => {
			const givenColor = (featuresPane.querySelector('#frame-color-cell').value) ? featuresPane.querySelector('#frame-color-cell').value : '#000000';
			settingsClone['decoration'] = styleValue.value;
			switch (styleValue.value.toLowerCase()) {
				case 'simple':
					draftDom.querySelector('.crater-frame-container-image').style.border = `2px solid ${givenColor}`;
					break;
				case 'solid':
					draftDom.querySelector('.crater-frame-container-image').style.border = `8px solid ${givenColor}`;
					break;
			}
		};

		featuresPane.querySelector('#frame-color-cell').addEventListener('change', (event) => {
			settingsClone.frameColor = featuresPane.querySelector('#frame-color-cell').value;
			featuresPane.querySelector('#frame-color-cell').setAttribute('value', featuresPane.querySelector('#frame-color-cell').value);
			const decoration = settingsClone['decoration'] || featureSettings.decoration;
			switch (decoration.toLowerCase()) {
				case 'simple':
					draftDom.querySelector('.crater-frame-container-image').style.border = `2px solid ${featuresPane.querySelector('#frame-color-cell').value}`;
					break;

				case 'solid':
					draftDom.querySelector('.crater-frame-container-image').style.border = `10px solid ${featuresPane.querySelector('#frame-color-cell').value}`;
					break;
			}
		});

		let widthCell = featuresPane.querySelector('#width-cell');
		widthCell.value = settingsClone.widthStyle || featureSettings.widthStyle;
		if (widthCell.value.toLowerCase() === 'responsive') {
			draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-width", '100%');
			if (draftDom.css().height) {
				if (this.paneContent.querySelector('#image-height-cell')) this.paneContent.querySelector('#image-height-cell').parentElement.remove();
				draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-height", draftDom.css().height);
			} else {
				const frameHeight = this.cell({
					element: 'input', name: 'image-height', value: draftDom.querySelector('.crater-frame-container-image').style.height
				});

				this.paneContent.querySelector('.frame-settings').appendChild(frameHeight);

				this.paneContent.querySelector('#image-height-cell').onChanged(value => {
					draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-height", value);
				});
			}
		} else if (widthCell.value.toLowerCase() === 'custom') {
			if (this.paneContent.querySelector('#image-width-cell')) {
				this.paneContent.querySelector('#image-width-cell').onChanged(value => {
					draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-width", value);
				});
			} else {
				this.paneContent.querySelector('#image-width-cell').parentElement.remove();

				const frameWidth = this.cell({
					element: 'input', name: 'image-width', value: draftDom.querySelector('.crater-frame-container-image').style.getPropertyValue("--frame-width")
				});

				featuresPane.querySelector('#width-cell').value = 'Custom';
				this.paneContent.querySelector('.frame-settings').appendChild(frameWidth);

				this.paneContent.querySelector('#image-width-cell').onChanged(value => {
					draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-width", value);
				});
			}
		}

		widthCell.onchange = () => {
			settingsClone.widthStyle = widthCell.value;
			widthCell.value = settingsClone.widthStyle;
			switch (widthCell.value.toLowerCase()) {
				case 'responsive':
					if (this.paneContent.querySelector('#image-width-cell')) this.paneContent.querySelector('#image-width-cell').parentElement.remove();
					if (this.paneContent.querySelector('#image-height-cell')) this.paneContent.querySelector('#image-height-cell').parentElement.remove();

					draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-width", '100%');
					if (draftDom.css().height) draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-height", draftDom.css().height);
					else {
						const frameHeight = this.cell({
							element: 'input', name: 'image-height', value: draftDom.querySelector('.crater-frame-container-image').style.height
						});

						this.paneContent.querySelector('.frame-settings').appendChild(frameHeight);

						this.paneContent.querySelector('#image-height-cell').onChanged(value => {
							draftDom.querySelector('.crater-frame-container-image').style.setProperty('--frame-height', value);
						});
					}
					break;

				case 'custom':
					if (this.paneContent.querySelector('#image-width-cell')) this.paneContent.querySelector('#image-width-cell').parentElement.remove();
					if (this.paneContent.querySelector('#image-height-cell')) this.paneContent.querySelector('#image-height-cell').parentElement.remove();

					const frameWidth = this.cell({
						element: 'input', name: 'image-width', value: draftDom.querySelector('.crater-frame-container-image').style.getPropertyValue("--frame-width")
					});

					this.paneContent.querySelector('.frame-settings').append(frameWidth);

					this.paneContent.querySelector('#image-width-cell').onChanged(value => {
						draftDom.querySelector('.crater-frame-container-image').style.setProperty("--frame-width", value);
					});
					break;
			}
		};

		descPane.querySelector('#title-cell').checkChanges(() => {
			draftDom.querySelector('.crater-frame-container-header-title').copy(descPane.querySelector('#title-cell'));
		});

		descPane.querySelector('#text-alignment-cell').value = featureSettings.textAlign;
		descPane.querySelector('#text-alignment-cell').addEventListener('change', () => {
			const textAlign = descPane.querySelector('#text-alignment-cell').value;
			draftDom.querySelector('.crater-frame-container-header-title').css({ textAlign });
			settingsClone.textAlign = textAlign;
		});

		let showDescription = descPane.querySelector('#display-cell');
		showDescription.value = settingsClone.display || featureSettings.display;
		showDescription.onchange = () => {
			settingsClone.display = showDescription.value;
			switch (showDescription.value.toLowerCase()) {
				case 'show':
					draftDom.querySelector('.crater-frame-container-header-title').style.display = 'block';
					break;

				case 'hide':
					draftDom.querySelector('.crater-frame-container-header-title').style.display = 'none';
					break;
			}
			showDescription.value = settingsClone.display;
		};

		descPane.querySelector('#header-background-cell').onchange = () => {
			const backgroundColor = descPane.querySelector('#header-background-cell').value;
			draftDom.querySelector('.crater-frame-container-header-title-box').css({ backgroundColor });
			descPane.querySelector('#header-background-cell').setAttribute('value', backgroundColor);
		};

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

			this.sharePoint.saveSettings(this.element, featureSettings, settingsClone);
		});
	}
}
