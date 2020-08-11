import { ElementModifier } from './../ElementModifier';
import { ColorPicker } from './../ColorPicker';

class Map extends ElementModifier {
	public key;
	public element;
	public params;
	public paneContent;
	public self = this;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params?) {
		let mapDiv = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-map', 'data-type': 'map' }, children: [
				{ element: 'div', attributes: { class: 'crater-map-div', id: 'crater-map-div' } },
				{
					element: 'script', attributes: { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdGAHe_9Ghatd4wZjyc3hRdirIQ1ttcv0&callback=initMap' }
				}
			]
		});

		this.key = this.key || mapDiv.dataset.key;
		const settings = { myMap: { lat: -34.067, lng: 150.067, zoom: 4, markerChecked: true, color: '' } };
		this.sharePoint.saveSettings(mapDiv, settings);

		window['initMap'] = this.initMap;

		this.element = mapDiv;

		return mapDiv;
	}

	public initMap = () => {
		const settings = JSON.parse(this.element.dataset.settings);
		const { myMap } = settings;
		const { color } = myMap;
		let mapStyles: Array<any> = [
			{ elementType: 'geometry.stroke', stylers: [{ color }, { lightness: 0 }] },
			{ elementType: 'labels.text.fill', stylers: [{ color }, { lightness: 0 }] },
			{ elementType: 'labels.text.stroke', stylers: [{ color: '#f9f9f9' }] },
			{ featureType: 'water', elementType: 'geometry.fill', stylers: [{ color }, { lightness: 80 }] },
			{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color }, { lightness: 0 }] },
			{ featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#f9f9f9' }] },
			{ featureType: 'road', elementType: 'geometry.fill', stylers: [{ color }, { lightness: 80 }] },
			{ featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color }, { lightness: 95 }] }
		];
		let newMap = {
			lat: myMap.lat,
			lng: myMap.lng
		};
		/// <reference path="googlemaps" />
		const styles: any = (color) ? mapStyles : '';
		let map = new google.maps.Map(this.element.find('#crater-map-div'), {
			center: newMap,
			zoom: myMap.zoom,
			styles
		});

		if (myMap.markerChecked) {
			let marker = new google.maps.Marker({
				position: newMap,
				map
			});
		}
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset['key'];
		this.element.find('#crater-map-div').innerHTML = '';
		this.element.find('script').remove();
		window['initMap'] = this.initMap;
		this.element.makeElement(
			{
				element: 'script', attributes: { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdGAHe_9Ghatd4wZjyc3hRdirIQ1ttcv0&callback=initMap' }
			}
		);
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
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
				element: 'div', attributes: { class: 'map-style-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Customize Map'
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
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `Clear the color input field to reset the map color to default.` },
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `The latitude/longitude should be in the format '6.6018'.` },
											{ element: 'p', attributes: { style: { color: 'green' } }, text: `The optimal zoom level values range from 0 - 20` }
										]
									}
								]
							}
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'latitude', value: ''
							}),
							this.cell({
								element: 'input', name: 'longitude', value: ''
							}),
							this.cell({
								element: 'input', name: 'zoom', value: ''
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color' }, list: this.func.colors
							}),
							this.cell({
								element: 'input', name: 'width', value: this.element.find('#crater-map-div').css()['width'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.find('#crater-map-div').css()['height'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'marker', options: ['show', 'hide']
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
		const settings = JSON.parse(this.element.dataset.settings);
		const settingsClone: any = { myMap: {} };
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let mapPane = this.paneContent.find('.map-style-pane');

		mapPane.find('#latitude-cell').onChanged(value => {
			settingsClone.myMap.lat = parseFloat(value);
		});

		mapPane.find('#color-cell').addEventListener('change', event => {
			let hexColor = mapPane.find('#color-cell').value;
			mapPane.find('#color-cell').setAttribute('value', hexColor); //set the value of the eventColor cell in the pane to the color
			settingsClone.myMap.color = hexColor;
		});

		mapPane.find('#longitude-cell').onChanged(value => {
			settingsClone.myMap.lng = parseFloat(value);
		});

		mapPane.find('#zoom-cell').onChanged(value => {
			settingsClone.myMap.zoom = parseInt(value);
		});

		let markerValue = mapPane.find('#marker-cell');
		markerValue.addEventListener('change', () => {
			let marker = markerValue.value;
			switch (marker.toLowerCase()) {
				case 'show':
					settingsClone.myMap.markerChecked = true;
					break;
				case 'hide':
					settingsClone.myMap.markerChecked = false;
					break;
				default:
					settingsClone.myMap.markerChecked = true;
			}
		});

		mapPane.find('#width-cell').onChanged(width => {
			draftDom.find('#crater-map-div').css({ width });
			settingsClone.myMap.width = width;
		});

		mapPane.find('#height-cell').onChanged(height => {
			draftDom.find('#crater-map-div').css({ height });
			settingsClone.myMap.height = height;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			this.element.find('#crater-map-div').innerHTML = '';
			this.element.removeChild(this.element.find('script'));

			this.sharePoint.saveSettings(this.element, settings, settingsClone);

			window['initMap'] = this.initMap;
			this.element.makeElement({
				element: 'script', attributes: { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdGAHe_9Ghatd4wZjyc3hRdirIQ1ttcv0&callback=initMap' }
			});


		});

	}
}

export { Map };