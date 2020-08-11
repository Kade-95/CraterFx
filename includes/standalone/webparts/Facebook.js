import { ElementModifier } from './../ElementModifier';

export class Facebook extends ElementModifier {
	private params: any;
	public key: any;
	public elementModifier = new ElementModifier();
	public pageURL: any = `https://www.facebook.com/ipisolutionsnigerialtd`;
	public element: any;
	public paneContent: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		let facebookDiv = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-facebook', 'data-type': 'facebook' }
		});

		const settings = { url: this.pageURL, tabs: 'timeline,messages,events', smallHeader: 'false', hideCover: 'false', showFacePile: 'false', width: facebookDiv.getBoundingClientRect().width, height: '', adaptContainer: 'true' };
		this.sharePoint.saveSettings(facebookDiv, settings);
		this.key = facebookDiv.dataset.key;
		this.element = facebookDiv;

		return facebookDiv;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset['key'];
		const facebook = JSON.parse(params.element.dataset.settings);
		this.faceBookSettings({ url: facebook.url, dataTabs: facebook.tabs, smallHeader: facebook.smallHeader, hideCover: facebook.hideCover, showFacePile: facebook.showFacePile, width: facebook.width, height: facebook.height, adaptContainer: facebook.adaptContainer });
	}

	public faceBookSettings(params) {
		const facebookSettings = JSON.parse(this.element.dataset.settings);
		window.onerror = (msg, url, lineNumber, columnNumber, error) => {
			console.log(msg, url, lineNumber, columnNumber, error);
		};
		try {
			this.key = this.element.dataset['key'];
			const width = (params.width) ? params.width : facebookSettings.width;
			const height = (params.height) ? params.height : facebookSettings.height;
			let crater = this.element.querySelector('.crater-facebook-content');
			if (crater) crater.remove();

			let facebookContent = this.createElement({
				element: 'div', attributes: { class: 'crater-facebook-content' }
			});
			this.element.appendChild(facebookContent);

			facebookContent.makeElement({
				element: 'div', attributes: { id: 'fb-root' }
			});
			facebookContent.makeElement({
				element: 'script', attributes: { class: "facebook-script", src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v5.0&appId=541045216450969&autoLogAppEvents=1', async: true, defer: true }
			});
			facebookContent.makeElement({
				element: 'div', attributes: {
					class: 'fb-page',
					'data-href': params.url, 'data-tabs': params.dataTabs, 'data-width': width, 'data-height': height, 'data-small-header': params.smallHeader, 'data-adapt-container-width': params.adaptContainer, 'data-hide-cover': params.hideCover, 'data-show-facepile': params.showFacePile
				}
			});

			window['FB'].init({
				appId: '541045216450969',
				autoLogAppEvents: true,
				xfbml: true,
				version: 'v5.0'
			});

		} catch (error) {
			console.log(error.message);
		}

	}

	public setUpPaneContent(params) {
		this.key = params.element.dataset['key'];
		this.element = params.element;
		const fbSettings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		});

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;

		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		} else {
			// console.log(params)
			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' },
						children: [
							this.createElement({
								element: 'h2', attributes: { class: "title" }, text: 'Page'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' },
						children: [
							this.cell({
								element: 'input', name: 'pageUrl',
								value:
									//this.defaultURL
									params.element.querySelector('.fb-page ').dataset.href
							}),
							this.cell({
								element: 'input', name: 'Tabs', value: fbSettings.tabs
							}),
							this.cell({
								element: 'select', name: 'hide-cover', options: ['show', 'hide']
							}),
							this.cell({
								element: 'select', name: 'hide-facepile', options: ['show', 'hide']
							}),
							this.cell({
								element: 'select', name: 'small-header', options: ['show', 'hide']
							}),
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'size-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Size'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							{
								element: 'div', attributes: { class: 'message-note' }, children: [
									{
										element: 'div', attributes: { class: 'message-text' }, children: [
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `Adapt to container width: Fit the component to parent container's width. The minimum and maximum width values below still apply` },
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `Width: min:180 max: 500 pixels` },
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `Height: min: 70 max: 1600 pixels` }
										]
									}
								]
							}]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'container-width', options: ['true', 'false']
							}),
							this.cell({
								element: 'input', name: 'width', value: fbSettings.width || ''
							}),
							this.cell({
								element: 'input', name: 'height', value: fbSettings.height || ''
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) { }

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		this.paneContent = this.sharePoint.app.querySelector(".crater-property-content").monitor();

		let titlePane = this.paneContent.querySelector('.title-pane');
		let sizePane = this.paneContent.querySelector('.size-pane');
		const facebook = JSON.parse(params.element.dataset.settings);
		const fbSettingsClone: any = {};


		titlePane.querySelector('#pageUrl-cell').onChanged(value => {
			fbSettingsClone.url = value;
		});
		titlePane.querySelector('#Tabs-cell').onChanged(value => {
			fbSettingsClone.tabs = value;
		});
		let coverCell = titlePane.querySelector('#hide-cover-cell');
		coverCell.addEventListener('change', e => {
			coverCell.setAttribute('value', coverCell.value);
			switch (coverCell.value.toLowerCase()) {
				case 'show':
					fbSettingsClone.hideCover = 'false';
					break;
				case 'hide':
					fbSettingsClone.hideCover = 'true';
					break;
				default:
					fbSettingsClone.hideCover = 'false';
			}
		});

		let hideFacePileCell = titlePane.querySelector('#hide-facepile-cell');
		hideFacePileCell.addEventListener('change', e => {
			hideFacePileCell.setAttribute('value', hideFacePileCell.value);
			switch (hideFacePileCell.value.toLowerCase()) {
				case 'show':
					fbSettingsClone.showFacePile = 'false';
					break;
				case 'hide':
					fbSettingsClone.showFacePile = 'true';
					break;
			}
		});

		let showHeaderCell = titlePane.querySelector('#small-header-cell');
		showHeaderCell.addEventListener('change', e => {
			showHeaderCell.setAttribute('value', showHeaderCell.value);
			switch (showHeaderCell.value.toLowerCase()) {
				case 'show':
					fbSettingsClone.smallHeader = 'false';
					break;
				case 'hide':
					fbSettingsClone.smallHeader = 'true';
					break;
				default:
					fbSettingsClone.smallHeader = 'false';
			}
		});

		sizePane.querySelector('#width-cell').onChanged(value => {
			fbSettingsClone.width = value;
		});

		sizePane.querySelector('#height-cell').onChanged(value => {
			fbSettingsClone.height = value;
		});

		let adaptCell = sizePane.querySelector('#container-width-cell');
		adaptCell.addEventListener('change', e => {
			fbSettingsClone.adaptContainer = adaptCell.value;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

			this.sharePoint.saveSettings(this.element, facebook, fbSettingsClone);
		});
	}
}
