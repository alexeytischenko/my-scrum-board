System.register(["@angular/core", "./project.class"], function (exports_1, context_1) {
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
    var core_1, project_class_1, ProjectsService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }
        ],
        execute: function () {
            ProjectsService = (function () {
                function ProjectsService() {
                    this.projects = [];
                    this.colors = ['grey', 'orange', 'dark blue', 'blue', 'bright blue', 'red', 'maroon', 'green', 'celeste', 'yellow', 'olive', 'silver', 'black', 'magneta', 'purple', 'pink', 'steel', 'darkest blue', 'bright green', 'dark green', 'darkest green', 'light green', 'brown', 'dark brown', 'dark red', 'light red', 'neon'];
                    this.colorsMap = { 'grey': 'default', 'orange': 'warning', 'dark blue': 'primary', 'blue': 'info', 'bright blue': 'bluebright', 'red': 'danger', 'green': 'success', 'celeste': 'celeste', 'yellow': 'yellow', 'maroon': 'maroon', 'olive': 'olive', 'brown': 'brown', 'silver': 'silver', 'black': 'black', 'magneta': 'magneta', 'purple': 'purple', 'pink': 'pink', 'steel': 'steel', 'darkest blue': 'bluedarkest', 'bright green': 'greenbright', 'dark green': 'greendark', 'darkest green': 'greendarkest', 'light green': 'greenlight', 'dark brown': 'browndark', 'dark red': 'reddark', 'light red': 'redlight', 'neon': 'neon' };
                    this.errorHandler = function (error) { return console.error('ProjectsService error', error); };
                    console.info("ProjectsService:constructor");
                }
                ProjectsService.prototype.loadProjects = function (url) {
                    console.info("ProjectsService:loadProjects(url)", url);
                    var self = this;
                    var projectsRef = firebase.database().ref(url + "/projects/");
                    projectsRef.off();
                    return new Promise(function (resolve, reject) {
                        projectsRef.once('value', function (snapshot) {
                            self.projects = self.convert(snapshot.val());
                            if (self.projects.length > 0) {
                                resolve(true);
                            }
                            else
                                reject("Couldn't retrive projects list");
                        });
                    });
                };
                ProjectsService.prototype.getProject = function (project) {
                    //console.info ("ProjectsService:getProject(project)", project)  -- too many logs in console
                    var projectData = new project_class_1.Project();
                    this.projects.forEach(function (element) {
                        if (element.id == project)
                            projectData.fill(element.name, element.sname, element.color, element.id);
                    });
                    return projectData;
                };
                ProjectsService.prototype.saveProject = function (url, project) {
                    console.info("ProjectsService:saveProject(url: string, project : Project)", url, project);
                    var self = this;
                    var projectsRef = firebase.database().ref(url + "/projects/");
                    // generate sname if missing
                    if (project.sname.length == 0)
                        project.sname = project.generateShortName(project.name);
                    if (project.color.length == 0)
                        project.color = this.colorsMap.white;
                    // data to post
                    var postData = {
                        name: project.name,
                        sname: project.sname,
                        color: project.color
                    };
                    if (project.id.length > 0) {
                        return new Promise(function (resolve, reject) {
                            projectsRef.child(project.id).update(postData, function (error) {
                                if (error) {
                                    console.log('Synchronization failed');
                                    reject(error);
                                }
                                else {
                                    for (var i = 0; i < self.projects.length; i++) {
                                        if (self.projects[i].id == project.id) {
                                            self.projects[i].name = project.name;
                                            self.projects[i].sname = project.sname;
                                            self.projects[i].color = project.color;
                                        }
                                    }
                                    resolve(project.id);
                                }
                            });
                        });
                    }
                    else {
                        return new Promise(function (resolve, reject) {
                            var newprojectsRef = projectsRef.push();
                            newprojectsRef.set(postData, function (error) {
                                if (error) {
                                    console.log('Synchronization failed');
                                    reject(error);
                                }
                                else {
                                    self.projects.push({
                                        name: project.name,
                                        sname: project.sname,
                                        color: project.color,
                                        id: newprojectsRef.key.toString()
                                    });
                                    resolve(newprojectsRef.key.toString());
                                }
                            });
                        });
                    }
                };
                ProjectsService.prototype.convert = function (objectedResponse) {
                    return Object.keys(objectedResponse)
                        .map(function (id) { return ({
                        id: id,
                        name: objectedResponse[id].name,
                        sname: objectedResponse[id].sname,
                        color: objectedResponse[id].color
                    }); });
                };
                return ProjectsService;
            }());
            ProjectsService = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [])
            ], ProjectsService);
            exports_1("ProjectsService", ProjectsService);
        }
    };
});
