class Apps {
    constructor() {
        this.url;
    }

    display() {
        let main = document.body.find('#main-window');
        let mainBody = main.find('#main-container-body');

        mainBody.render([
            {
                element: 'div', attributes: { id: 'main-container-body-main-actions' }, children: [
                    { element: 'span', attributes: { id: 'more-apps-controls' } }
                ]
            },
            {
                element: 'div', attributes: { id: 'main-container-body-main-window' }
            }
        ]);

        this.url = perceptor.urlSplitter(location.href);
        let page = this.url.vars.page;
        if (!Object.values(this.url.vars).length) {
            this.view(mainBody.find('#main-container-body-main-window'));
        }
        else if (perceptor.isset(this[page])) {
            this[page](mainBody.find('#main-container-body-main-window'));
        }
        else {
            system.display404(mainBody.find('#main-container-body-main-window'));
        }
    }

    view(container) {
        system.get({ collection: 'apps', query: {}, projection: { id: 1, page: 1, lastFetched: 1 }, many: true }).then(result => {

            let appsTable = perceptor.createTable({ title: 'Apps Table', contents: result, search: true, sort: true });
            container.render(appsTable);
            perceptor.listenTable({ options: ['view'], table: appsTable }, {
                click: event => {
                    let target = event.target;
                    let { row } = target.getParents('.perceptor-table-column-cell').dataset;
                    let table = target.getParents('.perceptor-table');
                    let id = table.find(`.perceptor-table-column[data-name="_id"]`).find(`.perceptor-table-column-cell[data-row="${row}"]`).dataset.value;

                    if (target.id == 'perceptor-table-option-view') {
                        system.redirect('apps.html?page=show&id=' + id);
                    }
                }
            });
        });
    }

    show(container) {
        let id = this.url.vars.id;
        system.get({ collection: 'apps', query: { _id: id }, changeQuery: { _id: 'objectid' } }).then(app => {
            
        });
    }

    delete(id){

    }
}

export { Apps };