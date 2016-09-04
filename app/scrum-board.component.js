System.register(['@angular/core', './tasks-list.service', './projects.service'], function(exports_1, context_1) {
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
    var core_1, tasks_list_service_1, projects_service_1;
    var ScrumBoard;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tasks_list_service_1_1) {
                tasks_list_service_1 = tasks_list_service_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            }],
        execute: function() {
            ScrumBoard = (function () {
                function ScrumBoard(tasksListService, projectsService) {
                    var _this = this;
                    this.tasksListService = tasksListService;
                    this.projectsService = projectsService;
                    this.userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
                    this.backLog = [];
                    this.bookmarks = [];
                    this.editableBookmark = {};
                    this.tasksListService.errorHandler = function (error) {
                        return window.alert('Oops! The server request failed.' + error);
                    };
                    progress_start("");
                    this.projectsService.loadProjects(this.userId)
                        .then(function () { return _this.tasksListService.getBackLog(_this.userId); })
                        .then(function () {
                        _this.backLog = _this.tasksListService.tasks;
                        _this.sprintLength = _this.tasksListService.sprintLength;
                        _this.backLogLength = _this.tasksListService.backLogLength;
                        console.info("tasks loaded", _this.backLog);
                        setTimeout(function () { return _this.rebuildSortable(); }, 1000);
                        progress_end();
                    })
                        .catch(function (error) { return console.error("error"); });
                }
                ScrumBoard.prototype.ngOnInit = function () {
                    //this.reload();
                };
                ScrumBoard.prototype.rebuildSortable = function () {
                    console.log('rebuildSortable called!');
                    $('.list-group-sortable-connected-exclude').sortable({
                        placeholderClass: 'list-group-item',
                        connectWith: '.connected',
                        items: ':not(.disabled)',
                    })
                        .bind('sortupdate', function (e, ui) {
                        //ui.item contains the current dragged element.
                        //Triggered when the user stopped sorting and the DOM position has changed.
                        progress_start("red");
                        console.log('element1: ' + ui.item.val());
                    });
                };
                ScrumBoard = __decorate([
                    core_1.Component({
                        selector: 'scrum-board',
                        template: "\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable-connected-exclude\">\n              <li class=\"list-group-item disabled\">Active sprint ( {{sprintLength}} issues )</li>\n              <template ngFor let-taskElement [ngForOf]=\"backLog\">\n                <li *ngIf=\"taskElement.type=='s'\" class=\"list-group-item\">\n                  <a [routerLink]=\"['/tasks', taskElement.id]\" [style.text-decoration]=\"taskElement.status==='resolved' ? 'line-through' : 'none'\">{{taskElement.name}}</a> \n                  <span class=\"label label-{{taskElement.project_color}}\">{{taskElement.project}}</span> \n                  <span class=\"badge\">{{taskElement.estimate}}h / 0h</span>\n                </li>\n              </template>\n          </ul>\n      </div>\n    </section>\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable-connected-exclude\">\n              <li class=\"list-group-item disabled\">Backlog ( {{backLogLength}} issues )</li>\n               <template ngFor let-taskElement [ngForOf]=\"backLog\">\n                <li *ngIf=\"taskElement.type=='b'\" class=\"list-group-item\">\n                  <a [routerLink]=\"['/tasks', taskElement.id]\" [style.text-decoration]=\"taskElement.status==='resolved' ? 'line-through' : 'none'\">{{taskElement.name}}</a> \n                  <span class=\"label label-{{taskElement.project_color}}\">{{taskElement.project}}</span> \n                  <span class=\"badge\">{{taskElement.estimate}}h / 0h</span>\n                </li>\n              </template>     \n          </ul>\n      </div>\n    </section>\n  ",
                    }), 
                    __metadata('design:paramtypes', [tasks_list_service_1.TasksListService, projects_service_1.ProjectsService])
                ], ScrumBoard);
                return ScrumBoard;
            }());
            exports_1("ScrumBoard", ScrumBoard);
        }
    }
});
