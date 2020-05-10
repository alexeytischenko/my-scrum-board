System.register(["@angular/core", "./projects.service", "./project.class"], function (exports_1, context_1) {
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
    var core_1, projects_service_1, project_class_1, TasksListService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }
        ],
        execute: function () {
            TasksListService = (function () {
                function TasksListService(projectsService) {
                    this.projectsService = projectsService;
                    this.errorHandler = function (error) { return console.error('TaskListService error', error); };
                    this.tasks = [];
                    this.filter = {};
                    console.info("TasksListService:constructor");
                }
                TasksListService.prototype.getBackLog = function (url) {
                    console.info("TasksListService:getBackLog(url), filter", url, this.filter);
                    var filter_length = Object.keys(this.filter).length;
                    console.info("filter_length", filter_length);
                    var self = this;
                    var taskscount = 0;
                    var tasksRef = firebase.database().ref(url + "/backlog/");
                    tasksRef.off();
                    //retrun Promise to get the backLog
                    return new Promise(function (resolve, reject) {
                        tasksRef.orderByChild("sortnum").once('value')
                            .then(function (snapshot) {
                            self.tasks = []; // empty the list
                            snapshot.forEach(function (child) {
                                // checking if there's a filter and if this task match the condition
                                var tmpTask = self.convertObject(child.val(), child.getKey());
                                if (filter_length == 0 || tmpTask.project_id in self.filter) {
                                    self.tasks[taskscount] = tmpTask;
                                    taskscount++;
                                }
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
                        var _loop_1 = function (child) {
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
                                    self.updateTaskWJson(child);
                                    if (resolveCounter <= 0) {
                                        // when sortnumbers assigned, tasks array should be resorted according the new sortnumbers
                                        self.tasks.sort(function (a, b) { return a.sortnum == b.sortnum ? 0 : +(a.sortnum > b.sortnum) || -1; });
                                        resolve(true);
                                    }
                                })
                                    .catch(function (error) { return reject("Backlog sorting failed: {" + error + "}"); });
                            }
                            else {
                                resolveCounter--;
                                if (jsonData.length == 1)
                                    resolve(true); //if the only element is disable-section_header or just empty, then resolving immidiately
                            }
                        };
                        for (var _i = 0, jsonData_1 = jsonData; _i < jsonData_1.length; _i++) {
                            var child = jsonData_1[_i];
                            _loop_1(child);
                        }
                    });
                };
                TasksListService.prototype.convertObject = function (objectedResponse, id) {
                    //creating/inflating Project object
                    var project = new project_class_1.Project();
                    project = this.projectsService.getProject(objectedResponse.project);
                    //attachments count
                    var attachmentsNum = 0;
                    if (objectedResponse.attachments)
                        attachmentsNum = Object.keys(objectedResponse.attachments).length;
                    //subtasks count
                    var subtasksNum = 0;
                    if (objectedResponse.subtasks)
                        subtasksNum = Object.keys(objectedResponse.subtasks).length;
                    return {
                        id: id,
                        name: objectedResponse.name,
                        code: objectedResponse.code,
                        project: project.sname,
                        project_id: project.id,
                        project_color: project.color,
                        sortnum: objectedResponse.sortnum,
                        estimate: objectedResponse.estimate,
                        worked: objectedResponse.worked,
                        status: objectedResponse.status,
                        type: objectedResponse.type,
                        commentsNum: objectedResponse.commentsNum,
                        attachmentsNum: attachmentsNum,
                        subtasksNum: subtasksNum
                    };
                };
                TasksListService.prototype.updateTaskWJson = function (js) {
                    // updates service propetry tasks[] values
                    console.debug("TasksListService:updateTaskWJson (js: any)", js);
                    for (var i = 0; i < this.tasks.length; i++) {
                        if (this.tasks[i].id == js.id) {
                            this.tasks[i].type = js.type;
                            this.tasks[i].sortnum = js.sortnum;
                            return;
                        }
                    }
                };
                TasksListService.prototype.addToFilter = function (key, value) {
                    //add project ("id" : "short name") to filter object
                    console.info("TasksListService:addToFilter(key : string, value: string)", key, value);
                    if (!this.filter.hasOwnProperty(key)) {
                        this.filter[key] = value;
                        console.info("this.filter", this.filter);
                    }
                };
                TasksListService.prototype.removeFromFilter = function (key) {
                    //remove project ("id" : "short name") from filter object
                    console.info("TasksListService:removeFromFilter(key : string)", key);
                    if (this.filter.hasOwnProperty(key)) {
                        delete this.filter[key];
                        console.info("this.filter", this.filter);
                    }
                };
                return TasksListService;
            }());
            TasksListService = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [projects_service_1.ProjectsService])
            ], TasksListService);
            exports_1("TasksListService", TasksListService);
        }
    };
});
