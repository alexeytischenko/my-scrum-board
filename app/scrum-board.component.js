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
                        console.error('Backlog component (tasksListService) error! ' + error);
                        window.alert('An error occurred while processing this page! Try again later.');
                    };
                    //load projects into property of the ProjectsService then loads list of tasks into tasksListService tasks property 
                    progress_start("");
                    this.projectsService.loadProjects(this.userId)
                        .then(function () { return _this.tasksListService.getBackLog(_this.userId); }) //, error => console.error("Getting projects list error:", error)
                        .then(function () { return _this.backLog = _this.tasksListService.tasks; })
                        .catch(function (error) { return _this.tasksListService.errorHandler(error); })
                        .then(function () {
                        //finally / default     
                        setTimeout(function () { return _this.rebuildSortable(); }, 1000);
                        progress_end();
                    });
                }
                ScrumBoard.prototype.rebuildSortable = function () {
                    var _this = this;
                    console.log('rebuildSortable called!');
                    $('.list-group-sortable').sortable({
                        placeholderClass: 'list-group-item',
                        cursor: "move",
                        //cancel: ".disabled",
                        connectWith: '.connected',
                        items: ':not(a, .disabled, .label, .badge)',
                    })
                        .disableSelection();
                    //sprint block events listner
                    $('#sprnt')
                        .on('sortupdate', function (e, ui) {
                        //triggered if sprint section is updated
                        progress_start("red");
                        //call resortBackLog method to update tasks list
                        _this.tasksListService.resortBackLog(_this.userId, _this.prepareJSON("s", 'sprnt'))
                            .catch(function (error) { return _this.tasksListService.errorHandler(error); })
                            .then(function () {
                            progress_end();
                            _this.countDomSizes("s");
                            console.log("s");
                        });
                    });
                    //backlog block events listner
                    $('#bklg')
                        .on('sortupdate', function (e, ui) {
                        //triggered if backlog section is updated
                        progress_start("red");
                        //call resortBackLog method to update tasks list
                        _this.tasksListService.resortBackLog(_this.userId, _this.prepareJSON("b", 'bklg'))
                            .catch(function (error) { return _this.tasksListService.errorHandler(error); })
                            .then(function () {
                            progress_end();
                            console.log("b");
                            _this.countDomSizes("b");
                        });
                    });
                    this.countDomSizes("s");
                    this.countDomSizes("b");
                };
                ScrumBoard.prototype.prepareJSON = function (recordType, domNode) {
                    //prepare JSON for UPDATE sortnum and type (active sprint / backlog) after resort of the elements
                    var updatedData = [];
                    $('#' + domNode + ' li').each(function (index) {
                        updatedData[index] = {
                            "id": this.id,
                            "sortnum": index,
                            "type": recordType
                        };
                    });
                    return updatedData;
                };
                ScrumBoard.prototype.countDomSizes = function (tp) {
                    //updates current values   
                    if (tp === "s") {
                        var sl_1 = 0;
                        $('#sprnt li').each(function (index) {
                            if (index > 0)
                                sl_1++;
                        });
                        this.sprintLength = sl_1;
                    }
                    else {
                        var bll_1 = 0;
                        $('#bklg li').each(function (index) {
                            if (index > 0)
                                bll_1++;
                        });
                        console.info("backLogLength", bll_1);
                        this.backLogLength = bll_1;
                    }
                };
                ScrumBoard = __decorate([
                    core_1.Component({
                        selector: 'scrum-board',
                        template: "\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable connected\" id=\"sprnt\">\n              <li class=\"list-group-item disabled\">Active sprint ( {{sprintLength}} issues )</li>\n              <template ngFor let-taskElement [ngForOf]=\"backLog\">\n                <li *ngIf=\"taskElement.type=='s'\" class=\"list-group-item\" id=\"{{taskElement.id}}\">\n                  <a [routerLink]=\"['/tasks', taskElement.id]\" [style.text-decoration]=\"taskElement.status==='resolved' ? 'line-through' : 'none'\">{{taskElement.name}}</a> \n                  <span class=\"label label-{{taskElement.project_color}}\">{{taskElement.project}} - {{taskElement.id_in_project}}</span> \n                  <span class=\"badge\">{{taskElement.estimate}}h / 0h</span>\n                </li>\n              </template>\n   \n          </ul>\n      </div>\n    </section>\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable connected\" id=\"bklg\">\n              <li style=\"margin-top:20px;\" class=\"list-group-item disabled\">Backlog ( {{backLogLength}} issues )</li>\n               <template ngFor let-taskElement [ngForOf]=\"backLog\">\n                <li *ngIf=\"taskElement.type=='b'\" class=\"list-group-item\" id=\"{{taskElement.id}}\">\n                  <a [routerLink]=\"['/tasks', taskElement.id]\" [style.text-decoration]=\"taskElement.status==='resolved' ? 'line-through' : 'none'\">{{taskElement.name}}</a> \n                  <span class=\"label label-{{taskElement.project_color}}\">{{taskElement.project}} - {{taskElement.id_in_project}}</span> \n                  <span class=\"badge\">{{taskElement.estimate}}h / 0h</span>\n                </li>\n              </template>  \n          </ul>\n      </div>\n    </section>\n  ",
                        styles: ["\n    .list-group-item {cursor: move;}\n    .list-group-item:hover {background: #e9e9e9;}\n  "]
                    }), 
                    __metadata('design:paramtypes', [tasks_list_service_1.TasksListService, projects_service_1.ProjectsService])
                ], ScrumBoard);
                return ScrumBoard;
            }());
            exports_1("ScrumBoard", ScrumBoard);
        }
    }
});
