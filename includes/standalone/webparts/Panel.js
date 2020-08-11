import { ElementModifier } from './../ElementModifier';
import { CraterWebParts } from './../CraterWebParts';

class Panel extends ElementModifier {
	public params: any;
	private element: any;
	private paneContent: any;
	private key: any;
	private craterWebparts: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
		this.craterWebparts = new CraterWebParts(params);
	}

	public render() {
		let panel = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-container crater-panel', 'data-type': 'panel' }, options: ['Append', 'Edit', 'Delete', 'Clone'], children: [
				{
					element: 'div', attributes: { class: 'crater-panel-content', id: 'crater-panel-content' }, children: [
						{
							element: 'div', attributes: { class: 'crater-panel-title', id: 'crater-panel-title' }, children: [
								{ element: 'i', attributes: { 'data-icon': this.sharePoint.icons.plus, class: 'crater-icon crater-panel-icon', id: 'crater-icon crater-panel-icon', style: { marginRight: '1em' } } },
								{ element: 'span', attributes: { class: 'crater-panel-title-text', id: 'crater-panel-title-text' }, text: 'Panel Title' }
							]
						},
						{ element: 'div', attributes: { class: 'crater-panel-webparts', id: 'crater-panel-webparts' } },
						{ element: 'a', attributes: { class: 'crater-panel-link', id: 'crater-panel-link', href: 'https://google.com' }, text: 'Link' }
					]
				}
			]
		});


		return panel;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.showOptions(this.element);
	}

	private setUpPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		});

		let view = settings.linkWindow;

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.append(this.createElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Panel Title'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { 'data-icon': this.element.find('.crater-panel-title').find('.crater-panel-icon').dataset.icon, class: 'crater-icon' }
							}),
							this.cell({
								element: 'input', name: 'title', value: this.element.find('.crater-panel-title').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							}),
							this.cell({
								element: 'input', name: 'fontsize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'fontstyle', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'height', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'width', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'layout', options: ['Full', 'Left', 'Center', 'Right']
							}),
							this.cell({
								element: 'select', name: 'position', options: ['Left', 'Center', 'Right']
							}),
						]
					})
				]
			}));

			this.paneContent.append(this.createElement({
				element: 'div', attributes: { class: 'link-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Link Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'background color', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'url'
							}),
							this.cell({
								element: 'input', name: 'fontsize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'fontstyle', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'text'
							}),
							this.cell({
								element: 'input', name: 'border', list: this.func.borders
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							}),
							this.cell({
								element: 'select', name: 'Location', options: ['Top', 'Bottom']
							}),
							this.cell({
								element: 'select', name: 'Position', options: ['Left', 'Center', 'Right']
							}),
						]
					})
				]
			}));

			let source = this.element.find('.crater-panel-content').findAll('.keyed-element');

			this.paneContent.append(this.generatePaneContent({ source }));

			this.paneContent.append(this.createElement({
				element: 'div', attributes: { class: 'contents-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Panel Contents'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							}),
							this.cell({
								element: 'input', name: 'Background Color', dataAttributes: { type: 'color', value: '#ffffff' }
							})
						]
					})
				]
			}));

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Panel Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up']
							}),
							this.cell({
								element: 'select', name: 'Style', options: ['Colored', 'Bordered', 'Title Colored and Content Bordered', 'Title Bordered and Content Colored', 'Separated', 'Title Colored and Separated', 'None', 'Remove']
							}),
							this.cell({
								element: 'input', name: 'Border', list: this.func.borders
							}),
							this.cell({
								element: 'input', name: 'Background', dataAttributes: { type: 'color' }
							})
						]
					})
				]
			});
		}

		let contents = this.element.find('.crater-panel-content').findAll('.keyed-element');
		this.paneContent.find('.panel-contents-pane').innerHTML = this.generatePaneContent({ source: contents }).innerHTML;
		return this.paneContent;
	}

	public generatePaneContent(params) {
		let sectionContentsPane = this.createElement({
			element: 'div', attributes: { class: 'card panel-contents-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'Panel Contents'
						})
					]
				}),
			]
		});

		//set the pane for all the webparts in the section
		for (let i = 0; i < params.source.length; i++) {
			sectionContentsPane.makeElement({
				element: 'div',
				attributes: {
					style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-panel-content-row-pane row'
				},
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-panel-content-row' }),
					this.createElement({
						element: 'h3', attributes: { id: 'name' }, text: params.source[i].dataset.type.toUpperCase()
					})
				]
			});
		}

		return sectionContentsPane;
	}

	private listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let panelContents = draftDom.find('.crater-panel-webparts');
		let panelContentDom = panelContents.findAll('.keyed-element');

		let panelContentPane = this.paneContent.find('.panel-contents-pane');

		let view = settings.linkWindow;
		let panelContentPanePrototype = this.createElement({
			element: 'div',
			attributes: {
				style: { border: '1px solid #bbbbbb', margin: '.5em 0em' }, class: 'crater-panel-content-row-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-panel-content-row' }),
				this.createElement({
					element: 'h3', attributes: { id: 'name' }, text: 'New Webpart'
				})
			]
		});

		let panelContentRowHandler = (panelContentRowPane, panelContentRowDom) => {
			panelContentRowPane.addEventListener('mouseover', event => {
				panelContentRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			panelContentRowPane.addEventListener('mouseout', event => {
				panelContentRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			panelContentRowPane.find('.delete-crater-panel-content-row').addEventListener('click', event => {
				panelContentRowDom.remove();
				panelContentRowPane.remove();
			});

			panelContentRowPane.find('.add-before-crater-panel-content-row').addEventListener('click', event => {
				this.paneContent.append(
					this.sharePoint.displayPanel(webpart => {
						let newPanelContent = this.sharePoint.appendWebpart(panelContents, webpart.dataset.webpart);
						panelContentRowDom.before(newPanelContent.cloneNode(true));
						newPanelContent.remove();

						let newSectionContentRow = panelContentPanePrototype.cloneNode(true);
						panelContentRowPane.after(newSectionContentRow);

						panelContentRowHandler(newSectionContentRow, newPanelContent);
					})
				);
			});

			panelContentRowPane.find('.add-after-crater-panel-content-row').addEventListener('click', event => {
				this.paneContent.append(
					this.sharePoint.displayPanel(webpart => {
						let newPanelContent = this.sharePoint.appendWebpart(panelContents, webpart.dataset.webpart);
						panelContentRowDom.after(newPanelContent.cloneNode(true));
						newPanelContent.remove();

						let newPanelContentRow = panelContentPanePrototype.cloneNode(true);
						panelContentRowPane.after(newPanelContentRow);

						panelContentRowHandler(newPanelContentRow, newPanelContent);
					})
				);
			});
		};

		let titlePane = this.paneContent.find('.title-pane');
		let linkPane = this.paneContent.find('.link-pane');
		let contentPane = this.paneContent.find('.contents-pane');
		let settingsPane = this.paneContent.find('.settings-pane');

		let title = draftDom.find('.crater-panel-title');

		titlePane.find('#icon-cell').checkChanges(() => {
			title.find('.crater-panel-icon').removeClasses(title.find('.crater-panel-icon').dataset.icon);
			title.find('.crater-panel-icon').addClasses(titlePane.find('#icon-cell').dataset.icon);
			title.find('.crater-panel-icon').dataset.icon = titlePane.find('#icon-cell').dataset.icon;
		});

		titlePane.find('#height-cell').onChanged(height => {
			title.css({ height });
		});

		titlePane.find('#width-cell').onChanged(width => {
			title.css({ width });
		});

		titlePane.find('#position-cell').onChanged(position => {
			if (position == 'Center') {
				title.css({ justifySelf: 'Center' });
				draftDom.find('.crater-panel-link').css({ justifySelf: 'flex-end' });
			}
			else if (position == 'Right') {
				title.css({ justifySelf: 'flex-end' });
				draftDom.find('.crater-panel-link').css({ justifySelf: 'flex-start' });
			}
			else {
				title.css({ justifySelf: 'flex-start' });
				draftDom.find('.crater-panel-link').css({ justifySelf: 'flex-end' });
			}
		});

		titlePane.find('#layout-cell').onChanged(layout => {
			if (layout == 'Left') {
				title.css({ justifyContent: 'flex-start' });
			}
			else if (layout == 'Right') {
				title.css({ justifyContent: 'flex-end' });
			}
			else if (layout == 'Center') {
				title.css({ justifyContent: 'center' });
			}
			else {
				title.css({ justifyContent: 'space-around' });
			}
		});

		titlePane.find('#title-cell').onChanged(value => {
			title.find('.crater-panel-title-text').innerText = value;
		});

		titlePane.find('#Border-cell').onChanged();

		titlePane.find('#backgroundcolor-cell').onChanged();

		titlePane.find('#color-cell').onChanged(color => {
			title.css({ color });
		});

		titlePane.find('#fontsize-cell').onChanged(value => {
			title.css({ fontSize: value });
		});

		linkPane.find('#text-cell').onChanged(value => {
			draftDom.find('.crater-panel-link').innerText = value;
		});

		linkPane.find('#color-cell').onChanged(color => {
			draftDom.find('.crater-panel-link').css({ color });
		});

		linkPane.find('#background-color-cell').onChanged(backgroundColor => {
			draftDom.find('.crater-panel-link').css({ backgroundColor });
		});

		linkPane.find('#border-cell').onChanged(border => {
			draftDom.find('.crater-panel-link').css({ border });
		});

		linkPane.find('#url-cell').onChanged(value => {
			draftDom.find('.crater-panel-link').href = value;
		});

		linkPane.find('#Show-cell').onChanged(value => {
			if (value == 'No') {
				draftDom.find('.crater-panel-link').css({ display: 'none' });
			}
			else {
				draftDom.find('.crater-panel-link').cssRemove(['display']);
			}
		});

		linkPane.find('#Position-cell').onChanged(value => {
			if (value == 'Left') {
				draftDom.find('.crater-panel-link').css({ justifySelf: 'flex-start' });
			}
			else if (value == 'Right') {
				draftDom.find('.crater-panel-link').css({ justifySelf: 'flex-end' });
			}
			else if (value == 'Center') {
				draftDom.find('.crater-panel-link').css({ justifySelf: 'center' });
			}
		});

		linkPane.find('#Location-cell').onChanged(value => {
			if (value == 'Bottom') {
				draftDom.find('.crater-panel-link').css({ top: 'unset', bottom: 0 });
			}
			else {
				draftDom.find('.crater-panel-link').css({ top: 0, bottom: 'unset' });
			}
		});

		contentPane.find('#Border-cell').onChanged();
		contentPane.find('#Background-Color-cell').onChanged();

		settingsPane.find('#Link-Window-cell').onChanged();
		settingsPane.find('#Style-cell').onChanged();
		settingsPane.find('#Border-cell').onChanged();
		settingsPane.find('#Background-cell').onChanged();

		this.paneContent.find('.new-component').addEventListener('click', event => {

			this.sharePoint.app.findAll('.crater-display-panel').forEach(panel => {
				panel.remove();
			});

			let generated = this.sharePoint.displayPanel(webpart => {
				let newPanelContent = this.sharePoint.appendWebpart(panelContents, webpart.dataset.webpart);
				let newPanelContentRow = panelContentPanePrototype.cloneNode(true);
				panelContentPane.append(newPanelContentRow);

				panelContentRowHandler(newPanelContentRow, newPanelContent);
			});
			this.paneContent.append(generated);
		});

		this.paneContent.findAll('.crater-panel-content-row-pane').forEach((panelContent, position) => {
			panelContentRowHandler(panelContent, panelContentDom[position]);
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;

			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			let keyedElements = panelContents.children;
			for (let i = 0; i < keyedElements.length; i++) {
				this.craterWebparts[keyedElements[i].dataset.type]({ action: 'rendered', element: keyedElements[i], sharePoint: this.sharePoint });
			}

			settings.linkWindow = settingsPane.find('#Link-Window-cell').value;

			if (settingsPane.find('#Style-cell').value == '' || settingsPane.find('#Style-cell').value == 'None') {
				this.element.find('.crater-panel-webparts').css({ border: contentPane.find('#Border-cell').value });
				this.element.find('.crater-panel-webparts').css({ background: contentPane.find('#Background-Color-cell').value });

				this.element.find('.crater-panel-title').css({ border: titlePane.find('#Border-cell').value });
				this.element.find('.crater-panel-title').css({ background: titlePane.find('#backgroundcolor-cell').value });
			}
			else {
				this.element.find('.crater-panel-title').css({ background: 'none', border: 'none' });
				this.element.find('.crater-panel-webparts').css({ background: 'none', border: 'none' });

				if (settingsPane.find('#Style-cell').value == 'Colored') {
					this.element.find('.crater-panel-title').css({ background: settingsPane.find('#Background-cell').value });
					this.element.find('.crater-panel-webparts').css({ background: settingsPane.find('#Background-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value == 'Bordered') {
					this.element.find('.crater-panel-title').css({ border: settingsPane.find('#Border-cell').value });
					this.element.find('.crater-panel-webparts').css({ border: settingsPane.find('#Border-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value.toLowerCase() == 'title colored and content bordered') {
					this.element.find('.crater-panel-title').css({ background: settingsPane.find('#Background-cell').value });
					this.element.find('.crater-panel-webparts').css({ border: settingsPane.find('#Border-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value.toLowerCase() == 'title bordered and content colored') {
					this.element.find('.crater-panel-webparts').css({ background: settingsPane.find('#Background-cell').value });
					this.element.find('.crater-panel-title').css({ border: settingsPane.find('#Border-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value.toLowerCase() == 'separated') {
					this.element.find('.crater-panel-webparts').css({ borderTop: settingsPane.find('#Border-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value.toLowerCase() == 'title colored and separated') {
					this.element.find('.crater-panel-title').css({ background: settingsPane.find('#Background-cell').value });
					this.element.find('.crater-panel-webparts').css({ borderTop: settingsPane.find('#Border-cell').value });
				}
				else if (settingsPane.find('#Style-cell').value.toLowerCase() == 'remove') {
					// this.element.find('.crater-panel-webparts').cssRemove(['border', 'background']);
					// this.element.find('.crater-panel-title').cssRemove(['border', 'background']);
				}
			}

			this.sharePoint.saveSettings(this.element, settings);
		});
	}
}

export { Panel };