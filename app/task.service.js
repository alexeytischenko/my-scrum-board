System.register(["@angular/core", "./attachments.service", "./common.service"], function (exports_1, context_1) {
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
    var core_1, attachments_service_1, common_service_1, TaskService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (attachments_service_1_1) {
                attachments_service_1 = attachments_service_1_1;
            },
            function (common_service_1_1) {
                common_service_1 = common_service_1_1;
            }
        ],
        execute: function () {
            TaskService = (function () {
                function TaskService(attachmentsService, commonService) {
                    this.attachmentsService = attachmentsService;
                    this.commonService = commonService;
                    this.errorHandler = function (error) { return console.error('TaskService error', error); };
                    this.baseUrl = 'https://myscrum-f606c.firebaseio.com';
                    this.taskSatuses = ['idle', 'in progress', 'review', 'skipped', 'resolved'];
                    this.openComments = [];
                    this.openLogs = [];
                }
                TaskService.prototype.getTask = function (url, id) {
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/").child(id);
                    taskRef.off();
                    return new Promise(function (resolve, reject) {
                        taskRef.once('value', function (snapshot) {
                            if (snapshot.exists()) {
                                self.task = snapshot.val();
                                self.task.id = id;
                                self.task.subtasks = self.commonService.getArrayFromObject(self.task.subtasks);
                                self.task.attachments = self.commonService.getArrayFromObject(self.task.attachments);
                                self.attachmentsService.getDownloadURLs(url, id, self.task.attachments)
                                    .then(function (attach) {
                                    self.task.attachments = attach;
                                    resolve(true);
                                });
                            }
                            else
                                reject("Couldn't get task data");
                        });
                    });
                };
                TaskService.prototype.getAnyTask = function (url, id) {
                    // get parentTask for taskEdit component
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/").child(id);
                    taskRef.off();
                    var tmpTask;
                    return new Promise(function (resolve, reject) {
                        taskRef.once('value', function (snapshot) {
                            if (snapshot.exists()) {
                                tmpTask = snapshot.val();
                                tmpTask.id = id;
                                resolve(tmpTask);
                            }
                            else
                                reject("Couldn't get task name");
                        });
                    });
                };
                TaskService.prototype.saveTask = function (url, task) {
                    console.debug("TaskService:saveTask(url: string, task)", url, task);
                    var postData;
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/");
                    if (task.id == -1) {
                        //new task properties
                        return new Promise(function (resolve, reject) {
                            self.getMaxCodeNum(url)
                                .catch(function (error) { return reject(error); })
                                .then(function (maxnum) {
                                var newmaxnum = maxnum.code + 1;
                                postData = {
                                    name: task.name ? task.name : "",
                                    estimate: task.estimate ? task.estimate : 0,
                                    worked: 0,
                                    commentsNum: 0,
                                    sortnum: 0,
                                    status: task.status ? task.status : "idle",
                                    parent: (task.parent) ? task.parent : "",
                                    type: (task.parent) ? "i" : "b",
                                    code: newmaxnum,
                                    description: task.description ? task.description : "",
                                    project: task.project ? task.project : "",
                                    updated: Date.now(),
                                    created: Date.now()
                                };
                                var newtaskRef = taskRef.push();
                                newtaskRef.set(postData, function (error) {
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        if (task.parent) {
                                            self.savePropery(url, task.parent + "/subtasks", (_a = {},
                                                _a[newtaskRef.key.toString()] = {
                                                    name: task.name,
                                                    estimate: task.estimate,
                                                    project: task.project,
                                                    status: task.status,
                                                    worked: 0
                                                },
                                                _a));
                                        }
                                        resolve(newtaskRef.key.toString());
                                    }
                                    var _a;
                                });
                            });
                        });
                    }
                    else {
                        //existing task properties
                        postData = {
                            name: task.name ? task.name : "",
                            estimate: task.estimate ? task.estimate : 0,
                            status: task.status ? task.status : "idle",
                            description: task.description ? task.description : "",
                            project: task.project ? task.project : "",
                            updated: Date.now()
                        };
                        return new Promise(function (resolve, reject) {
                            taskRef.child(task.id).update(postData, function (error) {
                                if (error) {
                                    console.error('Update failed');
                                    reject(error);
                                }
                                else {
                                    if (task.parent) {
                                        self.savePropery(url, task.parent + "/subtasks", (_a = {},
                                            _a[task.id] = {
                                                name: task.name,
                                                estimate: task.estimate,
                                                project: task.project,
                                                status: task.status,
                                                worked: task.worked
                                            },
                                            _a));
                                    }
                                    resolve(true);
                                }
                                var _a;
                            });
                        });
                    }
                };
                TaskService.prototype.savePropery = function (url, taskid, postData) {
                    console.debug("TaskService:savePropery(url: string, taskid: string, postData : any)", url, taskid, postData);
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/");
                    return new Promise(function (resolve, reject) {
                        taskRef.child(taskid).update(postData, function (error) {
                            if (error) {
                                console.error('Update failed');
                                reject(error);
                            }
                            else {
                                resolve(true);
                            }
                        });
                    });
                };
                TaskService.prototype.removeTask = function (url, taskId) {
                    // remove task
                    console.debug("TaskService:removeTask(url, taskId)", url, taskId);
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/" + taskId);
                    var wlRef = firebase.database().ref(url + "/worklog/" + taskId);
                    var comRef = firebase.database().ref(url + "/comments/" + taskId);
                    //removing task
                    return new Promise(function (resolve, reject) {
                        taskRef.remove()
                            .then(function () { return wlRef.remove(); }) // remove worklogs
                            .then(function () { return comRef.remove(); }) // remove comments
                            .then(function () { return self.attachmentsService.removeAllAttachments(url, taskId, self.task.attachments); }) // remove attachments
                            .then(function () { return self.removeSubTasks(url, self.task); })
                            .then(function () { return resolve(true); })
                            .catch(function (error) { return reject(error); });
                    });
                };
                TaskService.prototype.getMaxCodeNum = function (url) {
                    var tasksRef = firebase.database().ref(url + "/backlog/");
                    return new Promise(function (resolve, reject) {
                        tasksRef.orderByChild("code").limitToLast(1).once('value', function (snapshot) {
                            var maxnum = 0;
                            snapshot.forEach(function (child) {
                                maxnum = child.val();
                            });
                            resolve(maxnum);
                        });
                    });
                };
                TaskService.prototype.removeSubTasks = function (url, task) {
                    // remove subtasks OR parent subtask pointer
                    console.debug("TaskService:removeSubTasks(url, task)", url, task);
                    var tasksRef = firebase.database().ref(url + "/backlog/");
                    var self = this;
                    return new Promise(function (resolve, reject) {
                        if (task.type == "i") {
                            //it is a subtask - update parent
                            tasksRef.child(task.parent + "/subtasks/" + task.id).remove()
                                .then(function () { return resolve(true); })
                                .catch(function (error) { return reject(error); });
                        }
                        else {
                            //it is not a subtask - check if this task has subtasks - delete them
                            if (task.subtasks && task.subtasks.length > 0) {
                                var resolveCounter_1 = task.subtasks.length;
                                task.subtasks.forEach(function (element) {
                                    var taskRef = firebase.database().ref(url + "/backlog/" + element.id);
                                    var wlRef = firebase.database().ref(url + "/worklog/" + element.id);
                                    var comRef = firebase.database().ref(url + "/comments/" + element.id);
                                    self.attachmentsService.getAttachments(url, element.id)
                                        .then(function (attachments) { return self.attachmentsService.removeAllAttachments(url, element.id, attachments); }) // remove attachments
                                        .then(function () { return taskRef.remove(); })
                                        .then(function () { return wlRef.remove(); }) // remove worklogs
                                        .then(function () { return comRef.remove(); }) // remove comments
                                        .then(function () {
                                        resolveCounter_1--;
                                        if (resolveCounter_1 <= 0) {
                                            resolve(true);
                                        }
                                    })
                                        .catch(function (error) { return reject("Subtask delete failed: {" + error + "}"); });
                                });
                            }
                            else
                                resolve(true);
                        }
                    });
                };
                TaskService.prototype.ifOpenComments = function (taskId) {
                    //check if show comments in curnet task
                    if (this.openComments.indexOf(taskId) !== -1)
                        return true;
                    else
                        return false;
                };
                TaskService.prototype.removeFromOpenComments = function (taskId) {
                    //removes element from check array
                    var i = this.openComments.indexOf(taskId);
                    if (i > -1)
                        this.openComments.splice(i, 1);
                    console.log("this.openComments remove", this.openComments);
                };
                TaskService.prototype.addToOpenComments = function (taskId) {
                    //adds task to check array
                    if (this.openComments.indexOf(taskId) == -1)
                        this.openComments.push(taskId);
                    console.log("this.openComments add", this.openComments);
                };
                TaskService.prototype.ifOpenLogs = function (taskId) {
                    //check if show logs in curnet task
                    if (this.openLogs.indexOf(taskId) !== -1)
                        return true;
                    else
                        return false;
                };
                TaskService.prototype.removeFromOpenLogs = function (taskId) {
                    //removes element from check array
                    var i = this.openLogs.indexOf(taskId);
                    if (i > -1)
                        this.openLogs.splice(i, 1);
                    console.log("this.openLogs remove", this.openLogs);
                };
                TaskService.prototype.addToOpenLogs = function (taskId) {
                    //adds task to check array
                    if (this.openLogs.indexOf(taskId) == -1)
                        this.openLogs.push(taskId);
                    console.log("this.openLogs add", this.openLogs);
                };
                return TaskService;
            }());
            TaskService = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [attachments_service_1.AttachmentsService,
                    common_service_1.CommonService])
            ], TaskService);
            exports_1("TaskService", TaskService);
        }
    };
});
