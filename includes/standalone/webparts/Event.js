import { ElementModifier } from './../ElementModifier';

export class Event extends ElementModifier {
	public element;
	public key;
	public paneContent;
	public today: any;
	public month: any;
	public day: any;
	public monthArray: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		this.today = this.func.today();
		this.month = this.func.isMonthValid(this.today);
		this.day = this.func.isDayValid(this.today);

		if (!this.func.isset(params.source)) {
			params.source = [
				{
					icon: 'https://img.icons8.com/pastel-glyph/64/000000/christmas-tree.png',
					title: "BasketBall Game",
					location: "Lagos Island, Lagos",
					startdate: '12/05/2020T00:00',
					enddate: '12/05/2020T01:00',
					link: 'https://www.nairaland.com'
				},
				{
					icon: 'https://img.icons8.com/cute-clipart/64/000000/shoes.png',
					title: "Shoe City Event",
					location: "Ikeja, Lagos",
					startdate: '10/28/2020T13:00',
					enddate: '10/28/2020T14:00',
					link: 'https://www.sharepoint.com'
				},
				{
					icon: 'https://img.icons8.com/cotton/64/000000/football-ball.png',
					title: "Football Game",
					location: "Teslim Balogun Statdium, Lagos",
					startdate: '01/21/2020T14:00',
					enddate: '01/21/2020T14:00',
					link: 'https://www.youtube.com'
				}
			];
		}

