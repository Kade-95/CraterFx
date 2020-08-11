import { ElementModifier } from './../ElementModifier';

class CountDown extends ElementModifier {
	private params: any;
	public element: any;
	public key: any;
	private paneContent: any;
	private interval: any;

	constructor(params) {
		super(params);
	}

	public render(params) {
		let endDate = this.func.today();
		//caculate seconds to 12 mid-night
		let endTime = '23:59:59';

		let countDown = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-countdown', 'data-type': 'countdown' }, children: [
				{
					element: 'div', attributes: { class: 'crater-countdown-content', id: 'crater-countdown-content' }, children: [
						{
							element: 'span', attributes: { class: 'crater-countdown-block crater-countdown-notification', id: 'crater-countdown-block crater-countdown-notification' }, children: [
								{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.bell, class: 'crater-icon', id: 'crater-countdown-notification-icon' } }
							]
						},
						{
							element: 'span', attributes: { class: 'crater-countdown-block crater-countdown-days', id: 'crater-countdown-block crater-countdown-days' }, children: [
								{ element: 'span', attributes: { class: 'crater-countdown-counting', id: 'crater-countdown-counting' } },
								{ element: 'h2', attributes: { class: 'crater-countdown-label', id: 'crater-countdown-label' }, text: 'Days' }
							]
						},
						{
							element: 'span', attributes: { class: 'crater-countdown-block crater-countdown-hours', id: 'crater-countdown-block crater-countdown-hours' }, children: [
								{ element: 'span', attributes: { class: 'crater-countdown-counting', id: 'crater-countdown-counting' } },
								{ element: 'h2', attributes: { class: 'crater-countdown-label', id: 'crater-countdown-label' }, text: 'Hours' }
							]
						},
						{
							element: 'span', attributes: { class: 'crater-countdown-block crater-countdown-minutes', id: 'crater-countdown-block crater-countdown-minutes' }, children: [
								{ element: 'span', attributes: { class: 'crater-countdown-counting', id: 'crater-countdown-counting' } },
								{ element: 'h2', attributes: { class: 'crater-countdown-label', id: 'crater-countdown-label' }, text: 'Minutes' }
							]
						},
						{
							element: 'span', attributes: { class: 'crater-countdown-block crater-countdown-seconds', id: 'crater-countdown-block crater-countdown-seconds' }, children: [
								{ element: 'span', attributes: { class: 'crater-countdown-counting', id: 'crater-countdown-counting' } },
								{ element: 'h2', attributes: { class: 'crater-countdown-label', id: 'crater-countdown-label' }, text: 'Seconds' }
							]
						},
					]
				}
			]
		});

		let settings = {
			endTime, endDate
		};

		this.key = countDown.dataset.key;
		this.sharePoint.saveSettings(countDown, settings);
		return countDown;
	}

	public rendered(params) {
		this.params = params;
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		let day = Math.floor(this.func.secondsTillDate(settings.endDate));
		let time = Math.floor(this.func.isTimeValid(settings.endTime));

		let moment = day + time;
		let secondsTillNow = this.func.secondsTillNow();
		let secondsTogoCurrently = moment - secondsTillNow;

		let past = () => {
			return moment < this.func.secondsTillNow();
		};
		// endDate: 637053724800
		// endTime: 86399

		// endDate: 6370531891200
		// endTime: 86399
		let pastDate = { days: 0, hours: 0, minutes: 0, seconds: 0 };

		let date: any = past() ? pastDate : this.func.getDateObject(secondsTogoCurrently);

		this.element.find('.crater-countdown-days').find('.crater-countdown-counting').textContent = date.days;
		this.element.find('.crater-countdown-hours').find('.crater-countdown-counting').textContent = date.hours;
		this.element.find('.crater-countdown-minutes').find('.crater-countdown-counting').textContent = date.minutes;
		this.element.find('.crater-countdown-seconds').find('.crater-countdown-counting').textContent = date.seconds;

		let deg = 20;
		let img = this.element.find('.crater-countdown-notification > i');

		clearInterval(this.sharePoint.attributes.pane.content[this.key].interval);

		if (!past()) {
			this.sharePoint.attributes.pane.content[this.key].interval = setInterval(() => {
				date = this.func.getDateObject(--secondsTogoCurrently);
				this.element.find('.crater-countdown-days').find('.crater-countdown-counting').textContent = date.days;

				this.element.find('.crater-countdown-hours').find('.crater-countdown-counting').textContent = date.hours;

				this.element.find('.crater-countdown-minutes').find('.crater-countdown-counting').textContent = date.minutes;

				this.element.find('.crater-countdown-seconds').find('.crater-countdown-counting').textContent = date.seconds;

				deg = -deg;
				img.css({ transform: `rotate(${deg}deg)` });
			}, 1000);
		}
		else {
			this.sharePoint.attributes.pane.content[this.key].interval = setInterval(() => {
				deg = -deg;
				img.css({ transform: `rotate(${deg}deg)` });
			}, 100);
		}
	}

	public setUpPaneContent(params) {
		this.element = params.element;
		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		});
		this.key = this.element.dataset.key;

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			this.paneContent.makeElement({ element: 'div' });

			let countingPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'counting-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Countdown Counts'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'FontSize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'FontStyle', list: this.func.fontStyles
							}),
						]
					})
				]
			});

			let labelPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'label-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Countdown Label'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'BackgroundColor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'FontSize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'FontStyle', list: this.func.fontStyles
							}),
						]
					})
				]
			});

			let settingsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Countdown Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'i', name: 'Icon', edit: 'upload-icon', dataAttributes: { 'data-icon': this.sharePoint.icons.bell, class: 'crater-icon' }
							}),
							this.cell({
								element: 'input', name: 'Date', dataAttributes: { type: 'date' }
							}),
							this.cell({
								element: 'input', name: 'Time', dataAttributes: { type: 'time' }
							}),
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							}),
							this.cell({
								element: 'input', name: 'BorderRadius', list: this.func.pixelSizes
							}),
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

		let countingPane = this.paneContent.find('.counting-pane');

		countingPane.find('#Color-cell').onChanged(color => {
			draftDom.findAll('.crater-countdown-counting').forEach(element => {
				element.css({ color });
			});
		});

		countingPane.find('#BackgroundColor-cell').onChanged(backgroundColor => {
			draftDom.findAll('.crater-countdown-counting').forEach(element => {
				element.css({ backgroundColor });
			});
		});

		countingPane.find('#FontSize-cell').onChanged(fontSize => {
			draftDom.findAll('.crater-countdown-counting').forEach(element => {
				element.css({ fontSize });
			});
		});

		countingPane.find('#FontStyle-cell').onChanged(fontFamily => {
			draftDom.findAll('.crater-countdown-counting').forEach(element => {
				element.css({ fontFamily });
			});
		});

		let labelPane = this.paneContent.find('.label-pane');

		labelPane.find('#Color-cell').onChanged(color => {
			draftDom.findAll('.crater-countdown-label').forEach(element => {
				element.css({ color });
			});
		});

		labelPane.find('#BackgroundColor-cell').onChanged(backgroundColor => {
			draftDom.findAll('.crater-countdown-label').forEach(element => {
				element.css({ backgroundColor });
			});
		});

		labelPane.find('#FontSize-cell').onChanged(size => {
			draftDom.findAll('.crater-countdown-label').forEach(element => {
				element.css({ fontSize: size });
			});
		});

		labelPane.find('#FontStyle-cell').onChanged(style => {
			draftDom.findAll('.crater-countdown-label').forEach(element => {
				element.css({ fontFamily: style });
			});
		});

		let settingsPane = this.paneContent.find('.settings-pane');

		let settingsIcon = settingsPane.find('#Icon-cell');
		let settingsDate = settingsPane.find('#Date-cell');
		let settingsTime = settingsPane.find('#Time-cell');
		let settingsBorder = settingsPane.find('#Border-cell');
		let settingsBorderRadius = settingsPane.find('#BorderRadius-cell');

		settingsIcon.checkChanges(() => {
			draftDom.find('.crater-icon').removeClasses(draftDom.find('.crater-icon').dataset.icon);
			draftDom.find('.crater-icon').addClasses(settingsIcon.dataset.icon);
			draftDom.find('.crater-icon').dataset.icon = settingsIcon.dataset.icon;
		});

		settingsDate.onChanged();
		settingsTime.onChanged();

		settingsBorder.onChanged(border => {
			draftDom.findAll('.crater-countdown-block').forEach(element => {
				element.css({ border });
			});
		});

		settingsBorderRadius.onChanged(borderRadius => {
			draftDom.findAll('.crater-countdown-block').forEach(element => {
				element.css({ borderRadius });
			});
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;

			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			if (this.func.isDate(settingsDate.value)) {
				settings.endDate = settingsDate.value;
			}

			if (this.func.isTimeValid(settingsTime.value)) {
				settings.endTime = settingsTime.value;
			}

			this.sharePoint.saveSettings(this.element, settings, settingsClone);
		});
	}
}

export { CountDown };