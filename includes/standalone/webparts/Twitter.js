import { ElementModifier } from './../ElementModifier';
import { ColorPicker } from './../ColorPicker';

class Twitter extends ElementModifier {
	public key: any;
	public params: any;
	public paneContent: any;
	public element: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		let twitter = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-twitter', 'data-type': 'twitter', style: { maxHeight: '500px' } }, children: [
				{ element: 'div', attributes: { id: 'crater-twitter-feed', class: 'crater-twitter-feed' } }
			]
		});

		this.func.objectCopy(params, twitter.dataset);
		this.key = twitter.dataset.key;
		const settings = {
			'data-width': 1000,
			'data-height': 500,
			'data-link-color': '#d6ff27',
			'data-theme': 'light',
			'data-tweet-limit': 3,
			username: 'TwitterDev',
		};
		this.sharePoint.saveSettings(twitter, settings);


		return twitter;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		this.runTwitter();
	}

	public runTwitter() {
		const twitterObj = JSON.parse(this.element.dataset.settings);

		let self = this;

		if (twitterObj['data-tweet-limit']) {
			this.element.style.maxHeight = `${twitterObj['data-height']}px`;
		} else {
			this.element.style.maxHeight = '100%';
		}

		this.element.querySelector('.crater-twitter-feed').innerHTML = `<a class='twitter-timeline' id='twitter-embed' max-width='100%' data-width= ${twitterObj['data-width']} data-height=${twitterObj['data-height']} lang='EN' href='https://twitter.com/${twitterObj.username}' data-link-color=${twitterObj['data-link-color']} data-theme=${twitterObj['data-theme']} data-tweet-limit=${twitterObj['data-tweet-limit']}>
		Tweets by @${twitterObj.username}</a>`;

		let twitterFunction = (s: string, id: string) => {
			let js: any;
			if (self.element.querySelector('#twitter-wjs')) self.element.querySelector('#twitter-wjs').remove();
			let t = window['twttr'] || {};
			js = document.createElement(s);
			js.id = id;
			js.src = "https://platform.twitter.com/widgets.js";
			self.element.querySelector('.crater-twitter-feed').parentNode.insertBefore(js, self.element.querySelector('.crater-twitter-feed'));

			t._e = [];
			t.ready = (f) => {
				t._e.push(f);
			};

			return t;
		};

		window['twttr'] = (twitterFunction("script", "twitter-wjs"));

		// Define our custom event handlers
		let clickEventToAnalytics = (intentEvent) => {
			if (!intentEvent) return;
			var label = intentEvent.region;
			window['pageTracker']._trackEvent('twitter_web_intents', intentEvent.type, label);
		};

		let tweetIntentToAnalytics = (intentEvent) => {
			if (!intentEvent) return;
			var label = "tweet";
			window['pageTracker']._trackEvent(
				'twitter_web_intents',
				intentEvent.type,
				label
			);
		};

		let likeIntentToAnalytics = (intentEvent) => {
			tweetIntentToAnalytics(intentEvent);
		};

		let retweetIntentToAnalytics = (intentEvent) => {
			if (!intentEvent) return;
			var label = intentEvent.data.source_tweet_id;
			window['pageTracker']._trackEvent(
				'twitter_web_intents',
				intentEvent.type,
				label
			);
		};

		let followIntentToAnalytics = (intentEvent) => {
			if (!intentEvent) return;
			var label = intentEvent.data.user_id + " (" + intentEvent.data.screen_name + ")";
			window['pageTracker']._trackEvent(
				'twitter_web_intents',
				intentEvent.type,
				label
			);
		};

		// Wait for the asynchronous resources to load
		try {
			window['twttr'].ready((twttr) => {
				// Now bind our custom intent events
				twttr.events.bind('click', clickEventToAnalytics);
				twttr.events.bind('tweet', tweetIntentToAnalytics);
				twttr.events.bind('retweet', retweetIntentToAnalytics);
				twttr.events.bind('like', likeIntentToAnalytics);
				twttr.events.bind('follow', followIntentToAnalytics);
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();
		let twitterObj = JSON.parse(this.element.dataset.settings);

		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'twitter-options-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'OPTIONS'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'message-note' }, children: [
							{
								element: 'div', attributes: { class: 'message-text' }, children: [
									{ element: 'p', attributes: { style: { color: 'green' } }, text: `NOTE: Clear the 'number of tweets' field to display all tweets` },
									{ element: 'p', attributes: { style: { color: 'green' } }, text: `      Please Enter a Valid Username` }
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'username', value: twitterObj.username
							}),
							this.cell({
								element: 'select', name: 'theme', options: ['LIGHT', 'DARK'], value: twitterObj['data-theme'].toUpperCase()
							}),
							this.cell({
								element: 'input', name: 'link-color', dataAttributes: { type: 'color' }, value: twitterObj['data-link-color']
							}),
							this.cell({
								element: 'input', name: 'number-of-tweets', value: twitterObj['data-tweet-limit']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'twitter-size-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'SIZE CONTROL'
							})
						]
					}),

					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'width', value: twitterObj['data-width']
							}),
							this.cell({
								element: 'input', name: 'height', value: twitterObj['data-height']
							})
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
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		const settings = JSON.parse(this.element.dataset.settings);
		const settingsClone: any = {};

		// let twitterObj = this.sharePoint.attributes.pane.content[this.key].settings.twitter;

		let twitterOptions = this.paneContent.querySelector('.twitter-options-pane');
		let twitterSize = this.paneContent.querySelector('.twitter-size-pane');

		twitterOptions.querySelector('#username-cell').onChanged(value => {
			settingsClone.username = value;
		});

		twitterOptions.querySelector('#theme-cell').onChanged(value => {
			settingsClone['data-theme'] = value.toLowerCase();
		});

		twitterOptions.querySelector('#number-of-tweets-cell').onChanged(value => {
			settingsClone['data-tweet-limit'] = value;
		});

		twitterOptions.querySelector('#link-color-cell').onchange = () => {
			settingsClone['data-link-color'] = twitterOptions.querySelector('#link-color-cell').value;
			twitterOptions.querySelector('#link-color-cell').setAttribute('value', twitterOptions.querySelector('#link-color-cell').value);
		};

		twitterSize.querySelector('#width-cell').onChanged(value => {
			settingsClone['data-width'] = value;
		});

		twitterSize.querySelector('#height-cell').onChanged(value => {
			settingsClone['data-height'] = value;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

			this.sharePoint.saveSettings(this.element, settings, settingsClone);
		});
	}
}

export { Twitter };