import { ElementModifier } from './../ElementModifier';

class Table extends ElementModifier {

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
		let sample = { name: 'Person Two', job: 'Manager', age: '30', salary: '2000000' };
		let tableContainer = this.createKeyedElement({ element: 'div', attributes: { class: 'crater-component crater-table-container', 'data-type': 'table', style: { position: 'relative' } } });

		if (!this.func.isset(params.source)) {
			params.source = [];
			for (let i = 0; i < 5; i++) {
				params.source.push(sample);
			}
		}

		let table = this.createTable({
			contents: params.source, rowClass: 'crater-table-row'
		});

		table.classList.add('crater-table');
		table.id = 'crater-table';

		let settings = {
			sorting: {},
			headers: [],
			stripes: 'white, lightgray',
			hoverBackground: 'black',
			hoverColor: 'white',
			thead: { backgroundColor: 'black', color: 'white' },
			tbody: {},
			borderSize: '1px',
			borderColor: '#000000',
			borderStyle: 'solid'

		};

		let headers = table.findAll('th');
		for (let i = 0; i < headers.length; i++) {
			settings.headers.push(headers[i].textContent);
		}
		this.key = this.key || tableContainer.dataset.key;

		tableContainer.append(table);
		let thead = table.find('thead');

		tableContainer.makeElement({
			element: 'form', attributes: { style: { display: 'none', position: 'absolute', right: 0, top: 0, placeContent: 'center' } }, children: [
				{ element: 'input', attributes: { id: 'crater-table-search-box', placeholder: 'Search me...', } },
				{ element: 'img', attributes: { class: 'crater-icon', src: this.sharePoint.images.search, cursor: 'pointer' } }
			]
		});

		let ths = thead.findAll('th');
		for (let i = 0; i < ths.length; i++) {
			const text = ths[i].textContent;
			ths[i].innerHTML = '';
			ths[i].makeElement({
				element: 'span', attributes: { style: { display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gridGap: '.5em', justifyContent: 'center' } }, children: [
					this.createElement({ element: 'span', attributes: { class: `crater-table-td-text` }, text }),
					this.createElement({ element: 'span', attributes: { class: `crater-table-sorter crater-arrow crater-down-arrow`, style: { width: '10px', height: '10px', visibility: '' } } })
				]
			});
		}

		this.sharePoint.saveSettings(tableContainer, settings);
		return tableContainer;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let thead = this.element.find('thead');
		let tbody = this.element.find('tbody');

		let dataRows = tbody.findAll('tr');

		let doneSorting = () => {
			settings = JSON.parse(this.element.dataset.settings);
			let style = settings.style || 'Default';
			let stripes = settings.stripes.split(',');
			let { hoverBackground } = settings;
			let { hoverColor } = settings;
			let border = `${settings.borderSize} ${settings.borderStyle} ${settings.borderColor}`;

			let rows = tbody.findAll('tr');
			let hRows = thead.findAll('tr');

			for (let i = 0; i < rows.length; i++) {
				rows[i].cssRemove(['border']);
				rows[i].onHover({ css: { background: hoverBackground, color: hoverColor } });
				rows[i].css({ backgroundColor: settings.tbody.backgroundColor, color: settings.tbody.color });

				let cells = rows[i].findAll('td');
				for (let j = 0; j < cells.length; j++) {
					cells[j].cssRemove(['border']);
				}
			}

			for (let i = 0; i < hRows.length; i++) {
				hRows[i].cssRemove(['border']);
				hRows[i].css({ backgroundColor: settings.thead.backgroundColor, color: settings.thead.color });

				let cells = hRows[i].findAll('td');
				for (let j = 0; j < cells.length; j++) {
					cells[j].cssRemove(['border']);
				}
			}

			if (style == 'Default') {
				for (let i = 0; i < rows.length; i++) {
					rows[i].css({ background: 'transparent', border: 'none' });
				}
			}
			else if (style == 'Stripped') {
				for (let i = 0; i < rows.length; i++) {
					rows[i].css({ background: stripes[i % stripes.length].trim() });
				}
			}
			else if (style == 'Row Bordered') {
				for (let i = 0; i < rows.length; i++) {
					rows[i].css({ border });
				}

				for (let i = 0; i < hRows.length; i++) {
					hRows[i].css({ border });
				}
			}
			else if (style == 'Cell Bordered') {
				for (let i = 0; i < rows.length; i++) {
					let cells = rows[i].findAll('td');
					for (let j = 0; j < cells.length; j++) {
						cells[j].css({ border });
					}
				}

				for (let i = 0; i < hRows.length; i++) {
					let cells = hRows[i].findAll('th');
					for (let j = 0; j < cells.length; j++) {
						cells[j].css({ border });
					}
				}
			}
		};

