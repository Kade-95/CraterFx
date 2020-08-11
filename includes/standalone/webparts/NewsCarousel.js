import { ElementModifier } from './../ElementModifier';

export interface Slides {
    id: any;
    title: string;
    subtitle: string;
    backgroundImageLink: { description: string; url: string; };
    slideLink: string;
    linkText: string;
    tA?: string;
    background?: string;
    titleColor?: string;
    subtitleColor?: string;
    displayStyle?: string;
    fontType?: string;
    titleSize?: string;
    subtitleSize?: string;
    brightness?: number;
    viewStyle?: string;
}

export class NewsCarousel extends ElementModifier {
    public key: any;
    public element: any;
    public paneContent: any;
    public slideIndex = 0;
    public currentSlideIndex = 0;
    public slideArray: Array<Slides> = [];

    constructor(public params: any) {
        super({ sharePoint: params.sharePoint });
        this.sharePoint = params.sharePoint;
        this.params = params;
    }

    public render(params) {
        if (!params.source) {
            params.source = [
                {
                    id: "id-0",
                    title: "The Walking Dead",
                    subtitle: "A show about fighting zombies",
                    backgroundImageLink: { description: 'Very Interesting Show', url: "https://acollectivemind.files.wordpress.com/2013/12/season-4-complete-cast-poster-the-walking-dead-the-walking-dead-35777405-2528-670.png" },
                    slideLink: "http://www.amc.com/shows/the-walking-dead",
                    linkText: "Link One"
                },
                {
                    id: "id-1",
                    title: "The Big Bang Theory",
                    subtitle: "A show about Sheldon",
                    backgroundImageLink: { description: 'Big bang', url: "http://www.moviedeskback.com/wp-content/uploads/2013/09/The-Big-Bang-Theory-wallpapers.jpg" },
                    slideLink: "http://www.cbs.com/shows/big_bang_theory/",
                    linkText: "Link Two"
                },
                {
                    id: "id-2",
                    title: "IZombie",
                    subtitle: "A show about zombies",
                    backgroundImageLink: { description: 'Zombie Show', url: "http://www.nerdophiles.com/wp-content/uploads/2015/07/wp_izombie_brains_16x9.jpg" },
                    slideLink: "http://www.nerdophiles.com/wp-content/uploads/2015/07/wp_izombie_brains_16x9.jpg",
                    linkText: "Link Three"
                }
            ];
        }

        const newsCarousel = this.createKeyedElement({
            element: 'div', attributes: { class: 'crater-news-carousel crater-component', 'data-type': 'newscarousel' }, children: [
                { element: 'div', attributes: { id: 'crater-slide-container', class: 'crater-slide-container' } },
                {
                    element: 'div', attributes: { id: 'crater-slide-navigation', class: 'crater-slide-navigation' }, children: [
                        {
                            element: 'div', attributes: { class: 'crater-slide-navigation-left' }, children: [
                                { element: 'i', attributes: { class: 'fa fa-angle-double-left crater-nav-design crater-nav-design-left' } }
                            ]
                        },
                        {
                            element: 'div', attributes: { class: 'crater-slide-navigation-right' }, children: [
                                { element: 'i', attributes: { class: 'fa fa-angle-double-right crater-nav-design crater-nav-design-right' } }
                            ]
                        }
                    ]
                },
                { element: 'div', attributes: { class: 'dots' } }
            ]
        });


        this.key = newsCarousel.dataset.key;
        this.sharePoint.saveSettings(newsCarousel, { ncSlides: params.source, slideInterval: { speed: 8000, interval: 'Slow' } });
        this.element = newsCarousel;

        return newsCarousel;
    }

    public rendered(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        const settings = JSON.parse(params.element.dataset.settings);
        this.slideArray = settings.ncSlides;
        window.onerror = (message, url, line, column, error) => {
            console.log(message, url, line, column, error);
        };

        this.startCarousel(settings.slideInterval.speed);
    }

