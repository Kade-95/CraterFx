import { ElementModifier } from './../ElementModifier';

export class YouTube extends ElementModifier {
	public element;
	public key;
	public paneContent;

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		const youtube = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-youtube', 'data-type': 'youtube' }, children: [
				{
					element: 'div', attributes: { id: 'crater-youtube-contents', class: 'crater-youtube-contents' }, children: [
						{
							element: 'div', attributes: { class: 'crater-iframe' }, children: [
								{ element: 'iframe', attributes: { id: 'player', type: 'text/html', width: '640', height: '390', src: `https://www.youtube.com/embed/M7lc1UVf-VE?origin=${location.href}&autoplay=1&enablejsapi=1&widgetid=1`, frameborder: '0' } }
							]
						}
					]
				}
			]
		});


		this.sharePoint.saveSettings(youtube, { defaultVideo: 'https://www.youtube.com/embed/M7lc1UVf-VE', width: '640', height: '390' });
		this.key = youtube.dataset.key;

		let youtubeContent = youtube.find('.crater-youtube-contents');
		youtubeContent.makeElement({
			element: 'script', attributes: { src: 'https://www.youtube.com/iframe_api' }
		});

		return youtube;
	}

	public rendered(params) { }

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		const settings = JSON.parse(this.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {//check if draft pane content is not empty and set it to the pane content
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'youtube-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Customise Youtube'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							{
								element: 'div', attributes: { class: 'message-note' }, children: [
									{ element: 'span', attributes: { id: 'videoURL', style: { color: 'green' } }, text: `Note: The Video URL is in this format "https://youtu.be/SHoBUYvsjsc"` },
								]
							}]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'videoURL', value: settings.defaultVideo
							}),
							this.cell({
								element: 'input', name: 'width', value: settings.width
							}),
							this.cell({
								element: 'input', name: 'height', value: settings.height
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
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let settings = JSON.parse(params.element.dataset.settings);
		let settingsClone: any = {};

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let youtubePane = this.paneContent.find('.youtube-pane');

		youtubePane.find('#videoURL-cell').onChanged(value => {
			if (value.indexOf('.be/') !== -1) {
				youtubePane.find('#videoURL').style.color = 'green';
				youtubePane.find('#videoURL').textContent = 'Valid URL';
				settingsClone.defaultVideo = 'https://www.youtube.com/embed/' + value.split('.be/')[1];
			} else {
				youtubePane.find('#videoURL').style.color = 'red';
				youtubePane.find('#videoURL').textContent = 'Invalid Video URL. Please right click on the video to get the video URL';
			}

		});

		youtubePane.find('#width-cell').onChanged(value => {
			settingsClone.width = value;
		});

		youtubePane.find('#height-cell').onChanged(value => {
			settingsClone.height = value;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.sharePoint.saveSettings(this.element, settings, settingsClone);

			let draftDomIframe = draftDom.find('.crater-iframe');

			draftDomIframe.innerHTML = '';

			draftDomIframe.makeElement({
				element: 'iframe', attributes: { id: 'player2', type: 'text/html', width: settings.width, height: settings.height, src: `${settings.defaultVideo}?origin=${location.href}&autoplay=1&enablejsapi=1&widgetid=1`, frameborder: '0' }
			});

			this.element.innerHTML = draftDom.innerHTML;//upate the webpart
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;
		});
	}
}