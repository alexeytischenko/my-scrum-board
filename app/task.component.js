System.register(["@angular/core", "@angular/router", "./task.service", "./comments-list.component", "./work-log.component", "./attachments.component", "./projects.service", "./project.class"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, core_2, router_1, task_service_1, comments_list_component_1, work_log_component_1, attachments_component_1, projects_service_1, project_class_1, TaskComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (comments_list_component_1_1) {
                comments_list_component_1 = comments_list_component_1_1;
            },
            function (work_log_component_1_1) {
                work_log_component_1 = work_log_component_1_1;
            },
            function (attachments_component_1_1) {
                attachments_component_1 = attachments_component_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }
        ],
        execute: function () {
            TaskComponent = (function () {
                function TaskComponent(route, taskService, projectsService, router) {
                    var _this = this;
                    this.route = route;
                    this.taskService = taskService;
                    this.projectsService = projectsService;
                    this.router = router;
                    this.openComments = false;
                    this.openLog = false;
                    this.userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
                    // loads task data
                    console.info("TaskComponent:constructor");
                    this.taskService.errorHandler = function (error) {
                        console.error('Task component error! ' + error);
                        window.alert('An error occurred while processing this page! Try again later.');
                    };
                    this.task = {};
                    this.parentTask = {};
                    this.project = new project_class_1.Project();
                    this.taskStatuses = this.taskService.taskSatuses;
                    //load projects if ness
                    if (this.projectsService.projects && this.projectsService.projects.length > 0) {
                        console.info('TaskComponent->projectsService -- projects already loaded');
                    }
                    else
                        this.projectsService.loadProjects(this.userId);
                    this.paramsSubscription = this.route.params.subscribe(function (params) {
                        progress_start("");
                        _this.taskId = params['tasktId'];
                        _this.taskService.getTask(_this.userId, _this.taskId)
                            .then(function () {
                            _this.openComments = _this.taskService.ifOpenComments(_this.taskId);
                            _this.openLog = _this.taskService.ifOpenLogs(_this.taskId);
                            _this.parentTask = {}; //have to place it here to reinit after 'jump to parent' clicked
                            _this.task = _this.taskService.task;
                            _this.project = _this.projectsService.getProject(_this.task.project);
                            //force open comments               
                            if (_this.openComments) {
                                _this.clc.loadComments();
                            }
                            //force open logs               
                            if (_this.openLog) {
                                _this.wlc.loadRecords();
                            }
                            // load parent task info if ness
                            if (_this.task.type == "i" && _this.task.parent && _this.task.parent.length > 0) {
                                _this.taskService.getAnyTask(_this.userId, _this.task.parent)
                                    .then(function (parent) {
                                    _this.parentTask = parent;
                                });
                            }
                            console.info("task loaded", _this.task);
                        })
                            .catch(function (error) { return _this.taskService.errorHandler(error); })
                            .then(function () { return progress_end(); });
                    });
                }
                TaskComponent.prototype.changeTaskStatus = function (status) {
                    var _this = this;
                    //task resolve from drop-down menu
                    console.info("TaskComponent:changeTaskStatus(status: string)", status);
                    progress_start("red");
                    this.task.status = status;
                    this.task.updated = Date.now();
                    this.taskService.saveTask(this.userId, this.task)
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () { return progress_end(); });
                };
                TaskComponent.prototype.updateTaskAttachments = function (val) {
                    // updates task attachments after attachment update
                    console.info("TaskComponent:updateTaskAttachments($event)", val);
                    //update attachments array
                    this.task.attachments = val;
                };
                TaskComponent.prototype.updateTaskCommentsCounts = function (val) {
                    var _this = this;
                    // updates comments count if ness
                    console.info("TaskComponent:updateTaskCommentsCounts($event)", val);
                    if (this.task.commentsNum == val)
                        return false; // no need to update
                    this.task.commentsNum = val;
                    this.taskService.savePropery(this.userId, this.task.id, { "commentsNum": val })
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        _this.openComments = true; //open comments list  
                    });
                };
                TaskComponent.prototype.updateTaskLogsCounts = function (val) {
                    var _this = this;
                    // updates recoreds count if ness
                    console.info("TaskComponent:updateTaskLogsCounts($event)", val);
                    if (this.task.worked == val)
                        return false; // no need to update
                    this.task.worked = val;
                    this.taskService.savePropery(this.userId, this.task.id, { "worked": val })
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        _this.openLog = true; //open worklog list  
                    });
                    if (this.parentTask.id && this.parentTask.id.length > 0) {
                        //update subtasks/this.task.id/worked node in parent task 
                        this.taskService.savePropery(this.userId, this.parentTask.id + "/subtasks/" + this.task.id, { "worked": val });
                    }
                };
                TaskComponent.prototype.deleteTask = function () {
                    var _this = this;
                    //delete task from drop-down menu
                    console.info("TaskComponent:deleteTask()");
                    $('#delModal').modal("hide"); //dismiss alert window
                    progress_start("red"); //start red progress
                    this.taskService.removeTask(this.userId, this.task.id)
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        progress_end();
                        setTimeout(function () { return _this.router.navigateByUrl('/tasks'); }, 1000); //document.location.href= "/tasks"
                    });
                };
                TaskComponent.prototype.toggleComments = function () {
                    // open/close comments list 
                    console.info("TaskComponent:toggleComments()");
                    this.openComments = (this.openComments) ? false : true;
                    if (this.openComments) {
                        this.taskService.addToOpenComments(this.taskId);
                        this.clc.loadComments(true);
                    }
                    else
                        this.taskService.removeFromOpenComments(this.taskId);
                };
                TaskComponent.prototype.toggleLogs = function () {
                    // open/close logs list 
                    console.info("TaskComponent:toggleLogs()");
                    this.openLog = (this.openLog) ? false : true;
                    if (this.openLog) {
                        this.taskService.addToOpenLogs(this.taskId);
                        this.wlc.loadRecords(true);
                    }
                    else
                        this.taskService.removeFromOpenLogs(this.taskId);
                };
                TaskComponent.prototype.fixEstimate = function (newEstimate) {
                    //update task.estimate
                    this.taskService.savePropery(this.userId, this.task.id, { "estimate": newEstimate });
                    this.task.estimate = newEstimate;
                };
                TaskComponent.prototype.isWrongEstimate = function (worked, estimate) {
                    // return true if worked houres amount is greater then estimate
                    if (worked && estimate && worked > estimate)
                        return true;
                    return false;
                };
                TaskComponent.prototype.needToCorrectEstimate = function () {
                    //show offer to recalc Estimate
                    if (this.task.estimate < this.subTasksTotalEstimate)
                        return true;
                    return false;
                };
                Object.defineProperty(TaskComponent.prototype, "subTasksTotalEstimate", {
                    get: function () {
                        var estimate = 0;
                        if (this.task.subtasks && this.task.subtasks.length > 0) {
                            this.task.subtasks.forEach(function (element) {
                                estimate += element.estimate;
                            });
                        }
                        return estimate;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TaskComponent.prototype, "taskCurrentStatus", {
                    get: function () {
                        return this.task.status ? this.task.status : '';
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskComponent.prototype.ngOnInit = function () {
                    console.info("TaskComponent:ngOnInit");
                };
                TaskComponent.prototype.ngOnDestroy = function () {
                    console.info("TaskComponent:ngOnDestroy()");
                    this.paramsSubscription.unsubscribe();
                };
                return TaskComponent;
            }());
            __decorate([
                core_2.ViewChild(comments_list_component_1.CommentsListComponent),
                __metadata("design:type", comments_list_component_1.CommentsListComponent)
            ], TaskComponent.prototype, "clc", void 0);
            __decorate([
                core_2.ViewChild(work_log_component_1.WorkLogComponent),
                __metadata("design:type", work_log_component_1.WorkLogComponent)
            ], TaskComponent.prototype, "wlc", void 0);
            __decorate([
                core_2.ViewChild(attachments_component_1.AttachmentsComponent),
                __metadata("design:type", attachments_component_1.AttachmentsComponent)
            ], TaskComponent.prototype, "atc", void 0);
            TaskComponent = __decorate([
                core_1.Component({
                    selector: 'task-panel',
                    template: "\n  <div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n          <div class=\"pull-right\">\n            <a *ngIf = \"parentTask.id && parentTask.id.length > 0\" [routerLink]=\"['/tasks/'+ parentTask.id]\" class=\"btn btn-default btn-sm\">\n                <span class=\"glyphicon glyphicon-link\"></span>\n                <span class=\"hidden-xs\">Jump to parent</span>\n            </a>\n            <a [routerLink]=\"['/']\" class=\"btn btn-default btn-sm\">\n              <span class=\"glyphicon glyphicon-chevron-left\"></span>\n              <span class=\"hidden-xs\">Back</span>\n            </a>\n            <span class=\"dropdown\">\n              <button class=\"btn btn-default dropdown-toggle btn-sm\" type=\"button\" data-toggle=\"dropdown\">...</button>\n              <ul class=\"dropdown-menu dropdown-menu-right\">\n                <li *ngIf=\"taskCurrentStatus=='idle'\"><a href=\"javascript:void(0);\" (click)=\"changeTaskStatus('in progress')\">Start</a></li>\n                <li *ngIf=\"taskCurrentStatus!='resolved'\"><a href=\"javascript:void(0);\" (click)=\"changeTaskStatus('resolved')\">Resolve</a></li>\n                <li *ngIf=\"taskCurrentStatus=='resolved'\"><a href=\"javascript:void(0);\" (click)=\"changeTaskStatus('in progress')\">Reopen task</a></li>\n                <li><a href=\"javascript:void(0);\" onClick=\"$('#delModal').modal();\">Delete task</a></li>\n                \n                <li class=\"divider\"></li>\n                <li><a href=\"javascript:void(0);\" (click)=\"atc.setEditorField(-1)\">Add attachment</a></li>\n                <li><a href=\"javascript:void(0);\" (click)=\"clc.setEditorField(-1)\">Add comment</a></li>\n                <li *ngIf=\"task.type!='i'\"><a [routerLink]=\"['/tasks/edit/'+ taskId +'/-1']\">Add subtask</a></li>\n                <li><a href=\"javascript:void(0);\" (click)=\"wlc.setEditorField(-1)\">Log work</a></li>\n              </ul>\n            </span>\n            <a [routerLink]=\"['/tasks/edit/'+ taskId]\" class=\"btn btn-default btn-sm\">\n              <span class=\"glyphicon glyphicon-pencil\"></span>\n              <span class=\"hidden-xs\">Edit</span>\n            </a>      \n        </div>\n        <div class=\"form-inline\">               \n                <label>{{task.name}}</label> \n                <span class=\"label label-{{project.color}}\">{{project.sname}} - {{task.code}}</span>          \n        </div>\n  </div>\n    <div class=\"panel-body\">\n\n        <div *ngIf = \"parentTask.id && parentTask.id.length > 0\" class=\"panel pull-right panel-default panel-sm\" style=\"max-width:50%\">\n          <div class=\"panel-body\">\n            <label>Parent task:</label>\n            {{parentTask.name}}\n          </div>\n        </div> \n\n        <div class=\"panel-body\">\n            <div>\n              <label>Estimate</label>\n              <span>{{task.estimate ? task.estimate : '0'}}</span>h / worked: {{task.worked ? task.worked : '0'}}h\n            </div>\n            <div>\n                <label>Project</label>\n                {{project.name}}\n            </div> \n            <div>\n              <label>Status</label>\n              <span class=\"label\" \n                  [class.label-primary]=\"task.status==='in progress'\" \n                  [class.label-success]=\"task.status==='resolved'\" \n                  [class.label-info]=\"task.status==='review'\"\n                  [class.label-default]=\"task.status==='idle'\"\n                  [class.label-danger]=\"task.status==='skipped'\"\n                  >\n                    {{task.status}}\n              </span>\n            </div>  \n        </div>      \n        <div class=\"panel-body\">         \n          <div>\n            <label>Created</label>\n            {{task.created | date:'medium'}}\n          </div>\n          <div>\n            <label>Modified</label>\n            {{task.updated | date:'medium'}}\n          </div>\n        </div>\n        \n        <div class=\"panel-body\">\n          <label>Description</label> \n          <div style=\"white-space: pre-line;\">{{task.description}}</div>\n        </div>\n\n        <div class=\"panel-body\">\n          <div class=\"pull-right\">\n            <button class=\"btn btn-default\" (click)=\"atc.setEditorField(-1)\">\n              <span class=\"glyphicon glyphicon-paperclip\"></span>\n              <span class=\"hidden-xs\">Add file</span>\n            </button>\n          </div>\n          <div>\n            <label>Attachments</label>\n            <span *ngIf=\"task.attachments && task.attachments.length > 0\" class=\"commentsToggle\">\n                ({{task.attachments.length}}) \n            </span> \n            <p *ngIf=\"!task.attachments || task.attachments.length == 0\" class=\"norecords\">There are no attachments</p>\n            <attachments *ngIf=\"task.attachments\" (setAttachments) = \"updateTaskAttachments($event)\" [taskId]=\"taskId\" [attachments]=\"task.attachments\"></attachments>\n          </div>\n        </div>\n        <div class=\"panel-body\">\n          <div class=\"pull-right\">\n            <button class=\"btn btn-default\" (click)=\"clc.setEditorField(-1)\">\n              <span class=\"glyphicon glyphicon-comment\"></span>\n              <span class=\"hidden-xs\">Add comment</span>\n            </button>\n          </div>\n          <div>\n            <label>Comments</label> \n            <span *ngIf=\"task.commentsNum > 0\" class=\"commentsToggle\">\n                ({{task.commentsNum}}) \n                <div (click)=\"toggleComments()\" [class]=\"openComments ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'\"></div>\n                <div *ngIf=\"openComments\" (click)=\"clc.loadComments(true)\" class=\"glyphicon glyphicon-repeat\" alt=\"reload\" title=\"reload\"></div>\n            </span> \n            <p *ngIf=\"!task.commentsNum || task.commentsNum == 0\" class=\"norecords\">There are no comments</p>\n            <comments (setCount) = \"updateTaskCommentsCounts($event)\" [openComments]=\"openComments\" [taskId]=\"taskId\"></comments>\n          </div>       \n      </div>\n      <div class=\"panel-body\" *ngIf=\"task.type != 'i'\">\n          <div class=\"pull-right\">\n            <a class=\"btn btn-default\" [routerLink]=\"['/tasks/edit/'+ taskId +'/-1']\">\n              <span class=\"glyphicon glyphicon-tasks\"></span>\n              <span class=\"hidden-xs\">Add subtask</span>\n            </a>\n          </div>\n          <div>\n            <label>Subtasks</label> \n            <span *ngIf=\"task.subtasks && task.subtasks.length > 0\">\n                ({{task.subtasks.length}}) \n                <div class=\"total_estimate\">total estimate : {{subTasksTotalEstimate}}h</div>\n                <div *ngIf=\"needToCorrectEstimate()\" class=\"estimate_recalc\">\n                  exceeds parent task estimate  \n                  <button class=\"btn btn-warning btn-xs\" (click)=\"fixEstimate(subTasksTotalEstimate)\">\n                    <span class=\"glyphicon glyphicon-alert\"></span>\n                    <span class=\"hidden-xs\">Fix it</span>\n                  </button>\n                </div>\n            </span> \n            \n            <p *ngIf=\"!task.subtasks || task.subtasks.length == 0\" class=\"norecords\">There are no subtasks</p>\n            <div class=\"list-group subtasks-group\">\n              <a *ngFor = \"let st of task.subtasks\" [routerLink]=\"['/tasks/'+ st.id]\" class=\"list-group-item\" [class.resolved]=\"st.status==='resolved'\">\n                {{st.name}}\n                <span class=\"badge hidden-xs {{(isWrongEstimate(st.worked, st.estimate)) ? 'overworked' : ''}}\"> {{st.worked ? st.worked : '0'}}h / {{st.estimate ? st.estimate : '0'}}h </span>\n              </a>\n            </div>\n          </div>       \n      </div>\n      <div class=\"panel-body\">\n          <div class=\"pull-right\">\n            <button class=\"btn btn-default\" (click)=\"wlc.setEditorField(-1)\">\n              <span class=\"glyphicon glyphicon-time\"></span>\n              <span class=\"hidden-xs\">Log work</span>\n            </button>\n          </div>\n          <div>\n            <label>Worklogs</label>\n            <span *ngIf=\"task.worked > 0\" class=\"commentsToggle\">\n                ({{task.worked}}h)\n                <div (click)=\"toggleLogs()\" [class]=\"openLog ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'\"></div>\n                <div *ngIf=\"openLog\" (click)=\"wlc.loadRecords(true)\" class=\"glyphicon glyphicon-repeat\" alt=\"reload\" title=\"reload\"></div>\n            </span> \n            <p *ngIf=\"!task.worked || task.worked == 0\" class=\"norecords\">There are no worklogs</p>\n            <worklog (setCount) = \"updateTaskLogsCounts($event)\" [openLog]=\"openLog\" [taskId]=\"taskId\"></worklog>\n          </div>       \n      </div>\n  \n    </div>\n</div>\n\n  <!-- Modal Delete Popup -->\n  <div class=\"modal fade\" id=\"delModal\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n    \n      <!-- Modal content-->\n      <div class=\"modal-content\">\n        <div class=\"modal-header\" style=\"padding:25px 50px;\">\n          <h4 style=\"text-align: center;\"><span class=\"glyphicon glyphicon-fire\"></span> Delete the task?</h4>\n        </div>\n        <div class=\"modal-body\" style=\"padding:40px 50px;\">\n              <button class=\"btn btn-danger btn-block\" (click)=\"deleteTask()\"><span class=\"glyphicon glyphicon-trash\"></span> Delete</button>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"submit\" class=\"btn btn-success btn-default pull-left\" data-dismiss=\"modal\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</button>\n        </div>\n      </div>\n      \n    </div>\n  </div> \n\n  ",
                    styles: ["\n    a.resolved {text-decoration:line-through!important; color:#bbb!important;}\n    a.resolved:hover {color: #555!important;text-decoration:none!important;}\n    a.list-group-item {color: #337ab7; text-decoration: none;}\n    a.list-group-item:hover {color: #337ab7; text-decoration: none;}\n    .norecords {color: #999; font-style: italic}\n    .dropdown {padding-bottom: 10px;}\n    .modal-dialog {margin: 100px auto!important;}\n    .commentsToggle div {cursor: pointer; color: #999;}\n    .commentsToggle div:first-child {margin-left: 10px;}\n    .badge {background-color: #bbb;}\n    .subtasks-group {margin-top: 20px;}\n    .total_estimate {display: inline-block;margin-left: 10px; color: #999;}\n    .estimate_recalc {display: inline-block;margin-left: 10px; color: #999;}\n  "]
                }),
                __metadata("design:paramtypes", [router_1.ActivatedRoute,
                    task_service_1.TaskService,
                    projects_service_1.ProjectsService,
                    router_1.Router])
            ], TaskComponent);
            exports_1("TaskComponent", TaskComponent);
        }
    };
});