    public startCarousel(speed?) {
        for (let i = 0; i < this.slideArray.length; i++) {
            this.slideArray[i].id = `id-${i}`;
        }

        const self = this;
        let sliderInterval: any;
        const newsCarousel = this.element;
        let slideContainer = this.element.querySelector('.crater-slide-container');
        const sliderArrows = this.element.querySelector('.crater-slide-navigation');
        const dots = newsCarousel.querySelector('.dots');
        sliderArrows.style.top = `-${slideContainer.clientHeight / 2}px`;
        newsCarousel.onmouseover = () => {
            sliderArrows.style.opacity = "1";
            dots.style.opacity = "1";
            clearInterval(sliderInterval);
        };

        newsCarousel.onmouseout = () => {
            sliderArrows.style.opacity = "0";
            dots.style.opacity = "0";
            runCarousel();
        };

        const addToDom = () => {
            slideContainer.innerHTML = "";
            dots.innerHTML = "";
            let slideHTML = '';
            for (let i = 0; i < this.slideArray.length; i++) {
                const tA = (this.slideArray[i].tA) ? this.slideArray[i].tA.toLowerCase() : 'center';
                const backgroundOpacity = (this.slideArray[i].background) ? this.slideArray[i].background : 'rgba(0, 0, 0, 0.3)';
                const titleColor = (this.slideArray[i].titleColor) ? this.slideArray[i].titleColor : 'coral';
                const subtitleColor = (this.slideArray[i].subtitleColor) ? this.slideArray[i].subtitleColor : 'white';
                const captionDisplay = (this.slideArray[i].displayStyle === 'Style 2') ? 'block' : (this.slideArray[i].displayStyle === 'Style 1' || this.slideArray[i].displayStyle === 'Style 3') ? 'none' : 'none';
                const mainTextDisplay = (this.slideArray[i].displayStyle === 'Style 2' || this.slideArray[i].displayStyle === 'Style 3') ? 'none' : (this.slideArray[i].displayStyle === 'Style 1') ? 'block' : 'block';
                const styleThreeDisplay = (this.slideArray[i].displayStyle === 'Style 3') ? 'block' : (this.slideArray[i].displayStyle === 'Style 1' || this.slideArray[i].displayStyle === 'Style 2') ? 'none' : 'none';
                const fontType = (this.slideArray[i].fontType) ? this.slideArray[i].fontType : 'Comic Sans MS';
                const titleSize = (this.slideArray[i].titleSize) ? this.slideArray[i].titleSize : '2.5em';
                const subtitleSize = (this.slideArray[i].subtitleSize) ? this.slideArray[i].subtitleSize : '1.1em';
                const imageBrightness = ('brightness' in this.slideArray[i]) ? this.slideArray[i].brightness : 20;

                slideContainer.innerHTML += `<div id="${this.slideArray[i].id}" class="slide-block" style="filter: brightness(${imageBrightness}%); font-family: ${fontType}; background-image: url(${this.slideArray[i].backgroundImageLink.url}); background-repeat: no-repeat; background-size: 100% 100%;">
                                <div class="crater-slide-container-caption" style="display: ${captionDisplay}; text-align: ${tA};">
                                    <div class="main-text" style="color: ${titleColor}; font-size: ${titleSize};">${this.slideArray[i].title}</div>
                                    <div class="sub-text" style="color: ${subtitleColor}; font-size: ${subtitleSize};">${this.slideArray[i].subtitle}</div>
                                </div> 
                                <div class="slide-text" style="background-color: ${backgroundOpacity};">
									<div class="slide-text-words" style="text-align: ${tA}; display: ${mainTextDisplay};"> 
                                        <div class="main-text" style="color: ${titleColor}; font-size: ${titleSize};">${this.slideArray[i].title}</div>
                                        <div class="sub-text" style="color: ${subtitleColor}; font-size: ${subtitleSize};">${this.slideArray[i].subtitle}</div>
                                        <div class="sub-text-link"><button data-link="${this.slideArray[i].slideLink}" style="color: ${titleColor}; border: 3px solid ${titleColor}; background: linear-gradient(to left, transparent 50%, ${titleColor} 50%); background-size: 200% 100%; background-position: right bottom;">${this.slideArray[i].linkText}</button></div>
                                    </div>  
									<div class="crater-slide-container-caption-two" style="display: ${styleThreeDisplay}; text-align: ${tA};">
										<div class="main-text" style="color: ${titleColor}; font-size: ${titleSize};">${this.slideArray[i].title}</div>
										<div class="sub-text" style="color: ${subtitleColor}; font-size: ${subtitleSize};">${this.slideArray[i].subtitle}</div>
									</div>    
								</div>  
                              </div>   
                `;
                dots.innerHTML += `<span class="dot"></span>`;

            }

            slideContainer.querySelectorAll('.sub-text-link').forEach(slideLink => {
                slideLink.querySelector('button').onmouseover = () => {
                    slideLink.querySelector('button').style.backgroundPosition = 'left bottom';
                };
            });

            slideContainer.querySelectorAll('.sub-text-link').forEach(slideLink => {
                slideLink.querySelector('button').onmouseout = () => {
                    slideLink.querySelector('button').style.backgroundPosition = 'right bottom';
                };
            });

            slideContainer.querySelectorAll('.sub-text-link').forEach((slideLink, position) => {
                slideLink.querySelector('button').addEventListener('click', (event) => {
                    event.preventDefault();
                    if (self.slideArray[position].viewStyle.toLowerCase() == 'pop up') {
                        let popUp = self.popUp({ source: self.slideArray[position].slideLink, close: self.sharePoint.images.close, maximize: self.sharePoint.images.maximize, minimize: self.sharePoint.images.minimize });
                        self.element.append(popUp);
                    }
                    else if (self.slideArray[position].viewStyle.toLowerCase() == 'new window') {
                        window.open(self.slideArray[position].slideLink);
                    }
                    else {
                        window.open(self.slideArray[position].slideLink, '_self');
                    }
                });
            });

            slideContainer.querySelector(`#id-${this.currentSlideIndex}`).style.left = 0;
        };

        addToDom();

        newsCarousel.querySelectorAll('.slide-text-words').forEach(textWords => {
            textWords.style.paddingTop = (newsCarousel.querySelector('.slide-text').clientHeight / 3) + 'px';
        });

        function setDotIndex() {
            dots.querySelectorAll('.dot').forEach((dot, position) => {
                if (dot.classList.contains('active')) dot.classList.remove('active');
                if (position === self.currentSlideIndex) {
                    dot.classList.add('active');
                }
                if (dot.classList.contains('active')) {
                    dot.style.backgroundColor = self.slideArray[position].titleColor || 'coral';
                } else {
                    dot.style.backgroundColor = 'rgb(0, 0, 0)';
                }

                dot.onmouseover = () => {
                    dot.style.backgroundColor = self.slideArray[position].titleColor || 'coral';
                };

                dot.onmouseout = () => {
                    if (!dot.classList.contains('active')) dot.style.backgroundColor = 'rgb(0, 0, 0)';
                };
            });
        }

        const prevSlide = () => {
            const nextSlideIndex = (this.currentSlideIndex === 0) ? this.slideArray.length - 1 : this.currentSlideIndex - 1;
            slideContainer.querySelector("#" + "id-" + nextSlideIndex).style.left = "-100%";
            // slideContainer.querySelector("#" + "id-" + nextSlideIndex).style.opacity = "1";
            slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.left = 0;
            // slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.opacity = ".5";

            slideContainer.querySelector("#" + "id-" + nextSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-in-left");
            slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-out-right");

            this.currentSlideIndex = nextSlideIndex;
            setDotIndex();
            clearInterval(sliderInterval);
            runCarousel();
        };

        const nextSlide = () => {
            try {
                const nextSlideIndex = (this.currentSlideIndex === (this.slideArray.length - 1)) ? 0 : this.currentSlideIndex + 1;

                slideContainer.querySelector("#" + "id-" + nextSlideIndex).style.left = "100%";
                // slideContainer.querySelector("#" + "id-" + nextSlideIndex).style.opacity = "1";
                slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.left = 0;
                // slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.opacity = ".5";

                slideContainer.querySelector("#" + "id-" + nextSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-in-right");
                slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-out-left");

                this.currentSlideIndex = nextSlideIndex;
                setDotIndex();
                clearInterval(sliderInterval);
                runCarousel();
            } catch (error) {
                console.log(error.message);
            }
        };

        newsCarousel.querySelector('.crater-nav-design-left').onclick = () => {
            prevSlide();
        };

        newsCarousel.querySelector('.crater-nav-design-right').onclick = () => {
            nextSlide();
        };

        const dotClick = () => {
            dots.querySelectorAll('.dot').forEach((dot, position) => {
                dot.onclick = () => {
                    for (let i = 0; i < dots.querySelectorAll('.dot').length; i++) {
                        if (dots.querySelectorAll('.dot')[i].classList.contains('active')) dots.querySelectorAll('.dot')[i].classList.remove('active');
                    }
                    clearInterval(sliderInterval);
                    if (position > this.currentSlideIndex) {

                        slideContainer.querySelector("#" + "id-" + position).style.left = "100%";
                        slideContainer.querySelector("#" + "id-" + position).style.opacity = "1";
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.left = 0;
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.opacity = ".5";


                        slideContainer.querySelector("#" + "id-" + position).setAttribute("class", "slide-block crater-news-carousel-slide-in-right");
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-out-left");
                        this.currentSlideIndex = position;
                        setDotIndex();
                        clearInterval(sliderInterval);
                        runCarousel();
                    } else if (position < this.currentSlideIndex) {

                        slideContainer.querySelector("#" + "id-" + position).style.left = "-100%";
                        slideContainer.querySelector("#" + "id-" + position).style.opacity = "1";
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.left = 0;
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).style.opacity = ".5";

                        slideContainer.querySelector("#" + "id-" + position).setAttribute("class", "slide-block crater-news-carousel-slide-in-left");
                        slideContainer.querySelector("#" + "id-" + this.currentSlideIndex).setAttribute("class", "slide-block crater-news-carousel-slide-out-right");
                        this.currentSlideIndex = position;
                        setDotIndex();

                        clearInterval(sliderInterval);
                        runCarousel();
                    }
                };
            });
        };

        setDotIndex();

        function runCarousel() {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, speed);
        }

        runCarousel();

        dotClick();
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
            let newsCarouselSlides = this.sharePoint.attributes.pane.content[key].draft.dom.querySelector('.crater-slide-container');
            let newsCarouselSlidesRows = newsCarouselSlides.querySelectorAll('.slide-block');

            this.paneContent.makeElement({
                element: 'div', children: [
                    this.createElement({
                        element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
                    })
                ]
            });

            this.paneContent.append(this.generatePaneContent({ list: newsCarouselSlidesRows }));

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
                                element: 'input', name: 'width', value: this.element.css()['width'] || '100%'
                            }),
                            this.cell({
                                element: 'input', name: 'height', value: this.element.querySelector('.crater-slide-container').css()['height'] || '500px'
                            }),
                            this.cell({
                                element: 'select', name: 'speed', options: ['Slow', 'Normal', 'Fast']
                            })
                        ]
                    })
                ]
            });
        }

        return this.paneContent;
    }

    public generatePaneContent(params) {
        let newsCarouselPane = this.createElement({
            element: 'div', attributes: { class: 'card carousel-pane' }, children: [
                this.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        this.createElement({
                            element: 'h2', attributes: { class: 'title' }, text: 'Carousel Items'
                        })
                    ]
                }),
            ]
        });

        for (let i = 0; i < params.list.length; i++) {
            newsCarouselPane.makeElement({
                element: 'div',
                attributes: { class: 'crater-news-carousel-item-pane row' },
                children: [
                    this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-news-carousel-single' }),
                    this.cell({
                        element: 'img', edit: 'upload-image', name: 'background-image', dataAttributes: { class: 'crater-icon', src: params.list[i].style.backgroundImageLink.url }
                    }),
                    this.cell({
                        element: 'input', edit: 'change-text', name: 'main-text', value: params.list[i].querySelector('.main-text').textContent
                    }),
                    this.cell({
                        element: 'input', edit: 'change-text', name: 'sub-text', value: params.list[i].querySelector('.sub-text').textContent
                    }),
                    this.cell({
                        element: 'input', edit: 'change-text', name: 'link-text', value: params.list[i].querySelector('.sub-text-link').querySelector('button').textContent
                    }),
                    this.cell({
                        element: 'input', edit: 'change-text', name: 'link', value: params.list[i].querySelector('.sub-text-link').firstElementChild.getAttribute('data-link')
                    }),
                    this.cell({
                        element: 'select', name: 'view', options: ['Same Window', 'New Window', 'Pop Up']
                    }),
                    this.cell({
                        element: 'input', name: 'image-brightness', dataAttributes: { type: 'range', min: 0, max: 200 }
                    }),
                    this.cell({
                        element: 'input', name: 'transparency', dataAttributes: { type: 'range', min: 0, max: 100 }
                    }),
                    this.cell({
                        element: 'input', name: 'background-color', dataAttributes: { type: 'color' }, value: params.list[i].querySelector('.slide-text').css()['background-color']
                    }),
                    this.cell({
                        element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: ''
                    }),
                    this.cell({
                        element: 'input', name: 'title-color', dataAttributes: { type: 'color' }, value: params.list[i].querySelector('.main-text').css()['color']
                    }),
                    this.cell({
                        element: 'input', name: 'title-fontsize', value: params.list[i].querySelector('.main-text').css()['font-size']
                    }),
                    this.cell({
                        element: 'input', name: 'subtitle-fontsize', value: params.list[i].querySelector('.sub-text').css()['font-size']
                    }),
                    this.cell({
                        element: 'input', name: 'subtitle-color', dataAttributes: { type: 'color' }, value: params.list[i].querySelector('.sub-text').css()['color']
                    }),
                    this.cell({
                        element: 'select', name: 'text-position', options: ['Left', 'Center', 'Right']
                    }),
                    this.cell({
                        element: 'select', name: 'display-style', options: ['Style 1', 'Style 2', 'Style 3']
                    })
                ]
            });
        }

        return newsCarouselPane;


    }

    public listenPaneContent(params) {
        this.element = params.element;
        this.key = params.element.dataset.key;
        this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
        let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
        const settings = JSON.parse(params.element.dataset.settings);
        let { ncSlides } = settings;
        //get the content and all the events
        let newsCarousel = draftDom.querySelector('.crater-slide-container');
        let newsCarouselRow = newsCarousel.querySelectorAll('.slide-block');

        window.onerror = (message, url, line, column, error) => {
            console.log(message, url, line, column, error);
        };

        let newsCarouselRowPanePrototype = this.createElement({//create a row on the property pane
            element: 'div',
            attributes: {
                class: 'crater-news-carousel-item-pane row'
            },
            children: [
                this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-news-carousel-single' }),
                this.cell({
                    element: 'img', edit: 'upload-image', name: 'background-image', dataAttributes: { class: 'crater-icon', src: '' }
                }),
                this.cell({
                    element: 'input', edit: 'change-text', name: 'main-text', value: ''
                }),
                this.cell({
                    element: 'input', edit: 'change-text', name: 'sub-text', value: ''
                }),
                this.cell({
                    element: 'input', edit: 'change-text', name: 'link-text', value: ''
                }),
                this.cell({
                    element: 'input', edit: 'change-text', name: 'link', value: ''
                }),
                this.cell({
                    element: 'select', name: 'view', options: ['Same Window', 'New Window', 'Pop Up']
                }),
                this.cell({
                    element: 'input', name: 'image-brightness', dataAttributes: { type: 'range', min: 0, max: 200 }
                }),
                this.cell({
                    element: 'input', name: 'transparency', dataAttributes: { type: 'range', min: 0, max: 100 }
                }),
                this.cell({
                    element: 'input', name: 'background-color', value: ''
                }),
                this.cell({
                    element: 'select', name: 'font-type', options: ['Comic Sans MS', 'Impact', 'Bookman', 'Garamond', 'Palatino', 'Georgia', 'Verdana', 'Times New Roman', 'Arial'], value: ''
                }),
                this.cell({
                    element: 'input', name: 'title-fontsize', value: ''
                }),
                this.cell({
                    element: 'input', name: 'subtitle-fontsize', value: ''
                }),
                this.cell({
                    element: 'input', name: 'title-color', value: ''
                }),
                this.cell({
                    element: 'input', name: 'subtitle-color', value: ''
                }),
                this.cell({
                    element: 'select', name: 'text-position', options: ['Left', 'Center', 'Right']
                }),
                this.cell({
                    element: 'select', name: 'display-style', options: ['Style 1', 'Style 2', 'Style 3']
                })
            ]
        });

        const newArraySlide: Slides = {
            id: `id-${ncSlides.length}`,
            title: newsCarouselRowPanePrototype.querySelector('#main-text-cell').value,
            subtitle: newsCarouselRowPanePrototype.querySelector('#sub-text-cell').value,
            backgroundImageLink: { description: 'Sample Image', url: "http://www.nerdophiles.com/wp-content/uploads/2015/07/wp_izombie_brains_16x9.jpg" },
            slideLink: newsCarouselRowPanePrototype.querySelector('#link-cell').value,
            linkText: newsCarouselRowPanePrototype.querySelector('#link-text-cell').value
        };

        let ncSlideHandler = (ncSlidePane, newArrayItemDom) => {
            ncSlidePane.addEventListener('mouseover', event => {
                ncSlidePane.querySelector('.crater-content-options').css({ visibility: 'visible' });
            });

            ncSlidePane.addEventListener('mouseout', event => {
                ncSlidePane.find('.crater-content-options').css({ visibility: 'hidden' });
            });

            // get the values of the newly created row on the property - pane
            let imageCell = ncSlidePane.find('#background-image-cell').parentNode;
            ncSlidePane.find('#background-image-cell').checkChanges(() => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].backgroundImageLink.url = ncSlidePane.find('#background-image-cell').src;
                    }
                }
            });

            ncSlidePane.find('#main-text-cell').onChanged(value => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].title = value;
                    }
                }
            });

            ncSlidePane.find('#sub-text-cell').onChanged(value => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].subtitle = value;
                    }
                }
            });

            ncSlidePane.find('#link-text-cell').onChanged(value => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].linkText = value;
                    }
                }
            });

            ncSlidePane.find('#link-cell').onChanged(value => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].slideLink = value;
                    }
                }
            });
            ncSlidePane.querySelector('#text-position-cell').value = newArrayItemDom.tA || 'Center';
            ncSlidePane.querySelector('#text-position-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].tA = ncSlidePane.querySelector('#text-position-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#view-cell').value = newArrayItemDom.viewStyle || 'Same Window';
            ncSlidePane.querySelector('#view-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].viewStyle = ncSlidePane.querySelector('#view-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#image-brightness-cell').value = newArrayItemDom.brightness || '20';
            ncSlidePane.querySelector('#image-brightness-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].brightness = ncSlidePane.querySelector('#image-brightness-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#transparency-cell').value = newArrayItemDom.transparency * 100 || 30;
            ncSlidePane.querySelector('#transparency-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].transparency = ncSlidePane.querySelector('#transparency-cell').value / 100;
                    }
                }
            };

            ncSlidePane.querySelector('#font-type-cell').value = newArrayItemDom.fontType || 'Comic Sans MS';
            ncSlidePane.querySelector('#font-type-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].fontType = ncSlidePane.querySelector('#font-type-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#title-fontsize-cell').value = newArrayItemDom.titleSize || '2.5em';
            ncSlidePane.querySelector('#title-fontsize-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].titleSize = ncSlidePane.querySelector('#title-fontsize-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#subtitle-fontsize-cell').value = newArrayItemDom.subtitleSize || '1.1em';
            ncSlidePane.querySelector('#subtitle-fontsize-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].subtitleSize = ncSlidePane.querySelector('#subtitle-fontsize-cell').value;
                    }
                }
            };

            ncSlidePane.querySelector('#background-color-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        const transparency = (ncSlides[i].transparency !== undefined) ? ncSlides[i].transparency : '0.3';
                        ncSlides[i].background = `rgba(${parseInt(ncSlidePane.querySelector('#background-color-cell').value.substring(1, 3), 16)}, ${parseInt(ncSlidePane.querySelector('#background-color-cell').value.substring(3, 5), 16)}, ${parseInt(ncSlidePane.querySelector('#background-color-cell').value.substring(5, 7), 16)}, ${transparency})`;
                    }
                }
                ncSlidePane.querySelector('#background-color-cell').setAttribute('value', ncSlidePane.querySelector('#background-color-cell').value);
            };

            ncSlidePane.querySelector('#title-color-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].titleColor = ncSlidePane.querySelector('#title-color-cell').value;
                    }
                }
                ncSlidePane.querySelector('#title-color-cell').setAttribute('value', ncSlidePane.querySelector('#title-color-cell').value);
            };

            ncSlidePane.querySelector('#subtitle-color-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].subtitleColor = ncSlidePane.querySelector('#subtitle-color-cell').value;
                    }
                }
                ncSlidePane.querySelector('#subtitle-color-cell').setAttribute('value', ncSlidePane.querySelector('#subtitle-color-cell').value);
            };

            ncSlidePane.querySelector('#display-style-cell').value = newArrayItemDom.displayStyle || 'Style 1';
            ncSlidePane.querySelector('#display-style-cell').onchange = () => {
                for (let i = 0; i < ncSlides.length; i++) {
                    if (newArrayItemDom.id === ncSlides[i].id) {
                        ncSlides[i].displayStyle = ncSlidePane.querySelector('#display-style-cell').value;
                    }
                }
            };

            ncSlidePane.find('.delete-crater-news-carousel-single').addEventListener('click', event => {
                const slide = ncSlides.findIndex((slideIndex) => {
                    return slideIndex.id === newArrayItemDom.id;
                });
                ncSlides.splice(slide, 1);
                for (let i = 0; i < ncSlides.length; i++) {
                    ncSlides[i].id = `id-${i}`;
                }

                ncSlidePane.remove();
            });

            ncSlidePane.find('.add-before-crater-news-carousel-single').addEventListener('click', event => {
                let newSlide = newsCarouselRowPanePrototype.cloneNode(true);

                const slide = ncSlides.findIndex((slideIndex) => {
                    return slideIndex.id === newArrayItemDom.id;
                });

                ncSlides.splice(slide, 0, newArraySlide);

                for (let i = 0; i < ncSlides.length; i++) {
                    ncSlides[i].id = `id-${i}`;
                }

                ncSlidePane.before(newSlide);
                ncSlideHandler(newSlide, newArraySlide);
            });

            ncSlidePane.find('.add-after-crater-news-carousel-single').addEventListener('click', event => {
                let newSlide = newsCarouselRowPanePrototype.cloneNode(true);

                const slide = ncSlides.findIndex((slideIndex) => {
                    return slideIndex.id === newArrayItemDom.id;
                });

                ncSlides.splice(slide + 1, 0, newArraySlide);

                for (let i = 0; i < ncSlides.length; i++) {
                    ncSlides[i].id = `id-${i}`;
                }

                ncSlidePane.after(newSlide);
                ncSlideHandler(newSlide, newArraySlide);
            });
        };

        this.paneContent.find('.new-component').addEventListener('click', event => {
            let newSlide = newsCarouselRowPanePrototype.cloneNode(true);
            ncSlides.push(newArraySlide);
            for (let i = 0; i < ncSlides.length; i++) {
                ncSlides[i].id = `id-${i}`;
            }
            this.paneContent.find('.carousel-pane').append(newSlide);
            ncSlideHandler(newSlide, newArraySlide);
        });

        this.paneContent.findAll('.crater-news-carousel-item-pane').forEach((listRow, position) => {
            ncSlideHandler(listRow, ncSlides[position]);
        });

        this.paneContent.querySelector('.general-settings-pane').querySelector('#width-cell').value = draftDom.css()['width'] || '100%';
        this.paneContent.querySelector('.general-settings-pane').querySelector('#width-cell').onchange = () => {
            draftDom.style.width = this.paneContent.querySelector('.general-settings-pane').querySelector('#width-cell').value;
            this.paneContent.querySelector('.general-settings-pane').querySelector('#width-cell').value = draftDom.css()['width'];
        };

        this.paneContent.querySelector('.general-settings-pane').querySelector('#height-cell').value = draftDom.querySelector('.crater-slide-container').css()['height'] || '500px';
        this.paneContent.querySelector('.general-settings-pane').querySelector('#height-cell').onchange = () => {
            draftDom.querySelector('.crater-slide-container').style.height = this.paneContent.querySelector('.general-settings-pane').querySelector('#height-cell').value;
            this.paneContent.querySelector('.general-settings-pane').querySelector('#height-cell').value = draftDom.querySelector('.crater-slide-container').css()['height'];
        };

        this.paneContent.querySelector('.general-settings-pane').querySelector('#speed-cell').value = settings.slideInterval.interval;

        this.paneContent.querySelector('.general-settings-pane').querySelector('#speed-cell').onchange = () => {
            settings.slideInterval.interval = this.paneContent.querySelector('.general-settings-pane').querySelector('#speed-cell').value;
            switch (this.paneContent.querySelector('.general-settings-pane').querySelector('#speed-cell').value.toLowerCase()) {
                case 'slow':
                    settings.slideInterval.speed = 8000;
                    break;

                case 'normal':
                    settings.slideInterval.speed = 5500;
                    break;

                case 'fast':
                    settings.slideInterval.speed = 3000;
                    break;
            }
        };

        this.paneContent.addEventListener('mutated', event => {
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.element.innerHTML = draftDom.innerHTML;//upate the webpart
            this.element.css(draftDom.css());
            this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

            this.sharePoint.saveSettings(this.element, settings);
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
                subtitle: { element: 'select', attributes: { id: 'meta-data-subtitle', name: 'Subtitle' }, options: params.options },
                backgroundImageLink: { element: 'select', attributes: { id: 'meta-data-bgimagelink', name: 'Background Image Link' }, options: params.options },
                slideLink: { element: 'select', attributes: { id: 'meta-data-slink', name: 'Slide Link' }, options: params.options },
                linkText: { element: 'select', attributes: { id: 'meta-data-ltext', name: 'Link Text' }, options: params.options },
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
            data.subtitle = updateWindow.find('#meta-data-subtitle').value;
            data.backgroundImageLink = updateWindow.find('#meta-data-bgimagelink').value;
            data.slideLink = updateWindow.find('#meta-data-slink').value;
            data.linkText = updateWindow.find('#meta-data-ltext').value;
            source = this.func.extractFromJsonArray(data, params.source);
            settings.ncSlides = source;
            this.rendered({ element: this.element });
            draftDom.find('.crater-slide-container').innerHTML = this.element.find('.crater-slide-container').innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = draftDom.outerHTML;
            this.paneContent.find('.carousel-pane').innerHTML = this.generatePaneContent({ list: draftDom.findAll('.slide-block') }).innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
        });


        if (!this.func.isnull(paneConnection)) {
            paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
                this.element.innerHTML = draftDom.innerHTML;

                this.element.css(draftDom.css());

                this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

                this.sharePoint.saveSettings(this.element, settings);

            });
        }

        return updateWindow;
    }
}
