import { ElementModifier } from './../ElementModifier';
const factory = require('./../powerbi.js');

export class PowerBI extends ElementModifier {
	public key: any;
	public element: any;
	public paneContent: any;
	public params: any;
	public counter: number = 15;
	public image = {
		loading: 'https://i.ytimg.com/vi/QYtDBWS03n8/maxresdefault.jpg',
		loading2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Power_bi_logo_black.svg/220px-Power_bi_logo_black.svg.png'
	};

	constructor(params) {
		super({ sharePoint: params.sharePoint });
		this.sharePoint = params.sharePoint;
		this.params = params;
	}

	public render(params): any {
		let power: any = this.createKeyedElement({
			element: 'div', attributes: { class: 'crater-component crater-powerbi', id: 'crater-powerbi', 'data-type': 'powerbi' }, children: [
				{
					element: 'div', attributes: { id: 'power-overlay' }, children: [
						{ element: 'div', attributes: { id: 'power-overlay-text' } }
					]
				},
				{
					element: 'div', attributes: { class: 'crater-powerbi-container' }, children: [
						{
							element: 'div', attributes: { id: 'renderContainer' }, children: [
								{
									element: 'div', attributes: { id: 'render-error' }, children: [
										{ element: 'p', attributes: { id: 'render-text' } }
									]
								}
							]
						},
						{
							element: 'div', attributes: { class: 'crater-powerbi-timer' }, children: [
								{ element: 'span', attributes: { class: 'crater-powerbi-counter' }, text: this.counter + ' Seconds to Login!' }
							]
						},
						{
							element: 'div', attributes: { id: 'crater-powerbi-connect', class: 'crater-powerbi-connect' }, children: [
								{
									element: 'div', attributes: { class: 'user' }, children: [
										{ element: 'img', attributes: { class: 'crater-powerbi-image', alt: 'Master-User', src: this.image.loading } },
										{
											element: 'div', attributes: { class: 'login-container' }, children: [
												{ element: 'h4', attributes: { class: 'user-header' }, text: 'Master Account' },
												{ element: 'p', attributes: { class: 'power-text' }, text: 'SharePoint site visitors will not be required to login to Power BI to view Power BI Data in SharePoint.' },
												{ element: 'p', attributes: { class: 'user-recommended' }, text: 'Good for 20+ users' },
												{ element: 'button', attributes: { id: 'master', class: 'user-button' }, text: 'Connect' }
											]
										}
									]
								},
								{
									element: 'div', attributes: { class: 'user' }, children: [
										{ element: 'img', attributes: { class: 'crater-powerbi-image', alt: 'Logged-in-User', src: this.image.loading } },
										{
											element: 'div', attributes: { class: 'login-container' }, children: [
												{ element: 'h4', attributes: { class: 'user-header' }, text: 'Logged-In User' },
												{ element: 'p', attributes: { class: 'power-text' }, text: 'Every SharePoint Site Visitor will be required to login to Power BI using Pro Account to view Power BI Data' },
												{ element: 'p', attributes: { class: 'user-recommended' }, text: 'Good for 1 - 20 users' },
												{ element: 'button', attributes: { id: 'normal', class: 'user-button' }, text: 'Connect' }
											]
										}
									]
								}
							]
						},
						{ element: 'div', attributes: { class: 'login_form' } },
					]
				},
			]
		});

		let form: string = `<div id="id01" class="modal">
		  <form class="modal-content animate-modal">
		 	 <div class="form-header">
		  		<div class="form-header-space">
					<h4>MASTER ACCOUNT LOGIN</h4> 	
			  	</div>
			</div>  
			<div class="form-body">
				<div class="form-container">
			  		<label for="uname"><b>Username: </b></label>
			  		<input class="input" id="power-username" type="text" placeholder="Enter Username" name="uname">
				</div>
				<div class="form-container">
			  		<label for="psw"><b>Password: </b></label>
			  		<input class="input" id="power-password" type="password" placeholder="Enter Password" name="psw">
				</div>
				<div class="error-message" id="emptyField">
					<p> The above field(s) cannot be empty! && Name length cannot be less than 3</p>
				</div>
			</div>
			<div class="cancel-container">
			  <button id="login-submit" class="cancelbtn" type="submit">Login</button>
			  <button type="button" id="cancelbtn" class="cancelbtn">Cancel</button>
			</div>
		  </form>
		</div>
		`;

		power.find('.login_form').innerHTML += form;

		const settings = {
			showNavContent: '', showFilter: '', loginType: '', code: '',
			username: '', tenantID: "90fa49f0-0a6c-4170-abed-92ed96ba67ca", clientSecret: 'FUq.Y0@BN4byWh6B8.H:et:?F/VX2-3a',
			password: '', clientId: '9605a407-7c23-4dc8-bd90-997fbc254d38', accessToken: '', embedToken: '',
			embedUrl: '', reports: [], reportName: [], groups: [], groupName: [], dashboards: [], dashBoardName: [],
			tiles: [], tileName: [], width: '100%', height: '300px'
		};

		this.sharePoint.saveSettings(power, settings);
		this.key = power.dataset.key;

		this.element = power;
		window.onerror = (msg, url, lineNumber, columnNumber, error) => {
			console.log(msg, url, lineNumber, columnNumber, error);
		};

		let draftPower = JSON.parse(power.dataset.settings);
		power.find('#master').addEventListener('click', () => {
			let loginForm = power.find('.login_form') as any;
			let powerConnect = power.find('.crater-powerbi-connect') as any;

			powerConnect.style.display = "none";
			loginForm.style.display = 'block';
			let username: any = power.find('#power-username');
			let password: any = power.find('#power-password');
			let errorDisplay: any = power.find('#emptyField');
			let loginButton: any = power.find('#login-submit');
			let cancelButton: any = power.find('#cancelbtn');
			let renderBox: any = power.find('#renderContainer');

			loginButton.addEventListener('click', e => {
				e.preventDefault();
				if ((username.value.length == 0) || (password.value.length == 0) || (username.value.length < 3)) {
					username.style.border = '1px solid tomato';
					password.style.border = '1px solid tomato';
					errorDisplay.style.display = "block";
					return;
				} else {
					this.showLoading();
					draftPower.accessToken = '';
					draftPower.username = username.value;
					draftPower.password = password.value;
					this.getAccessToken()
						.then(aResponse => {
							draftPower = JSON.parse(power.dataset.settings);
							if (draftPower.accessToken) {
								this.getWorkSpace(aResponse);
								renderBox.find('#render-error').style.display = 'none';
								renderBox.style.display = "block";
								draftPower.loginType = 'master';
								loginForm.style.display = "none";
								if (renderBox.find('.connected')) renderBox.find('.connected').remove();
								renderBox.makeElement({
									element: 'div', attributes: { class: 'connected' }, children: [
										{ element: 'img', attributes: { alt: 'Master-User', src: this.image.loading2 } },
										{
											element: 'div', attributes: { class: 'login-container' }, children: [
												{ element: 'h4', text: 'Power BI Master' },
												{ element: 'button', attributes: { id: 'master', class: 'user-button' }, text: 'Reconnect' },
												{ element: 'p', text: `Connected using ${draftPower.username}` },
											]
										}
									]
								});
								renderBox.find('#master').addEventListener('click', () => {
									loginButton.innerHTML = 'Login';
									if (power.find('.login_form').style.display = 'none') power.find('.login_form').style.display = 'block';
								});
								this.sharePoint.saveSettings(power, draftPower);
							}
						});
				}
			});

			cancelButton.addEventListener('click', e => {
				loginForm.style.display = 'none';
				if (!renderBox.find('.connected')) powerConnect.style.display = 'grid';
			});

		});
		power.find('#normal').addEventListener('click', event => {
			let getCode = (): any => {
				let noRedirect: string = (location.href === `https://localhost:4321/temp/workbench.html`) ? location.href : (location.origin === `https://ipigroup.sharepoint.com/`) ? location.origin : `https://ipigroup.sharepoint.com/`;
				const host: string = draftPower.redirectURI || noRedirect;
				let state: number = 12345;
				let openURL: string = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${draftPower.clientId}&response_type=code&redirect_uri=${host}&response_mode=query&scope=openid&state=${state}`;
				let newWindow: Window = window.open(openURL, '_blank');
				newWindow.focus();

				let reqCodeInterval = setInterval(() => {
					if (newWindow.location.search.substring(1).indexOf('code') !== -1) {
						let splitURL = newWindow.location.search.substring(1).split('=')[1].split('&state')[0];
						draftPower.code = splitURL;
						newWindow.close();
						clearInterval(reqCodeInterval);
						this.getAccessToken(splitURL)
							.then(this.getWorkSpace)
							.then(() => {
								draftPower = JSON.parse(power.dataset.settings);
								if (draftPower.accessToken && draftPower.groups.length !== 0) {
									this.checkConnectedAndRender();
									draftPower.loginType = 'user';
									this.sharePoint.saveSettings(power, draftPower);
								}
							})
							.catch(console.log);
					}
				}, 1000);
			};

			getCode();
		});

		return power;
	}

	public checkConnectedAndRender() {
		let powerConnect = this.element.querySelector('.crater-powerbi-connect') as any;
		powerConnect.style.display = "none";
		let renderBox = this.element.querySelector('#renderContainer') as any;
		renderBox.querySelector('#render-error').style.display = 'none';
		renderBox.style.display = 'block';
		this.element.querySelector('.crater-powerbi-timer').style.display = "none";
		if (renderBox.querySelector('.connected')) renderBox.querySelector('.connected').remove();
		renderBox.makeElement({
			element: 'div', attributes: { class: 'connected' }, children: [
				{ element: 'img', attributes: { alt: 'Login', src: this.image.loading2 } },
				{
					element: 'div', attributes: { class: 'login-container' }, children: [
						{ element: 'h4', text: 'Power BI User' },
						{ element: 'p', attributes: { id: 'new-user', class: 'user-button' }, text: 'Connected' },
					]
				}
			]
		});
	}
	public showLoading() {
		let loadingButton = this.element.find('#login-submit') as any;
		loadingButton.style.zIndex = 2;
		loadingButton.render({
			element: 'img', attributes: { class: 'crater-icon', src: this.sharePoint.images.loading, style: { width: '20px', height: '20px' } }
		});
	}
	public checkConsent() {
		let draftPower = JSON.parse(this.element.dataset.settings);

		return new Promise((res, rej) => {
			let noRedirect = (location.href === `https://localhost:4321/temp/workbench.html`) ? location.href : (location.origin === `https://ipigroup.sharepoint.com/`) ? location.origin : `https://ipigroup.sharepoint.com/`;
			const host = draftPower.redirectURI || noRedirect;
			let openURL = `https://login.microsoftonline.com/${draftPower.tenantID}/v2.0/adminconsent?client_id=${draftPower.clientId}&state=12345&redirect_uri=${host}&scope=https://analysis.windows.net/powerbi/api/Workspace.ReadWrite.All`;

			let newWindow = window.open(openURL, '_blank');
			const windowLocation = newWindow.location.href;
			setTimeout(() => {
				(newWindow.location.href === windowLocation) ? res(newWindow.location.href) : rej(new Error('Sorry, permissions were not granted!'));
				this.sharePoint.saveSettings(this.element, draftPower);
			}, 10000);
		}).catch(err => console.log(err.message));
	}
	public startCounter() {
		this.element.find('.crater-powerbi-timer').style.display = 'block';
		clearInterval(1);
		setInterval(() => {
			if (!this.counter) {
				this.element.find('.crater-powerbi-counter').render({
					element: 'img', attributes: { class: 'crater-icon', src: this.sharePoint.images.loading, style: { width: '20px', height: '20px' } }
				});
			} else {
				this.counter--;
				this.element.find('.crater-powerbi-counter').textContent = 'Please wait ' + this.counter + ' Seconds';
			}
		}, 1000);

	}
	public requestCode() {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let noRedirect = (location.href === `https://localhost:4321/temp/workbench.html`) ? location.href : (location.origin === `https://ipigroup.sharepoint.com/`) ? location.origin : `https://ipigroup.sharepoint.com/`;
		const host = draftPower.redirectURI || noRedirect;
		let state = 12345;
		let openURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${draftPower.clientId}&response_type=code&redirect_uri=${host}&response_mode=query&scope=openid&state=${state}`;
		let newWindow = window.open(openURL, '_blank');
		newWindow.focus();

		let reqCodeInterval = setInterval(() => {
			if (newWindow.location.search.substring(1).indexOf('code') !== -1) {
				let splitURL = newWindow.location.search.substring(1).split('=')[1].split('&state')[0];
				draftPower.code = splitURL;
				newWindow.close();
				this.sharePoint.saveSettings(this.element, draftPower);

				clearInterval(reqCodeInterval);
			}
		}, 1000);

	}
	public createWorkSpace(access) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/groups`;

		let accessString = `Bearer ${access}`;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('group created...');
					draftPower.groups = [];
					draftPower.groupName.length = 0;
					for (let workspace in JSON.parse(result)) {

						draftPower.groups.push({

							workspaceName: workspace['name'],

							workspaceId: workspace['id']
						});

						draftPower.groupName.push(workspace['name']);
					}
				}
			};

			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send(`name=new workspace`);
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error creating a new group'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public cloneReport(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/reports/${params.reportID}/Clone`;