		doneSorting();

		let sorters = thead.findAll('.crater-table-sorter');
		for (let i = 0; i < sorters.length; i++) {
			sorters[i].addEventListener('click', event => {
				let order = sorters[i].classList.contains('crater-up-arrow') ? -1 : 1;
				let name = sorters[i].getParents('th').dataset.name.split('crater-table-data-')[1];
				let data = this.sortTable(this.element.find('table'), name, order);
				let newContent = this.render({ source: data });

				this.element.find('table').find('tbody').innerHTML = newContent.find('table').find('tbody').innerHTML;

				sorters[i].classList.toggle('crater-up-arrow');
				sorters[i].classList.toggle('crater-down-arrow');

				settings.sorting[name] = order;
				this.element.dataset.settings = JSON.stringify(settings);
				doneSorting();
			});
		}

		let searchBox = this.element.find('#crater-table-search-box');

		searchBox.nextSibling.addEventListener('click', event => {
			searchBox.toggle();
		});

		searchBox.parentNode.addEventListener('mouseenter', event => {
			searchBox.parentNode.css({ display: 'flex' });
		});

		if (settings.showSearch == 'No') {
			searchBox.parentNode.css({ display: 'none' });
		}
		else {
			this.element.addEventListener('mouseenter', event => {
				searchBox.parentNode.css({ display: 'flex' });
			});

			this.element.addEventListener('mouseleave', event => {
				searchBox.parentNode.css({ display: 'none' });
			});
		}

		searchBox.onChanged(query => {
			for (let i = 0; i < dataRows.length; i++) {
				if (this.func.isSubString(dataRows[i].textContent.toLowerCase(), query.toLowerCase())) {
					dataRows[i].cssRemove(['display']);
				}
				else {
					dataRows[i].css({ display: 'none' });
				}
			}
		});
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
			let table = this.sharePoint.attributes.pane.content[this.key].draft.dom.find('table');

