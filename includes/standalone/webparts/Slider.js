import { ElementModifier } from './../ElementModifier';

class Slider extends ElementModifier {
	public params: any;
	private element: any;
	private key: any;
	private paneContent: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source)) params.source = [
			{ image: this.sharePoint.images.append, text: 'text0', link: 'https://www.google.com', linkText: 'Button 0', subTitle: 'Sub Title 0' },
			{ image: this.sharePoint.images.append, text: 'text1', link: 'https://www.facebook.com', linkText: 'Button 1', subTitle: 'Sub Title 1' },
			{ image: this.sharePoint.images.append, text: 'text2', link: 'https://www.twitter.com', linkText: 'Button 2', subTitle: 'Sub Title 2' }
		];

		//create the slider element
		let slider = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-slider', 'data-type': 'slider', style: { height: '400px' } } });

		//create the slider controllers
		let radioToggle = slider.makeElement({ element: 'span', attributes: { class: 'crater-top-right', id: 'crater-slide-controller' } });
		let slidesContainer = slider.makeElement({ element: 'div', attributes: { class: 'crater-slides', id: 'crater-slides' } });

		let settings = {
			duration: 10000
		};

		//add the slides
		for (let source of params.source) {
			slidesContainer.makeElement({
				element: 'div', attributes: { class: 'crater-slide' }, children: [
					{ element: 'img', attributes: { src: source.image.Url || source.image, alt: 'Not Found' } },
					{
						element: 'span', attributes: { class: 'crater-slide-details' }, children: [
							{ element: 'p', text: source.text, attributes: { class: 'crater-slide-quote' } },
							{ element: 'p', text: source.subTitle, attributes: { class: 'crater-slide-sub-title' } },
							{ element: 'a', attributes: { href: source.link, class: 'crater-slide-link btn' }, text: source.linkText }
						]
					},
				]
			});
			radioToggle.makeElement({ element: 'input', attributes: { type: 'radio', class: 'crater-slide-radio-toggle' } });
		}

		// add the slide arrows
		slider.makeElement({ element: 'span', attributes: { class: 'crater-arrow crater-left-arrow' } });
		slider.makeElement({ element: 'span', attributes: { class: 'crater-arrow crater-right-arrow' } });


		this.func.objectCopy(params, slider.dataset);
		this.key = this.key || slider.dataset.key;
		this.sharePoint.saveSettings(slider, settings);

		return slider;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		this.startSlide();

		let settings = JSON.parse(this.element.dataset.settings);
		let imageBightness = settings.imageBrightness || '50%';
		let imageBlur = settings.imageBlur || '3px';

		let filter = `brightness(${imageBightness}) blur(${imageBlur})`;

		//show controllers and arrows
		this.element.addEventListener('mouseenter', () => {
			this.element.findAll('.crater-arrow').forEach(arrow => {
				arrow.css({ visibility: 'visible' });
			});
			this.element.find('.crater-top-right').css({ visibility: 'visible' });
		});

		//hide controllers and arrows
		this.element.addEventListener('mouseleave', () => {
			this.element.findAll('.crater-arrow').forEach(arrow => {
				arrow.css({ visibility: 'hidden' });
			});
			this.element.find('.crater-top-right').css({ visibility: 'hidden' });
		});

		//make slides and images same as that of slider
		this.element.findAll('.crater-slide').forEach(slide => {
			slide.css({ height: this.element.position().height + 'px' });
			slide.findAll('img').forEach(img => {
				img.css({ height: this.element.position().height + 'px', filter });
			});
		});

		this.element.findAll('.crater-slide-quote').forEach(quote => {
			quote.css({ fontFamily: settings.textFontStyle, fontSize: settings.textFontSize, color: settings.textColor });
		});

		this.element.findAll('.crater-slide-link').forEach(link => {
			link.css({ fontFamily: settings.linkFontStyle, fontSize: settings.linkFontStyle, color: settings.linkColor, backgroundColor: settings.linkBackgroundColor, border: settings.linkBorder });

			if (settings.linkShow == 'No') {
				link.hide();
			} else {
				link.show();
			}
		});

		this.element.findAll('.crater-slide-sub-title').forEach(subTitle => {
			subTitle.css({ fontFamily: settings.subTitleFontStyle, fontSize: settings.subTitleFontStyle, color: settings.subTitleColor });

			if (settings.subTitleShow == 'No') {
				subTitle.hide();
			} else {
				subTitle.show();
			}
		});

		let alignSelf = 'center';
		let { contentLocation } = settings;
		if (contentLocation == 'Top') alignSelf = 'flex-start';
		else if (contentLocation == 'Bottom') alignSelf = 'flex-end';

		this.element.findAll('.crater-slide-details').forEach(detail => {
			detail.css({ alignSelf });
		});
	}

	//start the slider animation
	public startSlide() {
		this.key = this.element.dataset['key'];
		let controller = this.element.find('#crater-slide-controller'),
			arrows = this.element.findAll('.crater-arrow'),
			radios,
			slides = this.element.findAll('.crater-slide'),
			radio: any,
			current = 0,
			key = current;
		const settings = JSON.parse(this.element.dataset.settings);

		if (this.element.length < 1) return;

		//reset control buttons
		controller.innerHTML = '';

		//stack the first slide ontop
		for (let position = 0; position < slides.length; position++) {
			slides[position].css({ zIndex: 0 });
			if (position == 0) slides[position].css({ zIndex: 1 });
			controller.makeElement({
				element: 'input', attributes: { class: 'crater-slide-radio-toggle', type: 'radio' }
			});
		}
		radios = controller.findAll('.crater-slide-radio-toggle');

		//fading and fadeout animation
		let runFading = () => {
			if (key < 0) key = radios.length - 1;
			if (key >= radios.length) key = 0;
			for (let element of radios) {
				if (radio != element) element.checked = false;
			}
			slides[current].css({ opacity: 0, zIndex: 0 });
			slides[key].css({ opacity: 1, zIndex: 1 });

			current = key;
		};

		//move to next slide
		let keepSliding = () => {
			clearInterval(settings.animation);
			settings.animation = setInterval(() => {
				key++;
				runFading();
			}, settings.duration);
		};

		//run animation when arrow is clicked
		for (let arrow of arrows) {
			arrow.css({ marginTop: `${(this.element.position().height - arrow.position().height) / 2}px` });
			arrow.addEventListener('click', event => {
				if (arrow.classList.contains('crater-left-arrow')) {
					key--;
				}
				else if (arrow.classList.contains('crater-right-arrow')) {
					key++;
				}

				clearInterval(settings.animation);
				runFading();
			});
		}

		//run animation when a controller is clicked
		for (let position = 0; position < radios.length; position++) {
			radios[position].addEventListener('click', () => {
				clearInterval(settings.animation);
				key = position;
				runFading();
			});
		}

		//click the first controller and set the first slide
		radios[current].click();
		keepSliding();
	}

	private setUpPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		});

		let key = params.element.dataset['key'];
		if (this.sharePoint.attributes.pane.content[key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		}
		else {
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			let slides = this.sharePoint.attributes.pane.content[key].draft.dom.findAll('.crater-slide');

			this.paneContent.append(this.generatePaneContent({ slides }));

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card text-settings' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Text'
							}]
					},
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Color', list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card link-settings' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Links'
							}]
					},
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Color', list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'input', name: 'Background Color', list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card sub-title-settings' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Sub-Titles'
							}]
					},
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Color', list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'settings-pane card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							})
						]
					}),

					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Duration', value: this.sharePoint.attributes.pane.content[key].settings.duration
							}),
							this.cell({
								element: 'select', name: 'Content Location', options: ['Top', 'Center', 'Bottom']
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up']
							}),
							this.cell({
								element: 'select', name: 'Image Blur', options: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Image Brightness', options: this.func.range(0, 100)
							}),
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let listPane = this.createElement({
			element: 'div', attributes: { class: 'card list-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Slides List'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.slides.length; i++) {
			listPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-slide-row-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-slide-content-row' }),
					this.cell({
						element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: params.slides[i].find('img').src }
					}),
					this.cell({
						element: 'input', name: 'Quote', value: params.slides[i].find('.crater-slide-quote').innerText
					}),
					this.cell({
						element: 'input', name: 'Link', value: params.slides[i].find('.crater-slide-link').href
					}),
					this.cell({
						element: 'input', name: 'Link Text', value: params.slides[i].find('.crater-slide-link').innerText
					}),
					this.cell({
						element: 'input', name: 'Sub Title', value: params.slides[i].find('.crater-slide-sub-title').innerText
					}),
				]
			});
		}
		return listPane;
	}

	private listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		const settings = JSON.parse(this.element.dataset.settings);

		let slides = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-slides');

		let slideListRows = slides.findAll('.crater-slide');

		let listRowPrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-slide-row-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-slide-content-row' }),
				this.cell({
					element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: this.sharePoint.images.append }
				}),
				this.cell({
					element: 'input', name: 'Quote', value: 'quote'
				}),
				this.cell({
					element: 'input', name: 'Link', value: 'https://google.com'
				}),
				this.cell({
					element: 'input', name: 'Link Text', value: 'Link'
				}),
				this.cell({
					element: 'input', name: 'Sub Title', value: 'Sub Title'
				}),
			]
		});

		let slidePrototype = this.createElement({
			element: 'div', attributes: { class: 'crater-slide', style: { opacity: 0 } }, children: [
				{ element: 'img', attributes: { src: 'image', alt: 'Not Found' } },
				{
					element: 'span', attributes: { class: 'crater-slide-details' }, children: [
						{ element: 'p', text: 'Qoute', attributes: { class: 'crater-slide-quote' } },
						{ element: 'p', text: 'Sub Title', attributes: { class: 'crater-slide-sub-title' } },
						{ element: 'a', attributes: { href: 'https://google.com', class: 'crater-slide-link btn' }, text: 'Link' }
					]
				},
			]
		});

		let listRowHandler = (listRowPane, listRowDom) => {
			listRowPane.addEventListener('mouseover', event => {
				listRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			listRowPane.addEventListener('mouseout', event => {
				listRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			listRowPane.find('#Image-cell').checkChanges(() => {
				listRowDom.find('img').src = listRowPane.find('#Image-cell').src;
			});

			listRowPane.find('#Quote-cell').onChanged(value => {
				listRowDom.find('.crater-slide-quote').innerHTML = value;
			});

			listRowPane.find('#Link-cell').onChanged(value => {
				listRowDom.find('.crater-slide-link').href = value;
			});

			listRowPane.find('#Link-Text-cell').onChanged(value => {
				listRowDom.find('.crater-slide-link').innerText = value;
			});

			listRowPane.find('#Sub-Title-cell').onChanged(value => {
				listRowDom.find('.crater-slide-sub-title').innerText = value;
			});

			listRowPane.find('.delete-crater-slide-content-row').addEventListener('click', event => {
				listRowDom.remove();
				listRowPane.remove();
			});

			listRowPane.find('.add-before-crater-slide-content-row').addEventListener('click', event => {
				let newSlide = slidePrototype.cloneNode(true);
				let newListRow = listRowPrototype.cloneNode(true);

				listRowDom.before(newSlide);
				listRowPane.before(newListRow);
				listRowHandler(newListRow, newSlide);
			});

			listRowPane.find('.add-after-crater-slide-content-row').addEventListener('click', event => {
				let newSlide = slidePrototype.cloneNode(true);
				let newListRow = listRowPrototype.cloneNode(true);

				listRowDom.after(newSlide);
				listRowPane.after(newListRow);

				listRowHandler(newListRow, newSlide);
			});
		};

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newSlide = slidePrototype.cloneNode(true);
			let newListRow = listRowPrototype.cloneNode(true);

			slides.append(newSlide);
			this.paneContent.find('.list-pane').append(newListRow);

			listRowHandler(newListRow, newSlide);
		});

		this.paneContent.findAll('.crater-slide-row-pane').forEach((listRow, position) => {
			listRowHandler(listRow, slideListRows[position]);
		});

		this.paneContent.find('#Duration-cell').onChanged();
		this.paneContent.find('#Content-Location-cell').onChanged();
		this.paneContent.find('#Link-Window-cell').onChanged();
		this.paneContent.find('#Image-Brightness-cell').onChanged();
		this.paneContent.find('#Image-Blur-cell').onChanged();

		let textSettings = this.paneContent.find('.text-settings');
		let linkSettings = this.paneContent.find('.link-settings');
		let subTitleSettings = this.paneContent.find('.sub-title-settings');

		textSettings.find('#Font-Style-cell').onChanged();
		textSettings.find('#Color-cell').onChanged();
		textSettings.find('#Font-Size-cell').onChanged();

		linkSettings.find('#Font-Style-cell').onChanged();
		linkSettings.find('#Color-cell').onChanged();
		linkSettings.find('#Font-Size-cell').onChanged();
		linkSettings.find('#Show-cell').onChanged();
		linkSettings.find('#Background-Color-cell').onChanged();
		linkSettings.find('#Border-cell').onChanged();

		subTitleSettings.find('#Font-Style-cell').onChanged();
		subTitleSettings.find('#Color-cell').onChanged();
		subTitleSettings.find('#Font-Size-cell').onChanged();
		subTitleSettings.find('#Show-cell').onChanged();

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.duration = this.paneContent.find('#Duration-cell').value;

			settings.linkWindow = this.paneContent.find('#Link-Window-cell').value;

			settings.imageBrightness = (this.paneContent.find('#Image-Brightness-cell').value || '50') + '%';

			settings.imageBlur = this.paneContent.find('#Image-Blur-cell').value;

			settings.contentLocation = this.paneContent.find('#Content-Location-cell').value;

			settings.textFontStyle = textSettings.find('#Font-Style-cell').value;

			settings.textColor = textSettings.find('#Color-cell').value;

			settings.textFontSize = textSettings.find('#Font-Size-cell').value;

			settings.linkFontStyle = linkSettings.find('#Font-Style-cell').value;

			settings.linkColor = linkSettings.find('#Color-cell').value;

			settings.linkFontSize = linkSettings.find('#Font-Size-cell').value;

			settings.linkShow = linkSettings.find('#Show-cell').value;

			settings.linkBackgroundColor = linkSettings.find('#Background-Color-cell').value;

			settings.linkBorder = linkSettings.find('#Border-cell').value;

			settings.subTitleFontStyle = subTitleSettings.find('#Font-Style-cell').value;

			settings.subTitleColor = subTitleSettings.find('#Color-cell').value;

			settings.subTitleFontSize = subTitleSettings.find('#Font-Size-cell').value;

			settings.subTitleShow = subTitleSettings.find('#Show-cell').value;

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
				text: { element: 'select', attributes: { id: 'meta-data-text', name: 'Text' }, options, selected: metadata.text},
				subTitle: { element: 'select', attributes: { id: 'meta-data-subTitle', name: 'SubTitle' }, options, selected: metadata.subTitle},
				link: { element: 'select', attributes: { id: 'meta-data-link', name: 'Link' }, options, selected: metadata.link},
				linkText: { element: 'select', attributes: { id: 'meta-data-linkText', name: 'LinkText' }, options, selected: metadata.linkText},
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.text = updateWindow.find('#meta-data-text').value;
			params.connection.metadata.subTitle = updateWindow.find('#meta-data-subTitle').value;
			params.connection.metadata.link = updateWindow.find('#meta-data-link').value;
			params.connection.metadata.linkText = updateWindow.find('#meta-data-linkText').value;

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
		params.container.find('.crater-slides').innerHTML = newContent.find('.crater-slides').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.list-pane').innerHTML = this.generatePaneContent({ slides: newContent.findAll('.crater-slide') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Slider };