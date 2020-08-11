import { Func } from './Func';
import { ElementModifier } from './ElementModifier';
import { Accordion } from './webparts/Accordion';
import { Background } from './webparts/Background';
import { BeforeAfter } from './webparts/BeforeAfter';
import { Birthday } from './webparts/Birthday';
import { Buttons } from './webparts/Buttons';
import { Calendar } from './webparts/Calender';
import { Carousel } from './webparts/Carousel';
import { CountDown } from './webparts/CountDown';
import { Counter } from './webparts/Counter';
import { Crater } from './webparts/Crater';
import { DateList } from './webparts/DateList';
import { EmployeeDirectory } from './webparts/EmployeeDirectory';
import { Event } from './webparts/Event';
import { Facebook } from './webparts/Facebook';
import { Frame } from './webparts/Frame';
import { Icons } from './webparts/Icons';
import { Instagram } from './webparts/Instagram';
import { List } from './webparts/List';
import { Map } from './webparts/Map';
import { News } from './webparts/News';
import { NewsCarousel } from './webparts/NewsCarousel';
import { Panel } from './webparts/Panel';
import { PowerBI } from './webparts/PowerBI';
import { Section } from './webparts/Section';
import { Slider } from './webparts/Slider';
import { Tab } from './webparts/Tab';
import { Table } from './webparts/Table';
import { TextArea } from './webparts/TextArea';
import { ThreeDimensionalSlider } from './webparts/ThreeDimensionalSlider';
import { Tiles } from './webparts/Tiles';
import { Twitter } from './webparts/Twitter';
import { YouTube } from './webparts/Youtube';
import { Row } from './webparts/Row';
import { TaskManager } from './webparts/TaskManager';
import { Image } from './webparts/Image';
import { ImageCaption } from './webparts/ImageCaption';

{
	require('./../styles/root.css');
	require('./../styles/containers.css');
	require('./../styles/editwindow.css');
	require('./../styles/displayPanel.css');
	require('./../styles/animations.css');
	require('./../styles/connection.css');
	require('./../styles/crater.css');
	require('./../styles/form.css');
	require('./../styles/event.css');
	require('./../styles/list.css');
	require('./../styles/slider.css');
	require('./../styles/counter.css');
	require('./../styles/tiles.css');
	require('./../styles/sections.css');
	require('./../styles/news.css');
	require('./../styles/table.css');
	require('./../styles/panel.css');
	require('./../styles/special.css');
	require('./../styles/textarea.css');
	require('./../styles/icons.css');
	require('./../styles/buttons.css');
	require('./../styles/countdown.css');
	require('./../styles/tab.css');
	require('./../styles/carousel.css');
	require('./../styles/map.css');
	require('./../styles/datelist.css');
	require('./../styles/instagram.css');
	require('./../styles/beforeafter.css');
	require('./../styles/table.css');
	require('./../styles/powerbi.css');
	require('./../styles/calender.css');
	require('./../styles/employeedirectory.css');
	require('./../styles/accordion.css');
	require('./../styles/birthday.css');
	require('./../styles/newscarousel.css');
	require('./../styles/background.css');
	require('./../styles/threedimentionalslider.css');
	require('./../styles/taskmanager.css');
	require('./../styles/row.css');
	require('./../styles/image.css');
	require('./../styles/frame.css');
	require('./../styles/imagecaption.css');
}

class CraterWebParts extends ElementModifier {
	constructor(params) {
		super(params);
		this.sharePoint = params.sharePoint;
	}
	//create the pane-options component

