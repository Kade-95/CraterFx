import { ElementModifier } from './../ElementModifier';

class Instagram extends ElementModifier {
	public params;
	public element;
	public key;
	public paneContent;
	public defaultURL = 'https://www.instagram.com/p/B0Qyddphpht/';
	public endpoint;
	public displayed = false;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params?) {
		let instagramDiv = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-instagram', 'data-type': 'instagram' }, children: [
				{
					element: 'div', attributes: { id: 'crater-instagram-error', class: 'crater-instagram-error' }, children: [
						{ element: 'p', text: 'Are you sure that URL is valid? please enter a URL shortcode' }
					]
				},
				{ element: 'div', attributes: { id: 'crater-instagram-content', class: 'crater-instagram-content' } }
			]
		});


		this.sharePoint.saveSettings(instagramDiv, {});
		this.key = instagramDiv.dataset.key;
		this.element = instagramDiv;
		this.getEmbed();
		return instagramDiv;
	}

	public getEmbed(params?) {
		window.onerror = (message, url, line, column, error) => {
			console.log(message, url, line, column, error);
		};
		let fetchHtml: any = new Promise((resolve, reject) => {
			let urlPoint = 'https://api.instagram.com/oembed?url=' + this.defaultURL + '&amp;maxwidth=320&amp;omitscript=true';

			if (params !== undefined) urlPoint = 'https://api.instagram.com/oembed?url=' + params;

			let getData = fetch(urlPoint);
			if (getData) resolve(getData);
			else reject(new Error('couldn\'t fetch data'));
		});

		fetchHtml.then(response => {
			return response.json();
		}, error => {
			console.log(error);
		}).then(responseData => {
			if (this.displayed) {
				let instaDiv = this.sharePoint.app.querySelector('.crater-instagram');
				instaDiv.removeChild(instaDiv.querySelector('.crater-instagram-content'));
				console.log('removed');
				let child = this.createElement({
					element: 'div', attributes: { class: 'crater-instagram-content' }
				});
				instaDiv.appendChild(child);
				this.renderInstagramPost(responseData.html);

			} else {
				this.renderInstagramPost(responseData.html);
				this.displayed = true;
			}
		}, error => {
			let errorMessage = this.sharePoint.app.querySelector('.crater-instagram-error');
			console.log(errorMessage);

			errorMessage.style.display = 'block';
		}).catch(error => {
			console.log(error.message);
		});
	}

	public renderInstagramPost(params?) {
		this.element = this.sharePoint.app.querySelector('.crater-instagram');
		let errorMessage = this.sharePoint.app.querySelector('.crater-instagram-error');
		errorMessage.style.display = 'none';
		this.key = this.element.dataset['key'];
		let display = params;
		let instaContent = this.sharePoint.app.querySelector('.crater-instagram-content');
		instaContent.innerHTML = '';

		let embedScript = document.createElement('script');
		embedScript.setAttribute('src', '//www.instagram.com/embed.js');
		embedScript.setAttribute('async', '');
		instaContent.appendChild(embedScript);
		instaContent.innerHTML += display;
		embedScript.addEventListener('load', e => {
			window['instgrm'].Embeds.process();
		});
	}

	public rendered(params) {
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		this.paneContent = this.createElement({
			elemen: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {//check if draft pane content is not empty and set it to the pane content
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'instagram-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Edit Instagram Properties'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							{
								element: 'div', attributes: { class: 'message-note' }, children: [
									{
										element: 'div', attributes: { class: 'message-text' }, children: [
											{ element: 'p', text: 'NOTE:' },
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `Please, do not add a unit when entering a width i.e. the correct format is '320' not '320px'` },
										]
									}
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'postUrl', value: this.defaultURL
							}),
							this.cell({
								element: 'select', name: 'hideCaption', options: ['show', 'hide']
							}),
							this.cell({
								element: 'input', name: 'width', attributes: { placeholder: 'Please enter a width' }, value: this.element.querySelector('.crater-instagram-content').css()['height'] || ''
							})
						]
					})
				]
			});

		}
		return this.paneContent;
	}

	public generatePaneContent(params) {

	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		const settings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.sharePoint.app.querySelector('.crater-property-content').monitor();

		let instagramPane = this.paneContent.querySelector('.instagram-pane');
		let postUrl = instagramPane.querySelector('#postUrl-cell');
		postUrl.value = settings.postUrl || this.defaultURL;
		postUrl.onChanged(value => {
			settings.postUrl = value;
			postUrl.setAttribute('value', value);
			settingsClone.instaURL = value;
			this.defaultURL = settingsClone.instaURL;
			let finalWidth = settingsClone.instaWidth || '&amp;minwidth=320&amp;maxwidth=320';
			const finalHide = (settingsClone.instaCaption) ? '&amp;hidecaption=true' : '';

			settings.newEndPoint = settings.instaURL + `&amp;omitscript=true${finalHide}${finalWidth}`;
		});

		let hideCaption = instagramPane.querySelector('#hideCaption-cell');
		hideCaption.value = settings.hideCaption || 'show';
		hideCaption.addEventListener('change', e => {
			settings.hideCaption = hideCaption.value;
			let finalWidth = settings.instaWidth || '&amp;minwidth=320&amp;maxwidth=320';
			let finalURL = settings.instaURL || this.defaultURL;
			switch (hideCaption.value.toLowerCase()) {
				case 'hide':
					settings.instaCaption = true;
					settings.newEndPoint = finalURL + `&amp;omitscript=true&amp;hidecaption=true${finalWidth}`;
					break;
				case 'show':
					settings.instaCaption = false;
					settings.newEndPoint = finalURL + `&amp;omitscript=true${finalWidth}`;
					break;
			}
		});

		let changeWidth = instagramPane.querySelector('#width-cell');
		changeWidth.value = settings.width || '320';
		changeWidth.onChanged(value => {
			settings.width = value;
			settings.instaWidth = `&amp;minwidth=${value}&amp;maxwidth=${value}`;
			let finalURL = settings.instaURL || this.defaultURL;
			const finalHide = (settings.instaCaption) ? '&amp;hidecaption=true' : '';

			settings.newEndPoint = finalURL + `&amp;omitscript=true${finalHide}${settings.instaWidth}`;

		});


		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.getEmbed(settings.newEndPoint);
			this.element.innerHTML = draftDom.innerHTML;//upate the webpart
			this.element.css(draftDom.css());
			this.sharePoint.saveSettings(this.element, settings, settingsClone);


		});
	}
}

export { Instagram };