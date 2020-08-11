import { ElementModifier } from './../ElementModifier';

class List extends ElementModifier {
	public params: any;
	public paneContent: any;
	public element: any;
	public key: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params) {
		if (!this.func.isset(params.source))
			params.source = [
				{ title: 'Person One', subtitle: 'CEO', image: this.sharePoint.images.append, link: '#', description: 'More...' },
				{ title: 'Person Two', subtitle: 'Manager', image: this.sharePoint.images.append, link: '#', description: 'More...' },
				{ title: 'Person Three', subtitle: 'Founder', image: this.sharePoint.images.append, link: '#', description: 'More...' },
			];

		let title = 'List';
		let people = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-list', 'data-type': 'list' } });

		people.makeElement({
			element: 'div', attributes: { class: 'crater-list-title', id: 'crater-list-title' }, children: [
				{ element: 'i', attributes: { class: 'crater-list-title-icon', id: 'crater-list-title-icon', 'data-icon': this.sharePoint.icons.plus } },
				{ element: 'p', text: title, attributes: { id: 'crater-list-title-text' } }
			]
		});

		let content = people.makeElement({ element: 'div', attributes: { class: 'crater-list-content', id: 'crater-list-content' } });

		for (let person of params.source) {
			content.append(this.createElement({
				element: 'div', attributes: { class: 'crater-list-content-row' }, children: [
					this.createElement({ element: 'img', attributes: { class: 'crater-list-content-row-image', id: 'image', src: person.image.Url || person.image, alt: "DP" } }),
					this.createElement({
						element: 'div', attributes: { class: 'crater-list-content-row-details' }, children: [
							this.createElement({ element: 'a', attributes: { class: 'crater-list-content-row-details-title', id: 'title' }, text: person.title }),
							this.createElement({ element: 'a', attributes: { class: 'crater-list-content-row-details-subtitle', id: 'subtitle' }, text: person.subtitle }),
							this.createElement({ element: 'a', attributes: { href: person.link, class: 'crater-list-content-row-details-link', id: 'link' }, text: person.description })
						]
					})
				]
			}));
		}

		this.func.objectCopy(params, people.dataset);
		this.key = this.key || people.dataset.key;

		let settings = {
			image: {},
			details: {},
			detailsTitle: {},
			detailsSubtitle: {},
			detailsDescription: {},
			item: {}
		};

		this.sharePoint.saveSettings(people, settings);

		return people;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let rows = this.element.findAll('.crater-list-content-row');

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];

			row.find('#image').css(settings.image);
			if (settings.image.shape == 'Block') {
				row.find('#image').css({ borderRadius: 'unset' });
			}
			else if (settings.image.shape == 'Round Edges') {
				row.find('#image').css({ borderRadius: '10px' });
			}
			else {
				row.find('#image').cssRemove(['border-radius']);
			}

			if (settings.image.show == 'No') {
				row.find('#image').css({ display: 'none' });
			}
			else {
				row.find('#image').cssRemove(['display']);
			}

			row.find('.crater-list-content-row-details').css(settings.details);

			row.find('.crater-list-content-row-details-title').css(settings.detailsTitle);

			row.find('.crater-list-content-row-details-subtitle').css(settings.detailsSubtitle);

			row.find('.crater-list-content-row-details-link').css(settings.detailsDescription);

			row.css(settings.item);
			if (settings.item.hover == 'Zoom In') {
				row.onHover({ css: { padding: '1.5em' } });
			}
			else if (settings.item.hover == 'Zoom Out') {
				row.onHover({ css: { padding: '.5em' } });
			}
			else if (settings.item.hover == 'Elevate') {
				row.onHover({ css: { boxShadow: '2px 2px #999999', border: 'none' } });
			}

			this.element.find('.crater-list-content').css({ gridGap: settings.item.space });

			if (settings.item.style == 'Block') {
				row.cssRemove(['border-radius']);
			}
			else if (settings.item.style == 'Round Edges') {
				row.css({ borderRadius: '10px' });
			}
		}
	}

	public setUpPaneContent(params): any {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		}).monitor();

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {
			let peopleList = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-content');
			let peopleListRows = peopleList.findAll('.crater-list-content-row');
			this.paneContent.makeElement({
				element: 'div', children: [
					this.createElement({
						element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New'
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'title-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'People Title'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: 'crater-icon', 'data-icon': this.element.find('.crater-list-title-icon').dataset.icon }
							}),
							this.cell({
								element: 'input', name: 'title', value: this.element.find('.crater-list-title').textContent
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'fontsize', value: this.element.find('.crater-list-title').css()['font-size'], list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'height', value: this.element.find('.crater-list-title').css()['height'] || '', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Show', options: ['Yes', 'No']
							})
						]
					})
				]
			});

			this.paneContent.append(this.generatePaneContent({ list: peopleListRows }));

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'image-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Image Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Image Width', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Image Height', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Image Shape', options: ['Block', 'Circle', 'Round Edges']
							}),
							this.cell({
								element: 'input', name: 'Image Background', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'select', name: 'Image Show', options: ['Yes', 'No']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'details-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Details Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'Vertical Alignment', options: ['Start', 'Center', 'End']
							}),
							this.cell({
								element: 'select', name: 'Horizontal Alignment', options: ['Left', 'Center', 'Right']
							}),
							this.cell({
								element: 'input', name: 'Space Between', list: this.func.pixelSizes
							}),
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'details-title-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Details Title Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Boldness', list: this.func.boldness
							}),
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
							}),
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'details-subtitle-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Details Subtitle Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Boldness', list: this.func.boldness
							}),
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'details-description-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Details Description Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'Font Size', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'Font Style', list: this.func.fontStyles
							}),
							this.cell({
								element: 'input', name: 'Font Boldness', list: this.func.boldness
							}),
							this.cell({
								element: 'input', name: 'Color', dataAttributes: { type: 'color', value: '#000000' }
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'settings-pane card' }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'List Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'select', name: 'Item Hover', options: ['Zoom In', 'Zoom Out', 'Elevate']
							}),
							this.cell({
								element: 'select', name: 'Link Window', options: ['Same Window', 'New Window', 'Pop Up'], value: settings.linkWindow
							}),
							this.cell({
								element: 'input', name: 'Item Space', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'Item Style', options: ['Block', 'Round Edges']
							}),
							this.cell({
								element: 'input', name: 'Item Border', list: this.func.borders
							})
						]
					})
				]
			});
		}

		return this.paneContent;
	}

	public generatePaneContent(params) {
		let listPane = this.createElement({
			element: 'div', attributes: { class: 'card list-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'People List'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.list.length; i++) {
			listPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-list-row-pane row' },
				children: [
					this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-list-content-row' }),
					this.cell({
						element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: params.list[i].find('#image').src }
					}),
					this.cell({
						element: 'input', name: 'Title', value: params.list[i].find('#title').textContent
					}),
					this.cell({
						element: 'input', name: 'Subtitle', value: params.list[i].find('#subtitle').textContent
					}),
					this.cell({
						element: 'input', name: 'Link', value: params.list[i].find('#link').href
					}),
					this.cell({
						element: 'input', name: 'Description', value: params.list[i].find('#link').textContent
					}),
					this.cell({
						element: 'input', name: 'Background', dataAttributes: { type: 'color', value: '#ffffff' }
					})
				]
			});
		}

		return listPane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let peopleList = draftDom.find('.crater-list-content');
		let peopleListRows = peopleList.findAll('.crater-list-content-row');

		let listRowPrototype = this.createElement({
			element: 'div',
			attributes: {
				class: 'crater-list-row-pane row'
			},
			children: [
				this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-list-content-row' }),
				this.cell({
					element: 'img', name: 'Image', edit: 'upload-image', dataAttributes: { src: this.sharePoint.images.append, class: 'crater-icon' }
				}),
				this.cell({
					element: 'input', name: 'Title', value: 'title'
				}),
				this.cell({
					element: 'input', name: 'Subtitle', value: 'Subtitle'
				}),
				this.cell({
					element: 'input', name: 'Link', value: 'Link'
				}),
				this.cell({
					element: 'input', name: 'Description', value: 'More...'
				}),
				this.cell({
					element: 'input', name: 'Background', dataAttributes: { type: 'color', value: '#ffffff' }
				})
			]
		});

		let peopleContentRowPrototype = this.createElement({
			element: 'div', attributes: { class: 'crater-list-content-row' }, children: [
				this.createElement({ element: 'img', attributes: { class: 'crater-list-content-row-image', id: 'image', src: this.sharePoint.images.append, alt: 'DP' } }),
				this.createElement({
					element: 'div', attributes: { class: 'crater-list-content-row-details' }, children: [
						this.createElement({ element: 'a', attributes: { class: 'crater-list-content-row-details-title', id: 'title' }, text: 'Title' }),
						this.createElement({ element: 'a', attributes: { class: 'crater-list-content-row-details-subtitle', id: 'subtitle' }, text: 'Subtitle' }),
						this.createElement({ href: '#', element: 'a', attributes: { class: 'crater-list-content-row-details-link' }, text: 'More...' })
					]
				})
			]
		});

		let listRowHandler = (listRowPane, listRowDom) => {
			listRowPane.addEventListener('mouseover', event => {
				listRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			listRowPane.addEventListener('mouseout', event => {
				listRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			listRowPane.find('#Image-cell').checkChanges(() => {
				listRowDom.find('.crater-list-content-row-image').src = listRowPane.find('#Image-cell').src;
			});

			listRowPane.find('#Title-cell').onChanged(value => {
				listRowDom.find('.crater-list-content-row-details-title').innerHTML = value;
			});

			listRowPane.find('#Subtitle-cell').onChanged(value => {
				listRowDom.find('.crater-list-content-row-details-subtitle').innerHTML = value;
			});

			listRowPane.find('#Link-cell').onChanged(value => {
				listRowDom.find('.crater-list-content-row-details-link').href = value;
			});

			listRowPane.find('#Description-cell').onChanged(value => {
				listRowDom.find('.crater-list-content-row-details-link').textContent = value;
			});

			listRowPane.find('#Background-cell').onChanged(background => {
				listRowDom.css({ background });
			});

			listRowPane.find('.delete-crater-list-content-row').addEventListener('click', event => {
				listRowDom.remove();
				listRowPane.remove();
			});

			listRowPane.find('.add-before-crater-list-content-row').addEventListener('click', event => {
				let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
				let newListRow = listRowPrototype.cloneNode(true);

				listRowDom.before(newPeopleListRow);
				listRowPane.before(newListRow);
				listRowHandler(newListRow, newPeopleListRow);
			});

			listRowPane.find('.add-after-crater-list-content-row').addEventListener('click', event => {
				let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
				let newListRow = listRowPrototype.cloneNode(true);

				listRowDom.after(newPeopleListRow);
				listRowPane.after(newListRow);

				listRowHandler(newListRow, newPeopleListRow);
			});
		};

		let titlePane = this.paneContent.find('.title-pane');
		let imagePane = this.paneContent.find('.image-pane');
		let detailsPane = this.paneContent.find('.details-pane');
		let detailsTitlePane = this.paneContent.find('.details-title-pane');
		let detailsSubtitlePane = this.paneContent.find('.details-subtitle-pane');
		let detailsDescriptionPane = this.paneContent.find('.details-description-pane');
		let settingsPane = this.paneContent.find('.settings-pane');

		titlePane.find('#icon-cell').checkChanges(() => {
			draftDom.find('.crater-list-title-icon').removeClasses(draftDom.find('.crater-list-title-icon').dataset.icon);
			draftDom.find('.crater-list-title-icon').addClasses(titlePane.find('#icon-cell').dataset.icon);
			draftDom.find('.crater-list-title-icon').dataset.icon = titlePane.find('#icon-cell').dataset.icon;
		});

		titlePane.find('#title-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-title').innerHTML = value;
		});

		titlePane.find('#Show-cell').onChanged(value => {
			if (value == 'No') {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-title').hide();
			} else {
				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-title').show();
			}
		});

		titlePane.find('#backgroundcolor-cell').onChanged(backgroundColor => {
			draftDom.find('.crater-list-title').css({ backgroundColor });
		});

		titlePane.find('#color-cell').onChanged(color => {
			draftDom.find('.crater-list-title').css({ color });
		});

		imagePane.find('#Image-Width-cell').onChanged();
		imagePane.find('#Image-Height-cell').onChanged();
		imagePane.find('#Image-Shape-cell').onChanged();
		imagePane.find('#Image-Background-cell').onChanged();
		imagePane.find('#Image-Show-cell').onChanged();

		detailsPane.find('#Vertical-Alignment-cell').onChanged();
		detailsPane.find('#Horizontal-Alignment-cell').onChanged();
		detailsPane.find('#Space-Between-cell').onChanged();

		detailsTitlePane.find('#Font-Size-cell').onChanged();
		detailsTitlePane.find('#Font-Style-cell').onChanged();
		detailsTitlePane.find('#Font-Boldness-cell').onChanged();
		detailsTitlePane.find('#Color-cell').onChanged();

		detailsSubtitlePane.find('#Font-Size-cell').onChanged();
		detailsSubtitlePane.find('#Font-Style-cell').onChanged();
		detailsSubtitlePane.find('#Font-Boldness-cell').onChanged();
		detailsSubtitlePane.find('#Color-cell').onChanged();

		detailsDescriptionPane.find('#Font-Size-cell').onChanged();
		detailsDescriptionPane.find('#Font-Style-cell').onChanged();
		detailsDescriptionPane.find('#Font-Boldness-cell').onChanged();
		detailsDescriptionPane.find('#Color-cell').onChanged();

		settingsPane.find('#Item-Hover-cell').onChanged();
		settingsPane.find('#Link-Window-cell').onChanged(linkWindow => {
			settings.linkWindow = linkWindow;
		});
		settingsPane.find('#Item-Space-cell').onChanged();
		settingsPane.find('#Item-Border-cell').onChanged();
		settingsPane.find('#Item-Style-cell').onChanged();

		this.paneContent.find('.title-pane').find('#fontsize-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-title').css({ fontSize: value });
		});

		this.paneContent.find('.title-pane').find('#height-cell').onChanged(value => {
			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-title').css({ height: value });
		});

		this.paneContent.find('.new-component').addEventListener('click', event => {
			let newPeopleListRow = peopleContentRowPrototype.cloneNode(true);
			let newListRow = listRowPrototype.cloneNode(true);

			this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-list-content').append(newPeopleListRow);//c
			this.paneContent.find('.list-pane').append(newListRow);

			listRowHandler(newListRow, newPeopleListRow);
		});

		this.paneContent.findAll('.crater-list-row-pane').forEach((listRow, position) => {
			listRowHandler(listRow, peopleListRows[position]);
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = draftDom.innerHTML;
			this.element.css(draftDom.css());
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

			settings.image.width = imagePane.find('#Image-Width-cell').value;
			settings.image.height = imagePane.find('#Image-Height-cell').value;
			settings.image.shape = imagePane.find('#Image-Shape-cell').value;
			settings.image.background = imagePane.find('#Image-Background-cell').value;
			settings.image.show = imagePane.find('#Image-Show-cell').value;

			settings.details.alignContent = detailsPane.find('#Vertical-Alignment-cell').value;
			settings.details.justifyContent = detailsPane.find('#Horizontal-Alignment-cell').value;
			settings.details.gridGap = detailsPane.find('#Space-Between-cell').value;

			settings.detailsTitle.fontSize = detailsTitlePane.find('#Font-Size-cell').value;
			settings.detailsTitle.fontFamily = detailsTitlePane.find('#Font-Style-cell').value;
			settings.detailsTitle.fontWeight = detailsTitlePane.find('#Font-Boldness-cell').value;
			settings.detailsTitle.color = detailsTitlePane.find('#Color-cell').value;

			settings.detailsSubtitle.fontSize = detailsSubtitlePane.find('#Font-Size-cell').value;
			settings.detailsSubtitle.fontFamily = detailsSubtitlePane.find('#Font-Style-cell').value;
			settings.detailsSubtitle.fontWeight = detailsSubtitlePane.find('#Font-Boldness-cell').value;
			settings.detailsSubtitle.color = detailsSubtitlePane.find('#Color-cell').value;

			settings.detailsDescription.fontSize = detailsDescriptionPane.find('#Font-Size-cell').value;
			settings.detailsDescription.fontFamily = detailsDescriptionPane.find('#Font-Style-cell').value;
			settings.detailsDescription.fontWeight = detailsDescriptionPane.find('#Font-Boldness-cell').value;
			settings.detailsDescription.color = detailsDescriptionPane.find('#Color-cell').value;

			settings.item.hover = settingsPane.find('#Item-Hover-cell').value;
			settings.item.space = settingsPane.find('#Item-Space-cell').value;
			settings.item.style = settingsPane.find('#Item-Style-cell').value;
			settings.item.border = settingsPane.find('#Item-Border-cell').value;

			this.sharePoint.saveSettings(this.element, settings);
		});
	}

	public update(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');
		let metadata = params.connection.metadata || {};
		let options = params.connection.options || [];

		let updateWindow = this.createForm({
			title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
			contents: {
				image: { element: 'select', attributes: { id: 'meta-data-image', name: 'Image' }, options, selected: metadata.image },
				title: { element: 'select', attributes: { id: 'meta-data-title', name: 'Title' }, options, selected: metadata.title },
				job: { element: 'select', attributes: { id: 'meta-data-job', name: 'Job' }, options, selected: metadata.job },
				link: { element: 'select', attributes: { id: 'meta-data-link', name: 'Link' }, options, selected: metadata.link }
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
			}
		});

		updateWindow.find('#update-element').addEventListener('click', event => {
			event.preventDefault();
			params.connection.metadata.image = updateWindow.find('#meta-data-image').value;
			params.connection.metadata.title = updateWindow.find('#meta-data-title').value;
			params.connection.metadata.job = updateWindow.find('#meta-data-job').value;
			params.connection.metadata.link = updateWindow.find('#meta-data-link').value;
			params.container = draftDom;
			params.flag = true;

			this.runUpdate(params);
			updateWindow.find('.form-error').css({ display: 'unset' });
			updateWindow.find('.form-error').textContent = 'Drafted Updated';
		});

		if (!this.func.isnull(paneConnection)) {
			paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
				this.element.innerHTML = draftDom.innerHTML;
				this.element.css(draftDom.css());
				this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			});
		}

		return updateWindow;
	}

	public runUpdate(params) {
		let source = this.func.extractFromJsonArray(params.connection.metadata, params.source);
		let key = this.key || params.container.dataset.key;
		let newContent = this.render({ source });
		params.container.find('.crater-list-content').innerHTML = newContent.find('.crater-list-content').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.list-pane').innerHTML = this.generatePaneContent({ list: newContent.findAll('.crater-list-content-row') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { List };