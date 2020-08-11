import { ElementModifier } from './../ElementModifier';

class TextArea extends ElementModifier {
	private element: any;
	private key: any;
	private params: any;
	private paneContent: any;

	constructor(params) {
		super({ sharePoint: params.sharePoint });
	}

	public render(params) {
		let textArea = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-textarea', 'data-type': 'textarea' }, children: [
				{
					element: 'div', attributes: { class: 'crater-textarea-content', id: 'crater-textarea-content' }, children: [
						{ element: 'p', text: 'Lorem Ipsum Catre Matrium lotuim consinium' }
					]
				}
			]
		});
		this.func.objectCopy(params, textArea.dataset);
		return textArea;
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);
	}

	public setUpPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.createElement({
			element: 'div',
			attributes: { class: 'crater-property-content' }
		}).monitor();
		let view = settings.linkWindow;

		if (this.sharePoint.attributes.pane.content[this.key].draft.pane.content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[this.key].content != '') {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[this.key].content;
		}
		else {

		}

		return this.paneContent;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;
		let settings = JSON.parse(params.element.dataset.settings);

		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();

		let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
		this.paneContent.innerHTML = '';
		let textEditor = this.textEditor({ content: draftDom.find('.crater-textarea-content') });
		this.paneContent.append(textEditor);

		let editor;
		textEditor.onAdded(() => {
			editor = textEditor.find('#crater-the-WYSIWYG').contentWindow.document.body;
		});

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			this.element.find('.crater-textarea-content').innerHTML = editor.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart
			this.element.css(draftDom.css());

			this.sharePoint.saveSettings(this.element, settings);

		});
	}
}

export { TextArea };