		let accessString = 'Bearer ' + params.accessToken;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('report cloned...');
					draftPower.reportId = result.id;
					draftPower.embedUrl = result.embedUrl;
				}
			};

			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send(`name=new&targetWorkspaceId=${params.groupID}`);
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error cloning the report!'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public cloneTile(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/dashboards/${params.dashboardID}/tiles/${params.tileID}/Clone`;

		let accessString = 'Bearer ' + params.accessToken;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					draftPower.tileId = result.tileId;
					draftPower.reportId = result.tileId;
					draftPower.embedUrl = result.embedUrl;
				}
			};
			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send(`name=new&targetWorkspaceId=${params.groupID}&targetDashboardId=${params.dashboardID}`);
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error cloning the tile'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public getReports(access, groupID, third?) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = (third) ? `https://api.powerbi.com/v1.0/myorg/reports` : `https://api.powerbi.com/v1.0/myorg/groups/${groupID}/reports`;

		let accessString = 'Bearer ' + access;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting reports...');
					draftPower.reports.length = 0;
					draftPower.reportName.length = 0;
					for (let i = 0; i < JSON.parse(result).value.length; i++) {
						if (draftPower.reports.indexOf(JSON.parse(result).value[i].name) === -1) {
							draftPower.reports.push({
								reportName: JSON.parse(result).value[i].name,
								reportId: JSON.parse(result).value[i].id,
								embedUrl: JSON.parse(result).value[i].embedUrl
							});
							draftPower.reportName.push(JSON.parse(result).value[i].name);
						}
					}
					if (draftPower.reportName.length === 0) {
						draftPower.reportName.push('No Reports');
					}

				}
			};
			request.open('GET', url, false);
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error getting reports'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#renderContainer').style.display = "block";
			this.element.find('#render-text').textContent = error.message;

		});
	}
	public getPages(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = (params.groupID === 'none') ? `https://api.powerbi.com/v1.0/myorg/reports/${params.reportID}/pages` : `https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}/reports/${params.reportID}/pages`;

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting pages...');
					draftPower.pageName = [];
					draftPower.pages = [];
					for (let page in JSON.parse(result).value) {
						if (draftPower.pageName.indexOf(JSON.parse(result).value[page].displayName) === -1) {
							draftPower.pages.push({
								pageName: JSON.parse(result).value[page].Name,
								displayName: JSON.parse(result).value[page].displayName
							});
							draftPower.pageName.push(JSON.parse(result).value[page].displayName);
						}
					}

				}
			};
			request.open('GET', url, false);
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error getting pages'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#renderContainer').style.display = "block";
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public getDashboards(access, groupID, third?) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		draftPower.dashboards.length = 0;
		draftPower.dashBoardName.length = 0;
		let url = (third) ? `https://api.powerbi.com/v1.0/myorg/dashboards/` : `https://api.powerbi.com/v1.0/myorg/groups/${groupID}/dashboards/`;

		let accessString = 'Bearer ' + access;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting dashboards...');
					if (draftPower.groupId !== 'none') {
						for (let dashboard of JSON.parse(result).value) {
							draftPower.dashboards.push({
								dashboardName: dashboard.displayName,
								dashboardId: dashboard.id,
								embedUrl: dashboard.embedUrl
							});
							draftPower.dashBoardName.push(dashboard.displayName);
						}

						if (draftPower.dashBoardName.length === 0) {
							draftPower.dashBoardName.push('No Dashboards');
						}
					} else {
						if (draftPower.dashBoardName.length === 0) {
							draftPower.dashBoardName.push('Cannot Embed Dashboards for this Workspace');
						}
					}
				}
			};
			request.open('GET', url, false);
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error getting dashboards'));
			this.sharePoint.saveSettings(this.element, draftPower);


		}).catch(error => {
			console.log(error.message);
			this.element.find('#renderContainer').style.display = "block";
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public getTiles(access, groupID, dashboardID) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = (groupID === 'none') ? `https://api.powerbi.com/v1.0/myorg/dashboards/${dashboardID}/tiles` : `https://api.powerbi.com/v1.0/myorg/groups/${groupID}/dashboards/${dashboardID}/tiles`;
		let accessString = 'Bearer ' + access;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting dashboards...');
					draftPower.tiles.length = 0;
					draftPower.tileName.length = 0;
					for (let tile of JSON.parse(result).value) {
						draftPower.tiles.push({
							tileName: tile.title,
							tileId: tile.id,
							embedUrl: tile.embedUrl,
							reportId: tile.reportId
						});
						draftPower.tileName.push(tile.title);
					}
					draftPower.tileName.push('Show Full Dashboard');
				}
			};
			request.open('GET', url, false);
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error getting tiles'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public addUser(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}/users`;
		const sendLink = (draftPower.loginType.toLowerCase() === 'master') ? `identifier=${draftPower.username}&groupUserAccessRight=Admin&principalType=User` : (draftPower.loginType.toLowerCase() === 'user') ? `id=${params.groupID}&groupUserAccessRight=Admin&principalType=Group` : '';

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('User Added');
				}
			};
			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send(sendLink);
			if (request.status == 200) res('User Added!');
			else rej(new Error('Sorry, there was a problem adding the user!'));
			this.element.dataset.settings = JSON.parse(draftPower);
		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public addDashBoard(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/dashboards`;

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('Dashboard Added');
					draftPower.tokenEmbed = 'fulldashboard';
					draftPower.dashboardId = result.id;
					draftPower.dashboardEmbedUrl = result.embedUrl;
				}
			};
			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send('name=newDashBoard');
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, the Dashboard could not be added'));
			this.sharePoint.saveSettings(this.element, draftPower);
		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public deleteUser(params) {
		let url = ` https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}/users/${params.username}`;

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('User deleted');
				}
			};
			request.open('DELETE', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (request.status == 200) res('User deleted!');
			else rej(new Error('Sorry, this user could not be deleted!'));
		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public deleteWorkspace(params) {
		let url = ` https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}`;

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('Workspace deleted');
				}
			};

			request.open('DELETE', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (request.status == 200) res('Workspace deleted!');
			else rej(new Error('Sorry, there was an error deleting the group!'));
		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public getWorkSpace = (access) => {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let url = `https://api.powerbi.com/v1.0/myorg/groups`;
		let accessString = 'Bearer ' + access;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			let self = this;
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting workspaces...');
					draftPower.groups.length = 0;
					draftPower.groupName.length = 0;
					for (let workspace of JSON.parse(result).value) {

						draftPower.groups.push({
							workspaceName: workspace.name,
							workspaceId: workspace.id
						});
						draftPower.groupName.push(workspace.name);
					}

					if (self.element.find('#getWork')) {
						let errorText = self.element.find('#render-text') as any;
						errorText.textContent = '';

						self.element.find('#renderContainer').style.display = "none";
						self.element.find('#getWork').remove();
					}
					draftPower.groupName.push('My WorkSpace');
				}
			};

			request.open('GET', url, false);
			request.setRequestHeader('Authorization', accessString);
			request.send();
			if (JSON.parse(result)) res(JSON.parse(result));
			else rej(new Error('Sorry, there was an error getting workspaces'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			let powDiv = this.element.find('#render-error') as any;

			this.element.find('#renderContainer').style.display = 'block';
			powDiv.find('#render-text').textContent = `Couldn't Fetch Workspaces!`;
			powDiv.makeElement({
				element: 'div', children: [
					{ element: 'button', attributes: { id: 'getWork', class: 'user-button' }, text: 'Retry' }
				]
			});
			powDiv.find('#getWork').addEventListener('click', even => {
				this.getWorkSpace(access);
			});
		});
	}
	public getAccessToken = (authCode?) => {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let noRedirect = (location.href === `https://localhost:4321/temp/workbench.html`) ? location.href : (location.origin === `https://ipigroup.sharepoint.com/`) ? location.origin : `https://ipigroup.sharepoint.com/`;
		const host = draftPower.redirectURI || noRedirect;

		let endpoint = `client_id=${draftPower.clientId}&grant_type=Authorization_code&code=${authCode}&scope=https://analysis.windows.net/powerbi/api/Workspace.ReadWrite.All` + `&client_secret=${draftPower.clientSecret}&redirect_uri=${host}`;
		let endpoint2 = `client_id=${draftPower.clientId}&grant_type=password&resource=https://analysis.windows.net/powerbi/api` + `&username=${draftPower.username}&password=${draftPower.password}&scope=openid`;
		let url = (authCode) ? 'https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/common/oauth2/v2.0/token/' : `https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/common/oauth2/token/`;
		const defineEndpoint = (authCode) ? endpoint : endpoint2;
		// draftPower.accessToken = '';

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting access tokens..');
					draftPower.accessToken = JSON.parse(result).access_token;
					draftPower.refreshToken = JSON.parse(result).refresh_token;
				}
			};
			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send(defineEndpoint);
			if (JSON.parse(result).access_token) res(JSON.parse(result).access_token);
			else rej(new Error('Sorry, there was an error'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#login-submit').style.zIndex = 0;
			this.element.find('#login-submit').innerHTML = 'Login';
			this.element.find('.crater-powerbi-counter').innerHTML = "Sorry, there was an error. Please, click the connect button to try again";
			this.element.find('#renderContainer').style.display = "block";
			this.element.find('#render-text').textContent = `Please make sure your details are valid!`;
		});
	}
	public tokenListener(params) {
		let currentTime = Date.now();
		let expiration = Date.parse(params.tokenExpiration);
		let safetyInterval = params.minutesToRefresh * 60 * 1000;

		let timeout = expiration - currentTime - safetyInterval;

		if (timeout <= 0) {
			console.log('updating embed token');
			this.updateToken({ groupID: params.groupId, reportID: params.reportId });
		} else {
			console.log('report embed token will be updated in ' + timeout + 'milliseconds');
			setTimeout(() => {
				this.updateToken({ groupID: params.groupId, reportID: params.reportId });
			}, timeout);
		}
	}
	public updateToken(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);

		this.getEmbedToken({ accessToken: draftPower.accessToken, groupID: draftPower.groupId, reportID: draftPower.reportId, generateUrl: draftPower.tokenEmbed })
			.then(response => {
				let embedContainer = this.element.find('#renderContainer') as any;

				let reportRefresh = window['powerbi'].get(embedContainer);

				reportRefresh.setAccessToken(response)
					.then(() => { this.tokenListener({ tokenExpiration: draftPower.expiration, minutesToRefresh: 2 }); });
			}).catch(error => {
				this.element.find('#renderContainer').style.display = "block";
				this.element.find('#render-text').textContent = error.message;
			});
	}
	public getEmbedToken(params) {
		let draftPower = JSON.parse(this.element.dataset.settings);
		let tokenURL;
		if ((!this.func.isset(params.generateUrl)) || (params.generateUrl.toLowerCase() === 'reportname')) {
			tokenURL = 'https://api.powerbi.com/v1.0/myorg/groups/' + params.groupID + '/reports/' + params.reportID + '/GenerateToken';
		}
		else if (params.generateUrl.toLowerCase() === 'fulldashboard') {
			tokenURL = `https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}/dashboards/${draftPower.dashboardId}/GenerateToken`;
		} else if (params.generateUrl.toLowerCase() === 'tile') {
			tokenURL = `https://api.powerbi.com/v1.0/myorg/groups/${params.groupID}/dashboards/${draftPower.dashboardId}/tiles/${draftPower.tileId}/GenerateToken`;
		}

		let accessString = 'Bearer ' + params.accessToken;
		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			let self = this;
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('getting embed token...');
					draftPower.embedToken = JSON.parse(result).token;
					draftPower.expiration = JSON.parse(result).expiration;

					if (draftPower.changed) {
						if (self.element.find('#renderContainer')) {
							self.element.find('#renderContainer').remove();
							let powerContainer = self.element.find('.crater-powerbi-container') as any;
							powerContainer.makeElement({
								element: 'div', attributes: { id: 'renderContainer' }, children: [
									{
										element: 'div', attributes: { id: 'render-error' }, children: [
											{ element: 'p', attributes: { id: 'render-text' } }
										]
									}
								]
							});
						}
					}

				}
			};

			request.open('POST', tokenURL, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('Authorization', accessString);
			request.send('accessLevel=View');
			if (JSON.parse(result).token) res(JSON.parse(result).token);
			else rej(new Error('Sorry, there was an error getting embed token'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		});
	}
	public embedPower(params) {
		const powerBiSettings = JSON.parse(this.element.dataset.settings);
		if (!this.func.isset(params.tokenType)) params.tokenType = 'embed';
		try {
			const newEmbed = (params.embedUrl) ? params.embedUrl : `https://app.powerbi.com/reportEmbed?reportId=${powerBiSettings.reportId}&groupId=${powerBiSettings.groupId}`;
			window['powerbi-client'] = factory;
			const models = window['powerbi-client'].models;
			const newToken = (params.tokenType === "embed") ? models.TokenType.Embed : (params.tokenType === 'aad') ? models.TokenType.Aad : models.TokenType.Embed;
			const viewMode = ((!this.func.isset(params.viewMode)) || (params.viewMode.toLowerCase() === 'view')) ? models.ViewMode.View : (params.viewMode.toLowerCase() === 'edit') ? models.ViewMode.Edit : models.ViewMode.View;
			const pageName = (powerBiSettings.namePage) ? powerBiSettings.namePage : '';
			const dashboardId = (powerBiSettings.embedType === 'tile') ? powerBiSettings.dashboardId : '';

			const config = {
				type: params.type,
				tokenType: newToken,
				accessToken: params.accessToken,
				embedUrl: newEmbed,
				id: powerBiSettings.reportId,
				dashboardId,
				viewMode,
				pageName,
				permissions: models.Permissions.All,
				settings: {
					filterPaneEnabled: powerBiSettings.showFilter || false,
					navContentPaneEnabled: powerBiSettings.showNavContent || false
				}
			};

			// Get a reference to the embedded dashboard HTML element 
			const reportContainer = this.element.find('#renderContainer') as any;

			reportContainer.style.display = 'block';
			let report = window['powerbi'].embed(reportContainer, config);
			powerBiSettings.changed = false;
			powerBiSettings.embedded = true;
			report.off('loaded');

			report.on('loaded', () => {
				this.tokenListener({ tokenExpiration: powerBiSettings.expiration, minutesToRefresh: 2, reportId: powerBiSettings.reportId, groupId: powerBiSettings.groupId });
			});
			if (this.func.isset(params.switch)) report.switchMode('edit');
			this.sharePoint.saveSettings(this.element, powerBiSettings);
		}
		catch (error) {
			console.log(error.message);
			this.element.find('.login_form').style.display = "block";
			this.element.find('#render-error').style.display = 'block';
			this.element.find('#render-text').textContent = error.message;
		}
	}
	public signOut() {
		const self = this;
		let draftPower = JSON.parse(this.element.dataset.settings);
		let noRedirect = (location.href === `https://localhost:4321/temp/workbench.html`) ? location.href : (location.origin === `https://ipigroup.sharepoint.com/`) ? location.origin : `https://ipigroup.sharepoint.com/`;
		const host = draftPower.redirectURI || noRedirect;

		let url = `https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${host}`;

		return new Promise((res, rej) => {
			let result;
			let request = new XMLHttpRequest();
			request.onreadystatechange = function (e) {
				if (this.readyState == 4 && this.status == 200) {
					result = request.responseText;
					console.log('signed you out..');

				}
			};
			request.open('POST', url, false);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.send();
			if (request.status == 200) res('Signed you out');
			else rej(new Error('Sorry, there was an error signing you out'));
			this.sharePoint.saveSettings(this.element, draftPower);

		}).catch(error => {
			console.log(error.message);
			this.element.find('#login-submit').style.zIndex = 0;
			this.element.find('#login-submit').innerHTML = 'Login';
			this.element.find('.crater-powerbi-counter').innerHTML = "Sorry, there was an error. Please, click the connect button to try again";
			this.element.find('#renderContainer').style.display = "block";
			this.element.find('#render-text').textContent = `Please make sure your details are valid!`;
		});
	}

	public rendered(params) {
		this.element = params.element;
		this.key = params.element.dataset.key;

		window.onerror = (msg, url, lineNumber, columnNumber, error) => {
			console.log(msg, url, lineNumber, columnNumber, error);
		};

		let draftPower = JSON.parse(params.element.dataset.settings);
		if (draftPower.embedded) {
			this.getEmbedToken({ accessToken: draftPower.accessToken, groupID: draftPower.groupId, reportID: draftPower.reportId, generateUrl: draftPower.tokenEmbed })
				.then(response => {
					this.element.find('.crater-powerbi-container').css({ width: draftPower.width, height: draftPower.height });
					this.element.find('#renderContainer').css({ width: '100%', height: draftPower.height });
					this.embedPower({ accessToken: response, type: draftPower.embedType, embedUrl: draftPower.embedUrl });
				})
				.catch(error => console.log(error));
		}
	}

	public setUpPaneContent(params) {
		let key = params.element.dataset['key'];
		this.element = params.element;
		const powerSettings = JSON.parse(this.element.dataset.settings);
		this.paneContent = this.createElement({
			element: 'div', attributes: { class: 'crater-property-content' }
		}).monitor();


		if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
		}
		else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
			this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
		} else {
			const differentTenant = () => {
				this.paneContent.makeElement({
					element: 'div', attributes: { class: 'Re-sync-pane card' }, children: [
						this.createElement({
							element: 'div', attributes: { class: 'card-title' }, children: [
								this.createElement({
									element: 'h2', attributes: { class: 'title' }, text: 'Synchronize with Different Tenant'
								})
							]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'row' }, children: [
								{
									element: 'div', attributes: { class: 'message-note sync-note' }, children: [
										{
											element: 'span', attributes: { style: { color: 'green' } }, text: `Please fill these fields if you wish to synchronize on a different tenant.`
										}
									]
								}]
						}),
						this.createElement({
							element: 'div', attributes: { class: 'power-sync row' }, children: [
								this.cell({
									element: 'input', name: 'Client-ID', value: ''
								}),
								this.cell({
									element: 'input', name: 'Redirect-URI', value: ''
								}),
								this.cell({
									element: 'input', name: 'Client-secret', value: ''
								}),
								this.createElement(
									{ element: 'button', attributes: { id: 'sync-power', class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Sync' }
								)
							]
						})
					]
				});
			};

			switch (powerSettings.loginType.toLowerCase()) {
				case 'master':
					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'power-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'CONNECTION'
									})
								]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'row' }, children: [
									{
										element: 'div', attributes: { class: 'message-note' }, children: [
											{ element: 'span', attributes: { style: { color: 'green' } }, text: `POWER BI connected using ${powerSettings.username}` }
										]
									}]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'power-embed row' }, children: [
									this.cell({
										element: 'select', name: 'WorkSpace', options: powerSettings.groupName
									}),
									this.cell({
										element: 'select', name: 'user-rights', options: ['Allow', 'Deny']
									})
								]
							})
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'size-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'SIZE AUTO CONTROL'
									})
								]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'row' }, children: [
									{
										element: 'div', attributes: { class: 'message-note' }, children: [
											{
												element: 'span', attributes: { style: { color: 'green' } }, text: `Please change this value if you wish to change the size of the report`
											}
										]
									}]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'power-embed row' }, children: [
									this.cell({
										element: 'select', name: 'display', options: ['16:9 (1280px x 720px)', '4:3 (1000px x 750px)', 'Custom Size']
									})
								]
							})
						]
					});

					differentTenant();
					break;
				case 'user':
					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'power-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'CONNECTION'
									})
								]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'power-embed row' }, children: [
									this.cell({
										element: 'select', name: 'WorkSpace', options: powerSettings.groupName
									}),
									this.cell({
										element: 'select', name: 'user-rights', options: ['Allow', 'Deny']
									})
								]
							})
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'size-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'SIZE AUTO CONTROL'
									})
								]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'row' }, children: [
									{
										element: 'div', attributes: { class: 'message-note' }, children: [
											{
												element: 'span', attributes: { style: { color: 'green' } }, text: `Please change this value if you wish to change the size of the report`
											}
										]
									}]
							}),
							this.createElement({
								element: 'div', attributes: { class: 'power-embed row' }, children: [
									this.cell({
										element: 'select', name: 'display', options: ['16:9 (1280px x 720px)', '4:3 (1000px x 750px)', 'Custom Size']
									})
								]
							})
						]
					});

					differentTenant();
					break;
				case '':
					let userList = this.sharePoint.attributes.pane.content[key].draft.dom.find('.crater-powerbi-container');
					let userListRows = userList.findAll('.user');

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'layout-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'Edit Layout Box'
									})
								]
							}),
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.cell({
										element: 'input', name: 'backgroundcolor', value: this.element.find('.user').css()['background-color']
									})
								]
							}
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'layout-button-row-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'Edit Layout Button'
									})
								]
							}),
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.cell({
										element: 'input', name: 'fontSize', value: this.element.find('.user-button').css()['font-size']
									}),
									this.cell({
										element: 'input', name: 'backgroundcolor', value: this.element.find('.user-button').css()['background-color']
									}),
									this.cell({
										element: 'input', name: 'fontFamily', value: this.element.find('.user-button').css()['font-family']
									}),
									this.cell({
										element: 'input', name: 'color', value: this.element.find('.user-button').css()['color']
									})
								]
							}
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'layout-recommended-row-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'Edit Layout Recommended'
									})
								]
							}),
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.cell({
										element: 'input', name: 'fontSize', value: this.element.find('.user-recommended').css()['font-size']
									}),
									this.cell({
										element: 'input', name: 'fontFamily', value: this.element.find('.user-recommended').css()['font-family']
									}),
									this.cell({
										element: 'input', name: 'color', value: this.element.find('.user-recommended').css()['color']
									}),
									this.cell({
										element: 'select', name: 'toggle', options: ['show', 'hide']
									})
								]
							}
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'layout-info-row-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'Edit Layout Info'
									})
								]
							}),
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.cell({
										element: 'input', name: 'fontSize', value: this.element.find('.power-text').css()['font-size']
									}),
									this.cell({
										element: 'input', name: 'fontFamily', value: this.element.find('.power-text').css()['font-family']
									}),
									this.cell({
										element: 'input', name: 'color', value: this.element.find('.power-text').css()['color']
									}),
									this.cell({
										element: 'select', name: 'toggle', options: ['show', 'hide']
									})
								]
							}
						]
					});

					this.paneContent.makeElement({
						element: 'div', attributes: { class: 'layout-header-row-pane card' }, children: [
							this.createElement({
								element: 'div', attributes: { class: 'card-title' }, children: [
									this.createElement({
										element: 'h2', attributes: { class: 'title' }, text: 'Edit Layout Header'
									})
								]
							}),
							{
								element: 'div', attributes: { class: 'row' }, children: [
									this.cell({
										element: 'input', name: 'fontSize', value: this.element.find('.user-header').css()['font-size']
									}),
									this.cell({
										element: 'input', name: 'fontFamily', value: this.element.find('.user-header').css()['font-family']
									}),
									this.cell({
										element: 'input', name: 'color', value: this.element.find('.user-header').css()['color']
									}),
									this.cell({
										element: 'select', name: 'toggle', options: ['show', 'hide']
									})
								]
							}
						]
					});

					differentTenant();
					this.paneContent.append(this.generatePaneContent({ list: userListRows }));
					break;
			}

		}
		return this.paneContent;
	}

	public generatePaneContent(params) {
		let userListPane = this.createElement({
			element: 'div', attributes: { class: 'card list-pane' }, children: [
				this.createElement({
					element: 'div', attributes: { class: 'card-title' }, children: [
						this.createElement({
							element: 'h2', attributes: { class: 'title' }, text: 'User'
						})
					]
				}),
			]
		});

		for (let i = 0; i < params.list.length; i++) {
			userListPane.makeElement({
				element: 'div',
				attributes: { class: 'crater-powerbi-user-pane row' },
				children: [
					this.cell({
						element: 'img', name: 'image', attributes: {}, dataAttributes: { class: 'crater-icon', src: params.list[i].find('.crater-powerbi-image').src }
					}),
					this.cell({
						element: 'input', name: 'header', attribute: { class: 'crater-user-header' }, value: params.list[i].find('.user-header').textContent
					}),
					this.cell({
						element: 'input', name: 'info-text', value: params.list.title || params.list[i].find('.power-text').textContent
					}),
					this.cell({
						element: 'input', name: 'recommended', value: params.list.subTitle || params.list[i].find('.user-recommended').textContent
					}),
					this.cell({
						element: 'input', name: 'button', value: params.list.body || params.list[i].find('.user-button').textContent
					})
				]
			});
		}

		return userListPane;
	}

	public listenPaneContent(params) {
		this.element = params.element;
		this.key = this.element.dataset['key'];
		let self = this;
		this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
		let powerSettings = JSON.parse(this.element.dataset.settings);

		window.onerror = (msg, url, lineNumber, columnNumber, error) => {
			console.log(msg, url, lineNumber, columnNumber, error);
		};

		const differentTenantSync = () => {
			const syncPane = this.paneContent.querySelector('.Re-sync-pane');
			syncPane.querySelector('.power-sync').querySelector('#sync-power').onclick = () => {
				if (syncPane.querySelector('#Client-ID-cell').value.length !== 0 && syncPane.querySelector('#Redirect-URI-cell').value.length !== 0 && syncPane.querySelector('#Client-secret-cell').value.length !== 0) {
					syncPane.querySelector('.sync-note').style.color = 'green';
					syncPane.querySelector('.sync-note').render({
						element: 'img', attributes: { class: 'crater-icon', src: this.sharePoint.images.loading, style: { width: '100px', height: '100px', margin: '0 auto' } }
					});
					this.signOut()
						.then(response => {
							powerSettings = JSON.parse(this.element.dataset.settings);
							powerSettings.clientId = syncPane.querySelector('#Client-ID-cell').value;
							powerSettings.redirectURI = syncPane.querySelector('#Redirect-URI-cell').value;
							powerSettings.clientSecret = syncPane.querySelector('#Client-secret-cell').value;
							powerSettings.code = '';
							this.sharePoint.saveSettings(this.element, powerSettings);
							this.requestCode();
							const draftRequestInterval = setInterval(() => {
								powerSettings = JSON.parse(this.element.dataset.settings);
								if (powerSettings.code) {
									clearInterval(draftRequestInterval);
									this.getAccessToken(powerSettings.code)
										.then(access => {
											this.getWorkSpace(access);
											powerSettings = JSON.parse(this.element.dataset.settings);
											if (powerSettings.accessToken && powerSettings.groups.length !== 0) {
												syncPane.querySelector('.sync-note').textContent = 'Sync Successfull!';
												syncPane.querySelector('#Client-ID-cell').value = '';
												syncPane.querySelector('#Redirect-URI-cell').value = '';
												syncPane.querySelector('#Client-secret-cell').value = '';
												this.checkConnectedAndRender();
												powerSettings.loginType = 'user';
												this.sharePoint.saveSettings(this.element, powerSettings);
											}
										});
								}
							});
						});
				} else {
					syncPane.querySelector('.sync-note').style.color = 'red';
					syncPane.querySelector('.sync-note').textContent = 'These fields cannot be empty!!!';
				}
			};
		};

		if (powerSettings.loginType.length !== 0) {
			let powerPane = this.paneContent.find('.power-pane');
			let sizePane = this.paneContent.find('.size-pane');
			if (powerSettings.loginType.toLowerCase() === 'user') {
				powerPane.find('#user-rights-cell').parentElement.remove();
			} else {
				powerPane.find('#user-rights-cell').onChanged(value => {
					switch (value.toLowerCase()) {
						case 'allow':
							this.getAccessToken()
								.then(response => {
									powerSettings = JSON.parse(this.element.dataset.settings);
									this.addUser({ accessToken: response, groupID: powerSettings.groupId });
								});
							break;
						case 'deny':
							this.getAccessToken()
								.then(response => {
									powerSettings = JSON.parse(this.element.dataset.settings);
									this.deleteUser({ accessToken: response, groupID: powerSettings.groupId, username: powerSettings.username });
								});
							break;
					}
				});
			}

			let changedPage = () => {
				try {
					powerSettings = JSON.parse(this.element.dataset.settings);
					if (powerPane.find('#page-cell')) {
						powerPane.find('#page-cell').onChanged(value => {
							for (let page = 0; page < powerSettings.pageName.length; page++) {
								for (let property in powerSettings.pageName[page]) {
									if (value === powerSettings.pages[page].displayName) powerSettings.namePage = powerSettings.pages[page].pageName;
								}
							}
						});
					}
					this.sharePoint.saveSettings(this.element, powerSettings);
				} catch (error) {
					console.log(error.message);
				}

			};
			let changedTile = () => {
				try {
					powerSettings = JSON.parse(this.element.dataset.settings);
					if (powerPane.find('#tile-cell')) {
						powerPane.find('#tile-cell').onChanged(value => {
							for (let tile = 0; tile < powerSettings.tiles.length; tile++) {
								for (let property in powerSettings.tiles[tile]) {
									if (value === powerSettings.tiles[tile].tileName) {
										if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
										if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
										if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();

										powerSettings.tokenEmbed = 'tile';
										powerSettings.embedType = 'tile';
										powerSettings.tileId = powerSettings.tiles[tile].tileId;
										powerSettings.reportId = powerSettings.tiles[tile].tileId;
										powerSettings.embedUrl = powerSettings.tiles[tile].embedUrl;
										self.getPages({ accessToken: powerSettings.accessToken, groupID: powerSettings.groupId, reportID: powerSettings.tiles[tile].reportId });
										changedPage();
									}
									else if (value.toLowerCase() === 'show full dashboard') {
										powerSettings.tokenEmbed = 'fulldashboard';
										powerSettings.embedType = 'dashboard';
										powerSettings.reportId = powerSettings.dashboardId;
										powerSettings.embedUrl = powerSettings.dashboardEmbedUrl;
										powerSettings.namePage = '';
										if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
										if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
										if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
									}
								}
							}

							if (value.toLowerCase() !== 'show full dashboard') {
								powerPane.find('.power-embed').makeElement({
									element: 'div', children: [
										self.cell({
											element: 'select', name: 'page', options: powerSettings.pageName
										})
									]
								});

								powerPane.makeElement({
									element: 'div', attributes: { class: 'row' }, children: [
										self.cell({
											element: 'select', name: 'filter-panel', options: ['show', 'hide']
										}),
										self.cell({
											element: 'select', name: 'navigation', options: ['show', 'hide']
										})
									]
								});

								powerPane.find('#filter-panel-cell').onChanged(val => {
									switch (val.toLowerCase()) {
										case 'show':
											powerSettings.showFilter = true;
											break;
										case 'hide':
											powerSettings.showFilter = false;
											break;
										default:
											powerSettings.showFilter = false;
									}
								});

								powerPane.find('#navigation-cell').onChanged(val => {
									switch (val.toLowerCase()) {
										case 'show':
											powerSettings.showNavContent = true;
											break;
										case 'hide':
											powerSettings.showNavContent = false;
											break;
										default:
											powerSettings.showNavContent = false;
									}
								});
							}
						});
					}
					this.sharePoint.saveSettings(this.element, powerSettings);
				} catch (error) {
					console.log(error.message);
				}

			};
			let changedReport = () => {
				try {
					powerSettings = JSON.parse(this.element.dataset.settings);
					if (powerPane.find('#view-cell')) {
						powerPane.find('#view-cell').onChanged(value => {
							if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
							if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
							if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();

							for (let view = 0; view < powerSettings.reports.length; view++) {
								for (let property in powerSettings.reports[view]) {
									if (value === powerSettings.reports[view].reportName) {
										powerSettings.tokenEmbed = 'reportName';
										powerSettings.reportId = powerSettings.reports[view].reportId;
										powerSettings.embedUrl = powerSettings.reports[view].embedUrl;
										this.sharePoint.saveSettings(this.element, powerSettings);
										powerSettings = JSON.parse(this.element.dataset.settings);
										self.getPages({ accessToken: powerSettings.accessToken, groupID: powerSettings.groupId, reportID: powerSettings.reportId }).catch(error => console.log(error.message));
										powerSettings = JSON.parse(this.element.dataset.settings);
									}
								}
							}
							powerPane.find('.power-embed').makeElement({
								element: 'div', children: [
									self.cell({
										element: 'select', name: 'page', options: powerSettings.pageName
									})
								]
							});
							changedPage();
							powerPane.makeElement({
								element: 'div', attributes: { class: 'row' }, children: [
									self.cell({
										element: 'select', name: 'filter-panel', options: ['show', 'hide']
									}),
									self.cell({
										element: 'select', name: 'navigation', options: ['show', 'hide']
									})
								]
							});

							powerPane.find('#filter-panel-cell').onChanged(val => {
								switch (val.toLowerCase()) {
									case 'show':
										powerSettings.showFilter = true;
										this.sharePoint.saveSettings(this.element, powerSettings);
										break;
									case 'hide':
										powerSettings.showFilter = false;
										this.sharePoint.saveSettings(this.element, powerSettings);
										break;
									default:
										powerSettings.showFilter = false;
										this.sharePoint.saveSettings(this.element, powerSettings);
								}
							});

							powerPane.find('#navigation-cell').onChanged(val => {
								switch (val.toLowerCase()) {
									case 'show':
										powerSettings.showNavContent = true;
										this.sharePoint.saveSettings(this.element, powerSettings);
										break;
									case 'hide':
										powerSettings.showNavContent = false;
										this.sharePoint.saveSettings(this.element, powerSettings);
										break;
									default:
										powerSettings.showNavContent = false;
										this.sharePoint.saveSettings(this.element, powerSettings);
								}
							});
						});
					}
					this.sharePoint.saveSettings(this.element, powerSettings);
				} catch (error) {
					console.log(error.message);
				}

			};
			let changedDashboard = () => {
				try {
					powerSettings = JSON.parse(this.element.dataset.settings);
					if (powerPane.find('#view-cell')) {
						powerPane.find('#view-cell').onChanged(value => {
							if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
							if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
							if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
							if (powerPane.find('#tile-cell')) powerPane.find('#tile-cell').parentElement.remove();
							for (let view = 0; view < powerSettings.dashboards.length; view++) {
								for (let property in powerSettings.dashboards[view]) {
									if (value === powerSettings.dashboards[view].dashboardName) {
										powerSettings.tokenEmbed = 'fulldashboard';
										powerSettings.dashboardId = powerSettings.dashboards[view].dashboardId;
										powerSettings.dashboardEmbedUrl = powerSettings.dashboards[view].embedUrl;
										self.getTiles(powerSettings.accessToken, powerSettings.groupId, powerSettings.dashboardId);
										powerSettings = JSON.parse(this.element.dataset.settings);
									}
								}
							}
							powerPane.find('.power-embed').makeElement({
								element: 'div', children: [
									self.cell({
										element: 'select', name: 'tile', options: powerSettings.tileName
									})
								]
							});
							powerSettings.embedType = 'dashboard';
							this.sharePoint.saveSettings(this.element, powerSettings);
							changedTile();
						});
					}
				} catch (error) {
					console.log(error.message);
				}

			};

			powerPane.find('#WorkSpace-cell').onChanged(value => {
				powerSettings.changed = true;
				this.sharePoint.saveSettings(this.element, powerSettings);
				powerSettings = JSON.parse(this.element.dataset.settings);
				if (powerPane.find('#embed-type-cell')) powerPane.find('#embed-type-cell').parentElement.remove();
				if (powerPane.find('#view-cell')) powerPane.find('#view-cell').parentElement.remove();
				if (powerPane.find('#tile-cell')) powerPane.find('#tile-cell').parentElement.remove();
				if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
				if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
				if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
				for (let group = 0; group < powerSettings.groups.length; group++) {
					for (let property in powerSettings.groups[group]) {
						switch (value) {
							case powerSettings.groups[group].workspaceName:
								powerSettings.groupId = powerSettings.groups[group].workspaceId;
								this.sharePoint.saveSettings(this.element, powerSettings);
								powerSettings = JSON.parse(this.element.dataset.settings);
								this.getReports(powerSettings.accessToken, powerSettings.groupId);
								this.getDashboards(powerSettings.accessToken, powerSettings.groupId);
								powerSettings = JSON.parse(this.element.dataset.settings);
								break;
							case 'My WorkSpace':
								powerSettings.groupId = 'none';
								this.sharePoint.saveSettings(this.element, powerSettings);
								powerSettings = JSON.parse(this.element.dataset.settings);
								this.getReports(powerSettings.accessToken, powerSettings.groupId, 'third');
								this.getDashboards(powerSettings.accessToken, powerSettings.groupId, 'third');
								powerSettings = JSON.parse(this.element.dataset.settings);
								break;
						}

					}
				}

				powerPane.find('.power-embed').makeElement({
					element: 'div', children: [
						self.cell({
							element: 'select', name: 'embed-type', options: ['Dashboard', 'Report']
						})
					]
				});

				powerPane.find('#embed-type-cell').onChanged(val => {
					powerSettings.embedType = val.toLowerCase();
					switch (val.toLowerCase()) {
						case 'report':
							if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
							if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
							if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
							if (powerPane.find('#view-cell')) powerPane.find('#view-cell').parentElement.remove();
							if (powerPane.find('#tile-cell')) powerPane.find('#tile-cell').parentElement.remove();

							powerPane.find('.power-embed').makeElement({
								element: 'div', children: [
									this.cell({
										element: 'select', name: 'view', options: powerSettings.reportName
									})
								]
							});
							powerSettings.tileId = '';
							powerSettings.dashboardId = '';
							this.sharePoint.saveSettings(this.element, powerSettings);
							changedReport();
							break;
						case 'dashboard':
							if (powerPane.find('#filter-panel-cell')) powerPane.find('#filter-panel-cell').parentElement.parentElement.remove();
							if (powerPane.find('#navigation-cell')) powerPane.find('#navigation-cell').parentElement.parentElement.remove();
							if (powerPane.find('#page-cell')) powerPane.find('#page-cell').parentElement.remove();
							if (powerPane.find('#view-cell')) powerPane.find('#view-cell').parentElement.remove();
							if (powerPane.find('#tile-cell')) powerPane.find('#tile-cell').parentElement.remove();

							powerPane.find('.power-embed').makeElement({
								element: 'div', children: [
									this.cell({
										element: 'select', name: 'view', options: powerSettings.dashBoardName
									})
								]
							});
							this.sharePoint.saveSettings(this.element, powerSettings);
							changedDashboard();
							break;
					}
				});
				this.sharePoint.saveSettings(this.element, powerSettings);
			});

			sizePane.find('#display-cell').onChanged(value => {
				powerSettings = JSON.parse(this.element.dataset.settings);
				switch (value) {
					case '16:9 (1280px x 720px)':
						if (sizePane.find('#width-cell')) sizePane.find('#width-cell').parentElement.remove();
						if (sizePane.find('#height-cell')) sizePane.find('#height-cell').parentElement.remove();
						powerSettings.width = '1280px';
						powerSettings.height = '720px';
						this.sharePoint.saveSettings(this.element, powerSettings);
						break;
					case '4:3 (1000px x 750px)':
						if (sizePane.find('#width-cell')) sizePane.find('#width-cell').parentElement.remove();
						if (sizePane.find('#height-cell')) sizePane.find('#height-cell').parentElement.remove();
						powerSettings.width = '1000px';
						powerSettings.height = '750px';
						this.sharePoint.saveSettings(this.element, powerSettings);
						break;
					case 'Custom Size':
						sizePane.find('.power-embed').makeElement({
							element: 'div', children: [
								this.cell({
									element: 'input', name: 'width', value: powerSettings.width
								}),
								this.cell({
									element: 'input', name: 'height', value: powerSettings.height
								})
							]
						});
						sizePane.find('#width-cell').onChanged(val => {
							powerSettings.width = val;
						});
						sizePane.find('#height-cell').onChanged(val => {
							powerSettings.height = val;
						});
						this.sharePoint.saveSettings(this.element, powerSettings);
						break;
				}
			});

			differentTenantSync();

		}
		else {
			let layoutRowPane = this.paneContent.find('.layout-pane');
			let layoutButtonRowPane = this.paneContent.find('.layout-button-row-pane');
			let layoutRecommendedRowPane = this.paneContent.find('.layout-recommended-row-pane');
			let layoutInfoRowPane = this.paneContent.find('.layout-info-row-pane');
			let layoutHeaderRowPane = this.paneContent.find('.layout-header-row-pane');
			let userList = this.element.find('.crater-powerbi-connect');
			let userListRow = userList.findAll('.user');

			let layoutBackgroundParent = layoutRowPane.find('#backgroundcolor-cell').parentNode;
			this.pickColor({ parent: layoutBackgroundParent, cell: layoutBackgroundParent.find('#backgroundcolor-cell') }, (backgroundColor) => {
				this.element.findAll('.login-container').forEach(element => {
					element.css({ backgroundColor });
				});
				layoutBackgroundParent.find('#backgroundcolor-cell').value = backgroundColor;
				layoutBackgroundParent.find('#backgroundcolor-cell').setAttribute('value', backgroundColor); //set the value of the eventColor cell in the pane to the color
			});

			let layoutButtonParent = layoutButtonRowPane.find('#backgroundcolor-cell').parentNode;
			this.pickColor({ parent: layoutButtonParent, cell: layoutButtonParent.find('#backgroundcolor-cell') }, (backgroundColor) => {
				this.element.findAll('.user-button').forEach(element => {
					element.css({ backgroundColor });
				});
				layoutButtonParent.find('#backgroundcolor-cell').value = backgroundColor;
				layoutButtonParent.find('#backgroundcolor-cell').setAttribute('value', backgroundColor); //set the value of the eventColor cell in the pane to the color
			});

			let layoutButtonColor = layoutButtonRowPane.find('#color-cell').parentNode;
			this.pickColor({ parent: layoutButtonColor, cell: layoutButtonColor.find('#color-cell') }, (color) => {
				this.element.findAll('.user-button').forEach(element => {
					element.css({ color });
				});
				layoutButtonColor.find('#color-cell').value = color;
				layoutButtonColor.find('#color-cell').setAttribute('value', color);
			});

			let layoutRecommendedColor = layoutRecommendedRowPane.find('#color-cell').parentNode;
			this.pickColor({ parent: layoutRecommendedColor, cell: layoutRecommendedColor.find('#color-cell') }, (color) => {
				this.element.findAll('.user-recommended').forEach(element => {
					element.css({ color });
				});
				layoutRecommendedColor.find('#color-cell').value = color;
				layoutRecommendedColor.find('#color-cell').setAttribute('value', color);
			});

			let layoutInfoColor = layoutInfoRowPane.find('#color-cell').parentNode;
			this.pickColor({ parent: layoutInfoColor, cell: layoutInfoColor.find('#color-cell') }, (color) => {
				this.element.findAll('.power-text').forEach(element => {
					element.css({ color });
				});
				layoutInfoColor.find('#color-cell').value = color;
				layoutInfoColor.find('#color-cell').setAttribute('value', color);
			});

			let layoutHeaderColor = layoutHeaderRowPane.find('#color-cell').parentNode;
			this.pickColor({ parent: layoutHeaderColor, cell: layoutHeaderColor.find('#color-cell') }, (color) => {
				this.element.findAll('.user-header').forEach(element => {
					element.css({ color });
				});
				layoutHeaderColor.find('#color-cell').value = color;
				layoutHeaderColor.find('#color-cell').setAttribute('value', color);
			});

			layoutButtonRowPane.find('#fontSize-cell').onChanged(value => {
				this.element.findAll('.user-button').forEach(element => {
					element.css({ fontSize: value });
				});
			});

			layoutRecommendedRowPane.find('#fontSize-cell').onChanged(value => {
				this.element.findAll('.user-recommended').forEach(element => {
					element.css({ fontSize: value });
				});
			});

			layoutInfoRowPane.find('#fontSize-cell').onChanged(value => {
				this.element.findAll('.power-text').forEach(element => {
					element.css({ fontSize: value });
				});
			});

			layoutHeaderRowPane.find('#fontSize-cell').onChanged(value => {
				this.element.findAll('.user-header').forEach(element => {
					element.css({ fontSize: value });
				});
			});

			layoutButtonRowPane.find('#fontFamily-cell').onChanged(value => {
				this.element.findAll('.user-button').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			layoutRecommendedRowPane.find('#fontFamily-cell').onChanged(value => {
				this.element.findAll('.user-recommended').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			layoutInfoRowPane.find('#fontFamily-cell').onChanged(value => {
				this.element.findAll('.power-text').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			layoutHeaderRowPane.find('#fontFamily-cell').onChanged(value => {
				this.element.findAll('.user-header').forEach(element => {
					element.css({ fontFamily: value });
				});
			});

			let showRecommended = layoutRecommendedRowPane.find('#toggle-cell');
			showRecommended.addEventListener('change', e => {

				switch (showRecommended.value.toLowerCase()) {
					case "hide":
						this.element.findAll('.user-recommended').forEach(element => {
							element.style.display = "none";
						});
						break;
					case "show":
						this.element.findAll('.user-recommended').forEach(element => {
							element.style.display = "block";
						});
						break;
					default:
						this.element.findAll('.user-recommended').forEach(element => {
							element.style.display = "none";
						});
				}
			});

			let showInfo = layoutInfoRowPane.find('#toggle-cell');
			showInfo.addEventListener('change', e => {
				switch (showInfo.value.toLowerCase()) {
					case "hide":
						this.element.findAll('.power-text').forEach(element => {
							element.style.display = "none";
						});
						break;
					case "show":
						this.element.findAll('.power-text').forEach(element => {
							element.style.display = "block";
						});
						break;
					default:
						this.element.findAll('.power-text').forEach(element => {
							element.style.display = "none";
						});
				}
			});

			let showHeader = layoutHeaderRowPane.find('#toggle-cell');
			showHeader.addEventListener('change', e => {

				switch (showHeader.value.toLowerCase()) {
					case "hide":
						this.element.findAll('.user-header').forEach(element => {
							element.style.display = "none";
						});
						break;
					case "show":
						this.element.findAll('.user-header').forEach(element => {
							element.style.display = "block";
						});
						break;
					default:
						this.element.findAll('.user-header').forEach(element => {
							element.style.display = "none";
						});
				}
			});

			let userRowHandler = (userRowPane, userRowDom) => {
				let iconParent = userRowPane.find('#image-cell').parentNode;
				this.uploadImage({ parent: iconParent }, (image) => {
					iconParent.find('#image-cell').src = image.src;
					this.element.find('.crater-powerbi-image').src = image.src;
				});
				userRowPane.find('#header-cell').onChanged(value => {
					userRowDom.find('.user-header').innerHTML = value;
				});

				userRowPane.find('#info-text-cell').onChanged(value => {
					userRowDom.find('.power-text').innerHTML = value;
				});

				userRowPane.find('#recommended-cell').onChanged(value => {
					userRowDom.find('.user-recommended').innerHTML = value;
				});

				userRowPane.find('#button-cell').onChanged(value => {
					userRowDom.find('.user-button').innerHTML = value;
				});

			};

			let paneItems = this.paneContent.findAll('.crater-powerbi-user-pane');
			paneItems.forEach((userRow, position) => {
				userRowHandler(userRow, userListRow[position]);
			});

			differentTenantSync();
		}

		this.paneContent.addEventListener('mutated', event => {
			this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
			this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
		});

		this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
			let draftPower = JSON.parse(this.element.dataset.settings);
			if (draftPower.changed) {
				if (draftPower.groupId !== 'none') {
					this.getEmbedToken({ accessToken: draftPower.accessToken, groupID: draftPower.groupId, reportID: draftPower.reportId, generateUrl: draftPower.tokenEmbed })
						.then(response => {
							draftPower = JSON.parse(this.element.dataset.settings);
							this.element.find('.crater-powerbi-container').css({ width: draftPower.width, height: draftPower.height });
							this.element.find('#renderContainer').css({ width: '100%', height: draftPower.height });
							this.embedPower({ accessToken: response, type: draftPower.embedType, embedUrl: draftPower.embedUrl });
						});
				} else {
					if (draftPower.embedType === 'report') {
						if (this.element.find('#renderContainer')) this.element.find('#renderContainer').remove();
						let powerContainer = this.element.find('.crater-powerbi-container') as any;
						powerContainer.makeElement({
							element: 'div', attributes: { id: 'renderContainer' }, children: [
								{
									element: 'div', attributes: { id: 'render-error' }, children: [
										{ element: 'p', attributes: { id: 'render-text' } }
									]
								}
							]
						});
						let render = powerContainer.find('#renderContainer');
						const iframeURL = `${draftPower.embedUrl}&autoAuth=true&ctid=${draftPower.tenantID}&filterPaneEnabled=${draftPower.showFilter}&navContentPaneEnabled=${draftPower.showNavContent}&pageName=${draftPower.namePage}`;
						render.makeElement({
							element: 'div', attributes: { class: 'power-iframe' }, children: [
								{
									element: 'iframe', attributes: { width: draftPower.width, height: draftPower.height, src: iframeURL, frameborder: "0", allowFullScreen: "true" }
								}
							]
						});
						draftPower.embedded = false;
						this.sharePoint.saveSettings(this.element, draftPower);

						render.find('#render-error').style.display = "none";
						render.style.display = "block";
					}
				}
			} else {
				if (draftPower.groupId !== 'none') {
					this.element.find('.crater-powerbi-container').css({ width: draftPower.width, height: draftPower.height });
					this.element.find('#renderContainer').css({ width: '100%', height: draftPower.height });
				} else {
					let powerIframe = this.element.find('#renderContainer').find('iframe');
					powerIframe.width = draftPower.width;
					powerIframe.height = draftPower.height;
				}
			}
			this.sharePoint.saveSettings(this.element, powerSettings);
		});
	}
}