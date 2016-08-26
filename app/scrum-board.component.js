System.register(['@angular/core', './task.service'], function(exports_1, context_1) {
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
    var core_1, task_service_1;
    var ScrumBoard;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            }],
        execute: function() {
            ScrumBoard = (function () {
                function ScrumBoard(taskService) {
                    this.taskService = taskService;
                    this.sprint = [];
                    this.backLog = [];
                    this.bookmarks = [];
                    this.editableBookmark = {};
                    this.taskService.errorHandler = function (error) {
                        return window.alert('Oops! The server request failed.');
                    };
                    this.reload();
                }
                ScrumBoard.prototype.clear = function () {
                    this.editableBookmark = {};
                };
                ScrumBoard.prototype.edit = function (bookmark) {
                    this.editableBookmark = Object.assign({}, bookmark);
                };
                ScrumBoard.prototype.remove = function (bookmark) {
                    // this.bookmarkService.removeBookmark(bookmark)
                    //   .then(() => this.reload());
                };
                ScrumBoard.prototype.save = function (bookmark) {
                    // if (bookmark.id) {
                    //   this.bookmarkService.updateBookmark(bookmark)
                    //     .then(() => this.reload());      
                    // } else {
                    //   this.bookmarkService.addBookmark(bookmark)
                    //     .then(() => this.reload());
                    // }
                    // this.clear();
                };
                ScrumBoard.prototype.reload = function () {
                    var _this = this;
                    var self = this;
                    progress_start("");
                    var backLogRef = firebase.database().ref('/backlog/mSmxxvKkt4ei6nL80Krmt9R0m983');
                    backLogRef.off();
                    backLogRef.on('value', function (snapshot) { return _this.backLog = _this.convert(snapshot.val()); });
                    var sprintRef = firebase.database().ref('/sprint/mSmxxvKkt4ei6nL80Krmt9R0m983');
                    sprintRef.off();
                    sprintRef.on('value', function (snapshot) {
                        self.sprint = self.convert(snapshot.val());
                        progress_end();
                    });
                    setTimeout(function () { return _this.rebuildSortable(); }, 1000);
                    // this.taskService.getBackLog()
                    //    .then(function(tasks) { 
                    //       self.backLog = tasks;
                    //       setTimeout(() => self.rebuildSortable(), 1000);
                    // });
                    // this.taskService.getSprint()
                    //    .then(function(tasks) { 
                    //       self.sprint = tasks;
                    //       setTimeout(() => self.rebuildSortable(), 1000);
                    // });
                };
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
                ScrumBoard.prototype.convert = function (objectedResponse) {
                    return Object.keys(objectedResponse)
                        .map(function (id) { return ({
                        id: id,
                        name: objectedResponse[id].name,
                        project: objectedResponse[id].project,
                        sortnum: objectedResponse[id].sortnum,
                        estimate: objectedResponse[id].estimate,
                        status: objectedResponse[id].status
                    }); });
                    // .sort((a, b) => a.name.localeCompare(b.name));
                };
                ScrumBoard = __decorate([
                    core_1.Component({
                        selector: 'scrum-board',
                        template: "\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable-connected-exclude\">\n              <li class=\"list-group-item disabled\">Active sprint ({{sprint.length}} issues)</li>\n              <li *ngFor=\"let taskElement of sprint\" class=\"list-group-item\">\n                <a [routerLink]=\"['/tasks', taskElement.id]\" [style.text-decoration]=\"taskElement.status==='resolved' ? 'line-through' : 'none'\">{{taskElement.name}}</a> \n                <span class=\"label label-default\">{{taskElement.project}}</span> \n                <span class=\"badge\">{{taskElement.estimate}}h</span>\n              </li>\n          </ul>\n      </div>\n    </section>\n    <section>\n      <div class=\"row\">\n          <ul class=\"list-group list-group-sortable-connected-exclude\">\n              <li class=\"list-group-item disabled\">Backlog ({{backLog.length}} issues)</li>\n              <li class=\"list-group-item\" *ngFor=\"let taskElement of backLog\">\n                {{taskElement.name}} \n                <span class=\"label label-default\">{{taskElement.project}}</span> \n                <span class=\"badge\">{{taskElement.estimate}}h</span>\n              </li>\n          </ul>\n      </div>\n    </section>\n  ",
                    }), 
                    __metadata('design:paramtypes', [task_service_1.TaskService])
                ], ScrumBoard);
                return ScrumBoard;
            }());
            exports_1("ScrumBoard", ScrumBoard);
        }
    }
});
