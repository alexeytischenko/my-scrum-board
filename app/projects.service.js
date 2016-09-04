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
    var ProjectsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ProjectsService = (function () {
                function ProjectsService() {
                    this.projects = [];
                    this.errorHandler = function (error) { return console.error('ProjectsService error', error); };
                }
                ProjectsService.prototype.loadProjects = function (url) {
                    var self = this;
                    var projectsRef = firebase.database().ref(url + "/projects/");
                    projectsRef.off();
                    return new Promise(function (resolve, reject) {
                        projectsRef.once('value', function (snapshot) {
                            self.projects = self.convert(snapshot.val());
                            console.log("projects", self.projects);
                            resolve(true);
                        });
                    });
                };
                // loadProjects(url) {
                //   var projectsRef = firebase.database().ref(`${url}/projects/`);
                //   projectsRef.off();
                //   projectsRef.on('value', snapshot => this.projects = this.convert(snapshot.val())); 
                // }
                ProjectsService.prototype.convert = function (objectedResponse) {
                    return Object.keys(objectedResponse)
                        .map(function (id) { return ({
                        id: id,
                        name: objectedResponse[id].name,
                        sname: objectedResponse[id].sname,
                        color: objectedResponse[id].color
                    }); });
                };
                ProjectsService.prototype.getColor = function (project) {
                    var color;
                    this.projects.forEach(function (element) {
                        if (element.id == project)
                            color = element.color;
                    });
                    return color;
                };
                ProjectsService.prototype.getSName = function (project) {
                    var sname = "";
                    console.log("pr", project);
                    this.projects.forEach(function (element) {
                        if (element.id == project)
                            sname = element.sname;
                        else
                            console.log("n", element);
                    });
                    return sname;
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
