import { ElementModifier } from './../ElementModifier';

class News extends ElementModifier {
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
			{ link: 'https://ipigroup.sharepoint.com/sites/ShortPointTrial/SiteAssets/photo-1542178036-2e5efe4d8f83.jpg', details: 'details 1' },
			{ link: 'https://ipigroup.sharepoint.com/sites/ShortPointTrial/SiteAssets/photo-1542178036-2e5efe4d8f83.jpg', details: 'details 2' },
			{ link: 'https://ipigroup.sharepoint.com/sites/ShortPointTrial/SiteAssets/photo-1542178036-2e5efe4d8f83.jpg', details: 'details 3' }
		];

		let news = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-ticker', 'data-type': 'news' } });
		news.makeElement({
			element: 'div', attributes: { class: 'crater-ticker-content', id: 'crater-ticker-content' }, children: [
				{
					element: 'div', attributes: { class: 'crater-ticker-title', id: 'crater-ticker-title' }, children: [
						{
							element: 'span', attributes: { class: 'crater-ticker-title-text', id: 'crater-ticker-title-text' }, text: 'Company Name'
						},
						{ element: 'span', attributes: { class: 'crater-ticker-angle', id: 'crater-ticker-angle' } }
					]
				},
				{
					element: 'div', attributes: { class: 'crater-ticker-news-container', id: 'crater-ticker-news-container' }
				},
				{
					element: 'span', attributes: { class: 'crater-ticker-controller', id: 'crater-ticker-controller' }, children: [
						{ element: 'a', attributes: { class: 'crater-arrow crater-up-arrow' } },
						{ element: 'a', attributes: { class: 'crater-arrow crater-down-arrow' } }
					]
				}
			]
		});

		let newsContainer = news.find('.crater-ticker-news-container');

		let settings = {
			duration: 10000,
			animationType: 'Fade'
		};

		for (let content of params.source) {
			newsContainer.makeElement({
				element: 'a', attributes: { class: 'crater-ticker-news', href: content.link, 'data-text': content.details }, text: content.details
			});
		}
		this.func.objectCopy(params, news.dataset);
		this.key = this.key || news.dataset.key;
		this.sharePoint.saveSettings(news, settings);

		return news;
	}

	public rendered(params) {
		this.key = params.element.dataset.key;
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.element.find('.crater-ticker-title').css({ height: 'inherit', minHeight: 'inherit' });
		this.element.find('.crater-ticker-news-container').css({ height: this.element.position().height + 'px' });

		this.startSlide();
	}

	public startSlide() {
		const settings = JSON.parse(this.element.dataset.settings);
		this.key = this.element.dataset['key'];

		let news = this.element.findAll('.crater-ticker-news'),
			action = settings.animationType.toLowerCase();

		if (news.length < 2) return;

		let current = 0,
			key = 0,
			onTop = false,
			title = this.element.find('.crater-ticker-title-text').position();

		let newsContainer = this.element.find('.crater-ticker-news-container');

		let hoverColor = this.element.find('.crater-ticker-title').css().backgroundColor || 'blueviolet';
		let color = newsContainer.css().color || 'white';

		let arrows = this.element.findAll('.crater-arrow');

		newsContainer.addEventListener('mouseover', event => {
			onTop = true;
			newsContainer.css({ color: hoverColor });
			for (let i = 0; i < arrows.length; i++) {
				arrows[i].css({ borderColor: hoverColor });
			}
		});

		newsContainer.addEventListener('mouseleave', event => {
			onTop = false;
			newsContainer.css({ color });
			for (let i = 0; i < arrows.length; i++) {
				arrows[i].css({ borderColor: color });
			}
		});

		for (let count = 0; count < news.length; count++) {
			news[count].innerHTML = news[count].dataset.text;
			news[count].css({ animationName: 'fade-out', });
			if (count == current) {
				news[count].css({ animationName: 'fade-in' });
			}
		}

		let runAnimation = () => {
			if (key < 0) key = news.length - 1;
			if (key >= news.length) key = 0;

			action = action || 'fade';
			if (action == 'fade') {
				news[current].css({ animationName: 'fade-out' });
				news[key].css({ animationName: 'fade-in' });
			}
			else if (action == 'swipe') {
				news[current].css({ animationName: 'swipe-out' });
				news[key].css({ animationName: 'swipe-in' });
			}
			else if (action == 'slide') {
				news[current].css({ animationName: 'slide-out' });
				news[key].css({ animationName: 'slide-in' });
			}

			current = key;
		};

		let keepAnimating = () => {
			clearInterval(settings.animation);
			settings.animation = setInterval(() => {
				if (!onTop) {
					key++;
					runAnimation();
				}
			}, settings.duration);
		};

		arrows.forEach(arrow => {
			arrow.addEventListener('click', event => {
				if (event.target.getParents('.crater-ticker') == this.element) {
					if (event.target.classList.contains('crater-down-arrow')) {
						key--;
					}
					else if (event.target.classList.contains('crater-up-arrow')) {
						key++;
					}
					clearInterval(settings.animation);
					runAnimation();
				}
			});

			arrow.css({ borderColor: color });
		});

		this.element.findAll('.crater-arrow')[current].click();

		keepAnimating();
	}

	private setUpPaneContent(params) {
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
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			let titlePane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card title-pane' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{ element: 'h2', attributes: { class: 'title' }, text: 'Ticker Title' }
						]
					},
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Title', value: this.element.find('.crater-ticker-title-text').innerText
							}),
							this.cell({
								element: 'input', name: 'Background Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'Text Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Pointer', options: ['Angle', 'Semi Circle', 'None']
							}),
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							}),
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							})
						]
					}
				]
			});

			let settingsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card content-pane' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							{ element: 'h2', attributes: { class: 'title' }, text: 'Content Settings' }
						]
					},
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Background Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'Text Color', dataAttributes: { type: 'color' }
							}),
						]
					}
				]
			});

			let news = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-ticker-news');

			this.paneContent.append(this.generatePaneContent({ news }));

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card', style: { margin: '1em', display: 'block' } }, sync: true, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							})
						]
					}),

					this.createElement({
						element: 'div', children: [
							this.cell({
								element: 'input', name: 'Duration', value: settings.duration
							}),
							this.cell({
								element: 'select', name: 'Animation', options: ['Fade', 'Swipe', 'Slide'], value: settings.animationType
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							}),
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	private generatePaneContent(params) {
		let newsPane = this.createElement({
			element: 'div', attributes: { class: 'card news-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'News List'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.news.length; i++) {
			newsPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em', position: 'relative' }, class: 'crater-ticker-news-pane',
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-ticker-content-row' }),
					this.cell({
						element: 'input', name: 'Link', value: params.news[i].getAttribute('href')
					}),
					this.cell({
						element: 'input', name: 'Text', value: params.news[i].dataset.text
					}),
				]
			});
		}

		return newsPane;
	}

	private listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let domDraft = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		let tickerNewsContainer = domDraft.find('.crater-ticker-news-container');

		let news = tickerNewsContainer.findAll('.crater-ticker-news');

		let newsPanePrototye = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-ticker-news-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-ticker-content-row' }),
				this.cell({
					element: 'input', name: 'Link', value: 'Link'
				}),
				this.cell({
					element: 'input', name: 'Text', value: 'Text'
				}),
			]
		});

		let newsPrototype = this.createElement({
			element: 'a', attributes: { class: 'crater-ticker-news', 'data-text': 'Text', href: '#' }
		});

		let newsHandler = (newsPane, newsDom) => {
			newsPane.addEventListener('mouseover', event => {
				newsPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			newsPane.addEventListener('mouseout', event => {
				newsPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			newsPane.find('#Link-cell').onChanged(value => {
				newsDom.setAttribute('href', value);
			});

			newsPane.find('#Text-cell').onChanged(value => {
				newsDom.dataset.text = value;
			});


			newsPane.find('.delete-crater-ticker-content-row').addEventListener('click', event => {
				newsDom.remove();
				newsPane.remove();
			});

			newsPane.find('.add-before-crater-ticker-content-row').addEventListener('click', event => {
				let newSlide = newsPrototype.cloneNode(true);
				let newListRow = newsPanePrototye.cloneNode(true);

				newsDom.before(newSlide);
				newsPane.before(newListRow);
				newsHandler(newListRow, newSlide);
			});

			newsPane.find('.add-after-crater-ticker-content-row').addEventListener('click', event => {
				let newSlide = newsPrototype.cloneNode(true);
				let newListRow = newsPanePrototye.cloneNode(true);

				newsDom.after(newSlide);
				newsPane.after(newListRow);

				newsHandler(newListRow, newSlide);
			});
		};

		this.paneContent.find('#Animation-cell').onChanged();
		this.paneContent.find('#Duration-cell').onChanged();
		this.paneContent.find('#Link-Window-cell').onChanged();

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newSlide = newsPrototype.cloneNode(true);
			let newListRow = newsPanePrototye.cloneNode(true);

			tickerNewsContainer.append(newSlide);//c
			this.paneContent.find('.news-pane').append(newListRow);

			newsHandler(newListRow, newSlide);
		});

		let titlePane = this.paneContent.find('.title-pane');

		titlePane.find('#Background-Color-cell').onChanged(backgroundColor => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ backgroundColor });
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-angle').css({ borderColor: backgroundColor });
			this.sharePoint.attributes.pane.content[this.key].draft.dom.css({ borderColor: backgroundColor });
		});

		titlePane.find('#Text-Color-cell').onChanged(color => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ color });
			let arrows = this.sharePoint.attributes.pane.content[this.key].draft.dom.findAll('.crater-arrow');
		});

		titlePane.find('#Border-cell').onChanged(border => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ border });
		});

		titlePane.find('#Font-Style-cell').onChanged(fontFamily => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ fontFamily });
		});

		titlePane.find('#Font-Size-cell').onChanged(fontSize => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ fontSize });
		});

		titlePane.find('#Show-cell').onChanged(show => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title').css({ display: (show == 'No') ? 'none' : 'flex' });
		});

		titlePane.find('#Pointer-cell').onChanged(pointer => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-angle').css({ display: (pointer == 'None') ? 'none' : 'unset' });

			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-angle').css({ borderRadius: (pointer == 'Semi Circle') ? '100%' : 'unset' });

		});

		let contentPane = this.paneContent.find('.content-pane');

		contentPane.find('#Font-Size-cell').onChanged(fontSize => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-news-container').css({ fontSize });
		});

		contentPane.find('#Font-Style-cell').onChanged(fontFamily => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-news-container').css({ fontFamily });
		});

		contentPane.find('#Text-Color-cell').onChanged(color => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-news-container').css({ color });
		});

		contentPane.find('#Background-Color-cell').onChanged(backgroundColor => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-content').css({ backgroundColor });
		});

		this.paneContent.find('.title-pane').find('#Title-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-ticker-title-text').innerText = value;
		});

		this.paneContent.findAll('.crater-ticker-news-pane').forEach((newsPane, position) => {
			newsHandler(newsPane, news[position]);
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.duration = this.paneContent.find('#Duration-cell').value;

			settings.animationType = this.paneContent.find('#Animation-cell').value;

			settings.linkWindow = this.paneContent.find('#Link-Window-cell').value;
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
				link: { element: 'select', attributes: { id: 'meta-data-link', name: 'Link' }, options, selected: metadata.link },
				details: { element: 'select', attributes: { id: 'meta-data-details', name: 'Details' }, options, selected: metadata.details }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.link = updateWindow.find('#meta-data-link').value;
			params.connection.metadata.details = updateWindow.find('#meta-data-details').value;

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
		params.container.find('.crater-ticker-news-container').innerHTML = newContent.find('.crater-ticker-news-container').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;
	
		if (params.flag == true) {
			this.paneContent.find('.news-pane').innerHTML = this.generatePaneContent({ news: newContent.findAll('.crater-ticker-news') }).innerHTML;
	
			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { News };