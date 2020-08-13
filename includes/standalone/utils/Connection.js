// import { ISPHttpClientOptions, SPHttpClient, AadHttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

class Connection {
    constructor(params) {
        Object.keys(params).map(key => {
            this[key] = params[key];
        });
    }

    getSite() {
        let site = '';

        if (location.pathname == '') {
            site = location.origin;
        }
        else if (location.pathname.split('/').indexOf('SitePages') == 1) {
            site = location.origin;
        }
        else if (location.pathname.split('/').indexOf('sites') == 1) {
            site = location.origin + '/' + location.pathname.split('/')[1] + '/' + location.pathname.split('/')[2];
        }

        return site;
    }

    getLocalApp(_id){
        
    }

    fetchApp(_id) {
        let page = location.origin + location.pathname;
        let data = { action: 'fetchApp', _id, page };
        return this.connect({ data, url: 'https://api.crater365.net' });
    }

    putApp(attributes) {
        attributes = JSON.stringify(attributes);
        let data = { action: 'putApp', attributes };
        return this.connect({ url: 'https://api.crater365.net', data });
    }

    deleteApp(_id) {
        let data = { action: 'deleteApp', _id };
        return this.connect({ url: 'https://api.crater365.net', data });
    }

    getRSSFeed(url, count, keywords) {
        url = `https://cors-anywhere.herokuapp.com/` + url;
        if (keywords != '') keywords = keywords.split(',');

        return this.ajax({ method: 'GET', url })
            .then(result => {
                let domParser = new DOMParser();
                let doc = domParser.parseFromString(result, 'text/xml');
                let items = doc.querySelectorAll('item');

                if (items.length == 0) {
                    items = doc.querySelectorAll('entry');
                }
                let source = [], sortedItems = [];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let add = true;
                    if (Array.isArray(keywords)) {
                        for (let j = 0; j < keywords.length; j++) {
                            add = item.textContent.toLowerCase().includes(keywords[j].toLowerCase());
                            if (!add) break;
                        }
                        if (add) {
                            sortedItems.push(item);
                        }
                    }
                    else {
                        sortedItems.push(item);
                    }
                }

                for (let i = 0; i < sortedItems.length; i++) {
                    if (i == count) break;
                    let row = {};
                    let content = sortedItems[i].childNodes;
                    for (let j = 0; j < content.length; j++) {
                        row[content[j].nodeName] = content[j].textContent;
                    }
                    source.push(row);
                }

                return source;
            });
    }

    // find(params) {
    //     params.format = this.func.isset(params.format) ? params.format : true;

    //     let url = params.link + `/_api/web/lists/getbytitle('${params.list}')/items`;
    //     if (this.func.isset(params.data)) {
    //         url += `?$select=${params.data}`;
    //     }

    //     if (this.func.isset(params.filter)) {
    //         url += (this.func.isset(params.data)) ? '&' : '?';
    //         url += `$filter`;
    //         for (let i in params.filter) {
    //             url += `=${i} eq '${params.filter[i]}'`;
    //         }
    //     }

    //     return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
    //         .then(response => {
    //             if (response.status == 404) {
    //                 return 'Not Found';
    //             } else {
    //                 return response.json();
    //             }
    //         })
    //         .then(jsonResponse => {
    //             if (jsonResponse == 'Not Found') {
    //                 return jsonResponse;
    //             }
    //             else {
    //                 if (params.format) {
    //                     let value = [];
    //                     jsonResponse.value.map(row => {
    //                         let aRow = {};
    //                         for (const cell in row) {
    //                             if (cell.indexOf('@odata') == -1) aRow[cell.toLowerCase()] = row[cell];
    //                         }
    //                         value.push(aRow);
    //                     });
    //                     return value;
    //                 } else {
    //                     return jsonResponse.value;
    //                 }
    //             }
    //         });
    // }

    // getWithAad(endPoint, url, options?) {
    //     return new Promise((resolve, reject) => {
    //         this.context.aadHttpClientFactory.getClient(url)
    //             .then((aadClient: AadHttpClient) => {
    //                 console.log(aadClient);

    //                 aadClient.get(endPoint, AadHttpClient.configurations.v1)
    //                     .then((rawResponse: HttpClientResponse) => {
    //                         return rawResponse.json();
    //                     })
    //                     .then((jsonResponse: any) => {
    //                         resolve(jsonResponse);
    //                     });
    //             });
    //     });
    // }

    // updateWithAad(endPoint, url, options: IHttpClientOptions) {
    //     return new Promise((resolve, reject) => {
    //         this.context.aadHttpClientFactory.getClient(url)
    //             .then((aadClient: AadHttpClient) => {
    //                 aadClient.post(endPoint, AadHttpClient.configurations.v1, options)
    //                     .then((rawResponse: HttpClientResponse) => {
    //                         return rawResponse.json();
    //                     })
    //                     .then((jsonResponse: any) => {
    //                         resolve(jsonResponse);
    //                     });
    //             });
    //     });
    // }

    // getWithGraph() {
    //     return new Promise((resolve, reject) => {
    //         this.context.msGraphClientFactory.getClient()
    //             .then((client: any): void => {
    //                 resolve(client);
    //             });
    //     });
    // }

    // getItemEntityType(params) {
    //     let url = params.link + `/_api/web/lists/getbytitle('${params.list}')?$select=ListItemEntityTypeFullName`;

    //     return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(jsonResponse => {
    //             return jsonResponse.ListItemEntityTypeFullName;
    //         });
    // }

    // createList(params) {
    //     let url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists`;

    //     const request: ISPHttpClientOptions = {};
    //     params = params || { Title: 'Sample' };
    //     request.body = JSON.stringify(params);

    //     return this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, request)
    //         .then(response => {
    //             if (response.status == 201) {
    //                 return 'Successful';
    //             }
    //             else {
    //                 return 'Failed';
    //             }
    //         });
    // }

    // put(params) {
    //     let url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('${params.list}')/items`;

    //     return this.getItemEntityType(params).then(spEntityType => {
    //         const request: any = {};
    //         params.data['@odata.type'] = spEntityType;
    //         request.body = JSON.stringify(params.data);

    //         return this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, request).then(res => {
    //             return res.ok;
    //         });
    //     });
    // }

    // update(params) {
    //     return this.find({ link: params.link, list: params.list, filter: params.filter, format: false }).then(stored => {
    //         let item = stored[0];
    //         let url = params.link + `/_api/web/lists/getbytitle('${params.list}')/items(${item.Id})`;

    //         let request: any = {};
    //         request.headers = {
    //             'X-HTTP-Method': 'MERGE',
    //             'IF-MATCH': (item as any)['@odata.etag']
    //         };

    //         // for (let i in params.data) {
    //         //     if (i.indexOf('@odata') == -1) item[i] = params.data[i];
    //         // }

    //         request.body = JSON.stringify(item);

    //         return this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, request);
    //     });
    // }
}

export { Connection };