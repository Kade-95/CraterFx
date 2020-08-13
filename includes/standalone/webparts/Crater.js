let crater = function(params) {
	let self = {};

	self.render = function () {
		let crater = craterApp.craterWebparts.createKeyedElement({
			element: 'div', attributes: { class: 'crater-crater crater-component', 'data-type': 'crater' }, options: ['Edit', 'Delete', 'Clone', 'Paste', 'Undo', 'Redo'], children: [
				{ element: 'div', attributes: { class: 'crater-sections-container', id: 'crater-sections-container' } }
			], alignOptions: 'left',
		});
		self.key = crater.dataset['key'];
		let settings = {
			columns: 1,
			columnsSizes: '1fr',
			widths: ['100%'],
			kendo: 'helo'
		};

		craterApp.saveSettings(crater, settings);
		return crater;
	}

	self.rendered = function (params) {
		self.element = params.element;
		self.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		self.resetSections({ resetWidth: params.resetWidth });
        craterApp.craterWebparts.showOptions(self.element);
		let sections = self.element.find('.crater-sections-container').childNodes;

		self.element.addEventListener('mouseup', () => {
			for (let i = 0; i < sections.length; i++) {
				sections[i].dispatchEvent(new CustomEvent('mouseup'));
			}
		});

		self.element.addEventListener('mouseleave', event => {
			for (let i = 0; i < sections.length; i++) {
				sections[i].dispatchEvent(new CustomEvent('mouseup'));
			}
		});

		self.element.cssRemove(['cursor']);
	}

	self.generatePaneContent = function (params) {
		let listPane = kerdx.createElement({
			element: 'div', attributes: { class: 'card sections-pane', style: { display: 'block' } }, children: [
				kerdx.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						kerdx.createElement({
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
					craterApp.craterWebparts.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-content-row' }),
					kerdx.cell({
						element: 'select', name: 'Scroll', options: ["Yes", "No"]
					}),
				]
			});
		}

		return listPane;
	}

	self.setUpPaneContent = function (params) {
		self.element = params.element;
		self.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		self.paneContent = kerdx.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content', 'data-property-key': self.key }
		}).monitor();

		if (craterApp.attributes.pane.content[self.key].draft.pane.content != '') {
			self.paneContent.innerHTML = craterApp.attributes.pane.content[self.key].draft.pane.content;
		}
		else if (craterApp.attributes.pane.content[self.key].content != '') {
			self.paneContent.innerHTML = craterApp.attributes.pane.content[self.key].content;
		}
		else {
			console.log('Pane Content Empty');

			let container = craterApp.attributes.pane.content[self.key].draft.dom.find('.crater-sections-container');

			let elementContents = container.childNodes;
			self.paneContent.append(self.generatePaneContent({ source: elementContents }));

			let settingsPane = self.paneContent.makeElement({
				element: 'div', attributes: { class: 'card settings-pane', style: { display: 'block' } }, children: [
					kerdx.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							kerdx.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Settings'
							})
						]
					}),
					kerdx.cell({
						element: 'input', name: 'Columns', value: settings.columns
					}),
					kerdx.cell({
						element: 'input', name: 'Update', value: settings.columns
					}),
					kerdx.cell({
						element: 'input', name: 'Columns Sizes', value: settings.columnsSizes || '', list: ['50% 50%', '30% 30% 40%', '33.3% 33.3% 33.3%', '35% 65%']
					}),
					kerdx.cell({
						element: 'select', name: 'Scroll', options: ["Yes", "No"]
					}),
				]
			});
		}

		// upload the settings
		self.paneContent.find('#Columns-cell').value = settings.columns;

		self.paneContent.find('#Columns-Sizes-cell').value = settings.columnsSizes;

		let contents = craterApp.attributes.pane.content[self.key].draft.dom.find('.crater-sections-container').childNodes;

		self.paneContent.find('.sections-pane').innerHTML = self.generatePaneContent({ source: contents }).innerHTML;

		return self.paneContent;
	}

	self.listenPaneContent = function (params) {
		self.element = params.element;
		self.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		self.paneContent = craterApp.app.find('.crater-property-content');
		let draftDom = craterApp.attributes.pane.content[self.key].draft.dom;

		let sectionRowPanes = self.paneContent.findAll('.crater-section-row-pane');
		let sections = draftDom.findAll('.crater-section');

		let settingsPane = self.paneContent.find('.settings-pane');

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

		self.paneContent.addEventListener('mutated', event => {
			craterApp.attributes.pane.content[self.key].draft.pane.content = self.paneContent.innerHTML;
			craterApp.attributes.pane.content[self.key].draft.html = craterApp.attributes.pane.content[self.key].draft.dom.outerHTML;
		});

		self.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			self.element.innerHTML = craterApp.attributes.pane.content[self.key].draft.dom.innerHTML;
			self.element.css(craterApp.attributes.pane.content[self.key].draft.dom.css());

			craterApp.attributes.pane.content[self.key].content = self.paneContent.innerHTML;//update webpart

			settings.columnsSizes = settingsPane.find('#Columns-Sizes-cell').value;

			if (settings.columns < self.paneContent.find('#Columns-cell').value) {
				settings.columns = self.paneContent.find('#Columns-cell').value;
				settings.resetWidth = true;

				self.resetSections({ resetWidth: true });
			}
			else if (settings.columns > self.paneContent.find('#Columns-cell').value) { //check if the columns is less than current
				alert("New number of column should be more than current");
			}

			craterApp.saveSettings(self.element, settings);
		});
	}

	self.resetSections = function (params) {
		params = kerdx.isset(params) ? params : {};
		let craterSectionsContainer = self.element.find('.crater-sections-container');

		let sections = craterSectionsContainer.findAll('.crater-section');
		let count = sections.length;
		const settings = JSON.parse(self.element.dataset.settings);

		let number = settings.columns - count;
		let newSections = self.createSections({ number, height: '100px' }).findAll('.crater-section');

		//copy the current contents of the sections into the newly created sections
		for (let i = 0; i < newSections.length; i++) {
			craterSectionsContainer.append(newSections[i]);
		}

		// reset count
		count = craterSectionsContainer.childNodes.length;
		craterSectionsContainer.css({ gridTemplateColumns: `repeat(${count}, 1fr` });
		let childSections = craterSectionsContainer.findAll('.crater-section');
		for (let i = 0; i < childSections.length; i++) {
			craterApp.craterWebparts[childSections[i].dataset.type]({ action: 'rendered', element: childSections[i], sharePoint: craterApp });
			childSections[i].css({ width: '100%' });

			settings.widths[i] = childSections[i].position().width + 'px';
		}

		craterSectionsContainer.css({ gridTemplateColumns: settings.columnsSizes });
	}

	self.createSections = function (params) {
		let parent = kerdx.createElement({
			element: 'div', options: []
		});

		for (let i = 0; i < params.number; i++) {
			//create the sections as keyed elements
			let element = craterApp.craterWebparts['section']({ action: 'render', height: params.height });

			parent.append(element);
		}

		return parent;
	}

	return self;
}

export { crater };