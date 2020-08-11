import { ElementModifier } from './../ElementModifier';

class BeforeAfter extends ElementModifier {
	public elementModifier = new ElementModifier();
	public paneContent: any;
	public element: any;
	private key: any;

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		let beforeAfterDiv = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-beforeAfter crater-component', 'data-type': 'beforeafter' }, children: [
				this.createElement({
					element: 'div', attributes: { id: 'crater-beforeAfter-contents', class: 'crater-beforeAfter-contents' }, children: [
						{
							element: 'img', attributes: { id: 'crater-beforeImage', class: 'crater-beforeImage', src: "http://egegorgulu.com/assets/img/beforeafter/before.jpg" }
						},

						{
							element: 'div', attributes: { id: 'crater-after', class: 'crater-after' }, children: [
								{
									element: 'img', attributes: { id: 'crater-afterImage', class: 'crater-afterImage', src: "http://egegorgulu.com/assets/img/beforeafter/after.jpg" }
								}
							]
						},
						{
							element: 'span', attributes: { id: 'crater-handle', class: 'crater-handle' }
						}
					]
				})
			]
		});

		const settings = { style: 'Default', linkWindow: 'Pop Up' };
		this.sharePoint.saveSettings(beforeAfterDiv, settings);

		return beforeAfterDiv;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		const settings = JSON.parse(params.element.dataset.settings);
		const slider = this.element.querySelector('.crater-beforeAfter-contents').querySelector('.crater-handle');
		let isDown = false;
		let resizeDiv = this.element.querySelector('.crater-beforeAfter-contents').querySelector('.crater-after');
		let width = this.element.querySelector('.crater-beforeAfter-contents').offsetWidth + 'px';
		this.element.querySelector('.crater-after img').css({ width });

		switch (settings.style.toLowerCase()) {
			case 'default':
				this.element.querySelector('.crater-handle').style.display = 'block';
				this.element.querySelector('.crater-after').style.width = '50%';
				this.element.querySelector('.crater-handle').style.left = '50%';
				if (this.element.querySelector('.crater-after').style.opacity) {
					this.element.querySelector('.crater-after').style.opacity = 'unset';
					this.element.querySelector('.crater-after').style.removeProperty('opacity');
				}
				if (this.element.querySelector('.crater-after').style.transition) this.element.querySelector('.crater-after').style.removeProperty('transition');
				if (this.element.querySelector('.crater-beforeImage').style.zIndex) {
					this.element.querySelector('.crater-beforeImage').style.zIndex = '1';
					this.element.querySelector('.crater-beforeImage').style.removeProperty('z-index');
				}

				this.drags(slider, resizeDiv, this.element.querySelector('.crater-beforeAfter-contents'));
				break;
			case 'hover':
				this.element.querySelector('.crater-handle').style.display = 'none';
				this.element.querySelector('.crater-after').style.width = '100%';
				this.element.querySelector('.crater-after').style.opacity = '0';
				this.element.querySelector('.crater-beforeAfter-contents').onmouseover = () => {
					this.element.querySelector('.crater-beforeImage').style.zIndex = '-1';
					this.element.querySelector('.crater-after').style.opacity = '1';
					this.element.querySelector('.crater-after').style.transition = 'all 1s ease-in-out';
				};

				this.element.querySelector('.crater-beforeAfter-contents').onmouseout = () => {
					this.element.querySelector('.crater-beforeImage').style.zIndex = '1';
					this.element.querySelector('.crater-after').style.opacity = '-1';
					this.element.querySelector('.crater-after').style.transition = 'all 1s ease-in-out';
				};
				break;
			default:
				this.element.querySelector('.crater-handle').style.display = 'none';
				this.element.querySelector('.crater-after').style.width = '100%';
				this.element.querySelector('.crater-after').style.opacity = '0';
				this.element.querySelector('.crater-beforeAfter-contents').onclick = () => {
					this.element.querySelector('.crater-beforeImage').classList.toggle('clicked');
					if (this.element.querySelector('.crater-beforeImage').classList.contains('clicked')) {
						this.element.querySelector('.crater-beforeImage').style.zIndex = '-1';
						this.element.querySelector('.crater-after').style.opacity = '1';
						this.element.querySelector('.crater-after').style.transition = 'all 1s ease-in-out';
					} else {
						this.element.querySelector('.crater-beforeImage').style.zIndex = '1';
						this.element.querySelector('.crater-after').style.opacity = '-1';
						this.element.querySelector('.crater-after').style.transition = 'all 1s ease-in-out';
					}
				};
		}
	}

	private drags(dragElement, resizeElement, container): any {
		//initialize the dragging event on mousedown
		dragElement.addEventListener('mousedown', elementDown => {

			dragElement.classList.add('crater-draggable');
			resizeElement.classList.add('crater-resizable');
			let startX = elementDown.pageX;
			//get the initial position
			let dragWidth = dragElement.clientWidth,
				posX = dragElement.offsetLeft + dragWidth - startX,
				containerOffset = container.offsetLeft,
				containerWidth = container.clientWidth;
			// Set limits
			let minLeft = containerOffset + 10;
			let maxLeft = containerOffset + containerWidth - dragWidth - 10;

			dragElement.parentNode.addEventListener('mousemove', elementMoved => {
				let moveX = elementMoved.pageX;
				let leftValue = moveX + posX - dragWidth;

				// Prevent going off limits
				if (leftValue < minLeft) {
					leftValue = minLeft;
				} else if (leftValue > maxLeft) {
					leftValue = maxLeft;
				}
				// Translate the handle's left value to masked divs width.
				var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
				// Set the new values for the slider and the handle. 
				// Bind mouseup events to stop dragging.

				let draggable = container.querySelector('.crater-draggable');

				if (!this.func.isnull(draggable)) draggable.css({ 'left': widthValue });
				container.addEventListener('mouseup', function () {
					this.classList.remove('crater-draggable');
					resizeElement.classList.remove('crater-resizable');
				});

				let resizable = container.querySelector('.crater-resizable');
				if (!this.func.isnull(resizable)) resizable.css({ 'width': widthValue });
			});
			container.addEventListener('mouseup', () => {
				dragElement.classList.remove('crater-draggable');
				resizeElement.classList.remove('crater-resizable');
			});
			elementDown.preventDefault();
		});
		dragElement.addEventListener('mouseup', elementUp => {
			dragElement.classList.remove('crater-draggable');
			resizeElement.classList.remove('crater-resizable');
		});
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();
		if (this.sharePoint.attributes.pane.content[key].draft.pane.content! = "") {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content != "") {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		}
		else {

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{ element: 'h2', attributes: { class: 'title' }, text: 'Settings' }
						]
					},
					{
						element: 'div', attributes: { class: 'row' },
						children: [
							this.cell({
								element: 'img',
								name: 'before',
								edit: 'upload-image',
								dataAttributes: {
									style: { width: '400px', height: '400px' },
									src: this.element.querySelector('.crater-beforeAfter-contents').querySelector('.crater-after').querySelector('.crater-afterImage').src
								}
							}),
							this.cell({
								element: "img", name: "after",
								edit: 'upload-image',
								dataAttributes: {
									style: { width: '400px', height: '400px' },
									src: this.element.querySelector('.crater-beforeAfter-contents').querySelector('.crater-beforeImage').src
								}
							}),
							this.cell({
								element: 'select', name: 'style', options: ['Default', 'Hover', 'Click']
							}),
							this.cell({
								element: 'input', name: 'height', value: ''
							})
						]
					}
				]
			});
		}
		return this.paneContent;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.querySelector('.crater-property-content').monitor();
		const settings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		const draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		this.paneContent.querySelector('#after-cell').checkChanges(() => {
			draftDom.querySelector('.crater-beforeAfter-contents').querySelector('.crater-beforeImage').src = this.paneContent.querySelector('#after-cell').src;
		});

		this.paneContent.querySelector('#before-cell').checkChanges(() => {
			draftDom.querySelector('.crater-beforeAfter-contents').querySelector('.crater-afterImage').src = this.paneContent.querySelector('#before-cell').src;
		});


		this.paneContent.querySelector('.title-pane').querySelector('#style-cell').value = settings.style;
		this.paneContent.querySelector('.title-pane').querySelector('#style-cell').onchange = () => {
			settingsClone.style = this.paneContent.querySelector('.title-pane').querySelector('#style-cell').value;
		};

		this.paneContent.querySelector('#height-cell').onChanged(height => {
			draftDom.querySelector('.crater-beforeImage').css({ height });
			draftDom.querySelector('.crater-afterImage').css({ height });
			this.paneContent.querySelector('#height-cell').setAttribute('value', height);
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			this.sharePoint.saveSettings(this.element, settings, settingsClone);
		});
	}
}

export { BeforeAfter };