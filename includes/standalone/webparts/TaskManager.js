import { ElementModifier } from '../ElementModifier';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface Task {
    id?: number;
    title: string;
    assigner: string;
    assignee: string;
    description: string;
    startDate: string;
    dueDate: string;
    status: string;
    alter: string;
}

export class TaskManager extends ElementModifier {
    public key: any;
    public element: any;
    public paneContent: any;
    public currentTab: number = 0;

    public taskArray: Task[] = [
        {
            id: 1,
            title: 'Build Task Manager',
            assigner: 'Mr. Mayowa',
            assignee: 'Nsidnanya Marcel Chukwuma',
            description: 'Build a Task Manager webpart for Crater 365',
            startDate: '05/19/2020',
            dueDate: '05/22/2020',
            status: 'Suspended',
            alter: 'Suspended'
        },
        {
            id: 2,
            title: 'Integrate Font Awesome Icons with Crater',
            assigner: 'Ikeka Kennedy',
            assignee: 'Chukwuma Marcel',
            description: 'Integrate external font awesome icons with crater 365',
            startDate: '05/11/2020',
            dueDate: '05/15/2020',
            status: 'Completed',
            alter: 'Completed'
        },
        {
            id: 3,
            title: 'Edit Background Webpart',
            assigner: 'Ikeka Kennedy',
            assignee: 'Chukwuma Marcel',
            description: 'Edit Backgroud webpart to allow append functionality',
            startDate: '05/11/2020',
            dueDate: '05/15/2020',
            status: 'Completed',
            alter: 'Completed'
        },
        {
            id: 4,
            title: 'Create a Three Dimensional Slider',
            assigner: 'Ikeka Kennedy',
            assignee: 'Nsidnanya Marcel Chukwuma',
            description: 'Create a three dimensional slider for Crater 365',
            startDate: '05/12/2020',
            dueDate: '05/18/2020',
            status: 'Waiting On Someone',
            alter: 'Waiting On Someone'
        }
    ];

    constructor(public params: any) {
        super({ sharePoint: params.sharePoint });
        this.sharePoint = params.sharePoint;
        this.params = params;
    }

