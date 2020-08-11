import { ElementModifier } from './../ElementModifier';
import { ColorPicker } from './../ColorPicker';

class ThreeDimensionalSlider extends ElementModifier {
	public key: any;
	public element: any;
	public paneContent: any;
	public threeDSlideArray = [
		{
			id: 0,
			image: { description: 'Caption 1', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 1,
			image: { description: 'Caption 2', url: 'https://www.wired.com/wp-content/uploads/2015/02/LMOE-AliveInTuscon_scene44_0028_hires2.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 2,
			image: { description: 'Caption 3', url: 'http://www.nerdophiles.com/wp-content/uploads/2015/07/wp_izombie_brains_16x9.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 3,
			image: { description: 'Caption 4', url: 'http://assets1.ignimgs.com/2013/10/03/24-jack-bauer-1280jpg-883e35_1280w.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 4,
			image: { description: 'Caption 5', url: 'https://acollectivemind.files.wordpress.com/2013/12/season-4-complete-cast-poster-the-walking-dead-the-walking-dead-35777405-2528-670.png' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 5,
			image: { description: 'Caption 6', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 6,
			image: { description: 'Caption 7', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 7,
			image: { description: 'Caption 8', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 8,
			image: { description: 'Caption 9', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 9,
			image: { description: 'Caption 10', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 10,
			image: { description: 'Caption 11', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 11,
			image: { description: 'Caption 12', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 12,
			image: { description: 'Caption 13', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 13,
			image: { description: 'Caption 14', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		},
		{
			id: 14,
			image: { description: 'Caption 15', url: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg' },
			divView: 'New Window',
			url: 'https://www.nairaland.com'
		}
	];

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		if (!params.source) params.source = this.threeDSlideArray;
		const threeDimensionalSlider = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-three-dimensional-slider', 'data-type': 'threedimensionalslider' }, children: [
				{
					element: 'div', attributes: { id: 'crater-three-dimensional-slider-container', class: 'crater-three-dimensional-slider-container' }, children: [
						{
							element: 'div', attributes: { id: 'scene-one', class: 'scene-one' }, children: [
								{ element: 'div', attributes: { class: 'carousel1' } }
							]
						},
						{
							element: 'div', attributes: { id: 'carousel-options1', class: 'carousel-options1' }, children: [
								{
									element: 'div', attributes: { class: 'crater-three-dimensional-slider-navigation-box' }, children: [
										{ element: 'button', attributes: { class: 'crater-three-dimensional-slider-navigation previous-button' }, text: 'Prev' },
										{ element: 'button', attributes: { class: 'crater-three-dimensional-slider-navigation next-button' }, text: 'Next' }
									]
								}
							]
						}
					]
				}
			]
		});

		for (let slide of params.source) {
			threeDimensionalSlider.querySelector('.carousel1').innerHTML += `
			<div id="id-${slide.id}" class="carousel__cell">
				<img src="${slide.image.url}" ,
						data-at2x="picture1.jpg" alt="${slide.image.description}">
				<div id="id-${slide.id}" class="flip-caption" data-view="${slide.divView || 'New Window'}" data-href="${slide.url}">
					<div class="crater-carousel-caption-options-text" style="background-color: rgb(0, 0, 0)"> ${slide.image.description}</div> 
				</div> 
            </div>
			`;
		}

		const settings = { interval: 'Slow', speed: 8000, orientation: 'Horizontal', cells: 5, caption: 'Display' };
		this.sharePoint.saveSettings(threeDimensionalSlider, settings);

		this.key = threeDimensionalSlider.dataset.key;

		return threeDimensionalSlider;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		this.runThreeDimensionalSlider();
	}

	public runThreeDimensionalSlider() {
		const self = this;
		const settings = JSON.parse(this.element.dataset.settings);
		let currentSlideIndex: number = 0;
		let carousel = this.element.querySelector('.carousel1') as any;
		let cells = carousel.querySelectorAll('.carousel__cell');
		let selectedIndex: number = 0;
		let cellWidth: number = carousel.offsetWidth;
		let cellHeight: number = carousel.offsetHeight;
		let isHorizontal: boolean = true;
		let rotateDirection: string = isHorizontal ? 'rotateY' : 'rotateX';
		let cellCount, radius, theta;

		self.element.querySelectorAll('.flip-caption').forEach(cap => {
			cap.querySelector('.crater-carousel-caption-options-text').style.width = cap.parentElement.querySelector('img').style.width || '490px';
			cap.parentElement.addEventListener('click', (event) => {
				event.preventDefault();
				if (cap.dataset.view.toLowerCase() === 'pop up') {
					let popUp = self.popUp({ source: cap.dataset.href, close: self.sharePoint.images.close, maximize: self.sharePoint.images.maximize, minimize: self.sharePoint.images.minimize });
					self.element.append(popUp);
				}
				else if (cap.dataset.view.toLowerCase() === 'new window') window.open(cap.dataset.href);
				else window.open(cap.dataset.href, '_self');
			});
		});

		function rotateCarousel() {
			let angle: number = theta * selectedIndex * -1;
			carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
				rotateDirection + '(' + angle + 'deg)';
			for (let i = 0; i < settings.cells; i++) {
				if (carousel.children[i].id === `id-${currentSlideIndex}`) {
					carousel.children[i].querySelector('.crater-carousel-caption-options-text').style.opacity = 1;
				} else {
					carousel.children[i].querySelector('.crater-carousel-caption-options-text').style.opacity = 0;
				}
			}

		}

		let prevButton = this.element.querySelector('.previous-button');
		prevButton.addEventListener('click', e => {
			previousSlide();
			clearInterval(settings.threeDSliderInterval);
			initiateSlider();
		});

		let nextButton = this.element.querySelector('.next-button');
		nextButton.addEventListener('click', e => {
			nextSlide();
			clearInterval(settings.threeDSliderInterval);
			initiateSlider();
		});

		function nextSlide() {
			selectedIndex++;
			currentSlideIndex = (currentSlideIndex === (settings.cells - 1)) ? 0 : currentSlideIndex + 1;
			rotateCarousel();
		}

		function previousSlide() {
			selectedIndex--;
			currentSlideIndex = (currentSlideIndex === 0) ? (settings.cells - 1) : currentSlideIndex - 1;
			rotateCarousel();
		}

		function initiateSlider() {
			settings.threeDSliderInterval = setInterval(() => {
				nextSlide();
			}, settings.speed);
		}

		this.element.querySelector('.scene-one').onmouseover = () => {
			clearInterval(settings.threeDSliderInterval);
		};

		this.element.querySelector('.scene-one').onmouseout = () => {
			initiateSlider();
		};

		function changeCarousel() {
			cellCount = settings.cells;
			theta = 360 / cellCount;
			let cellSize = isHorizontal ? cellWidth : cellHeight;
			radius = Math.round((cellSize / 2) / Math.tan(Math.PI / cellCount));
			for (let i = 0; i < cells.length; i++) {
				let cell = cells[i];
				if (i < cellCount) {
					// visible cell
					cell.style.opacity = 1;
					let cellAngle = theta * i;
					cell.style.transform = rotateDirection + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
				} else {
					// hidden cell
					cell.style.opacity = 0;
					cell.style.transform = 'none';
				}
			}

			rotateCarousel();
		}

		function onOrientationChange() {
			isHorizontal = settings.orientation.toLowerCase() === 'horizontal';
			rotateDirection = isHorizontal ? 'rotateY' : 'rotateX';
			changeCarousel();
		}

		initiateSlider();
		// set initials
		onOrientationChange();
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		const settings = JSON.parse(this.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			const threeDCarouselSlides = this.sharePoint.attributes.pane.content[key].draft.dom.querySelector('.crater-three-dimensional-slider-container');
			const threeDCarouselSlidesRows = threeDCarouselSlides.querySelectorAll('.carousel__cell');

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'three-d-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'General Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'width', value: this.element.css()['width']
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.querySelector('.carousel__cell img').css()['height']
							}),
							this.cell({
								element: 'select', name: 'cells', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
							}),
							this.cell({
								element: 'select', name: 'speed', options: ['Slow', 'Normal', 'Fast']
							}),
							this.cell({
								element: 'select', name: 'caption', options: ['Display', 'Hide']
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		this.key = params.element.dataset.key;
		const settings = JSON.parse(this.element.dataset.settings);
		let threeDimensionalCarouselPane = this.createElement({
			element: 'div', attributes: { class: 'card three-carousel-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Carousel Items'
						})
					]
				}),
			]
		});

		for (let i = 0; i < settings.cells; i++) {
			threeDimensionalCarouselPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-three-carousel-item-pane row' },
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-three-carousel-single' }),
					this.cell({
						element: 'img', edit: 'upload-image', name: 'image', dataAttributes: { class: 'crater-icon', src: params.list[i].querySelector('img').src }
					}),
					this.cell({
						element: 'span', edit: 'change-text', name: 'caption', value: params.list[i].querySelector('.crater-carousel-caption-options-text').textContent
					}),
					this.cell({
						element: 'input', name: 'caption-background', dataAttributes: { type: 'color' }, value: ColorPicker.rgbToHex(params.list[i].querySelector('.crater-carousel-caption-options-text').style.backgroundColor)
					}),
					this.cell({
						element: 'input', edit: 'change-text', name: 'url', value: params.list[i].querySelector('.flip-caption').getAttribute('data-href')
					}),
					this.cell({
						element: 'select', name: 'view', options: ['Same Window', 'New Window', 'Pop Up'], value: params.list[i].querySelector('.flip-caption').getAttribute('data-view')
					}),
				]
			});
		}

		return threeDimensionalCarouselPane;

	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		const settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		//get the content and all the events
		let threeDCarouselSlides = this.sharePoint.attributes.pane.content[this.key].draft.dom.querySelector('.crater-three-dimensional-slider-container');
		let threeDCarouselSlidesRows = threeDCarouselSlides.querySelectorAll('.carousel__cell');
		if (this.paneContent.querySelector('.three-carousel-pane')) this.paneContent.querySelector('.three-carousel-pane').remove();
		this.paneContent.append(this.generatePaneContent({ element: params.element, list: params.element.querySelectorAll('.carousel__cell') }));

		window.onerror = (message, url, line, column, error) => {
			console.log(message, url, line, column, error);
		};

		let threeDSlideHandler = (threeDSlidePane, threeDSlideDom) => {
			// get the values of the newly created row on the property - pane
			threeDSlidePane.find('#image-cell').checkChanges(() => {
				threeDSlideDom.querySelector('img').src = threeDSlidePane.find('#image-cell').src;
			});

			threeDSlidePane.querySelector('#caption-cell').checkChanges(event => {
				threeDSlideDom.querySelector('.crater-carousel-caption-options-text').copy(threeDSlidePane.querySelector('#caption-cell'), []);
			});

			threeDSlidePane.querySelector('#caption-background-cell').onchange = () => {
				threeDSlideDom.querySelector('.crater-carousel-caption-options-text').style.backgroundColor = threeDSlidePane.querySelector('#caption-background-cell').value;
			};

			threeDSlidePane.querySelector('#url-cell').onChanged(value => {
				threeDSlideDom.querySelector('.flip-caption').setAttribute('data-href', value);
			});

			threeDSlidePane.querySelector('#view-cell').onchange = () => {
				threeDSlideDom.querySelector('.flip-caption').setAttribute('data-view', threeDSlidePane.querySelector('#view-cell').value);
			};
		};

		this.paneContent.findAll('.crater-three-carousel-item-pane').forEach((listRow, position) => {
			threeDSlideHandler(listRow, threeDCarouselSlidesRows[position]);
		});

		const generalSettingsPane = this.paneContent.querySelector('.three-d-settings-pane');
		generalSettingsPane.querySelector('#width-cell').value = draftDom.querySelector('.carousel__cell img').style.width || '490px';
		generalSettingsPane.querySelector('#width-cell').onchange = () => {
			draftDom.querySelectorAll('.carousel__cell img').forEach(threeD => {
				threeD.style.width = generalSettingsPane.querySelector('#width-cell').value;
			});
			draftDom.querySelector('.scene-one').style.width = (parseInt(draftDom.querySelector('.carousel__cell img').style.width) + 20) + 'px';
			generalSettingsPane.querySelector('#width-cell').value = draftDom.querySelector('.carousel__cell img').css()['width'];
		};

		generalSettingsPane.querySelector('#height-cell').value = draftDom.querySelector('.carousel__cell img').style.height || '290px';
		generalSettingsPane.querySelector('#height-cell').onchange = () => {
			draftDom.querySelectorAll('.carousel__cell img').forEach(threeD => {
				threeD.style.height = generalSettingsPane.querySelector('#height-cell').value;
			});
			draftDom.querySelector('.scene-one').style.height = (parseInt(draftDom.querySelector('.carousel__cell img').style.height) + 20) + 'px';
			generalSettingsPane.querySelector('#height-cell').value = draftDom.querySelector('.carousel__cell img').style.height;
		};

		generalSettingsPane.querySelector('#speed-cell').value = settings.interval;

		generalSettingsPane.querySelector('#speed-cell').onchange = () => {
			settings.interval = generalSettingsPane.querySelector('#speed-cell').value;
			switch (generalSettingsPane.querySelector('#speed-cell').value.toLowerCase()) {
				case 'slow':
					settings.speed = 8000;
					break;

				case 'normal':
					settings.speed = 5500;
					break;

				case 'fast':
					settings.speed = 3000;
					break;
			}
		};

		generalSettingsPane.querySelector('#cells-cell').value = settings.cells;
		generalSettingsPane.querySelector('#cells-cell').onchange = () => {
			settings.cells = generalSettingsPane.querySelector('#cells-cell').value;
		};

		generalSettingsPane.querySelector('#caption-cell').value = settings.caption;
		generalSettingsPane.querySelector('#caption-cell').onchange = () => {
			settings.caption = generalSettingsPane.querySelector('#caption-cell').value;
			switch (generalSettingsPane.querySelector('#caption-cell').value.toLowerCase()) {
				case 'display':
					draftDom.querySelectorAll('.crater-carousel-caption-options-text')
						.forEach(cap => cap.style.visibility = 'visible');
					break;

				case 'hide':
					draftDom.querySelectorAll('.crater-carousel-caption-options-text')
						.forEach(cap => cap.style.visibility = 'hidden');
					break;

			}
		};


		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;//upate the webpart
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;
			this.sharePoint.saveSettings(this.element, settings);
		});
	}

	public update(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		const settings = JSON.parse(params.element.dataset.settings);
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Image' }, options: params.options },
				url: { element: 'select', attributes: { id: 'meta-data-url', name: 'url' }, options: params.options },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		let data: any = {};
		let source: any;
		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			data.image = updateWindow.find('#meta-data-image').value;
			data.url = updateWindow.find('#meta-data-url').value;

			source = this.func.extractFromJsonArray(data, params.source);

			let newContent = this.render({ source });
			draftDom.find('.crater-three-dimensional-slider-container').innerHTML = newContent.find('.crater-three-dimensional-slider-container').innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = draftDom.outerHTML;
			this.paneContent.find('.three-carousel-pane').innerHTML = this.generatePaneContent({ list: newContent.querySelectorAll('.carousel__cell') }).innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
		});


		if (!this.func.isnull(paneConnection)) {
			paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
				this.element.innerHTML = draftDom.innerHTML;

				this.element.css(draftDom.css());

				this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

				this.sharePoint.saveSettings(this.element, settings);
			});
		}

		return updateWindow;
	}
}

export { ThreeDimensionalSlider };