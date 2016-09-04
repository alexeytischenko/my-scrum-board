System.register(['@angular/core', './projects.service'], function(exports_1, context_1) {
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
    var core_1, projects_service_1;
    var TasksListService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            }],
        execute: function() {
            // import { Task } from './task.class';
            TasksListService = (function () {
                function TasksListService(projectsService) {
                    this.projectsService = projectsService;
                    this.errorHandler = function (error) { return console.error('TaskService error', error); };
                    this.tasks = [];
                    this.sprintLength = 0;
                    this.backLogLength = 0;
                }
                TasksListService.prototype.getBackLog = function (url) {
                    var self = this;
                    var tasksRef = firebase.database().ref(url + "/backlog/");
                    tasksRef.off();
                    return new Promise(function (resolve, reject) {
                        tasksRef.once('value', function (snapshot) {
                            self.tasks = self.convert(snapshot.val());
                            self.calculateSize();
                            console.log("tasks", self.tasks);
                            resolve(true);
                        });
                    });
                };
                TasksListService.prototype.convert = function (objectedResponse) {
                    var _this = this;
                    return Object.keys(objectedResponse)
                        .map(function (id) { return ({
                        id: id,
                        name: objectedResponse[id].name,
                        project: _this.projectsService.getSName(objectedResponse[id].project),
                        project_color: _this.projectsService.getColor(objectedResponse[id].project),
                        sortnum: objectedResponse[id].sortnum,
                        estimate: objectedResponse[id].estimate,
                        status: objectedResponse[id].status,
                        type: objectedResponse[id].type
                    }); });
                    // .sort((a, b) => a.name.localeCompare(b.name));
                };
                TasksListService.prototype.calculateSize = function () {
                    var _this = this;
                    if (this.tasks && this.tasks.length > 0) {
                        this.tasks.forEach(function (element) {
                            if (element.type == "s")
                                _this.sprintLength++;
                            else
                                _this.backLogLength++;
                        });
                    }
                };
                TasksListService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [projects_service_1.ProjectsService])
                ], TasksListService);
                return TasksListService;
            }());
            exports_1("TasksListService", TasksListService);
        }
    }
});