	//create a pane style block
	createStyleBlock(params) {
		//create the block
		let block = this.createElement({
			element: 'div', attributes: { class: 'card crater-style-block', style: { margin: '1em', position: 'relative' } }, sync: true, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							//set the block title
							element: 'h2', attributes: { class: 'title' }, text: params.title
						})
					]
				}),
			]
		});

		let blockRow = block.makeElement({
			element: 'div', attributes: { class: 'row' }
		});

		let key = params.element.dataset['key'];

		if (this.func.isset(params.options)) {//set the options
			let styleOptions = block.makeElement({
				element: 'div', attributes: { class: 'crater-style-options' }
			});

			if (this.func.isset(params.options.sync)) {//set the sync and async option
				if (!this.func.isset(this.sharePoint.attributes.pane.content[key].sync[params.title.toLowerCase()])) {
					this.sharePoint.attributes.pane.content[key].sync[params.title.toLowerCase()] = false;
				}

				let sync = this.sharePoint.attributes.pane.content[key].sync[params.title.toLowerCase()];

				styleOptions.makeElement({
					element: 'img', attributes: {
						class: 'crater-style-option crater-toggle-style-sync', alt: sync ? 'Async' : 'Sync', src: sync ? this.sharePoint.images.sync : this.sharePoint.images.async, 'data-style': params.title.toLowerCase()
					}
				});
			}
		}

		for (let i in params.children) {//append the style data to the block
			let value = '';
			if (this.func.isset(params.element.css()[this.func.cssStyleName(i)])) {
				value = params.element.css()[this.func.cssStyleName(i)];
			}
			let styleSync = '';
			if (this.func.isset(params.options) && this.func.isset(params.options.sync)) {
				styleSync = params.title.toLowerCase();
			}

			if (i == 'backgroundImage') {
				blockRow.append(this.cell({
					element: 'img', edit: 'upload-image', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-icon crater-style-attr' }, name: params.children[i], value, src: this.sharePoint.images.append
				}));
			}
			else if (i == 'fontFamily') {
				let list = this.func.fontStyles;
				blockRow.append(this.cell({
					element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list
				}));
			}
			else if (this.func.isSubString(i, 'color') || this.func.isSubString(i, 'Color')) {
				let list = this.func.colors;
				blockRow.append(this.cell({
					element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list
				}));
			}
			else if (i == 'fontWeight') {
				blockRow.append(this.cell({
					element: 'select', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, options: this.func.boldness
				}));
			}
			else if (i == 'fontSize') {
				blockRow.append(this.cell({
					element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value, list: this.func.pixelSizes
				}));
			}
			else {
				blockRow.append(this.cell({
					element: 'input', dataAttributes: { 'data-action': i, 'data-style-sync': styleSync, class: 'crater-style-attr' }, name: params.children[i], value
				}));
			}
		}

		return block;
	}
}