			this.paneContent.append(this.generatePaneContent({ table }));

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card table-header-settings', style: { display: 'block' } }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Table Head'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontsize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'height', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'select', name: 'show', options: ['Yes', 'No']
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card table-data-settings', style: { display: 'block' } }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Table Data'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'fontsize', list: this.func.pixelSizes
							}),
							this.cell({
								element: 'input', name: 'color', dataAttributes: { type: 'color', value: '#000000' }
							}),
							this.cell({
								element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'input', name: 'height', dataAttributes: { type: 'number', min: 1 }
							}),
							this.cell({
								element: 'select', name: 'style', options: ['Default', 'Stripped', 'Row Bordered', 'Cell Bordered']
							}),
							this.cell({
								element: 'input', name: 'stripes', value: 'white, lightgray'
							}),
							this.cell({
								element: 'input', name: 'hover background', dataAttributes: { type: 'color' }
							}),
							this.cell({
								element: 'input', name: 'hover color', dataAttributes: { type: 'color', value: '#ffffff' }
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card table-settings', style: { display: 'block' } }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Table Settings'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'input', name: 'border size', list: this.func.pixelSizes, value: settings.borderSize
							}),
							this.cell({
								element: 'input', name: 'border color', dataAttributes: { type: 'color', value: settings.borderColor }
							}),
							this.cell({
								element: 'input', name: 'border style', list: this.func.borderTypes, value: settings.borderStyle
							})
						]
					})
				]
			});

			this.paneContent.makeElement({
				element: 'div', attributes: { class: 'card table-search-settings', style: { display: 'block' } }, children: [
					this.createElement({
						element: 'div', attributes: { class: 'card-title' }, children: [
							this.createElement({
								element: 'h2', attributes: { class: 'title' }, text: 'Table Search'
							})
						]
					}),
					this.createElement({
						element: 'div', attributes: { class: 'row' }, children: [
							this.cell({
								element: 'img', name: 'search image', edit: 'upload-image', dataAttributes: { class: 'crater-icon', src: this.sharePoint.images.search }
							}),
							this.cell({
								element: 'input', name: 'background color', dataAttributes: { type: 'color', value: '#ffffff' }
							}),
							this.cell({
								element: 'select', name: 'position', options: ['Left', 'Right']
							}),
							this.cell({
								element: 'select', name: 'location', options: ['Top', 'Bottom']
							}),
							this.cell({
								element: 'select', name: 'show', options: ['Yes', 'No']
							})
						]
					})
				]
			});
		}

		this.paneContent.childNodes.forEach(child => {
			if (child.classList.contains('crater-content-options')) {
				child.remove();
			}
		});

		this.paneContent.find('tbody').findAll('tr').forEach(tr => {
			tr.makeElement({
				element: this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-table-content-row' })
			});
		});

		return this.paneContent;
	}

	private generatePaneContent(params) {
		let tablePane = this.createElement({
			element: 'div', attributes: { class: 'table-pane card' }, children: [
				params.table.cloneNode(true)
			]
		});

		if (this.func.isset(params.header)) {
			tablePane.find('thead').innerHTML = params.header;
		}
		let settings = JSON.parse(this.element.dataset.settings);

		tablePane.find('thead').findAll('th').forEach(th => {
			th.css({ position: 'relative' });
			let order = settings.sorting[th.dataset.name] == 1 ? 'crater-up-arrow' : 'crater-down-arrow';

			let data = this.createElement({
				element: 'span', attributes: { style: { width: '100%', display: 'grid', gridTemplateColumns: '80% 20%', gridGap: '1em', } }, children: [
					{
						element: 'input', attributes: { value: th.textContent }
					},
					{
						element: 'div', attributes: { class: `crater-table-sorter crater-arrow ${order}`, style: { width: '10px', height: '10px', visibility: 'hidden' } }
					}
				]
			});

			th.innerHTML = '';
			th.makeElement({
				element: this.paneOptions({ options: ['AB', 'AA', 'D'], owner: 'crater-table-content-column' })
			});
			th.append(data);
		});

		tablePane.find('tbody').findAll('tr').forEach(tr => {
			tr.findAll('td').forEach(td => {
				let data = this.createElement({
					element: 'input', attributes: { value: td.textContent }
				});
				td.innerHTML = '';
				td.append(data);
			});
		});

		return tablePane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		let table = draftDom.find('table');
		let tableBody = table.find('tbody');

		let tableRows = tableBody.findAll('tr');

		let tableRowHandler = (tableRowPane, tableRowDom) => {
			tableRowPane.addEventListener('mouseover', event => {
				tableRowPane.find('.crater-content-options').css({ visibility: 'visible' });
			});

			tableRowPane.addEventListener('mouseout', event => {
				tableRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
			});

			tableRowPane.find('.delete-crater-table-content-row').addEventListener('click', event => {
				tableRowDom.remove();
				tableRowPane.remove();
			});

			tableRowPane.find('.add-before-crater-table-content-row').addEventListener('click', event => {
				let newRow = tableRowDom.cloneNode(true);
				let newRowPane = tableRowPane.cloneNode(true);

				tableRowDom.before(newRow);
				tableRowPane.before(newRowPane);
				tableRowHandler(newRowPane, newRow);
			});

			tableRowPane.find('.add-after-crater-table-content-row').addEventListener('click', event => {
				let newRow = tableRowDom.cloneNode(true);
				let newRowPane = tableRowPane.cloneNode(true);

				tableRowDom.after(newRow);
				tableRowPane.after(newRowPane);
				tableRowHandler(newRowPane, newRow);
			});

			tableRowPane.findAll('td').forEach((td, position) => {
				td.find('input').onChanged(value => {
					tableRowDom.findAll('td')[position].textContent = value;
				});
			});
		};

		let dataName = 'crater-table-data-sample';//sample name

		this.paneContent.find('tbody').findAll('tr').forEach((tableRow, position) => {
			tableRowHandler(tableRow, tableRows[position]);
		});

		let tableHeadHandler = (thPane, thDom) => {
			thPane.addEventListener('mouseover', event => {
				thPane.find('.crater-content-options').css({ visibility: 'visible' });
				thPane.find('.crater-table-sorter').css({ visibility: 'visible' });
			});

			thPane.addEventListener('mouseout', event => {
				thPane.find('.crater-content-options').css({ visibility: 'hidden' });
				thPane.find('.crater-table-sorter').css({ visibility: 'hidden' });
			});

			thPane.find('.crater-table-sorter').addEventListener('click', event => {
				let order = thPane.find('.crater-table-sorter').classList.contains('crater-up-arrow') ? -1 : 1;
				let name = thPane.dataset.name.split('crater-table-data-')[1];
				let data = this.sortTable(table, name, order);
				let newContent = this.render({ source: data });

				this.sharePoint.attributes.pane.content[this.key].draft.dom.find('.crater-table').innerHTML = newContent.find('.crater-table').innerHTML;

				thPane.find('.crater-table-sorter').classList.toggle('crater-up-arrow');
				thPane.find('.crater-table-sorter').classList.toggle('crater-down-arrow');

				settings.sorting[thPane.dataset.name] = order;

				this.paneContent.find('.table-pane').innerHTML = this.generatePaneContent({ table: newContent.find('.table') }).innerHTML;

				this.paneContent.find('thead').findAll('th').forEach((_thPane, position) => {
					tableHeadHandler(_thPane, table.find('thead').findAll('th')[position]);
				});
			});

			thPane.find('input').onChanged(value => {
				let name = 'crater-table-data-' + value.toLowerCase();
				let ths = this.paneContent.find('thead').findAll('th');

				for (let sibling of ths) {
					if (sibling != thPane && sibling.dataset.name == name) {
						alert('Column already exists, Try another name');
						return;
					}
				}

				let tds = this.paneContent.findAll('td');

				for (let i in tds) {
					let td = tds[i];
					if (td.nodeName == 'TD' && td.dataset.name == thPane.dataset.name) {
						td.dataset.name = name;
						table.findAll('td')[i].dataset.name = name;
					}
				}

				thDom.textContent = value;
				thDom.dataset.name = name;
				thPane.dataset.name = name;
			});
		};

		this.paneContent.find('thead').findAll('th').forEach((thPane, position) => {
			tableHeadHandler(thPane, table.find('thead').findAll('th')[position]);
		});

		let tableBodyDataHandler = (td) => {
			td.addEventListener('mouseover', event => {
				for (let th of this.paneContent.find('thead').findAll('th')) {
					if (th.dataset.name == td.dataset.name) {
						th.find('.crater-content-options').css({ visibility: 'visible' });
					}
				}
			});

			td.addEventListener('mouseout', event => {
				for (let th of this.paneContent.find('thead').findAll('th')) {
					if (th.dataset.name == td.dataset.name) {
						th.find('.crater-content-options').css({ visibility: 'hidden' });
					}
				}
			});
		};

		this.paneContent.find('tbody').findAll('td').forEach(td => {
			tableBodyDataHandler(td);
		});

		let getName = () => {
			let otherThs = this.paneContent.findAll('th');
			let copyName = dataName;
			let found = true;

			while (found) {
				copyName = copyName + '-copy';
				found = false;
				for (let th of otherThs) {
					if (th.dataset.name == copyName) {
						found = true;
						break;
					}
				}
			}

			return copyName;
		};

		this.paneContent.find('thead').addEventListener('click', event => {
			let target = event.target;
			if (target.classList.contains('delete-crater-table-content-column')) {
				if (!confirm("Do you really want to delete this column")) {
					return;
				}

				let th = target.getParents('TH');

				let name = th.dataset.name;

				//remove the tds
				this.paneContent.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == name) {
						td.remove();
					}
				});

				table.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == name) {
						td.remove();
					}
				});

				//remove the TH
				table.find('thead').findAll('th').forEach(aTH => {
					if (aTH.dataset.name == name) {
						aTH.remove();
					}
				});
				th.remove();
			}
			else if (target.classList.contains('add-before-crater-table-content-column')) {
				let th = target.getParents('TH');
				let copyName = getName();
				//remove the tds
				this.paneContent.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == th.dataset.name) {
						let aTDClone = td.cloneNode(true);
						aTDClone.dataset.name = copyName;
						td.before(aTDClone);
						tableBodyDataHandler(aTDClone);
					}
				});

				table.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == th.dataset.name) {
						let aTDClone = td.cloneNode(true);
						aTDClone.dataset.name = copyName;
						td.before(aTDClone);
					}
				});

				//remove the TH
				let newPaneTH: any;
				table.find('thead').findAll('th').forEach(aTH => {
					if (aTH.dataset.name == th.dataset.name) {
						let aTHclone = aTH.cloneNode(true);
						aTHclone.dataset.name = copyName;
						aTHclone.innerText = `SAMPLE${copyName.slice(dataName.length)}`;
						aTH.before(aTHclone);
						newPaneTH = aTHclone;
					}
				});

				let aTHPaneClone = th.cloneNode(true);
				aTHPaneClone.dataset.name = copyName;
				aTHPaneClone.find('input').setAttribute('value', `${'SAMPLE'}${copyName.slice(dataName.length)}`);
				th.before(aTHPaneClone);
				tableHeadHandler(aTHPaneClone, newPaneTH);
			}
			else if (target.classList.contains('add-after-crater-table-content-column')) {
				let th = target.getParents('TH');
				let copyName = getName();
				//remove the tds
				this.paneContent.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == th.dataset.name) {
						let aTDClone = td.cloneNode(true);
						aTDClone.dataset.name = copyName;
						td.after(aTDClone);
						tableBodyDataHandler(aTDClone);
					}
				});

				table.findAll('td').forEach((td) => {
					if (td.nodeName == 'TD' && td.dataset.name == th.dataset.name) {
						let aTDClone = td.cloneNode(true);
						aTDClone.dataset.name = copyName;
						td.after(aTDClone);
					}
				});

				//remove the TH
				let newPaneTH: any;
				table.find('thead').findAll('th').forEach(aTH => {
					if (aTH.dataset.name == th.dataset.name) {
						let aTHclone = aTH.cloneNode(true);
						aTHclone.dataset.name = copyName;
						aTHclone.innerText = `SAMPLE${copyName.slice(dataName.length)}`;
						aTH.after(aTHclone);
						newPaneTH = aTHclone;
					}
				});

				let aTHPaneClone = th.cloneNode(true);
				aTHPaneClone.dataset.name = copyName;
				aTHPaneClone.find('input').setAttribute('value', `${'SAMPLE'}${copyName.slice(dataName.length)}`);
				th.after(aTHPaneClone);
				tableHeadHandler(aTHPaneClone, newPaneTH);
			}
		});

		let tableSettings = this.paneContent.find('.table-settings');
		let tableHeaderSettings = this.paneContent.find('.table-header-settings');
		let tableBodyDataSettings = this.paneContent.find('.table-data-settings');
		let tableSearchSettings = this.paneContent.find('.table-search-settings');

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.dom.innerHTML;
			this.element.css(this.sharePoint.attributes.pane.content[this.key].draft.dom.css());

			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			settings.style = tableBodyDataSettings.find('#style-cell').value;
			settings.stripes = tableBodyDataSettings.find('#stripes-cell').value;
			settings.hoverBackground = tableBodyDataSettings.find('#hover-background-cell').value;
			settings.hoverColor = tableBodyDataSettings.find('#hover-color-cell').value;

			settings.thead.fontSize = tableHeaderSettings.find('#fontsize-cell').value;
			settings.thead.color = tableHeaderSettings.find('#color-cell').value;
			settings.thead.backgroundColor = tableHeaderSettings.find('#backgroundcolor-cell').value;

			settings.tbody.fontSize = tableBodyDataSettings.find('#fontsize-cell').value;
			settings.tbody.color = tableBodyDataSettings.find('#color-cell').value;
			settings.tbody.backgroundColor = tableBodyDataSettings.find('#backgroundcolor-cell').value;
			settings.tbody.height = tableBodyDataSettings.find('#height-cell').value;

			settings.borderSize = tableSettings.find('#border-size-cell').value;
			settings.borderColor = tableSettings.find('#border-color-cell').value;
			settings.borderStyle = tableSettings.find('#border-style-cell').value;

			settings.showSearch = tableSearchSettings.find('#show-cell').value;

			this.element.dataset.settings = JSON.stringify(settings);
		});

		tableHeaderSettings.find('#fontsize-cell').onChanged();
		tableHeaderSettings.find('#color-cell').onChanged();
		tableHeaderSettings.find('#backgroundcolor-cell').onChanged();

		tableHeaderSettings.find('#show-cell').onChanged(value => {
			if (value == 'No') {
				table.find('thead').hide();
			} else {
				table.find('thead').show();
			}
		});

		tableHeaderSettings.find('#height-cell').onChanged(value => {
			table.find('thead').find('tr').css({ height: value });
		});

		tableBodyDataSettings.find('#fontsize-cell').onChanged();
		tableBodyDataSettings.find('#color-cell').onChanged();
		tableBodyDataSettings.find('#backgroundcolor-cell').onChanged();
		tableBodyDataSettings.find('#height-cell').onChanged();
		tableBodyDataSettings.find('#style-cell').onChanged();
		tableBodyDataSettings.find('#stripes-cell').onChanged();
		tableBodyDataSettings.find('#hover-background-cell').onChanged();
		tableBodyDataSettings.find('#hover-color-cell').onChanged();

		tableSettings.find('#border-size-cell').onChanged();
		tableSettings.find('#border-color-cell').onChanged();
		tableSettings.find('#border-style-cell').onChanged();

		tableSearchSettings.find('#search-image-cell').checkChanges(event => {
			draftDom.find('#crater-table-search-box').nextSibling.src = tableSearchSettings.find('#search-image-cell').src;
		});

		tableSearchSettings.find('#background-color-cell').onChanged(backgroundColor => {
			draftDom.find('#crater-table-search-box').parentNode.css({ backgroundColor });
		});

		let searchPosition = {}, searchLocation = {};
		tableSearchSettings.find('#position-cell').onChanged(position => {
			draftDom.find('#crater-table-search-box').parentNode.cssRemove(['left', 'right']);
			searchPosition[position.toLowerCase()] = '0px';
			draftDom.find('#crater-table-search-box').parentNode.css(searchPosition);
		});

		tableSearchSettings.find('#location-cell').onChanged(loc => {
			draftDom.find('#crater-table-search-box').parentNode.cssRemove(['top', 'bottom']);
			searchLocation[loc.toLowerCase()] = '0px';
			draftDom.find('#crater-table-search-box').parentNode.css(searchLocation);
		});

		tableSearchSettings.find('#show-cell').onChanged();
		this.sharePoint.saveSettings(this.element, settings);

	}

	public update(params) {
		this.element = params.element;
		this.key = this.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent = this.setUpPaneContent(params);

		let headers = settings.headers.toString();

		let paneConnection = this.sharePoint.app.find('.crater-property-connection');
		let metadata = params.connection.metadata || {};
		let options = params.connection.options || [];

		let metaWindow = this.createForm({
			title: 'Set Table Sample', attributes: { id: 'meta-form', class: 'form' },
			contents: {
				Names: { element: 'input', attributes: { id: 'meta-data-names', name: 'Names', value: headers.toString() }, options: params.options, note: 'Names of data should be comma seperated[data1, data2]' },
			},
			buttons: {
				submit: { element: 'button', attributes: { id: 'set-meta', class: 'btn' }, text: 'Set' },
			}
		});

		metaWindow.find('#set-meta').addEventListener('click', event => {
			event.preventDefault();

			let names = metaWindow.find('#meta-data-names').value.split(',');
			let contents = {};

			for (let i in names) {
				names[i] = this.func.trem(names[i]);
				contents[names[i]] = { element: 'select', attributes: { id: 'meta-data-' + names[i], name: this.func.capitalize(names[i]) }, options, selected: metadata[names[i]] };
			}

			settings.headers = names;

			let updateWindow = this.createForm({
				title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
				contents,
				buttons: {
					submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
				}
			});

			updateWindow.find('#update-element').addEventListener('click', updateEvent => {
				updateEvent.preventDefault();
				let formData = updateWindow.findAll('.form-data');

				for (let i = 0; i < formData.length; i++) {
					params.connection.metadata[formData[i].name.toLowerCase()] = formData[i].value;
				}
				params.container = draftDom;
				params.flag = true;

				this.runUpdate(params);
				updateWindow.find('.form-error').css({ display: 'unset' });
				updateWindow.find('.form-error').textContent = 'Drafted Updated';
			});

			let parent = metaWindow.parentNode;
			parent.innerHTML = '';
			parent.append(metaWindow, updateWindow);
		});

		if (!this.func.isnull(paneConnection)) {
			paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {

				this.element.innerHTML = draftDom.innerHTML;

				this.element.css(draftDom.css());

				this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			});
		}

		return metaWindow;
	}

	public runUpdate(params) {
		let source = this.func.extractFromJsonArray(params.connection.metadata, params.source);
		let key = this.key || params.container.dataset.key;
		let newContent = this.render({ source });
		params.container.find('.crater-table').innerHTML = newContent.find('.crater-table').innerHTML;
		this.sharePoint.attributes.pane.content[key].draft.html = params.container.outerHTML;

		if (params.flag == true) {
			this.paneContent.find('.table-pane').innerHTML = this.generatePaneContent({ table: newContent.find('table') }).innerHTML;

			this.sharePoint.attributes.pane.content[key].draft.pane.content = this.paneContent.innerHTML;
		}
	}
}

export { Table };