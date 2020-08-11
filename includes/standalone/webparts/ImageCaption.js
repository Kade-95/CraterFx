import { ElementModifier } from './../ElementModifier';

enum ImageCaptionStyle { quarterSlideSide = 1, quarterZoom = 2, coverPushRight = 3, halfSlide = 4, revolvingDoorRight = 5, quarterTwoStep = 6, coverSlideTop = 7 }

export class ImageCaption extends ElementModifier {
    public key: any;
    public element: any;
    public paneContent: any;

    constructor(public params: any) {
        super({ sharePoint: params.sharePoint });
        this.sharePoint = params.sharePoint;
        this.params = params;
    }

    public render(params) {
        const imageDetails: { description: string; url: string; } = { description: 'Image Caption Description', url: 'https://localhost:4321/src/externals/scr/webparts/Screenshot.png' };
        const imageCaption = this.createKeyedElement({
            element: 'div', attributes: { class: 'crater-image-caption-element crater-component', 'data-type': 'imagecaption' }, children: [
                {
                    element: 'div', attributes: { id: 'crater-image-caption-container', class: 'crater-image-caption-container' }, children: [
                        { element: 'img', attributes: { class: 'crater-image-container-image', 'data-href': 'https://www.nairaland.com', src: imageDetails.url, alt: imageDetails.description } },
                        {
                            element: 'div', attributes: { id: 'crater-image-caption', class: 'crater-image-caption' }, children: [
                                {
                                    element: 'div', attributes: { class: 'crater-image-caption-text' }, children: [
                                        { element: 'h1', attributes: { class: 'crater-image-caption-text-title' }, text: 'Caption One' },
                                        { element: 'p', attributes: { class: 'crater-image-caption-text-desc' }, text: 'Caption text' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.sharePoint.saveSettings(imageCaption, { imageCaption: 1, linkWindow: 'Pop Up' });
        this.key = imageCaption.dataset.key;

        return imageCaption;
    }

    public rendered(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        const settings = JSON.parse(params.element.dataset.settings);
        const self = this;

        function defaultSettings() {
            self.element.querySelector('.crater-image-caption').style.padding = '.5em 0px';
            self.element.querySelector('.crater-image-caption').style.opacity = 0;
            self.element.querySelector('.crater-image-caption').style.height = '23%';
            self.element.querySelector('.crater-image-caption').style.animation = '';
            self.element.querySelector('.crater-image-caption').style.animationDelay = '';
            self.element.querySelector('.crater-image-caption').style.bottom = 0;
            self.element.querySelector('.crater-image-caption').style.left = '';
            self.element.querySelector('.crater-image-caption').style.setProperty("transform", "");
            self.element.querySelector('.crater-image-caption-container').style.perspective = '';
            self.element.querySelector('.crater-image-container-image').style.transition = '';
            self.element.querySelector('.crater-image-container-image').style.transformStyle = '';
            self.element.querySelector('.crater-image-caption').style.transition = 'all 300ms ease';
            self.element.querySelector('.crater-image-caption').style.setProperty("-webkit-backface-visibility", "");
            self.element.querySelector('.crater-image-caption').style.backfaceVisibility = '';
            self.element.querySelector('.crater-image-caption-text').style.transform = '';
            self.element.querySelector('.crater-image-caption-text').style.position = '';
            self.element.querySelector('.crater-image-caption-text').style.animation = '';
        }
        switch (settings.imageCaption) {
            case 1:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = '23%';
                this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-slide-out 1s';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption').style.left = 0;
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-slide-in 1s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-slide-out 1s';
                    this.element.querySelector('.crater-image-caption').style.left = '';
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                };
                break;

            case 2:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = '23%';
                this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-zoom-out 1s';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-zoom-in 1s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-zoom-out 1s';
                };
                break;

            case 3:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = '100%';
                this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-left 1s';
                this.element.querySelector('.crater-image-container-image').style.left = 0;
                this.element.querySelector('.crater-image-caption').style.transition = 'all 1s';
                this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-left 1s';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption-text').style.padding = '1em';
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-right 1s';
                    this.element.querySelector('.crater-image-container-image').style.left = '100%';
                    this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-right 1s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption-text').style.padding = '0 1em 0 1em';
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-left 1s';
                    this.element.querySelector('.crater-image-container-image').style.left = 0;
                    this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-left 1s';
                };
                break;

            case 4:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = 0;
                this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-back .5s';
                this.element.querySelector('.crater-image-container-image').style.bottom = 0;
                this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-back .5s';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.height = '50%';
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-half .5s';
                    this.element.querySelector('.crater-image-container-image').style.bottom = '50%';
                    this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-half .5s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption').style.height = 0;
                    this.element.querySelector('.crater-image-caption').style.bottom = 0;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-cover-push-back .5s';
                    this.element.querySelector('.crater-image-container-image').style.bottom = 0;
                    this.element.querySelector('.crater-image-container-image').style.animation = 'crater-image-push-back .5s';
                };
                break;

            case 5:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = '100%';
                this.element.querySelector('.crater-image-caption').style.opacity = 1;
                this.element.querySelector('.crater-image-caption').style.setProperty("transform", "rotateY(180deg)");
                this.element.querySelector('.crater-image-caption-container').style.perspective = '1000px';
                this.element.querySelector('.crater-image-container-image').style.transition = 'transform 1s';
                this.element.querySelector('.crater-image-caption').style.transition = 'transform 1s';
                this.element.querySelector('.crater-image-container-image').style.transformStyle = 'preserve-3d';
                this.element.querySelector('.crater-image-caption').style.setProperty("-webkit-backface-visibility", "hidden");
                this.element.querySelector('.crater-image-caption').style.backfaceVisibility = 'hidden';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-container-image').style.transform = 'rotateY(180deg)';
                    this.element.querySelector('.crater-image-caption').style.setProperty("transform", "rotateY(360deg)");
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-container-image').style.transform = '';
                    this.element.querySelector('.crater-image-caption').style.setProperty("transform", "rotateY(180deg)");
                };
                break;

            case 6:
                defaultSettings();
                this.element.querySelector('.crater-image-caption').style.height = '23%';
                this.element.querySelector('.crater-image-caption-text').style.textAlign = 'right';
                this.element.querySelector('.crater-image-caption-text').style.opacity = 0;
                this.element.querySelector('.crater-image-caption-text').style.right = '100%';
                this.element.querySelector('.crater-image-caption-text').style.position = 'absolute';
                this.element.querySelector('.crater-image-caption-text').style.animation = 'crater-image-right-to-left-reverse 1s';
                this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-left-to-right-reverse 1s';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-left-to-right .5s';
                    this.element.querySelector('.crater-image-caption-text').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption-text').style.animation = 'crater-image-right-to-left .5s';
                    this.element.querySelector('.crater-image-caption-text').style.right = 0;
                    this.element.querySelector('.crater-image-caption-text').style.animationDelay = '.1s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption-text').style.right = '100%';
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-left-to-right-reverse .5s';
                    this.element.querySelector('.crater-image-caption-text').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption-text').style.animation = 'crater-image-right-to-left-reverse .5s';
                    this.element.querySelector('.crater-image-caption-text').style.animationDelay = '';
                };
                break;

            case 7:
                defaultSettings();
                this.element.querySelector('.crater-image-caption-text').style.opacity = 1;
                this.element.querySelector('.crater-image-caption').style.height = '100%';
                this.element.querySelector('.crater-image-caption').style.bottom = '100%';
                this.element.querySelector('.crater-image-caption-container').onmouseover = () => {
                    this.element.querySelector('.crater-image-caption-text').style.padding = '1em';
                    this.element.querySelector('.crater-image-caption').style.opacity = 1;
                    this.element.querySelector('.crater-image-caption').style.bottom = 0;
                    this.element.querySelector('.crater-image-caption').style.animation = 'crater-image-caption-cover-slide-top .5s';
                };
                this.element.querySelector('.crater-image-caption-container').onmouseout = () => {
                    this.element.querySelector('.crater-image-caption-text').style.padding = '0 1em 0 1em';
                    this.element.querySelector('.crater-image-caption').style.opacity = 0;
                    this.element.querySelector('.crater-image-caption').style.bottom = '100%';
                    this.element.querySelector('.crater-image-caption').style.animation = '';
                };
                break;
        }

        this.element.querySelector('.crater-image-caption-container').onclick = (event) => {
            switch (settings.linkWindow.toLowerCase()) {
                case 'pop up':
                    let popUp = this.popUp({ source: this.element.querySelector('.crater-image-container-image').dataset.href, close: this.sharePoint.images.close, maximize: this.sharePoint.images.maximize, minimize: this.sharePoint.images.minimize });
                    this.element.append(popUp);
                    break;

                case 'new window':
                    window.open(this.element.querySelector('.crater-image-container-image').dataset.href);
                    break;

                default:
                    window.open(this.element.querySelector('.crater-image-container-image').dataset.href, '_self');
                    break;
            }
        };
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
            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'caption-effect-pane card' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Caption Effect'
                            })
                        ]
                    }),
                    {
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'select', name: 'style', options: ['quarterSlideSide', 'quarterZoom', 'coverPushRight', 'halfSlide', 'revolvingDoorRight', 'quarterTwoStep', 'coverSlideTop'], value: ''
                            }),
                            this.cell({
                                element: 'input', name: 'width', value: this.element.querySelector('.crater-image-caption-container').css()['width'] || '700px'
                            }),
                            this.cell({
                                element: 'input', name: 'height', value: this.element.querySelector('.crater-image-caption-container').css()['height'] || '350px'
                            }),
                            this.cell({
                                element: 'select', name: 'link-window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
                            }),
                        ]
                    }
                ]
            });
            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'caption-text-pane card' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            this.createElement({
                                element: 'h2', attributes: { class: 'title' }, text: 'Caption Text'
                            })
                        ]
                    }),
                    {
                        element: 'div', attributes: { class: 'row' }, children: [
                            this.cell({
                                element: 'span', edit: 'change-text', name: 'title', html: this.element.querySelector('.crater-image-caption-text-title').innerHTML
                            }),
                            this.cell({
                                element: 'span', name: 'description', edit: 'change-text', html: this.element.querySelector('.crater-image-caption-text-desc').innerHTML
                            }),
                            this.cell({
                                element: 'img', edit: 'upload-image', name: 'image-link', dataAttributes: { class: 'crater-icon', src: this.element.querySelector('.crater-image-container-image').src }
                            }),
                            this.cell({
                                element: 'input', name: 'url', value: this.element.querySelector('.crater-image-container-image').dataset.href
                            })
                        ]
                    }
                ]
            });

        }
        return this.paneContent;
    }

    public listenPaneContent(params) {
        this.element = params.element;
        this.key = this.element.dataset['key'];
        this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
        const settings = JSON.parse(params.element.dataset.settings);
        const draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
        const captionEffect = this.paneContent.querySelector('.caption-effect-pane');
        const captionText = this.paneContent.querySelector('.caption-text-pane');
        const { imageCaption } = settings;

        captionText.querySelector('#title-cell').checkChanges(event => {
            draftDom.querySelector('.crater-image-caption-text-title').copy(captionText.querySelector('#title-cell'), []);
        });

        captionText.querySelector('#description-cell').checkChanges(event => {
            draftDom.querySelector('.crater-image-caption-text-desc').copy(captionText.querySelector('#description-cell'));
        });

        captionText.querySelector('#image-link-cell').checkChanges(() => {
            draftDom.querySelector('.crater-image-container-image').src = captionText.querySelector('#image-link-cell').src;
        });

        captionText.querySelector('#url-cell').onchange = () => {
            draftDom.querySelector('.crater-image-container-image').setAttribute('data-href', captionText.querySelector('#url-cell').value);
            captionText.querySelector('#url-cell').setAttribute('value', captionText.querySelector('#url-cell').value);
        };

        captionEffect.querySelector('#style-cell').value = ImageCaptionStyle[imageCaption];
        captionEffect.querySelector('#style-cell').onchange = () => {
            settings.imageCaption = ImageCaptionStyle[captionEffect.querySelector('#style-cell').value];
            switch (ImageCaptionStyle[captionEffect.querySelector('#style-cell').value]) {
                case '1':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.quarterSlideSide]);
                    break;
                case '2':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.quarterZoom]);
                    break;
                case '3':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.coverPushRight]);
                    break;
                case '4':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.halfSlide]);
                    break;
                case '5':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.revolvingDoorRight]);
                    break;
                case '6':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.quarterTwoStep]);
                    break;
                case '7':
                    captionEffect.querySelector('#style-cell').setAttribute('value', ImageCaptionStyle[ImageCaptionStyle.coverSlideTop]);
                    break;
            }
        };

        captionEffect.querySelector('#width-cell').onchange = () => {
            draftDom.querySelector('.crater-image-caption-container').css({ width: captionEffect.querySelector('#width-cell').value });
        };
        captionEffect.querySelector('#height-cell').onchange = () => {
            draftDom.querySelector('.crater-image-caption-container').css({ height: captionEffect.querySelector('#height-cell').value });
        };

        captionEffect.find('#link-window-cell').value = settings.linkWindow;

        this.paneContent.addEventListener('mutated', event => {
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.element.innerHTML = draftDom.innerHTML;//upate the webpart
            this.element.css(draftDom.css());
            this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;
            settings.linkWindow = captionEffect.find('#link-window-cell').value;

            this.sharePoint.saveSettings(this.element, settings);
        });
    }
}