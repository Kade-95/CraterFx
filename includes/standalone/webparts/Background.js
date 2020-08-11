import { ElementModifier } from './../ElementModifier';

class Background extends ElementModifier {
	public element: any;
	public key: any;
	public paneContent: any;

	constructor(public params: any) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		const background = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-background crater-component', 'data-type': 'background' }, children: [
				{
					element: 'div', attributes: { id: 'crater-background-container', class: 'crater-background-container' }, children: [
						{ element: 'button', attributes: { id: 'crater-background-toggle-mute', class: 'crater-background-toggle-mute' }, text: 'Mute' },
						{ element: 'div', attributes: { id: 'crater-background-container-bg-image', class: 'crater-background-container-bg-image' } },
						{
							element: 'video', attributes: { autoplay: true, muted: false, loop: true, poster: 'http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg', id: 'crater-background-container-video' }, children: [
								{ element: 'source', attributes: { src: "", type: "video/mp4" } }
							]
						},
						{
							element: 'div', attributes: { id: 'crater-background-container-content', class: 'crater-background-container-content' }, children: [
								{ element: 'div' },
								{ element: 'div', attributes: { class: 'crater-background-container-content-text', id: 'crater-background-container-content-text' } },
								{ element: 'div' }
							]
						}
					]
				}
			]
		});

		const settings = { mode: 'Image', sound: 'Unmute', autoplay: 'False', loop: 'True', parallax: 'On', blur: 'Light', layout: 'Standard', vA: 'Center', hA: 'Middle', transparency: '0.4', view: 'Pop Up' };
		this.sharePoint.saveSettings(background, settings);

		return background;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		const videoSettings = JSON.parse(params.element.dataset.settings);
		const video = params.element.querySelector('#crater-background-container-video');
		const toggleButton = params.element.querySelector('.crater-background-container-content-text');
		const toggleMute = this.element.querySelector('.crater-background-toggle-mute');

		switch (videoSettings.mode.toLowerCase()) {
			case 'video':
				video.load();
				video.onloadeddata = () => {
					if (videoSettings.mode.toLowerCase() === 'video') playVideo();
				};
				toggleMute.style.zIndex = 2;
				toggleMute.style.opacity = 1;

				const showMuteTimeout = setTimeout(() => {
					toggleMute.style.zIndex = -1;
					toggleMute.style.opacity = 0;
				}, 8000);

				toggleButton.onmouseover = () => {
					if (videoSettings.mode.toLowerCase() === 'video') pauseVideo();
				};

				toggleButton.onmouseout = () => {
					if (videoSettings.mode.toLowerCase() === 'video') playVideo();
				};

				toggleMute.onclick = () => {
					video.muted = (video.muted) ? false : true;
					videoSettings.sound = (video.muted) ? 'Unmute' : 'Mute';
					toggleMute.innerHTML = (video.muted) ? 'Unmute' : 'Mute';
				};
				break;
			case 'image':
				toggleMute.style.opacity = 0;
				toggleMute.style.zIndex = -1;
				pauseVideo();
				break;
		}

		function playVideo() {
			const promise = video.play();

			if (promise !== undefined) {
				promise
					.then((_) => console.log("Autoplay Started"))
					.catch(error => {
						console.log("Autoplay was prevented.");
						video.play();
					});
			}
		}

		function pauseVideo() {
			video.pause();
		}
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
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
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'general-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'General Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'width', value: this.element.css().width
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.css().height
							}),
							this.cell({
								element: 'select', name: 'mode', options: ['Image', 'Video']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'image-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Image Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'img', edit: 'upload-image', name: 'image-url', dataAttributes: { class: 'crater-icon', src: this.element.querySelector('.crater-background-container-bg-image').style.backgroundImage }
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'video-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Video Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'message-note' }, children: [
							{
								element: 'div', attributes: { class: 'message-text' }, children: [
									{ element: 'p', attributes: { style: { color: 'green' } }, text: `NOTE: If you wish to use a video file from your local machine, first upload it to an external directory (e.g. Sharepoint library) and then use the URL` }
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'img', edit: 'upload-image', name: 'cover-photo', dataAttributes: { class: 'crater-icon', src: this.element.querySelector('video').poster }
							}),
							this.cell({
								element: 'input', name: 'video-url',
							}),
							this.cell({
								element: 'select', name: 'sound', options: ['Mute', 'Unmute']
							}),
							this.cell({
								element: 'select', name: 'autoplay', options: ['True', 'False']
							}),
							this.cell({
								element: 'select', name: 'loop', options: ['True', 'False']
							}),
						]
					})
				]
			});

			let sectionContentsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card background-contents-pane' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Background Contents'
							})
						]
					}),
				]
			});

			let contents = this.element.find('.crater-background-container-content-text').findAll('.keyed-element');

			for (let i = 0; i < contents.length; i++) {
				sectionContentsPane.makeElement({
					element: 'div',
					attributes: {
						style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-background-content-row-pane row'
					},
					children: [
						this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-background-content-row' }),
						this.createElement({
							element: 'h3', attributes: { id: 'name' }, text: contents[i].dataset.type.toUpperCase()
						})
					]
				});
			}

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'background-layout-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Background Layout Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'layout', options: ['Full', 'Standard', 'Full Height', 'Full width']
							}),
							this.cell({
								element: 'select', name: 'vertical-alignment', options: ['Top', 'Center', 'Bottom']
							}),
							this.cell({
								element: 'select', name: 'horizontal-alignment', options: ['Left', 'Middle', 'Right']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'background-color-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Background Color Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'transparency', options: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
							}),
							this.cell({
								element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: ''
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'special-effects-settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Special Effects Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'parallax', options: ['Off', 'On']
							}),
							this.cell({
								element: 'select', name: 'blur', options: ['None', 'Light', 'Medium', 'Strong']
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
		this.key = params.element.dataset.key;
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		const videoSettings = JSON.parse(params.element.dataset.settings);
		const settingsClone: any = {};
		const video = this.element.querySelector('video');

		window.onerror = (message, url, line, column, error) => {
			console.log(message, url, line, column, error);
		};

		video.pause();

		const generalSettings = this.paneContent.querySelector('.general-settings-pane');
		generalSettings.querySelector('#width-cell').onChanged(width => {
			this.element.css({ width });
			generalSettings.querySelector('#width-cell').setAttribute('value', width);
		});

		generalSettings.querySelector('#height-cell').onChanged(height => {
			this.element.css({ height });
			generalSettings.querySelector('#height-cell').setAttribute('value', height);
		});

		generalSettings.querySelector('#mode-cell').value = videoSettings.mode;
		generalSettings.querySelector('#mode-cell').onchange = () => {
			settingsClone.mode = generalSettings.querySelector('#mode-cell').value;
			switch (generalSettings.querySelector('#mode-cell').value.toLowerCase()) {
				case 'image':
					this.element.querySelector('.crater-background-container-bg-image').style.display = 'block';
					this.element.querySelector('.crater-background-container-bg-image').style.zIndex = 1;
					this.element.querySelector('#crater-background-container-video').style.display = 'none';
					this.element.querySelector('#crater-background-container-video').style.zIndex = '-1';
					generalSettings.querySelector('#mode-cell').options[1].selected = true;
					break;

				case 'video':
					this.element.querySelector('#crater-background-container-video').style.display = 'block';
					this.element.querySelector('#crater-background-container-video').style.zIndex = 1;
					this.element.querySelector('.crater-background-container-bg-image').style.zIndex = '-1';
					this.element.querySelector('.crater-background-container-bg-image').style.display = 'none';
					generalSettings.querySelector('#mode-cell').options[2].selected = true;
					break;
			}
		};

		this.paneContent.querySelector('#image-url-cell').checkChanges(() => {
			this.element.querySelector('.crater-background-container-bg-image').style.backgroundImage = `url(${this.paneContent.querySelector('#image-url-cell').src})`;
		});

		this.paneContent.querySelector('#cover-photo-cell').checkChanges(() => {
			this.element.querySelector('video').poster = this.paneContent.querySelector('#cover-photo-cell').src;
		});

		const videoURL = this.paneContent.querySelector('#video-url-cell');
		videoURL.onchange = () => video.querySelector('source').src = videoURL.value;

		const bgColorSettings = this.paneContent.querySelector('.background-color-settings-pane');
		bgColorSettings.querySelector('#transparency-cell').value = videoSettings.transparency;
		bgColorSettings.querySelector('#transparency-cell').onchange = () => {
			settingsClone.transparency = bgColorSettings.querySelector('#transparency-cell').value;
			bgColorSettings.querySelector('#transparency-cell').setAttribute('value', bgColorSettings.querySelector('#transparency-cell').value);
		};

		bgColorSettings.querySelector('#background-color-cell').value = videoSettings.backgroundColor || settingsClone.backgroundColor || '#000000';
		bgColorSettings.querySelector('#background-color-cell').onchange = () => {
			const colorValue = bgColorSettings.querySelector('#background-color-cell').value;
			const { transparency } = (settingsClone.transparency) ? settingsClone : videoSettings;
			const backgroundColor = `rgba(${parseInt(colorValue.substring(1, 3), 16)}, ${parseInt(colorValue.substring(3, 5), 16)}, ${parseInt(colorValue.substring(5, 7), 16)}, ${transparency})`;
			this.element.querySelector('.crater-background-container-content').css({ backgroundColor });
			settingsClone.backgroundColor = colorValue;
			bgColorSettings.querySelector('#background-color-cell').setAttribute('value', settingsClone.backgroundColor);
		};

		this.paneContent.querySelector('#sound-cell').value = videoSettings.sound;
		this.paneContent.querySelector('#sound-cell').onchange = () => {
			settingsClone.sound = this.paneContent.querySelector('#sound-cell').value;
			video.muted = (settingsClone.sound.toLowerCase() === 'mute') ? true : false;
		};

		this.paneContent.querySelector('#autoplay-cell').value = videoSettings.autoplay;
		this.paneContent.querySelector('#autoplay-cell').onchange = () => {
			settingsClone.autoplay = this.paneContent.querySelector('#autoplay-cell').value;
			video.autoplay = (settingsClone.autoplay.toLowerCase() === 'true') ? true : false;
		};

		this.paneContent.querySelector('#loop-cell').value = videoSettings.loop;
		this.paneContent.querySelector('#loop-cell').onchange = () => {
			settingsClone.loop = this.paneContent.querySelector('#loop-cell').value;
			video.loop = (settingsClone.loop.toLowerCase() === 'true') ? true : false;
		};

		const bgLayoutSettings = this.paneContent.querySelector('.background-layout-settings-pane');

		bgLayoutSettings.querySelector('#layout-cell').value = videoSettings.layout;
		bgLayoutSettings.querySelector('#layout-cell').onchange = () => {
			settingsClone.layout = bgLayoutSettings.querySelector('#layout-cell').value;
			switch (bgLayoutSettings.querySelector('#layout-cell').value.toLowerCase()) {
				case 'full':
					this.element.querySelector('.crater-background-container-content').style.height = '100%';
					this.element.querySelector('.crater-background-container-content').style.width = '100%';
					break;

				case 'standard':
					this.element.querySelector('.crater-background-container-content').style.height = '';
					this.element.querySelector('.crater-background-container-content').style.width = '80%';
					break;

				case 'full height':
					this.element.querySelector('.crater-background-container-content').style.height = '100%';
					this.element.querySelector('.crater-background-container-content').style.width = '80%';
					break;

				case 'full width':
					this.element.querySelector('.crater-background-container-content').style.height = '';
					this.element.querySelector('.crater-background-container-content').style.width = '100%';
					break;
			}
		};


		bgLayoutSettings.querySelector('#vertical-alignment-cell').value = videoSettings.vA;
		bgLayoutSettings.querySelector('#vertical-alignment-cell').onchange = () => {
			settingsClone.vA = bgLayoutSettings.querySelector('#vertical-alignment-cell').value;
			switch (bgLayoutSettings.querySelector('#vertical-alignment-cell').value.toLowerCase()) {
				case 'top':
					this.element.querySelector('.crater-background-container-content-text').css({
						gridRowStart: 1,
						gridColumnStart: 1
					});
					break;

				case 'center':
					this.element.querySelector('.crater-background-container-content-text').css({
						gridRowStart: 2,
						gridColumnStart: 1
					});
					break;

				case 'bottom':
					this.element.querySelector('.crater-background-container-content-text').css({
						gridRowStart: 3,
						gridColumnStart: 1
					});
					break;

			}
		};

		bgLayoutSettings.querySelector('#horizontal-alignment-cell').value = videoSettings.hA;
		bgLayoutSettings.querySelector('#horizontal-alignment-cell').onchange = () => {
			settingsClone.hA = bgLayoutSettings.querySelector('#horizontal-alignment-cell').value;
			switch (bgLayoutSettings.querySelector('#horizontal-alignment-cell').value.toLowerCase()) {
				case 'left':
					this.element.querySelector('.crater-background-container-content-text').style.textAlign = 'left';
					break;

				case 'middle':
					this.element.querySelector('.crater-background-container-content-text').style.textAlign = 'center';
					break;

				case 'right':
					this.element.querySelector('.crater-background-container-content-text').style.textAlign = 'right';
					break;

			}
		};

		const seSettings = this.paneContent.querySelector('.special-effects-settings-pane');
		seSettings.querySelector('#blur-cell').value = videoSettings.blur;
		seSettings.querySelector('#blur-cell').onchange = () => {
			settingsClone.blur = seSettings.querySelector('#blur-cell').value;
			switch (seSettings.querySelector('#blur-cell').value.toLowerCase()) {
				case 'none':
					this.element.querySelector('.crater-background-container-bg-image').style.filter = 'none';
					break;

				case 'light':
					this.element.querySelector('.crater-background-container-bg-image').style.filter = 'blur(2px)';
					break;

				case 'medium':
					this.element.querySelector('.crater-background-container-bg-image').style.filter = 'blur(5px)';
					break;

				case 'strong':
					this.element.querySelector('.crater-background-container-bg-image').style.filter = 'blur(10px)';
					break;
			}
		};

		seSettings.querySelector('#parallax-cell').value = videoSettings.parallax;
		seSettings.querySelector('#parallax-cell').onchange = () => {
			settingsClone.parallax = seSettings.querySelector('#parallax-cell').value;
			switch (seSettings.querySelector('#parallax-cell').value.toLowerCase()) {
				case 'off':
					this.element.querySelector('.crater-background-container-bg-image').style.backgroundAttachment = 'unset';
					break;

				case 'on':
					this.element.querySelector('.crater-background-container-bg-image').style.backgroundAttachment = 'fixed';
					break;
			}
		};

		const backgroundContent = this.element.querySelector('.crater-background-container-content-text');
		this.paneContent.find('.new-component').addEventListener('click', event => {

			this.sharePoint.app.findAll('.crater-display-panel').forEach(panel => panel.remove());

			let generated = this.sharePoint.displayPanel(webpart => {
				let newPanelContent = this.sharePoint.appendWebpart(backgroundContent, webpart.dataset.webpart);
				let contents = this.element.find('.crater-background-container-content-text').findAll('.keyed-element');
				if (this.paneContent.querySelector('.background-contents-pane').querySelector('.crater-background-content-row-pane')) {
					this.paneContent.querySelector('.background-contents-pane').querySelectorAll('.crater-background-content-row-pane').forEach(row => {
						row.remove();
					});
				}
				for (let i = 0; i < contents.length; i++) {
					this.paneContent.querySelector('.background-contents-pane').makeElement({
						element: 'div',
						attributes: {
							style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-background-content-row-pane row'
						},
						children: [
							this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-background-content-row' }),
							this.createElement({
								element: 'h3', attributes: { id: 'name' }, text: contents[i].dataset.type.toUpperCase()
							})
						]
					});
				}
			});
			this.paneContent.append(generated);
		});

		this.paneContent.getParents('.crater-edit-window').querySelector('#crater-editor-save').addEventListener('click', event => {
			this.sharePoint.saveSettings(this.element, videoSettings, settingsClone);
		});

	}
}

export { Background };