import { ElementModifier } from '../ElementModifier';

class Image extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	public key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		params.source = params.source || this.sharePoint.images.append;
		params.title = params.title || 'Title';
		params.subtitle = params.subtitle || 'Subtitle';
		params.link = params.link || 'https://google.com';
		params.button = params.button || 'Button';

		let image = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-image', 'data-type': 'image' } });

		let content = image.makeElement({
			element: 'div', attributes: { class: 'crater-image-content', id: 'crater-image-content' }, children: [
				{ element: 'img', attributes: { id: 'crater-image-src', src: params.source } },
				{
					element: 'div', attributes: { id: 'crater-image-optionals' }, children: [
						{ element: 'span', attributes: { id: 'crater-image-title' }, text: params.title },
						{ element: 'span', attributes: { id: 'crater-image-subtitle' }, text: params.subtitle },
						{ element: 'a', attributes: { class: 'btn', id: 'crater-image-link', href: params.link }, text: params.button }
					]
				}
			]
		});

		this.func.objectCopy(params, image.dataset);
		this.key = this.key || image.dataset.key;

		return image;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
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
			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Image Title'
							}
						]
					},
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'text', value: this.element.find('#crater-image-title').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('#crater-image-title').css()['font-size'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'subtitle-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Image Subtitle'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'text', value: this.element.find('#crater-image-subtitle').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('#crater-image-subtitle').css()['font-size'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'link-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Image Link'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'text', value: this.element.find('#crater-image-link').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('#crater-image-link').css()['font-size'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Shape', options: ['Block', 'Round Edges']
							}),
							this.cell({
								element: 'input', name: 'border color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'border size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'border type', list: this.func.borderTypes
							}),
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Image Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: settings.source }
							}),
							this.cell({
								element: 'select', name: 'Show Only Image', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Image Shape', options: ['Custom', 'Round Edges', 'Circular', 'Sqaure']
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							}),
							this.cell({
								element: 'input', name: 'border color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'border size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'border type', list: this.func.borderTypes
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'Image Height', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Image Width', list: this.func.pixelSizes
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
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		let settingsClone: any = {};
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		let titlePane = this.paneContent.find('.title-pane');
		let subtitlePane = this.paneContent.find('.subtitle-pane');
		let linkPane = this.paneContent.find('.link-pane');
		let settingsPane = this.paneContent.find('.settings-pane');

		titlePane.find('#text-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-title').innerHTML = value;
		});

		titlePane.find('#Show-cell').onChanged(value => {
			if (value == 'No') {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-title').hide();
			} else {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-title').show();
			}
		});

		titlePane.find('#backgroundcolor-cell').onChanged(backgroundColor => {
			draftDom.find('#crater-image-title').css({ backgroundColor });
		});

		titlePane.find('#color-cell').onChanged(color => {
			draftDom.find('#crater-image-title').css({ color });
		});

		titlePane.find('#fontsize-cell').onChanged(fontSize => {
			draftDom.find('#crater-image-title').css({ fontSize });
		});

		subtitlePane.find('#text-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-subtitle').innerHTML = value;
		});

		subtitlePane.find('#Show-cell').onChanged(value => {
			if (value == 'No') {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-subtitle').hide();
			} else {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-subtitle').show();
			}
		});

		subtitlePane.find('#backgroundcolor-cell').onChanged(backgroundColor => {
			draftDom.find('#crater-image-subtitle').css({ backgroundColor });
		});

		subtitlePane.find('#color-cell').onChanged(color => {
			draftDom.find('#crater-image-subtitle').css({ color });
		});

		subtitlePane.find('#fontsize-cell').onChanged(fontSize => {
			draftDom.find('#crater-image-subtitle').css({ fontSize });
		});

		linkPane.find('#text-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-link').innerHTML = value;
		});

		linkPane.find('#Show-cell').onChanged(value => {
			if (value == 'No') {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-link').hide();
			} else {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-link').show();
			}
		});

		linkPane.find('#Shape-cell').onChanged(value => {
			if (value == 'Block') {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-link').css({ borderRadious: 'unset' });
			} else {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('#crater-image-link').css({ borderRadious: '10px' });
			}
		});

		linkPane.find('#backgroundcolor-cell').onChanged(backgroundColor => {
			draftDom.find('#crater-image-link').css({ backgroundColor });
		});

		linkPane.find('#color-cell').onChanged(color => {
			draftDom.find('#crater-image-link').css({ color });
		});

		linkPane.find('#fontsize-cell').onChanged(fontSize => {
			draftDom.find('#crater-image-link').css({ fontSize });
		});

		linkPane.find('#border-color-cell').onChanged(borderColor => {
			draftDom.find('#crater-image-link').css({ borderColor });
		});

		linkPane.find('#border-size-cell').onChanged(borderWidth => {
			draftDom.find('#crater-image-link').css({ borderWidth });
		});

		linkPane.find('#border-type-cell').onChanged(borderStyle => {
			draftDom.find('#crater-image-link').css({ borderStyle });
		});

		settingsPane.find('#Image-cell').checkChanges(() => {
			draftDom.find('#crater-image-src').src = settingsPane.find('#Image-cell').src;
		});

		settingsPane.find('#Show-Only-Image-cell').onChanged(value => {
			if (value == 'No') {
				draftDom.find('#crater-image-optionals').show();
			} else {
				draftDom.find('#crater-image-optionals').hide();
			}
		});

		settingsPane.find('#Image-Height-cell').onChanged(height => {
			draftDom.find('#crater-image-src').css({ height });
		});

		settingsPane.find('#Image-Width-cell').onChanged(width => {
			draftDom.find('#crater-image-src').css({ width });
		});

		settingsPane.find('#Image-Shape-cell').onChanged(shape => {
			draftDom.find('#crater-image-src').cssRemove(['border-radius']);
			if (shape == 'Round Edges') {
				draftDom.find('#crater-image-src').css({ borderRadius: '10px' });
			}
			else if (shape == 'Circular') {
				draftDom.find('#crater-image-src').css({ borderRadius: '100%' });
			}
			else if (shape == 'Square') {
				draftDom.find('#crater-image-src').css({ height: 'auto' });
			}
		});

		settingsPane.find('#border-color-cell').onChanged(borderColor => {			
			draftDom.find('#crater-image-src').css({ borderColor });
		});

		settingsPane.find('#border-size-cell').onChanged(borderWidth => {
			draftDom.find('#crater-image-src').css({ borderWidth });
		});

		settingsPane.find('#border-type-cell').onChanged(borderStyle => {
			draftDom.find('#crater-image-src').css({ borderStyle });
		});

		settingsPane.find('#backgroundcolor-cell').onChanged(backgroundColor => {
			draftDom.find('#crater-image-src').css({ backgroundColor });
		});

		settingsPane.find('#Link-Window-cell').onChanged(linkWindow => {			
			settingsClone.linkWindow = linkWindow;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			this.sharePoint.saveSettings(this.element, settings, settingsClone);		
		});
	}
}

export { Image };