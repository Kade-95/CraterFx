import { ElementModifier } from './../ElementModifier';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export class Birthday extends ElementModifier {
	public key: any;
	public element: any;
	public paneContent: any;
	public elementModifier: any = new ElementModifier();

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		const birthday = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-birthday', 'data-type': 'birthday' }, children: [
				{
					element: 'div', attributes: { id: 'crater-birthday-header', class: 'crater-birthday-header' }, children: [
						{ element: 'i', attributes: { id: 'crater-birthday-header-img', class: 'crater-birthday-header-img', 'data-icon': this.sharePoint.icons.play } },
						{ element: 'div', attributes: { id: 'crater-birthday-header-title', class: 'crater-birthday-header-title' }, text: 'Birthdays Coming Up...' }
					]
				},
				{
					element: 'div', attributes: { id: 'crater-birthday-div', class: 'crater-birthday-div' }
				},
				{
					element: 'div', attributes: { id: 'birthday-loading', class: 'birthday-loading' }, children: [

						{ element: 'p', attributes: { id: 'birthday-loading-text', class: 'birthday-loading-text' }, text: 'Fetching Employee Directory, Please wait...' },
						{
							element: 'img', attributes: { id: 'birthday-loading-image', class: 'birthday-loading-image crater-icon', src: this.sharePoint.images.loading, style: { width: '50px', height: '50px' } }
						}
					]
				}
			]
		});
		const birthdayBody = birthday.querySelector('.crater-birthday-header');
		birthdayBody.innerHTML +=
			`<div id="crater-main-options" class="crater-main-options">
					<div class="crater-close-button">
						<span class="crater-close-btn2">x</span>
					</div> 
					<div class="crater-options-box">
						<div class="crater-option" data-link="https://mail.google.com">
							<div class="crater-option-icon"><i class="fa fa-google-plus"></i> </div>
							<div class="crater-option-name">G-Mail</div>
						</div>
						<div class="crater-option" data-link="https://outlook.office365.com/mail">
							<div class="crater-option-icon"><i class="fa fa-envelope-o"></i> </div>
							<div class="crater-option-name">Outlook</div>
						</div>
						<div class="crater-option" data-link="https://teams.microsoft.com/_#/conversations">
							<div class="crater-option-icon"><i class="fa fa-comments"></i> </div>
							<div class="crater-option-name">Teams</div>
						</div>
					</div> 
    		</div>`;


		const settings = {
			fetched: false,
			mode: 'Birthday',
			interval: 999,
			count: 0,
			sortBy: 'Birthday',
			users: []
		};
		this.sharePoint.saveSettings(birthday, settings);
		this.key = birthday.dataset.key;

		return birthday;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		this.getUser();
		let settings = JSON.parse(params.element.dataset.settings);

		params.element.querySelector('.birthday-loading-text').textContent = 'Fetching Employee Directory, Please wait...';

		if (!settings.fetched) {
			const birthdayInterval = setInterval(() => {
				if (settings.users.length !== 0) {
					let renderedCount = (settings.count) ? settings.count : settings.users.length;
					let birthdayDiv = params.element.querySelector('.crater-birthday-div');
					let birthdayLoading = params.element.querySelector('.birthday-loading') as any;
					birthdayLoading.style.display = 'none';
					switch (settings.mode.toLowerCase()) {
						case 'birthday':
							for (let i = 0; i < renderedCount; i++) {
								const phoneExists = (settings.users[i].phone) ?
									`<a href="#" class="crater-birthday-icon">
													<img class="img"
														src="http://www.free-icons-download.net/images/call-icon-16876.png"
														alt=""></a>
													<a href="#" class="crater-birthday-icon">
														<img class="img"
															src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
															alt=""></a>
													`
									: '';

								const birthdayHTML = `<div class="birthday" divid="${settings.users[i].id}">
											<div class="birthday-image">
												<img class="name-image1" src=${settings.users[i].image} alt="">
											</div>
											<div class="div">
												<div class="name">
													<span
														class="personName">${settings.users[i].displayName}</span>
													<img class="name-image"
														src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
														alt=""><br>
												</div>
												<span
													class="title">${settings.users[i].mail}</span>
												<div class="date">
													<span class="birthDate">${new Date(settings.users[i].birthDate).toString().split(`${new Date(settings.users[i].birthDate).getFullYear()}`)[0]}</span>
													<a href="#" class="crater-birthday-icon">
														<img class="img"
															src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
															alt="">
													</a>
													${phoneExists}
												</div>
											</div>
										</div> `;

								birthdayDiv.innerHTML += birthdayHTML;
							}
							clearInterval(birthdayInterval);
							break;

						case 'anniversary':
							for (let i = 0; i < renderedCount; i++) {
								const phoneExists = (settings.users[i].phone) ?
									`<a href="#" class="crater-birthday-icon">
														<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png" alt="">
													</a>
													<a href="#" class="crater-birthday-icon">
														<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png" alt="">
													</a>` : '';
								const birthdayHTML = `<div class="birthday" divid="${settings.users[i].id}">
															<div class="birthday-image">
																<img class="name-image1"
																	src=${settings.users[i].image}
																	alt="">
															</div>
															<div class="div">
																<div class="name">
																	<span class="personName">${settings.users[i].displayName}</span>
																	<img class="name-image"
																		src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
																		alt=""><br>
																</div>
																<span class="title">${settings.users[i].mail}</span>
																<div class="date">
																	<span class="birthDate">${settings.users[i].anniversary}</span>
																	<a href="#" class="crater-birthday-icon">
																		<img class="img"
																			src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
																			alt=""></a>
																	${phoneExists}
																</div>
															</div>
													 </div>`;
								birthdayDiv.innerHTML += birthdayHTML;
							}
							clearInterval(birthdayInterval);
							break;
					}
				}
			}, 1000);
		}

		const options = this.element.querySelectorAll('.crater-option');
		options.forEach(option => {
			option.onclick = () => window.open(option.dataset.link);
		});

		const closeButton = this.element.querySelector('.crater-close-button');
		closeButton.onclick = () => {
			closeButton.parentElement.style.animation = 'fadeOut 1.5s';
			setTimeout(() => {
				closeButton.parentElement.style.display = 'none';
			}, 1500);
		};

		setInterval(() => {
			if (this.element.querySelector('.birthday')) {
				this.element.querySelectorAll('a').forEach((birthdayPopUp) => {
					birthdayPopUp.onclick = () => {
						if (birthdayPopUp.className === 'crater-birthday-icon') {
							closeButton.parentElement.style.animation = 'fadeIn 1.5s';
							closeButton.parentElement.style.display = 'flex';
						}
					};
				});
			}
		}, 1000);


		window.onerror = (msg, url, lineNumber, columnNumber, error) => {
			console.log(msg, url, lineNumber, columnNumber, error);
		};
	}

	public getDAYS(x) {
		let y = 365;
		let y2 = 31;
		let remainder = x % y;
		let days = remainder % y2;
		let year = (x - remainder) / y;
		let month = (remainder - days) / y2;

		let result = year + " Year(s)" + ", " + month + " Month(s)" + ", and " + days + " Day(s)";

		return {
			result,
			year,
			month,
			days
		};
	}

	public getUser = async () => {
		let draftBirthday = JSON.parse(this.element.dataset.settings);
		draftBirthday.users = [];
		let self = this;

		const getImage = (imgID, element?) => {
			const setSource = (element) ? element : document;
			draftBirthday = JSON.parse(this.element.dataset.settings);
			this.sharePoint.connection.getWithGraph().then((client) => {
				client.api(`/users/${imgID}/photo/$value`)
					.responseType('blob')
					.get((error: any, result: any, rawResponse?: any) => {
						if (!this.func.setNotNull(result)) return;
						if (draftBirthday.users.length !== 0) {
							for (let p = 0; p < draftBirthday.users.length; p++) {
								if (draftBirthday.users[p].id === imgID) {
									const myBlob = new Blob([result], { type: 'blob' });
									const blobUrl = URL.createObjectURL(myBlob);
									draftBirthday.users[p].photo = result;
									draftBirthday.users[p].image = blobUrl;
									if ((setSource.querySelector('.birthday')) && (!setSource.querySelector('.no-users'))) {
										let renderedBirthdays = setSource.querySelectorAll('.birthday') as any;
										if (renderedBirthdays[p].getAttribute('divid') === imgID) {
											renderedBirthdays[p].querySelector('.name-image1').src = blobUrl;
										}
									}
									this.sharePoint.saveSettings(this.element, draftBirthday);
								}
							}
						}
					});
			});
		};

		const getDepartment = (dptID) => {
			draftBirthday = JSON.parse(this.element.dataset.settings);
			this.sharePoint.connection.getWithGraph().then(client => {
				client.api(`/users/${dptID}/department`)
					.get((error: any, result: any, rawResponse?: any) => {
						if (!this.func.setNotNull(result)) return;
						if (draftBirthday.users.length !== 0) {
							for (let p = 0; p < draftBirthday.users.length; p++) {
								if (draftBirthday.users[p].id === dptID) {
									draftBirthday.users[p].department = result['value'];
								}
							}
						}
						this.sharePoint.saveSettings(this.element, draftBirthday);
					});
			});
		};

		const getBirthday = (bthID) => {
			draftBirthday = JSON.parse(this.element.dataset.settings);
			this.sharePoint.connection.getWithGraph().then((client) => {
				client.api(`/users/${bthID}/birthday`)
					.get((error: any, result: any, rawResponse?: any) => {
						if (!this.func.setNotNull(result)) return;
						if (draftBirthday.users.length !== 0) {
							for (let p = 0; p < draftBirthday.users.length; p++) {
								if (draftBirthday.users[p].id === bthID) {
									const birthday = result['value'];
									if (birthday.indexOf('T') != -1) {
										let year = `${new Date().getFullYear()}`;
										let month = birthday.split('T')[0].split('-')[1];
										let day = birthday.split('T')[0].split('-')[2];
										let newDate = month + '/' + day + '/' + year;

										draftBirthday.users[p].birthDate = newDate;
										if (draftBirthday.mode.toLowerCase() === 'birthday') {
											if ((document.querySelector('.birthday')) && (!document.querySelector('.no-users'))) {
												let renderedBirthdays = document.querySelectorAll('.birthday') as any;
												if (renderedBirthdays[p].getAttribute('divid') === bthID) {
													renderedBirthdays[p].querySelector('.birthDate').textContent = new Date(draftBirthday.users[p].birthDate).toString().split(`${new Date(draftBirthday.users[p].birthDate).getFullYear()}`)[0];
												}
											}
										}
									}
								}
								this.sharePoint.saveSettings(this.element, draftBirthday);
							}
						}
					});
			});
		};

		const getHireDate = (hID) => {
			draftBirthday = JSON.parse(this.element.dataset.settings);
			this.sharePoint.connection.getWithGraph().then(client => {
				client.api(`/users/${hID}/hireDate`)
					.get((error: any, result: any, rawResponse?: any) => {
						if (!this.func.setNotNull(result)) return;
						if (draftBirthday.users.length !== 0) {
							for (let p = 0; p < draftBirthday.users.length; p++) {
								if (draftBirthday.users[p].id === hID) {
									const hired = result['value'];
									if (hired.indexOf('T') != -1) {
										let hYear = hired.split('T')[0].split('-')[0];
										let hMonth = hired.split('T')[0].split('-')[1];
										let hDay = hired.split('T')[0].split('-')[2];
										let hDate = hMonth + '/' + hDay + '/' + hYear;

										draftBirthday.users[p].hireDate = hDate;

										let date = new Date();
										//@ts-ignore
										let personHireDate = new Date(draftBirthday.users[p].hireDate);
										let timeLeft = date.getTime() - personHireDate.getTime();

										let daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
										let hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
										let minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
										let secondsLeft = Math.floor((timeLeft % (1000 * 60)) / (1000));

										draftBirthday.users[p].anniversary = self.getDAYS(daysLeft).result;
										draftBirthday.users[p].year = self.getDAYS(daysLeft).year;

										if (draftBirthday.mode.toLowerCase() === 'anniversary') {
											if ((document.querySelector('.birthday')) && (!document.querySelector('.no-users'))) {
												let renderedBirthdays = document.querySelectorAll('.birthday') as any;
												if (renderedBirthdays[p].getAttribute('divid') === hID) {
													renderedBirthdays[p].querySelector('.birthDate').textContent = draftBirthday.users[p].anniversary;
												}
											}
										}
										this.sharePoint.saveSettings(this.element, draftBirthday);
									}
								}
							}
						}
					});
			});
		};

		this.sharePoint.connection.getWithGraph().then(client => {
			draftBirthday = JSON.parse(this.element.dataset.settings);
			client.api('/users')
				.select('mail, displayName, givenName, id, surname, jobTitle, mobilePhone, officeLocation, photo, image')
				.get(async (error: any, result: MicrosoftGraph.User, rawResponse?: any) => {
					for (let p = 0; p < result['value'].length; p++) {
						draftBirthday.users.push({
							id: result['value'][p].id,
							displayName: result['value'][p].displayName,
							firstName: result['value'][p].givenName,
							lastName: result['value'][p].surname,
							mail: result['value'][p].mail,
							Title: result['value'][p].jobTitle,
							phone: result['value'][p].mobilePhone,
							birthDate: '01/01/1985',
							hireDate: '01/01/0001',
							image: 'http://icons.iconarchive.com/icons/graphicloads/flat-finance/72/person-icon.png'
						});
						if (draftBirthday.users.length != 0) {
							draftBirthday.fetched = true;
							this.sharePoint.saveSettings(this.element, draftBirthday);
							getImage(result['value'][p].id);
							getDepartment(result['value'][p].id);
							getBirthday(result['value'][p].id);
							getHireDate(result['value'][p].id);
						}
					}
				});
		});
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];//create a key variable and set it to the webpart key
		this.element = params.element;//define the declared element to the draft dom content
		let draftBirthday = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor(); //monitor the content pane 
		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {//check if draft pane content is not empty and set it to the pane content
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			let birthdayList = this.sharePoint.attributes.pane.content[key].draft.dom.querySelector('.crater-birthday-div');
			let birthdayListRows = birthdayList.querySelectorAll('.birthday');

			if (draftBirthday.fetched) {
				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'title-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Customize Birthday' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								{
									element: 'div', attributes: { class: 'message-note' }, children: [
										{
											element: 'div', attributes: { class: 'message-text' }, children: [
												{ element: 'p', attributes: { style: { color: 'green' } }, text: `MODE: Birthday/Anniversary.` },
												{ element: 'p', attributes: { style: { color: 'green' } }, text: `INTERVAL: In Anniversary Mode, enter â€œ999â€ to show all anniversaries, or enter a number to only show employees that have the set anniversary (e.g 10 -> 10 years)` },
												{ element: 'p', attributes: { style: { color: 'green' } }, text: `COUNT: The number of items to display.` },
												{ element: 'p', attributes: { style: { color: 'green' } }, text: `DAYSFUTURE: enter the number of days into the future (starting from the current date) to include in the list.` },
												{ element: 'p', attributes: { style: { color: 'green' } }, text: `DAYSPAST: enter the number of days to keep the birthday/anniversary in the list after it has passed.` }
											]
										}
									]
								}
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'title-settings row' }, children: [
								this.cell({
									element: 'select', name: 'mode', options: ['Birthday', 'Anniversary'], value: draftBirthday.mode
								}),
								this.cell({
									element: 'input', name: 'Interval', value: draftBirthday.interval
								}),
								this.cell({
									element: 'input', name: 'daysFuture', value: ''
								}),
								this.cell({
									element: 'input', name: 'daysPast', value: ''
								}),
								this.cell({
									element: 'input', name: 'count', value: draftBirthday.count || ''
								}),
								this.cell({
									element: 'select', name: 'sortBy', options: ['Name', 'Birthday', 'Anniversary'], value: draftBirthday.sortBy
								}),
								this.cell({
									element: 'select', name: 'order', options: ['Ascending', 'Descending']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'section-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Edit Section' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'section-height', value: this.element.querySelector('.crater-birthday-div').css()['max-height']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'header-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Edit Header' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'i', name: 'Image', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.querySelector('.crater-birthday-header-img').dataset.icon }
								}),
								this.cell({
									element: 'input', name: 'fontSize', value: this.element.querySelector('.crater-birthday-header-title').css()['font-size']
								}),
								this.cell({
									element: 'select', name: 'fontFamily', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.crater-birthday-header-title').css()['font-family']
								}),
								this.cell({
									element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.querySelector('.crater-birthday-header-title').css()['color']
								}),
								this.cell({
									element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: this.element.querySelector('.crater-birthday-header').css()['color']
								}),
								this.cell({
									element: 'select', name: 'toggle', options: ['Show', 'Hide']
								}),
								this.cell({
									element: 'input', name: 'text', value: this.element.querySelector('.crater-birthday-header-title').textContent
								}),
								this.cell({
									element: 'input', name: 'header-height', value: this.element.querySelector('.crater-birthday-header').css()['height']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'name-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Edit Name' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'fontSize', value: this.element.querySelector('.personName').css()['font-size']
								}),
								this.cell({
									element: 'select', name: 'fontFamily', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.personName').css()['font-family']
								}),
								this.cell({
									element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.querySelector('.personName').css()['color']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'job-title-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Edit Title Font' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'fontSize', value: this.element.querySelector('.title').css()['font-size']
								}),
								this.cell({
									element: 'select', name: 'fontFamily', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.title').css()['font-family']
								}),
								this.cell({
									element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.querySelector('.title').css()['color']
								}),
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'birthday-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Edit BirthDay Font' }
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'fontSize', value: this.element.querySelector('.birthDate').css()['font-size']
								}),
								this.cell({
									element: 'select', name: 'fontFamily', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.birthDate').css()['font-family']
								}),
								this.cell({
									element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.querySelector('.birthDate').css()['color']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'update-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Update Directory' }
							]
						}),
						this.createElement(
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.createElement({
										element: 'div', attributes: { class: 'message-note' }, children: [
											{
												element: 'div', attributes: { class: 'message-text' }, children: [
													{ element: 'p', attributes: { id: 'update-message', style: { color: 'green' } }, text: `Click this button to update the user directory` },
												]
											}
										]
									}),
									this.createElement(
										{ element: 'button', attributes: { id: 'fetch-birthday', class: 'user-button', style: { margin: '0 auto !important' } }, text: '' }
									)
								]
							}
						)
					]
				});
				if (draftBirthday.fetched) {
					this.paneContent.querySelector('#update-message').textContent = 'Directory Updated! Sort the list to view it';
					this.paneContent.querySelector('#fetch-birthday').innerHTML = 'UPDATED';
				} else {
					this.paneContent.querySelector('#update-message').textContent = 'Click this button to update the user directory';
					this.paneContent.querySelector('#fetch-birthday').innerHTML = 'UPDATE';
				}
				this.paneContent.querySelector('.title-settings').querySelector('#Interval-cell').readOnly = true;

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'user-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'OPTIONS' }
							]
						}),

						this.createElement({
							element: 'div', attributes: { class: 'display-options row' }, children: [
								this.cell({
									element: 'select', name: 'nameField', options: ['id', 'FullName', 'FirstName', 'LastName', 'Mail', 'Title', 'Phone', 'Birthday/Anniversary']
								}),
								this.cell({
									element: 'select', name: 'titleField', options: ['id', 'FullName', 'FirstName', 'LastName', 'Mail', 'Title', 'Phone', 'Birthday/Anniversary']
								}),
								this.cell({
									element: 'select', name: 'birthdayField', options: ['id', 'FullName', 'FirstName', 'LastName', 'Mail', 'Title', 'Phone', 'Birthday/Anniversary']
								})
							]
						})
					]
				});

				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'background-color-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								{ element: 'h2', attributes: { class: 'title' }, text: 'Change Row Background' }
							]
						}),

						this.createElement({
							element: 'div', attributes: { class: 'message-note' }, children: [
								{
									element: 'div', attributes: { class: 'message-text' }, children: [
										{ element: 'p', attributes: { id: 'update-message', style: { color: 'green' } }, text: `Enter the position of the birthday card e.g 1` },
										{ element: 'p', attributes: { id: 'update-message', style: { color: 'green' } }, text: `If you wish to alter multiple positions enter the positions as 1, 2, 3 etc...` }
									]
								}
							]
						}),

						this.createElement({
							element: 'div', attributes: { class: 'display-options row' }, children: [
								this.cell({
									element: 'input', name: 'position'
								}),
								this.cell({
									element: 'input', name: 'backgroundColor', dataAttributes: { type: 'color' }
								})
							]
						})
					]
				});
			} else {
				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'notification-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'message-note' }, children: [
								{
									element: 'div', attributes: { class: 'message-text' }, children: [
										{ element: 'p', attributes: { id: 'update-message', style: { color: 'green' } }, text: `Please Wait, fetching content from employee directory` },
										{
											element: 'img', attributes: { class: 'birthday-loading-image crater-icon', src: this.sharePoint.images.loading, style: { width: '20px', height: '20px' } }
										}
									]
								}
							]
						})
					]
				});
			}
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let birthdayListPane = this.createElement({
			element: 'div', attributes: { class: 'card user-birthday-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Background Color'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.list.length; i++) {
			birthdayListPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-birthday-item-pane row' },
				children: [
					this.cell({
						element: 'input', name: 'birthdayBackground', value: params.list[i].css()['background-color']
					}),
					this.cell({
						element: 'input', name: 'birthdayName', value: params.list[i].querySelector('.personName').textContent
					})
				]
			});
		}

		return birthdayListPane;


	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.querySelector('.crater-property-content').monitor();
		let draftBirthday = JSON.parse(params.element.dataset.settings);
		let settingsClone: any = {};
		let birthdayList = this.sharePoint.attributes.pane.content[this.key].draft.dom.querySelector('.crater-birthday-div');
		let birthdayListRow = birthdayList.querySelectorAll('.birthday') as any;
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		draftBirthday.sortUsers = [];

		if (draftBirthday.fetched) {
			let titlePane = this.paneContent.querySelector('.title-pane');
			let optionsPane = this.paneContent.querySelector('.user-pane');
			let namePane = this.paneContent.querySelector('.name-pane');
			let jobPane = this.paneContent.querySelector('.job-title-pane');
			let birthdayPane = this.paneContent.querySelector('.birthday-pane');
			let headerPane = this.paneContent.querySelector('.header-pane');
			let sectionPane = this.paneContent.querySelector('.section-pane');
			let bgColorPane = this.paneContent.querySelector('.background-color-pane');

			let orderCell = titlePane.querySelector('#order-cell');
			let sortCell = titlePane.querySelector('#sortBy-cell');
			let modeCell = titlePane.querySelector('#mode-cell');
			let count = titlePane.querySelector('#count-cell');
			let future = titlePane.querySelector('#daysFuture-cell');
			let past = titlePane.querySelector('#daysPast-cell');
			let nameField = optionsPane.querySelector('#nameField-cell');
			let titleField = optionsPane.querySelector('#titleField-cell');
			let birthdayField = optionsPane.querySelector('#birthdayField-cell');

			window.onerror = (msg, url, lineNumber, columnNumber, error) => {
				console.log(msg, url, lineNumber, columnNumber, error);
			};

			bgColorPane.querySelector('#position-cell').onChanged(value => {
				draftBirthday.position = (value.indexOf(',') !== -1) ? value.split(',') : parseInt(value);
			});

			bgColorPane.querySelector('#backgroundColor-cell').addEventListener('change', (event) => {
				const backgroundColor = bgColorPane.querySelector('#backgroundColor-cell').value;
				if (draftBirthday.position) {
					if (typeof draftBirthday.position === 'object') {
						for (let each of draftBirthday.position) {
							birthdayListRow[parseInt(each.trim()) - 1].css({ backgroundColor });
						}
					} else {
						birthdayListRow[draftBirthday.position - 1].css({ backgroundColor });
					}
				}
				bgColorPane.querySelector('#backgroundColor-cell').setAttribute('value', backgroundColor);
			});

			let toggleDisplay = headerPane.querySelector('#toggle-cell');
			toggleDisplay.addEventListener('change', e => {
				switch (toggleDisplay.value.toLowerCase()) {
					case 'show':
						draftDom.querySelector('.crater-birthday-header').style.display = 'flex';
						break;
					case 'hide':
						draftDom.querySelector('.crater-birthday-header').style.display = 'none';
						break;
				}
			});

			nameField.addEventListener('change', event => {
				switch (nameField.value.toLowerCase()) {
					case 'id':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) div.querySelector('.personName').textContent = person.id;
								});
							}
						}
						break;
					case 'fullname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.displayName;
									}
								});
							}
						}
						break;
					case 'firstname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.firstName;
									}
								});
							}
						}
						break;
					case 'lastname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.lastName;
									}
								});
							}
						}
						break;
					case 'mail':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.mail;
									}
								});
							}
						}
						break;
					case 'title':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.Title;
									}
								});
							}
						}
						break;
					case 'phone':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.personName').textContent = person.phone;
									}
								});
							}
						}
						break;
					case 'birthday/anniversary':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										if (draftBirthday.mode.toLowerCase() === "birthday") {
											div.querySelector('.personName').textContent = new Date(person.birthDate).toString().split(`${new Date(person.birthDate).getFullYear()}`)[0];
										} else {
											div.querySelector('.personName').textContent = person.anniversary;
										}
									}
								});
							}
						}
						break;
				}
			});


			titleField.addEventListener('change', event => {
				switch (titleField.value.toLowerCase()) {
					case 'id':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.id;
									}
								});
							}
						}
						break;
					case 'fullname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.displayName;
									}
								});
							}
						}
						break;
					case 'firstname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.firstName;
									}
								});
							}
						}
						break;
					case 'lastname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.lastName;
									}
								});
							}
						}
						break;
					case 'mail':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.mail;
									}
								});
							}
						}
						break;
					case 'title':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.Title;
									}
								});
							}
						}
						break;
					case 'phone':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.title').textContent = person.phone;
									}
								});
							}
						}
						break;
					case 'birthday/anniversary':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										if (draftBirthday.mode.toLowerCase() === "birthday") {
											div.querySelector('.title').textContent = new Date(person.birthDate).toString().split(`${new Date(person.birthDate).getFullYear()}`)[0];
										} else {
											div.querySelector('.title').textContent = person.anniversary;
										}
									}
								});
							}
						}
						break;
				}
			});


			birthdayField.addEventListener('change', event => {
				switch (birthdayField.value.toLowerCase()) {
					case 'id':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {

									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.id;
									}
								});
							}
						}
						break;
					case 'fullname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.displayName;
									}
								});
							}
						}
						break;
					case 'firstname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.firstName;
									}
								});
							}
						}
						break;
					case 'lastname':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.lastName;
									}
								});
							}
						}
						break;
					case 'mail':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.mail;
									}
								});
							}
						}
						break;
					case 'title':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.Title;
									}
								});
							}
						}
						break;
					case 'phone':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										div.querySelector('.birthDate').textContent = person.phone;
									}
								});
							}
						}
						break;
					case 'birthday/anniversary':
						for (let person of draftBirthday.users) {
							if (!birthdayList.querySelector('.no-users')) {
								birthdayListRow.forEach(div => {
									if (div.getAttribute('divid') === person.id) {
										if (draftBirthday.mode.toLowerCase() === "birthday") {
											div.querySelector('.birthDate').textContent = new Date(person.birthDate).toString().split(`${new Date(person.birthDate).getFullYear()}`)[0];
										} else {
											div.querySelector('.birthDate').textContent = person.anniversary;
										}
									}
								});
							}
						}
						break;
				}
			});

			headerPane.querySelector('#text-cell').onChanged(value => {
				draftDom.querySelector('.crater-birthday-header-title').textContent = value;
			});

			namePane.querySelector('#color-cell').addEventListener('change', event => {
				const color = namePane.querySelector('#color-cell').value;
				draftDom.querySelectorAll('.personName').forEach(element => {
					element.css({ color });
				});
				namePane.querySelector('#color-cell').setAttribute('value', color);
			});

			headerPane.querySelector('#Image-cell').checkChanges(() => {
				draftDom.querySelector('.crater-birthday-header-img').removeClasses(draftDom.querySelector('.crater-birthday-header-img').dataset.icon);
				draftDom.querySelector('.crater-birthday-header-img').addClasses(headerPane.querySelector('#Image-cell').dataset.icon);
				draftDom.querySelector('.crater-birthday-header-img').dataset.icon = headerPane.querySelector('#Image-cell').dataset.icon;
			});

			headerPane.querySelector('#color-cell').addEventListener('change', event => {
				const color = headerPane.querySelector('#color-cell').value;
				draftDom.querySelector('.crater-birthday-header-title').css({ color });
				headerPane.querySelector('#color-cell').setAttribute('value', color);
			});

			headerPane.querySelector('#background-color-cell').addEventListener('change', event => {
				const backgroundColor = headerPane.querySelector('#background-color-cell').value;
				draftDom.querySelector('.crater-birthday-header').css({ backgroundColor });
				headerPane.querySelector('#background-color-cell').setAttribute('value', backgroundColor);
			});

			jobPane.querySelector('#color-cell').addEventListener('change', event => {
				const color = jobPane.querySelector('#color-cell').value;
				draftDom.querySelectorAll('.title').forEach(element => {
					element.css({ color });
				});
				jobPane.querySelector('#color-cell').setAttribute('value', color);
			});

			birthdayPane.querySelector('#color-cell').addEventListener('change', event => {
				const color = birthdayPane.querySelector('#color-cell').value;
				draftDom.querySelectorAll('.birthDate').forEach(element => {
					element.css({ color });
				});
				birthdayPane.querySelector('#color-cell').setAttribute('value', color);
			});

			namePane.querySelector('#fontSize-cell').onChanged(value => {
				draftDom.querySelectorAll('.personName').forEach(element => element.css({ fontSize: value }));
			});

			jobPane.querySelector('#fontSize-cell').onChanged(value => {
				draftDom.querySelectorAll('.title').forEach(element => element.css({ fontSize: value }));
			});

			sectionPane.querySelector('#section-height-cell').onChanged(maxHeight => {
				draftDom.querySelector('.crater-birthday-div').css({ maxHeight });
			});

			headerPane.querySelector('#header-height-cell').onChanged(height => {
				draftDom.querySelector('.crater-birthday-header').css({ height });
				draftDom.querySelector('.crater-birthday-header-img').css({ height, width: height });
			});

			birthdayPane.querySelector('#fontSize-cell').onChanged(fontSize => {
				draftDom.querySelectorAll('.birthDate').forEach(element => {
					element.css({ fontSize });
				});
			});

			namePane.querySelector('#fontFamily-cell').onChanged(value => {
				draftDom.querySelectorAll('.personName').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			headerPane.querySelector('#fontFamily-cell').onChanged(value => {
				draftDom.querySelector('.crater-birthday-header-title').css({ fontFamily: value });
			});

			headerPane.querySelector('#fontSize-cell').onChanged(value => {
				draftDom.querySelector('.crater-birthday-header-title').css({ fontSize: value });
			});

			jobPane.querySelector('#fontFamily-cell').onChanged(value => {
				draftDom.querySelectorAll('.title').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			birthdayPane.querySelector('#fontFamily-cell').onChanged(value => {
				draftDom.querySelectorAll('.birthDate').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			modeCell.addEventListener('change', event => {
				let modeDiv = draftDom.querySelectorAll('.birthday');
				switch (modeCell.value.toLowerCase()) {
					case 'birthday':
						draftBirthday.mode = modeCell.value;
						for (let person of draftBirthday.users) {
							for (let position = 0; position < draftBirthday.users.length; position++) {
								if ((modeDiv[position]) && (!modeDiv[position].querySelector('.no-users'))) {
									if (modeDiv[position].getAttribute('divid') === person.id) {
										modeDiv[position].querySelector('.birthDate').textContent = new Date(person.birthDate).toString().split(`${new Date(person.birthDate).getFullYear()}`)[0];
									}
								}
							}
						}

						if (!titlePane.querySelector('.title-settings').querySelector('#Interval-cell').readOnly) {
							draftBirthday.interval = 999;
							titlePane.querySelector('.title-settings').querySelector('#Interval-cell').value = draftBirthday.interval;
							titlePane.querySelector('.title-settings').querySelector('#Interval-cell').readOnly = true;
						}
						break;
					case 'anniversary':
						draftBirthday.mode = modeCell.value;
						for (let person of draftBirthday.users) {
							for (let position = 0; position < draftBirthday.users.length; position++) {
								if ((modeDiv[position]) && (!modeDiv[position].querySelector('.no-users'))) {
									if (modeDiv[position].getAttribute('divid') === person.id) {
										modeDiv[position].querySelector('.birthDate').textContent = person.anniversary;
									}
								}
							}
						}

						if (titlePane.querySelector('.title-settings').querySelector('#Interval-cell').readOnly) {
							titlePane.querySelector('.title-settings').querySelector('#Interval-cell').value = draftBirthday.interval;
							titlePane.querySelector('.title-settings').querySelector('#Interval-cell').readOnly = false;
						}

						break;
					default:
						draftBirthday.mode = 'Birthday';
				}
			});

			titlePane.querySelector('.title-settings').querySelector('#Interval-cell').onChanged(value => {
				draftBirthday.interval = parseInt(value);
			});

			sortCell.addEventListener('change', event => {
				switch (sortCell.value.toLowerCase()) {
					case 'name':
						draftBirthday.sortBy = sortCell.value;
						break;
					case 'birthday':
						draftBirthday.sortBy = sortCell.value;
						break;
					case 'anniversary':
						draftBirthday.sortBy = sortCell.value;
						break;
					default:
						draftBirthday.sortBy = 'birthday';
				}
			});

			orderCell.addEventListener('change', event => {
				switch (orderCell.value.toLowerCase()) {
					case 'ascending':
						let byDate = (draftBirthday.sortUsers.length !== 0) ? draftBirthday.sortUsers.slice(0) : draftBirthday.users.slice(0);

						byDate.sort((a, b) => {
							if (draftBirthday.sortBy.toLowerCase() === 'name') {
								return (a.firstName < b.firstName) ? -1 : (b.firstName < a.firstName) ? 1 : 0;
							}

							if (draftBirthday.sortBy.toLowerCase() === 'birthday') {
								return (new Date(a.birthDate) < new Date(b.birthDate)) ? -1 : (new Date(b.birthDate) < new Date(a.birthDate)) ? 1 : 0;
							}

							if (draftBirthday.sortBy.toLowerCase() === 'anniversary') {
								return (new Date(a.hireDate) > new Date(b.hireDate)) ? -1 : (new Date(b.hireDate) > new Date(a.hireDate)) ? 1 : 0;
							}
						});

						let craterBirthdayDiv = draftDom.querySelector('.crater-birthday-div');
						let birthdays = craterBirthdayDiv.querySelectorAll('.birthday') as any;
						craterBirthdayDiv.innerHTML = '';
						const counted = (draftBirthday.count) ? draftBirthday.count : byDate.length;

						if (draftBirthday.mode.toLowerCase() === 'anniversary') {
							if (draftBirthday.interval == 999) {
								for (let i = 0; i < counted; i++) {
									const phoneExists = (byDate[i].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
									let craterBirthdayHTML = `
							<div class="birthday" divid="${byDate[i].id}">
								<div class="birthday-image">
									<img class="name-image1"
										src=${byDate[i].image}
										alt="">
								</div>
								<div class="div">
									<div class="name"><span class="personName">${byDate[i].displayName}</span>
										<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
											alt=""><br>
									</div>
									<span class="title">${byDate[i].mail}</span>
									<div class="date"><span class="birthDate">${byDate[i].anniversary}</span>
										<a href="#" class="crater-birthday-icon">
											<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
												alt=""></a>
									${phoneExists}
									</div>
								</div>
							</div>`;
									craterBirthdayDiv.innerHTML += craterBirthdayHTML;
								}
							} else {
								for (let i = 0; i < byDate.length; i++) {
									const phoneExists = (byDate[i].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
									if (byDate[i].year === draftBirthday.interval) {
										console.log('retrieving users where year = ' + draftBirthday.interval + 'inside the code now ascending');
										let craterBirthdayHTML = `
								<div class="birthday" divid="${byDate[i].id}">
									<div class="birthday-image">
										<img class="name-image1"
											src=${byDate[i].image}
											alt="">
									</div>
									<div class="div">
										<div class="name"><span class="personName">${byDate[i].displayName}</span>
											<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
												alt=""><br>
										</div>
										<span class="title">${byDate[i].mail}</span>
										<div class="date"><span class="birthDate">${byDate[i].anniversary}</span>
											<a href="#" class="crater-birthday-icon">
												<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
													alt=""></a>
									${phoneExists}
										</div>
									</div>
								</div>`;

										craterBirthdayDiv.innerHTML += craterBirthdayHTML;
									}
								}
							}
							if (craterBirthdayDiv.innerHTML.length === 0) {
								let craterBirthdayHTML = `
								<div style="padding:.5em;" class="no-users birthday">
									<p>Sorry, No users found</p>
								</div>`;

								craterBirthdayDiv.innerHTML = craterBirthdayHTML;
							}
						} else if (draftBirthday.mode.toLowerCase() === 'birthday') {
							for (let i = 0; i < counted; i++) {
								const phoneExists = (byDate[i].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
								let craterBirthdayHTML = `<div class="birthday" divid="${byDate[i].id}">
							<div class="birthday-image">
								<img class="name-image1"
									src=${byDate[i].image}
									alt="">
							</div>
							<div class="div">
								<div class="name"><span class="personName">${byDate[i].displayName}</span>
									<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
										alt=""><br>
								</div>
								<span class="title">${byDate[i].mail}</span>
								<div class="date"><span class="birthDate">${new Date(byDate[i].birthDate).toString().split(`${new Date(byDate[i].birthDate).getFullYear()}`)[0]}</span>
									<a href="#" class="crater-birthday-icon">
										<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
											alt=""></a>
									${phoneExists}
								</div>
							</div>
						</div>`;
								craterBirthdayDiv.innerHTML += craterBirthdayHTML;
							}
						}
						break;

					case 'descending':
						let byDate2 = (draftBirthday.sortUsers.length !== 0) ? draftBirthday.sortUsers.slice(0) : draftBirthday.users.slice(0);

						byDate2.sort((a, b) => {
							if (draftBirthday.sortBy.toLowerCase() === 'name') {
								if (a.firstName > b.firstName) return -1;
								if (b.firstName > a.firstName) return 1;
								return 0;
							}

							if (draftBirthday.sortBy.toLowerCase() === 'birthday') {
								if (new Date(a.birthDate) > new Date(b.birthDate)) return -1;
								if (new Date(b.birthDate) > new Date(a.birthDate)) return 1;
								return 0;
							}

							if (draftBirthday.sortBy.toLowerCase() === 'anniversary') {
								if (new Date(a.hireDate) < new Date(b.hireDate)) return -1;
								if (new Date(b.hireDate) < new Date(a.hireDate)) return 1;
								return 0;
							}
						});

						let craterBirthdayDiv2 = draftDom.querySelector('.crater-birthday-div');

						craterBirthdayDiv2.innerHTML = '';
						const anotherCount = (draftBirthday.count) ? draftBirthday.count : byDate2.length;

						if (draftBirthday.mode.toLowerCase() === 'anniversary') {
							if (draftBirthday.interval == 999) {
								console.log('mode: ' + draftBirthday.mode, 'descending', draftBirthday.interval);
								for (let i = 0; i < anotherCount; i++) {
									const phoneExists = (byDate2[i].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
									let craterBirthdayHTML2 = `<div class="birthday" divid="${byDate2[i].id}">
								<div class="birthday-image">
									<img class="name-image1"
										src=${byDate2[i].image}
										alt="">
								</div>
								<div class="div">
									<div class="name"><span class="personName">${byDate2[i].displayName}</span>
										<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
											alt=""><br>
									</div>
									<span class="title">${byDate2[i].mail}</span>
									<div class="date"><span class="birthDate">${byDate2[i].anniversary}</span>
										<a href="#" class="crater-birthday-icon">
											<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
												alt=""></a>
									${phoneExists}
									</div>
								</div>
							</div>`;
									craterBirthdayDiv2.innerHTML += craterBirthdayHTML2;
								}
							} else {
								for (let x = 0; x < anotherCount; x++) {
									if (byDate2[x].year === draftBirthday.interval) {
										const phoneExists = (byDate2[x].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
										let craterBirthdayHTML2 = `<div class="birthday" divid="${byDate2[x].id}">
									<div class="birthday-image">
										<img class="name-image1"
											src=${byDate2[x].image}
											alt="">
									</div>
									<div class="div">
										<div class="name"><span class="personName">${byDate2[x].displayName}</span>
											<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
												alt=""><br>
										</div>
										<span class="title">${byDate2[x].mail}</span>
										<div class="date"><span class="birthDate">${byDate2[x].anniversary}</span>
											<a href="#" class="crater-birthday-icon">
												<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
													alt=""></a>
										${phoneExists}
										</div>
									</div>
								</div>`;

										craterBirthdayDiv2.innerHTML += craterBirthdayHTML2;
									}
								}
							}
							if (craterBirthdayDiv2.innerHTML.length === 0) {
								let craterBirthdayHTML2 = `
								<div style="padding:.5em;" class="no-users birthday">
									<p>Sorry, No users found</p>
								</div>`;
								craterBirthdayDiv2.innerHTML = craterBirthdayHTML2;
							}

						} else {
							if (draftBirthday.mode.toLowerCase() === 'birthday') {
								for (let i = 0; i < anotherCount; i++) {
									const phoneExists = (byDate2[i].phone) ? `<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/call-icon-16876.png"
								alt=""></a>
								<a href="#" class="crater-birthday-icon">
							<img class="img" src="http://www.free-icons-download.net/images/bubble-message-icon-74535.png"
								alt=""></a>
								` : '';
									let craterBirthdayHTML2 = `<div class="birthday" divid="${byDate2[i].id}">
								<div class="birthday-image">
									<img class="name-image1"
										src=${byDate2[i].image}
										alt="">
								</div>
								<div class="div">
									<div class="name"><span class="personName">${byDate2[i].displayName}</span>
										<img class="name-image" src="https://img.icons8.com/material-sharp/24/000000/birthday.png"
											alt=""><br>
									</div>
									<span class="title">${byDate2[i].mail}</span>
									<div class="date"><span class="birthDate">${new Date(byDate2[i].birthDate).toString().split(`${new Date(byDate2[i].birthDate).getFullYear()}`)[0]}</span>
										<a href="#" class="crater-birthday-icon">
											<img class="img" src="https://img.icons8.com/material-two-tone/24/000000/composing-mail.png"
												alt=""></a>
									${phoneExists}
									</div>
								</div>
							</div>`;
									craterBirthdayDiv2.innerHTML += craterBirthdayHTML2;
								}
							}
						}

						break;
				}
			});

			count.onChanged(value => {
				draftBirthday.count = (typeof value === "number") ? value : parseInt(value);
			});

			let addDays = (givenDate) => {
				let date = new Date(Number(new Date()));
				date.setDate(date.getDate() + parseInt(givenDate));
				return date;
			};

			let subtractDays = (givenDate) => {
				let date = new Date(Number(new Date()));
				date.setDate(date.getDate() - parseInt(givenDate));
				return date;
			};

			let sortArrayAsc = (arrayToPush, array, numberCount) => {
				array.sort((a, b) => {
					if (a.newBirthDate < b.newBirthDate) return -1;
					if (b.newBirthDate < a.newBirthDate) return 1;
				});

				for (let i = 0; i < numberCount; i++) {
					if (arrayToPush.length === 0) {
						arrayToPush.push(array[i]);
					} else {
						if (arrayToPush.indexOf(array[i]) === -1) {
							arrayToPush.push(array[i]);
						}
					}
				}
			};

			let sortArrayDes = (arrayToPush, array, numberCount) => {
				array.sort((a, b) => {
					if (a.newBirthDate > b.newBirthDate) return -1;
					if (b.newBirthDate > a.newBirthDate) return 1;
				});

				for (let i = 0; i < numberCount; i++) {
					if (arrayToPush.length === 0) {
						arrayToPush.push(array[i]);
					} else {
						if (arrayToPush.indexOf(array[i]) === -1) {
							arrayToPush.push(array[i]);
						}
					}
				}
			};

			future.addEventListener('change', e => {
				let value = future.value;

				if (draftBirthday.mode.toLowerCase() === 'birthday') {
					draftBirthday.beforeYear = parseInt(value);
					let futureSort = [];
					for (let z = 0; z < draftBirthday.users.length; z++) {
						let birthMonth = new Date(draftBirthday.users[z].birthDate).getMonth() + 1;
						let userBirthDate = new Date(draftBirthday.users[z].birthDate).getDate();
						let newBirthDate = new Date(`${birthMonth}/${userBirthDate}/${new Date().getFullYear()}`);
						draftBirthday.users[z].newBirthDate = newBirthDate;

						if ((draftBirthday.users[z].newBirthDate <= new Date(`12/31/${new Date().getFullYear()}`)) && (draftBirthday.users[z].newBirthDate >= new Date())) {
							if (futureSort.length === 0) {
								futureSort.push(draftBirthday.users[z]);
							} else {
								if (futureSort.indexOf(draftBirthday.users[z]) === -1) {
									futureSort.push(draftBirthday.users[z]);
								}
							}
						}
					}

					sortArrayAsc(draftBirthday.sortUsers, futureSort, parseInt(value));
				}

				if (draftBirthday.mode.toLowerCase() === 'anniversary') {
					draftBirthday.beforeYear = parseInt(value);
					let futureSort = [];
					for (let z = 0; z < draftBirthday.users.length; z++) {
						let date = new Date();
						//@ts-ignore
						let personHireDate = new Date(draftBirthday.users[z].hireDate);
						let timeLeft = date.getTime() - personHireDate.getTime();

						let daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
						let hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						let minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
						let secondsLeft = Math.floor((timeLeft % (1000 * 60)) / (1000));

						draftBirthday.users[z].newBirthDate = this.getDAYS(daysLeft).year;
						if (this.getDAYS(daysLeft).month >= 5) {
							if (futureSort.length === 0) {
								futureSort.push(draftBirthday.users[z]);
							} else {
								if (futureSort.indexOf(draftBirthday.users[z]) === -1) {
									futureSort.push(draftBirthday.users[z]);
								}
							}
						}
					}

					sortArrayDes(draftBirthday.sortUsers, futureSort, parseInt(value));
				}
			});

			past.addEventListener('change', e => {
				let value = past.value;

				if (draftBirthday.mode.toLowerCase() === 'birthday') {
					draftBirthday.endAnniversaryAfter = parseInt(value);

					let pastSort = [];
					for (let z = 0; z < draftBirthday.users.length; z++) {
						let birthMonth = new Date(draftBirthday.users[z].birthDate).getMonth() + 1;
						let userBirthDate = new Date(draftBirthday.users[z].birthDate).getDate();
						let newBirthDate = new Date(`${birthMonth}/${userBirthDate}/${new Date().getFullYear()}`);
						draftBirthday.users[z].newBirthDate = newBirthDate;

						if ((draftBirthday.users[z].newBirthDate <= new Date()) && (draftBirthday.users[z].newBirthDate >= new Date(`01/01/${new Date().getFullYear()}`))) {
							if (pastSort.length === 0) {
								pastSort.push(draftBirthday.users[z]);
							} else {
								if (pastSort.indexOf(draftBirthday.users[z]) === -1) {
									pastSort.push(draftBirthday.users[z]);
								}
							}
						}

						if (pastSort.length === 0) {
							if ((draftBirthday.users[z].newBirthDate <= new Date()) && (draftBirthday.users[z].newBirthDate >= new Date(`01/01/${new Date().getFullYear() - 1}`))) {
								if (pastSort.length === 0) {
									pastSort.push(draftBirthday.users[z]);
								} else {
									if (pastSort.indexOf(draftBirthday.users[z]) === -1) {
										pastSort.push(draftBirthday.users[z]);
									}
								}
							}
						}
					}

					sortArrayDes(draftBirthday.sortUsers, pastSort, parseInt(value));
				}

				if (draftBirthday.mode.toLowerCase() === 'anniversary') {
					draftBirthday.beforeYear = parseInt(value);
					let pastSort = [];
					for (let z = 0; z < draftBirthday.users.length; z++) {
						let date = new Date();
						//@ts-ignore
						let personHireDate = new Date(draftBirthday.users[z].hireDate);
						let timeLeft = date.getTime() - personHireDate.getTime();

						let daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
						let hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						let minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
						let secondsLeft = Math.floor((timeLeft % (1000 * 60)) / (1000));

						draftBirthday.users[z].newBirthDate = this.getDAYS(daysLeft).year;
						if (this.getDAYS(daysLeft).month < 5) {
							if (pastSort.length === 0) {
								pastSort.push(draftBirthday.users[z]);
							} else {
								if (pastSort.indexOf(draftBirthday.users[z]) === -1) {
									pastSort.push(draftBirthday.users[z]);
								}
							}
						}
					}

					sortArrayDes(draftBirthday.sortUsers, pastSort, parseInt(value));
				}
			});

			this.paneContent.querySelector('.update-pane').querySelector('#fetch-birthday').addEventListener('click', event => {
				try {
					draftBirthday.fetched = false;
					this.paneContent.querySelector('#update-message').textContent = 'Fetching directory now... Please wait';
					this.paneContent.querySelector('#fetch-birthday').render({
						element: 'img', attributes: { class: 'birthday-loading-image crater-icon', src: this.sharePoint.images.loading, style: { width: '20px', height: '20px' } }
					});
					setTimeout(() => {
						draftBirthday = JSON.parse(this.element.dataset.settings);
						if (draftBirthday.fetched) {
							this.paneContent.querySelector('#update-message').textContent = 'Directory Updated! Sort the list to view it';
							this.paneContent.querySelector('#fetch-birthday').innerHTML = 'UPDATED';
						}
					}, 7000);
					this.getUser();
				} catch (error) {
					console.log(error.message);
				}
			});

		}
		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

			this.sharePoint.saveSettings(this.element, draftBirthday, settingsClone);
		});
	}
}
