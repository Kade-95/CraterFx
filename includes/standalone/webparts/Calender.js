import { ElementModifier } from './../ElementModifier';

class Calendar extends ElementModifier {
	public key: any;
	public params: any;
	public paneContent: any;
	public element: any;
	public eventsArray: any[] = [{
		eventID: `1`,
		eventStartDate: new Date('2020-03-01'),
		eventEndDate: new Date('2020-03-01'),
		eventName: 'Event 1',
		eventStart: '18:00',
		eventEnd: '19:00',
		eventLocation: 'The Boat House',
		organizer: 'Me',
		description: 'Me 2'
	},
	{
		eventID: `2`,
		eventStartDate: new Date('2020-02-19'),
		eventEndDate: new Date('2020-02-21'),
		eventName: 'Event 2',
		eventStart: '00:00',
		eventEnd: '01:00',
		eventLocation: 'Thomas Estate',
		organizer: 'Me',
		description: 'Me 2'
	},
	{
		eventID: `3`,
		eventStartDate: new Date('2020-02-19'),
		eventEndDate: new Date('2020-03-01'),
		eventName: 'Event 3',
		eventStart: '23:45',
		eventEnd: '01:00',
		eventLocation: 'Issele-Uku',
		organizer: 'Me',
		description: 'Me 2'
	},
	{
		eventID: `4`,
		eventStartDate: new Date('2020-01-01'),
		eventEndDate: new Date('2020-03-03'),
		eventName: 'Event 4',
		eventStart: '06:30',
		eventEnd: '09:00',
		eventLocation: 'Tabernacle of Peace',
		organizer: 'Me',
		description: 'Me 2'
	},
	{
		eventID: `5`,
		eventStartDate: new Date('2020-03-03'),
		eventEndDate: new Date('2020-03-03'),
		eventName: 'Event 5',
		eventStart: '08:00',
		eventEnd: '10:00',
		eventLocation: 'Quatz Event Centre, Gbagada',
		organizer: 'Me',
		description: 'Me 2'
	}];
	public weekdays: string[] = this.func.days;
	public months: Array<string> = this.func.months;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
		this.runCalendar = this.runCalendar.bind(this);
	}

	public render(params) {
		let calendar = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-calendar', 'data-type': 'calendar' }, children: [
				{
					element: 'div', attributes: { id: 'crater-calendar-header', class: 'crater-calendar-header' }, children: [
						{ element: 'i', attributes: { id: 'crater-calendar-header-img', class: 'crater-calendar-header-img', 'data-icon': this.sharePoint.icons.play } },
						{ element: 'h1', attributes: { id: 'crater-calendar-header-text', class: 'crater-calendar-header-text' }, text: 'Calendar' }
					]
				},
				{ element: 'div', attributes: { id: 'crater-calendar-container', class: 'crater-calendar-container' } }
			]
		});

		calendar.querySelector('.crater-calendar-container').innerHTML = `
		<div id="calendar-modal-id" class="calendar-modal">
			<div class="calendar-modal-background"></div>
			<span id="close-calendar-modal">&times;</span>
			<div class="calendar-modal-header">
				<h1>Event Details</h1>
			</div>
			<div class="calendar-modal-content">
				<form id="create-event-form"> 
					<div class="calendar-modal-content-form">
						<label for="start-date">EVENT START DATE:</label>
						<input type="datetime-local" name="start-date" id="start-date" class="calendar-modal-content-form-input">
					</div> 
					<div class="calendar-modal-content-form">
						<label for="end-date">EVENT END DATE:</label>
						<input type="datetime-local" name="end-date" id="end-date" class="calendar-modal-content-form-input">
					</div>
					<div class="calendar-modal-content-form">
						<label for="event-subject">EVENT NAME:</label>
						<input type="text" name="event-subject" id="event-subject" class="calendar-modal-content-form-input">
					</div>
					<div class="calendar-modal-content-form">
						<label for="event-location">EVENT LOCATION:</label>
						<input type="text" name="event-location" id="event-location"  class="calendar-modal-content-form-input">
					</div>
					<div class="calendar-modal-content-form">
						<label for="event-description">EVENT DESCRIPTION:</label>
						<input type="text" name="event-description" id="event-description" class="calendar-modal-content-form-input">
					</div>    
					<div class="calendar-modal-content-form">
						<label for="event-recurring">RECURRING?:</label>
						<select name="event-recurring" id="event-recurring" class="calendar-modal-content-form-input">
							<option value="Weekly">Weekly</option>
							<option value="Monthly">Monthly</option>
							<option value="Yearly">Yearly</option>
							<option value="None">None</option>
						</select>
					</div>    
					<div class="calendar-modal-content-form">
						<input type="checkbox" id="event-online" name="event-online" value="online">
						<label for="event-online">Online Meeting:</label>
					</div>    
					<div id="calendar-modal-content-form-warning">   
						<span> All fields are required! </span>
					</div>
					<div id="calendar-modal-content-form-created">   
						<span> Event created </span>
					</div>

					<div class="calendar-modal-submit-button">
						<input type="button" id="calendar-modal-submit" value="CREATE EVENT">
					</div>
				</form> 
			</div>
		</div>
        <div id="crater-calendar-body-options">
            <div class="crater-calendar-body-options-view">
                <form>    
                    <label for="view">View: </label>
                    <select class="crater-calendar-jump" name="view" id="view">
                        <option value="today" selected>today</option>
                        <option value="week">week</option>
                        <option value="month">month</option>
                    </select>
                </form> 
            </div>
            <div class="crater-calendar-body-options-jumpto">
                <form>
                    <label for="crater-calendar-body-options-month">Jump To: </label>
                    <select class="crater-calendar-jump" name="crater-calendar-body-options-month"
                        id="crater-calendar-body-options-month">
                    </select>

                    <label for="crater-calendar-body-options-year"></label>
                    <select class="crater-calendar-jump" name="crater-calendar-body-options-year" id="crater-calendar-body-options-year">
                    </select>
                </form>
			</div>
        </div>
        <div id="crater-calendar">
            <div class="crater-calendar-body">
                <div class="crater-calendar-body-header-box">
                    <ul>
                        <li id="crater-calendar-previous">&#10094;</li>
                        <li id="crater-calendar-next">&#10095;</li>
                        <li class="crater-calendar-body-header" id="monthAndYear"></li>
                    </ul>       
                </div>  
                <div id="today-view">
                </div> 
                <div id="crater-calendar-table">
                    <table>
                        <thead>
                            <tr id='crater-calendar-weekdays'>
                            </tr>
                        </thead>
                        <tbody id="crater-calendar-table-calendar-body">
                        </tbody>
                    </table>
                    <div class="no-days"><span>No more days</span></div>
                </div>  
            </div>   
            <div class="crater-calendar-event">  
                <span id="close-event" onclick="this.parentElement.classList.remove('show');">x</span>
                <div class="crater-calendar-event-col">
                    <div class="content">
                        <div class="content-header">
                            <div class="date-content"></div>
                            <div class="month-content"></div>
                        </div>  
						<div class="crater-calendar-event-col-notes">
                            <div class="notes-header">  
                                <span id="linkApiClick">Create Event <a href="#"  title="Add Event" class="addNote animate">+</a></span>
                            </div> 
                            <div class="notes-body">
                                <ul class="noteList">
								</ul>
								<div id="sync-message">Please sync from the settings menu first!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
	</div>`;


		this.sharePoint.saveSettings(calendar, {});
		this.key = calendar.dataset.key;
		localStorage.setItem('myCalendar', JSON.stringify(this.eventsArray));
		this.element = calendar;

		return calendar;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		this.runCalendar();
		window.onload = this.runCalendar;
	}

	public runCalendar() {
		let self = this;
		let myCalendar = JSON.parse(this.element.dataset.settings);
		let calendar = this.element;
		let today = new Date();
		let givenDate = today.getDate();
		let givenDay = today.getDay();
		let currentMonth = today.getMonth();
		let currentYear = today.getFullYear();
		let calendarDiv = calendar.querySelector('#crater-calendar-table');
		let tableRow = calendar.querySelector("#crater-calendar-weekdays");
		let selectYear = calendar.querySelector("#crater-calendar-body-options-year");
		let selectMonth = calendar.querySelector("#crater-calendar-body-options-month");
		let alertBox = calendar.querySelector('.crater-calendar-body').querySelector('.no-days');
		let todayView = calendar.querySelector('#today-view');
		let noteList = calendar.querySelector(".noteList");
		let getNodeTime = calendar.querySelectorAll('.date-time');
		let calendarEvent = calendar.querySelector('.crater-calendar-event');
		let dateToShow = today.getDate();
		let monthAndYear = calendar.querySelector("#monthAndYear");
		let selectPane = calendar.querySelector('#crater-calendar-body-options').querySelector('#view') as any;
		let jumpMonth = calendar.querySelector('#crater-calendar-body-options-month');
		let jumpYear = calendar.querySelector('#crater-calendar-body-options-year');
		let calendarPrevious = calendar.querySelector('#crater-calendar-previous');
		let calendarNext = calendar.querySelector('#crater-calendar-next');
		let calendarModalClose = calendar.querySelector('#close-calendar-modal');
		let calendarModalSubmit = calendar.querySelector('#calendar-modal-submit');
		let createEventForm = calendar.querySelector('#close-calendar-modal').parentElement.querySelector('#create-event-form');
		let displayWarning = calendar.querySelector('#calendar-modal-content-form-warning');
		let startDate = calendar.querySelector('#start-date');
		let endDate = calendar.querySelector('#end-date');
		let onlineEvent = calendar.querySelector('#event-online');
		let recurringEvent = calendar.querySelector('#event-recurring');
		let eventSubject = calendar.querySelector('#event-subject');
		let eventLocation = calendar.querySelector('#event-location');
		let eventDescription = calendar.querySelector('#event-description');
		this.eventsArray = JSON.parse(localStorage.getItem('myCalendar'));

		tableRow.innerHTML = '';
		selectMonth.innerHTML = '';
		if (this.eventsArray.length !== 0) {
			for (let eventDetails of this.eventsArray) {
				if (typeof eventDetails.eventStartDate === 'string') {
					eventDetails.eventStartDate = new Date(eventDetails.eventStartDate.split('T')[0]);
					eventDetails.eventEndDate = new Date(eventDetails.eventEndDate.split('T')[0]);
				}
			}
		}

		for (let i = 0; i < this.weekdays.length; i++) {
			calendar.querySelector("#crater-calendar-weekdays").innerHTML += `<th>${this.weekdays[i].substr(0, 3).toUpperCase()}</th>`;
		}

		for (let i = 0; i < this.months.length; i++) {
			calendar.querySelector("#crater-calendar-body-options-month").innerHTML += `<option value=${i}>${this.months[i].toUpperCase()}</option>`;
		}

		for (let i = 1990; i <= 2040; i++) {
			calendar.querySelector("#crater-calendar-body-options-year").innerHTML += `<option value=${i}>${i}</option>`;
		}

		function daysInMonth(iMonth, iYear) {
			return 32 - new Date(iYear, iMonth, 32).getDate();
		}

		function listEvents(accessToken: any, win?: Window) {
			let url = `https://graph.microsoft.com/v1.0/me/events?$select=id,subject,bodyPreview,organizer,start,end,location`;
			let promise: Promise<void> = new Promise((res, rej) => {
				let result;
				let request = new XMLHttpRequest();
				request.onreadystatechange = function (e) {
					if (this.readyState == 4 && this.status == 200) {
						result = request.responseText;
						self.eventsArray = [];
						if (JSON.parse(result).value.length !== 0) {
							for (let each of JSON.parse(result).value) {
								self.eventsArray.push({
									eventID: each.id,
									eventStartDate: new Date(each.start.dateTime.split('T')[0]),
									eventEndDate: new Date(each.start.dateTime.split('T')[0]),
									eventStart: each.start.dateTime.split('T')[1].split('.')[0],
									eventEnd: each.end.dateTime.split('T')[1].split('.')[0],
									eventName: each.subject,
									eventLocation: each.location.displayName,
									organizer: each.organizer.emailAddress.name,
									description: each.bodyPreview
								});
							}
						}
						localStorage.setItem('myCalendar', JSON.stringify(self.eventsArray));
						if (self.eventsArray.length !== 0) {
							self.eventsArray = JSON.parse(localStorage.getItem('myCalendar'));
							for (let eventDetails of self.eventsArray) {
								eventDetails.eventStartDate = new Date(eventDetails.eventStartDate.split('T')[0]);
								eventDetails.eventEndDate = new Date(eventDetails.eventEndDate.split('T')[0]);
							}
						}
						if (win) win.close();
						jump();
					}
				};

				request.open('GET', url, false);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
				request.setRequestHeader('outlook.body-content-type', 'text');
				request.send();
			});

			return promise;
		}

		function linkApiList() {
			if (myCalendar.accessToken) {
				listEvents(myCalendar.accessToken);
			} else if (myCalendar.clientID && myCalendar.redirectURI) {
				try {
					let newWindow = window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${myCalendar.clientID}&response_type=id_token+token&scope=openid+User.Read+Calendars.ReadWrite.Shared&nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304&redirect_uri=${myCalendar.redirectURI}&response_mode=fragment`, 'popup', 'width=600,height=600');
					let apiInterval = setInterval(() => {
						window.onerror = (message, url, line, column, error) => {
							console.log(message, url, line, column, error);
						};
						if (newWindow) {
							if (newWindow.location.href.indexOf('access_token') !== -1) {
								let accessToken = newWindow.location.hash.split('access_token=')[1].split('&')[0];
								myCalendar.accessToken = accessToken;
								listEvents(accessToken, newWindow);
								clearInterval(apiInterval);
							} else if (newWindow.location.href.indexOf('error') !== -1) {
								clearInterval(apiInterval);
							}
						} else {
							console.log('window closed');
							clearInterval(apiInterval);
						}
					}, 1000);
				} catch (error) {
					console.log(error.message);
				}
			}
		}

		function deleteEvent(accessToken: any, id) {
			let url = `https://graph.microsoft.com/v1.0/me/events/${id}`;
			let promise: Promise<void> = new Promise((res, rej) => {
				let result;
				let request: XMLHttpRequest = new XMLHttpRequest();
				request.onreadystatechange = function (e) {
					if (this.readyState == 4 && this.status == 204) {
						linkApiList();
					}
				};
				request.open('DELETE', url, false);
				request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
				request.send();
			});

			return promise;
		}

		function showCalendar(month, year, weekDate, weekDay, todayDate) {
			let firstDay = (new Date(year, month)).getDay();

			let tbl = calendar.querySelector("#crater-calendar-table-calendar-body"); // body of the calendar

			// clearing all previous cells
			tbl.innerHTML = "";

			// filing data about month and in the page via DOM.
			monthAndYear.innerHTML = self.months[month] + " " + year;
			selectYear.value = year;
			selectMonth.value = month;

			if (selectPane.value.toLowerCase() === 'today') {
				let count = 0;
				if (calendarEvent.classList.contains('show')) calendarEvent.classList.remove('show');
				todayView.style.display = 'inline-flex';
				calendarDiv.style.display = 'none';

				monthAndYear.innerHTML = self.months[month] + " " + todayDate + " " + year + `(${count} Events)`;

				todayView.innerHTML = '';
				if (self.eventsArray.length !== 0) {
					let sortEvents = self.eventsArray.slice(0);
					sortEvents.sort((a, b) => {
						if (parseFloat(`${a.eventStart.split(':')[0]}.${a.eventStart.split(':')[1]}`) < parseFloat(`${b.eventStart.split(':')[0]}.${b.eventStart.split(':')[1]}`)) return -1;
						if (parseFloat(`${b.eventStart.split(':')[0]}.${b.eventStart.split(':')[1]}`) < parseFloat(`${a.eventStart.split(':')[0]}.${a.eventStart.split(':')[1]}`)) return 1;
					});
					for (let event of sortEvents) {
						if (event.eventStartDate.toDateString() === (new Date(year, month, todayDate)).toDateString()) {
							todayView.makeElement({
								element: 'div', attributes: { class: 'today-view-event' }, children: [
									{
										element: 'div', attributes: { class: 'today-view-event-wrap' }, children: [
											{
												element: 'div', attributes: { class: 'today-view-event-date' }, children: [
													{ element: 'div', text: event.eventStart },
													{ element: 'div', text: event.eventEnd }
												]
											},
											{
												element: 'div', attributes: { class: 'today-view-event-item' }, children: [
													{ element: 'h3', text: event.eventName },
													{ element: 'p', attributes: { class: 'today-view-event-item-location' }, text: event.eventLocation }
												]
											}
										]
									}
								]
							});
							count++;
							monthAndYear.innerHTML = self.months[month] + " " + todayDate + " " + year + `(${count} Event(s))`;
							if (myCalendar.todayBackgroundColor) {
								todayView.querySelector('.today-view-event-wrap').style.backgroundColor = myCalendar.todayBackgroundColor;
							}
							if (myCalendar.todayTimeColor) {
								todayView.querySelector('.today-view-event-date').style.color = myCalendar.todayTimeColor;
							}
							if (myCalendar.todayTitleColor) {
								todayView.querySelector('.today-view-event-item h3').style.color = myCalendar.todayTitleColor;
							}
							if (myCalendar.todayLocationColor) {
								todayView.querySelector('.today-view-event-item-location').style.color = myCalendar.todayLocationColor;
							}
							if (myCalendar.todayFont) {
								todayView.querySelector('.today-view-event-wrap').style.fontFamily = myCalendar.todayFont;
							}
						}
					}
				}

				if (!todayView.innerHTML) {
					todayView.innerHTML = `
						<div id="no-events"><span>No Scheduled Events</span></div>`;
					if (myCalendar.noEventBackground) {
						todayView.querySelector('#no-events').style.backgroundColor = myCalendar.noEventBackground;
					}
					if (myCalendar.noEventText) {
						todayView.querySelector('#no-events').style.color = myCalendar.noEventText;
					}
					if (myCalendar.noEventFont) {
						todayView.querySelector('#no-events').style.fontFamily = myCalendar.noEventFont;
					}
				}

			}

			if (selectPane.value.toLowerCase() === 'week') {
				calendarDiv.style.display = 'block';
				todayView.style.display = 'none';
				// creates a table row
				let row = document.createElement("tr");

				let date: number = weekDate - weekDay;
				for (let j = 1; j <= 7; j++) {
					let countIt = 0;
					if (j >= 1 && date < 1) {
						const cell = document.createElement("td");
						const cellText = document.createTextNode("");
						cell.appendChild(cellText);
						row.appendChild(cell);
						alertBox.style.display = 'block';
						alertBox.innerHTML = `No more days in ${self.months[month]}, ${year}`;
					} else if (date <= daysInMonth(month, year)) {
						const monthViewWeek = ((date - 6 < 1)) ? (date > 1) ? `${date - date + 1} - ` : '' : `${date - 6} - `;
						monthAndYear.innerHTML = self.months[month] + " " + year + ` (${monthViewWeek}${date})`;
						alertBox.style.display = 'none';
						const cell = document.createElement("td");
						if (new Date(`${month + 1}-${date}-${year}`) < new Date(`${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`)) {
							cell.setAttribute('class', 'crater-calendar-date-past');
							if (myCalendar.pastDateColor) {
								cell.style.color = myCalendar.pastDateColor;
							}
						} else {
							cell.setAttribute('class', 'crater-calendar-date');
							if (myCalendar.currentDateColor) {
								cell.style.color = myCalendar.currentDateColor;
							}
						}
						const cellText = document.createTextNode(`${date}`);
						if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
							cell.style.backgroundColor = (myCalendar.myBackground) ? myCalendar.myBackground : '#1abc9c';
							cell.style.color = (myCalendar.myColor) ? myCalendar.myColor : '#f2f2f2';
							cell.classList.add('current-date');
						}
						if (self.eventsArray.length !== 0) {
							for (let cellDesign of self.eventsArray) {
								if (cellDesign.eventStartDate.toDateString() === (new Date(`${month + 1}-${date}-${year}`)).toDateString()) {
									const eventCellDesign = document.createElement(`span`);
									eventCellDesign.setAttribute('class', 'event-cell-design');
									eventCellDesign.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
									cell.appendChild(eventCellDesign);
								}
							}
						}
						cell.appendChild(cellText);
						if (!cell.classList.contains('current-date')) {
							cell.addEventListener('mouseover', (e: any) => {
								e.target.style.background = (myCalendar.myBackground) ? myCalendar.myBackground : `#1abc9c`;
								e.target.style.transition = '1s ease-in-out';
							});
							cell.addEventListener('mouseout', (e: any) => {
								e.target.style.background = `transparent`;
								e.target.style.transition = '1s ease-in-out';
								if (e.target.firstElementChild && e.target.firstElementChild.classList.contains('event-cell-design')) {
									e.target.querySelectorAll('.event-cell-design').forEach(cellSpan => {
										cellSpan.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
									});
								}
							});
						}

						row.appendChild(cell);

						let calendarDates = calendar.querySelector('#crater-calendar-table-calendar-body');
						calendarDates.addEventListener('click', (ev: any) => {
							if (ev.target.classList.contains('crater-calendar-date') || ev.target.classList.contains('crater-calendar-date-past')) {
								calendar.querySelector('.crater-calendar-event').style.maxHeight = calendar.getBoundingClientRect().height + 'px';
								noteList.innerHTML = '';
								let compareDate1 = new Date(`${month + 1}-${ev.target.textContent}-${year}`);
								compareDate1.setFullYear(Math.abs(year));
								calendar.querySelector("#sync-message").style.display = 'none';
								if (compareDate1 < new Date(`${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`)) {
									calendar.querySelector('.notes-header').style.display = 'none';
								} else {
									calendar.querySelector('.notes-header').style.display = 'block';
								}
								if (self.eventsArray.length !== 0) {
									for (let eventItem of self.eventsArray) {
										if (eventItem.eventStartDate.toDateString() === compareDate1.toDateString()) {
											noteList.innerHTML += ` 
												<li><span event-id="${eventItem.eventID}" class="noteList-collapsible">${eventItem.eventName}<a href="#" id="delete-event" title="Delete Event"
												class="removeNote animate">x</a></span>
													<ul class="noteList-content">
														<li><span class="event-label-color"> Title: </span> ${eventItem.eventName}</li>
														<li><span class="event-label-color"> Location: </span> ${eventItem.eventLocation}</li>
														<li><span class="event-label-color"> Start Time: </span> ${eventItem.eventStart}</li>
														<li><span class="event-label-color"> End Time: </span> ${eventItem.eventEnd}</li>
													</ul>
												</li>`;
											countIt++;
										} else {
											noteList.innerHTML += '';
										}
									}
								}

								if (!noteList.innerHTML) {
									noteList.innerHTML = '<li>No events to show</li>';
								} else {
									let coll = calendar.querySelectorAll(".noteList-collapsible");
									for (let i = 0; i < coll.length; i++) {
										coll[i].addEventListener("click", e => {
											if (e.target.id !== 'delete-event') {
												let content = coll[i].nextElementSibling;
												content.style.maxHeight = (content.style.maxHeight) ? null : content.scrollHeight + "px";
												calendarEvent.style.maxHeight = calendar.querySelector('.crater-calendar-body').getBoundingClientRect().height + 'px';
											}
										});
									}

									coll.forEach(calendarEvent2 => {
										calendarEvent2.querySelector('#delete-event').onclick = () => {
											if (self.eventsArray.length !== 0) {
												for (let e = 0; e < self.eventsArray.length; e++) {
													if (calendarEvent2.getAttribute('event-id') === self.eventsArray[e].eventID) {
														if (myCalendar.accessToken) {
															calendar.querySelector("#sync-message").style.display = 'none';
															deleteEvent(myCalendar.accessToken, calendarEvent2.getAttribute('event-id'));
														} else {
															calendar.querySelector("#sync-message").style.display = 'block';
														}
													}
												}
											}
										};
									});
								}
								calendarEvent.classList.add('show');
								calendar.querySelector('.date-content').textContent = self.weekdays[compareDate1.getDay()];
								calendar.querySelector('.month-content').textContent = `${self.months[month]}  ${ev.target.textContent}, ${year}`;
							}
						});
					} else {
						alertBox.style.display = 'block';
						alertBox.innerHTML = `No more days in ${self.months[month]}, ${year}`;
					}
					date++;
				}

				tbl.appendChild(row); // appending each row into calendar body.
			}

			if (selectPane.value.toLowerCase() === 'month') {
				calendarDiv.style.display = 'block';
				todayView.style.display = 'none';
				alertBox.style.display = 'none';
				let date = 1;

				for (let i = 0; i < 6; i++) {
					// creates a table row
					let row = document.createElement("tr");

					//creating individual cells, filing them up with data.
					for (let j = 0; j < 7; j++) {
						if (i === 0 && j < firstDay) {
							let cell = document.createElement("td");
							let cellText = document.createTextNode("");
							cell.appendChild(cellText);
							row.appendChild(cell);
						}
						else if (date > daysInMonth(month, year)) {
							break;
						}
						else {
							let cell = document.createElement("td");
							if (new Date(`${month + 1}-${date}-${year}`) < new Date(`${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`)) {
								cell.setAttribute('class', 'crater-calendar-date-past');
								if (myCalendar.pastDateColor) {
									cell.style.color = myCalendar.pastDateColor;
								}
							} else {
								cell.setAttribute('class', 'crater-calendar-date');
								if (myCalendar.currentDateColor) {
									cell.style.color = myCalendar.currentDateColor;
								}
							}
							let cellText = document.createTextNode(`${date}`);
							if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
								cell.style.backgroundColor = (myCalendar.myBackground) ? myCalendar.myBackground : '#1abc9c';
								cell.style.color = (myCalendar.myColor) ? myCalendar.myColor : '#f2f2f2';
								cell.classList.add('current-date');
							}
							if (self.eventsArray.length !== 0) {
								for (let cellDesign of self.eventsArray) {
									if (cellDesign.eventStartDate.toDateString() === (new Date(`${month + 1}-${date}-${year}`)).toDateString()) {
										const eventCellDesign = document.createElement(`span`);
										eventCellDesign.setAttribute('class', 'event-cell-design');
										eventCellDesign.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
										cell.appendChild(eventCellDesign);
									}
								}
							}
							cell.appendChild(cellText);
							if (!cell.classList.contains('current-date')) {
								cell.addEventListener('mouseover', (e: any) => {
									e.target.style.background = (myCalendar.myBackground) ? myCalendar.myBackground : `#1abc9c`;
									e.target.style.transition = '1s ease-in-out';
								});
								cell.addEventListener('mouseout', (e: any) => {
									e.target.style.background = `transparent`;
									e.target.style.transition = '1s ease-in-out';
									if (e.target.firstElementChild && e.target.firstElementChild.classList.contains('event-cell-design')) {
										e.target.querySelectorAll('.event-cell-design').forEach(cellSpan => {
											cellSpan.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
										});
									}
								});
							}
							row.appendChild(cell);
							date++;
							let calendarDates1 = calendar.querySelector('#crater-calendar-table-calendar-body');
							calendarDates1.addEventListener('click', (eve: any) => {
								if (eve.target.classList.contains('crater-calendar-date') || eve.target.classList.contains('crater-calendar-date-past')) {
									calendarEvent.style.maxHeight = calendar.querySelector('.crater-calendar-body').getBoundingClientRect().height + 'px';
									noteList.innerHTML = '';
									let compareDate = new Date(`${month + 1}-${eve.target.textContent}-${year}`);
									compareDate.setFullYear(Math.abs(year));
									calendar.querySelector("#sync-message").style.display = 'none';
									if (compareDate < new Date(`${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`)) {
										calendar.querySelector('.notes-header').style.display = 'none';
									} else {
										calendar.querySelector('.notes-header').style.display = 'block';
									}
									if (self.eventsArray.length !== 0) {
										for (let eventItem of self.eventsArray) {
											if (eventItem.eventStartDate.toDateString() === compareDate.toDateString()) {
												noteList.innerHTML += ` 
												<li><span event-id="${eventItem.eventID}" class="noteList-collapsible">${eventItem.eventName}<a href="#" id="delete-event" title="Delete Event"
												class="removeNote animate">x</a></span>
													<ul class="noteList-content">
														<li><span class="event-label-color"> Title: </span> ${eventItem.eventName}</li>
														<li><span class="event-label-color"> Location: </span> ${eventItem.eventLocation}</li>
														<li><span class="event-label-color"> Start Time: </span> ${eventItem.eventStart}</li>
														<li><span class="event-label-color"> End Time: </span> ${eventItem.eventEnd}</li>
													</ul>
												</li>`;
											} else {
												noteList.innerHTML += '';
											}
										}
									}
									if (!noteList.innerHTML) {
										noteList.innerHTML = '<li>No events to show</li>';
									} else {
										let coll = calendar.querySelectorAll(".noteList-collapsible");
										for (let x = 0; x < coll.length; x++) {
											coll[x].addEventListener("click", e => {
												if (e.target.id !== 'delete-event') {
													let content = coll[x].nextElementSibling;
													content.style.maxHeight = (content.style.maxHeight) ? null : content.scrollHeight + "px";
													calendarEvent.style.maxHeight = calendar.querySelector('.crater-calendar-body').getBoundingClientRect().height + 'px';
												}
											});
										}

										coll.forEach(calendarEvent1 => {
											calendarEvent1.querySelector('#delete-event').onclick = () => {
												if (self.eventsArray.length !== 0) {
													for (let e = 0; e < self.eventsArray.length; e++) {
														if (calendarEvent1.getAttribute('event-id') === self.eventsArray[e].eventID) {
															if (myCalendar.accessToken) {
																calendar.querySelector("#sync-message").style.display = 'none';
																deleteEvent(myCalendar.accessToken, calendarEvent1.getAttribute('event-id'));
															} else {
																calendar.querySelector("#sync-message").style.display = 'block';
															}
														}
													}
												}
											};
										});
									}
									calendarEvent.classList.add('show');
									calendar.querySelector('.date-content').textContent = self.weekdays[compareDate.getDay()];
									calendar.querySelector('.month-content').textContent = `${self.months[month]}  ${eve.target.textContent}, ${year}`;

								}
							});
						}
					}
					tbl.appendChild(row); // appending each row into calendar body.
				}
			}
			self.element.querySelector('#crater-calendar-table-calendar-body').style.height = '200px';

		}

		showCalendar(currentMonth, currentYear, givenDate, givenDay, dateToShow);

		function next() {
			if (selectPane.value.toLowerCase() === 'today') {
				if (dateToShow >= daysInMonth(selectMonth.value, selectYear.value)) {
					dateToShow = 0;
					currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
					currentMonth = (currentMonth + 1) % 12;
				}
				dateToShow += 1;
			}

			if (selectPane.value.toLowerCase() === 'week') {
				givenDate += 7;
				if (givenDate > daysInMonth(selectMonth.value, selectYear.value)) {
					currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
					currentMonth = (currentMonth + 1) % 12;
					givenDate = (new Date(currentYear, currentMonth, 1)).getDate();
					givenDay = (new Date(currentYear, currentMonth, 1)).getDay();
				}
			}

			if (selectPane.value.toLowerCase() === 'month') {
				currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
				currentMonth = (currentMonth + 1) % 12;
			}

			showCalendar(currentMonth, currentYear, givenDate, givenDay, dateToShow);
		}

		function previous() {
			if (selectPane.value.toLowerCase() === 'today') {
				if (dateToShow == 1) {
					currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
					currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
					dateToShow = daysInMonth(currentMonth, selectYear.value) + 1;
				}
				dateToShow -= 1;
			}

			if (selectPane.value.toLowerCase() === 'week') {
				givenDate -= 7;
				if (givenDate <= 1) {
					currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
					currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
					givenDate = (new Date(currentYear, currentMonth, daysInMonth(currentMonth, currentYear))).getDate();
					givenDay = (new Date(currentYear, currentMonth, daysInMonth(currentMonth, currentYear))).getDay();
				}
			}

			if (selectPane.value.toLowerCase() === 'month') {
				currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
				currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
			}

			showCalendar(currentMonth, currentYear, givenDate, givenDay, dateToShow);
		}

		function jump() {
			dateToShow = 1;
			currentYear = parseInt(selectYear.value);
			currentMonth = parseInt(selectMonth.value);
			givenDate = (new Date(currentYear, currentMonth, 1)).getDate();
			givenDay = (new Date(currentYear, currentMonth, 1)).getDay();
			showCalendar(currentMonth, currentYear, givenDate, givenDay, dateToShow);
		}

		function createEvent(accessToken: any, win?: Window) {
			let url = `https://graph.microsoft.com/v1.0/me/events`;
			let promise: Promise<void> = new Promise((res, rej) => {
				let result;
				let request: XMLHttpRequest = new XMLHttpRequest();
				const eventTimeZone = (new Date(startDate.value).toString()).split('(')[1].split(')')[0];
				const recurringEventType = (recurringEvent.value.includes('Monthly') || recurringEvent.value.includes('Yearly')) ? `relative${recurringEvent.value}` : recurringEvent.value;
				const recurrence = (recurringEventType.toLowerCase() === "none") ? "" : {
					pattern: {
						type: recurringEventType,
						interval: 1,
						daysOfWeek: this.func.days[(new Date(startDate.value)).getDay()]
					},
					range: {
						type: "endDate",
						startDate: startDate.value.split('T')[0],
						endDate: endDate.value.split('T')[0]
					}
				};
				const event = {
					subject: eventSubject.value,
					body: {
						contentType: "HTML",
						content: eventDescription.value
					},
					bodyPreview: eventDescription.value,
					start: {
						dateTime: startDate.value,
						timeZone: "West Africa Standard Time"
					},
					end: {
						dateTime: endDate.value,
						timeZone: "West Africa Standard Time"
					},
					recurrence,
					location: {
						displayName: eventLocation.value
					},
					isOnlineMeeting: onlineEvent.checked
				};

				request.onreadystatechange = function (e) {
					if (this.readyState == 4 && this.status == 201) {
						result = request.responseText;
						createEventForm.reset();
						linkApiList();
						let createEventCount = 5;
						calendar.querySelector('#calendar-modal-content-form-created').style.display = 'block';
						if (win) win.close();
						let createEventInterval = setInterval(() => {
							if (createEventCount !== 0) {
								calendar.querySelector('#calendar-modal-content-form-created').textContent = `Event created! This window will close in ${createEventCount} seconds`;
								createEventCount--;
							} else {
								calendarModalClose.parentElement.style.display = 'none';
								clearInterval(createEventInterval);
							}
						}, 1000);
					}
				};



				request.open('POST', url, false);
				request.setRequestHeader('Content-Type', 'application/json');
				request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
				request.setRequestHeader('Prefer', `outlook.timezone="West Africa Standard Time"`);
				request.send(JSON.stringify(event));
			});

			return promise;
		}

		function linkApiCreate() {
			if (myCalendar.accessToken) createEvent(myCalendar.accessToken);
			else if (myCalendar.clientID && myCalendar.redirectURI) {
				try {
					let newWindow = window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${myCalendar.clientID}&response_type=id_token+token&scope=openid+User.Read+Calendars.ReadWrite.Shared&nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304&redirect_uri=${myCalendar.redirectURI}&response_mode=fragment`, 'popup', 'width=600,height=600');
					let apiInterval = setInterval(() => {
						window.onerror = (message, url, line, column, error) => {
							console.log(message, url, line, column, error);
						};
						if (newWindow) {
							if (newWindow.location.href.indexOf('access_token') !== -1) {
								let accessToken = newWindow.location.hash.split('access_token=')[1].split('&')[0];
								myCalendar.accessToken = accessToken;
								createEvent(accessToken, newWindow);
								clearInterval(apiInterval);
							} else if (newWindow.location.href.indexOf('error') !== -1) {
								clearInterval(apiInterval);
							}
						} else {
							clearInterval(apiInterval);
						}
					}, 1000);
				} catch (error) {
					console.log(error.message);
				}
			} else {
				calendar.querySelector('#calendar-modal-content-form-created').style.display = 'block';
				calendar.querySelector('#calendar-modal-content-form-created').textContent = `Please sync from the settings menu first!`;
			}
		}

		calendarPrevious.onclick = (event) => previous();

		calendarNext.onclick = (event) => next();

		selectPane.onchange = (event) => jump();

		jumpMonth.onchange = (event) => jump();

		jumpYear.onchange = (event) => jump();

		calendar.querySelector('#linkApiClick').addEventListener('click', (e) => {
			calendarModalClose.parentElement.style.display = 'block';
			calendar.querySelector('#calendar-modal-content-form-created').style.display = 'none';
		});

		calendarModalClose.onclick = () => {
			calendarModalClose.parentElement.style.display = 'none';
		};

		calendarModalSubmit.onclick = () => {
			if (!startDate.value) startDate.style.border = '1px solid #d6b4b4';
			else startDate.style.border = 'none';

			if (!endDate.value) endDate.style.border = '1px solid #d6b4b4';
			else endDate.style.border = 'none';

			if (!eventSubject.value) eventSubject.style.border = '1px solid #d6b4b4';
			else eventSubject.style.border = 'none';

			if (!eventLocation.value) eventLocation.style.border = '1px solid #d6b4b4';
			else eventLocation.style.border = 'none';

			if (!eventDescription.value) eventDescription.style.border = '1px solid #d6b4b4';
			else eventDescription.style.border = 'none';

			if (!recurringEvent.value) recurringEvent.style.border = '1px solid #d6b4b4';
			else recurringEvent.style.border = 'none';

			if (!startDate.value || !endDate.value || !eventSubject.value || !eventLocation.value || !eventDescription.value || !recurringEvent.value) {
				displayWarning.style.display = 'block';
			} else {
				linkApiCreate();
				displayWarning.style.display = 'none';
			}
		};

		window.onresize = () => {
			this.element.querySelector('.crater-calendar-event').style.maxHeight = this.element.querySelector('.crater-calendar-body').getBoundingClientRect().height + 'px';
		};
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset.key;
		this.element = params.element;
		let view = this.element.querySelector('#crater-calendar-body-options').querySelector('#view') as any;
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
				element: 'div', attributes: { class: 'calendar-layout-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Layout'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'calendar-height', value: this.element.querySelector('#crater-calendar-table').querySelector('table').css()['height']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'calendar-header-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Header'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.querySelector('.crater-calendar-header-img').dataset.icon }
							}),
							this.cell({
								element: 'input', name: 'text-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'span', name: 'text', edit: 'change-text', html: this.element.querySelector('.crater-calendar-header-text').textContent
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'toggle-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'TOGGLE DISPLAY'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'header', options: ['show', 'hide']
							}),
							this.cell({
								element: 'select', name: 'navigation', options: ['show', 'hide']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'month-year-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Month and Year Header'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'text-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.crater-calendar-body-header-box').css()['font-family']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'weekdays-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Weekdays'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'text-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('#crater-calendar-weekdays').css()['font-family']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'side-panel-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Side Panel'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'weekday-text-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'date-text-color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.crater-calendar-event').css()['font-family']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'fetch-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'SYNC WITH OUTLOOK'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'message-note' }, children: [
							{
								element: 'div', attributes: { class: 'message-text' }, children: [
									{ element: 'p', attributes: { id: 'outlook-fetch', style: { color: 'green' } }, text: `NOTE: click this button to sync` }
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Client-Id'
							}),
							this.cell({
								element: 'input', name: 'Redirect-URI'
							}),
							this.createElement(
								{ element: 'button', attributes: { id: 'fetch-event', class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Sync' }
							)
						]
					})
				]
			});
		}
		return this.paneContent;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.querySelector('.crater-property-content').monitor();
		let view = this.element.querySelector('#crater-calendar-body-options').querySelector('#view') as any;
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let myCalendar = JSON.parse(params.element.dataset.settings);

		let fetchPane = this.paneContent.querySelector('.fetch-pane');
		let togglePane = this.paneContent.querySelector('.toggle-pane');
		let monthYearPane = this.paneContent.querySelector('.month-year-pane');
		let weekdayPane = this.paneContent.querySelector('.weekdays-pane');
		let calendarHeaderPane = this.paneContent.querySelector('.calendar-header-pane');
		let calendarLayoutPane = this.paneContent.querySelector('.calendar-layout-pane');
		let calendarSidePanel = this.paneContent.querySelector('.side-panel-pane');

		let headerCell = togglePane.querySelector('#header-cell');
		headerCell.onchange = () => {
			switch (headerCell.value.toLowerCase()) {
				case 'show':
					draftDom.querySelector('.crater-calendar-header').style.display = 'flex';
					break;
				case 'hide':
					draftDom.querySelector('.crater-calendar-header').style.display = 'none';
					break;
				default:
					draftDom.querySelector('.crater-calendar-header').style.display = 'flex';
			}
		};

		let navigationCell = togglePane.querySelector('#navigation-cell');
		navigationCell.onchange = () => {
			switch (navigationCell.value.toLowerCase()) {
				case 'show':
					draftDom.querySelector('#crater-calendar-body-options').style.display = 'flex';
					break;
				case 'hide':
					draftDom.querySelector('#crater-calendar-body-options').style.display = 'none';
					break;
				default:
					draftDom.querySelector('#crater-calendar-body-options').style.display = 'flex';
			}
		};

		calendarSidePanel.querySelector('#background-color-cell').onchange = () => {
			draftDom.querySelector('.crater-calendar-event').style.backgroundColor = calendarSidePanel.querySelector('#background-color-cell').value;
			calendarSidePanel.querySelector('#background-color-cell').setAttribute('value', calendarSidePanel.querySelector('#background-color-cell').value);
		};

		calendarSidePanel.querySelector('#weekday-text-color-cell').onchange = () => {
			draftDom.querySelector('.crater-calendar-event').querySelector('.date-content').style.color = calendarSidePanel.querySelector('#weekday-text-color-cell').value;
			calendarSidePanel.querySelector('#weekday-text-color-cell').setAttribute('value', calendarSidePanel.querySelector('#weekday-text-color-cell').value);
		};


		calendarSidePanel.querySelector('#date-text-color-cell').onchange = () => {
			draftDom.querySelector('.crater-calendar-event').querySelector('.month-content').style.color = calendarSidePanel.querySelector('#date-text-color-cell').value;
			calendarSidePanel.querySelector('#date-text-color-cell').setAttribute('value', calendarSidePanel.querySelector('#date-text-color-cell').value);
		};


		calendarSidePanel.querySelector('#font-type-cell').onChanged(fontFamily => {
			draftDom.querySelector('.crater-calendar-event').css({ fontFamily });
		});

		monthYearPane.querySelector('#background-color-cell').onchange = () => {
			const backgroundColor = monthYearPane.querySelector('#background-color-cell').value;
			draftDom.querySelector('.crater-calendar-body-header-box').style.backgroundColor = backgroundColor;
			myCalendar.myBackground = backgroundColor;
			monthYearPane.querySelector('#background-color-cell').setAttribute('value', myCalendar.myBackground);
		};

		monthYearPane.querySelector('#text-color-cell').onchange = () => {
			const color = monthYearPane.querySelector('#text-color-cell').value;
			draftDom.querySelectorAll('.crater-calendar-body-header-box ul li').forEach(list => list.css({ color }));
			myCalendar.myColor = color;
			monthYearPane.querySelector('#text-color-cell').setAttribute('value', myCalendar.myColor);
		};

		monthYearPane.querySelector('#font-type-cell').onChanged(fontFamily => {
			draftDom.querySelector('.crater-calendar-body-header-box').css({ fontFamily });
		});

		weekdayPane.querySelector('#background-color-cell').onchange = () => {
			const weekdayBackground = weekdayPane.querySelector('#background-color-cell').value;
			draftDom.querySelector('#crater-calendar-weekdays').style.backgroundColor = weekdayBackground;
			weekdayPane.querySelector('#background-color-cell').setAttribute('value', weekdayBackground);
		};

		weekdayPane.querySelector('#text-color-cell').onchange = () => {
			const color = weekdayPane.querySelector('#text-color-cell').value;
			draftDom.querySelectorAll('#crater-calendar-weekdays').forEach(list => list.css({ color }));
			weekdayPane.querySelector('#text-color-cell').setAttribute('value', color);
		};

		weekdayPane.querySelector('#font-type-cell').onChanged(fontFamily => {
			draftDom.querySelector('#crater-calendar-weekdays').css({ fontFamily });
		});

		calendarHeaderPane.querySelector('#icon-cell').checkChanges(() => {
			draftDom.querySelector('.crater-calendar-header-img').removeClasses(draftDom.querySelector('.crater-calendar-header-img').dataset.icon);
			draftDom.querySelector('.crater-calendar-header-img').addClasses(calendarHeaderPane.querySelector('#icon-cell').dataset.icon);
			draftDom.querySelector('.crater-calendar-header-img').dataset.icon = calendarHeaderPane.querySelector('#icon-cell').dataset.icon;
		});

		calendarHeaderPane.querySelector('#text-color-cell').onchange = () => {
			const color = calendarHeaderPane.querySelector('#text-color-cell').value;
			draftDom.querySelector('.crater-calendar-header-text').css({ color });
			draftDom.querySelector('.crater-calendar-header').style.borderBottom = `2px solid ${color}`;
			calendarHeaderPane.querySelector('#text-color-cell').setAttribute('value', color);
			draftDom.querySelector('.crater-calendar-header-img').css({ color });
		};

		calendarHeaderPane.querySelector('#text-cell').checkChanges(() => {
			draftDom.querySelector('.crater-calendar-header-text').copy(calendarHeaderPane.querySelector('#text-cell'));
		});

		calendarLayoutPane.querySelector('#calendar-height-cell').onChanged(height => {
			draftDom.querySelector('#crater-calendar-table').querySelector('table').css({ height });
		});

		let currentDate = this.cell({
			element: 'input', name: 'text-color', dataAttributes: { type: 'color' }, value: myCalendar.currentDateColor || '#000'
		});

		let pastDate = this.cell({
			element: 'input', name: 'past-date-text-color', dataAttributes: { type: 'color' }, value: myCalendar.pastDateColor || '#000'
		});

		let makeCurrentBlock = (draftDom.querySelector('.crater-calendar-date')) ? currentDate : ``;
		let makePastBlock = (draftDom.querySelector('.crater-calendar-date-past')) ? pastDate : ``;

		if (view.value.toLowerCase() !== 'today') {
			if (this.paneContent.querySelector('.calendar-body-pane')) this.paneContent.querySelector('.calendar-body-pane').remove();
			if (this.paneContent.querySelector('.calendar-today-pane')) this.paneContent.querySelector('.calendar-today-pane').remove();
			if (this.paneContent.querySelector('.calendar-no-event-pane')) this.paneContent.querySelector('.calendar-no-event-pane').remove();

			let makeContent = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'calendar-body-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Calendar Body (Month and Week View)'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }
							}),
							makeCurrentBlock,
							makePastBlock,
							this.cell({
								element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: draftDom.querySelector('#crater-calendar-table-calendar-body').css()['font-family']
							})
						]
					})
				]
			});

			this.paneContent.insertBefore(makeContent, fetchPane);

			let calendarBodyPane = this.paneContent.querySelector('.calendar-body-pane');
			calendarBodyPane.querySelector('#background-color-cell').onchange = () => {
				draftDom.querySelector('#crater-calendar-table-calendar-body').style.backgroundColor = calendarBodyPane.querySelector('#background-color-cell').value;
				calendarBodyPane.querySelector('#background-color-cell').setAttribute('value', calendarBodyPane.querySelector('#background-color-cell').value);
			};


			if (calendarBodyPane.querySelector('#text-color-cell')) {
				calendarBodyPane.querySelector('#text-color-cell').onchange = () => {
					myCalendar.currentDateColor = calendarBodyPane.querySelector('#text-color-cell').value;
					calendarBodyPane.querySelector('#text-color-cell').setAttribute('value', myCalendar.currentDateColor);
				};
			}


			if (calendarBodyPane.querySelector('#past-date-text-color-cell')) {
				calendarBodyPane.querySelector('#past-date-text-color-cell').onchange = () => {
					myCalendar.pastDateColor = calendarBodyPane.querySelector('#past-date-text-color-cell').value;
					calendarBodyPane.querySelector('#past-date-text-color-cell').setAttribute('value', myCalendar.pastDateColor);
				};
			}


			calendarBodyPane.querySelector('#font-type-cell').onChanged(value => {
				draftDom.querySelector('#crater-calendar-table-calendar-body').style.fontFamily = value;
			});
		} else {
			if (this.element.querySelector('.today-view-event-wrap')) {
				if (this.paneContent.querySelector('.calendar-today-pane')) this.paneContent.querySelector('.calendar-today-pane').remove();
				if (this.paneContent.querySelector('.calendar-body-pane')) this.paneContent.querySelector('.calendar-body-pane').remove();
				if (this.paneContent.querySelector('.calendar-no-event-pane')) this.paneContent.querySelector('.calendar-no-event-pane').remove();

				let makeToday = this.paneContent.makeElement({
					element: 'div', attributes: { class: 'calendar-today-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								this.createElement({
									element: 'h2', attributes: { class: 'title' }, text: 'Calendar Body (Today View)'
								})
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: myCalendar.todayBackgroundColor || '#000'
								}),
								this.cell({
									element: 'input', name: 'time-text-color', dataAttributes: { type: 'color' }, value: myCalendar.todayTimeColor || '#000'
								}),
								this.cell({
									element: 'input', name: 'title-text-color', dataAttributes: { type: 'color' }, value: myCalendar.todayTitleColor || '#000'
								}),
								this.cell({
									element: 'input', name: 'location-text-color', dataAttributes: { type: 'color' }, value: myCalendar.todayLocationColor || '#00'
								}),
								this.cell({
									element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: this.element.querySelector('.today-view-event-wrap').css()['font-family']
								})
							]
						})
					]
				});

				this.paneContent.insertBefore(makeToday, fetchPane);


				let calendarTodayPane = this.paneContent.querySelector('.calendar-today-pane');
				calendarTodayPane.querySelector('#background-color-cell').onchange = () => {
					myCalendar.todayBackgroundColor = calendarTodayPane.querySelector('#background-color-cell').value;
					calendarTodayPane.querySelector('#background-color-cell').setAttribute('value', myCalendar.todayBackgroundColor);
				};


				calendarTodayPane.querySelector('#time-text-color-cell').onchange = () => {
					myCalendar.todayTimeColor = calendarTodayPane.querySelector('#time-text-color-cell').value;
					calendarTodayPane.querySelector('#time-text-color-cell').setAttribute('value', myCalendar.todayTimeColor);
				};

				calendarTodayPane.querySelector('#title-text-color-cell').onchange = () => {
					myCalendar.todayTitleColor = calendarTodayPane.querySelector('#title-text-color-cell').value;
					calendarTodayPane.querySelector('#title-text-color-cell').setAttribute('value', myCalendar.todayTitleColor);
				};

				calendarTodayPane.querySelector('#location-text-color-cell').onchange = () => {
					myCalendar.todayLocationColor = calendarTodayPane.querySelector('#location-text-color-cell').value;
					calendarTodayPane.querySelector('#location-text-color-cell').setAttribute('value', myCalendar.todayLocationColor);
				};

				calendarTodayPane.querySelector('#font-type-cell').onChanged(value => {
					myCalendar.todayFont = value;
				});
			} else {
				if (this.paneContent.querySelector('.calendar-no-event-pane')) this.paneContent.querySelector('.calendar-no-event-pane').remove();
				if (this.paneContent.querySelector('.calendar-today-pane')) this.paneContent.querySelector('.calendar-today-pane').remove();
				if (this.paneContent.querySelector('.calendar-body-pane')) this.paneContent.querySelector('.calendar-body-pane').remove();

				let makeNoEvent = this.paneContent.makeElement({
					element: 'div', attributes: { class: 'calendar-no-event-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								this.createElement({
									element: 'h2', attributes: { class: 'title' }, text: 'Calendar Body (Today View (No Event))'
								})
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								this.cell({
									element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: myCalendar.noEventBackground || '#000'
								}),
								this.cell({
									element: 'input', name: 'time-text-color', dataAttributes: { type: 'color' }, value: myCalendar.noEventText || '#000'
								}),
								this.cell({
									element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: myCalendar.noEventFont || this.element.querySelector('#no-events').css()['font-family']
								})
							]
						})
					]
				});

				this.paneContent.insertBefore(makeNoEvent, fetchPane);


				let calendarNoEventPane = this.paneContent.querySelector('.calendar-no-event-pane');
				calendarNoEventPane.querySelector('#background-color-cell').onchange = () => {
					myCalendar.noEventBackground = calendarNoEventPane.querySelector('#background-color-cell').value;
					calendarNoEventPane.querySelector('#background-color-cell').setAttribute('value', myCalendar.noEventBackground);
				};

				calendarNoEventPane.querySelector('#time-text-color-cell').onchange = () => {
					myCalendar.noEventText = calendarNoEventPane.querySelector('#time-text-color-cell').value;
					calendarNoEventPane.querySelector('#time-text-color-cell').setAttribute('value', myCalendar.noEventText);
				};

				calendarNoEventPane.querySelector('#font-type-cell').onChanged(value => {
					myCalendar.noEventFont = value;
				});
			}
		}

		let listEvents = (accessToken: any, win?: Window) => {
			let url = `https://graph.microsoft.com/v1.0/me/events?$select=id,subject,bodyPreview,organizer,start,end,location`;
			let self = this;
			let promise: Promise<void> = new Promise((res, rej) => {
				let result;
				let request = new XMLHttpRequest();
				request.onreadystatechange = function (e) {
					if (this.readyState == 4 && this.status == 200) {
						result = request.responseText;
						self.eventsArray = [];
						draftDom.querySelector('#today-view').innerHTML = '';
						draftDom.querySelector(".noteList").innerHTML = '';
						if (JSON.parse(result).value.length !== 0) {
							for (let each of JSON.parse(result).value) {
								self.eventsArray.push({
									eventID: each.id,
									eventStartDate: new Date(each.start.dateTime.split('T')[0]),
									eventEndDate: new Date(each.start.dateTime.split('T')[0]),
									eventStart: each.start.dateTime.split('T')[1].split('.')[0],
									eventEnd: each.end.dateTime.split('T')[1].split('.')[0],
									eventName: each.subject,
									eventLocation: each.location.displayName,
									organizer: each.organizer.emailAddress.name,
									description: each.bodyPreview
								});
							}
						}
						myCalendar = JSON.parse(draftDom.dataset.settings);
						myCalendar.clientID = fetchPane.querySelector('#Client-Id-cell').value;
						myCalendar.redirectURI = fetchPane.querySelector('#Redirect-URI-cell').value;
						if (self.eventsArray.length !== 0) {
							fetchPane.querySelector('#outlook-fetch').style.color = 'green';
							fetchPane.querySelector('#outlook-fetch').innerHTML = `Events Updated!`;
							for (let eventDetails of self.eventsArray) {
								eventDetails.eventStartDate = new Date(eventDetails.eventStartDate.split('T')[0]);
								eventDetails.eventEndDate = new Date(eventDetails.eventEndDate.split('T')[0]);
							}
							localStorage.setItem('myCalendar', JSON.stringify(self.eventsArray));
							self.sharePoint.saveSettings(draftDom, myCalendar);
						}
						if (win) win.close();
					}
				};

				request.open('GET', url, false);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
				request.setRequestHeader('outlook.body-content-type', 'text');
				request.send();
			});

			return promise;
		};

		let linkApiList = (givenClient, redirectLink) => {
			try {
				let newWindow = window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${givenClient}&response_type=id_token+token&scope=openid+User.Read+Calendars.ReadWrite.Shared&nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304&redirect_uri=${redirectLink}&response_mode=fragment`, 'popup', 'width=600,height=600');
				let apiInterval = setInterval(() => {
					window.onerror = (message, url, line, column, error) => {
						console.log(message, url, line, column, error);
					};
					if (newWindow) {
						if (newWindow.location.href.indexOf('access_token') !== -1) {
							let accessToken = newWindow.location.hash.split('access_token=')[1].split('&')[0];
							myCalendar.accessToken = accessToken;
							this.sharePoint.saveSettings(draftDom, myCalendar);
							listEvents(accessToken, newWindow);
							clearInterval(apiInterval);
						} else if (newWindow.location.href.indexOf('error') !== -1) {
							fetchPane.querySelector('#outlook-fetch').style.color = 'red';
							fetchPane.querySelector('#outlook-fetch').textContent = 'Please make sure you granted permissions on your Azure application';
							clearInterval(apiInterval);
						}
					} else {
						console.log('window closed');
						clearInterval(apiInterval);
					}
				}, 1000);
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchPane.querySelector('#fetch-event').onclick = () => {
			fetchPane.querySelector('#outlook-fetch').innerHTML = `<img class='crater-icon' src=${this.sharePoint.images.loading} width='20' height='20'>`;
			if (!fetchPane.querySelector('#Client-Id-cell').value || !fetchPane.querySelector('#Redirect-URI-cell').value) {
				fetchPane.querySelector('#outlook-fetch').style.color = 'red';
				fetchPane.querySelector('#outlook-fetch').textContent = 'These fields cannot be empty! Please fill them in';
			} else {
				linkApiList(fetchPane.querySelector('#Client-Id-cell').value, fetchPane.querySelector('#Redirect-URI-cell').value);
			}
		};

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			let selectedValue = this.element.querySelector('#crater-calendar-body-options').querySelector('#view').value;
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;
			this.element.querySelector('#crater-calendar-body-options').querySelector('#view').value = selectedValue;

			this.sharePoint.saveSettings(this.element, myCalendar);
			this.runCalendar();
		});
	}
}

export { Calendar };