    public render(params) {
        const taskManager: any = this.createKeyedElement({
            element: 'div', attributes: { class: 'crater-component crater-task-manager', 'data-type': 'taskmanager' }, children: [
                { element: 'div', attributes: { id: 'crater-task-manager-container', class: 'crater-task-manager-container' } }
            ]
        });

        taskManager.querySelector('.crater-task-manager-container').innerHTML = `
        <div id="crater-tm-header" class="crater-tm-header">
                <div id="crater-tm-header-text-box" class="crater-tm-header-text-box">
                    <div><i class="crater-tm-header-icon ${this.sharePoint.icons.eye.split(',').join(' ')}" data-icon= ${this.sharePoint.icons.eye}></i><span class="crater-tm-header-text">my tasks</span><span id="task-manager-number-tasks" class="crater-tm-header-text"></span></div>
                </div>
                <div id="crater-tm-header-right-nav" class="crater-tm-header-right-nav">
                    <div class="crater-tm-header-search-bar">
                        <input type="text" placeholder="Search Task..." id="search-bar-input">
                        <button id="search-bar-button" class="task-button search-bar-button">search</button>
                    </div>
                    <div class="add-new">
                        <button class="task-button add-new-button" id="crater-task-manager-add-new"> Create </button>
                        <button class="task-button view-status-button"> Status </button>
                    </div>
                </div>  
        </div>   
        <div id="task-list-container" class="task-list-container">
            <button id="task-list-form-back" class="tms-tasks task-button search-bar-button"><< Tasks</button>  
            <div id="task-list-form" class="task-list-form">
                <form id="create-task-form">
                    <div class="task-form-tab">
                        <div class="form-field">
                            <label for="title">Title: </label>
                            <input type="text" name="title" id="title" placeholder="Title..." class="create-input">
                        </div>
                        <div class="form-field">
                            <label for="assigner">Assigner: </label>
                            <input type="text" name="assigner" id="assigner" placeholder="Assigner..." class="create-input">
                        </div>
                        <div class="form-field">
                            <label for="assignee">Assignee: </label>
                            <input type="text" name="assignee" id="assignee" placeholder="Assignee..." class="create-input">
                        </div>
                        <div class="form-field">
                            <label for="description">Description: </label>
                            <input type="text" name="description" id="description" placeholder="Description..." class="create-input">
                        </div>
                    </div>
                    <div class="task-form-tab">
                        <div class="form-field">
                            <label for="startdate">Start Date: </label>
                            <input type="date" id="startdate" placeholder="Start date..." class="create-input">
                        </div>
                        <div class="form-field">
                            <label for="enddate">End Date: </label>
                            <input type="date" id="enddate" placeholder="end date..." class="create-input">
                        </div>
                        <div class="form-field">
                            <label for="select-status">Status: </label>
                            <select name="select-status" id="select-status" class="create-input">
                                <option value="In Progress">In Progress</option>
                                <option value="Started">Started</option>
                                <option value="Not Started">Not Started</option>
                                <option value="Completed">Completed</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Waiting On Someone">Waiting On Someone</option>
                                <option value="Deferred">Deferred</option>
                            </select>
                        </div>
                    </div>
        
                    <div class="form-field submit-field">
                        <button type="button" class="task-button add-new-button" id="task-prev">Prev</button>
                        <button type="button" class="task-button add-new-button" id="task-next">Next</button>
                        <input type="submit" id="task-submit" style="display: none;">
                    </div> 

                    <div class="task-step-buttons">
                        <span class="task-step"></span>
                        <span class="task-step"></span>
                    </div>
                </form>
                </div>
                <div class="crater-tm-admin-create">
                    <span> Sorry, You do not have permission to create tasks </span>
                </div>
                <div class="task-manager-not-found">
                    <span>There are no tasks by that title</span>
                </div>
                <ul id="task-list"> 
                </ul>  
                <div id="task-manager-status-view" class="task-manager-status-view">
                    <button class="tms-tasks task-button search-bar-button"><< Tasks</button>
                    <div class="tms-view-item">
                        <i class="fa fa-list tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">All Tasks</div>
                        <span class="tms-view tms-view-number tms-view-all">3</span>
                    </div>
                    <div class="tms-view-item">
                        <i class="fa fa-check tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">Completed </div>
                        <span class="tms-view tms-view-number tms-view-completed">3</span>
                    </div>
                    <div class="tms-view-item">
                        <i class="fa fa-ellipsis-h tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">Incomplete</div>
                        <span class="tms-view tms-view-number tms-view-incomplete">3</span>
                    </div>
                    <div class="tms-view-item">
                        <i class="fa-star tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">Overdue</div>
                        <span class="tms-view tms-view-number tms-view-overdue">3</span>
                    </div> 
                    <div class="tms-view-item">
                        <i class="fa fa-clock-o tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">Due Today</div>
                        <span class="tms-view tms-view-number tms-view-today">3</span>
                    </div>
                    <div class="tms-view-item">
                        <i class="fa fa-bell tms-view tms-view-icon"></i>
                        <div class="tms-view tms-view-head">Due this week </div>
                        <span class="tms-view tms-view-number tms-view-week">3</span>
                    </div>
                </div>
        </div>
        `;

        this.func.objectCopy(params, taskManager.dataset);
        this.key = taskManager.dataset.key;
        this.sharePoint.saveSettings(taskManager, { taskManager: this.taskArray, taskManagerMode: 'Light' });

        return taskManager;
    }

