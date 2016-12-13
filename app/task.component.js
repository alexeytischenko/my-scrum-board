System.register(['@angular/core', '@angular/router', './task.service', './comments-list.component', './projects.service', './project.class'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_2, router_1, task_service_1, comments_list_component_1, projects_service_1, project_class_1;
    var TaskComponent;
    return {
        setters:[
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
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }],
        execute: function() {
            TaskComponent = (function () {
                function TaskComponent(route, taskService, projectsService, router) {
                    var _this = this;
                    this.route = route;
                    this.taskService = taskService;
                    this.projectsService = projectsService;
                    this.router = router;
                    this.userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
                    console.info("TaskComponent:constructor");
                    this.taskService.errorHandler = function (error) {
                        console.error('Task component error! ' + error);
                        window.alert('An error occurred while processing this page! Try again later.');
                    };
                    this.task = {};
                    this.project = new project_class_1.Project();
                    this.taskStatuses = this.taskService.taskSatuses;
                    this.openComments = false;
                    this.editComment = 0;
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
                            _this.task = _this.taskService.task;
                            _this.project = _this.projectsService.getProject(_this.task.project);
                            console.info("task loaded", _this.task);
                        })
                            .catch(function (error) { return _this.taskService.errorHandler(error); })
                            .then(function () {
                            //finally
                            progress_end();
                        });
                    });
                }
                Object.defineProperty(TaskComponent.prototype, "diagnostic", {
                    get: function () {
                        return JSON.stringify(this.task);
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
                    // $(document).ready(function(){
                    //     $('[data-toggle="popover"]').popover();
                    // });
                };
                TaskComponent.prototype.resolveTask = function () {
                    var _this = this;
                    //task resolve from drop-down menu
                    console.info("TaskComponent:resolveTask()");
                    progress_start("red");
                    this.task.status = 'resolved';
                    this.task.updated = Date.now();
                    this.taskService.saveTask(this.userId, this.task)
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        //finally / default  
                        progress_end();
                    });
                };
                TaskComponent.prototype.reopenTask = function () {
                    var _this = this;
                    //task reopen from drop-down menu
                    console.info("TaskComponent:reopenTask()");
                    progress_start("red");
                    this.task.status = 'in progress';
                    this.task.updated = Date.now();
                    this.taskService.saveTask(this.userId, this.task)
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        //finally / default  
                        progress_end();
                    });
                };
                TaskComponent.prototype.updateTaskCommentsCounts = function (val) {
                    var _this = this;
                    console.info("TaskComponent:updateTaskCommentsCounts($event)", val);
                    this.task.commentsNum = val;
                    this.taskService.saveTask(this.userId, this.task)
                        .catch(function (error) { return _this.taskService.errorHandler(error); });
                    // .then(()=> {    
                    //   //finally / default  
                    // });
                };
                TaskComponent.prototype.deleteTask = function () {
                    var _this = this;
                    console.info("TaskComponent:deleteTask()");
                    //dismiss alert window
                    $('#delModal').modal("hide");
                    //start red progress
                    progress_start("red");
                    //service requesdt
                    this.taskService.removeTask(this.userId, this.task.id)
                        .catch(function (error) { return _this.taskService.errorHandler(error); })
                        .then(function () {
                        //finally / default  
                        progress_end();
                        setTimeout(function () { return document.location.href = "/tasks"; }, 1000);
                        //setTimeout(() => this.router.navigateByUrl('/tasks'), 1000);
                    });
                };
                TaskComponent.prototype.toggleComments = function () {
                    console.info("TaskComponent:toggleComments()");
                    this.openComments = (this.openComments) ? false : true;
                    if (this.openComments) {
                        this.clc.loadComments();
                    }
                };
                TaskComponent.prototype.ngOnDestroy = function () {
                    console.info("TaskComponent:ngOnDestroy()");
                    this.paramsSubscription.unsubscribe();
                };
                __decorate([
                    core_2.ViewChild(comments_list_component_1.CommentsListComponent), 
                    __metadata('design:type', comments_list_component_1.CommentsListComponent)
                ], TaskComponent.prototype, "clc", void 0);
                TaskComponent = __decorate([
                    core_1.Component({
                        selector: 'task-panel',
                        template: "\n  <div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n          <div style=\"float:right;\">\n            <a [routerLink]=\"['/']\" class=\"btn btn-default btn-sm\">\n              <span class=\"glyphicon glyphicon-chevron-left\"></span>\n              <span class=\"hidden-xs\">Back</span>\n            </a>\n            <span class=\"dropdown\">\n              <button class=\"btn btn-default dropdown-toggle btn-sm\" type=\"button\" data-toggle=\"dropdown\">...</button>\n              <ul class=\"dropdown-menu dropdown-menu-right\">\n                <li *ngIf=\"taskCurrentStatus!='resolved'\"><a href=\"javascript:void(0);\" (click)=\"resolveTask()\">Resolve</a></li>\n                <li *ngIf=\"taskCurrentStatus=='resolved'\"><a href=\"javascript:void(0);\" (click)=\"reopenTask()\">Reopen task</a></li>\n                <li><a href=\"javascript:void(0);\" onClick=\"$('#delModal').modal();\">Delete task</a></li>\n                <li class=\"divider\"></li>\n                <li><a href=\"javascript:void(0);\">Add comment</a></li>\n                <li><a href=\"javascript:void(0);\">Add attachment</a></li>\n                <li><a href=\"javascript:void(0);\">Log work</a></li>\n              </ul>\n            </span>\n            <a [routerLink]=\"['/tasks/edit/'+ taskId]\" class=\"btn btn-default btn-sm\">\n              <span class=\"glyphicon glyphicon-pencil\"></span>\n              <span class=\"hidden-xs\">Edit</span>\n            </a>      \n        </div>\n        <div class=\"form-inline\">               \n                <label>{{task.name}}</label> \n                <button class=\"btn btn-{{project.color}} btn-xs hidden-xs\" disabled=\"true\">{{project.sname}} - {{task.code}}</button>           \n        </div>\n  </div>\n    <div class=\"panel-body\">\n\n        <div class=\"panel-body\">\n            <div>\n              <label>Estimate</label>\n              <span>{{task.estimate ? task.estimate : '0'}}</span>h / 0h\n            </div>\n            <div>\n                <label>Project</label>\n                {{project.name}}\n            </div> \n            <div>\n              <label>Status</label>\n              <button class=\"btn btn-xs\" \n                  [class.btn-primary]=\"task.status==='in progress'\" \n                  [class.btn-success]=\"task.status==='resolved'\" \n                  [class.btn-info]=\"task.status==='review'\" \n                  disabled=\"true\">\n                    {{task.status}}\n              </button>\n            </div>  \n        </div>      \n        <div class=\"panel-body\">         \n          <div>\n            <label>Created</label>\n            {{task.created | date:'medium'}}\n          </div>\n          <div>\n            <label>Modified</label>\n            {{task.updated | date:'medium'}}\n          </div>\n        </div>\n        \n        <div class=\"panel-body\">\n          <label>Description</label> \n          <span>{{task.description}}</span>\n        </div>\n\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-file\"></span>\n              <span class=\"hidden-xs\">Add files</span>\n            </button>\n          </div>\n          <div>\n            <label>Attachments</label>\n            <p class=\"norecords\">There are no attachments</p>\n          </div>\n        </div>\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\" (click)=\"clc.setEditorField(-1)\">\n              <span class=\"glyphicon glyphicon-comment\"></span>\n              <span class=\"hidden-xs\">Add comment</span>\n            </button>\n          </div>\n          <div>\n            <label>Comments</label> \n            <span *ngIf=\"task.commentsNum > 0\" class=\"commentsToggle\">\n                ({{task.commentsNum}}) \n                <div (click)=\"toggleComments()\" [class]=\"openComments ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'\"></div>\n                <div *ngIf=\"openComments\" (click)=\"clc.loadComments()\" class=\"glyphicon glyphicon-repeat\" alt=\"reload\" title=\"reload\"></div>\n            </span> \n            <p *ngIf=\"!task.commentsNum || task.commentsNum == 0\" class=\"norecords\">There are no comments</p>\n            <add-edit-comment (setCount) = \"updateTaskCommentsCounts($event)\" [editComment]=\"editComment\" [openComments]=\"openComments\" [taskId]=\"taskId\"></add-edit-comment>\n          </div>       \n      </div>\n      <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-time\"></span>\n              <span class=\"hidden-xs\">Log work</span>\n            </button>\n          </div>\n          <div>\n            <label>Worklogs</label>\n            <p class=\"norecords\">There are no worklogs</p>\n          </div>       \n      </div>\n  \n    </div>\n</div>\n\n  <!-- Modal Delete Popup -->\n  <div class=\"modal fade\" id=\"delModal\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n    \n      <!-- Modal content-->\n      <div class=\"modal-content\">\n        <div class=\"modal-header\" style=\"padding:25px 50px;\">\n          <h4 style=\"text-align: center;\"><span class=\"glyphicon glyphicon-fire\"></span> Delete the task?</h4>\n        </div>\n        <div class=\"modal-body\" style=\"padding:40px 50px;\">\n              <button class=\"btn btn-danger btn-block\" (click)=\"deleteTask()\"><span class=\"glyphicon glyphicon-trash\"></span> Delete</button>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"submit\" class=\"btn btn-success btn-default pull-left\" data-dismiss=\"modal\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</button>\n        </div>\n      </div>\n      \n    </div>\n  </div> \n\n  ",
                        styles: ["\n    .norecords {color: #999; font-style: italic}\n    .dropdown {padding-bottom: 10px;}\n    .modal-dialog {margin: 100px auto!important;}\n    .commentsToggle div {cursor: pointer; color: #999;}\n    .commentsToggle div:first-child {margin-left: 10px;}\n  "]
                    }), 
                    __metadata('design:paramtypes', [router_1.ActivatedRoute, task_service_1.TaskService, projects_service_1.ProjectsService, router_1.Router])
                ], TaskComponent);
                return TaskComponent;
            }());
            exports_1("TaskComponent", TaskComponent);
        }
    }
});
