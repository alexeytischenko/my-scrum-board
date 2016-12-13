System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var TaskService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            TaskService = (function () {
                function TaskService() {
                    this.errorHandler = function (error) { return console.error('TaskService error', error); };
                    this.baseUrl = 'https://myscrum-f606c.firebaseio.com';
                    this.taskSatuses = ['idle', 'in progress', 'review', 'resolved'];
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
                                resolve(true);
                            }
                            else
                                reject("Couldn't get task data");
                        });
                    });
                };
                TaskService.prototype.saveTask = function (url, task) {
                    console.info("TaskService:saveTask(url: string, task)", url, task);
                    var postData;
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/");
                    if (task.id == -1) {
                        //new task properties
                        return new Promise(function (resolve, reject) {
                            self.getMaxCodeNum(url)
                                .catch(function (error) { return reject(error); })
                                .then(function (maxnum) {
                                console.error("maxnum", maxnum);
                                var newmaxnum = maxnum.code + 1;
                                postData = {
                                    name: task.name,
                                    estimate: task.estimate,
                                    commentsNum: 0,
                                    sortnum: Date.now(),
                                    status: task.status,
                                    type: "b",
                                    code: newmaxnum,
                                    description: task.description,
                                    project: task.project,
                                    updated: Date.now(),
                                    created: Date.now()
                                };
                                var newtaskRef = taskRef.push();
                                newtaskRef.set(postData, function (error) {
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        console.log("new task", postData);
                                        console.log("newtaskRef", newtaskRef.key.toString());
                                        resolve(newtaskRef.key.toString());
                                    }
                                });
                            });
                        });
                    }
                    else {
                        //existing task properties
                        postData = {
                            name: task.name,
                            estimate: task.estimate,
                            commentsNum: task.commentsNum,
                            status: task.status,
                            description: task.description,
                            project: task.project,
                            updated: Date.now()
                        };
                        return new Promise(function (resolve, reject) {
                            taskRef.child(task.id).update(postData, function (error) {
                                if (error) {
                                    console.error('Update failed');
                                    reject(error);
                                }
                                else {
                                    resolve(true);
                                }
                            });
                        });
                    }
                };
                TaskService.prototype.removeTask = function (url, taskId) {
                    var self = this;
                    var taskRef = firebase.database().ref(url + "/backlog/" + taskId);
                    console.log("taskRef", url + "/backlog/" + taskId);
                    //removing task
                    return new Promise(function (resolve, reject) {
                        taskRef.remove(function (error) {
                            if (error)
                                reject(error);
                            resolve(true);
                        })
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
                TaskService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], TaskService);
                return TaskService;
            }());
            exports_1("TaskService", TaskService);
        }
    }
});