    public getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sharePoint.connection.getWithGraph().then((client: any) => {
                client
                    .api('/me')
                    .select('mail, displayName, givenName, id, surname, jobTitle, mobilePhone, officeLocation, photo, image')
                    .get(async (error: any, result: MicrosoftGraph.User, rawResponse?: any) => {
                        resolve(result);
                    });
            });
        }).catch((error: any) => console.log(error.message));
    }

    public rendered(params): void {
        this.element = params.element;
        this.key = params.element.dataset.key;
        const settings = JSON.parse(params.element.dataset.settings);
        const self = this;
        const searchButton = this.element.querySelector('#search-bar-button');
        const inputBox = this.element.querySelector('#search-bar-input');
        const statusButton = this.element.querySelector('.view-status-button');
        const createButton = this.element.querySelector('#crater-task-manager-add-new');
        const taskList = this.element.querySelector('#task-list');
        const statusView = this.element.querySelector('.task-manager-status-view');
        const createTaskForm = this.element.querySelector('#create-task-form');
        const taskFormSubmit = this.element.querySelector('.submit-field');
        const taskListFormDiv = this.element.querySelector('.task-list-form');
        const backToTasks = this.element.querySelector('#task-list-form-back');

        params.source = [];
        let permissionGranted: boolean = false;
        this.getUser()
            .then((user: MicrosoftGraph.User) => {
                for (let task of settings.taskManager) {
                    if (task.assignee.toLowerCase() === user['displayName'].toLowerCase()) params.source.push(task);
                    if (task.assigner.toLowerCase() === user['displayName'].toLowerCase()) permissionGranted = true;
                }

                for (let x = 0; x < params.source.length; x++) params.source[x].id = `task-${x}`;

                fillLists();

                // Event Listeners
                createTaskForm.onsubmit = (event) => {
                    event.preventDefault();
                    const steps = this.element.querySelectorAll('.task-step');
                    let newTask: Task = {
                        title: this.element.querySelector('#title').value,
                        assigner: this.element.querySelector('#assigner').value,
                        assignee: this.element.querySelector('#assignee').value,
                        description: this.element.querySelector('#description').value,
                        startDate: this.element.querySelector('#startdate').value,
                        dueDate: this.element.querySelector('#enddate').value,
                        status: this.element.querySelector('#select-status').value,
                        alter: this.element.querySelector('#select-status').value,
                    };
                    params.source.push(newTask);
                    fillLists();
                    createTaskForm.reset();
                    for (let i = 0; i < steps.length; i++)
                        if (steps[i].classList.contains('finish-page')) steps[i].classList.remove('finish-page');
                };

                createButton.onclick = () => {
                    taskList.style.display = 'none';
                    statusView.style.display = 'none';
                    if (permissionGranted) {
                        taskListFormDiv.style.display = 'block';
                        this.element.querySelector('.crater-tm-admin-create').style.display = 'none';
                    } else {
                        taskListFormDiv.style.display = 'none';
                        this.element.querySelector('.crater-tm-admin-create').style.display = 'block';
                    }
                    backToTasks.style.display = 'block';
                    showTab(self.currentTab);
                    backToTasks.onclick = () => {
                        taskList.style.display = 'block';
                        statusView.style.display = 'none';
                        taskListFormDiv.style.display = 'none';
                        backToTasks.style.display = 'none';
                        this.element.querySelector('.crater-tm-admin-create').style.display = 'none';
                    };
                };

                taskFormSubmit.onclick = (event) => {
                    if (event.target.id === 'task-prev') nextPrev(-1);
                    else if (event.target.id === 'task-next') nextPrev(1);
                };

                searchButton.onclick = () => {
                    if (inputBox.style.width == '0px') {
                        inputBox.style.width = '200px';
                        inputBox.style.opacity = 1;
                    }
                    else {
                        inputBox.style.width = '0px';
                        inputBox.style.opacity = 0;
                    }
                };

                statusButton.onclick = () => {
                    taskList.style.display = 'none';
                    taskListFormDiv.style.display = 'none';
                    backToTasks.style.display = 'none';
                    this.element.querySelector('.crater-tm-admin-create').style.display = 'none';
                    statusView.style.display = 'block';
                    let completed = 0;
                    let incomplete = 0;
                    let overdue = 0;
                    let dueToday = 0;
                    let dueThisWeek = 0;

                    for (let task of params.source) {
                        let today = new Date();
                        if (task.status.toLowerCase() === 'completed') completed += 1;
                        else incomplete += 1;

                        if (today.getDate() > (new Date(task.dueDate)).getDate()) overdue += 1;

                        if ((new Date(task.dueDate)).getDate() === (today.getDate())) dueToday += 1;

                        let lastWeek = new Date(today.setDate(today.getDate() - 7));
                        let nextWeek = new Date(today.setDate(today.getDate() + 7));
                        if (((new Date(task.dueDate)) > lastWeek) && (new Date(task.dueDate)) < nextWeek) dueThisWeek += 1;
                    }

                    statusView.querySelector('.tms-view-all').textContent = params.source.length;
                    statusView.querySelector('.tms-view-completed').textContent = completed;
                    statusView.querySelector('.tms-view-incomplete').textContent = incomplete;
                    statusView.querySelector('.tms-view-overdue').textContent = overdue;
                    statusView.querySelector('.tms-view-today').textContent = dueToday;
                    statusView.querySelector('.tms-view-week').textContent = dueThisWeek;
                    statusView.querySelector('.tms-tasks').onclick = () => {
                        taskList.style.display = 'block';
                        statusView.style.display = 'none';
                        fillLists();
                    };
                };
            });

        function fillLists() {
            params.source.sort((a, b) => {
                return (new Date(a.dueDate) < new Date(b.dueDate)) ? -1 : (new Date(b.dueDate) < new Date(a.dueDate)) ? 1 : 0;
            });
            taskList.innerHTML = '';
            self.element.querySelector('#task-manager-number-tasks').innerHTML = `(${params.source.length})`;

            for (let task of params.source) {
                let taskClassName = `task-${task.status.toLowerCase().split(' ').join('-')}`;
                const checkTask = (task.status.toLowerCase() === 'completed') ? "checked" : "";
                taskList.innerHTML += `
				<li>    
					<label for="task-${task.id}" class="task-list-item">
						<div class="task-check-box">   
							<input type="checkbox" name="task-${task.id}" id="task-${task.id}" class="task-list-cb" ${checkTask}>
							<span class="task-check-mark"></span>
							<span class="task-name">${task.title.substr(0, 40)}</span>
						</div>
						<div class="task-manager-info">
							<span class="task-complete-by">Due: ${task.dueDate}</span>
							<span class="task-manager-info-button ${taskClassName}">${task.status}</span>
						</div>
					</label>
				</li> 
				`;
            }

            const taskListItems = self.element.querySelectorAll('.task-list-item');
            taskListItems.forEach(taskListItem => {
                taskListItem.onclick = (event) => {
                    if (event.target.className === 'task-list-cb') {
                        for (let task of params.source) {
                            if (event.target.id === `task-${task.id}`) {
                                task.status = (event.target.checked) ? 'Completed' : task.alter;
                                fillLists();
                            }
                        }
                    }
                };
            });

            const allTasks = self.element.querySelectorAll('.task-name');
            inputBox.onkeyup = () => {
                taskList.innerHTML = '';
                allTasks.forEach(task => {
                    if (task.textContent.toLowerCase().indexOf(inputBox.value.toLowerCase()) == '-1') {
                        taskList.innerHTML += '';
                    } else {
                        taskList.innerHTML += task.parentElement.parentElement.outerHTML;
                    }
                });
                if (!taskList.innerHTML) self.element.querySelector('.task-manager-not-found').style.display = 'block';
                else self.element.querySelector('.task-manager-not-found').style.display = 'none';
            };

            switch (settings.taskManagerMode.toLowerCase()) {
                case 'light':
                    self.element.querySelectorAll('.task-list-item').forEach(taskListItem => {
                        taskListItem.style.backgroundColor = 'white';
                        taskListItem.style.color = '#8b8f97';
                        taskListItem.onmouseover = () => {
                            taskListItem.style.backgroundColor = '#ebebeb';
                        };
                        taskListItem.onmouseout = () => {
                            taskListItem.style.backgroundColor = 'white';
                        };
                    });
                    break;

                case 'dark':
                    self.element.querySelectorAll('.task-list-item').forEach(taskListItem => {
                        taskListItem.style.backgroundColor = '#262833';
                        taskListItem.style.color = '#36C7D0';
                        taskListItem.onmouseover = () => taskListItem.style.backgroundColor = '#363844';
                        taskListItem.onmouseout = () => taskListItem.style.backgroundColor = '#262833';
                    });
                    break;
            }
        }

        // Create Task Form Responsiveness
        function showTab(n): void {
            let tabs = self.element.querySelectorAll('.task-form-tab');
            tabs[n].style.display = 'block';
            self.element.querySelector('#task-prev').style.display = (n == 0) ? 'none' : 'inline';
            self.element.querySelector('#task-next').innerHTML = (n === (tabs.length - 1)) ? 'Submit' : 'Next';
            fixStepIndicator(n);
        }
        function nextPrev(n: any): boolean {
            const tabs = self.element.querySelectorAll('.task-form-tab');
            if (n == 1 && !validateFieldInput()) return false;
            tabs[self.currentTab].style.display = 'none';
            self.currentTab += n;
            if (self.currentTab >= tabs.length) {
                createTaskForm.querySelector('#task-submit').click();
                self.currentTab = 0;
            }
            showTab(self.currentTab);
        }
        function validateFieldInput(): boolean {
            let valid = true;
            const tabs = self.element.querySelectorAll('.task-form-tab');
            const taskFields = tabs[self.currentTab].querySelectorAll('.create-input');
            const steps = self.element.querySelectorAll('.task-step');
            for (let i = 0; i < taskFields.length; i++) {
                if (!taskFields[i].value) {
                    taskFields[i].classList.add('invalid-field');
                    valid = false;
                }
            }
            if (valid) steps[self.currentTab].classList.add('finish-page');
            return valid;
        }
        function fixStepIndicator(n) {
            let steps = self.element.querySelectorAll('.task-step');
            for (let i = 0; i < steps.length; i++)
                steps[i].className = steps[i].className.replace(' active-page', '');
            steps[n].classList.add('active-page');
        }
    }

    public setUpPaneContent(params) {
        let key = params.element.dataset.key;//create a key variable and set it to the webpart key
        this.element = params.element;//define the declared element to the draft dom content
        const { givenTaskArray } = JSON.parse(params.element.dataset.settings);
        this.paneContent = this.createElement({
            element: 'div', attributes: { class: 'crater-property-content' }
        }).monitor(); //monitor the content pane 
        if (this.sharePoint.attributes.pane.content[key].draft.pane.content.length !== 0) {//check if draft pane content is not empty and set it to the pane content
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].draft.pane.content;
        }
        else if (this.sharePoint.attributes.pane.content[key].content.length !== 0) {
            this.paneContent.innerHTML = this.sharePoint.attributes.pane.content[key].content;
        } else {
            this.paneContent.makeElement({
                element: 'div', children: [
                    this.createElement(
                        { element: 'button', attributes: { class: 'btn new-component', style: { display: 'inline-block', borderRadius: '5px' } }, text: 'Add New' }
                    )
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'task-manager-layout-pane card' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            { element: 'h2', attributes: { class: 'title' }, text: 'Layout Settings' }
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [//create the cells for changing crater event title
                            this.cell({
                                element: 'input', name: 'height', value: this.element.querySelector('.task-list-container').css()['max-height']
                            }),
                            this.cell({
                                element: 'select', name: 'mode', options: ['Light', 'Dark']
                            })
                        ]
                    })
                ]
            });

            this.paneContent.makeElement({
                element: 'div', attributes: { class: 'task-header-pane card' }, children: [
                    this.createElement({
                        element: 'div', attributes: { class: 'card-title' }, children: [
                            { element: 'h2', attributes: { class: 'title' }, text: 'Task Manager Header Layout' }
                        ]
                    }),
                    this.createElement({
                        element: 'div', attributes: { class: 'row' }, children: [//create the cells for changing crater event title
                            this.cell({
                                element: 'i', name: 'icon', edit: 'upload-icon', dataAttributes: { class: `crater-icon`, 'data-icon': this.element.querySelector('.crater-tm-header-icon').dataset.icon }
                            }),
                            this.cell({
                                element: 'input', name: 'title', value: this.element.find('.crater-tm-header-text').textContent
                            }),
                            this.cell({
                                element: 'input', name: 'backgroundcolor', dataAttributes: { type: 'color' }, value: this.element.find('.crater-tm-header').css()['background-color'], list: this.func.colors
                            }),
                            this.cell({
                                element: 'input', name: 'color', dataAttributes: { type: 'color' }, value: this.element.find('.crater-tm-header').css().color, list: this.func.colors
                            })
                        ]
                    })
                ]
            });
        }
        return this.paneContent;
    }

    public generatePaneContent(params) {
        const taskListPane = this.createElement({
            element: 'div', attributes: { class: 'card tasklist-pane' }, children: [
                this.createElement({
                    element: 'div', attributes: { class: 'card-title' }, children: [
                        this.createElement({
                            element: 'h2', attributes: { class: 'title' }, text: 'Tasks'
                        })
                    ]
                }),
            ]
        });

        for (let i = 0; i < params.list.length; i++) {
            taskListPane.makeElement({
                element: 'div',
                attributes: { class: 'crater-tasklist-item-pane row' },
                children: [
                    this.paneOptions({ options: ['D'], owner: 'task-list-item' }),
                    this.cell({
                        element: 'input', name: 'title', value: params.list[i].title
                    }),
                    this.cell({
                        element: 'input', name: 'assigner', value: params.list[i].assigner
                    }),
                    this.cell({
                        element: 'input', name: 'assignee', value: params.list[i].assignee
                    }),
                    this.cell({
                        element: 'input', name: 'description', value: params.list[i].description
                    }),
                    this.cell({
                        element: 'input', name: 'startdate', dataAttributes: { type: 'date' }, value: params.list[i].startDate
                    }),
                    this.cell({
                        element: 'input', name: 'duedate', dataAttributes: { type: 'date' }, value: params.list[i].dueDate
                    }),
                    this.cell({
                        element: 'select', name: 'status', options: ['Started', 'Not Started', 'In Progress', 'Completed', 'Suspended', 'Waiting On Someone', 'Deferred'], value: params.list[i].status
                    })
                ]
            });
        }

        return taskListPane;

    }

    public listenPaneContent(params) {
        this.element = params.element;
        this.key = this.element.dataset['key'];
        this.paneContent = this.sharePoint.app.find('.crater-property-content').monitor();
        const draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
        const taskHeaderPane = this.paneContent.querySelector('.task-header-pane');
        const tmLayoutPane = this.paneContent.querySelector('.task-manager-layout-pane');
        let settings = JSON.parse(params.element.dataset.settings);
        const { taskManager } = settings;

        if (this.paneContent.querySelector('.tasklist-pane')) this.paneContent.querySelector('.tasklist-pane').remove();
        this.paneContent.append(this.generatePaneContent({ list: taskManager }));

        let taskListHandler = (taskRowPane, taskRowDom, position?) => {
            taskRowPane.addEventListener('mouseover', event => {
                taskRowPane.find('.crater-content-options').css({ visibility: 'visible' });
            });

            taskRowPane.addEventListener('mouseout', event => {
                taskRowPane.find('.crater-content-options').css({ visibility: 'hidden' });
            });

            // get the values of the newly created row on the property - pane
            taskRowPane.querySelector('#title-cell').onchange = () => {
                taskRowDom.title = taskRowPane.querySelector('#title-cell').value;
                taskRowPane.querySelector('#title-cell').setAttribute('value', taskRowPane.querySelector('#title-cell').value);
            };

            taskRowPane.querySelector('#assigner-cell').onchange = () => {
                taskRowDom.assigner = taskRowPane.querySelector('#assigner-cell').value;
                taskRowPane.querySelector('#assigner-cell').setAttribute('value', taskRowPane.querySelector('#assigner-cell').value);
            };

            taskRowPane.querySelector('#assignee-cell').onchange = () => {
                taskRowDom.assignee = taskRowPane.querySelector('#assignee-cell').value;
                taskRowPane.querySelector('#assignee-cell').setAttribute('value', taskRowPane.querySelector('#assignee-cell').value);
            };

            taskRowPane.querySelector('#description-cell').onchange = () => {
                taskRowDom.description = taskRowPane.querySelector('#description-cell').value;
                taskRowPane.querySelector('#description-cell').setAttribute('value', taskRowPane.querySelector('#description-cell').value);
            };

            taskRowPane.querySelector('#startdate-cell').onchange = () => {
                taskRowDom.startDate = taskRowPane.querySelector('#startdate-cell').value;
                taskRowPane.querySelector('#startdate-cell').setAttribute('value', taskRowPane.querySelector('#startdate-cell').value);
            };

            taskRowPane.querySelector('#duedate-cell').onchange = () => {
                taskRowDom.dueDate = taskRowPane.querySelector('#duedate-cell').value;
                taskRowPane.querySelector('#duedate-cell').setAttribute('value', taskRowPane.querySelector('#duedate-cell').value);
            };

            taskRowPane.querySelector('#status-cell').onchange = () => {
                taskRowDom.status = taskRowPane.querySelector('#status-cell').value;
                taskRowPane.querySelector('#status-cell').setAttribute('value', taskRowPane.querySelector('#status-cell').value);
            };

            taskRowPane.find('.delete-task-list-item').addEventListener('click', event => {
                taskManager.splice(position, 1);
                taskRowPane.remove();
            });
        };

        this.paneContent.find('.new-component').addEventListener('click', event => {
            const newDateRowDom = {
                id: taskManager.length + 1,
                title: 'Sample',
                assigner: 'Not given',
                assignee: 'Chukwuma Marcel',
                description: 'This is a sample description',
                startDate: '05/12/2020',
                dueDate: '05/13/2020',
                status: 'In Progress',
                alter: 'In Progress'
            };
            let newDateRowPane = this.createElement({
                element: 'div',
                attributes: { class: 'crater-tasklist-item-pane row' },
                children: [
                    this.paneOptions({ options: ['D'], owner: 'task-list-item' }),
                    this.cell({
                        element: 'input', name: 'title', value: newDateRowDom.title
                    }),
                    this.cell({
                        element: 'input', name: 'assigner', value: newDateRowDom.assigner
                    }),
                    this.cell({
                        element: 'input', name: 'assignee', value: newDateRowDom.assignee
                    }),
                    this.cell({
                        element: 'input', name: 'description', value: newDateRowDom.description
                    }),
                    this.cell({
                        element: 'input', name: 'startdate', dataAttributes: { type: 'date' }, value: newDateRowDom.startDate
                    }),
                    this.cell({
                        element: 'input', name: 'duedate', dataAttributes: { type: 'date' }, value: newDateRowDom.dueDate
                    }),
                    this.cell({
                        element: 'select', name: 'status', options: ['Started', 'Not Started', 'In Progress', 'Completed', 'Suspended', 'Waiting On Someone', 'Deferred'], value: newDateRowDom.status
                    })
                ]
            });

            taskManager.push(newDateRowDom);
            this.paneContent.find('.tasklist-pane').append(newDateRowPane);
            taskListHandler(newDateRowPane, newDateRowDom);
        });

        let paneItems = this.paneContent.findAll('.crater-tasklist-item-pane');
        paneItems.forEach((taskRow, position) => {
            taskListHandler(taskRow, taskManager[position], position);
        });

        taskHeaderPane.querySelector('#icon-cell').checkChanges(() => {
            draftDom.find('.crater-tm-header-icon').removeClasses(draftDom.find('.crater-tm-header-icon').dataset.icon);
            draftDom.find('.crater-tm-header-icon').addClasses(taskHeaderPane.find('#icon-cell').dataset.icon);
            draftDom.find('.crater-tm-header-icon').dataset.icon = taskHeaderPane.find('#icon-cell').dataset.icon;
        });

        taskHeaderPane.querySelector('#title-cell').onchange = () => {
            draftDom.querySelector('.crater-tm-header-text').textContent = taskHeaderPane.querySelector('#title-cell').value;
        };

        taskHeaderPane.querySelector('#backgroundcolor-cell').onchange = () => {
            draftDom.querySelector('.crater-tm-header').style.backgroundColor = taskHeaderPane.querySelector('#backgroundcolor-cell').value;
            taskHeaderPane.querySelector('#backgroundcolor-cell').setAttribute('value', taskHeaderPane.querySelector('#backgroundcolor-cell').value);
        };

        taskHeaderPane.querySelector('#color-cell').onchange = () => {
            draftDom.querySelector('.crater-tm-header-text').style.color = taskHeaderPane.querySelector('#color-cell').value;
            taskHeaderPane.querySelector('#color-cell').setAttribute('value', taskHeaderPane.querySelector('#color-cell').value);
        };

        tmLayoutPane.querySelector('#mode-cell').value = settings.taskManagerMode;
        tmLayoutPane.querySelector('#mode-cell').onchange = () => {
            settings.taskManagerMode = tmLayoutPane.querySelector('#mode-cell').value;
        };

        tmLayoutPane.querySelector('#height-cell').onchange = () => {
            draftDom.querySelector('.task-list-container').css({
                maxHeight: tmLayoutPane.querySelector('#height-cell').value
            });
            tmLayoutPane.querySelector('#height-cell').setAttribute('value', tmLayoutPane.querySelector('#height-cell').value);
        };

        this.paneContent.addEventListener('mutated', event => {
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.html = this.sharePoint.attributes.pane.content[this.key].draft.dom.outerHTML;
        });

        this.paneContent.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
            this.element.innerHTML = draftDom.innerHTML;//upate the webpart
            this.element.css(draftDom.css());
            this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;

            this.sharePoint.saveSettings(this.element, settings);
        });
    }

    public update(params) {
        this.element = params.element;
        this.key = this.element.dataset['key'];
        let draftDom = this.sharePoint.attributes.pane.content[this.key].draft.dom;
        let settings = JSON.parse(params.element.dataset.settings);
        this.paneContent = this.setUpPaneContent(params);

        let paneConnection = this.sharePoint.app.find('.crater-property-connection');

        let updateWindow = this.createForm({
            title: 'Setup Meta Data', attributes: { id: 'meta-data-form', class: 'form' },
            contents: {
                title: { element: 'select', attributes: { id: 'meta-data-title', name: 'title' }, options: params.options },
                assigner: { element: 'select', attributes: { id: 'meta-data-assigner', name: 'assigner' }, options: params.options },
                assignee: { element: 'select', attributes: { id: 'meta-data-assignee', name: 'assignee' }, options: params.options },
                description: { element: 'select', attributes: { id: 'meta-data-description', name: 'description' }, options: params.options },
                startDate: { element: 'select', attributes: { id: 'meta-data-startdate', name: 'startdate' }, options: params.options },
                dueDate: { element: 'select', attributes: { id: 'meta-data-duedate', name: 'duedate' }, options: params.options },
                status: { element: 'select', attributes: { id: 'meta-data-status', name: 'status' }, options: params.options },
                alter: { element: 'select', attributes: { id: 'meta-data-alter', name: 'alter' }, options: params.options }
            },
            buttons: {
                submit: { element: 'button', attributes: { id: 'update-element', class: 'btn' }, text: 'Update' },
            }
        });

        let data: any = {};
        let source: any;
        updateWindow.find('#update-element').addEventListener('click', event => {
            event.preventDefault();

            data.title = updateWindow.find('#meta-data-title').value;
            data.assigner = updateWindow.find('#meta-data-assigner').value;
            data.assignee = updateWindow.find('#meta-data-assignee').value;
            data.description = updateWindow.find('#meta-data-description').value;
            data.startDate = updateWindow.find('#meta-data-startdate').value;
            data.dueDate = updateWindow.find('#meta-data-duedate').value;
            data.status = updateWindow.find('#meta-data-status').value;
            data.alter = updateWindow.find('#meta-data-alter').value;
            source = this.func.extractFromJsonArray(data, params.source);
            settings.taskManager = source;
            this.rendered({});
            this.sharePoint.attributes.pane.content[this.key].draft.html = draftDom.outerHTML;
            this.sharePoint.attributes.pane.content[this.key].draft.pane.content = this.paneContent.innerHTML;
        });


        if (!this.func.isnull(paneConnection)) {
            paneConnection.getParents('.crater-edit-window').find('#crater-editor-save').addEventListener('click', event => {
                this.element.innerHTML = draftDom.innerHTML;

                this.element.css(draftDom.css());

                this.sharePoint.attributes.pane.content[this.key].content = this.paneContent.innerHTML;//update webpart

                this.sharePoint.saveSettings(this.element, settings);
            });
        }

        return updateWindow;
    }
}
