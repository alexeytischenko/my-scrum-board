System.register(['@angular/core', '@angular/router', './task.service', './projects.service', './project.class'], function(exports_1, context_1) {
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
    var core_1, router_1, task_service_1, projects_service_1, project_class_1;
    var TaskComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }],
        execute: function() {
            TaskComponent = (function () {
                function TaskComponent(route, taskService, projectsService) {
                    this.route = route;
                    this.taskService = taskService;
                    this.projectsService = projectsService;
                    this.userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
                    this.clear = new core_1.EventEmitter();
                    this.save = new core_1.EventEmitter();
                    this.taskService.errorHandler = function (error) {
                        console.error('Task component error! ' + error);
                        window.alert('An error occurred while processing this page! Try again later.');
                    };
                    this.task = {};
                    this.project = new project_class_1.Project();
                    this.taskStatuses = this.taskService.taskSatuses;
                    //load projects if ness
                    if (this.projectsService.projects && this.projectsService.projects.length > 0) {
                        console.info('projects already loaded');
                    }
                    else
                        this.projectsService.loadProjects(this.userId);
                }
                Object.defineProperty(TaskComponent.prototype, "diagnostic", {
                    get: function () {
                        return JSON.stringify(this.task);
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var self = this;
                    this.paramsSubscription = this.route.params.subscribe(function (params) {
                        progress_start("");
                        _this.taskId = params['tasktId'];
                        _this.taskService.getTask("mSmxxvKkt4ei6nL80Krmt9R0m983", _this.taskId)
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
                    $(document).ready(function () {
                        $('[data-toggle="popover"]').popover();
                    });
                };
                TaskComponent.prototype.ngOnDestroy = function () {
                    this.paramsSubscription.unsubscribe();
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaskComponent.prototype, "clear", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaskComponent.prototype, "save", void 0);
                TaskComponent = __decorate([
                    core_1.Component({
                        selector: 'task-panel',
                        template: "\n    <div class=\"panel panel-primary\">\n      <div class=\"panel-body\">\n        <div style=\"float:right;\">\n            <a [routerLink]=\"['/']\" class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-chevron-left\"></span>\n              <span class=\"hidden-xs\">Back</span>\n            </a>\n            <span class=\"dropdown\">\n              <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">...</button>\n              <ul class=\"dropdown-menu\">\n                <li><a href=\"#\">Resolve / Reopen task</a></li>\n                <li><a href=\"#\">Move task to archive</a></li>\n                <li><a href=\"#\">Delete task</a></li>\n                <li class=\"divider\"></li>\n                <li><a href=\"#\">Add comment</a></li>\n                <li><a href=\"#\">Add attachment</a></li>\n                <li><a href=\"#\">Log work</a></li>\n              </ul>\n            </span>\n            <a [routerLink]=\"['/tasks/edit/'+ taskId]\" class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-pencil\"></span>\n              <span class=\"hidden-xs\">Edit</span>\n            </a>      \n            <a href=\"javascript:void(0);\" data-toggle=\"popover\" title=\"Help\" data-trigger=\"hover\" data-content=\"To edit the task click the Edit button\"><span class=\"glyphicon glyphicon-question-sign\"></span></a>\n        </div>\n        <div class=\"panel-body form-inline\">               \n                <label>{{task.name}}</label> \n                <button class=\"btn btn-{{project.color}} btn-xs hidden-xs\" disabled=\"true\">{{project.sname}} - {{task.code}}</button>           \n        </div>\n        <div class=\"panel-body\">\n            <div>\n              <label>Estimate</label>\n              <span>{{task.estimate}}</span> h / 0h\n            </div>\n            <div>\n                <label>Project</label>\n                {{project.name}}\n            </div> \n            <div>\n              <label>Status</label>\n              <button class=\"btn btn-xs\" \n                  [class.btn-primary]=\"task.status==='in progress'\" \n                  [class.btn-success]=\"task.status==='resolved'\" \n                  [class.btn-info]=\"task.status==='review'\" \n                  disabled=\"true\">\n                    {{task.status}}\n              </button>\n            </div>  \n        </div>      \n        <div class=\"panel-body\">         \n          <div>\n            <label>Created</label>\n            {{task.created | date:'medium'}}\n          </div>\n          <div>\n            <label>Modified</label>\n            {{task.updated | date:'medium'}}\n          </div>\n        </div>\n        \n        <div class=\"panel-body\">\n          <label>Description</label> \n          <span>{{task.description}}</span>\n        </div>\n\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-file\"></span>\n              <span class=\"hidden-xs\">Add files</span>\n            </button>\n          </div>\n          <div>\n            <label>Attachments</label>\n            <p class=\"norecords\">There are no attachments</p>\n          </div>\n        </div>\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-comment\"></span>\n              <span class=\"hidden-xs\">Add comment</span>\n            </button>\n          </div>\n          <div>\n            <label>Comments</label>\n            <p class=\"norecords\">There are no comments</p>\n          </div>       \n      </div>\n      <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-time\"></span>\n              <span class=\"hidden-xs\">Log work</span>\n            </button>\n          </div>\n          <div>\n            <label>Worklogs</label>\n            <p class=\"norecords\">There are no worklogs</p>\n          </div>       \n      </div>\n\n    </div>\n  ",
                        styles: ["\n    .norecords {color: #999; font-style: italic}\n    .dropdown {padding-bottom: 10px;}\n  "]
                    }), 
                    __metadata('design:paramtypes', [router_1.ActivatedRoute, task_service_1.TaskService, projects_service_1.ProjectsService])
                ], TaskComponent);
                return TaskComponent;
            }());
            exports_1("TaskComponent", TaskComponent);
        }
    }
});
