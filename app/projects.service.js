System.register(['@angular/core', './project.class'], function(exports_1, context_1) {
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
    var core_1, project_class_1;
    var ProjectsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            }],
        execute: function() {
            ProjectsService = (function () {
                function ProjectsService() {
                    this.projects = [];
                    this.colors = ['white', 'orange', 'dark blue', 'blue', 'red', 'green'];
                    this.colorsMap = { 'white': 'default', 'orange': 'warning', 'dark blue': 'primary', 'blue': 'info', 'red': 'danger', 'green': 'success' };
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
                    console.info("ProjectsService:getProject(project)", project);
                    var projectData = new project_class_1.Project();
                    this.projects.forEach(function (element) {
                        if (element.id == project)
                            projectData.fill(element.name, element.sname, element.color, element.id);
                    });
                    return projectData;
                };
                ProjectsService.prototype.addProject = function (url, newProject) {
                    console.info("ProjectsService:addProject(url: string, newProject : Project)", url, newProject);
                    var self = this;
                    var projectsRef = firebase.database().ref(url + "/projects/");
                    var postData = {
                        name: newProject.name,
                        sname: newProject.sname,
                        color: newProject.color
                    };
                    return new Promise(function (resolve, reject) {
                        var newprojectsRef = projectsRef.push();
                        newprojectsRef.set(postData, function (error) {
                            if (error) {
                                console.log('Synchronization failed');
                                reject(error);
                            }
                            else {
                                self.projects.push({
                                    name: newProject.name,
                                    sname: newProject.sname,
                                    color: newProject.color,
                                    id: newprojectsRef.key.toString()
                                });
                                resolve(newprojectsRef.key.toString());
                            }
                        });
                    });
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
                ProjectsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ProjectsService);
                return ProjectsService;
            }());
            exports_1("ProjectsService", ProjectsService);
        }
    }
});
