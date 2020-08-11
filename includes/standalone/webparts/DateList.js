import { ElementModifier } from './../ElementModifier';

class DateList extends ElementModifier {
	public params;
	public element;
	public key;
	public paneContent;
	public elementModifier = new ElementModifier();
	public monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source)) {
			params.source = [
				{
					startdate: "2020-08-19",
					enddate: "08/20/2020",
					title: "DateList Item 1",
					subtitle: "Lagos Island, Lagos",
					body: 'Donec ut maximus magna. Quisque id placerat ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras quis tellus quis orci tempus feugiat ac eu orci.'
				},
				{
					startdate: "2020-05-01",
					enddate: "05/02/2020",
					title: "DateList Item 2",
					subtitle: "Lagos Island, Lagos",
					body: 'Donec ut maximus magna. Quisque id placerat ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras quis tellus quis orci tempus feugiat ac eu orci.'
				},
				{
					startdate: "2020-10-28",
					enddate: "10/28/2020",
					title: "DateList Item 3",
					subtitle: "Lagos Island, Lagos",
					body: 'Donec ut maximus magna. Quisque id placerat ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras quis tellus quis orci tempus feugiat ac eu orci.'
				}
			];
		}

		let dateList = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-datelist crater-component', 'data-type': 'datelist' }, children: [
				{
					element: 'div', attributes: { id: 'crater-datelist-title', class: 'crater-datelist-title' }, children: [
						{ element: 'i', attributes: { class: 'crater-datelist-title-imgIcon', 'data-icon': this.sharePoint.icons.play } },
						{ element: 'span', attributes: { class: 'crater-datelist-title-captionTitle' }, text: 'Date-List' }
					]
				},
				{ element: 'div', attributes: { id: 'crater-datelist-content', class: 'crater-datelist-content' } }
			]
		});

		let dateListContent = dateList.find(`.crater-datelist-content`);


		for (let row of params.source) {
			dateListContent.makeElement(
				{
					element: 'div', attributes: { id: 'crater-datelist-content-item', class: 'crater-datelist-content-item' }, children: [
						this.createElement({
							element: 'div', attributes: { id: 'crater-datelist-content-item-date', class: 'crater-datelist-content-item-date before-stuff' }, children: [
								{
									element: 'div', attributes: { class: 'crater-datelist-content-item-date-before' }, children: [
										{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-day crater-datelist-double-day', id: 'Day' }, text: (new Date(row.startdate)).getDate() },
										{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-month crater-datelist-double-month', id: 'Month' }, text: this.monthArray[(new Date(row.startdate)).getMonth()].toUpperCase() }
									]
								},
								{ element: 'div', attributes: { class: 'crater-datelist-slash' }, text: '-' },
								{
									element: 'div', attributes: { class: 'crater-datelist-content-item-date-after' }, children: [
										{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-day crater-datelist-double-day', id: 'Day' }, text: (new Date(row.enddate)).getDate() },
										{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-month crater-datelist-double-month', id: 'Month' }, text: this.monthArray[(new Date(row.enddate)).getMonth()].toUpperCase() }
									]
								}
							]
						}),
						this.createElement({
							element: 'div', attributes: { id: 'crater-datelist-content-item-text', class: 'crater-datelist-content-item-text' }, children: [
								{
									element: 'div', attributes: { class: 'crater-datelist-content-item-text-box' }, children: [
										{ element: 'span', attributes: { class: 'crater-datelist-content-item-text-main', id: 'mainText', 'data-href': 'https://www.nairaland.com' }, text: row.title },
										{ element: 'p', attributes: { class: 'crater-datelist-content-item-text-subtitle', id: 'subtitle' }, text: row.subtitle },
									]
								},
								{ element: 'p', attributes: { class: 'crater-datelist-content-item-text-body', id: 'body' }, text: row.body },
							]
						})
					]
				}
			);
		}


		this.sharePoint.saveSettings(dateList, { linkOption: 'Link', view: 'New Window' });
		this.key = this.key || dateList.dataset.key;

		return dateList;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = this.element.dataset.key;
		const settings = JSON.parse(params.element.dataset.settings);
		const dateListContent = params.element.find(`.crater-datelist-content`);

		dateListContent.querySelectorAll('.crater-datelist-content-item').forEach(contentItem => {
			if ((contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').innerHTML === contentItem.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-day').innerHTML) && (contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').innerHTML === contentItem.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-month').innerHTML)) {
				contentItem.querySelector('.crater-datelist-slash').style.display = 'none';
				contentItem.querySelector('.crater-datelist-content-item-date-after').style.display = 'none';
				if (contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.contains('crater-datelist-double-day')) {
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.remove('crater-datelist-double-day');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.remove('crater-datelist-double-month');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.add('crater-datelist-single-day');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.add('crater-datelist-single-month');
				}
			} else {
				contentItem.querySelector('.crater-datelist-slash').style.display = 'grid';
				contentItem.querySelector('.crater-datelist-content-item-date-after').style.display = 'block';
				if (contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.contains('crater-datelist-single-day')) {
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.remove('crater-datelist-single-day');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.remove('crater-datelist-single-month');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.add('crater-datelist-double-day');
					contentItem.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.add('crater-datelist-double-month');
				}
			}
		});

		if (settings.linkOption.toLowerCase() === 'link') {
			this.element.querySelectorAll('.crater-datelist-content-item').forEach(followLink => {
				followLink.querySelectorAll('.crater-datelist-content-item-date').forEach(filterBackground => {
					filterBackground.addEventListener('mouseover', e => {
						filterBackground.style.cursor = 'pointer';
					});
					filterBackground.addEventListener('mouseout', e => {
						filterBackground.style.cursor = 'unset';
					});
				});
				followLink.addEventListener('click', e => {
					if (e.target.classList.contains('crater-datelist-content-item-date') || e.target.parentElement.classList.contains('crater-datelist-content-item-date') || e.target.classList.contains('crater-datelist-content-item-text-main')) {
						if (settings['view'].toLowerCase() == 'pop up') {
							let popUp = this.popUp({ source: followLink.querySelector('.crater-datelist-content-item-text-main').getAttribute('data-href'), close: this.sharePoint.images.close, maximize: this.sharePoint.images.maximize, minimize: this.sharePoint.images.minimize });
							this.element.append(popUp);
						}
						else if (settings['view'].toLowerCase() == 'new window') {
							window.open(followLink.querySelector('.crater-datelist-content-item-text-main').getAttribute('data-href'));
						}
						else {
							window.open(followLink.querySelector('.crater-datelist-content-item-text-main').getAttribute('data-href'), '_self');
						}
					}
				});
			});
		} else if (settings.linkOption.toLowerCase() === 'unlink') {
			this.element.querySelectorAll('.crater-datelist-content-item').forEach(followLink => {
				followLink.querySelectorAll('.crater-datelist-content-item-date').forEach(filterBackground => {
					filterBackground.removeEventListener('mouseover', e => {
						filterBackground.style.cursor = 'unset';
					});
					filterBackground.removeEventListener('mouseout', e => {
						filterBackground.style.cursor = 'unset';
					});
				});
			});
		}
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];//create a key variable and set it to the webpart key
		this.element = params.element;//define the declared element to the draft dom content
		const settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor(); //monitor the content pane 


		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {//check if draft pane content is not empty and set it to the pane content
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			let dateList = this.sharePoint.attributes.pane.content[key].draft.dom.find('.crater-datelist-content');
			let dateListRows = dateList.findAll('.crater-datelist-content-item');
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement(
						{ element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New' }
					)
				]
			});


			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							{ element: 'h2', attributes: { class: 'title' }, text: 'Date-List Title Layout' }
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [//create the cells for changing crater event title
							this.cell({
								element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.find('.crater-datelist-title-imgIcon').dataset.icon }
							}),
							this.cell({
								element: 'input', name: 'title', value: this.element.find('.crater-datelist-title').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-title').css()['background-color'], list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-title').css().color, list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('.crater-datelist-title').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.find('.crater-datelist-title').css()['height'] || ''
							}),
							this.cell({
								element: 'select', name: 'toggleTitle', options: ['show', 'hide']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-date-row-pane card' }, children: [
					{
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Date-List Dates'
							}),
						]
					},
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'daySize', value: this.element.find('.crater-datelist-content-item-date-day').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'monthSize', value: this.element.find('.crater-datelist-content-item-date-month').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-datelist-content-item-date').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'dayColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-content-item-date-day').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'monthColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-content-item-date-month').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleDate', options: ['show', 'hide']
							})
						]
					}

				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-background-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'background-color', value: this.element.find('.crater-datelist-content-item').css()['background-color']
							}),
							this.cell({
								element: 'select', name: 'separator', options: ['Show Separator', 'Hide Separator']
							}),
							this.cell({
								element: 'select', name: 'title-vertical-alignment', options: ['Top', 'Bottom']
							}),
							this.cell({
								element: 'select', name: 'date-style', options: ['Plain', 'MiniBar', 'FullBar']
							}),
							this.cell({
								element: 'select', name: 'date-location', options: ['Left', 'Right']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-link-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Date-List Link'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'link-options', options: ['Link', 'Unlink']
							}),
							this.cell({
								element: 'select', name: 'View', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.view
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-title-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Date-List Title'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-datelist-content-item-text-main').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-datelist-content-item-text-main').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'titleColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-content-item-text-main').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleTitle', options: ['show', 'hide']
							}),
							this.cell({
								element: 'select', name: 'align', options: ['Left', 'Center', 'Right']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-subtitle-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Date-List Subtitle'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-datelist-content-item-text-subtitle').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-datelist-content-item-text-subtitle').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'subtitleColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-content-item-text-subtitle').css().color, list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleSubtitle', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'datelist-body-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Date-List Body'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-datelist-content-item-text-body').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-datelist-content-item-text-body').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'bodyColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-datelist-content-item-text-body').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleBody', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.append(this.generatePaneContent({ list: dateListRows }));
		}
		return this.paneContent;
	}

	public generatePaneContent(params) {
		let dateListPane = this.createElement({
			element: 'div', attributes: { class: 'card datelist-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Date-List Rows'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.list.length; i++) {
			dateListPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-datelist-item-pane row' },
				children: [
					this.paneOptions({ options: ['AA', 'AB', 'D'], owner: 'crater-datelist-content-item' }),
					this.cell({
						element: 'input', name: 'startdate', attribute: { class: 'crater-date' }, dataAttributes: { type: 'date' }, value: ''
					}),
					this.cell({
						element: 'input', name: 'enddate', attribute: { class: 'crater-date' }, dataAttributes: { type: 'date' }, value: ''
					}),
					this.cell({
						element: 'input', name: 'title', value: params.list[i].find('#mainText').textContent
					}),
					this.cell({
						element: 'input', name: 'subtitle', value: params.list[i].find('#subtitle').textContent
					}),
					this.cell({
						element: 'input', name: 'body', value: params.list[i].find('#body').textContent
					}),
					this.cell({
						element: 'input', name: 'url', value: params.list[i].find('.crater-datelist-content-item-text-main').getAttribute('data-href')
					})
				]
			});
		}

		return dateListPane;

	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		const settings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		//get the content and all the events
		let dateList: any = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-datelist-content');
		let dateListRow: any = dateList.findAll('.crater-datelist-content-item');

		let dateListRowPanePrototype = this.createElement({//create a row on the property pane
			element: 'div',
			attributes: { class: 'crater-datelist-item-pane row' },
			children: [
				this.paneOptions({ options: ['AA', 'AB', 'D'], owner: 'crater-datelist-content-item' }),
				this.cell({
					element: 'input', name: 'startdate', attribute: { class: 'crater-date' }, dataAttributes: { type: 'date' }, value: ''
				}),
				this.cell({
					element: 'input', name: 'enddate', attribute: { class: 'crater-date' }, dataAttributes: { type: 'date' }, value: ''
				}),
				this.cell({
					element: 'input', name: 'title', value: ''
				}),
				this.cell({
					element: 'input', name: 'subtitle', value: ''
				}),
				this.cell({
					element: 'input', name: 'body', value: ''
				}),
				this.cell({
					element: 'input', name: 'url', value: ''
				})
			]
		});


		let dateListRowDomPrototype = this.createKeyedElement(
			{
				element: 'div', attributes: { id: 'crater-datelist-content-item', class: 'crater-datelist-content-item keyed-element' }, children: [
					this.createElement({
						element: 'div', attributes: { id: 'crater-datelist-content-item-date', class: 'crater-datelist-content-item-date before-stuff' }, children: [
							{
								element: 'div', attributes: { class: 'crater-datelist-content-item-date-before' }, children: [
									{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-day crater-datelist-double-day', id: 'Day' }, text: '' },
									{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-month crater-datelist-double-month', id: 'Month' }, text: '' }
								]
							},
							{ element: 'div', attributes: { class: 'crater-datelist-slash' }, text: '-' },
							{
								element: 'div', attributes: { class: 'crater-datelist-content-item-date-after' }, children: [
									{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-day crater-datelist-double-day', id: 'Day' }, text: '' },
									{ element: 'div', attributes: { class: 'crater-datelist-content-item-date-month crater-datelist-double-month', id: 'Month' }, text: '' }
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { id: 'crater-datelist-content-item-text', class: 'crater-datelist-content-item-text' }, children: [
							{
								element: 'div', attributes: { class: 'crater-datelist-content-item-text-box' }, children: [
									{ element: 'span', attributes: { class: 'crater-datelist-content-item-text-main', id: 'mainText', 'data-href': 'https://www.nairaland.com' }, text: '' },
									{ element: 'p', attributes: { class: 'crater-datelist-content-item-text-subtitle', id: 'subtitle' }, text: '' },
								]
							},
							{ element: 'p', attributes: { class: 'crater-datelist-content-item-text-body', id: 'body' }, text: '' },
						]
					})
				]
			}
		);

		let dateRowHandler = (dateRowPane, dateRowDom) => {
			dateRowPane.addEventListener('mouseover', event => {
				dateRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			dateRowPane.addEventListener('mouseout', event => {
				dateRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			// get the values of the newly created row on the property - pane
			dateRowPane.find('#title-cell').onChanged(value => {
				dateRowDom.find('.crater-datelist-content-item-text-main').innerHTML = value;
			});

			dateRowPane.find('#subtitle-cell').onChanged(value => {
				dateRowDom.find('.crater-datelist-content-item-text-subtitle').innerHTML = value;
			});

			dateRowPane.find('#body-cell').onChanged(value => {
				dateRowDom.find('.crater-datelist-content-item-text-body').innerHTML = value;
			});

			dateRowPane.querySelector('#startdate-cell').onChanged(value => {
				const date = new Date(value);
				dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').innerHTML = date.getDate();
				dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').innerHTML = this.monthArray[date.getMonth()];
			});

			dateRowPane.querySelector('#enddate-cell').onChanged(value => {
				const date = new Date(value);
				dateRowDom.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-day').innerHTML = date.getDate();
				dateRowDom.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-month').innerHTML = this.monthArray[date.getMonth()];

				compareTimes();
			});
			function compareTimes() {
				if ((dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').innerHTML === dateRowDom.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-day').innerHTML) && (dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').innerHTML === dateRowDom.querySelector('.crater-datelist-content-item-date-after').find('.crater-datelist-content-item-date-month').innerHTML)) {
					dateRowDom.querySelector('.crater-datelist-slash').style.display = 'none';
					dateRowDom.querySelector('.crater-datelist-content-item-date-after').style.display = 'none';
					if (dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.contains('crater-datelist-double-day')) {
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.remove('crater-datelist-double-day');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.remove('crater-datelist-double-month');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.add('crater-datelist-single-day');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.add('crater-datelist-single-month');
					}
				} else {
					dateRowDom.querySelector('.crater-datelist-slash').style.display = 'grid';
					dateRowDom.querySelector('.crater-datelist-content-item-date-after').style.display = 'block';
					if (dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.contains('crater-datelist-single-day')) {
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.remove('crater-datelist-single-day');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.remove('crater-datelist-single-month');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-day').classList.add('crater-datelist-double-day');
						dateRowDom.querySelector('.crater-datelist-content-item-date-before').find('.crater-datelist-content-item-date-month').classList.add('crater-datelist-double-month');
					}
				}
			}

			dateRowPane.find('#url-cell').onChanged(value => {
				dateRowDom.find('.crater-datelist-content-item-text-main').setAttribute('data-href', value);
			});

			dateRowPane.find('.delete-crater-datelist-content-item').addEventListener('click', event => {
				dateRowDom.remove();
				dateRowPane.remove();
			});

			dateRowPane.find('.add-before-crater-datelist-content-item').addEventListener('click', event => {
				let newdateRowDom = dateListRowDomPrototype.cloneNode(true);
				let newdateRowPane = dateListRowPanePrototype.cloneNode(true);

				dateRowDom.before(newdateRowDom);
				dateRowPane.before(newdateRowPane);
				dateRowHandler(newdateRowPane, newdateRowDom);
			});

			dateRowPane.find('.add-after-crater-datelist-content-item').addEventListener('click', event => {
				let newdateRowDom = dateListRowDomPrototype.cloneNode(true);
				let newdateRowPane = dateListRowPanePrototype.cloneNode(true);

				dateRowDom.after(newdateRowDom);
				dateRowPane.after(newdateRowPane);

				dateRowHandler(newdateRowPane, newdateRowDom);
			});
		};

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		let titlePane = this.paneContent.find('.title-pane');
		let dateListDateRowPane = this.paneContent.find('.datelist-date-row-pane');
		let dateListTitleRowPane = this.paneContent.find('.datelist-title-row-pane');
		let dateListSubtitleRowPane = this.paneContent.find('.datelist-subtitle-row-pane');
		let dateListBodyRowPane = this.paneContent.find('.datelist-body-row-pane');


		this.paneContent.find('.datelist-background-row-pane').find('#background-color-cell').onchange = (event) => {
			const backgroundColor = this.paneContent.find('.datelist-background-row-pane').find('#background-color-cell').value;
			draftDom.findAll('.crater-datelist-content-item').forEach(element => {
				element.css({ backgroundColor });//get the color of the event font in the draftDom
			});
			this.paneContent.find('.datelist-background-row-pane').find('#background-color-cell').setAttribute('value', backgroundColor); //set the value of the eventColor cell in the pane to the color
		};

		dateListTitleRowPane.find('#titleColor-cell').addEventListener('change', (event) => {
			const color = dateListTitleRowPane.find('#titleColor-cell').value;
			draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
				element.css({ color });//get the color of the event font in the draftDom
			});
			dateListTitleRowPane.find('#titleColor-cell').setAttribute('value', color); //set the value of the eventColor cell in the pane to the color
		});

		dateListSubtitleRowPane.find('#subtitleColor-cell').addEventListener('change', (event) => {
			const color = dateListSubtitleRowPane.find('#subtitleColor-cell').value;
			draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
				element.css({ color });//get the color of the event font in the draftDom
			});
			dateListSubtitleRowPane.find('#subtitleColor-cell').setAttribute('value', color); //set the value of the eventColor cell in the pane to the color
		});

		dateListBodyRowPane.find('#bodyColor-cell').onchange = () => {
			const color = dateListBodyRowPane.find('#bodyColor-cell').value;
			draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
				element.css({ color });//get the color of the event font in the draftDom
			});
			dateListBodyRowPane.find('#bodyColor-cell').setAttribute('value', color);
		};

		dateListDateRowPane.find('#dayColor-cell').addEventListener('change', (event) => {
			const color = dateListDateRowPane.find('#dayColor-cell').value;
			draftDom.findAll('.crater-datelist-content-item-date-day').forEach(element => {
				element.css({ color });//get the color of the event font in the draftDom
			});
			dateListDateRowPane.find('#dayColor-cell').setAttribute('value', color);
		});

		dateListDateRowPane.find('#monthColor-cell').onchange = () => {
			const color = dateListDateRowPane.find('#monthColor-cell').value;
			draftDom.findAll('.crater-datelist-content-item-date-month').forEach(element => {
				element.css({ color });//get the color of the event font in the draftDom
			});
			dateListDateRowPane.find('#monthColor-cell').setAttribute('value', color); //set the value of the eventColor cell in the pane to the color
		};

		titlePane.find('#backgroundcolor-cell').addEventListener('change', (event) => {
			const backgroundColor = titlePane.find('#backgroundcolor-cell').value;
			draftDom.find('.crater-datelist-title').css({ backgroundColor });
			titlePane.find('#backgroundcolor-cell').setAttribute('value', backgroundColor);
		});

		titlePane.find('#color-cell').onchange = () => {
			const color = titlePane.find('#color-cell').value;
			draftDom.find('.crater-datelist-title').css({ color });
			titlePane.find('#color-cell').setAttribute('value', color);
		};

		titlePane.find('#icon-cell').checkChanges(() => {
			draftDom.find('.crater-datelist-title-imgIcon').removeClasses(draftDom.find('.crater-datelist-title-imgIcon').dataset.icon);
			draftDom.find('.crater-datelist-title-imgIcon').addClasses(titlePane.find('#icon-cell').dataset.icon);
			draftDom.find('.crater-datelist-title-imgIcon').dataset.icon = titlePane.find('#icon-cell').dataset.icon;
		});

		titlePane.find('#title-cell').onChanged(value => {
			draftDom.find('.crater-datelist-title-captionTitle').innerHTML = value;
		});


		titlePane.find('#fontsize-cell').onChanged(value => {
			draftDom.find('.crater-datelist-title').css({ fontSize: value });
		});

		titlePane.find('#height-cell').onChanged(value => {
			draftDom.find('.crater-datelist-title').css({ height: value });
		});

		dateListTitleRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		dateListTitleRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		dateListSubtitleRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		dateListSubtitleRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		dateListBodyRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		dateListBodyRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		dateListDateRowPane.find('#daySize-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-date-day').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		dateListDateRowPane.find('#monthSize-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-date-month').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		dateListDateRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		//appends the dom and pane prototypes to the dom and pane when you click add new
		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newDateRowDom = dateListRowDomPrototype.cloneNode(true);
			let newDateRowPane = dateListRowPanePrototype.cloneNode(true);

			dateList.append(newDateRowDom);//c
			this.paneContent.find('.datelist-pane').append(newDateRowPane);
			dateRowHandler(newDateRowPane, newDateRowDom);
		});

		let paneItems = this.paneContent.findAll('.crater-datelist-item-pane');
		paneItems.forEach((dateRow, position) => {
			dateRowHandler(dateRow, dateListRow[position]);
		});

		let linkCell = this.paneContent.querySelector('.datelist-link-row-pane').querySelector('#link-options-cell');
		linkCell.value = settings['linkOption'];
		linkCell.onchange = () => {
			settingsClone['linkOption'] = linkCell.value;
		};

		let vAlignCell = this.paneContent.querySelector('.datelist-background-row-pane').querySelector('#title-vertical-alignment-cell');
		vAlignCell.onchange = () => {
			switch (vAlignCell.value.toLowerCase()) {
				case 'top':
					draftDom.querySelectorAll('.crater-datelist-content-item-text-box').forEach(titleBox => {
						titleBox.css({
							gridRowStart: 1,
							gridColumnStart: 1
						});
					});
					break;
				case 'bottom':
					draftDom.querySelectorAll('.crater-datelist-content-item-text-box').forEach(titleBox => {
						titleBox.css({
							gridRowStart: 2,
							gridColumnStart: 1
						});
					});
					break;
			}
		};

		this.paneContent.find('#View-cell').value = settings.view;

		this.paneContent.find('#View-cell').onchange = () => {
			settingsClone.view = this.paneContent.find('#View-cell').value;
		};

		let showSeparator = this.paneContent.find('.datelist-background-row-pane').find('#separator-cell');
		showSeparator.addEventListener('change', e => {
			switch (showSeparator.value.toLowerCase()) {
				case "show separator":
					draftDom.findAll('.crater-datelist-content-item').forEach(element => {
						element.style.borderBottom = "1px solid lightgray";
					});
					break;
				case "hide separator":
					draftDom.findAll('.crater-datelist-content-item').forEach(element => {
						element.style.borderBottom = "none";
					});
					break;
			}
		});

		let dateStyle = this.paneContent.querySelector('.datelist-background-row-pane').find('#date-style-cell');
		dateStyle.addEventListener('change', e => {
			switch (dateStyle.value.toLowerCase()) {
				case "plain":
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.classList.remove('before-stuff');
						element.querySelector('.crater-datelist-content-item-date-day').style.color = 'rgb(182, 127, 136)';
						element.querySelector('.crater-datelist-content-item-date-month').style.color = 'rgb(98, 165, 165)';
						element.style.backgroundColor = "unset";
					});
					break;
				case "minibar":
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.classList.add('before-stuff');
						element.querySelectorAll('.crater-datelist-content-item-date-day').forEach(dateDiv => {
							dateDiv.style.color = 'rgb(182, 127, 136)';
						});
						element.querySelectorAll('.crater-datelist-content-item-date-month').forEach(monthDiv => {
							monthDiv.style.color = 'rgb(98, 165, 165)';
						});
						element.querySelector('.crater-datelist-slash').style.color = 'gray';
						element.style.backgroundColor = "unset";
					});
					break;
				case "fullbar":
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.classList.remove('before-stuff');
						element.querySelectorAll('.crater-datelist-content-item-date-day').forEach(dateDiv => {
							dateDiv.style.color = '#fff';
						});
						element.querySelectorAll('.crater-datelist-content-item-date-month').forEach(monthDiv => {
							monthDiv.style.color = '#fff';
						});

						element.querySelector('.crater-datelist-slash').style.color = '#fff';
						element.style.backgroundColor = "gray";
					});
					break;
			}
		});

		let dateLocation = this.paneContent.querySelector('.datelist-background-row-pane').find('#date-location-cell');
		dateLocation.addEventListener('change', e => {
			dateLocation.value = dateLocation.value;
			switch (dateLocation.value.toLowerCase()) {
				case "left":
					draftDom.findAll('.crater-datelist-content-item-text').forEach(element => {
						element.css({ gridColumnStart: 2, gridRowStart: 1 });
					});
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.css({ gridColumnStart: 1, gridRowStart: 1 });
					});
					draftDom.querySelectorAll('.crater-datelist-content-item').forEach(element => {
						element.style.gridTemplateColumns = 'min-content auto';
					});
					break;
				case "right":
					draftDom.findAll('.crater-datelist-content-item-text').forEach(element => {
						element.css({ gridColumnStart: 1, gridRowStart: 1 });
					});
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.css({ gridColumnStart: 2, gridRowStart: 1 });
					});
					draftDom.querySelectorAll('.crater-datelist-content-item').forEach(element => {
						element.style.gridTemplateColumns = 'auto min-content';
					});
					break;
			}
		});

		let alignText = dateListTitleRowPane.find('#align-cell');
		alignText.addEventListener('change', e => {
			switch (alignText.value.toLowerCase()) {
				case "left":
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.textAlign = "left";
					});
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.textAlign = "left";
					});
					break;
				case "center":
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.textAlign = "center";
					});
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.textAlign = "center";
					});
					break;
				case "right":
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.textAlign = "right";
					});
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.textAlign = "right";
					});
					break;
			}
		});

		let showHeader = titlePane.find('#toggleTitle-cell');
		showHeader.addEventListener('change', e => {
			switch (showHeader.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-datelist-title').forEach(element => {
						element.style.display = "none";
					});
					break;
				case "show":
					draftDom.findAll('.crater-datelist-title').forEach(element => {
						element.style.display = "grid";
					});
					break;
				default:
					draftDom.findAll('.crater-datelist-title').forEach(element => {
						element.style.display = "none";
					});
			}
		});

		let showTitle = dateListTitleRowPane.find('#toggleTitle-cell');
		showTitle.addEventListener('change', e => {
			switch (showTitle.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.display = "none";
					});
					break;
				case "show":
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.display = "block";
					});
					break;
				default:
					draftDom.findAll('.crater-datelist-content-item-text-main').forEach(element => {
						element.style.display = "none";
					});
			}
		});

		let showSubtitle = dateListSubtitleRowPane.find('#toggleSubtitle-cell');
		showSubtitle.addEventListener('change', e => {
			switch (showSubtitle.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.display = "none";
					});
					break;
				case "show":
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.display = "block";
					});
					break;
				default:
					draftDom.findAll('.crater-datelist-content-item-text-subtitle').forEach(element => {
						element.style.display = "none";
					});
			}
		});

		let showBody = dateListBodyRowPane.find('#toggleBody-cell');
		showBody.addEventListener('change', e => {

			switch (showBody.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
						element.style.display = "none";
					});
					break;
				case "show":
					draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
						element.style.display = "block";
					});
					break;
				default:
					draftDom.findAll('.crater-datelist-content-item-text-body').forEach(element => {
						element.style.display = "none";
					});
			}
		});

		let showDate = dateListDateRowPane.find('#toggleDate-cell');
		showDate.addEventListener('change', e => {
			switch (showDate.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.style.visibility = "hidden";
					});
					break;
				case "show":
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.style.visibility = "visible";
					});
					break;
				default:
					draftDom.findAll('.crater-datelist-content-item-date').forEach(element => {
						element.style.visibility = "hidden";
					});
			}
		});



		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;//upate the webpart
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;


			this.sharePoint.saveSettings(this.element, settings, settingsClone);
		});
	}

	public update(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);
		const settings = JSON.parse(params.element.dataset.settings);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				startdate: { element: 'select', attributes: { id: 'meta-data-startdate', name: 'Startdate' }, options: params.options },
				enddate: { element: 'select', attributes: { id: 'meta-data-enddate', name: 'Enddate' }, options: params.options },
				title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options: params.options },
				subtitle: { element: 'select', attributes: { id: 'meta-data-subtitle', name: 'Subtitle' }, options: params.options },
				body: { element: 'select', attributes: { id: 'meta-data-body', name: 'Body' }, options: params.options }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		let data: any = {};
		let source: any;
		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			data.startdate = updateWindow.find('#meta-data-startdate').value;
			data.enddate = updateWindow.find('#meta-data-enddate').value;
			data.title = updateWindow.find('#meta-data-title').value;
			data.subtitle = updateWindow.find('#meta-data-subtitle').value;
			data.body = updateWindow.find('#meta-data-body').value;
			source = this.func.extractFromJsonArray(data, params.source);

			let newContent = this.render({ source });
			draftDom.find('.crater-datelist-content').innerHTML = newContent.find('.crater-datelist-content').innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = draftDom.outerHTML;
			this.paneContent.find('.datelist-pane').innerHTML = this.generatePaneContent({ list: newContent.findAll('.crater-datelist-content-item') }).innerHTML;
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

export { DateList };