		let event = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-event', 'data-type': 'event' }, children: [
				{
					element: 'div', attributes: { id: 'crater-event-title', class: 'crater-event-title' }, children: [
						{ element: 'i', attributes: { class: 'crater-event-title-imgIcon', 'data-icon': this.sharePoint.icons.play } },
						{ element: 'span', attributes: { class: 'crater-event-title-captionTitle' }, text: 'Events' }
					]
				},
				{
					element: 'div', attributes: { id: 'crater-event-container', class: 'crater-event-container' }, children: [
						{
							element: 'div', attributes: { class: 'crater-event-container-header' }, children: [
								{ element: 'p', attributes: { id: 'header-day' }, text: this.func.days[new Date().getDay()] },
								{ element: 'p', attributes: { id: 'header-full-date' }, text: `${new Date().getDate()} ${this.func.months[new Date().getMonth()]} ${new Date().getFullYear()}` },
							]
						},
						{ element: 'div', attributes: { id: 'crater-event-content', class: 'crater-event-content' } }
					]
				},
			]
		});

		let content = event.find(`.crater-event-content`);
		let locationElement = content.findAll('.crater-event-content-task-location') as any;

		for (let each of params.source) {
			content.makeElement(
				{
					element: 'div', attributes: { id: 'single-crater-event', class: 'single-crater-event', 'data-event-date': each.startdate }, children: [
						this.createElement({
							element: 'div', attributes: { id: 'crater-event-header', class: 'crater-event-header' }, children: [
								{ element: 'p', attributes: { class: 'date-group' }, text: `${(new Date(each.startdate.split('T')[0]).getDate())} ${this.monthArray[(new Date(each.startdate.split('T')[0]).getMonth())]}` }
							]
						}),
						this.createElement({
							element: 'div', attributes: { id: 'crater-event-content-item', class: 'crater-event-content-item' }, children: [
								this.createElement({
									element: 'div', attributes: { class: 'crater-event-content-item-icon' }, children: [
										this.createElement({ element: 'i', attributes: { class: 'crater-event-content-item-icon-image', id: 'icon', 'data-icon': this.sharePoint.icons.asterisk } })
									]
								}),
								this.createElement({
									element: 'div', attributes: { id: 'crater-event-content-task', class: 'crater-event-content-task' }, children: [
										{
											element: 'div', attributes: { id: 'crater-event-content-task-div', class: 'crater-event-content-task-div' }, children: [
												{ element: 'i', attributes: { class: 'crater-event-content-task-caption-img', 'data-icon': this.sharePoint.icons.asterisk } },
												{ element: 'span', attributes: { class: 'crater-event-content-task-caption', id: 'eventTask', 'data-href': each.link }, text: each.title },
											]
										},
										{
											element: 'div', attributes: { id: 'crater-event-content-task-location', class: 'crater-event-content-task-location' }, children: [
												{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.hourglass } },
												{ element: 'span', attributes: { class: 'crater-event-content-task-location-duration', id: 'startTime' }, text: `${each.startdate.split('T')[1]} - ` },
												{ element: 'span', attributes: { class: 'crater-event-content-task-location-duration', id: 'endTime' }, text: `${each.enddate.split('T')[1]}` },
												{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.compass } },
												{ element: 'span', attributes: { class: 'crater-event-content-task-location-place', id: 'location' }, text: `${each.location}` }
											]
										}
									]
								}),
								{
									element: 'div', attributes: { id: 'crater-event-content-item-date', class: 'crater-event-content-item-date' }, children: [
										{
											element: 'div', attributes: { class: 'crater-event-content-item-date-day', id: 'Day' }, text: (new Date(each.startdate.split('T')[0])).getDate()
										},
										{ element: 'div', attributes: { class: 'crater-event-content-item-date-month', id: 'Month' }, text: this.monthArray[((new Date(each.startdate.split('T')[0])).getMonth())].toUpperCase() }
									]
								}
							]
						})
					]
				}
			);
		}

		const settings = { eventStyle: 'Style 1', showToday: 'False', groupByDay: 'False', iconStyle: 'Style 1', view: 'Pop Up' };
		this.sharePoint.saveSettings(event, settings);

		return event;
	}

	public rendered(params) {
		this.element = params.element;
		const settings = JSON.parse(params.element.dataset.settings);
		this.key = params.element.dataset.key;
		this.element.querySelector('#header-day').textContent = this.func.days[new Date().getDay()];
		this.element.querySelector('#header-full-date').textContent = `${new Date().getDate()} ${this.func.months[new Date().getMonth()]} ${new Date().getFullYear()}`;
		this.sortFunction();
		this.element.querySelectorAll('.crater-event-content-item').forEach(box => {
			box.addEventListener('click', e => {
				const targetClass = (e.target.parentElement.parentElement.classList.contains('crater-event-content-item')) ? e.target.parentElement.parentElement.querySelector('.crater-event-content-task-caption').getAttribute('data-href') : (e.target.parentElement.classList.contains('crater-event-content-item')) ? e.target.parentElement.querySelector('.crater-event-content-task-caption').getAttribute('data-href') : e.target.parentElement.parentElement.querySelector('.crater-event-content-task-caption').getAttribute('data-href');
				if (settings['view'].toLowerCase() == 'pop up') {
					let popUp = this.popUp({ source: targetClass, close: this.sharePoint.images.close, maximize: this.sharePoint.images.maximize, minimize: this.sharePoint.images.minimize });
					this.element.append(popUp);
				}
				else if (settings['view'].toLowerCase() == 'new window') {
					window.open(targetClass);
				}
				else {
					window.open(targetClass, '_self');
				}
			});
		});
	}

	public sortFunction() {
		const sortRows = Array['from'](this.element.querySelectorAll('.single-crater-event'));
		let html: string = '';
		sortRows.sort((a, b) => {
			return (new Date(a.dataset.eventDate.split('T')[0]) < new Date(b.dataset.eventDate.split('T')[0])) ? -1 : (new Date(b.dataset.eventDate.split('T')[0]) < new Date(a.dataset.eventDate.split('T')[0])) ? 1 : 0;
		});
		sortRows.map(row => html += row.outerHTML);
		this.element.querySelector('.crater-event-content').innerHTML = html;
		sortRows.length = 0;
	}

	public setUpPaneContent(params) {
		this.element = params.element;//define the declared element to the draft dom content
		this.key = params.element.dataset['key'];//create a key variable and set it to the webpart key
		const settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor(); //monitor the content pane 
		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content !== '') {//check if draft pane content is not empty and set it to the pane content
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content !== '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		} else {
			let eventList = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-event-content');
			let dateListRows = eventList.findAll('.crater-event-content-item');
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
							{ element: 'h2', attributes: { class: 'title' }, text: 'Event Title Layout' }
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [//create the cells for changing crater event title
							this.cell({
								element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.find('.crater-event-title-imgIcon').dataset.icon }
							}),
							this.cell({
								element: 'input', name: 'title', value: this.element.find('.crater-event-title').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-title').css()['background-color'], list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-title').css().color, list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('.crater-event-title').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.find('.crater-event-title').css()['height'] || ''
							}),
							this.cell({
								element: 'select', name: 'toggleTitle', options: ['show', 'hide']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-icon-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Event Icon'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'iconWidth', value: this.element.find('.crater-event-content-item-icon-image').css()['width']
							}),
							this.cell({
								element: 'input', name: 'iconHeight', value: this.element.find('.crater-event-content-item-icon-image').css()['height']
							}),
							this.cell({
								element: 'select', name: 'toggleIcon', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Event Settings'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'event-style', options: ['Style 1', 'Style 2']
							}),
							this.cell({
								element: 'input', name: 'left-border-color', dataAttributes: { type: 'color' }, list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'group-by-day', options: ['True', 'False']
							}),
							this.cell({
								element: 'select', name: 'show-today', options: ['True', 'False']
							}),
							this.cell({
								element: 'select', name: 'icon-style', options: ['Style 1', 'Style 2']
							}),
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-content-item').css()['background-color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-title-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Event Title'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-event-content-task-caption').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-event-content-task-caption').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'eventColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-content-task-caption').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleTitle', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-location-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Event Location'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-event-content-task-location-place').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-event-content-task-location-place').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'locationColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-content-task-location-place').css().color, list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleLocation', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-duration-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Event Duration'
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontSize', value: this.element.find('.crater-event-content-task-location-duration').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-event-content-task-location-duration').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'durationColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-content-task-location-duration').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleDuration', options: ['show', 'hide']
							})
						]
					}
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'event-date-row-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Event Date '
							})
						]
					}),
					{
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'daySize', value: this.element.find('.crater-event-content-item-date-day').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'monthSize', value: this.element.find('.crater-event-content-item-date-month').css()['font-size']
							}),
							this.cell({
								element: 'input', name: 'fontFamily', value: this.element.find('.crater-event-content-item-date').css()['font-family']
							}),
							this.cell({
								element: 'input', name: 'dateColor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-event-content-item-date').css()['color'], list: this.func.colors
							}),
							this.cell({
								element: 'select', name: 'toggleDate', options: ['show', 'hide']
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
		let eventListPane = this.createElement({
			element: 'div', attributes: { class: 'card list-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Events List'
						})
					]
				}),
			]
		});

		let strip = (value) => {
			return value.split(' ');
		};
		let cTime = strip(this.element.find('#startTime').textContent)[0];
		let dTime = this.element.find('#endTime').textContent;

		for (let i = 0; i < params.list.length; i++) {
			eventListPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-event-item-pane row' },
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'single-crater-event' }),
					this.cell({
						element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': params.list[i].find('#icon').dataset.icon }
					}),
					this.cell({
						element: 'input', name: 'icon-color', dataAttributes: { type: 'color' }, value: params.list[i].querySelector('.crater-event-content-item-icon-image').css()['color'], list: this.func.colors
					}),
					this.cell({
						element: 'span', name: 'Task', edit: 'change-text', attributes: { class: 'taskValue' }, value: params.list[i].find('#eventTask').textContent
					}),
					this.cell({
						element: 'span', name: 'Location', edit: 'change-text', attributes: { class: 'locationValue' }, value: params.list[i].find('#location').textContent
					}),
					this.cell({
						element: 'input', name: 'StartDate', dataAttributes: { type: 'datetime-local' }, value: ''
					}),
					this.cell({
						element: 'input', name: 'EndDate', dataAttributes: { type: 'datetime-local' }, value: ''
					}),
					this.cell({
						element: 'input', name: 'left-border-color', dataAttributes: { type: 'color' }, list: this.func.colors
					}),
					this.cell({
						element: 'input', name: 'url', value: params.list[i].find('.crater-event-content-task-caption').getAttribute('data-href')
					})
				]
			});
		}

		return eventListPane;

	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		const settings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		//get the content and all the events
		let eventList = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-event-content');
		let eventListRow = eventList.findAll('.single-crater-event');

		let eventListRowDomPrototype = this.createElement({
			element: 'div', attributes: { id: 'single-crater-event', class: 'single-crater-event', 'data-event-date': '12/05/2020T00:00', }, children: [
				this.createElement({
					element: 'div', attributes: { id: 'crater-event-header', class: 'crater-event-header' }, children: [
						{ element: 'p', attributes: { class: 'date-group' }, text: `${(new Date(2020, 12, 5, 9).getDate())} ${this.monthArray[(new Date(2020, 12, 5, 9).getMonth())]}` }
					]
				}),
				this.createElement({
					element: 'div', attributes: { id: 'crater-event-content-item', class: 'crater-event-content-item' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'crater-event-content-item-icon' }, children: [
								this.createElement({ element: 'i', attributes: { class: 'crater-event-content-item-icon-image', id: 'icon', 'data-icon': this.sharePoint.icons.asterisk } })
							]
						}),
						this.createElement({
							element: 'div', attributes: { id: 'crater-event-content-task', class: 'crater-event-content-task' }, children: [
								{
									element: 'div', attributes: { id: 'crater-event-content-task-div', class: 'crater-event-content-task-div' }, children: [
										{ element: 'i', attributes: { class: 'crater-event-content-task-caption-img', 'data-icon': this.sharePoint.icons.asterisk } },
										{ element: 'p', attributes: { class: 'crater-event-content-task-caption', id: 'eventTask', 'data-href': 'https://www.youtube.com' }, text: 'New Task' },
									]
								},
								{
									element: 'div', attributes: { id: 'crater-event-content-task-location', class: 'crater-event-content-task-location' }, children: [
										{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.hourglass } },
										{ element: 'span', attributes: { class: 'crater-event-content-task-location-duration', id: 'startTime' }, text: `` },
										{ element: 'span', attributes: { class: 'crater-event-content-task-location-duration', id: 'endTime' }, text: `` },
										{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.compass } },
										{ element: 'span', attributes: { class: 'crater-event-content-task-location-place', id: 'location' }, text: 'Lagos, Nigeria' }
									]
								}
							]
						}),
						{
							element: 'div', attributes: { id: 'crater-event-content-item-date', class: 'crater-event-content-item-date' }, children: [
								{
									element: 'div', attributes: { class: 'crater-event-content-item-date-day', id: 'Day' }, text: ''
								},
								{ element: 'div', attributes: { class: 'crater-event-content-item-date-month', id: 'Month' }, text: '' }
							]
						}
					]
				})
			]
		});

		let eventListRowPanePrototype = this.createElement({//create a row on the property pane
			element: 'div',
			attributes: {
				class: 'crater-event-item-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'single-crater-event' }),
				this.cell({
					element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': eventListRowDomPrototype.querySelector('.crater-event-content-item-icon-image').dataset.icon }
				}),
				this.cell({
					element: 'input', name: 'icon-color', dataAttributes: { type: 'color' }, value: '', list: this.func.colors
				}),
				this.cell({
					element: 'span', name: 'Task', edit: 'change-text', value: eventListRowDomPrototype.querySelector('#eventTask').textContent
				}),
				this.cell({
					element: 'span', name: 'Location', edit: 'change-text', value: eventListRowDomPrototype.querySelector('#location').textContent
				}),
				this.cell({
					element: 'input', name: 'StartDate', dataAttributes: { type: 'datetime-local' }, value: ''
				}),
				this.cell({
					element: 'input', name: 'EndDate', dataAttributes: { type: 'datetime-local' }, value: ''
				}),
				this.cell({
					element: 'input', name: 'left-border-color', dataAttributes: { type: 'color' }, list: this.func.colors
				}),
				this.cell({
					element: 'input', name: 'url', value: eventListRowDomPrototype.querySelector('#eventTask').dataset.href
				})
			]
		});

		let eventRowHandler = (eventRowPane, eventRowDom) => {
			eventRowPane.addEventListener('mouseover', event => {
				eventRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			eventRowPane.addEventListener('mouseout', event => {
				eventRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			eventRowPane.find('#icon-cell').checkChanges(() => {
				eventRowDom.find('.crater-event-content-item-icon-image').removeClasses(eventRowDom.find('.crater-event-content-item-icon-image').dataset.icon);
				eventRowDom.find('.crater-event-content-item-icon-image').addClasses(eventRowPane.find('#icon-cell').dataset.icon);
				eventRowDom.find('.crater-event-content-item-icon-image').dataset.icon = eventRowPane.find('#icon-cell').dataset.icon;

				eventRowDom.find('.crater-event-content-task-caption-img').removeClasses(eventRowDom.find('.crater-event-content-task-caption-img').dataset.icon);
				eventRowDom.find('.crater-event-content-task-caption-img').addClasses(eventRowPane.find('#icon-cell').dataset.icon);
				eventRowDom.find('.crater-event-content-task-caption-img').dataset.icon = eventRowPane.find('#icon-cell').dataset.icon;
			});

			eventRowPane.querySelector('#icon-color-cell').onchange = () => {
				eventRowDom.querySelector('.crater-event-content-item-icon-image').style.color = eventRowPane.querySelector('#icon-color-cell').value;
				eventRowDom.querySelector('.crater-event-content-task-caption-img').style.color = eventRowPane.querySelector('#icon-color-cell').value;
				eventRowPane.querySelector('#icon-color-cell').setAttribute('value', eventRowPane.querySelector('#icon-color-cell').value);
			};

			eventRowPane.querySelector('#Task-cell').checkChanges(() => {
				eventRowDom.querySelector('.crater-event-content-task-caption').copy(eventRowPane.querySelector('#Task-cell'));
			});

			eventRowPane.querySelector('#Location-cell').checkChanges(() => {
				eventRowDom.querySelector('.crater-event-content-task-location-place').copy(eventRowPane.querySelector('#Location-cell'));
			});

			eventRowPane.find('#StartDate-cell').onChanged(value => {
				eventRowDom.setAttribute('data-event-date', value);
				eventRowDom.querySelector('.date-group').textContent = `${(new Date(value).getDate())} ${this.monthArray[(new Date(value).getMonth())]}`;
				eventRowDom.find('.crater-event-content-item-date-day').innerHTML = (new Date(value)).getDate();
				eventRowDom.find('.crater-event-content-item-date-month').innerHTML = this.monthArray[(new Date(value)).getMonth()].toUpperCase();
				eventRowDom.find('#startTime').innerHTML = value.split('T')[1] + ` - `;
				if (settings['groupByDay'].toLowerCase() === 'true') {
					eventRowDom.find('.crater-event-content-item-date-day').innerHTML = value.split('T')[1];
				}
			});

			eventRowPane.find('#EndDate-cell').onChanged(value => {
				eventRowDom.find('#endTime').innerHTML = value.split('T')[1];
				if (settings['groupByDay'].toLowerCase() === 'true') {
					eventRowDom.find('.crater-event-content-item-date-month').innerHTML = value.split('T')[1];
				}
			});

			eventRowPane.find('#left-border-color-cell').onchange = () => {
				if (settings['eventStyle'] === 'Style 1') {
					eventRowDom.css({ borderLeft: `3px solid ${eventRowPane.find('#left-border-color-cell').value}` });//get the color of the event font in the draftDom
				}
				eventRowPane.find('#left-border-color-cell').setAttribute('value', eventRowPane.find('#left-border-color-cell').value);
			};

			eventRowPane.find('#url-cell').onChanged(value => {
				eventRowDom.find('.crater-event-content-task-caption').setAttribute('data-href', value);
			});

			eventRowPane.find('.delete-single-crater-event').addEventListener('click', event => {
				eventRowDom.remove();
				eventRowPane.remove();
			});

			eventRowPane.find('.add-before-single-crater-event').addEventListener('click', event => {
				let newEventRowDom = eventListRowDomPrototype.cloneNode(true);
				let neweventRowPane = eventListRowPanePrototype.cloneNode(true);

				eventRowDom.before(newEventRowDom);
				eventRowPane.before(neweventRowPane);
				eventRowHandler(neweventRowPane, newEventRowDom);
			});

			eventRowPane.find('.add-after-single-crater-event').addEventListener('click', event => {
				let newEventRowDom = eventListRowDomPrototype.cloneNode(true);
				let newEventRowPane = eventListRowPanePrototype.cloneNode(true);

				eventRowDom.after(newEventRowDom);
				eventRowPane.after(newEventRowPane);

				eventRowHandler(newEventRowPane, newEventRowDom);
			});
		};

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		let titlePane = this.paneContent.find('.title-pane');
		let eventIconRowPane = this.paneContent.find('.event-icon-row-pane');
		let eventTitleRowPane = this.paneContent.find('.event-title-row-pane');
		let eventLocationRowPane = this.paneContent.find('.event-location-row-pane');
		let eventDurationRowPane = this.paneContent.find('.event-duration-row-pane');
		let eventDateRowPane = this.paneContent.find('.event-date-row-pane');
		let eventSettingsPane = this.paneContent.find('.event-settings-pane');

		const eventStyleCell = eventSettingsPane.querySelector('#event-style-cell');
		eventStyleCell.value = settings['eventStyle'];
		eventStyleCell.onchange = () => {
			settingsClone['eventStyle'] = eventStyleCell.value;
			switch (eventStyleCell.value.toLowerCase()) {
				case 'style 1':
					draftDom.querySelectorAll('.crater-event-content-item').forEach(eventItem => {
						eventItem.style.border = 'none';
						eventItem.style.borderTop = '1px solid lightgray';
						eventItem.style.borderLeft = '3px solid turquoise';
					});
					break;

				case 'style 2':
					draftDom.querySelectorAll('.crater-event-content-item').forEach(eventItem => {
						eventItem.style.borderLeft = 'unset';
						eventItem.style.border = '1px solid lightgray';
						eventItem.style.borderTop = 'unset';
					});
					break;
			}
		};

		const showToday = eventSettingsPane.querySelector('#show-today-cell');
		showToday.value = settings['showToday'];
		showToday.onchange = () => {
			settingsClone['showToday'] = showToday.value;
			switch (showToday.value.toLowerCase()) {
				case 'true':
					draftDom.querySelector('.crater-event-container-header').style.display = 'block';
					break;

				case 'false':
					draftDom.querySelector('.crater-event-container-header').style.display = 'none';
					break;
			}
		};

		const groupByDay = eventSettingsPane.querySelector('#group-by-day-cell');
		groupByDay.value = settings['groupByDay'];
		groupByDay.onchange = () => {
			settingsClone['groupByDay'] = groupByDay.value;
			switch (groupByDay.value.toLowerCase()) {
				case 'true':
					settingsClone.dates = [];
					draftDom.querySelectorAll('.crater-event-content-item-date-day').forEach(dayBlock => {
						settingsClone.dates.push({
							day: dayBlock.textContent,
							month: dayBlock.nextElementSibling.textContent
						});
						dayBlock.textContent = draftDom.querySelector('#startTime').textContent.split('-')[0];
						dayBlock.style.fontSize = '.9em';
					});
					draftDom.querySelectorAll('.crater-event-content-item-date-month').forEach(monthBlock => {
						monthBlock.textContent = draftDom.querySelector('#endTime').textContent;
						monthBlock.style.fontSize = '.9em';
					});
					draftDom.querySelectorAll('.crater-event-content-task-location-duration').forEach(duration => {
						duration.previousSibling.style.display = 'none';
						duration.style.display = 'none';
					});
					draftDom.querySelectorAll('.crater-event-header').forEach(header => {
						header.style.display = 'block';
					});
					break;

				case 'false':
					settingsClone.dates = [];
					draftDom.querySelectorAll('.crater-event-content-item-date-day').forEach((dayBlock, position) => {
						settingsClone.dates.push({
							day: dayBlock.textContent,
							month: dayBlock.nextElementSibling.textContent
						});
						dayBlock.textContent = settingsClone.dates[position].day;
						dayBlock.style.fontSize = '1.2em';
					});
					draftDom.querySelectorAll('.crater-event-content-item-date-month').forEach((monthBlock, position) => {
						monthBlock.textContent = settingsClone.dates[position].month;
						monthBlock.style.fontSize = '.6em';
					});
					draftDom.querySelectorAll('.crater-event-content-task-location-duration').forEach(duration => {
						duration.previousSibling.style.display = 'inline-block';
						duration.style.display = 'inline-block';
					});
					draftDom.querySelectorAll('.crater-event-header').forEach(header => {
						header.style.display = 'none';
					});
					break;
			}
		};

		const iconStyleCell = eventSettingsPane.querySelector('#icon-style-cell');
		iconStyleCell.value = settings['iconStyle'];
		iconStyleCell.onchange = () => {
			settingsClone['iconStyle'] = iconStyleCell.value;
			switch (iconStyleCell.value.toLowerCase()) {
				case 'style 1':
					draftDom.querySelectorAll('.crater-event-content-task-caption-img').forEach(eventItem => {
						eventItem.style.display = 'none';
					});
					draftDom.querySelectorAll('.crater-event-content-item-icon-image').forEach(eventItem => {
						eventItem.style.display = 'block';
					});
					break;

				case 'style 2':
					draftDom.querySelectorAll('.crater-event-content-task-caption-img').forEach(eventItem => {
						eventItem.style.display = 'flex';
					});
					draftDom.querySelectorAll('.crater-event-content-item-icon-image').forEach(eventItem => {
						eventItem.style.display = 'none';
					});
					break;
			}
		};

		eventSettingsPane.find('#left-border-color-cell').onchange = () => {
			if (settings['eventStyle'] === 'Style 1') {
				draftDom.findAll('.crater-event-content-item').forEach(element => {
					element.css({ borderLeft: `3px solid ${eventSettingsPane.find('#left-border-color-cell').value}` });//get the color of the event font in the draftDom
				});
			}
			eventSettingsPane.find('#left-border-color-cell').setAttribute('value', eventSettingsPane.find('#left-border-color-cell').value); //set the value of the eventColor cell in the pane to the color
		};

		eventTitleRowPane.find('#eventColor-cell').onchange = () => {
			draftDom.findAll('.crater-event-content-task-caption').forEach(element => {
				element.css({ color: eventTitleRowPane.find('#eventColor-cell').value });//get the color of the event font in the draftDom
			});
			eventTitleRowPane.find('#eventColor-cell').setAttribute('value', eventTitleRowPane.find('#eventColor-cell').value); //set the value of the eventColor cell in the pane to the color
		};

		eventSettingsPane.find('#background-color-cell').onchange = () => {
			draftDom.findAll('.crater-event-content-item').forEach(element => {
				element.css({ backgroundColor: eventSettingsPane.find('#background-color-cell').value });//get the color of the event font in the draftDom
			});
			eventSettingsPane.find('#background-color-cell').setAttribute('value', eventSettingsPane.find('#background-color-cell').value); //set the value of the eventColor cell in the pane to the color
		};

		eventDateRowPane.find('#dateColor-cell').onchange = () => {
			draftDom.findAll('.crater-event-content-item-date').forEach(element => {
				element.css({ color: eventDateRowPane.find('#dateColor-cell').value });//get the color of the event font in the draftDom
			});
			eventDateRowPane.find('#dateColor-cell').setAttribute('value', eventDateRowPane.find('#dateColor-cell').value); //set the value of the eventColor cell in the pane to the color
		};


		eventLocationRowPane.find('#locationColor-cell').onchange = () => {
			draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
				element.css({ color: eventLocationRowPane.find('#locationColor-cell').value });//get the color of the event font in the draftDom
			});
			eventLocationRowPane.find('#locationColor-cell').setAttribute('value', eventLocationRowPane.find('#locationColor-cell').value); //set the value of the eventColor cell in the pane to the color
		};

		eventDurationRowPane.find('#durationColor-cell').onchange = () => {
			draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
				element.css({ color: eventDurationRowPane.find('#durationColor-cell').value });//get the color of the event font in the draftDom
			});
			eventDurationRowPane.find('#durationColor-cell').setAttribute('value', eventDurationRowPane.find('#durationColor-cell').value); //set the value of the eventColor cell in the pane to the color
		};

		titlePane.find('#icon-cell').checkChanges(() => {
			draftDom.find('.crater-event-title-imgIcon').removeClasses(draftDom.find('.crater-event-title-imgIcon').dataset.icon);
			draftDom.find('.crater-event-title-imgIcon').addClasses(titlePane.find('#icon-cell').dataset.icon);
			draftDom.find('.crater-event-title-imgIcon').dataset.icon = titlePane.find('#icon-cell').dataset.icon;
		});

		titlePane.find('#title-cell').onChanged(value => {
			draftDom.find('.crater-event-title-captionTitle').innerHTML = value;
		});

		titlePane.find('#backgroundcolor-cell').onchange = () => {
			draftDom.find('.crater-event-title').css({ backgroundColor: titlePane.find('#backgroundcolor-cell').value });
			titlePane.find('#backgroundcolor-cell').setAttribute('value', titlePane.find('#backgroundcolor-cell').value);
		};

		titlePane.find('#color-cell').onchange = () => {
			draftDom.find('.crater-event-title').css({ color: titlePane.find('#color-cell').value });
			titlePane.find('#color-cell').setAttribute('value', titlePane.find('#color-cell').value);
		};

		titlePane.find('#fontsize-cell').onChanged(value => {
			draftDom.find('.crater-event-title').css({ fontSize: value });
		});

		titlePane.find('#height-cell').onChanged(value => {
			draftDom.find('.crater-event-title').css({ height: value });
		});

		eventIconRowPane.find('#iconWidth-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-item-icon-image').forEach(element => {
				element.css({ width: value });
			});
		});

		eventIconRowPane.find('#iconHeight-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-item-icon-image').forEach(element => {
				element.css({ height: value });
			});
		});

		eventTitleRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-caption').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		eventTitleRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-caption').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		eventLocationRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
				element.css({ fontSize: value });
			});
		});
		eventLocationRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		eventDurationRowPane.find('#fontSize-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
				element.css({ fontSize: value });
			});
		});
		eventDurationRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
				element.css({ fontFamily: value });
			});
		});

		eventDateRowPane.find('#daySize-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-item-date-day').forEach(element => {
				element.css({ fontSize: value });
			});
		});
		eventDateRowPane.find('#monthSize-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-item-date-month').forEach(element => {
				element.css({ fontSize: value });
			});
		});

		eventDateRowPane.find('#fontFamily-cell').onChanged(value => {
			draftDom.findAll('.crater-event-content-item-date').forEach(element => {
				element.css({ fontFamily: value });
			});
		});
		//appends the dom and pane prototypes to the dom and pane when you click add new
		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newEventRowDom = eventListRowDomPrototype.cloneNode(true);
			let newEventRowPane = eventListRowPanePrototype.cloneNode(true);

			eventList.append(newEventRowDom);//c
			this.paneContent.find('.list-pane').append(newEventRowPane);
			eventRowHandler(newEventRowPane, newEventRowDom);
		});

		let paneItems = this.paneContent.findAll('.crater-event-item-pane');
		paneItems.forEach((eventRow, position) => {
			eventRowHandler(eventRow, eventListRow[position]);
		});

		let showHeader = titlePane.find('#toggleTitle-cell');
		showHeader.addEventListener('change', e => {
			switch (showHeader.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-title').forEach(element => element.style.display = "none");
					break;
				case "show":
					draftDom.findAll('.crater-event-title').forEach(element => element.style.display = "flex");
					break;
				default:
					draftDom.findAll('.crater-event-title').forEach(element => element.style.display = "none");
			}
		});

		//to hide or show properties
		let showIcon = eventIconRowPane.find('#toggleIcon-cell');

		showIcon.addEventListener('change', e => {

			switch (showIcon.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-content-item-icon-image').forEach(element => element.style.display = "none");
					break;
				case "show":
					draftDom.findAll('.crater-event-content-item-icon-image').forEach(element => element.style.display = "block");
					break;
				default:
					draftDom.findAll('.crater-event-content-item-icon-image').forEach(element => element.style.display = "none");
			}
		});

		let showTitle = eventTitleRowPane.find('#toggleTitle-cell');
		showTitle.addEventListener('change', e => {
			switch (showTitle.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-content-task-caption').forEach(element => element.style.visibility = "hidden");
					break;
				case "show":
					draftDom.findAll('.crater-event-content-task-caption').forEach(element => element.style.visibility = "visible");
					break;
				default:
					draftDom.findAll('.crater-event-content-task-caption').forEach(element => element.style.visibility = "hidden");
			}
		});

		let showLocation = eventLocationRowPane.find('#toggleLocation-cell');
		showLocation.addEventListener('change', e => {
			switch (showLocation.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
						element.style.visibility = "hidden";
						element.previousSibling.style.visibility = "hidden";
					});
					break;
				case "show":
					draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
						element.style.visibility = "visible";
						element.previousSibling.style.visibility = "visible";
					});
					break;
				default:
					draftDom.findAll('.crater-event-content-task-location-place').forEach(element => {
						element.style.visibility = "hidden";
						element.previousSibling.style.visibility = "hidden";
					});
			}
		});

		let showDuration = eventDurationRowPane.find('#toggleDuration-cell');
		showDuration.addEventListener('change', e => {

			switch (showDuration.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
						element.style.visibility = "hidden";
						element.previousSibling.style.visibility = "hidden";
					});
					break;
				case "show":
					draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
						element.style.visibility = "visible";
						element.previousSibling.style.visibility = "visible";
					});
					break;
				default:
					draftDom.findAll('.crater-event-content-task-location-duration').forEach(element => {
						element.style.visibility = "hidden";
						element.previousSibling.style.visibility = "hidden";
					});
			}
		});

		this.paneContent.find('#Link-Window-cell').value = settings['view'];
		this.paneContent.find('#Link-Window-cell').onchange = () => {
			settingsClone['view'] = this.paneContent.find('#Link-Window-cell').value;
		};

		let showDate = eventDateRowPane.find('#toggleDate-cell');
		showDate.addEventListener('change', () => {
			switch (showDate.value.toLowerCase()) {
				case "hide":
					draftDom.findAll('.crater-event-content-item-date').forEach(element => element.style.display = "none");
					break;
				case "show":
					draftDom.findAll('.crater-event-content-item-date').forEach(element => element.style.display = "block");
					break;
				default:
					draftDom.findAll('.crater-event-content-item-date').forEach(element => element.style.display = "none");
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
		const settings = JSON.parse(params.element.dataset.settings);
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options: params.options },
				icon: { element: 'select', attributes: { id: 'meta-data-icon', name: 'Icon' }, options: params.options },
				startdate: { element: 'select', attributes: { id: 'meta-data-startdate', name: 'StartDate' }, options: params.options },
				enddate: { element: 'select', attributes: { id: 'meta-data-enddate', name: 'EndDate' }, options: params.options },
				location: { element: 'select', attributes: { id: 'meta-data-location', name: 'Location' }, options: params.options },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		let data: any = {};
		let source: any;
		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			data.title = updateWindow.find('#meta-data-title').value;
			data.icon = updateWindow.find('#meta-data-icon').value;
			data.startdate = updateWindow.find('#meta-data-startdate').value;
			data.enddate = updateWindow.find('#meta-data-enddate').value;
			data.location = updateWindow.find('#meta-data-location').value;
			source = this.func.extractFromJsonArray(data, params.source);

			let newContent = this.render({ source });
			draftDom.find('.crater-event-content').innerHTML = newContent.find('.crater-event-content').innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = draftDom.outerHTML;
			this.paneContent.find('.list-pane').innerHTML = this.generatePaneContent({ list: newContent.findAll('.crater-event-content-item') }).innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
		});


		if (!this.func.isnull(paneConnection)) {
			paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
				this.element.innerHTML = draftDom.innerHTML;

				this.element.css(draftDom.css());

				this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

				settings.linkWindow = this.paneContent.find('#Link-Window-cell').value;
				this.sharePoint.saveSettings(this.element, settings);
			});
		}

		return updateWindow;
	}
}