{
	CraterWebParts.prototype['imagecaption'] = params => {
		let imagecaption = new ImageCaption({ sharePoint: params.sharePoint });
		return imagecaption[params.action](params);
	};

	CraterWebParts.prototype['image'] = params => {
		let image = new Image({ sharePoint: params.sharePoint });
		return image[params.action](params);
	};

	CraterWebParts.prototype['taskmanager'] = params => {
		let taskmanager = new TaskManager({ sharePoint: params.sharePoint });
		return taskmanager[params.action](params);
	};

	CraterWebParts.prototype['row'] = params => {
		let row = new Row({ sharePoint: params.sharePoint });
		return row[params.action](params);
	};

	CraterWebParts.prototype['accordion'] = params => {
		let accordion = new Accordion({ sharePoint: params.sharePoint });
		return accordion[params.action](params);
	};

	CraterWebParts.prototype['threedimensionalslider'] = params => {
		let threedimensionalslider = new ThreeDimensionalSlider({ sharePoint: params.sharePoint });
		return threedimensionalslider[params.action](params);
	};

	CraterWebParts.prototype['background'] = params => {
		let background = new Background({ sharePoint: params.sharePoint });
		return background[params.action](params);
	};

	CraterWebParts.prototype['newscarousel'] = params => {
		let newscarousel = new NewsCarousel({ sharePoint: params.sharePoint });
		return newscarousel[params.action](params);
	};

	CraterWebParts.prototype['frame'] = params => {
		let frame = new Frame({ sharePoint: params.sharePoint });
		return frame[params.action](params);
	};

	CraterWebParts.prototype['calendar'] = params => {
		let calendar = new Calendar({ sharePoint: params.sharePoint });
		return calendar[params.action](params);
	};

	CraterWebParts.prototype['twitter'] = params => {
		let twitter = new Twitter({ sharePoint: params.sharePoint });
		return twitter[params.action](params);
	};

	CraterWebParts.prototype['birthday'] = params => {
		let birthday = new Birthday({ sharePoint: params.sharePoint });
		return birthday[params.action](params);
	};

	CraterWebParts.prototype['employeedirectory'] = params => {
		let employeeDirectory = new EmployeeDirectory({ sharePoint: params.sharePoint });
		return employeeDirectory[params.action](params);
	};

	CraterWebParts.prototype['powerbi'] = params => {
		let powerbi = new PowerBI({ sharePoint: params.sharePoint });
		return powerbi[params.action](params);
	};

	CraterWebParts.prototype['event'] = params => {
		let event = new Event({ sharePoint: params.sharePoint });
		return event[params.action](params);
	};

	CraterWebParts.prototype['youtube'] = params => {
		let youtube = new YouTube({ sharePoint: params.sharePoint });
		return youtube[params.action](params);
	};

	CraterWebParts.prototype['facebook'] = params => {
		let facebook = new Facebook({ sharePoint: params.sharePoint });
		return facebook[params.action](params);
	};

	CraterWebParts.prototype['beforeafter'] = params => {
		let beforeafter = new BeforeAfter({ sharePoint: params.sharePoint });
		return beforeafter[params.action](params);
	};

	CraterWebParts.prototype['map'] = params => {
		let map = new Map({ sharePoint: params.sharePoint });
		return map[params.action](params);
	};

	CraterWebParts.prototype['datelist'] = params => {
		let datelist = new DateList({ sharePoint: params.sharePoint });
		return datelist[params.action](params);
	};

	CraterWebParts.prototype['instagram'] = params => {
		let instagram = new Instagram({ sharePoint: params.sharePoint });
		return instagram[params.action](params);
	};

	CraterWebParts.prototype['carousel'] = params => {
		let carousel = new Carousel({ sharePoint: params.sharePoint });
		return carousel[params.action](params);
	};

	CraterWebParts.prototype['tab'] = params => {
		let tab = new Tab({ sharePoint: params.sharePoint });
		return tab[params.action](params);
	};

	CraterWebParts.prototype['countdown'] = params => {
		let countdown = new CountDown({ sharePoint: params.sharePoint });
		return countdown[params.action](params);
	};

	CraterWebParts.prototype['buttons'] = params => {
		let buttons = new Buttons({ sharePoint: params.sharePoint });
		return buttons[params.action](params);
	};

	CraterWebParts.prototype['icons'] = params => {
		let icons = new Icons({ sharePoint: params.sharePoint });
		return icons[params.action](params);
	};

	CraterWebParts.prototype['textarea'] = params => {
		let textarea = new TextArea({ sharePoint: params.sharePoint });
		return textarea[params.action](params);
	};

	CraterWebParts.prototype['news'] = params => {
		let news = new News({ sharePoint: params.sharePoint });
		return news[params.action](params);
	};

	CraterWebParts.prototype['crater'] = params => {
		let crater = new Crater({ sharePoint: params.sharePoint });
		return crater[params.action](params);
	};

	CraterWebParts.prototype['panel'] = params => {
		let panel = new Panel({ sharePoint: params.sharePoint });
		return panel[params.action](params);
	};

	CraterWebParts.prototype['table'] = params => {
		let table = new Table({ sharePoint: params.sharePoint });
		return table[params.action](params);
	};

	CraterWebParts.prototype['section'] = params => {
		let section = new Section({ sharePoint: params.sharePoint });
		return section[params.action](params);
	};

	CraterWebParts.prototype['slider'] = params => {
		let slider = new Slider({ sharePoint: params.sharePoint });
		return slider[params.action](params);
	};

	CraterWebParts.prototype['list'] = params => {
		let list = new List({ sharePoint: params.sharePoint });
		return list[params.action](params);
	};

	CraterWebParts.prototype['counter'] = params => {
		let counter = new Counter({ sharePoint: params.sharePoint });
		return counter[params.action](params);
	};

	CraterWebParts.prototype['tiles'] = params => {
		let tiles = new Tiles({ sharePoint: params.sharePoint });
		return tiles[params.action](params);
	};
}

export { CraterWebParts };