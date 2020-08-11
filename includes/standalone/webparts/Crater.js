import { CraterWebParts } from './../CraterWebParts';
import { ElementModifier } from './../ElementModifier';

class Crater extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	public key: any;
	private widths: any;
	public sharepoint: any;
	public craterWebparts: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.craterWebparts = new CraterWebParts(params);
		this.params = params;
	}

	public render() {
		let crater = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-crater crater-component', 'data-type': 'crater' }, options: ['Edit', 'Delete', 'Clone', 'Paste', 'Undo', 'Redo'], children: [
				{ element: 'div', attributes: { class: 'crater-sections-container', id: 'crater-sections-container' } }
			], alignOptions: 'left',
		});
		this.key = crater.dataset['key'];
		let settings = {
			columns: 1,
			columnsSizes: '1fr',
			widths: ['100%'],
			kendo: 'helo'
		};

		this.sharePoint.saveSettings(crater, settings);
		return crater;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.resetSections({ resetWidth: params.resetWidth });
		this.showOptions(this.element);
		let sections = this.element.find('.crater-sections-container').childNodes;

		this.element.addEventListener('mouseup', () => {
			for (let i = 0; i < sections.length; i++) {
				sections[i].dispatchEvent(new CustomEvent('mouseup'));
			}
		});

		this.element.addEventListener('mouseleave', event => {
			for (let i = 0; i < sections.length; i++) {
				sections[i].dispatchEvent(new CustomEvent('mouseup'));
			}
		});

		this.element.cssRemove(['cursor']);
	}

	public generatePaneContent(params) {
		let listPane = this.createElement({
			element: 'div', attributes: { class: 'card sections-pane', style: { display: 'block' } }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Crater Sections'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.source.length; i++) {
			if (params.source[i].classList.contains('webpart-options')) continue;
			listPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-section-row-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-content-row' }),
					this.cell({
						element: 'select', name: 'Scroll', options: ["Yes", "No"]
					}),
				]
			});
		}

		return listPane;
	}

	public setUpPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content', 'data-property-key': this.key }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			console.log('Pane Content Empty');
			
			let container = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-sections-container');

			let elementContents = container.childNodes;
			this.paneContent.append(this.generatePaneContent({ source: elementContents }));

			let settingsPane = this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card settings-pane', style: { display: 'block' } }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							})
						]
					}),
					this.cell({
						element: 'input', name: 'Columns', value: settings.columns
					}),
					this.cell({
						element: 'input', name: 'Update', value: settings.columns
					}),
					this.cell({
						element: 'input', name: 'Columns Sizes', value: settings.columnsSizes || '', list: ['50% 50%', '30% 30% 40%', '33.3% 33.3% 33.3%', '35% 65%']
					}),
					this.cell({
						element: 'select', name: 'Scroll', options: ["Yes", "No"]
					}),
				]
			});
		}

		// upload the settings
		this.paneContent.find('#Columns-cell').value = settings.columns;

		this.paneContent.find('#Columns-Sizes-cell').value = settings.columnsSizes;

		let contents = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-sections-container').childNodes;

		this.paneContent.find('.sections-pane').innerHTML = this.generatePaneContent({ source: contents }).innerHTML;

		return this.paneContent;
	}

	public listenPaneContent(params?) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content');
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;

		let sectionRowPanes = this.paneContent.findAll('.crater-section-row-pane');
		let sections = draftDom.findAll('.crater-section');

		let settingsPane = this.paneContent.find('.settings-pane');

		settingsPane.find('#Columns-Sizes-cell').onChanged();

		settingsPane.find('#Columns-cell').onChanged(value => {
			settingsPane.find('#Columns-Sizes-cell').setAttribute('value', `repeat(${value}, 1fr)`);
			settingsPane.find('#Columns-Sizes-cell').value = `repeat(${value}, 1fr)`;
		});

		settingsPane.find('#Scroll-cell').onChanged(scroll => {
			sections.forEach(section => {
				if (scroll.toLowerCase() == 'yes') {
					section.css({ overflowY: 'auto' });
				} else {
					section.cssRemove(['overflow-y']);
				}
			});
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.columnsSizes = settingsPane.find('#Columns-Sizes-cell').value;

			if (settings.columns < this.paneContent.find('#Columns-cell').value) {
				settings.columns = this.paneContent.find('#Columns-cell').value;
				settings.resetWidth = true;

				this.resetSections({ resetWidth: true });
			}
			else if (settings.columns > this.paneContent.find('#Columns-cell').value) { //check if the columns is less than current
				alert("New number of column should be more than current");
			}

			this.sharePoint.saveSettings(this.element, settings);
		});
	}

	private resetSections(params) {
		params = this.func.isset(params) ? params : {};
		let craterSectionsContainer = this.element.find('.crater-sections-container');

		let sections = craterSectionsContainer.findAll('.crater-section');
		let count = sections.length;
		const settings = JSON.parse(this.element.dataset.settings);

		let number = settings.columns - count;
		let newSections = this.createSections({ number, height: '100px' }).findAll('.crater-section');

		//copy the current contents of the sections into the newly created sections
		for (let i = 0; i < newSections.length; i++) {
			craterSectionsContainer.append(newSections[i]);
		}

		// reset count
		count = craterSectionsContainer.childNodes.length;

		craterSectionsContainer.css({ gridTemplateColumns: `repeat(${count}, 1fr` });
		let childSections = craterSectionsContainer.findAll('.crater-section');
		for (let i = 0; i < childSections.length; i++) {
			this.craterWebparts[childSections[i].dataset.type]({ action: 'rendered', element: childSections[i], sharePoint: this.sharePoint });
			childSections[i].css({ width: '100%' });

			settings.widths[i] = childSections[i].position().width + 'px';
		}

		craterSectionsContainer.css({ gridTemplateColumns: settings.columnsSizes });
	}

	public createSections(params) {
		let parent = this.createElement({
			element: 'div', options: []
		});

		for (let i = 0; i < params.number; i++) {
			//create the sections as keyed elements
			let element = this.craterWebparts['section']({ action: 'render', sharePoint: this.sharePoint, height: params.height });

			parent.append(element);
		}

		return parent;
	}
}

export { Crater };