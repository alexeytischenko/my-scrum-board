System.register(['@angular/core', './projects.service', './project.class'], function(exports_1, context_1) {
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
    var core_1, projects_service_1, project_class_1;
    var TasksListService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }],
        execute: function() {
            TasksListService = (function () {
                function TasksListService(projectsService) {
                    this.projectsService = projectsService;
                    this.errorHandler = function (error) { return console.error('TaskListService error', error); };
                    this.tasks = [];
                    console.info("TasksListService:constructor");
                }
                TasksListService.prototype.getBackLog = function (url) {
                    console.info("TasksListService:getBackLog(url)", url);
                    var self = this;
                    var taskscount = 0;
                    var tasksRef = firebase.database().ref(url + "/backlog/");
                    tasksRef.off();
                    //retrun Promise to get the backLog
                    return new Promise(function (resolve, reject) {
                        tasksRef.orderByChild("sortnum").once('value')
                            .then(function (snapshot) {
                            snapshot.forEach(function (child) {
                                self.tasks[taskscount] = self.convertObject(child.val(), child.getKey());
                                taskscount++;
                            });
                            resolve(taskscount);
                        })
                            .catch(function (error) {
                            reject(error);
                        });
                    });
                };
                TasksListService.prototype.resortBackLog = function (url, jsonData) {
                    console.info("TasksListService:resortBackLog(url, jsonData)", url, jsonData);
                    var self = this;
                    var resolveCounter = jsonData.length;
                    //return Promise to record new tasks order
                    return new Promise(function (resolve, reject) {
                        for (var _i = 0, jsonData_1 = jsonData; _i < jsonData_1.length; _i++) {
                            var child = jsonData_1[_i];
                            //proceed if element is not empty
                            if (child.id && 0 !== child.id.length) {
                                //update FIREBASE
                                var ref = firebase.database().ref(url + "/backlog/" + child.id + "/");
                                ref.update({
                                    "sortnum": child.sortnum,
                                    "type": child.type
                                })
                                    .then(function () {
                                    //checking if it's time to call resolve : resolve only after last success callback
                                    resolveCounter--;
                                    if (resolveCounter <= 0)
                                        resolve(true);
                                })
                                    .catch(function (error) { return reject("Backlog sorting failed: {" + error + "}"); });
                            }
                            else {
                                resolveCounter--;
                                if (jsonData.length == 1)
                                    resolve(true); //if the only element is disable-section_header or just empty, then resolving immidiately
                            }
                        }
                    });
                };
                TasksListService.prototype.convertObject = function (objectedResponse, id) {
                    //creating/inflating Project object
                    var project = new project_class_1.Project();
                    project = this.projectsService.getProject(objectedResponse.project);
                    return {
                        id: id,
                        name: objectedResponse.name,
                        code: objectedResponse.code,
                        project: project.sname,
                        project_color: project.color,
                        sortnum: objectedResponse.sortnum,
                        estimate: objectedResponse.estimate,
                        worked: objectedResponse.worked,
                        status: objectedResponse.status,
                        type: objectedResponse.type
                    };
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
